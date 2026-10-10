> **SUPERSEDED.** Stack changed to Next.js + Prisma + Postgres. See `/vision.md` and `/docs/decisions.md`. Kept for reference only.

# Rhythm Art Gallery — High-Level Design (HLD) Report

Companion documents: `requirements.md` (functional requirements, IDs such as `BE-CART-04`) and `LLD report.md` (classes, schema, APIs, concurrency details).

---

## 1. Purpose and scope

This report describes the overall architecture of the Rhythm Art Gallery boutique website: the main components, how they talk to each other, where data lives, how the system is secured, and how it scales. It is the "big picture" a developer or coding agent reads before the LLD.

**In scope:** customer website, admin panel, backend API, database, cache, file storage, payment gateway, email/SMS, deployment, security, scalability.

**Design goals**

| Goal | What it means here |
|---|---|
| Secure | HTTPS everywhere, hashed passwords, no card data on our servers, OWASP Top 10 covered, Amazon/Flipkart-style account and payment protections |
| Correct with money | INR amounts in exact decimals, server-side price/tax calculation, no overselling, idempotent payments |
| Thread-safe | Safe under many simultaneous shoppers (stock, coupons, invoice numbers, payments) |
| Scalable | Stateless API that can run as many copies as needed behind a load balancer |
| Simple to start | Runs as one Spring Boot app + one database on day one; grows without a rewrite |

---

## 2. Architecture overview

Style: **modular monolith** (one Spring Boot application split into clear modules) behind a load balancer. This is the right size for a boutique: easy to build and deploy, and each module can later be pulled out into its own service if traffic demands it.

```
                    ┌──────────────────────────────┐
  Customers  ──────▶│  CDN + WAF (Cloudflare)      │  TLS 1.2/1.3, DDoS & bot protection,
  Admins            │  caches images & static JS   │  rate limiting, HSTS
                    └──────────────┬───────────────┘
                                   │ HTTPS
              ┌────────────────────┴──────────────────────┐
              │                                           │
   ┌──────────▼──────────┐                   ┌────────────▼────────────┐
   │ Frontend (SPA)      │                   │ Load balancer / Nginx   │
   │ static build on     │   REST /api/v1    │ TLS termination,        │
   │ CDN / object store  │ ─────────────────▶│ security headers        │
   └─────────────────────┘                   └────────────┬────────────┘
                                                          │
                                  ┌───────────────────────┼───────────────────────┐
                                  │                       │                       │
                         ┌────────▼───────┐      ┌────────▼───────┐      ┌────────▼───────┐
                         │ API instance 1 │      │ API instance 2 │ ...  │ API instance N │
                         │ Spring Boot    │      │ (stateless)    │      │                │
                         └───┬────┬────┬──┘      └────────────────┘      └────────────────┘
                             │    │    │
            ┌────────────────┘    │    └───────────────────┐
            │                     │                        │
   ┌────────▼────────┐   ┌────────▼────────┐     ┌─────────▼─────────┐
   │ PostgreSQL      │   │ Redis           │     │ Object storage     │
   │ primary + read  │   │ cache, sessions,│     │ (S3 / Cloudinary)  │
   │ replica         │   │ rate limits,    │     │ product images,    │
   └─────────────────┘   │ distributed lock│     │ invoice PDFs       │
                         └─────────────────┘     └────────────────────┘
            External: Razorpay (payments + webhooks) · Email (SES/SendGrid) · SMS/WhatsApp (MSG91) · Courier API (later)
```

### 2.1 Components

| Component | Technology (recommended) | Responsibility |
|---|---|---|
| Frontend | React + Vite + TypeScript (Angular/Vue acceptable) | Customer site and admin panel, calls the REST API |
| Edge | Cloudflare (or AWS CloudFront + AWS WAF) | HTTPS, CDN, WAF, DDoS/bot protection |
| Reverse proxy | Nginx or cloud load balancer | TLS termination, routing, security headers, request size limits |
| Backend API | Java 21, Spring Boot 3, Spring Security, Spring Data JPA | All business logic |
| Database | PostgreSQL 16 | System of record (users, catalogue, orders, payments, invoices) |
| Cache | Redis 7 | Catalogue cache, rate-limit counters, refresh-token denylist, distributed locks |
| Search | PostgreSQL full-text search (v1); OpenSearch later if needed | Product search and suggestions |
| File storage | AWS S3 or Cloudinary | Product images, invoice PDFs (private bucket) |
| Payments | Razorpay (UPI, cards, net banking, wallets) | PCI-DSS-compliant hosted checkout |
| Messaging | Spring `@Async` + DB outbox table (v1); RabbitMQ/Kafka later | Emails, SMS, invoice generation off the request thread |
| Observability | Spring Actuator, Micrometer, Prometheus, Grafana, ELK/Loki | Metrics, logs, alerts |

