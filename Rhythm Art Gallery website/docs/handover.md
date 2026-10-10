# Handover

Living status doc. Read this first when picking up the project. Updated at the end of every session, successful build, and commit.

**Last updated:** 2026-10-10 · front end complete on static data (PRs #1 to #9 merged). Stage 4 (data layer) started on branch `stage-4-data-layer`, partly done, blocked on Neon + one dependency approval.

## Project
Concept e-commerce site for a local boutique, Rhythm Art Gallery (RAG): saris, suits, jewellery, handbags, purses. Interactive floral-Indian-embroidery look, community page, cart, checkout, login, Razorpay payments (payments and login not live yet). See `vision.md`.

## Where things are
- Repo: https://github.com/ItsArpitPathak/Rhythm-Art-Gallery (private), branch `main`. Every change since stage 2 went through a GitHub PR; see `prhistory.md`.
- Local: `...\javaProject\Rhythm Art Gallery\` is the git root. The project lives in `Rhythm Art Gallery website/`.
- Layout: `docs/` (vision, objective, decisions, prhistory, this handover) · `src/app` (routes) · `src/components/{home,shop,site,auth,motion-primitives}` · `src/data` (placeholder catalogue + community) · `src/lib` (cart, validation, format, india) · `public/{brand,bg,images}` · root: `CLAUDE.md`, `.env.example`, config files.
- Website preferences: `~/.claude/global.md`.

## Stack (locked, ask before changing)
Next.js 16 + TypeScript + Tailwind 4 · Prisma + PostgreSQL · Auth.js (email+password) · Razorpay (test mode) · Motion Primitives · Vercel + Neon + Cloudinary · Vitest/Playwright.
Installed so far: next, react, typescript, tailwindcss, eslint, vitest, motion. **Not installed (need approval):** prisma, @prisma/client, next-auth, @auth/prisma-adapter, bcryptjs, zod, razorpay, playwright.

## What is built (front end, all on static data)
| Route | What |
|---|---|
| `/` | Hero (animated headline, rotating word, tilt arch photo, glow CTA), category tiles, new arrivals strip, craft story with count-up stats, community teaser, visit banner |
| `/shop`, `/shop/[category]` | Category tabs, price filter, sort, empty state |
| `/new-arrivals` | New pieces with per-category tabs |
| `/product/[slug]` | Hover zoom, size + quantity, Add to bag / Buy now, accordions, related items |
| `/cart` | Browser-only cart (localStorage), qty, remove, totals, placeholder shipping rule |
| `/checkout` | Address form with validation, payment choice, summary. **Preview only** |
| `/login`, `/register` | Forms with validation. **Preview only** |
| `/community` | Animated timeline, pillars, contact CTA |
| 404 | Styled |

Header: logo badge, nav, live cart count, login, animated mobile menu, scroll progress bar. Footer: embroidery divider, placeholder contact details.

## Checks (last run, all on `main`)
`npm run lint` clean · `npm run typecheck` clean · `npm test` 4 files, 13 tests pass · `npm run build` OK (all routes static). Browser-verified at desktop and 375px: no horizontal overflow on any page. `npm audit`: 5 high, dev-only (braces via eslint-config-next); fix would downgrade, not applied.

## Where I stopped: needs backend or your input
1. **Database / backend (objective stages 4, 7–10):** no Postgres, Prisma, auth, server cart, orders or payments exist. Login, register and "Place order" only show a preview notice. **Needs your approval for the backend dependencies, and a local or Neon Postgres.**
2. **Razorpay:** needs your test keys in a local `.env` (never committed).
3. **Real content from you:** product photos and details, shop address/phone/email/Instagram (placeholders in `src/components/site/nav-links.ts`), real community events and photos (`src/data/community.ts`), real stats (10+ years, 500+ pieces, 12 events are invented, in `components/home/craft-story.tsx`), care/shipping/returns text (placeholder copy), terms and privacy pages (links are not built).

## Skipped / stubbed / mocked / hard-coded
- All catalogue and community data is invented placeholder content; photos are Unsplash (ids in `public/images/README.md`).
- Cart is browser-only; shipping rule (free over ₹5,000, else ₹150) is a placeholder.
- Login, register, checkout: validation only, nothing saved or charged.
- Motion Primitives Carousel and Infinite Slider not used (they need lucide-react and react-use-measure); native scroll-snap row instead.
- Vendored Motion Primitives carry `@ts-nocheck` and are excluded from lint.
- Logo is a JPG with its own pink background (shown as a round badge); text on it says "Rhythm Artistry & Clothing" while the site says "Rhythm Art Gallery".
- Filters are client state, not in the URL. No search, wishlist, reviews, coupons, pincode check, invoices (out of scope for v1).
- Footer shows no copyright year (Next 16 forbids `new Date()` in a server render).
- No Terms/Privacy/Shipping/Returns/About/Contact pages yet.

## Assumptions to confirm
1. Logo wording vs the shop name (above).
2. Prices are GST-inclusive in ₹; no GST invoices in v1. Is the shop GST-registered?
3. COD: off. Guest checkout: not built (login required, per the original requirement).
4. Repo root is the parent folder `Rhythm Art Gallery/`, not the website folder. Flattening needs a history rewrite and force-push.
5. Placeholder shipping rule and return policy (7 days) are mine, not the shop's.

## Stage 4 status (branch `stage-4-data-layer`, draft PR, not merged)
Done offline and tested: Prisma schema (`prisma/schema.prisma`), `prisma.config.ts`, first migration SQL (`prisma/migrations/20261010000000_init`), seed row mapping (`prisma/seed-data.ts`, 3 tests), npm scripts `migrate`, `db:generate`, `db:seed`, `postinstall`. Installed: prisma 7.10.0, @prisma/client 7.10.0, zod, tsx.
`npm audit` now also reports 4 high in the `prisma` dev CLI (deepmerge-ts, bundled mysql2; we use Postgres only, CLI not shipped to production). The only fix downgrades Prisma to 6, not applied.

## Next action (needs you)
1. Create the Neon project and database yourself, then put the connection string in a local `.env` as `DATABASE_URL` (see `.env.example`). Do not paste it in chat.
2. Approve the Prisma driver adapter: `@prisma/adapter-pg` + `pg` (+ `@types/pg`), which Prisma 7 requires to talk to Postgres. (Or `@prisma/adapter-neon`.)
Then I apply the migration, write `src/lib/db.ts` and `prisma/seed.ts`, run the seed, move the pages from `src/data` to the database, and merge the PR.
