> **SUPERSEDED.** Stack changed to Next.js + Prisma + Postgres. See `/vision.md` and `/docs/decisions.md`. Kept for reference only.

# Rhythm Art Gallery — Functional Requirements

Boutique e-commerce website for Rhythm Art Gallery, selling dresses, saris, suits, jewellery, handbags and other accessories.

This document lists the functional requirements for the **frontend** and the **backend**. It is written so a coding agent can build from it. Requirement IDs (e.g. `FE-CART-03`) are stable, so tasks, commits and tests can refer to them.

---

## 1. Project overview

| Item | Decision |
|---|---|
| Project type | Full-stack web application (separate frontend and backend) |
| Location | `Java project/Rhythm Art Gallery/Rhythm Art Gallery website/` |
| Currency | Indian Rupee (INR, `₹`) everywhere. No currency switching. |
| Browsing | Open to everyone (guests included), prices visible to guests |
| Purchasing | Requires a logged-in account. Guests can add to cart but must log in to check out. |
| Backend stack | Java (Spring Boot 3 recommended), REST/JSON API |
| Frontend stack | Open. Any modern SPA framework (React, Angular or Vue) or server-rendered Thymeleaf is acceptable. |
| Database | Relational (PostgreSQL or MySQL recommended) |
| Visual direction | Vibrant, floral motifs, Indian embroidery aesthetics (exact design to be finalised during frontend work) |

### 1.1 User roles

| Role | Description |
|---|---|
| **Guest** | Not logged in. Can browse, search, view products and prices, and use a temporary cart. Cannot check out. |
| **Customer** | Registered and logged in. Everything a guest can do, plus checkout, orders, invoices, addresses and wishlist. |
| **Admin** | Store staff. Manages products, categories, stock, orders and invoices. |

### 1.2 Product categories (initial)

- Dresses
- Saris
- Suits (salwar suits, kurta sets, etc.)
- Jewellery
- Handbags
- Accessories (dupattas, scarves, clutches, footwear, hair accessories, etc.)

Categories must be data-driven (stored in the database), so admins can add new ones without code changes. Subcategories are supported (e.g. Saris → Silk, Cotton, Banarasi).

---

## 2. Frontend functional requirements

### 2.1 Global layout and navigation

- **FE-NAV-01** Every page shows a header with: logo ("Rhythm Art Gallery"), main navigation, search box, wishlist icon, cart icon with item count, and a login/account control.
- **FE-NAV-02** Main navigation lists Home and each product category (Dresses, Saris, Suits, Jewellery, Handbags, Accessories), loaded from the backend category API.
- **FE-NAV-03** The account control shows "Login / Register" for guests and the customer's name with a menu (My Account, Orders, Wishlist, Logout) for logged-in users.
- **FE-NAV-04** Every page shows a footer with contact details, store address, social links, and links to About, Shipping, Returns & Exchange, Privacy Policy and Terms.
- **FE-NAV-05** The site is fully responsive (mobile, tablet, desktop). On mobile the navigation collapses into a menu.
- **FE-NAV-06** All prices are formatted in Indian style with the rupee sign, e.g. `₹1,24,999.00` (use `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` or equivalent).
- **FE-NAV-07** Breadcrumbs appear on category, product, cart and checkout pages.

### 2.2 Home (landing) page

- **FE-HOME-01** Hero banner / carousel with seasonal or featured collections, each linking to a category or collection.
- **FE-HOME-02** "Shop by category" section with a tile per category.
- **FE-HOME-03** "New arrivals" product strip.
- **FE-HOME-04** "Featured / bestsellers" product strip.
- **FE-HOME-05** About-the-boutique section (story, craftsmanship, embroidery heritage).
- **FE-HOME-06** Optional sections: customer testimonials, Instagram/gallery strip, newsletter sign-up.
- **FE-HOME-07** Home page content (banners, featured products) comes from the backend, not hard-coded.

### 2.3 Category / product listing pages