### 2.2 Backend modules

| Module | Owns |
|---|---|
| `auth` | Registration, login, JWT/refresh tokens, password reset, OTP, roles |
| `user` | Profile, addresses |
| `catalog` | Categories, products, variants, images, search |
| `inventory` | Stock levels, reservations, low-stock alerts |
| `cart` | Guest and customer carts, coupons, pricing |
| `wishlist` | Wishlist items |
| `order` | Order placement, status lifecycle, cancellations, returns |
| `payment` | Gateway orders, verification, webhooks, refunds |
| `billing` | GST calculation, invoices, credit notes, PDFs |
| `shipping` | Shipping rules, pincode serviceability |
| `review` | Ratings and reviews |
| `notification` | Email/SMS templates and sending |
| `cms` | Banners, featured content, contact form, newsletter |
| `admin` / `report` | Admin dashboards, reports, CSV exports |
| `common` | Error handling, audit logging, money/tax utilities, security config |

Modules talk to each other through service interfaces only, never by reaching into another module's repositories. That keeps the later split into microservices straightforward.

---

## 3. Key flows

### 3.1 Guest browsing → login → purchase

```
Guest browses (public APIs, cached) → adds to cart (guest cart token)
  → clicks Checkout → redirected to Login
  → logs in → guest cart merged into customer cart
  → chooses address → reviews totals (server-calculated)
  → Place order: stock reserved, order = PENDING_PAYMENT
  → Razorpay checkout opens in the browser (card/UPI data never touches our server)
  → Browser returns payment IDs → server verifies HMAC signature
  → Razorpay webhook also confirms (idempotent)
  → order = CONFIRMED, stock committed, invoice generated async, email sent
```

### 3.2 Payment failure / abandonment

- Signature check fails or payment fails → order `PAYMENT_FAILED`, customer can retry.
- No payment within 15 minutes → scheduled job cancels the order and releases reserved stock.

### 3.3 Admin order handling

`CONFIRMED → PACKED → SHIPPED (courier + tracking no.) → DELIVERED`; each change is audited and triggers a customer notification.

---

## 4. Data architecture

- **PostgreSQL** is the single source of truth. All money is `NUMERIC(12,2)` in INR.
- **Orders snapshot** product name, price, tax rate and addresses, so edits to products never change past orders or invoices.
- **Redis** holds only rebuildable data (cache, counters, locks). Losing Redis slows the site down but loses nothing.
- **Images** are stored in object storage and served through the CDN in several sizes (thumbnail, card, zoom) as WebP.
- **Invoice PDFs** are stored in a **private** bucket and downloaded only through an authorised API call (or a short-lived signed URL).
- **Backups:** automated daily database snapshots + point-in-time recovery (7–30 days); bucket versioning for invoices.
- **Migrations:** Flyway, versioned SQL in the repository.

---

## 5. Security architecture

This section answers "can we have Amazon/Flipkart-style security?" The short answer is **yes for almost all of it**, because most of those protections come from standard Spring Security features, the payment gateway and the CDN rather than from custom code. Section 5.10 lists each feature with whether it is practical to implement.

### 5.1 HTTPS and transport security

- HTTPS only, TLS 1.2 minimum, TLS 1.3 preferred. Free certificates from Let's Encrypt or the CDN (auto-renewing).
- HTTP → HTTPS redirect on port 80; nothing served over plain HTTP.
- **HSTS** header: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, and submit the domain to the HSTS preload list.
- Traffic between the load balancer and API, and API to database/Redis, also encrypted (TLS) when running on separate machines.
- Cookies (refresh token) set with `Secure; HttpOnly; SameSite=Strict`.

### 5.2 Authentication

