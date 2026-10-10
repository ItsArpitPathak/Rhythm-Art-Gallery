> **SUPERSEDED.** Stack changed to Next.js + Prisma + Postgres. See `vision.md` and `docs/decisions.md`. Kept for reference only.

# Rhythm Art Gallery — Low-Level Design (LLD) Report

Companion documents: `requirements.md` (what to build) and `HLD report.md` (architecture, security and scaling overview). This report covers how to build it: project structure, classes, database schema, API contracts, security configuration, concurrency handling and configuration files.

Stack: Java 21, Spring Boot 3.x, Spring Security 6, Spring Data JPA, PostgreSQL 16, Redis 7, Flyway, Razorpay. Frontend: React + TypeScript + Vite.

---

## 1. Repository layout

```
Rhythm Art Gallery website/
├── requirements.md
├── HLD report.md
├── LLD report.md
├── docker-compose.yml              # postgres, redis, mailhog for local dev
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/rhythmartgallery/
│       ├── RhythmArtGalleryApplication.java
│       ├── common/        # config, security, exceptions, money, audit, util
│       ├── auth/          # controller, service, token, otp
│       ├── user/          # profile, address
│       ├── catalog/       # category, product, variant, image, search
│       ├── inventory/
│       ├── cart/          # cart, coupon, pricing
│       ├── wishlist/
│       ├── order/
│       ├── payment/
│       ├── billing/       # tax, invoice, pdf, credit note
│       ├── shipping/
│       ├── review/
│       ├── notification/
│       ├── cms/
│       └── admin/         # admin controllers, reports
│   └── src/main/resources/
│       ├── application.yml, application-dev.yml, application-prod.yml
│       ├── db/migration/V1__init.sql ...
│       └── templates/ (email + invoice templates)
└── frontend/
    ├── package.json, vite.config.ts
    └── src/
        ├── api/           # axios client + typed API calls
        ├── auth/          # AuthContext, ProtectedRoute, AdminRoute
        ├── components/    # Header, Footer, ProductCard, MiniCart, Price ...
        ├── pages/         # Home, Category, Product, Search, Cart, Checkout, Login, Register, Account/*, Admin/*
        ├── hooks/, store/ (cart state), utils/formatINR.ts
        └── styles/        # theme tokens: floral / embroidery palette
```

Each backend module follows the same layering:

```
module/
├── web/        XxxController, request/response DTOs (records), mappers
├── service/    XxxService (interface) + XxxServiceImpl (@Service, @Transactional)
├── domain/     JPA entities, enums
└── repo/       Spring Data repositories
```

Rules: controllers never touch repositories; entities never leave the service layer (always mapped to DTOs); modules call each other only through service interfaces.

---

## 2. Database schema (PostgreSQL)

All tables have `id BIGSERIAL PK`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `updated_at TIMESTAMPTZ`. Money is `NUMERIC(12,2)` (INR). Mutable aggregate roots have `version INT NOT NULL DEFAULT 0` for optimistic locking.

### 2.1 Users and auth

```sql
CREATE TABLE users (
  id              BIGSERIAL PRIMARY KEY,
  public_id       UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  full_name       VARCHAR(120) NOT NULL,
  email           VARCHAR(254) NOT NULL UNIQUE,      -- stored lower-case
  mobile          VARCHAR(15)  UNIQUE,
  password_hash   VARCHAR(100) NOT NULL,             -- BCrypt/Argon2 hash, never plain text
  role            VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',  -- CUSTOMER | STAFF | ADMIN
  email_verified  BOOLEAN NOT NULL DEFAULT false,
  mobile_verified BOOLEAN NOT NULL DEFAULT false,
  mfa_secret_enc  VARCHAR(255),                      -- TOTP secret, AES-GCM encrypted (admins)
  failed_logins   INT NOT NULL DEFAULT 0,
  locked_until    TIMESTAMPTZ,
  status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  version         INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ
);

CREATE TABLE refresh_tokens (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id),
  family_id   UUID NOT NULL,                 -- rotation chain
  token_hash  CHAR(64) NOT NULL UNIQUE,      -- SHA-256 of the random token
  device_info VARCHAR(255), ip VARCHAR(45),
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at  TIMESTAMPTZ,
  replaced_by BIGINT REFERENCES refresh_tokens(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE password_reset_tokens (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id),
  token_hash CHAR(64) NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL, used_at TIMESTAMPTZ
);

CREATE TABLE addresses (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id),
  name VARCHAR(120) NOT NULL, phone VARCHAR(15) NOT NULL,
  line1 VARCHAR(200) NOT NULL, line2 VARCHAR(200), landmark VARCHAR(120),
  city VARCHAR(80) NOT NULL, state_code CHAR(2) NOT NULL, pincode CHAR(6) NOT NULL,
  is_default_shipping BOOLEAN NOT NULL DEFAULT false,
  is_default_billing  BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ
);
```

### 2.2 Catalogue and inventory

