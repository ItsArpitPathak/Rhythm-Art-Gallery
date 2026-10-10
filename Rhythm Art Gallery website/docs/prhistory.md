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
