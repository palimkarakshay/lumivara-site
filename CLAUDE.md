<!-- This file is loaded automatically by Claude Code when a session starts in this repo.
     The @-include below pulls in AGENTS.md, which carries the binding charter
     (Dual-Lane lane awareness, Next.js gotchas, session-budget gates, Vercel parity).
     Read AGENTS.md first — its hard rules override anything below if they ever conflict.
     The rest of this file is the practical build/test/architecture layer that AGENTS.md
     deliberately does not duplicate. -->

@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Lane check before touching files

Two entities live in this tree (see AGENTS.md → "Dual-Lane Repo lane awareness" and `docs/00-INDEX.md`). Before editing, identify the lane the file belongs to:

- 🌐 **Site** — Next.js marketing site. `src/`, `public/`, `assets/`, `e2e/`, `mdx-components.tsx`, `next.config.ts`, `vercel.json`, `404.html`, `index.html`.
- 🛠 **Pipeline** — operator framework. `.github/workflows/`, `scripts/`, `dashboard/`, most of `docs/` (mothership, storefront, decks, research, migrations, n8n-workflows, _deprecated, ops, plus operator-scoped top-level docs).
- ⚪ **Both** — root hygiene files: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `AGENTS.md`, `CLAUDE.md`, `package.json`, `tsconfig.json`, `.gitignore`, `.env.local.example`.

A Site-lane issue must not modify Pipeline-lane files unless the issue carries the `infra-allowed` label. Run `bash scripts/dual-lane-audit.sh` after any structural change (rename, new top-level file, new doc folder); update `docs/00-INDEX.md` and `.dual-lane.yml` in the same PR.

## Commands

Node.js 20+ required. The TypeScript path alias `@/*` resolves to `./src/*` (in both `tsconfig.json` and `vitest.config.ts`).

