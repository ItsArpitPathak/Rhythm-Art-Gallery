# PR history

One entry per pull request: what the PR did, and what it changed in the original source (`main`). Newest last. Updated with every PR.

Before PR #1 there was no PR workflow: docs went straight to `main`, and stage 1 was merged locally.

## Pre-PR work (direct to `main`)
- **Docs baseline** (`e5a3848`, `6867a40`, `c3b27cd`, `92e171c`, `86bde08`): vision, decisions, CLAUDE.md, handover, objective, `.env.example`; moved everything into the website folder; deleted the obsolete Spring Boot requirements/HLD/LLD.
- **Stage 1: scaffold** (branch `stage-1-scaffold`, merged locally as `a480343`, no GitHub PR). Next.js + TypeScript + Tailwind + ESLint + Vitest, npm scripts, blank page, `formatINR` with a test. Changed `main`: added the whole app skeleton (`package.json`, `tsconfig.json`, `src/app`, `src/lib`).

## PR #1 — Stage 2: design system and site shell
- Branch `stage-2-design-shell`. Status: merged.
- **What:** palette and fonts, hand-drawn mountain background and embroidery divider SVGs, header (logo badge, nav, cart icon, login, animated mobile menu, scroll progress bar), footer with placeholder contact details, RAG logo.
- **Changed in `main`:** docs moved into `docs/`, code into `src/`, logo into `public/brand/`; `globals.css` and `layout.tsx` rewritten with tokens/fonts/shell; added `src/components/site/*`, two copied Motion Primitives (Disclosure, ScrollProgress), `motion` dependency, ESLint ignore for the vendored folder; home page replaced by a placeholder.

## PR #2 — Stage 3: interactive landing page
- Branch `stage-3-landing`. Status: merged.
- **What:** full landing page on static data: hero (animated headline, rotating category word, tilting arch photo, magnetic glowing CTA), category tiles, new-arrivals scroll strip, craft story with count-up stats, community teaser, visit banner. 32 placeholder Unsplash photos plus a README for swapping them.
- **Changed in `main`:** home page rebuilt from the placeholder; added `src/components/home/*`, `shop/product-card`, `site/section-heading`, `src/data/{catalog,community}.ts` with a data/image-integrity test, `formatPrice`, eight more copied Motion Primitives, and `public/images/**`.

## PR #3 — Cart UI (browser-only cart)
- Branch `cart-ui`. Status: merged.
- **What:** a working cart that lives in the browser: add/merge lines, change quantity (max 10), remove, totals with a placeholder shipping rule, empty state, and a live cart count in the header. Backend cart is deferred.
- **Changed in `main`:** added `src/lib/{cart,use-cart}.ts` (+ tests), `components/shop/cart-view.tsx`, `/cart` route; header badge now reads the real count instead of a hard-coded 0; Vitest got an `@` alias.

## PR #4 — Catalogue UI: shop, categories, product page, new arrivals
- Branch `catalogue-ui`. Status: merged.
- **What:** browse the shop with category tabs, price filter and sort; per-category pages; a new-arrivals page with category tabs; product detail with hover zoom, size and quantity pickers, working Add to bag / Buy now, accordions and related items; styled 404.
- **Changed in `main`:** added routes `/shop`, `/shop/[category]`, `/new-arrivals`, `/product/[slug]`, `not-found`; components `product-browser`, `add-to-bag`, `zoom-image`, `page-header`; one more copied Motion Primitive (Animated Background). Home-page links to categories and products now resolve.

## PR #5 — Community page
- Branch `community-ui`. Status: merged.
- **What:** the community page: an animated timeline of events the shop joined, three "how we show up" pillars, and an event-invite contact link.
- **Changed in `main`:** added `/community` route; added a fifth placeholder event to `src/data/community.ts`. Home teaser, nav and footer links to `/community` now resolve.

## PR #6 — Login and register UI
- Branch `auth-ui`. Status: merged.
- **What:** login and register pages with client-side validation and a preview notice on submit. No account is created: that needs the backend.
- **Changed in `main`:** added `/login` and `/register` routes, `components/auth/*`, and `src/lib/validation.ts` (+ tests; also holds the address validator used later by checkout). Header and footer Login links now resolve.

## PR #7 — Checkout UI
- Branch `checkout-ui`. Status: merged.
- **What:** the checkout screen: address form with validation, payment-method choice, order summary from the cart. Place order shows a preview notice; no order or payment happens without the backend.
- **Changed in `main`:** added `/checkout` route, `components/shop/checkout-view.tsx`, `src/lib/india.ts` (state list). "Proceed to checkout" and "Buy now" now land on a real page.

## PR #8 — Mobile polish and handover docs
- Branch `polish-and-docs`. Status: merged.
- **What:** fixed small sideways overflow on the home and community pages on phones; rewrote the handover to say exactly what is built, what is stubbed, and where the front end stops.
- **Changed in `main`:** layout content wrapper now clips horizontal overflow; `docs/handover.md` rewritten; `docs/objective.md` gained a status table; `docs/decisions.md` gained the front-end-first decisions.
