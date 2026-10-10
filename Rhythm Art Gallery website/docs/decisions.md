# Decisions

Format: date · decision · why.

- **2026-10-10 · Stack = Next.js + TS + Tailwind + Prisma + Postgres.** One app for UI and API. Fewest moving parts for a small shop; matches the user's npm/prisma commands. Replaces the earlier Spring Boot design, which was sized for ~70k orders/day versus a boutique's tens.
- **2026-10-10 · Auth = Auth.js with Prisma adapter, email+password.** Free, users stay in our DB, cookie sessions avoid hand-rolled JWT refresh logic.
- **2026-10-10 · Payments = Razorpay, test mode first.** Gateway handles card/UPI data (we never see it). Live keys need shop KYC, not available at concept stage.
- **2026-10-10 · Hosting = Vercel + Neon + Cloudinary.** Free tiers cover a concept; git-push deploys; Cloudinary handles image resizing later.
- **2026-10-10 · Images in `public/images/` with naming convention.** Owner replaces files in place; seed data references filenames, so no code change.
- **2026-10-10 · No GST invoices in v1.** Depends on whether the shop is GST-registered. Simple receipt only until confirmed.
- **2026-10-10 · Login required to check out; browsing and cart open to guests.** Per original requirement. Guest checkout deferred (may raise conversion; revisit).
- **2026-10-10 · All project files live in `Rhythm Art Gallery website/`.** No `web/` subfolder; git repo root is its parent `Rhythm Art Gallery/`. User asked for everything inside the website folder.
- **2026-10-10 · Deleted `requirements.md`, `HLD report.md`, `LLD report.md`.** All written for Spring Boot and a ~150-requirement scope; stack and scope changed. `docs/vision.md` (what/why/scope) plus this file and the per-branch plan replace them. Recoverable from git history (commit e5a3848).
- **2026-10-10 · Palette = paper #fffdf9, cream #fdeed1, blush #ffcfdf, rani #c2185b, marigold #f5a524, peacock #0e7c86, ink #1e2a4f.** User delegated the choice: vibrant, eye pleasing, hint of white, light Indian embroidery + mountain-heritage feel. Blush/cream/navy are sampled from the RAG logo so the site matches it; rani and marigold add vibrance; peacock teal is the "mountain lake" hint.
- **2026-10-10 · Fonts = Playfair Display (headings), DM Sans (body).** Playfair matches the serif in the logo; DM Sans is clean and readable on phones. Loaded via `next/font` (no new dependency).
- **2026-10-10 · Background = hand-written layered-mountain SVG (`public/bg/mountains.svg`) + embroidery strip (`public/bg/embroidery-border.svg`), not from Haikei.** User allowed any SVG. Replaceable by dropping in a Haikei file with the same name.
- **2026-10-10 · Motion Primitives sources copied into `src/components/motion-primitives/`; excluded from ESLint.** Copied as published with two tiny type fixes (React 19 typings, a `motion` option missing in the installed version), marked in comments. Added `motion`; `cn` util is a 1-line local version (no clsx/tailwind-merge).
- **2026-10-10 · Folder layout: `docs/`, `src/{app,components,lib}`, `public/{brand,bg,images}`.** Tidier root; Next config files stay at root by convention.
- **2026-10-10 · Front end first on static data, one PR per stage, merged without waiting.** User asked to build the whole front end now, stop at backend or user input, and merge PRs as they go. Pages read `src/data/*.ts`; stage 4 swaps these for the database.
- **2026-10-10 · Browser-only cart (localStorage via `useSyncExternalStore`).** Lets Add to bag, cart and checkout work without a backend; becomes the guest cart that merges into the server cart at login.
- **2026-10-10 · Placeholder photos from Unsplash downloaded into `public/images/`.** User approved internet placeholders to be replaced later; ids and replacement rules in `public/images/README.md`.
- **2026-10-10 · Motion Primitives Carousel / Infinite Slider skipped.** They need lucide-react and react-use-measure; native scroll-snap does the job without new dependencies.
- **2026-10-10 · Login, register and place-order are preview-only.** They validate and say nothing was saved, rather than pretending to work.
- **2026-10-10 · Prisma 7.10 (pinned `prisma` and `@prisma/client` to the same version), Neon Postgres.** User approved prisma, zod, tsx, then the driver adapter `@prisma/adapter-pg` + `pg` (+ `@types/pg`), which Prisma 7 needs at runtime. Chosen over `@prisma/adapter-neon` so the code is not tied to Neon.
- **2026-10-10 · Money stored as whole rupees (Int), GST-inclusive; stock is per product (default 10, placeholder).** Matches the static data and Razorpay (rupees x 100 at the edge). Ceiling: no paise or coupons; per-size stock needs a variant table later.
- **2026-10-10 · First migration SQL was generated offline (`prisma migrate diff`), then applied with `prisma migrate deploy`.** A drift check afterwards showed no difference between database and schema. `src/generated/` (Prisma client) is git-ignored and rebuilt by `postinstall`.
- **2026-10-10 · Neon `dev` branch for all development; `production` untouched.** User chose a separate branch. Seed and test data stay off the branch that will go live.
- **2026-10-10 · Neon CLI run via `npx neon@latest`, only `login` and `link` (no skills, MCP, `neon.ts` or `deploy`).** The pasted setup would also have enabled Neon Auth on production, which conflicts with the locked Auth.js choice. User picked the minimal option.
- **2026-10-10 · Two connection strings: direct in `.env` (Prisma CLI), pooled in `.env.local` (running site).** Migrations are safest on a direct connection; serverless runtime benefits from the pooler. `sslmode=verify-full` is explicit because the `pg` driver warns that plain `require` will change meaning.
- **2026-10-10 · One feature per branch, no commit without being asked, ask before new dependencies.** User rule.
