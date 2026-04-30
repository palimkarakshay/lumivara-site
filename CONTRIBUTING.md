# Contributing to `lumivara-site`

> _Lane: ⚪ Both — applies to contributors working in either lane until the P5.6 spinout._

This repo is operated primarily by an AI automation loop (Claude via GitHub Actions). Human contributions are welcome but follow a specific flow.

## Two co-housed entities (Dual-Lane Repo)

Until the P5.6 spinout, this repo hosts **two logically separate entities** that will split into two repos per the locked architecture in [`docs/mothership/02b-dual-lane-architecture.md`](docs/mothership/02b-dual-lane-architecture.md). Pick which entity your change targets before you start:

| Lane | Entity | If your change touches… |
|---|---|---|
| 🌐 **Site** | Lumivara People Advisory marketing site | `src/`, `public/`, `assets/`, `e2e/`, `mdx-components.tsx`, `next.config.ts`, `404.html`, `index.html`, `vercel.json` |
| 🛠 **Pipeline** | Lumivara Forge operator framework | `.github/workflows/`, `scripts/`, `dashboard/`, `docs/mothership/`, `docs/storefront/`, `docs/decks/`, `docs/research/`, `docs/migrations/`, `docs/n8n-workflows/`, `docs/_deprecated/`, top-level operator docs (`docs/AI_*.md`, `docs/MONITORING.md`, `docs/N8N_SETUP.md`, `docs/OPERATOR_SETUP.md`, `docs/TEMPLATE_REBUILD_PROMPT.md`, `docs/GEMINI_TASKS.md`) |
| ⚪ **Both** | Cross-cutting hygiene | `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, `package.json`, `tsconfig.json`, `.gitignore`, `.env.local.example` |

The lane map for every doc is in [`docs/00-INDEX.md`](docs/00-INDEX.md). The terminology policy that keeps Client #1 brand identifiers out of operator-scope docs is in [`docs/mothership/15-terminology-and-brand.md §6`](docs/mothership/15-terminology-and-brand.md). Run [`scripts/dual-lane-audit.sh`](scripts/dual-lane-audit.sh) before opening a PR that adds, moves, or renames anything structural.

## The normal path: create an Issue

Most changes start as a GitHub Issue, not a pull request:

1. Open an issue describing what you want changed.
2. The triage bot classifies and labels it within ~24 h.
3. The execute bot implements it on a branch and opens a PR.
4. The operator reviews and merges from their phone.

This works for copy edits, new insight articles, design tweaks, and new pages.

## When to open a PR directly

Open a PR directly only if:

- You are fixing a **production incident** and need an immediate deploy.
- The issue is labeled `human-only` (the bot won't touch it).
- You are working on bot infrastructure (`.github/workflows/`, `scripts/`).

## Local setup

Requires Node.js 20 or later.

```bash
git clone https://github.com/palimkarakshay/lumivara-site.git
cd lumivara-site
npm install
npm run dev
```

Open http://localhost:3000. No environment variables are required for local dev.

## Code standards

| Check | Command |
|---|---|
| TypeScript | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Unit tests | `npm test` |
| E2E tests | `npx playwright test` |

Both TypeScript and lint **must pass** before merging. Fix new errors you introduce; pre-existing errors on `main` are noted in the PR body.

## Commit message format

```
feedback(#<issue>): <short summary>
```

Example: `feedback(#42): add dark-mode toggle to nav`

One logical change per commit. If an implementation spans multiple steps, use multiple commits on the same branch.

## Content locations

| What | Where |
|---|---|
| Page copy | `src/content/` |
| Services | `src/content/services.ts` |
| Insight articles (MDX) | `src/content/insights/` |
| Site-wide settings | `src/lib/site-config.ts` |
| Design tokens | `src/app/globals.css` |

## Hard exclusions (bot and humans alike)

The following paths cannot be edited by the bot in a normal `auto-routine` PR. Human edits also require explicit reasoning in the PR description.

| Path | Why it's excluded |
|---|---|
| `.github/workflows/*` | Workflow changes need the `infra-allowed` label and operator review. Cron-triggered workflows fan out across the engagement; one bad merge breaks the autopilot. |
| `.env*` files | Secrets live in Vercel env vars (Site lane) or GitHub Actions org secrets (Pipeline lane); never committed. See [`docs/mothership/03-secure-architecture.md §3`](docs/mothership/03-secure-architecture.md). |
| `src/app/api/contact/*` | Human-only by design; the contact form is a trust boundary. |
| `src/auth.ts`, `src/middleware.ts`, `src/lib/admin/*` | The `/admin` portal trust boundary; auth changes need human review per [`docs/ADMIN_PORTAL_PLAN.md`](docs/ADMIN_PORTAL_PLAN.md). |
| `docs/mothership/02b-dual-lane-architecture.md`, `docs/mothership/dual-lane-enforcement-checklist.md` | Dual-Lane Repo is locked; changes need an explicit ADR-shaped commit and operator sign-off. |
| `scripts/dual-lane-audit.sh` allow-lists | Carving an exemption requires explaining the rationale in the same PR. |
| Deleting existing pages or doc files | Requires human sign-off (the bot can move/rename but not delete). |

When opening a PR that has to touch any of these, name the rule in the PR description and link to the issue that authorises the carve-out.

## Design system

See the **Design system** table in `README.md` for tokens. Use the existing Tailwind utilities (`bg-canvas`, `text-accent`, etc.) rather than raw hex values.

## Need help?

Open an issue with the `status/needs-clarification` label.

> _Client example — see `docs/mothership/15-terminology-and-brand.md §7`._ For Client #1 today, the support email is `hello@lumivara.ca`. Once the operator brand domain `lumivara-forge.com` is registered (per `15 §5`), Pipeline-lane support questions will move to `hello@lumivara-forge.com`.
