# Handoff (updated 2026-10-11)

Snapshot for whoever resumes next. `docs/handover.md` is the long-lived status doc; this file is the session summary and the exact way to pick up. No secrets are stored here.

## Where things stand
- `main` includes PR #12 (`78a8dd3`), the UI polish pass, plus the earlier handoff PR #11. 12 PRs merged, all listed in `docs/prhistory.md`.
- **Front end:** complete on the static data (home, shop, categories, new arrivals, product page, cart, checkout preview, login/register preview, community, 404). Browser-only cart works.
- **Data layer (stage 4):** done. Neon project `rhythmArtGallery`, `dev` branch holds the migrated schema and the seeded placeholder catalogue (5 categories, 26 products, 5 events). `src/lib/db.ts` is the Prisma client (`@prisma/adapter-pg`).
- **Pages still read `src/data/*.ts`, not the database.** Switching them is stage 5.
- **Checks on `main`:** lint clean, typecheck clean, 17 of 17 tests pass (includes a read-only test against the Neon dev database), build OK.
- **PR #12 merged** (`78a8dd3`): motion tuning, category bento, mobile tap targets. Lint, typecheck and 17 tests pass; no CI is configured. Not tested on a real phone (measured at 375px with browser emulation only). Branch `ui-polish-mobile` still exists on GitHub; delete if unwanted.
- Dev server is **not** running. No background tasks are running.

## What happened this session
1. Reviewed the old Spring Boot docs, replaced the plan with Next.js + Prisma + Postgres; wrote vision, objective, decisions, handover, prhistory.
2. Built stages 1 to 3 and the whole front end in 8 PRs, then a VS Code terminal profile (PR #9).
3. Stage 4: schema, migration and seed. A second Claude session working in the same folder finished and merged it (PR #10) while this session was also editing. This session briefly overwrote that session's `src/lib/db.ts` and `prisma/seed.ts` in the working tree; both were restored from git, nothing was lost or committed wrongly.

4. UI polish session (2026-10-11), using the Emil Kowalski and taste-skill guidance: removed decorative loops (hero glow, rotating word), added press feedback and 300ms ease-out hovers, category bento, reduced-motion support, fixed-layer background, and raised every mobile tap target to 44px with 16px inputs on phones. Home-page stats left as the invented placeholders by choice. Skills were installed into `javaProject/.agents/skills/` (outside the repo, not committed). `npx impeccable install` failed twice (download timeout), nothing installed.

**Lesson:** run one session per repo at a time. Two sessions writing the same files will clobber each other.

## How to resume
```bash
cd "Rhythm Art Gallery website"
npm install        # also runs prisma generate
npm run dev        # http://localhost:3000
npm run lint ; npm run typecheck ; npm test
npm run db:seed    # re-runnable, upserts by slug
```
- Windows PowerShell blocks npm scripts: the committed `.vscode/settings.json` opens a terminal with a per-session policy. Otherwise use `npm.cmd` or Command Prompt.
- Local env files are git-ignored: `.env` (direct `DATABASE_URL` for the Prisma CLI) and `.env.local` (pooled strings from `neon link`). Template: `.env.example`. Never commit or paste real values.
- Workflow: one branch and one PR per stage, merged after lint/typecheck/test/build pass, with an entry added to `docs/prhistory.md`. Replies in caveman style, code in ponytail style (see `CLAUDE.md`).

## Next steps, in order
0. Optional quick wins: try a real-phone check of PR #12; retry `npx impeccable install`; delete the merged branch `ui-polish-mobile`.
1. **Stage 5:** read products, categories and events from the database in server components via `src/lib/db.ts` (keep the look identical), with tests. Then drop or shrink `src/data/*.ts` (the seed still uses it as the source).
2. **Stage 7 (auth):** needs approval for `next-auth`, `@auth/prisma-adapter`, `bcryptjs` (zod is installed). Real login, protected routes, server-side validation.
3. **Stage 8 (server cart + merge on login), stage 9 (Razorpay):** needs `razorpay` and your Razorpay **test keys** in `.env`.
4. Later: orders/account, optional admin, hardening (Playwright), deploy to Vercel.

## Open questions for the owner
1. Logo text says "Rhythm Artistry & Clothing"; the site says "Rhythm Art Gallery". Which name is right?
2. Is the shop GST-registered? (Prices are GST-inclusive; no GST invoices in v1.)
3. Shipping rule (free over ₹5,000, else ₹150) and 7-day returns are placeholders: confirm or replace.
4. COD stays off and guest checkout is not built (login required to check out): OK?
5. Git root is the parent folder `Rhythm Art Gallery/`; flattening to the website folder needs a history rewrite and force-push. Do you want it?

## Content still needed from the owner
Real product photos and details, shop phone/address/email/Instagram (placeholders in `src/components/site/nav-links.ts`), real community events and photos (`src/data/community.ts`), real stats (10+ years, 500+ pieces, 12 events are invented in `src/components/home/craft-story.tsx`), care/shipping/returns wording, Terms and Privacy pages.

## Known gaps and stubs
- Login, register and "Place order" validate only; nothing is saved or charged.
- All catalogue and community content is placeholder; photos are Unsplash (ids in `public/images/README.md`).
- Stock is one number per product (default 10), money is whole rupees: fine for v1, revisit for per-size stock or paise.
- Vendored Motion Primitives carry `@ts-nocheck` and are excluded from lint.
- `npm audit`: 4 high in the `prisma` dev CLI plus 5 dev-only in `eslint-config-next`; fixes would downgrade Prisma or Next lint config, not applied.
- No Terms, Privacy, Shipping, Returns or About pages; filters are not in the URL; no search.
