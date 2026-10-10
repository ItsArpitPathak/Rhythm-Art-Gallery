# Decisions

Format: date · decision · why.

- **2026-10-10 · Stack = Next.js + TS + Tailwind + Prisma + Postgres.** One app for UI and API. Fewest moving parts for a small shop; matches the user's npm/prisma commands. Replaces the earlier Spring Boot design, which was sized for ~70k orders/day versus a boutique's tens.
- **2026-10-10 · Auth = Auth.js with Prisma adapter, email+password.** Free, users stay in our DB, cookie sessions avoid hand-rolled JWT refresh logic.
- **2026-10-10 · Payments = Razorpay, test mode first.** Gateway handles card/UPI data (we never see it). Live keys need shop KYC, not available at concept stage.
- **2026-10-10 · Hosting = Vercel + Neon + Cloudinary.** Free tiers cover a concept; git-push deploys; Cloudinary handles image resizing later.
- **2026-10-10 · Images in `public/images/` with naming convention.** Owner replaces files in place; seed data references filenames, so no code change.
- **2026-10-10 · No GST invoices in v1.** Depends on whether the shop is GST-registered. Simple receipt only until confirmed.
- **2026-10-10 · Login required to check out; browsing and cart open to guests.** Per original requirement. Guest checkout deferred (may raise conversion; revisit).
- **2026-10-10 · All project files live in `Rhythm Art Gallery website/`.** No `web/` subfolder; git repo root is its parent `Rhythm Art Gallery/`. User asked for everything inside the website folder. Old Spring Boot docs kept alongside, marked superseded.
- **2026-10-10 · One feature per branch, no commit without being asked, ask before new dependencies.** User rule.
