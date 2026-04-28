# Development Setup ⚪

> **Lane:** ⚪ Both. The "Both lanes" sections below apply equally on the mothership and on every per-client repo. The "🛠 Operator-only setup" section applies only on the mothership. See [[_partials/lane-key]] for the badge legend.

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
For the current Client #1: `palimkarakshay/lumivara-site`.

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

> A clean per-client repo has nothing under `scripts/` or `.github/workflows/` on `main` — that machinery lives on the operator's overlay branch (`operator/main`) and is invisible to the client. See `docs/mothership/02-architecture.md §1`.

## 🛠 Operator-only setup

> <!-- do-not-copy:v1 -->
> **🛠 Do not copy to client repos.** This section describes operator-side machinery that
> lives on the mothership repo or on the `operator/main` overlay branch of a client
> repo. A client cloning their `main` will never see this content. If you are the
> operator scaffolding a new client repo, **omit this section from the per-client wiki**.

The setup in this section is what the *operator* runs to drive the autopilot. None of it ships in a client's `main`.

### Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
claude login    # OAuth flow against the operator's Max 20x subscription
```

The OAuth token is later mirrored into the **mothership** repo's secret `CLAUDE_CODE_OAUTH_TOKEN`. Per-client repos never receive this secret directly — the workflows that consume it run on `operator/main`.

### n8n locally

Follow `docs/N8N_SETUP.md`. The local n8n instance is what wires the multi-AI router (`docs/AI_ROUTING.md`), the issue-creation webhooks, and the engagement-log writer described in `docs/mothership/03-secure-architecture.md`.

### Operator dashboard

The dashboard build (operator-only UI for triage queue, run health, cost telemetry) lives in `dashboard/` on the mothership repo. See `docs/ADMIN_PORTAL_PLAN.md` and `docs/MONITORING.md`.

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