- **Passwords hashed** with **BCrypt (cost 12)** via Spring Security `PasswordEncoder` (Argon2id is an equally good choice). Plain passwords are never stored, logged or emailed.
- Password policy: minimum 8 characters, checked against a list of common/breached passwords.
- **Short-lived JWT access token** (15 minutes, kept in memory in the browser, not localStorage) + **refresh token** (7–30 days) in an HttpOnly cookie. Refresh tokens are **stored hashed (SHA-256)** in the database and **rotated** on every use; reuse of an old one revokes the whole family (theft detection).
- **OTP login / verification** by SMS or email (as on Flipkart): 6-digit code, hashed in Redis, 5-minute expiry, max 5 attempts.
- **Brute-force protection:** rate limit login by IP and by account; temporary lock after 5 failed attempts; CAPTCHA (Google reCAPTCHA v3 / Cloudflare Turnstile) after repeated failures and on register/forgot-password.
- **Password reset:** single-use random token, stored hashed, 15-minute expiry, all sessions revoked after reset.
- **Admin accounts:** mandatory two-factor authentication (TOTP app such as Google Authenticator), optional IP allowlist, separate admin URL.
- **Login alerts:** email the customer on login from a new device and on password/email/mobile change.
- Generic error messages ("Invalid email or password") so attackers can't discover which accounts exist.

### 5.3 Authorisation

- Role-based access: `CUSTOMER`, `ADMIN` (optionally `STAFF` with limited admin rights).
- Every customer resource is checked for ownership on the server (customers can only see their own orders, addresses, invoices). This prevents IDOR attacks, which are a common e-commerce flaw.
- Public IDs in URLs are order numbers / UUIDs, not sequential database IDs.

### 5.4 Secure payments

- **No card data ever reaches our servers.** Razorpay's hosted checkout collects card/UPI details, so the store stays in the lightest PCI-DSS scope (SAQ-A). This is exactly how most Indian stores, including large ones, accept payments.
- **Amount is decided on the server**, never trusted from the browser.
- **Signature verification:** the payment response and all webhooks are verified with HMAC-SHA256 using the Razorpay secret, compared in constant time.
- **Idempotency:** each Razorpay payment ID / webhook event ID is processed once (unique constraint), so retries and duplicate webhooks never double-confirm or double-refund.
- **3-D Secure / OTP** for cards and UPI PIN approvals are enforced by the gateway (RBI rules).
- **Card tokenisation** for "saved cards" is handled by Razorpay per RBI guidelines; we store nothing but the gateway's token reference.
- **Fraud controls:** Razorpay risk engine, COD limit per order and per customer, velocity checks (many orders/failed payments from one account or IP).
- Gateway secrets live in a secrets manager / environment variables, never in Git.

### 5.5 Application security (OWASP Top 10)

| Threat | Protection |
|---|---|
| SQL injection | JPA/parameterised queries only; no string-built SQL |
| XSS | React escapes output by default; server sanitises review/rich text (OWASP Java HTML Sanitizer); strict Content-Security-Policy |
| CSRF | Access token sent in `Authorization` header (not a cookie); refresh endpoint protected by `SameSite=Strict` cookie + CSRF token |
| Clickjacking | `X-Frame-Options: DENY` / CSP `frame-ancestors 'none'` |
| Broken access control | Ownership checks on every request; `@PreAuthorize` on admin endpoints; deny by default |
| Mass assignment | Separate request DTOs; never bind requests directly to entities |
| Insecure uploads | Admin-only uploads; check type by content (not extension), size limit, re-encode images, random file names, private bucket for PDFs |
| SSRF | Backend calls only allow-listed hosts (gateway, email, SMS) |
| Sensitive data exposure | DTOs never return password hashes, tokens or internal fields; PII masked in logs |
| Vulnerable dependencies | Dependabot/Renovate + OWASP Dependency-Check or Snyk in CI |
| Security misconfiguration | Actuator endpoints locked down; stack traces never returned to clients; default credentials removed |

**Security headers** (set by Nginx or Spring Security): `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options: DENY`.

**CORS:** only the site's own frontend origin is allowed.

### 5.6 Data protection and privacy

