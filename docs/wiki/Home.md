# Lumivara Forge — Operator + Client Wiki ⚪

> _Lane: ⚪ Both — this wiki home page is the dual-lane front door. Per-page badges (🛠 / 🌐 / ⚪) are defined in [[_partials/lane-key]]._

This wiki documents the two co-housed entities of the [Dual-Lane two-repo trust model (Dual-Lane Repo)](../mothership/02b-dual-lane-architecture.md) until the P5.6 spinout splits them into their final repos:

- **🛠 Pipeline lane (Lumivara Forge operator framework)** — the autopilot (triage → plan → execute → review → auto-merge), n8n workflows, multi-AI router, dashboard SPA, engagement playbooks, runbooks. Lives in `palimkarakshay/lumivara-site` until P5.6, then in `palimkarakshay/lumivara-forge-pipeline` (operator-private, never shared with the client).
- **🌐 Site lane (Client #1: Lumivara People Advisory marketing site)** — the clean Next.js site the client owns: copy, MDX articles, design tokens, the contact-form trust boundary, the `/admin` portal client surface. Lives in `palimkarakshay/lumivara-site` until P5.6, then in `palimkarakshay/lumivara-people-advisory-site` (transferred to the client at handover).

> _Client example — see [`docs/mothership/15-terminology-and-brand.md §7`](../mothership/15-terminology-and-brand.md)._ The Client #1 mapping is locked here so operator-scoped pages can use `<client-slug>` placeholders elsewhere.

---

## ⚠️ Deprecated-doc policy

Mobile capture via the operator's phone-PAT + HTTP Shortcuts / Apple Shortcuts is **deprecated**. The canonical capture path is the `/admin` portal plus n8n-routed email + SMS fallbacks. Do not follow the setup steps formerly in `PHONE_SETUP.md` (relocated 2026-04-29 to [`docs/_deprecated/PHONE_SETUP.md`](https://github.com/palimkarakshay/lumivara-site/blob/main/docs/_deprecated/PHONE_SETUP.md)) — that file is retained as a historical deprecation notice only. Canonical reading:

- [`docs/N8N_SETUP.md`](https://github.com/palimkarakshay/lumivara-site/blob/main/docs/N8N_SETUP.md) — n8n on Railway, webhook + AI structuring workflows.
- [`docs/ADMIN_PORTAL_PLAN.md`](https://github.com/palimkarakshay/lumivara-site/blob/main/docs/ADMIN_PORTAL_PLAN.md) — `/admin` portal, Auth.js v5, three-channel intake, env vars.
- [`docs/TEMPLATE_REBUILD_PROMPT.md`](https://github.com/palimkarakshay/lumivara-site/blob/main/docs/TEMPLATE_REBUILD_PROMPT.md) §1.4 — full v1→v2 migration matrix (security impact + operator actions).

---

## Pick your lane

Read [[_partials/lane-key]] first.

### 🛠 Pipeline lane (operator framework)

| Topic | Page | Notes |
|---|---|---|
| Backlog & bot pipeline | [[Bot-Workflow]] | Triage / execute / review loop; `auto/issue-*` branches; session-budget charter. |
| Pipeline-side security | [[Security]] §A | Org secrets, GitHub App identity, n8n HMAC, dashboard URL secrecy, Dual-Lane Repo zone isolation. |
| Operator-only setup | [[Development-Setup]] §🛠 | Claude OAuth, n8n local, dashboard build, per-engagement runbook. |
| Mothership pack (master index) | [`docs/mothership/00-INDEX.md`](../mothership/00-INDEX.md) | Source of truth — operator-only. |
| Per-engagement playbook | [`docs/mothership/06-operator-rebuild-prompt-v3.md`](../mothership/06-operator-rebuild-prompt-v3.md) | Per-client spin-up. |
| Tier-based AI cadence | [`docs/mothership/04-tier-based-agent-cadence.md`](../mothership/04-tier-based-agent-cadence.md) | Per-tier model + cron rubric. |
| Dual-Lane Repo canonical | [`docs/mothership/02b-dual-lane-architecture.md`](../mothership/02b-dual-lane-architecture.md) | The locked architecture (2026-04-28). |
| Dual-Lane Repo enforcement | [`docs/mothership/dual-lane-enforcement-checklist.md`](../mothership/dual-lane-enforcement-checklist.md) | MUST / MUST-NOT rows for every spinout. |
| Spinout manifest | [`/.dual-lane.yml`](../../.dual-lane.yml) | Machine-readable lane-per-path manifest; the spinout reads this. |
| Spinout dry-run | [`scripts/forge-spinout-dry-run.sh`](../../scripts/forge-spinout-dry-run.sh) | Validates the manifest covers every tracked file. |
| Operator daily playbook | [`docs/ops/operator-playbook.md`](../ops/operator-playbook.md) | Front-door doc — open every working session. |

### 🌐 Site lane (client repo)

| Topic | Page | Notes |
|---|---|---|
| How to request a site change | [[Making-Changes]] | Issue template, `/admin` portal, what makes a good issue. |
| Site-repo security | [[Security]] §B | Branch protection, secret hygiene, contact-form trust boundary. |
| Baseline dev setup | [[Development-Setup]] §⚪ | Clone, install, `npm run dev`, build, lint, tests. |
| Content & design conventions | [[Best-Practices]] | TypeScript strict, Tailwind tokens, accessibility, performance. |

### ⚪ Both lanes

| Topic | Page | Notes |
|---|---|---|
| Lane key (badge definitions) | [[_partials/lane-key]] | Defines 🛠 / 🌐 / ⚪. Dual-Lane Repo-aligned 2026-04-29. |
| Do-not-copy callout | [[_partials/do-not-copy]] | Reusable "🛠 do not copy this to a client repo" snippet. |

---

## First-client spinout — quickstart

> 🛠 **Operator-only.** A client never runs this; it is the operator's per-engagement spin-up. The Client #1 spinout is the worked example for every later engagement.

1. Open the spinout runbook at [`docs/migrations/lumivara-people-advisory-spinout.md`](../migrations/lumivara-people-advisory-spinout.md). It is the canonical, copy-pasteable procedure (phased §0–§9, with allow/deny tables in [`docs/migrations/_artifact-allow-deny.md`](../migrations/_artifact-allow-deny.md)). It cites [`docs/mothership/dual-lane-enforcement-checklist.md §4/§5`](../mothership/dual-lane-enforcement-checklist.md) as gate and acceptance set.
2. Run [`scripts/forge-spinout-dry-run.sh`](../../scripts/forge-spinout-dry-run.sh) on the source repo — it reads `/.dual-lane.yml` and prints the per-lane file plan. Validation gate: zero uncovered files.
3. Confirm the brand lock (Lumivara Forge per [`docs/mothership/15 §4`](../mothership/15-terminology-and-brand.md)) and substitute `{{BRAND}}` / `{{BRAND_SLUG}}` globally before generating the two new repos.
4. Use [`docs/mothership/06-operator-rebuild-prompt-v3.md`](../mothership/06-operator-rebuild-prompt-v3.md) as the engagement playbook — that doc owns the bootstrap order, the n8n wiring, and the handover gates.
5. After the new site repo's `main` builds clean on Vercel, copy only the 🌐 and ⚪ pages from this wiki into the per-client wiki. The 🛠 pages stay in the operator-private pipeline repo by **permission**, not branch-listing politeness.
6. Confirm the new pipeline repo's `main` carries the workflow files (the cron fires from there per [`docs/mothership/02b §4`](../mothership/02b-dual-lane-architecture.md)) and the GitHub App is installed on the site repo only.
7. Hand over the per-client `docs/client/` pack rendered from [`docs/mothership/07-client-handover-pack.md`](../mothership/07-client-handover-pack.md).

---

## At a glance

| | |
|---|---|
| **Live site (Client #1):** | [lumivara-site.vercel.app](https://lumivara-site.vercel.app) (Vercel deploy of this repo's `main`); DNS cutover to `lumivara.ca` is item 12 of [`docs/migrations/00-automation-readiness-plan.md`](../migrations/00-automation-readiness-plan.md). |
| **Tech (Site lane):** | Next.js 16 (App Router) + Tailwind v4 + TypeScript strict + MDX + shadcn/ui on Base UI React. |
| **Hosting (Site lane):** | Vercel (auto-deploys from `main`; previews per PR). |
| **Bot (Pipeline lane):** | Claude Opus 4.7 via GitHub Actions — triage every 15 min, execute every 1 h, plan-issues every 1 h, plus the operator-side `llm-monitor-watch` every 15 min and `llm-monitor` sweep every 2 h (added 2026-04-30, see [`docs/MONITORING.md`](../MONITORING.md) and [`docs/mothership/llm-monitor/runbook.md`](../mothership/llm-monitor/runbook.md)). Multi-vendor fallback ladder: five legs deep on `codex-review` (Claude → Gemini Pro → Gemini Flash → GitHub Models → OpenRouter); see [`AGENTS.md`](../../AGENTS.md) for the session charter. |
| **Operator:** | Akshay Palimkar (`@palimkarakshay`) — designs the Pipeline; reviews + merges PRs via GitHub Mobile. |
| **Client #1:** | Lumivara People Advisory — Beas Banerjee's HR & people-strategy consulting practice in Toronto. |
| **Pipeline repo (post-spinout):** | `palimkarakshay/lumivara-forge-pipeline` (operator-private). |
| **Dual-Lane Repo reference:** | [`docs/mothership/02b-dual-lane-architecture.md`](../mothership/02b-dual-lane-architecture.md) (canonical, two-repo trust model, locked 2026-04-28). |
| **Spinout manifest:** | [`/.dual-lane.yml`](../../.dual-lane.yml) — single source of truth for lane-per-path. |
| **Cross-link:** | [`docs/00-INDEX.md`](../00-INDEX.md) — repo-wide doc lane map. |
| **First-client spinout:** | [`docs/migrations/lumivara-people-advisory-spinout.md`](../migrations/lumivara-people-advisory-spinout.md) — one-shot runbook for Client #1. |
