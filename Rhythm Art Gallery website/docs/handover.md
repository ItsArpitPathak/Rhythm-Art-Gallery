# Handover

Living status doc. Read this first when picking up the project. Updated at the end of every session, successful build, and commit.

**Last updated:** 2026-10-10 · stage 1 merged to `main` (`a480343`); stage 2 built on `stage-2-design-shell`, awaiting review

## Project
Concept e-commerce site for a local boutique (saris, suits, jewellery, handbags/purses). Interactive landing, floral Indian embroidery look, login, Razorpay payments. See `docs/vision.md`.

## Where things are
- Repo: https://github.com/ItsArpitPathak/Rhythm-Art-Gallery (private), branch `main`.
- Local: `...\javaProject\Rhythm Art Gallery\` is the git root. All project files in `Rhythm Art Gallery website/`.
- Layout: `docs/` (vision, objective, decisions, this handover) · `src/` (app, components, lib) · `public/` (brand logo, bg svg, images) · root: `CLAUDE.md`, `.env.example`, config files.
- Preferences for building websites: `~/.claude/global.md` (palette from Realtime Colors, 2 fonts, Haikei SVG, Motion Primitives, one section at a time). Pointer added in `~/.claude/CLAUDE.md`.

## Locked stack (ask before changing)
Next.js + TypeScript + Tailwind · Prisma + PostgreSQL · Auth.js (email+password) · Razorpay (test mode) · Motion Primitives · Vercel + Neon + Cloudinary · Vitest/Playwright.

## Done so far
| Step | Status | Notes |
|---|---|---|
| Review of old Spring Boot docs | done | Verdict: over-engineered for a boutique; stack changed |
| Plan approved | done | Plan file: `~/.claude/plans/uh-i-need-to-clever-firefly.md` |
| 0. docs | done | vision, decisions, CLAUDE.md, .env.example, .gitignore |
| Old `requirements.md`, `HLD report.md`, `LLD report.md` | deleted | Obsolete; in git history at `e5a3848` |
| 1. scaffold | **done, merged** | Merged to `main` as `a480343`. Next.js 16 + TS + Tailwind 4 + ESLint + Vitest. Lint, typecheck, test, build all pass |
| 2. design system + shell | **built, awaiting review** | Branch `stage-2-design-shell`. Palette, fonts, bg SVGs, header (Disclosure mobile menu, ScrollProgress bar), footer, logo. Checked in browser at desktop + 375px |
| 3–13 | not started | See `docs/objective.md` |

## Commits
- `e5a3848` Add vision, decisions, project rules and env template
- `6867a40` Move all project files into Rhythm Art Gallery website folder
- `c3b27cd` Remove obsolete Spring Boot requirements, HLD and LLD
- `92e171c` Add handover.md
- `86bde08` Add objective.md (on `main`)
- `7663213` Stage 1 scaffold; `a480343` merge of stage 1 into `main`

## Checks (lint / type check / tests)
Stage 2: lint clean, typecheck clean, test 1/1, build OK, browser check OK, no console errors. Stage 1: `npm run lint` clean, `npm run typecheck` clean, `npm test` 1/1 pass, `npm run build` OK. `npm audit`: 5 high, all dev-only (braces ReDoS via eslint-config-next); fix would downgrade eslint-config-next to 14, so not applied.

## Skipped / stubbed / mocked / hard-coded
Stage 2: cart count hard-coded 0; nav links (/shop, /new-arrivals, /community, /cart, /login) 404 until their stages; shop phone/email/address/Instagram are placeholders (`src/components/site/nav-links.ts`); home is a placeholder until stage 3; footer has no year (Next 16 cache components forbid `new Date()` in a server render); `cn` has no tailwind-merge; logo is a JPG with its own pink background, shown as a round badge. Stage 1: `AGENTS.md` came from the Next.js template (kept). Deferred by design: GST invoices, courier API, email, reviews, wishlist, coupons, admin panel (step 12, optional).

## Open questions / assumptions to confirm
1. Stage 1 deps installed (next, react, typescript, tailwindcss, eslint, vitest, @types/node bumped to 24 to satisfy vitest). Assumed "start stage 1" approved those; later-stage deps (prisma, next-auth, zod, razorpay, motion, bcryptjs, playwright) still need approval.
2. Make `Rhythm Art Gallery website/` the git root (needs history rewrite + force push)? Currently its parent is the root.
3. `npx prisma migrate dev` is the intended migrate command?
4. Repo private OK? Name is `Rhythm-Art-Gallery` (GitHub disallows spaces).
5. GST registration status of the shop (decides whether invoices are ever needed).
6. COD option on or off (default off).
7. Admin panel in v1 or later.

## Needed from user before design step
Realtime Colors hex codes · heading + body fonts · Haikei SVG path · shop name/logo, contact, address · community content (events, dates, photos, text).

## Next action
User reviews stage 2 and merges; supply real shop contact details. Then stage 3 (landing page, section by section).