- Complies with India's **Digital Personal Data Protection Act 2023 (DPDP)**: consent at sign-up, privacy policy, ability to download and delete account data.
- Encryption at rest for the database, backups and buckets (cloud-managed keys).
- Sensitive columns (phone numbers, if desired) can be additionally encrypted with AES-256-GCM at application level.
- Minimal data: no card data, no Aadhaar/PAN unless legally needed.
- Log retention limits; PII masked in logs (`98******10`, `a***@gmail.com`).

### 5.7 Infrastructure security

- Database and Redis on a private network; not reachable from the internet.
- Least-privilege database user for the app (no DDL in production; migrations run with a separate user).
- Secrets in AWS Secrets Manager / Vault / environment variables injected at deploy time.
- Edge WAF with OWASP rule set, bot management and rate limits.
- OS and container images patched regularly; containers run as non-root.

### 5.8 Monitoring, audit and response

- Audit log of admin actions (price changes, refunds, order status changes, role changes) and security events (logins, failed logins, password resets).
- Alerts on spikes in failed logins, payment failures, 5xx errors and webhook signature failures.
- Incident runbook: rotate secrets, revoke sessions, restore from backup. India's CERT-In rules require reporting certain incidents within 6 hours.

### 5.9 Secure development

- Code review on every change; secrets scanning (GitHub secret scanning / gitleaks).
- Static analysis (SonarQube/SpotBugs + Find Security Bugs) and dependency scanning in CI.
- Optional: OWASP ZAP baseline scan against the staging site before release.

### 5.10 Can you implement these? (feasibility)

| Feature (as on Amazon/Flipkart) | Practical for this project? | How |
|---|---|---|
| HTTPS + HSTS | **Yes, easy** | Let's Encrypt or Cloudflare, Nginx/Spring config |
| Hashed passwords (BCrypt/Argon2) | **Yes, easy** | Built into Spring Security |
| JWT + rotating refresh tokens | **Yes, moderate** | Spring Security + small token service |
| OTP login / mobile verification | **Yes, moderate** | SMS provider (MSG91, Twilio); costs a few paise per SMS |
| CAPTCHA on login/register | **Yes, easy** | reCAPTCHA v3 or Cloudflare Turnstile (free) |
| Rate limiting & account lockout | **Yes, easy** | Bucket4j + Redis, or Cloudflare rules |
| 2FA for admins | **Yes, moderate** | TOTP library (e.g. `dev.samstevens.totp`) |
| Secure payments without storing cards | **Yes, easy** | Razorpay hosted checkout; PCI handled by Razorpay |
| Saved cards / one-click pay | **Yes, via gateway** | Razorpay tokenisation; we store no card data |
| Webhook signature + idempotency | **Yes, easy** | HMAC check + unique constraint |
| WAF & DDoS protection | **Yes, easy** | Cloudflare free/pro plan |
| Security headers & CSP | **Yes, easy** | Nginx/Spring config |
| New-device login alerts | **Yes, moderate** | Store device fingerprint per refresh-token family |
| Fraud scoring / risk engine | **Partly** | Rely on Razorpay's; build simple velocity rules ourselves |
| Encryption at rest | **Yes, easy** | Managed database/bucket setting |
| Full PCI-DSS Level 1 certification | **Not needed** | Only required if we store/process card data, which we don't |
| ML-based bot/fraud detection like Amazon | **Not practical now** | Use Cloudflare Bot Management and gateway risk tools instead |
| 24×7 security operations team | **Not practical now** | Use alerts + managed services |

---

## 6. Thread safety and concurrency (overview)

The LLD has the code-level detail. At the design level:

1. **Stateless API instances.** No user data is kept in server memory between requests, so any instance can serve any request and there is no shared mutable state inside the JVM.
2. **Database is the arbiter.** Correctness under concurrency comes from database transactions and constraints, not from Java locks (which only work inside one instance).
3. **Stock:** atomic conditional update `UPDATE ... SET available = available - :qty WHERE id = :id AND available >= :qty` inside the order transaction. Zero rows updated = out of stock. No overselling even with many instances.
4. **Optimistic locking** (`@Version`) on carts, orders and products, so two admins or two tabs can't silently overwrite each other.
5. **Unique constraints** for idempotency: payment ID, webhook event ID, invoice number, coupon usage per user, idempotency keys on "Place order".
6. **Invoice numbers:** a per-financial-year counter row updated with `SELECT ... FOR UPDATE` (or a database sequence), so numbers are gap-free and never duplicated.
7. **Scheduled jobs** (payment timeouts, cleanup) run on one instance at a time using ShedLock.
8. **Async work** (email, PDF) runs on bounded thread pools; services are stateless singletons with no mutable fields.