```sql
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY, parent_id BIGINT REFERENCES categories(id),
  name VARCHAR(80) NOT NULL, slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT, image_url VARCHAR(500), sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true, version INT NOT NULL DEFAULT 0, ...
);

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY, category_id BIGINT NOT NULL REFERENCES categories(id),
  name VARCHAR(160) NOT NULL, slug VARCHAR(180) NOT NULL UNIQUE, sku VARCHAR(40) NOT NULL UNIQUE,
  description TEXT, fabric VARCHAR(80), occasion VARCHAR(80), care_instructions TEXT,
  hsn_code VARCHAR(8) NOT NULL, gst_rate NUMERIC(4,2) NOT NULL,      -- e.g. 5.00, 12.00, 3.00
  base_price NUMERIC(12,2) NOT NULL CHECK (base_price >= 0),         -- MRP, GST-inclusive
  sale_price NUMERIC(12,2) CHECK (sale_price >= 0),
  featured BOOLEAN NOT NULL DEFAULT false, active BOOLEAN NOT NULL DEFAULT true,
  avg_rating NUMERIC(2,1) NOT NULL DEFAULT 0, review_count INT NOT NULL DEFAULT 0,
  sold_count INT NOT NULL DEFAULT 0,
  search_vector TSVECTOR,                                             -- full-text search
  version INT NOT NULL DEFAULT 0, ...
);
CREATE INDEX idx_products_category_active ON products(category_id, active);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

CREATE TABLE product_variants (
  id BIGSERIAL PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id),
  sku VARCHAR(50) NOT NULL UNIQUE, size VARCHAR(20), color VARCHAR(40),
  price_override NUMERIC(12,2),
  stock_on_hand  INT NOT NULL DEFAULT 0 CHECK (stock_on_hand >= 0),
  stock_reserved INT NOT NULL DEFAULT 0 CHECK (stock_reserved >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 3,
  CONSTRAINT chk_stock CHECK (stock_reserved <= stock_on_hand),
  version INT NOT NULL DEFAULT 0, ...
);

CREATE TABLE product_images (
  id BIGSERIAL PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id),
  url VARCHAR(500) NOT NULL, alt_text VARCHAR(200), sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE stock_reservations (
  id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL, variant_id BIGINT NOT NULL REFERENCES product_variants(id),
  quantity INT NOT NULL CHECK (quantity > 0), status VARCHAR(20) NOT NULL,  -- HELD | COMMITTED | RELEASED
  expires_at TIMESTAMPTZ NOT NULL, UNIQUE (order_id, variant_id)
);
```

### 2.3 Cart, wishlist, coupons

```sql
CREATE TABLE carts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE REFERENCES users(id),     -- null for guest
  guest_token UUID UNIQUE,                         -- null for customer
  coupon_code VARCHAR(30), version INT NOT NULL DEFAULT 0, expires_at TIMESTAMPTZ, ...
  CHECK (user_id IS NOT NULL OR guest_token IS NOT NULL)
);
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY, cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  variant_id BIGINT NOT NULL REFERENCES product_variants(id),
  quantity INT NOT NULL CHECK (quantity BETWEEN 1 AND 10),
  price_at_add NUMERIC(12,2) NOT NULL, UNIQUE (cart_id, variant_id)
);
CREATE TABLE wishlist_items (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id),
  product_id BIGINT NOT NULL REFERENCES products(id), UNIQUE (user_id, product_id)
);
CREATE TABLE coupons (
  id BIGSERIAL PRIMARY KEY, code VARCHAR(30) NOT NULL UNIQUE,
  type VARCHAR(10) NOT NULL,                      -- PERCENT | FLAT
  value NUMERIC(12,2) NOT NULL, max_discount NUMERIC(12,2), min_order_value NUMERIC(12,2),
  valid_from TIMESTAMPTZ, valid_to TIMESTAMPTZ,
  usage_limit INT, used_count INT NOT NULL DEFAULT 0, per_user_limit INT NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true, version INT NOT NULL DEFAULT 0
);
CREATE TABLE coupon_usages (
  id BIGSERIAL PRIMARY KEY, coupon_id BIGINT NOT NULL REFERENCES coupons(id),
  user_id BIGINT NOT NULL REFERENCES users(id), order_id BIGINT NOT NULL UNIQUE
);
```

### 2.4 Orders, payments, invoices

