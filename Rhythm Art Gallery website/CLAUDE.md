# Rhythm Art Gallery

Boutique e-commerce concept site. Read `docs/vision.md` first, then `docs/objective.md` (stages; check it to see what is done and what is next), `docs/decisions.md` for why. Website preferences: `~/.claude/global.md`. App code lives in this folder (`Rhythm Art Gallery website/`): `src/` (app, components, lib), `public/` (brand, bg, images), `docs/`.

## Stack (locked, ask before changing)
Next.js (App Router) + TypeScript + Tailwind · Prisma + PostgreSQL · Auth.js · Razorpay (test mode) · Motion Primitives for animation.

## Commands (run in this folder)
- dev: `npm run dev`
- test: `npm test`
- lint: `npm run lint`
- type check: `npm run typecheck`
- migrate: `npx prisma migrate dev`

## Rules
- Never commit secrets. All secrets in env vars, documented in `.env.example`.
- Every API endpoint needs: input validation (Zod), auth check, authorization check, test.
- Every DB change goes through a Prisma migration file. Never edit DB by hand.
- Run lint, type check, full test suite before saying a task is done. Show output.
- Ask before adding a new dependency.
- Small reviewable changes. One feature per branch. Commit/push only when asked.
- Record decisions and reasons in `docs/decisions.md`.
- Keep `docs/handover.md` current: update it at the end of every session, successful build, and successful commit (status, commits, checks, skipped items, open questions, next action).
- Build UI one section at a time; stop after each. Only palette/fonts from the user. Copy Motion Primitives source, don't rewrite.

## Style
- Replies to user: caveman.
- Writing code: ponytail.

## End of every big task, append
1. Lint, type check, full test output.
2. Every change made and why.
3. Anything skipped, stubbed, mocked or hard-coded.
4. Assumptions made or to confirm. Confirm them with the user.