---

## 7. Scalability

| Layer | How it scales |
|---|---|
| Frontend | Static files on a CDN; effectively unlimited |
| Images | CDN-served, resized/WebP; lazy-loaded |
| API | Stateless → add more instances behind the load balancer (Kubernetes HPA or ECS auto-scaling on CPU/latency) |
| Reads | Redis cache for categories, product lists, product details, home page (TTL 5–10 min, evicted on admin edit); HTTP caching headers on public GETs |
| Database | Connection pooling (HikariCP), proper indexes, read replica for catalogue/search/report queries, primary for writes |
| Search | PostgreSQL full-text first; move to OpenSearch when the catalogue or traffic outgrows it |
| Background work | Async + outbox table; move to RabbitMQ/Kafka when volume grows |
| Sale spikes (Diwali, wedding season) | Pre-scale instances, warm caches, CDN absorbs browse traffic, queue order emails |
| Later | Split hot modules (catalog, order, payment) into separate services sharing nothing but events |

**Capacity targets for v1:** 1,000 concurrent users, 50 orders/minute peak, p95 API latency under 300 ms for catalogue reads and under 800 ms for order placement. Two small API instances + one managed PostgreSQL + one small Redis comfortably meet this.

---

## 8. Availability and reliability

- At least two API instances in different availability zones.
- Managed PostgreSQL with automatic failover (Multi-AZ).
- Health checks (`/actuator/health`) used by the load balancer.
- Graceful shutdown so in-flight orders complete.
- Retries with exponential backoff for email/SMS; circuit breaker (Resilience4j) around external calls.
- Payment state is always reconcilable: a daily job compares our payments with Razorpay's and flags mismatches.
- Target uptime 99.9%; RPO ≤ 5 minutes, RTO ≤ 1 hour.

---

## 9. Deployment

| Environment | Purpose |
|---|---|
| `dev` | Local: Docker Compose (PostgreSQL, Redis, MailHog), Razorpay test keys |
| `staging` | Same as production, test payment keys, seeded data |
| `prod` | Live site, live keys |

- **Containers:** backend packaged as a Docker image (non-root, distroless/temurin JRE).
- **Hosting options:** AWS (ECS Fargate/EKS + RDS + ElastiCache + S3 + CloudFront) or a simpler start on a single VPS/Render/Railway with managed PostgreSQL, then move to AWS as traffic grows.
- **CI/CD:** GitHub Actions — build, unit & integration tests, security scans, Docker build, deploy to staging, manual approval to production.
- **Configuration:** Spring profiles + environment variables; no secrets in the repository.

---

## 10. Technology summary

| Concern | Choice |
|---|---|
| Language / framework | Java 21, Spring Boot 3.x |
| Security | Spring Security 6, BCrypt/Argon2, JWT (jjwt or Nimbus), Bucket4j |
| Persistence | Spring Data JPA (Hibernate), PostgreSQL 16, Flyway |
| Cache / locks | Redis 7, Spring Cache, ShedLock |
| PDF | OpenPDF or Thymeleaf + Flying Saucer |
| Payments | Razorpay Java SDK |
| Testing | JUnit 5, Mockito, Testcontainers, REST Assured |
| Frontend | React 18 + TypeScript + Vite, React Router, TanStack Query, Tailwind CSS |
| Edge | Cloudflare (TLS, CDN, WAF) |
| Monitoring | Actuator, Micrometer, Prometheus, Grafana |

---

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Overselling during sales | Atomic stock update + reservations + expiry job |
| Payment marked paid without real payment | Server-side signature verification + webhook + daily reconciliation |
| Account takeover | BCrypt, rate limits, CAPTCHA, OTP, new-device alerts, admin 2FA |
| Data leak through API | Ownership checks, DTOs, security tests for IDOR |
| GST invoice errors | Central tax calculator with unit tests per state/rate case |
| Traffic spike slows site | CDN, Redis cache, auto-scaling, read replica |