```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(20) NOT NULL UNIQUE,            -- RAG-2026-000123
  user_id BIGINT NOT NULL REFERENCES users(id),
  status VARCHAR(25) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,                  -- ONLINE | COD
  idempotency_key UUID NOT NULL,
  shipping_address JSONB NOT NULL, billing_address JSONB NOT NULL,   -- snapshots
  subtotal NUMERIC(12,2) NOT NULL, discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(12,2) NOT NULL DEFAULT 0, tax_total NUMERIC(12,2) NOT NULL,
  grand_total NUMERIC(12,2) NOT NULL, coupon_code VARCHAR(30),
  courier VARCHAR(60), tracking_number VARCHAR(60),
  payment_due_at TIMESTAMPTZ, placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INT NOT NULL DEFAULT 0, ...,
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX idx_orders_user ON orders(user_id, placed_at DESC);
CREATE INDEX idx_orders_status ON orders(status, placed_at);

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL REFERENCES orders(id),
  variant_id BIGINT NOT NULL, product_name VARCHAR(160) NOT NULL, variant_label VARCHAR(60),
  sku VARCHAR(50) NOT NULL, hsn_code VARCHAR(8) NOT NULL, gst_rate NUMERIC(4,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL, quantity INT NOT NULL,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0, line_total NUMERIC(12,2) NOT NULL
);

CREATE TABLE order_status_history (
  id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL REFERENCES orders(id),
  from_status VARCHAR(25), to_status VARCHAR(25) NOT NULL,
  changed_by BIGINT, note VARCHAR(255), changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL REFERENCES orders(id),
  gateway VARCHAR(20) NOT NULL DEFAULT 'RAZORPAY',
  gateway_order_id VARCHAR(40) NOT NULL UNIQUE,
  gateway_payment_id VARCHAR(40) UNIQUE,                -- idempotency
  amount NUMERIC(12,2) NOT NULL, currency CHAR(3) NOT NULL DEFAULT 'INR',
  status VARCHAR(20) NOT NULL,                           -- CREATED | CAPTURED | FAILED | REFUNDED
  method VARCHAR(20), failure_reason VARCHAR(255), version INT NOT NULL DEFAULT 0, ...
);

CREATE TABLE webhook_events (
  id BIGSERIAL PRIMARY KEY, provider VARCHAR(20) NOT NULL,
  event_id VARCHAR(80) NOT NULL, event_type VARCHAR(60) NOT NULL,
  payload JSONB NOT NULL, processed_at TIMESTAMPTZ,
  UNIQUE (provider, event_id)                            -- process each event once
);

CREATE TABLE refunds (
  id BIGSERIAL PRIMARY KEY, payment_id BIGINT NOT NULL REFERENCES payments(id),
  gateway_refund_id VARCHAR(40) UNIQUE, amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) NOT NULL, reason VARCHAR(255), created_by BIGINT, ...
);

CREATE TABLE invoice_sequences (
  financial_year CHAR(7) PRIMARY KEY,                    -- '2026-27'
  last_number INT NOT NULL DEFAULT 0
);
CREATE TABLE invoices (
  id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL UNIQUE REFERENCES orders(id),
  invoice_number VARCHAR(25) NOT NULL UNIQUE,            -- RAG/2026-27/0001
  invoice_date DATE NOT NULL, supply_type VARCHAR(10) NOT NULL,  -- INTRA | INTER
  taxable_total NUMERIC(12,2) NOT NULL, cgst NUMERIC(12,2) NOT NULL DEFAULT 0,
  sgst NUMERIC(12,2) NOT NULL DEFAULT 0, igst NUMERIC(12,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL, pdf_key VARCHAR(300), ...
);
CREATE TABLE invoice_items ( ... per-line taxable value, rates and tax amounts ... );
CREATE TABLE credit_notes ( ... linked to invoice_id, own sequential number ... );
```

### 2.5 Other tables

`reviews (user_id, product_id, rating 1-5, title, body, status, UNIQUE(user_id, product_id))`, `banners`, `shipping_rules`, `pincode_serviceability (pincode PK, days, cod_allowed)`, `contact_messages`, `newsletter_subscribers (email UNIQUE)`, `audit_log (actor_id, action, entity, entity_id, before JSONB, after JSONB, ip, at)`, `outbox_events (type, payload, status, attempts, next_attempt_at)`, `shedlock` (for scheduled job locking).

---

## 3. Domain model (key classes)

```java
// common/money
public final class Money {                       // immutable, thread-safe
    private final BigDecimal amount;             // scale 2, RoundingMode.HALF_UP
    public static Money inr(String v) { ... }
    public Money plus(Money o) { ... }  public Money minus(Money o) { ... }
    public Money times(int qty) { ... }  public Money percent(BigDecimal pct) { ... }
}

// order/domain
public enum OrderStatus {
    PENDING_PAYMENT, CONFIRMED, PACKED, SHIPPED, DELIVERED,
    CANCELLED, PAYMENT_FAILED, RETURN_REQUESTED, RETURNED, REFUNDED;

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED = Map.of(
        PENDING_PAYMENT, EnumSet.of(CONFIRMED, PAYMENT_FAILED, CANCELLED),
        PAYMENT_FAILED,  EnumSet.of(PENDING_PAYMENT, CANCELLED),
        CONFIRMED,       EnumSet.of(PACKED, CANCELLED),
        PACKED,          EnumSet.of(SHIPPED, CANCELLED),
        SHIPPED,         EnumSet.of(DELIVERED),
        DELIVERED,       EnumSet.of(RETURN_REQUESTED),
        RETURN_REQUESTED,EnumSet.of(RETURNED, DELIVERED),
        RETURNED,        EnumSet.of(REFUNDED),
        CANCELLED,       EnumSet.of(REFUNDED),
        REFUNDED,        EnumSet.noneOf(OrderStatus.class));

    public boolean canMoveTo(OrderStatus next) { return ALLOWED.get(this).contains(next); }
}

@Entity @Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = IDENTITY) private Long id;
    private String orderNumber;
    @ManyToOne(fetch = LAZY) private User user;
    @Enumerated(STRING) private OrderStatus status;
    @OneToMany(mappedBy = "order", cascade = ALL, orphanRemoval = true) private List<OrderItem> items;
    @JdbcTypeCode(SqlTypes.JSON) private AddressSnapshot shippingAddress;
    private BigDecimal subtotal, discount, shippingFee, taxTotal, grandTotal;
    @Version private int version;

    public void transitionTo(OrderStatus next, Long actorId, String note) {
        if (!status.canMoveTo(next)) throw new InvalidOrderStateException(status, next);
        history.add(new OrderStatusHistory(this, status, next, actorId, note));
        this.status = next;
    }
}
```

Main service interfaces:

