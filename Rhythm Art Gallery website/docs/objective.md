# Objective — stages of the project

Reference for what is done and what is next. Check this file before starting any task; tick boxes as stages finish; mirror status in `docs/handover.md`.

## Goal
A working, concept-stage e-commerce site for a local boutique (saris, suits, jewellery, handbags/purses): interactive floral-Indian-embroidery landing page, product browsing, community page, user login, cart, and test-mode Razorpay checkout. Placeholder images the owner can swap later. Details: `docs/vision.md`.

## Status (front end done, backend not started)
| Stage | Status |
|---|---|
| 0 Foundation docs · 1 Scaffold · 2 Design shell | done |
| 3 Landing page | done (static data) |
| 4 Data layer | **not started: needs backend dependency approval + Postgres** |
| 5 Catalogue pages | UI done on static data; DB wiring pending |
| 6 Community page | UI done on static data; DB wiring pending |
| 7 Authentication | UI only (`/login`, `/register`); real auth pending |
| 8 Cart | browser-only cart done; server cart + merge pending |
| 9 Checkout & payments | UI only (`/checkout`); Razorpay pending |
| 10 Orders & account · 11 Admin-lite · 12 Hardening · 13 Deploy | not started |

PR-by-PR history: `docs/prhistory.md`. Handover and open questions: `docs/handover.md`.

## How we work
- One stage at a time. One feature per branch (`stage-N-name` or finer). Stop at the end of each stage for user review.
- UI is built one section at a time, stopping after each.
- Order is **visible first, then wired**: look and landing page with static data, then database/backend, then money. The user sees real progress early and the riskiest code (auth, payments) gets built on a stable base.
- Every stage ends with the **Definition of done** below.

## Definition of done (every stage)
1. `npm run lint`, `npm run typecheck`, `npm test` pass; output shown.
2. Every API endpoint has Zod validation, auth check, authorization check, test.
3. DB changes only via Prisma migration.
4. No secrets committed; new env vars added to `.env.example`.
5. `docs/decisions.md` updated if a decision was made; `docs/handover.md` updated.
6. Report: changes and why · skipped/stubbed/mocked/hard-coded · assumptions to confirm.
7. User reviews, then merge to `main`.

---

## Stage 0 — Foundation docs ✅
`docs/vision.md`, `docs/decisions.md`, `CLAUDE.md`, `.env.example`, `.gitignore`, `docs/handover.md`. Stack locked. Old Spring Boot docs removed.

## Stage 1 — Scaffold & tooling ✅
**Goal:** empty app that builds, lints, type-checks and tests.
- Needs approval: dependency list (next, react, typescript, tailwindcss, eslint, vitest; later stages add prisma, next-auth, zod, razorpay, motion, bcryptjs, playwright).
- Next.js + TS + Tailwind; scripts `dev`, `test`, `lint`, `typecheck`; one trivial passing test.
- **Done when:** `npm run dev` shows a blank page; all three checks green.

## Stage 2 — Design system & site shell ✅ (awaiting review)
**Goal:** the look, applied to header, footer and page layout.
- **Needs from user:** Realtime Colors hex codes, heading + body fonts, Haikei SVG path, shop name/logo/contact.
- Propose which Motion Primitives components fit which sections; user confirms before use.
- Colour/font tokens (only the user's), background SVG, responsive header/nav (Home, Shop, New Arrivals, Community, Cart, Login), footer.
- **Done when:** shell renders on mobile + desktop, uses only supplied colours/fonts.

## Stage 3 — Interactive landing page (static data)
**Goal:** the showpiece. Built section by section, stop after each.
- Hero · shop by category · new arrivals strip · community teaser · shop story.
- Placeholder images in `public/images/` (folder layout and naming rule in `public/images/README.md`).
- Animation only where it does something; Motion Primitives source copied in, not rewritten.
- **Done when:** user approves each section; page works on a phone.

## Stage 4 — Data layer
**Goal:** real data behind the pages.
- Prisma schema: User, Category, Product, ProductImage, Cart/CartItem, Order/OrderItem, Payment, CommunityEvent. First migration. Seed script with the placeholder catalogue.
- Local Postgres setup documented; `DATABASE_URL` in `.env.example`.
- **Done when:** `npx prisma migrate dev` + seed succeed on a clean DB; seed test passes.

## Stage 5 — Catalogue pages
**Goal:** browse the shop.
- Shop with categories (Jewellery · Clothing → Saris/Suits · Handbags & Purses), filters/sort in the URL, product detail with image gallery, New Arrivals page with per-category filter.
- Read-only API endpoints with validation + tests; ₹ formatted Indian style.
- Landing page switches from static data to the database.
- **Done when:** every category and product renders from the DB; empty states handled.

## Stage 6 — Community page
**Goal:** show the shop's work in the community (events, selections, interactions).
- CommunityEvent data, timeline/gallery page, teaser on home now reads real data.
- **Needs from user:** real events, dates, text, photos (placeholders until then).
- **Done when:** page renders from DB; content replaceable without code.

## Stage 7 — Authentication
**Goal:** register, login, logout.
- Auth.js + Prisma adapter, email + password (bcrypt), protected routes, account menu in header.
- Tests: wrong password, duplicate email, protected route redirects, no user enumeration.
- **Done when:** full register → login → logout works; protected pages unreachable when logged out.

## Stage 8 — Cart
**Goal:** guests and customers can build a cart.
- Guest cart in browser; merged into the account cart on login; server calculates totals and re-checks price/stock.
- **Done when:** merge works, tampered prices from client are ignored (test).

## Stage 9 — Checkout & payments
**Goal:** pay with Razorpay (test mode).
- Address step, server creates the order and Razorpay order, client opens checkout, server verifies signature, webhook with idempotency, stock reserved/released.
- Tests: bad signature rejected, replayed webhook doesn't double-confirm, amount comes from server.
- **Needs from user:** Razorpay test keys in local `.env`.
- **Done when:** test payment end to end marks order paid; failure leaves order retryable.

## Stage 10 — Orders & account
**Goal:** customers see what they bought.
- My orders list/detail, status timeline, simple receipt. Ownership enforced (another user's order → 404).
- **Done when:** user can only ever see their own orders (test).

## Stage 11 — Admin-lite (optional, confirm with user)
**Goal:** owner manages without code.
- Admin role; add/edit products, stock, order status. Image replacement flow documented.
- **Done when:** owner can add a product and change an order status; non-admins get 403.

## Stage 12 — Hardening & QA
**Goal:** safe and polished.
- Security review (headers, rate limits on login, input validation sweep), accessibility pass, performance (image sizes, Lighthouse), Playwright e2e of the main journey, error/404 pages.
- **Done when:** e2e green; no known high-severity issues.

## Stage 13 — Deploy & go-live
**Goal:** public site.
- Vercel + Neon + Cloudinary setup, env vars set in hosting, migrations on production DB, domain.
- **Go-live needs from user:** real photos, real community content, Razorpay KYC + live keys, GST decision.
- **Done when:** production URL works, live-mode payment smoke test passes, handover updated.

---

## Out of scope (v1)
GST invoices/credit notes, courier API, email notifications, reviews, wishlist, coupons, multi-language, mobile app. Revisit after the shop confirms GST status and order volume.