- **FE-LIST-01** One listing page per category and subcategory, showing a product grid.
- **FE-LIST-02** Each product card shows image, name, price in ₹, discounted price and strike-through original price if on sale, and an "Out of stock" badge when applicable.
- **FE-LIST-03** Hovering a card (desktop) shows a second image and quick "Add to wishlist" action.
- **FE-LIST-04** Filters: price range (₹), size, colour, fabric/material, occasion, availability (in stock), and subcategory. Filters are reflected in the URL so they can be shared.
- **FE-LIST-05** Sorting: newest, price low→high, price high→low, popularity.
- **FE-LIST-06** Pagination or infinite scroll.
- **FE-LIST-07** Empty state message when no products match.

### 2.4 Search

- **FE-SRCH-01** Header search with suggestions while typing (product names and categories).
- **FE-SRCH-02** Search results page using the same grid, filters and sorting as listing pages.

### 2.5 Product detail page

- **FE-PDP-01** Image gallery with thumbnails and zoom on hover/tap.
- **FE-PDP-02** Name, SKU, price in ₹ (with discount if any), and "inclusive of all taxes" note.
- **FE-PDP-03** Variant selectors (size, colour) where the product has variants. Price and stock update to match the selected variant.
- **FE-PDP-04** Quantity selector limited by available stock.
- **FE-PDP-05** "Add to cart" and "Buy now" buttons. "Buy now" requires login (see FE-AUTH-06).
- **FE-PDP-06** "Add to wishlist" button (prompts login for guests).
- **FE-PDP-07** Description, fabric/material, care instructions, size chart (for apparel), and blouse-piece / dupatta details where relevant.
- **FE-PDP-08** Delivery estimate by pincode check.
- **FE-PDP-09** Related / "You may also like" products.
- **FE-PDP-10** Customer reviews and average star rating; logged-in customers who bought the item can write a review.

### 2.6 Cart

- **FE-CART-01** Guests and customers can add items to a cart.
- **FE-CART-02** Guest cart is stored in the browser (local storage) and/or a server-side guest cart identified by a cart token.
- **FE-CART-03** On login, the guest cart is merged into the customer's server-side cart.
- **FE-CART-04** Cart page lists each item (image, name, variant, unit price, quantity, line total) with controls to change quantity or remove.
- **FE-CART-05** Cart summary shows subtotal, discount, GST, shipping charge and grand total, all in ₹.
- **FE-CART-06** Coupon code field with success/error feedback.
- **FE-CART-07** A mini-cart drawer opens from the header cart icon.
- **FE-CART-08** "Proceed to checkout" sends guests to the login page, then back to checkout after successful login.
- **FE-CART-09** Items that went out of stock or changed price since being added are flagged.

### 2.7 Authentication and account pages

- **FE-AUTH-01** Login page: email (or mobile number) and password, "Remember me", "Forgot password" link, link to Register.
- **FE-AUTH-02** Register page: full name, email, mobile number, password, confirm password, accept terms. Client-side validation for all fields.
- **FE-AUTH-03** Forgot password / reset password pages (reset via emailed link or OTP).
- **FE-AUTH-04** Optional: login with Google.
- **FE-AUTH-05** Logout from the account menu.
- **FE-AUTH-06** Any purchase action (Buy now, Proceed to checkout, Place order) by a guest redirects to login and returns the user to where they were afterwards.
- **FE-AUTH-07** Protected routes (checkout, account, orders, wishlist) are not reachable without login.

### 2.8 My Account

- **FE-ACC-01** Profile: view and edit name, mobile, email; change password.
- **FE-ACC-02** Address book: add, edit, delete and set default shipping/billing addresses (name, phone, line 1, line 2, city, state, pincode, landmark).
- **FE-ACC-03** Order history list with order number, date, total (₹) and status.
- **FE-ACC-04** Order detail page with items, amounts, addresses, payment status, status timeline, and "Download invoice" button.
- **FE-ACC-05** Cancel an order while it is still cancellable; request a return/exchange within the return window.
- **FE-ACC-06** Wishlist page with "Move to cart" and "Remove".

### 2.9 Checkout

- **FE-CHK-01** Checkout is only available to logged-in customers.
- **FE-CHK-02** Step 1, Address: choose a saved address or add a new one; option for a different billing address.
- **FE-CHK-03** Step 2, Review: items, quantities, price breakdown (subtotal, discount, GST, shipping, total in ₹).
- **FE-CHK-04** Step 3, Payment: choose payment method (UPI, cards, net banking, wallets through the payment gateway, and Cash on Delivery if enabled).
- **FE-CHK-05** Online payments open the gateway's checkout (e.g. Razorpay). The frontend never handles raw card data.
- **FE-CHK-06** Order confirmation page with order number, summary, and links to view order and download invoice.
- **FE-CHK-07** Payment failure page with "Retry payment" and the order kept in "Payment pending" state.