```java
public interface AuthService {
    AuthResult register(RegisterRequest req);
    AuthResult login(LoginRequest req, ClientInfo client);
    AuthResult refresh(String rawRefreshToken, ClientInfo client);
    void logout(String rawRefreshToken);
    void requestPasswordReset(String email);
    void resetPassword(String rawToken, String newPassword);
}
public interface CartService {
    CartView getCart(CartOwner owner);
    CartView addItem(CartOwner owner, long variantId, int qty);
    CartView updateQuantity(CartOwner owner, long itemId, int qty);
    CartView removeItem(CartOwner owner, long itemId);
    CartView applyCoupon(CartOwner owner, String code);
    CartView mergeGuestCart(UUID guestToken, long userId);
}
public interface PricingService { PriceBreakdown price(List<PricedLine> lines, Coupon coupon, Address shipTo); }
public interface InventoryService {
    void reserve(long orderId, List<StockLine> lines, Instant expiresAt); // throws OutOfStockException
    void commit(long orderId);
    void release(long orderId);
}
public interface OrderService {
    OrderView placeOrder(long userId, PlaceOrderRequest req, UUID idempotencyKey);
    Page<OrderSummary> myOrders(long userId, Pageable p);
    OrderView myOrder(long userId, String orderNumber);          // ownership enforced
    OrderView cancel(long userId, String orderNumber);
    OrderView adminUpdateStatus(String orderNumber, StatusUpdateRequest req, long adminId);
}
public interface PaymentService {
    GatewayOrder createGatewayOrder(long userId, String orderNumber);
    OrderView verifyAndConfirm(long userId, PaymentVerifyRequest req);
    void handleWebhook(String rawBody, String signatureHeader);
    RefundView refund(String orderNumber, BigDecimal amount, String reason, long adminId);
}
public interface InvoiceService {
    Invoice generateFor(long orderId);       // idempotent: returns existing if present
    byte[] pdfFor(long userId, String orderNumber);
}
public interface TaxCalculator { TaxSplit split(BigDecimal grossInclusive, BigDecimal gstRate, String fromState, String toState); }
```

---

## 4. API contracts (selected)

Base path `/api/v1`. JSON. Errors use RFC 7807 Problem Details:

```json
{ "type": "about:blank", "title": "Out of stock", "status": 409,
  "detail": "Only 1 left of 'Banarasi Silk Saree - Red'", "instance": "/api/v1/orders",
  "code": "OUT_OF_STOCK", "fieldErrors": [] }
```

### 4.1 Auth

```
POST /auth/register   { fullName, email, mobile, password }                 → 201 { user, accessToken } + Set-Cookie: rt=...
POST /auth/login      { identifier, password, captchaToken? }               → 200 { user, accessToken } + Set-Cookie: rt=...
POST /auth/refresh    (cookie rt)                                           → 200 { accessToken } + rotated cookie
POST /auth/logout     (cookie rt)                                           → 204, cookie cleared
POST /auth/forgot-password { email }                                        → 202 (always, to avoid account discovery)
POST /auth/reset-password  { token, newPassword }                           → 204
POST /auth/otp/send   { mobile }   POST /auth/otp/verify { mobile, code }   → 204 / 200
```

Refresh cookie: `rt=<random 256-bit>; Path=/api/v1/auth; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`.

### 4.2 Catalogue (public, cacheable)

```
GET /categories                                       → category tree
GET /products?category=saris&minPrice=1000&maxPrice=20000&size=M&color=red&inStock=true&sort=price,asc&page=0&size=24
GET /products/{slug}                                  → detail with variants, images, rating
GET /products/{slug}/related
GET /search?q=silk saree     GET /search/suggest?q=sil
GET /home                                             → banners, featured, newArrivals
GET /shipping/check?pincode=110001                    → { serviceable, days, codAllowed }
```

Response headers: `Cache-Control: public, max-age=300`, `ETag`.

### 4.3 Cart

```
GET    /cart                         header X-Cart-Token: <uuid> (guest) or Authorization (customer)
POST   /cart/items       { variantId, quantity }
PATCH  /cart/items/{id}  { quantity }
DELETE /cart/items/{id}
POST   /cart/coupon      { code }      DELETE /cart/coupon
POST   /cart/merge       { guestToken }               (customer only, called right after login)
```

Cart response:

```json
{ "items": [ { "id": 7, "variantId": 31, "name": "Chikankari Kurta Set", "variant": "M / Ivory",
              "unitPrice": "3499.00", "quantity": 1, "lineTotal": "3499.00",
              "available": true, "priceChanged": false } ],
  "subtotal": "3499.00", "discount": "350.00", "shipping": "0.00",
  "taxIncluded": "149.95", "grandTotal": "3149.00", "currency": "INR", "coupon": "FESTIVE10" }
```

Money is sent as strings to avoid JavaScript floating-point errors.

### 4.4 Orders and payments (customer, login required)

```
POST /orders   header Idempotency-Key: <uuid>
               { shippingAddressId, billingAddressId, paymentMethod: "ONLINE" | "COD" }
               → 201 { orderNumber, status: "PENDING_PAYMENT", grandTotal }
POST /payments/create  { orderNumber }  → { razorpayOrderId, amountPaise, currency: "INR", keyId }
POST /payments/verify  { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature }
                       → 200 { orderNumber, status: "CONFIRMED" }
POST /payments/webhook (Razorpay → us, header X-Razorpay-Signature)  → 200
GET  /orders  GET /orders/{orderNumber}  POST /orders/{orderNumber}/cancel  POST /orders/{orderNumber}/return
GET  /orders/{orderNumber}/invoice      → application/pdf
```

### 4.5 Admin (`ROLE_ADMIN`, 2FA required)

`/admin/products`, `/admin/products/{id}/images` (multipart), `/admin/categories`, `/admin/inventory/low-stock`, `/admin/orders`, `/admin/orders/{orderNumber}/status`, `/admin/orders/{orderNumber}/refund`, `/admin/invoices/{id}/regenerate`, `/admin/coupons`, `/admin/banners`, `/admin/reviews`, `/admin/customers`, `/admin/reports/sales?from=&to=`, `/admin/reports/orders.csv`.

