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
