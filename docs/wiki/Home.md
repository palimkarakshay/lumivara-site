# Lumivara Forge — Operator + Client wiki ⚪

<!-- legacy redirect: title was "Lumivara Site Wiki"; old [[Home]] links resolve here. -->
> **Legacy redirect note.** This page used to be titled *Lumivara Site Wiki* and assumed the repository was a single-purpose Next.js site. It is now a **dual-lane wiki** — the same source serves the operator's mothership and the per-client repos that ship the autopilot's product. Old `[[Home]]` links keep resolving to this file; the table-of-contents below replaces the previous "Quick links" table for one cycle.

This wiki documents two related but distinct codebases:

- **🛠 Operator lane (Forge mothership)** — the operator's autopilot: triage → plan → execute → review → auto-merge, n8n workflows, the multi-AI router, the dashboard, the engagement playbooks. Lives in `palimkarakshay/{{BRAND_SLUG}}-mothership` (private) and on the `operator/main` overlay branch of every client repo.
- **🌐 Client lane (Pattern C site repo)** — the clean Next.js site a client owns: copy, MDX articles, design tokens, the contact-form trust boundary, and "how do I request a change". Lives in a per-client repo (today: `palimkarakshay/lumivara-site`; on next rebuild: `palimkarakshay/lumivara-people-advisory-site`).

For the architectural model that ties the two together — the `operator/main` overlay branch, the client `main`, and Pattern C — see `docs/mothership/02-architecture.md §1`.

## Pick your lane

Read [[_partials/lane-key]] first. Every page below is stamped with one of three badges:

| Badge | Lane |
|:---:|---|
| 🛠 | Operator (Forge mothership) — never copy to a client repo |
| 🌐 | Client (Pattern C site repo) — safe to ship to a client repo |
| ⚪ | Both — general dev hygiene |

### 🛠 Operator lane

| Topic | Page | Notes |
|---|---|---|
| Backlog & bot pipeline | [[Bot-Workflow]] | The triage/execute/review loop; `auto/issue-*` branches; session charter. |
| Operator-side security | [[Security]] §A | Org secrets, vendor PAT, n8n HMAC, dashboard URL secrecy, Pattern C zone isolation. |
| Operator-only setup | [[Development-Setup]] §🛠 | Claude OAuth, n8n local, dashboard build, per-engagement runbook. |
| Mothership pack | `docs/mothership/00-INDEX.md` | Source of truth — operator-only. |
| Engagement playbook | `docs/mothership/06-operator-rebuild-prompt-v3.md` | Per-client spin-up. |
| Tier-based AI cadence | `docs/mothership/04-tier-based-agent-cadence.md` | Per-tier model + cron rubric. |
| Pattern C enforcement | _Forthcoming — see [#140](https://github.com/palimkarakshay/lumivara-site/issues/140) until landed at `docs/mothership/pattern-c-enforcement-checklist.md`._ |  |

### 🌐 Client lane

| Topic | Page | Notes |
|---|---|---|
| How to request a site change | [[Making-Changes]] | Issue template, phone shortcut, what makes a good issue. |
| Client-repo security | [[Security]] §B | Branch protection, secret hygiene, contact-form trust boundary. |
| Baseline dev setup | [[Development-Setup]] §⚪ | Clone, install, `npm run dev`, build, lint, tests. |
| Content & design conventions | [[Best-Practices]] | TypeScript strict, Tailwind tokens, accessibility, performance. |

## First client migration — quickstart

The first migration of an existing site (today: `palimkarakshay/lumivara-site`) into a clean per-client repo (`palimkarakshay/lumivara-people-advisory-site`) follows the spinout runbook.

> **🛠 Operator-only.** A client never runs this; it is the operator's per-engagement spin-up.

1. Open the spinout runbook — _forthcoming at `docs/migrations/lumivara-people-advisory-spinout.md`; until it lands, follow the issue thread on [#141](https://github.com/palimkarakshay/lumivara-site/issues/141)._
2. Confirm the brand pick from `docs/mothership/01-business-plan.md §1` and substitute `{{BRAND}}` / `{{BRAND_SLUG}}` globally before generating the new repo.
3. Use `docs/mothership/06-operator-rebuild-prompt-v3.md` as the engagement playbook — that doc owns the bootstrap order, the n8n wiring, and the handover gates.
4. After the new repo's `main` builds clean on Vercel, copy only the 🌐 and ⚪ pages from this wiki into the per-client wiki. The 🛠 pages stay on the mothership.
5. Confirm the operator-side overlay branch (`operator/main`) is created on the new repo and is the only branch that carries `.github/workflows/*` from the autopilot.
6. Hand over the per-client wiki and the `docs/client/` rendered pack from `docs/mothership/07-client-handover-pack.md`.

## At a glance

| | |
|---|---|
| **Live site (Client #1):** | [lumivara-site.vercel.app](https://lumivara-site.vercel.app) |
| **Tech (Client lane):** | Next.js 16 + Tailwind v4 + TypeScript + MDX |
| **Hosting (Client lane):** | Vercel (auto-deploys from `main`) |
| **Bot (Operator lane):** | Claude Opus via GitHub Actions — triage daily, execute every 8 h |
| **Operator:** | Beas Banerjee — reviews and merges PRs via GitHub Mobile |
| **Mothership repo:** | `palimkarakshay/{{BRAND_SLUG}}-mothership` (private; on next rebuild) |
| **Pattern C reference:** | `docs/mothership/02-architecture.md §1` (the two-branch model); enforcement checklist forthcoming via [#140](https://github.com/palimkarakshay/lumivara-site/issues/140) |
| **Cross-link:** | `docs/mothership/00-INDEX.md` — operator-side master index, never client-shared |