---

## 5. Security implementation

### 5.1 Spring Security configuration

```java
@Configuration @EnableWebSecurity @EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain api(HttpSecurity http, JwtAuthFilter jwtFilter, RateLimitFilter rateLimit) throws Exception {
        return http
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/v1/payments/webhook")  // HMAC-verified instead
                              .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                              .requireCsrfProtectionMatcher(new AntPathRequestMatcher("/api/v1/auth/refresh")))
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .requiresChannel(c -> c.anyRequest().requiresSecure())                 // HTTPS only
            .headers(h -> h
                .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).preload(true).maxAgeInSeconds(31536000))
                .contentSecurityPolicy(csp -> csp.policyDirectives(
                    "default-src 'self'; script-src 'self' https://checkout.razorpay.com; " +
                    "frame-src https://api.razorpay.com https://checkout.razorpay.com; " +
                    "img-src 'self' data: https://cdn.rhythmartgallery.in; connect-src 'self' https://lumberjack.razorpay.com; " +
                    "frame-ancestors 'none'; base-uri 'self'; form-action 'self'"))
                .frameOptions(f -> f.deny())
                .referrerPolicy(r -> r.policy(ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                .contentTypeOptions(Customizer.withDefaults()))
            .authorizeHttpRequests(a -> a
                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**", "/api/v1/products/**",
                                 "/api/v1/search/**", "/api/v1/home", "/api/v1/shipping/check").permitAll()
                .requestMatchers("/api/v1/auth/**", "/api/v1/cart/**", "/api/v1/payments/webhook").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated())                                        // deny-by-default
            .addFilterBefore(rateLimit, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(e -> e.authenticationEntryPoint(new ProblemAuthEntryPoint()))
            .build();
    }

    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }
    // Alternative: Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8()
}
```

### 5.2 Passwords and tokens

| Secret | Storage |
|---|---|
| User password | BCrypt(cost 12) hash in `users.password_hash` |
| Refresh token | 256-bit `SecureRandom` value sent in cookie; only SHA-256 hash stored |
| Password reset token | 256-bit random, SHA-256 hash stored, 15-min expiry, single use |
| OTP | 6 digits from `SecureRandom`, HMAC-SHA256 hash in Redis, 5-min TTL, 5 attempts |
| Admin TOTP secret | AES-256-GCM encrypted with a key from the secrets manager |
| JWT signing key | RS256 private key (or HS256 ≥256-bit secret) from the secrets manager; rotated with `kid` header |
| Razorpay key secret / webhook secret | Environment / secrets manager only |

JWT access token: 15-minute expiry, claims `sub` (user publicId), `role`, `iat`, `exp`, `jti`. Validate signature, expiry, issuer and audience on every request.

Refresh rotation (in `TokenService`, one transaction):

1. Hash the presented token and load it `FOR UPDATE`.
2. If not found or expired → 401.
3. If already revoked → **reuse detected**: revoke the whole `family_id`, alert the user, 401.
4. Otherwise revoke it, insert a new token in the same family, return the new pair.

### 5.3 Login protection

```java
// RateLimitFilter: Bucket4j with Redis (shared across instances)
//   /auth/login           : 10 / minute per IP, 5 / 15 min per identifier
//   /auth/forgot-password : 3 / hour per identifier
//   /auth/otp/send        : 3 / 10 min per mobile
//   /api/** default       : 120 / minute per IP
// Over the limit → 429 with Retry-After.
```

