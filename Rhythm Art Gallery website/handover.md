# Handover

Living status doc. Read this first when picking up the project. Updated at the end of every session, successful build, and commit.

**Last updated:** 2026-10-10 · after commit `c3b27cd` + handover added

## Project
Concept e-commerce site for a local boutique (saris, suits, jewellery, handbags/purses). Interactive landing, floral Indian embroidery look, login, Razorpay payments. See `vision.md`.

## Where things are
- Repo: https://github.com/ItsArpitPathak/Rhythm-Art-Gallery (private), branch `main`.
- Local: `...\javaProject\Rhythm Art Gallery\` is the git root. All project files in `Rhythm Art Gallery website/`.
- Files: `vision.md` (what/why/scope), `docs/decisions.md` (decisions + reasons), `CLAUDE.md` (rules, commands, style), `.env.example`, `.gitignore`, this file.
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
| 1. scaffold | **not started** | Waiting on dependency approval |
| 2–13 | not started | See plan file for order |

## Commits
- `e5a3848` Add vision, decisions, project rules and env template
- `6867a40` Move all project files into Rhythm Art Gallery website folder
- `c3b27cd` Remove obsolete Spring Boot requirements, HLD and LLD

## Checks (lint / type check / tests)
Not run yet. No code exists.

## Skipped / stubbed / mocked / hard-coded
Nothing built yet. Deferred by design: GST invoices, courier API, email, reviews, wishlist, coupons, admin panel (step 12, optional).

## Open questions / assumptions to confirm
1. Dependency list approval (next, react, typescript, tailwindcss, prisma, @prisma/client, next-auth, @auth/prisma-adapter, bcryptjs, zod, razorpay, motion, vitest, eslint, playwright).
2. Make `Rhythm Art Gallery website/` the git root (needs history rewrite + force push)? Currently its parent is the root.
3. `npx prisma migrate dev` is the intended migrate command?
4. Repo private OK? Name is `Rhythm-Art-Gallery` (GitHub disallows spaces).
5. GST registration status of the shop (decides whether invoices are ever needed).
6. COD option on or off (default off).
7. Admin panel in v1 or later.

## Needed from user before design step
Realtime Colors hex codes · heading + body fonts · Haikei SVG path · shop name/logo, contact, address · community content (events, dates, photos, text).

## Next action
Get dependency approval, then branch `scaffold` and set up Next.js, Tailwind, ESLint, Vitest and the npm scripts (`dev`, `test`, `lint`, `typecheck`).