### 2.10 Billing / invoice (customer-facing)

- **FE-BILL-01** Customers can view and download a GST invoice (PDF) for each paid or delivered order.
- **FE-BILL-02** The invoice shows: invoice number and date, store GSTIN and address, customer billing and shipping address, line items with HSN code, quantity, unit price, taxable value, CGST/SGST or IGST, totals in ₹, and amount in words.

### 2.11 Admin panel (frontend)

- **FE-ADM-01** Separate admin area, accessible only to the Admin role.
- **FE-ADM-02** Dashboard: today's and this month's sales (₹), order count by status, low-stock alerts.
- **FE-ADM-03** Product management: list, search, create, edit, deactivate products; upload multiple images; manage variants, prices, discounts and stock.
- **FE-ADM-04** Category management: create, edit, reorder, deactivate categories and subcategories.
- **FE-ADM-05** Order management: list and filter orders, view details, update status (Confirmed, Packed, Shipped with tracking number, Delivered, Cancelled, Returned), issue refunds.
- **FE-ADM-06** Invoice management: view, download and regenerate invoices.
- **FE-ADM-07** Coupon management: create and edit coupons (percent or flat ₹ off, minimum order value, validity dates, usage limits).
- **FE-ADM-08** Customer list with order history (read-only).
- **FE-ADM-09** Home page content management: banners and featured products.

### 2.12 Static pages

- **FE-STAT-01** About Us, Contact Us (with contact form), Shipping Policy, Returns & Exchange Policy, Privacy Policy, Terms & Conditions, FAQ.

### 2.13 Look, feel and interactivity

- **FE-UX-01** Vibrant colour palette with floral motifs and Indian embroidery-inspired patterns, borders and dividers. Final design is decided during frontend work.
- **FE-UX-02** Interactive touches: animated hero carousel, hover effects on product cards, smooth add-to-cart animation, image zoom, toast notifications for actions.
- **FE-UX-03** Loading skeletons while data loads; friendly error and 404 pages.
- **FE-UX-04** Accessibility: alt text on images, keyboard navigation, sufficient contrast, labelled form fields.
- **FE-UX-05** SEO: page titles, meta descriptions, clean URLs (e.g. `/saris/banarasi-silk-red`), Open Graph tags.

---

## 3. Backend functional requirements

### 3.1 General

- **BE-GEN-01** Expose a versioned REST API under `/api/v1`, JSON in and out.
- **BE-GEN-02** Public endpoints (no login): categories, products, search, home content, reviews (read), pincode check, guest cart, register, login, password reset.
- **BE-GEN-03** Customer endpoints require a valid login; admin endpoints require the Admin role.
- **BE-GEN-04** All monetary values are stored and calculated in INR using exact decimals (`BigDecimal` / `DECIMAL(12,2)`, or integer paise). Never floating point.
- **BE-GEN-05** Consistent error response format: `{ "timestamp", "status", "error", "message", "path", "fieldErrors"? }`.
- **BE-GEN-06** Input validation on every endpoint (Bean Validation), with clear messages.
- **BE-GEN-07** List endpoints support pagination (`page`, `size`) and sorting (`sort`).
- **BE-GEN-08** API documentation generated with OpenAPI/Swagger.

### 3.2 Authentication and users

- **BE-AUTH-01** Register a customer with name, email, mobile and password. Email and mobile must be unique.
- **BE-AUTH-02** Passwords are hashed with BCrypt (or Argon2). Plain passwords are never stored or logged.
- **BE-AUTH-03** Login with email or mobile plus password; returns a JWT access token and a refresh token (or a secure HTTP-only session cookie).
- **BE-AUTH-04** Refresh-token and logout endpoints; logout invalidates the refresh token.
- **BE-AUTH-05** Forgot password: send a time-limited reset link or OTP by email/SMS; reset endpoint sets a new password.
- **BE-AUTH-06** Optional email verification after registration.
- **BE-AUTH-07** Role-based access control with roles `CUSTOMER` and `ADMIN`.
- **BE-AUTH-08** Rate-limit login and password-reset attempts; lock or slow down after repeated failures.
- **BE-AUTH-09** Profile endpoints: get and update own profile, change password.

