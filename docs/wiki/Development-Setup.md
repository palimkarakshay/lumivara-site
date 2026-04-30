# Development Setup ⚪

> **Lane:** ⚪ Both. The "Both lanes" sections below apply equally on the platform repo and on every per-client `<slug>-site` / `<slug>-pipeline` repo. The "🛠 Operator-only setup" section applies only on operator-owned repos. See [[_partials/lane-key]] for the badge legend.

## Prerequisites

- Node.js 20 or later (`node --version`)
- npm 10 or later (comes with Node 20)
- Git

## Both lanes

These steps work the same way on the mothership repo *and* on a client repo. A client onboarding their per-client repo follows exactly this sub-section and stops here.

### Clone and install

```bash
git clone https://github.com/<org>/<client-repo>.git
cd <client-repo>
npm install
```

For the mothership: replace `<org>/<client-repo>` with `palimkarakshay/{{BRAND_SLUG}}-mothership`.

> _Client example — see `docs/mothership/15-terminology-and-brand.md §7`._ For the current Client #1 the placeholder resolves to `palimkarakshay/lumivara-site` (and to `palimkarakshay/lumivara-people-advisory-site` after the P5.6 spinout).

### Run locally

```bash
npm run dev
```

Open http://localhost:3000. Hot reload is on by default.

No environment variables are required for the site itself — the defaults in `.env.local` are safe for local dev. See `.env.local.example` for what each variable does.

### Common commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | TypeScript check (no emit) |
| `npm test` | Unit tests (Vitest) |
| `npx playwright test` | End-to-end tests |

### Project structure (client lane)

```
src/
  app/           # Next.js App Router — pages and layouts
  components/    # React components
  content/       # All editable copy and MDX articles
  lib/           # Utilities and site config
public/          # Static assets (SVGs, images, fonts)
docs/            # Project documentation
CONTRIBUTING.md
```

> A clean per-client `<slug>-site` repo has nothing under `scripts/` or `.github/workflows/` on `main` — under [Dual-Lane Repo](../mothership/02b-dual-lane-architecture.md) that machinery lives in the matched `<slug>-pipeline` repo (operator-private; client has no Read access). The site repo is autopilot-free for the entire engagement, not just at handover.

## 🛠 Operator-only setup

<!-- do-not-copy:v1 -->
> **🛠 Do not copy to client repos.** This section describes operator-side machinery that
> lives in the platform repo or in a per-client pipeline repo (`<brand-slug>/<client-slug>-pipeline`).
> Under [Dual-Lane Repo (locked 2026-04-28)](../mothership/02b-dual-lane-architecture.md), a client cloning
> their `<client-slug>-site` repo cannot reach the pipeline repo at all. If you are the operator
> scaffolding a new client repo, **omit this section from the per-client wiki**.

The setup in this section is what the *operator* runs to drive the autopilot. None of it ships in a client's `main`.

### Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
claude login    # OAuth flow against the operator's Max 20x subscription
```

The OAuth token is stored as an **org-level GitHub Actions secret** (`CLAUDE_CODE_OAUTH_TOKEN`) on the operator's GitHub org with `Repository access: Selected` enumerating each `<slug>-pipeline` repo. The site repos never receive this secret directly — the workflows that consume it run in the matched pipeline repo (per [`docs/mothership/02b-dual-lane-architecture.md §3`](../mothership/02b-dual-lane-architecture.md)).

### n8n locally

Follow `docs/N8N_SETUP.md`. The local n8n instance is what wires the multi-AI router (`docs/AI_ROUTING.md`), the issue-creation webhooks, and the engagement-log writer described in `docs/mothership/03-secure-architecture.md`.

### Operator dashboard

The dashboard build (operator-only UI for triage queue, run health, cost telemetry) lives in `dashboard/` and ships with the platform repo post-spinout (operator-private). It is **not** the same surface as the per-client `/admin` portal in `src/app/admin/` — that portal is the client-facing capture surface and lives in the site repo. See [`docs/ADMIN_PORTAL_PLAN.md`](../ADMIN_PORTAL_PLAN.md) for the admin portal and [`docs/MONITORING.md`](../MONITORING.md) for the operator dashboard.

### Per-engagement runbook

For spinning up a new client repo from a clean slate, follow `docs/mothership/06-operator-rebuild-prompt-v3.md` end-to-end. That doc owns the bootstrap order, the n8n wiring, and the handover gates — this wiki page only points at it.

### Operator-side project structure

The operator's overlay branch carries everything the client's `main` does **plus**:

```
.github/
  workflows/     # triage, execute, plan, review, deploy-watcher, etc.
scripts/         # bot playbooks (forge-execute, execute, triage, plan, …)
dashboard/       # operator-only dashboard (mothership repo only)
```

## Making changes

See [[Best-Practices]] for conventions (⚪ Both lanes).

The fastest path for content changes (⚪ Both lanes):

1. Edit a file in `src/content/`
2. Save — the dev server hot-reloads
3. Verify in the browser
4. Commit and push your branch
5. Open a PR

## Troubleshooting

**`npm install` fails on Node < 20**
Upgrade Node: `nvm install 20 && nvm use 20`

**TypeScript errors on startup**
Run `npx tsc --noEmit` to see the full list. Check if errors exist on `main` before assuming you introduced them.

**Port 3000 already in use**
`PORT=3001 npm run dev`

**Playwright tests fail locally**
Install browsers once: `npx playwright install --with-deps`