| Task | Command |
|---|---|
| Dev server | `npm run dev` (http://localhost:3000) |
| Production build | `npm run build` |
| Serve build | `npm run start` |
| Lint | `npm run lint` |
| Type check | `npm run type-check` (alias for `tsc --noEmit`) |
| Format | `npm run format` |
| Unit tests | `npm test` or `npm run test:unit` (Vitest, node env) |
| Single unit test | `npx vitest run src/__tests__/<file>.test.ts` |
| Watch a unit test | `npx vitest src/__tests__/<file>.test.ts` |
| E2E tests | `npm run test:e2e` (Playwright; auto-runs `npm run build && npm run start` on :3000) |
| Single e2e test | `npx playwright test e2e/smoke.spec.ts` |

TypeScript and lint **must pass** before merge. Fix new errors you introduce; pre-existing errors on `main` should be noted in the PR body, not silently masked.

## Site-lane architecture (Next.js 16, App Router, RSC)

**Important:** Next.js 16 has breaking changes vs. older training data. When the API surface is uncertain, consult `node_modules/next/dist/docs/` rather than guessing. React 19, Tailwind v4, MDX 3.

### Source layout

```
src/
  app/                       App Router routes (RSC by default)
    layout.tsx               root layout
    page.tsx                 home
    {about,how-we-work,fractional-hr,career-coaching,contact,privacy}/page.tsx
    what-we-do/{page.tsx,[slug]/page.tsx}     services hub + dynamic detail
    insights/{page.tsx,[slug]/page.tsx}       MDX article index + dynamic page
    admin/                   /admin portal (Auth.js v5; trust boundary)
    api/{contact,newsletter,auth}/            route handlers
    sitemap.ts, robots.ts, opengraph-image.tsx, llms.txt
    globals.css              Tailwind v4 layer + design tokens
  components/
    sections/                page sections (HomeHero, ServicesGrid, FAQSection, …)
    ui/                      shadcn/ui primitives (button, dialog, accordion, …)
    primitives/              lower-level primitives
    admin/                   admin-portal-only components
    layout/                  shared layout chrome
  content/                   editable copy — one file per page (see below)
  lib/
    site-config.ts           tagline, nav, contact, calLink — single source of truth
    mdx.ts                   MDX loader/frontmatter helpers for insights
    utils.ts, themes.ts
    admin/                   admin-portal helpers (auth, vercel, github, webhooks)
    dashboard/               dashboard data helpers
  hooks/
  __tests__/                 Vitest specs (note: lives under src/, not /tests)
  auth.ts                    Auth.js v5 entry (trust boundary)
  proxy.ts
mdx-components.tsx           global MDX component overrides (root, not in src/)
```

### Content edit pattern

All page copy is in `src/content/` as `export const` modules. To change page copy, edit the string — do not touch the rendering component. Map:

| File | Page |
|---|---|
| `home.ts`, `about.ts`, `how-we-work.ts`, `contact.ts`, `fractional-hr.ts`, `lumivara-infotech.ts` | matching route |
| `services.ts` | `/what-we-do` and all `[slug]` service detail pages. **Body copy is verbatim from lumivara.ca — do not paraphrase.** |
| `partnership-process.ts`, `faqs.ts`, `diagnostic.ts` | section data |
| `site.ts` + `src/lib/site-config.ts` | tagline, contact, nav, Cal.com link |
| `insights/*.mdx` | insight articles (frontmatter + body) |
| `_comparison/*.md` | notes on diffs vs. the old lumivara.ca site (do not render) |

### Adding an insight article

Drop a new `.mdx` file in `src/content/insights/`. No further wiring — the dynamic route picks it up. Required frontmatter:

```yaml
---
title: "Article title"
excerpt: "One-sentence summary"
category: "perspective"   # or: practice, qa
date: "YYYY-MM-DD"
readingTime: "5 min"
---
```

MDX is rendered through `mdx-components.tsx` (root) which styles `h1`–`h3`, `p`, `a`, lists, blockquote, etc. with the design-token utilities — write plain markdown and it will look right.

### Design system

Tokens live in `src/app/globals.css`. Use the existing Tailwind utilities, not raw hex:

- Surfaces: `bg-canvas`, `bg-ink`, `bg-parchment`
- Text: `text-ink`, `text-ink-soft`, `text-accent`, `text-accent-deep`
- Borders: `border-border-subtle`
- Type scale: `text-display-xl` → `text-caption`; `text-label` (mono uppercase micro-labels)

shadcn/ui components are added with `npx shadcn@latest add <component>`; registry config in `components.json` (style: `base-nova`, base color: neutral, on Base UI React).

### Hard-exclusion paths (bot-PRs cannot edit without a labelled carve-out)

From `CONTRIBUTING.md` § Hard exclusions:

- `.github/workflows/*` — needs `infra-allowed` label.
- `.env*` — secrets live in Vercel (Site) / GitHub Actions org secrets (Pipeline). Never commit.
- `src/app/api/contact/*` — human-only by design (trust boundary).
- `src/auth.ts`, `src/middleware.ts`, `src/lib/admin/*` — `/admin` portal trust boundary; auth changes need human review.
- `docs/mothership/02b-dual-lane-architecture.md`, `docs/mothership/dual-lane-enforcement-checklist.md` — locked architecture.
- `scripts/dual-lane-audit.sh` allow-lists — exemptions must be justified in the same PR.
- Deletion of pages or doc files — humans only (move/rename is fine).

## Pipeline-lane orientation

Day-to-day Site work is driven by GitHub Actions running Claude (issue → branch → PR → Vercel preview). The Pipeline-lane assets that make that work:

- `.github/workflows/` — `triage.yml` (15 min), `plan-issues.yml` (1h), `execute*.yml` (1h + dispatched), `codex-review.yml` (PR opened), `auto-merge.yml`, `dual-lane-watcher.yml` (daily audit), plus monitor/seeder/forge variants. See `README.md` § 6 for the full table.
- `scripts/` — `triage-prompt.md`, `execute-prompt.md`, `plan-issue.py`, `codex-*.py`, `dual-lane-audit.sh`, `forge-spinout-dry-run.sh`, etc. Helper modules in `scripts/lib/`.
- `dashboard/` — separate Next.js app (excluded from the root `tsconfig.json`); built and deployed by its own workflow.
- `docs/mothership/` — operator playbooks; `docs/ops/operator-playbook.md` is the operator's daily front door.
- `.dual-lane.yml` — machine-readable lane manifest. Every tracked file must classify here or `forge-spinout-dry-run.sh` fails.

## Vercel mirror discipline (Site lane)

Vercel deploys `main` automatically; it does **not** see Pipeline-lane changes. Any Site change that affects production behaviour beyond code (new env var, redirect/rewrite, build command, output config) requires:

1. A `**Vercel mirror required:**` section in the PR description listing exact dashboard steps.
2. The `needs-vercel-mirror` label on the issue (operator removes it once mirrored).

`vercel.json` currently uses an `ignoreCommand` that skips builds unless `src/`, `public/`, `package.json`, `next.config*`, `tailwind.config*`, or `postcss.config*` changed.

## Conventions

- Commit message: `feedback(#<issue>): <short summary>` (one logical change per commit; multi-step work spans multiple commits on the same branch).
- Branch naming for bot work: `auto/issue-<n>`. Continuation branches when a session exits at the budget gate also live under `auto/`.
- Path imports: use `@/...` (resolves to `src/...`), not relative `../../`.
- Prettier config: 2-space, double quotes, trailing commas (es5), 88-col, with `prettier-plugin-tailwindcss` for class sorting.
- ESLint: `eslint-config-next` plus `_`-prefix unused vars are warnings only; `react/no-unescaped-entities` is off.
- Vitest specs live in `src/__tests__/` (and any `**/*.test.ts(x)` under `src/`), node environment, globals on.
- Playwright runs against a real production build on :3000; do not point it at the dev server.