### 3.3 Addresses

- **BE-ADDR-01** CRUD for a customer's own addresses, with one default shipping and one default billing address.
- **BE-ADDR-02** Validate Indian pincode (6 digits) and state from a fixed list of Indian states/UTs.

### 3.4 Catalogue (categories and products)

- **BE-CAT-01** Category CRUD (admin) with name, slug, description, image, parent category, display order and active flag.
- **BE-CAT-02** Public endpoint returns the active category tree.
- **BE-PROD-01** Product CRUD (admin) with: name, slug, SKU, description, category, fabric/material, occasion, care instructions, HSN code, GST rate, base price (₹), sale price (₹), active flag, featured flag, tags.
- **BE-PROD-02** Product variants (size, colour) each with their own SKU, price override and stock quantity.
- **BE-PROD-03** Multiple images per product with display order; image upload to local storage or cloud storage (e.g. S3/Cloudinary), returning public URLs.
- **BE-PROD-04** Public product listing by category with filters (price range, size, colour, fabric, occasion, in-stock) and sorting (newest, price, popularity).
- **BE-PROD-05** Public product detail by slug, including variants, stock status, images and average rating.
- **BE-PROD-06** Search endpoint across name, description, tags and category, with autocomplete suggestions.
- **BE-PROD-07** Related products endpoint (same category / tags).
- **BE-PROD-08** Only active products in active categories are visible publicly.

### 3.5 Inventory

- **BE-INV-01** Track stock per variant.
- **BE-INV-02** Reserve stock when an order is placed; release it if payment fails or times out; deduct it permanently when payment succeeds (or on COD confirmation).
- **BE-INV-03** Prevent overselling under concurrent orders (optimistic locking or row-level locks).
- **BE-INV-04** Low-stock threshold per product; admin endpoint lists low-stock items.
- **BE-INV-05** Restock on cancellation or accepted return.

### 3.6 Cart

- **BE-CART-01** Guest cart identified by a cart token (UUID) returned to the client; no login needed to create or modify it.
- **BE-CART-02** Customer cart tied to the user account and persisted in the database.
- **BE-CART-03** Endpoints: get cart, add item, update quantity, remove item, clear cart.
- **BE-CART-04** Merge guest cart into customer cart on login (sum quantities, cap at available stock).
- **BE-CART-05** Cart totals are always calculated on the server: subtotal, discount, GST, shipping, grand total.
- **BE-CART-06** Validate stock and current price whenever the cart is read; flag changed or unavailable items.
- **BE-CART-07** Apply and remove coupon codes, with validation (validity dates, minimum order, usage limits, per-user limits).

### 3.7 Wishlist

- **BE-WISH-01** Customers can add, list and remove wishlist items, and move an item to the cart.

### 3.8 Checkout and orders

- **BE-ORD-01** Only logged-in customers can place orders. Any guest attempt returns `401 Unauthorized`.
- **BE-ORD-02** Place order from the current cart with chosen shipping and billing addresses and payment method. The server re-validates stock, prices and coupon before creating the order.
- **BE-ORD-03** Each order gets a unique, human-readable order number (e.g. `RAG-2026-000123`).
- **BE-ORD-04** The order stores a snapshot of items (name, variant, SKU, HSN, unit price, quantity, tax rate) and addresses, so later product edits do not change past orders.
- **BE-ORD-05** Order status lifecycle: `PENDING_PAYMENT → CONFIRMED → PACKED → SHIPPED → DELIVERED`, with `CANCELLED`, `RETURN_REQUESTED`, `RETURNED`, `REFUNDED` and `PAYMENT_FAILED` as side states. Invalid transitions are rejected.
- **BE-ORD-06** Every status change is recorded with timestamp and actor (status history).
- **BE-ORD-07** Customers can list their own orders and view their own order details only.
- **BE-ORD-08** Customers can cancel before the order is shipped, and request a return within a configurable window after delivery.
- **BE-ORD-09** Admins can list, filter (status, date range, customer) and update all orders, including adding a courier name and tracking number when shipped.
- **BE-ORD-10** Unpaid online orders are automatically cancelled after a configurable timeout and their stock released.