- After 5 failed passwords: `locked_until = now() + 15 min`, CAPTCHA required for that identifier.
- Same response and similar response time for "no such user" and "wrong password" (run a dummy BCrypt check when the user doesn't exist).

### 5.4 Ownership checks

Every customer query includes the user id, so a customer can never read another customer's data:

```java
Order order = orderRepo.findByOrderNumberAndUserId(orderNumber, currentUserId)
                       .orElseThrow(() -> new NotFoundException("Order not found"));  // 404, not 403
```

### 5.5 Payment verification

```java
public OrderView verifyAndConfirm(long userId, PaymentVerifyRequest r) {
    Order order = orderRepo.findByOrderNumberAndUserId(r.orderNumber(), userId).orElseThrow(...);
    Payment p = paymentRepo.findByGatewayOrderId(r.razorpayOrderId()).orElseThrow(...);
    String expected = hmacSha256Hex(r.razorpayOrderId() + "|" + r.razorpayPaymentId(), razorpayKeySecret);
    if (!MessageDigest.isEqual(expected.getBytes(UTF_8), r.razorpaySignature().getBytes(UTF_8)))
        throw new PaymentVerificationException();                       // constant-time compare
    // Fetch the payment from Razorpay API and check amount == order.grandTotal and status == captured
    return confirmPayment(order.getId(), r.razorpayPaymentId());       // idempotent, see 6.4
}
```

Webhook: verify `X-Razorpay-Signature` over the **raw** request body with the webhook secret; insert into `webhook_events` (unique `provider, event_id`) — a duplicate insert means "already processed, return 200".

### 5.6 Input validation and output safety

- Request DTOs are Java records with Bean Validation: `@NotBlank`, `@Email`, `@Size`, `@Pattern(regexp="^[6-9]\\d{9}$")` for Indian mobiles, `@Pattern(regexp="^\\d{6}$")` for pincodes, `@Min/@Max` for quantity.
- `spring.jackson.deserialization.fail-on-unknown-properties=true` to block mass assignment.
- Review text sanitised with OWASP Java HTML Sanitizer (plain text only).
- Upload limits: `spring.servlet.multipart.max-file-size=5MB`; content sniffed with Apache Tika; only JPEG/PNG/WebP accepted; images re-encoded; random UUID file names.
- `server.error.include-stacktrace=never`, `include-message=never`; a `@RestControllerAdvice` maps exceptions to Problem Details.

### 5.7 Logging and audit

- MDC request id on every log line; PII masked by a Logback converter.
- Never log: passwords, tokens, OTPs, full card/UPI data, Authorization headers, cookies.
- `AuditService.record(actor, action, entity, id, before, after)` called from admin services (price change, stock change, status change, refund, role change).

---

## 6. Thread safety and concurrency

### 6.1 General rules

- Spring beans (`@Service`, `@Controller`, `@Component`) are **stateless singletons**: no mutable instance fields; only `final` injected dependencies (constructor injection).
- Shared helpers are immutable (`Money`, DTO records) or thread-safe (`ObjectMapper`, `Clock`, `SecureRandom`).
- Never use `SimpleDateFormat`; use `java.time` (`DateTimeFormatter` is thread-safe).
- No `static` mutable state. Any in-memory cache uses `ConcurrentHashMap`/Caffeine, but shared caches go to Redis.
- **Java `synchronized` is not used for business rules**, because it only protects one JVM and the app runs on several instances. The database (and Redis locks where needed) enforces correctness.
- Transactions: `@Transactional` on service methods, default `READ_COMMITTED`, combined with the explicit locking below.

### 6.2 Stock reservation (no overselling)

```java
@Modifying
@Query("""
   UPDATE ProductVariant v SET v.stockReserved = v.stockReserved + :qty, v.version = v.version + 1
   WHERE v.id = :id AND (v.stockOnHand - v.stockReserved) >= :qty
""")
int tryReserve(@Param("id") long variantId, @Param("qty") int qty);
```

`InventoryServiceImpl.reserve()` sorts lines by `variantId` (consistent lock order prevents deadlocks), calls `tryReserve` for each, and throws `OutOfStockException` (rolling back the whole transaction) if any call returns 0. On payment success `commit()` does `stock_on_hand -= qty, stock_reserved -= qty`; on failure/timeout `release()` does `stock_reserved -= qty`. The `CHECK` constraints are a final safety net.

### 6.3 Place order (idempotent)

```java
@Transactional
public OrderView placeOrder(long userId, PlaceOrderRequest req, UUID idemKey) {
    Optional<Order> existing = orderRepo.findByUserIdAndIdempotencyKey(userId, idemKey);
    if (existing.isPresent()) return mapper.toView(existing.get());      // double-click / retry safe

    Cart cart = cartRepo.findByUserIdForUpdate(userId);                   // PESSIMISTIC_WRITE on cart row
    PriceBreakdown price = pricing.price(cart.lines(), couponFor(cart), address(req));  // server-side totals
    Order order = Order.create(userId, numberGen.next(), price, snapshots(req), idemKey);
    orderRepo.save(order);                                                // UNIQUE(user_id, idempotency_key) backs this up
    inventory.reserve(order.getId(), cart.stockLines(), now().plus(15, MINUTES));
    couponService.consume(cart.getCouponCode(), userId, order.getId());   // see 6.5
    cart.clear();
    return mapper.toView(order);
}
```

### 6.4 Payment confirmation (exactly once)

```java
@Transactional
public OrderView confirmPayment(long orderId, String gatewayPaymentId) {
    Order order = orderRepo.findByIdForUpdate(orderId);          // SELECT ... FOR UPDATE
    if (order.getStatus() == CONFIRMED) return mapper.toView(order);   // already done (webhook or verify)
    Payment p = paymentRepo.findByOrderIdForUpdate(orderId);
    p.markCaptured(gatewayPaymentId);                              // UNIQUE(gateway_payment_id)
    order.transitionTo(CONFIRMED, SYSTEM, "Payment captured");
    inventory.commit(orderId);
    outbox.publish(new OrderConfirmedEvent(orderId));              // invoice + email after commit
    return mapper.toView(order);
}
```

Both the browser `verify` call and the webhook call this; whichever comes second sees `CONFIRMED` and returns.

### 6.5 Coupons

```sql
UPDATE coupons SET used_count = used_count + 1
WHERE code = :code AND active AND (usage_limit IS NULL OR used_count < usage_limit)
  AND now() BETWEEN coalesce(valid_from, now()) AND coalesce(valid_to, now());
```

0 rows → coupon no longer valid. Per-user limit enforced by counting `coupon_usages` inside the same transaction (and `UNIQUE(order_id)`).

### 6.6 Invoice numbers (gap-free, no duplicates)

```java
@Transactional(propagation = Propagation.MANDATORY)
public String nextInvoiceNumber(String fy) {
    InvoiceSequence seq = seqRepo.findByIdForUpdate(fy)                  // row lock
                                 .orElseGet(() -> seqRepo.saveAndFlush(new InvoiceSequence(fy, 0)));
    seq.increment();
    return "RAG/%s/%04d".formatted(fy, seq.getLastNumber());
}
```

Order numbers use a PostgreSQL sequence (`nextval('order_number_seq')`), which is concurrency-safe without locks.

### 6.7 Optimistic locking

`@Version` on `Product`, `ProductVariant`, `Cart`, `Order`, `Coupon`, `Payment`. A conflicting update throws `ObjectOptimisticLockingFailureException`, mapped to **409 Conflict** ("This item was changed by someone else, please refresh"). Cart operations retry once automatically using Spring Retry.

### 6.8 Async and scheduled work

```java
@Bean(name = "appExecutor")
ThreadPoolTaskExecutor appExecutor() {
    var ex = new ThreadPoolTaskExecutor();
    ex.setCorePoolSize(4); ex.setMaxPoolSize(16); ex.setQueueCapacity(500);
    ex.setThreadNamePrefix("rag-async-");
    ex.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());   // back-pressure, nothing dropped
    ex.setTaskDecorator(new MdcTaskDecorator());                                 // carry request id
    ex.setWaitForTasksToCompleteOnShutdown(true);
    return ex;
}
```

- Outbox pattern: events are written to `outbox_events` in the same transaction as the business change; a poller (`@Scheduled`, ShedLock) sends emails / generates PDFs and marks them done, with retries. Nothing is lost if the app restarts.
- Event handlers use `@TransactionalEventListener(phase = AFTER_COMMIT)` so work only runs once data is committed.
- Scheduled jobs (`@SchedulerLock` so only one instance runs each): expire unpaid orders every minute, release expired reservations, purge expired carts/tokens nightly, daily payment reconciliation.
- Java 21 virtual threads can be enabled (`spring.threads.virtual.enabled=true`) for request handling; still keep DB pool limits.

### 6.9 Concurrency test cases

- 50 parallel orders for a variant with stock 10 → exactly 10 succeed, 40 get `OUT_OF_STOCK`, stock never negative.
- Verify call and webhook arrive simultaneously → one confirmation, one invoice, one email.
- Same `Idempotency-Key` submitted twice → one order.
- Coupon with usage limit 1 used by two users at once → one succeeds.
- 100 parallel invoice generations → 100 unique consecutive numbers.

Use Testcontainers (real PostgreSQL) + `ExecutorService` + `CountDownLatch` for these tests.

---

## 7. Pricing and GST calculation

Prices shown to customers include GST. For each line:

```
gross        = unitPrice × qty − lineDiscount            (coupon discount spread proportionally)
taxableValue = gross × 100 / (100 + gstRate)             (round HALF_UP to 2 dp)
tax          = gross − taxableValue
if storeState == shipToState: CGST = SGST = tax / 2      (intra-state)
else:                         IGST = tax                  (inter-state)
```

Typical rates (confirm with your CA): apparel ≤ ₹1,000 per piece 5%, above ₹1,000 12% (check current GST council rates); jewellery 3%; handbags 18%. Rates live on each product (`gst_rate`, `hsn_code`) so they can change without code changes. Shipping fee is taxed at 18% unless included in price. Amount-in-words uses the Indian system (lakh, crore).

---

## 8. Caching

| Cache | Key | TTL | Evicted when |
|---|---|---|---|
| Category tree | `cat:tree` | 1 h | Category saved |
| Product detail | `prod:{slug}` | 10 min | Product/variant/image saved |
| Product list page | `plist:{hash(filters)}` | 5 min | Any product in category saved (version key bump) |
| Home content | `home` | 5 min | Banner/featured change |
| Stock | **not cached** | — | Always read from DB at cart/checkout |

Spring Cache with Redis (`@Cacheable`, `@CacheEvict`). Stock and prices are always re-checked from the database at cart read and order placement.

---

## 9. Frontend design

### 9.1 Routes

```
/                         Home
/c/:categorySlug          Category listing (+ ?filters)
/p/:productSlug           Product detail
/search?q=                Search
/cart                     Cart
/login, /register, /forgot-password, /reset-password
/checkout                 ProtectedRoute
/account, /account/orders, /account/orders/:orderNumber, /account/addresses, /account/wishlist   ProtectedRoute
/admin/*                  AdminRoute
/about, /contact, /policies/:slug
```

### 9.2 State and security on the client

- Access token kept **in memory only** (React context), never in localStorage; on page load call `/auth/refresh` (cookie) to get a new one.
- Axios interceptor: attach `Authorization: Bearer`; on 401 call refresh once, then retry; on failure go to `/login?next=<current path>`.
- Guest cart token (UUID, not sensitive) stored in localStorage and sent as `X-Cart-Token`; after login call `/cart/merge`.
- `Idempotency-Key` generated per checkout attempt (`crypto.randomUUID()`) and reused on retry.
- Razorpay checkout loaded from `https://checkout.razorpay.com/v1/checkout.js` only; card/UPI entry happens in Razorpay's iframe.
- Never render HTML from the API (`dangerouslySetInnerHTML` forbidden).
- `formatINR(value: string)` uses `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.

### 9.3 Theme

Design tokens in `styles/theme.ts`: vibrant palette (e.g. rani pink, marigold, peacock blue, emerald, deep maroon, gold accents), floral SVG borders and embroidery-pattern backgrounds as reusable components, display font for headings (e.g. "Playfair Display" / "Yatra One") and a readable sans for body. Final look decided during frontend work.

---

## 10. Configuration files

### 10.1 `application.yml`

```yaml
spring:
  application.name: rhythm-art-gallery
  threads.virtual.enabled: true
  datasource:
    url: ${DB_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    hikari: { maximum-pool-size: 20, minimum-idle: 5, connection-timeout: 3000 }
  jpa:
    open-in-view: false
    hibernate.ddl-auto: validate
    properties.hibernate.jdbc.time_zone: UTC
  flyway.enabled: true
  data.redis: { host: ${REDIS_HOST}, port: 6379, password: ${REDIS_PASSWORD}, ssl.enabled: true }
  jackson.deserialization.fail-on-unknown-properties: true
  servlet.multipart: { max-file-size: 5MB, max-request-size: 25MB }

server:
  port: 8080
  forward-headers-strategy: framework        # trust X-Forwarded-Proto from the load balancer
  error: { include-stacktrace: never, include-message: never }
  servlet.session.cookie: { secure: true, http-only: true, same-site: strict }
  shutdown: graceful

app:
  cors.allowed-origins: ${FRONTEND_ORIGIN}   # e.g. https://www.rhythmartgallery.in
  security:
    jwt: { issuer: rhythmartgallery, access-ttl: 15m, refresh-ttl: 30d, key-id: ${JWT_KID} }
    bcrypt-strength: 12
    login: { max-attempts: 5, lock-duration: 15m }
  razorpay: { key-id: ${RAZORPAY_KEY_ID}, key-secret: ${RAZORPAY_KEY_SECRET}, webhook-secret: ${RAZORPAY_WEBHOOK_SECRET} }
  order: { payment-timeout: 15m, return-window: 7d, cod-max-amount: 10000 }
  store: { legal-name: ${STORE_LEGAL_NAME}, gstin: ${STORE_GSTIN}, state-code: ${STORE_STATE_CODE} }

management:
  endpoints.web.exposure.include: health,info,prometheus
  endpoint.health.show-details: never
```

### 10.2 Nginx (TLS + headers, if not using a managed load balancer)

```nginx
server { listen 80; server_name rhythmartgallery.in www.rhythmartgallery.in; return 301 https://$host$request_uri; }

server {
  listen 443 ssl http2;
  server_name www.rhythmartgallery.in;
  ssl_certificate     /etc/letsencrypt/live/rhythmartgallery.in/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/rhythmartgallery.in/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers off;
  ssl_stapling on; ssl_stapling_verify on;

  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  add_header X-Content-Type-Options nosniff always;
  add_header X-Frame-Options DENY always;
  add_header Referrer-Policy strict-origin-when-cross-origin always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

  client_max_body_size 25m;
  limit_req_zone $binary_remote_addr zone=api:10m rate=20r/s;

  location /api/ {
    limit_req zone=api burst=40 nodelay;
    proxy_pass http://backend;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  location / { root /var/www/frontend; try_files $uri /index.html; }
}
```

### 10.3 `docker-compose.yml` (local development)

```yaml
services:
  postgres: { image: postgres:16, environment: { POSTGRES_DB: rag, POSTGRES_USER: rag, POSTGRES_PASSWORD: rag_dev }, ports: ["5432:5432"] }
  redis:    { image: redis:7, ports: ["6379:6379"] }
  mailhog:  { image: mailhog/mailhog, ports: ["8025:8025", "1025:1025"] }
```

Local dev uses `https://localhost` via `mkcert` so secure cookies and HSTS behave like production.

### 10.4 Key Maven dependencies

`spring-boot-starter-web`, `-security`, `-data-jpa`, `-validation`, `-data-redis`, `-cache`, `-actuator`, `-mail`, `-thymeleaf`; `postgresql`; `flyway-core`, `flyway-database-postgresql`; `io.jsonwebtoken:jjwt-api/impl/jackson` (or `spring-boot-starter-oauth2-resource-server`); `com.bucket4j:bucket4j-redis`; `net.javacrumbs.shedlock:shedlock-spring`, `shedlock-provider-jdbc-template`; `com.razorpay:razorpay-java`; `com.github.librepdf:openpdf`; `org.apache.tika:tika-core`; `com.googlecode.owasp-java-html-sanitizer`; `dev.samstevens.totp:totp`; `org.springdoc:springdoc-openapi-starter-webmvc-ui`; `io.github.resilience4j:resilience4j-spring-boot3`; tests: `spring-boot-starter-test`, `testcontainers` (postgresql, junit-jupiter), `rest-assured`. Build plugins: `org.owasp:dependency-check-maven`, `spotbugs` + `findsecbugs`.

---

## 11. Testing plan

| Level | What |
|---|---|
| Unit | `Money`, `TaxCalculator` (intra/inter-state, every GST rate, rounding), `PricingService`, coupon rules, `OrderStatus` transitions, amount-in-words |
| Integration (Testcontainers) | Repositories, stock reservation SQL, invoice sequence, refresh-token rotation, webhook idempotency |
| Security | Unauthenticated access to protected endpoints → 401; customer A reading customer B's order → 404; admin endpoints as customer → 403; rate limits → 429; tampered JWT/signature → 401 |
| Concurrency | Cases in section 6.9 |
| API / E2E | REST Assured: register → login → cart → order → payment (Razorpay test mode) → invoice; Playwright for the main frontend journeys |
| Security scans | OWASP Dependency-Check, SpotBugs/FindSecBugs, OWASP ZAP baseline against staging |

---

## 12. Build order for the coding agent

1. Project skeleton, Docker Compose, Flyway `V1__init.sql`, common error handling, `Money`.
2. Auth (register, login, JWT, refresh rotation, BCrypt), security config, rate limiting.
3. Catalogue (categories, products, variants, images) + admin CRUD + public listing/search.
4. Cart (guest + customer, merge, pricing, coupons) and wishlist.
5. Addresses, checkout, order placement with stock reservation.
6. Razorpay integration (create, verify, webhook, refund) + payment timeout job.
7. Billing (GST calculator, invoice numbers, PDF) + notifications via outbox.
8. Order management for admin, reports, reviews, CMS.
9. Frontend pages in the same order, then theme and animations.
10. Hardening: security headers/CSP, scans, concurrency tests, load test (k6/Gatling).