### 3.9 Payments

- **BE-PAY-01** Integrate an Indian payment gateway (Razorpay recommended; PayU or Cashfree acceptable) supporting UPI, cards, net banking and wallets in INR.
- **BE-PAY-02** Create a gateway order when the customer chooses online payment; return the gateway order ID and key to the frontend.
- **BE-PAY-03** Verify the payment signature on the server before marking an order paid.
- **BE-PAY-04** Webhook endpoint for payment success, failure and refund events, with signature verification and idempotent handling.
- **BE-PAY-05** Store a payment record per attempt: gateway, gateway order ID, payment ID, amount, status, method, timestamps.
- **BE-PAY-06** Cash on Delivery as a configurable option (enable/disable, maximum order value).
- **BE-PAY-07** Admin-initiated full or partial refunds through the gateway.
- **BE-PAY-08** Gateway keys and secrets come from environment variables, never from source code.

### 3.10 Billing and invoices

- **BE-BILL-01** Generate a GST-compliant invoice automatically when an order is paid (or when a COD order is delivered).
- **BE-BILL-02** Invoice numbers are sequential and unique per financial year (e.g. `RAG/2026-27/0001`).
- **BE-BILL-03** Tax calculation per line using the product's HSN code and GST rate. Same-state delivery uses CGST + SGST; other-state delivery uses IGST, based on the store's state and the shipping address state.
- **BE-BILL-04** Prices are displayed inclusive of GST; the invoice breaks out taxable value and tax.
- **BE-BILL-05** Invoice contents: store legal name, address and GSTIN; invoice number and date; order number; customer billing and shipping addresses; line items with HSN, quantity, unit price, discount, taxable value, tax rate and tax amounts; shipping charge; grand total in ₹; amount in words (Indian numbering, e.g. "Rupees One Lakh Twenty-Four Thousand ...").
- **BE-BILL-06** Render invoices as PDF (e.g. OpenPDF/iText or Thymeleaf + Flying Saucer) and store them.
- **BE-BILL-07** Customer endpoint to download their own invoice; admin endpoint to download or regenerate any invoice.
- **BE-BILL-08** Credit notes for refunds/returns, linked to the original invoice.

### 3.11 Shipping

- **BE-SHIP-01** Shipping charge rules configurable by admin (e.g. free above a ₹ threshold, flat fee otherwise).
- **BE-SHIP-02** Pincode serviceability check endpoint with estimated delivery days (initially from a configurable table; courier API integration later).

### 3.12 Reviews

- **BE-REV-01** Logged-in customers who received a product can post one rating (1–5) and review per product.
- **BE-REV-02** Public endpoint lists approved reviews and returns the average rating.
- **BE-REV-03** Admin can hide or approve reviews.

### 3.13 Notifications

- **BE-NOTIF-01** Emails for: registration welcome, password reset, order placed, payment success/failure, order shipped (with tracking), order delivered, cancellation, refund. Invoice PDF attached to the payment-success or delivery email.
- **BE-NOTIF-02** Optional SMS/WhatsApp for order updates.
- **BE-NOTIF-03** Email sending is asynchronous so it never blocks the API response.

### 3.14 Content management

- **BE-CMS-01** Admin CRUD for home page banners (image, title, subtitle, link, order, active dates).
- **BE-CMS-02** Admin can mark products as featured or new arrivals for home page strips.
- **BE-CMS-03** Contact form submissions are stored and emailed to the store.
- **BE-CMS-04** Newsletter subscription endpoint.

### 3.15 Admin reporting

- **BE-RPT-01** Sales summary by day/week/month (₹ revenue, order count, average order value).
- **BE-RPT-02** Top-selling products and categories.
- **BE-RPT-03** Export orders and invoices for a date range as CSV (for accounting/GST filing).

---

## 4. Data model (core entities)

`User`, `Role`, `Address`, `Category`, `Product`, `ProductVariant`, `ProductImage`, `Cart`, `CartItem`, `Wishlist`, `WishlistItem`, `Coupon`, `CouponUsage`, `Order`, `OrderItem`, `OrderStatusHistory`, `Payment`, `Invoice`, `InvoiceItem`, `CreditNote`, `Review`, `Banner`, `ShippingRule`, `PincodeServiceability`, `ContactMessage`, `NewsletterSubscriber`.

Key relationships:

- A `Category` has an optional parent `Category` and many `Product`s.
- A `Product` has many `ProductVariant`s and `ProductImage`s.
- A `User` has many `Address`es, one `Cart`, one `Wishlist`, many `Order`s and `Review`s.
- An `Order` has many `OrderItem`s (snapshots), many `OrderStatusHistory` rows, many `Payment`s and at most one `Invoice`.

---

## 5. Key API endpoints (summary)

| Area | Method & path | Access |
|---|---|---|
| Auth | `POST /api/v1/auth/register`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password` | Public |
| Profile | `GET/PUT /api/v1/me`, `PUT /api/v1/me/password` | Customer |
| Addresses | `GET/POST /api/v1/me/addresses`, `PUT/DELETE /api/v1/me/addresses/{id}` | Customer |
| Categories | `GET /api/v1/categories` | Public |
| Products | `GET /api/v1/products?category=&minPrice=&maxPrice=&size=&color=&sort=&page=`, `GET /api/v1/products/{slug}`, `GET /api/v1/products/{slug}/related` | Public |
| Search | `GET /api/v1/search?q=`, `GET /api/v1/search/suggest?q=` | Public |
| Home | `GET /api/v1/home` (banners, featured, new arrivals) | Public |
| Cart | `GET /api/v1/cart`, `POST /api/v1/cart/items`, `PATCH/DELETE /api/v1/cart/items/{id}`, `POST/DELETE /api/v1/cart/coupon`, `POST /api/v1/cart/merge` | Guest (cart token) or Customer |
| Wishlist | `GET/POST /api/v1/wishlist`, `DELETE /api/v1/wishlist/{productId}` | Customer |
| Orders | `POST /api/v1/orders`, `GET /api/v1/orders`, `GET /api/v1/orders/{orderNumber}`, `POST /api/v1/orders/{orderNumber}/cancel`, `POST /api/v1/orders/{orderNumber}/return` | Customer |
| Payments | `POST /api/v1/payments/create`, `POST /api/v1/payments/verify`, `POST /api/v1/payments/webhook` | Customer / Gateway |
| Invoices | `GET /api/v1/orders/{orderNumber}/invoice` (PDF) | Customer (own) |
| Shipping | `GET /api/v1/shipping/check?pincode=` | Public |
| Reviews | `GET /api/v1/products/{slug}/reviews`, `POST /api/v1/products/{slug}/reviews` | Public / Customer |
| Admin | `/api/v1/admin/products`, `/categories`, `/orders`, `/invoices`, `/coupons`, `/banners`, `/customers`, `/reviews`, `/reports` | Admin |

---

## 6. Non-functional requirements (brief)

- **NFR-01 Security:** HTTPS only; CORS limited to the frontend origin; protection against SQL injection, XSS and CSRF (if cookies are used); secrets in environment variables; customers can only access their own data.
- **NFR-02 Performance:** Product listing and detail APIs respond in under 500 ms at normal load; images are compressed and served in responsive sizes; lazy-load images on the frontend.
- **NFR-03 Reliability:** Payment and stock operations are transactional and idempotent.
- **NFR-04 Testing:** Unit tests for pricing, tax, coupon, inventory and order-status logic; integration tests for the main API flows (register → login → cart → order → payment → invoice).
- **NFR-05 Config:** Separate `dev` and `prod` profiles; database migrations with Flyway or Liquibase; seed data with sample categories and products for development.
- **NFR-06 Logging & audit:** Structured logs; admin actions on products, orders and refunds are audited.

---

## 7. Suggested folder layout

```
Rhythm Art Gallery website/
├── requirements.md      ← this file
├── backend/             ← Java (Spring Boot) API
└── frontend/            ← web client
```

## 8. Out of scope for the first version (can be added later)

- Multi-currency and international shipping
- Multiple sellers / marketplace
- Loyalty points and gift cards
- Live chat
- Native mobile apps
