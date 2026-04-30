# `docs/` — Master Index

> _Lane: ⚪ Both — this index covers Site (Client #1) and Pipeline (Lumivara Forge) docs co-housed in this repo until the P5.6 spinout._

This file is the **human-readable** doc-by-doc front-door for `docs/**`. The **machine-readable** lane assignment for every tracked file in the repo lives at [`/.dual-lane.yml`](../.dual-lane.yml); the dry-run that proves the manifest covers everything is [`scripts/forge-spinout-dry-run.sh`](../scripts/forge-spinout-dry-run.sh); the daily watcher that flags drift is [`dual-lane-watcher.yml`](../.github/workflows/dual-lane-watcher.yml). Together they make the P5.6 spinout (`docs/migrations/lumivara-people-advisory-spinout.md`) mechanical: only 🌐 and ⚪ docs travel to the client site repo; 🛠 docs stay in the operator-private pipeline repo.

Every doc in this index is stamped with a Dual-Lane Repo lane (🛠 Pipeline / 🌐 Site / ⚪ Both) so a reader can tell, at a glance, which of the two co-housed entities it belongs to.

For the locked architecture itself, read [`mothership/02b-dual-lane-architecture.md`](./mothership/02b-dual-lane-architecture.md). For the locked terminology (`mothership` → `platform`, `agent` → `pipeline`/`run`/`bot`, etc.) read [`mothership/15-terminology-and-brand.md §1`](./mothership/15-terminology-and-brand.md). For the file/folder naming policy read [`mothership/15b-naming-conventions.md`](./mothership/15b-naming-conventions.md). For the active brand + domain decision (2026-04-30: separate operator domain committed; brand-name re-opened pending a cleaner, non-hyphenated alternative) read [`mothership/15c-brand-and-domain-decision.md`](./mothership/15c-brand-and-domain-decision.md).

---

## Lane key

| Badge | Lane | Definition (Dual-Lane Repo aligned) |
|:---:|---|---|
| 🛠 | **Pipeline** | Operator-only machinery: workflows, scripts, prompts, runbooks, decks, storefront, research, vault, tier policy. Lives in the **pipeline repo** (`<brand-slug>/<client-slug>-pipeline`) after spinout. **Never visible to a client.** |
| 🌐 | **Site** | The per-client Next.js site (the "Site repo" entity in 02b §1). Copy, MDX, design tokens, contact-form trust boundary, admin-portal client surface. The client owns this repo after handover. |
| ⚪ | **Both** | General hygiene that applies on either repo: TypeScript strict, lint, tests, branch naming, the issue → PR loop. |

> 🛠 Do **not** copy Pipeline-lane docs to a client repo. The spinout runbook (`migrations/lumivara-people-advisory-spinout.md`) and `mothership/dual-lane-enforcement-checklist.md` enforce this.

---

## Top-level docs (`docs/*.md`)

| File | Lane | What it answers |
|---|:---:|---|
| [`ADMIN_PORTAL_PLAN.md`](./ADMIN_PORTAL_PLAN.md) | ⚪ | Five-phase build of `/admin` (Auth.js v5, magic link, three-channel intake, env vars). |
| [`AI_CLAUDE_DESIGN_PLAYBOOK.md`](./AI_CLAUDE_DESIGN_PLAYBOOK.md) | 🛠 | Three-layer deck pipeline: Marp auto-render (CI) + Claude API content polish (interactive) + Claude Design browser polish (manual). Wires [`render-decks.yml`](../.github/workflows/render-decks.yml) and [`scripts/render-decks.sh`](../scripts/render-decks.sh). |
| [`AI_CONSISTENCY.md`](./AI_CONSISTENCY.md) | 🛠 | How to keep the multi-AI router producing consistent verdicts across providers. |
| [`AI_ROUTING.md`](./AI_ROUTING.md) | 🛠 | Multi-AI router policy and fallback chains (Claude / Codex / Gemini). |
| [`BACKLOG.md`](./BACKLOG.md) | ⚪ | Label taxonomy, lifecycle, and triage rules for GitHub Issues / Project v2. |
| [`GEMINI_TASKS.md`](./GEMINI_TASKS.md) | 🛠 | Gemini deep-research task queue and brand-voice prompts (Client #1 voice today; per-client at scale). |
| [`MONITORING.md`](./MONITORING.md) | 🛠 | Smoke test, alerting, run-cost tracking, plus the `llm-monitor` bot self-awareness pipeline (added 2026-04-30) and the `record-ingest` operator recording pipeline (added 2026-04-30). |
| [`N8N_SETUP.md`](./N8N_SETUP.md) | 🛠 | n8n on Railway — webhook + AI structuring workflows. |
| [`OPERATOR_SETUP.md`](./OPERATOR_SETUP.md) | 🛠 | Step-by-step "from cold laptop to running pipeline" setup. |
| [`TEMPLATE_REBUILD_PROMPT.md`](./TEMPLATE_REBUILD_PROMPT.md) | 🛠 | Original (v1) site-rebuild prompt; superseded operationally by `mothership/06-operator-rebuild-prompt-v3.md` but retained as the source of the template-hardening backlog (see `storefront/05-template-hardening-notes.md`). |

---

## Sub-folders

| Folder | Lane | What lives here | Internal index |
|---|:---:|---|---|
| [`mothership/`](./mothership/) | 🛠 | The operator's business pack: business plan, architecture, secure architecture, tier cadence, engagement playbooks, critique series, terminology, naming, capacity, IP, vault, engagement risk. Folder name retained per the 2026-04-29 operator decision; rename to `platform/` per `15b §2` is deferred. | [`mothership/00-INDEX.md`](./mothership/00-INDEX.md) |
| [`storefront/`](./storefront/) | 🛠 | The outward-facing storefront: gigs, pricing tiers, slide decks, marketing strategy, client-migration strategy, template-hardening notes. Renamed 2026-04-29 from `docs/freelance/` per [`mothership/15b §2`](./mothership/15b-naming-conventions.md). | [`storefront/README.md`](./storefront/README.md) |
| [`claude-design/`](./claude-design/) | 🛠 | Operator pack for using `claude.ai/design` as a per-lane design-system source. Decision doc, two repo-resident `DESIGN.md` scaffolds (Site lane / Pipeline-decks), setup + sync runbook. Pairs with [`AI_CLAUDE_DESIGN_PLAYBOOK.md`](./AI_CLAUDE_DESIGN_PLAYBOOK.md). | [`claude-design/00-INDEX.md`](./claude-design/00-INDEX.md) |
| [`decks/`](./decks/) | 🛠 | Stakeholder decks: investor, partner (co-operator), employee (engineer / VA), prospective-client, advisor pressure-test. | [`decks/00-INDEX.md`](./decks/00-INDEX.md) |
| [`research/`](./research/) | 🛠 | Evidentiary layer for every deck claim: Gemini deep-research raw outputs, synthesis docs, source bibliography, personas, switch reasons, honest drawbacks. | [`research/00-INDEX.md`](./research/00-INDEX.md) |
| [`migrations/`](./migrations/) | 🛠 | One-shot transition runbooks: Client #1 spinout, automation-readiness plan, POC perfection plan, artefact allow/deny tables. | [`migrations/README.md`](./migrations/README.md) |
| [`ops/`](./ops/) | 🛠 | Recurring operator procedures: operator playbook (front-door), shareable progress tracker, audit runbook, GitHub Project layout, variable registry, platform baseline, codex-fix classifier fixtures, gemini deep audit. | [`ops/README.md`](./ops/README.md) |
| [`deploy/`](./deploy/) | 🛠 | Production-integrity notes; resume / continuity doc for the deploy operator. | — |
| [`../recordings/`](../recordings/) | 🛠 | Operator-private recording archive (audio / video / image / pdf / text), classified into client-meetings / advisors / investors / competitors / musings / research. Folder structure tracked via READMEs; raw media + transcripts + analyses are gitignored. Pipeline lives in [`scripts/record-ingest/`](../scripts/record-ingest/); spec is [`mothership/23-operator-recording-pipeline.md`](./mothership/23-operator-recording-pipeline.md). | [`recordings/README.md`](../recordings/README.md) |
| [`n8n-workflows/`](./n8n-workflows/) | 🛠 | n8n workflow JSON exports (admin-portal lane). Per `15b §2` this folder will rename to `n8n/` later. | [`n8n-workflows/admin-portal/README.md`](./n8n-workflows/admin-portal/README.md) |
| [`wiki/`](./wiki/) | mixed (per page) | Dual-lane working summary of the operator pack, per the lane key in [`wiki/_partials/lane-key.md`](./wiki/_partials/lane-key.md). 🛠 / 🌐 / ⚪ tagged per page; only 🌐 + ⚪ pages copy into a client repo. | [`wiki/Home.md`](./wiki/Home.md) |

---

## Repo-root reading order (for new contributors)

1. [`README.md`](../README.md) — entry point; names both entities; explains the dual-purpose-until-P5.6 framing.
2. [`AGENTS.md`](../AGENTS.md) — the active session charter for AI agents working in this repo (Claude Code, Codex, Gemini).
3. [`CLAUDE.md`](../CLAUDE.md) — Claude Code anchor (one-liner that defers to `AGENTS.md`).
4. [`CONTRIBUTING.md`](../CONTRIBUTING.md) — human-contributor guide.
5. [`mothership/02b-dual-lane-architecture.md`](./mothership/02b-dual-lane-architecture.md) — the canonical architecture; load-bearing.
6. [`mothership/00-INDEX.md`](./mothership/00-INDEX.md) — operator pack reading order + status table.
7. [`migrations/lumivara-people-advisory-spinout.md`](./migrations/lumivara-people-advisory-spinout.md) — the runbook that splits this repo into two repos when the time comes.

---

## Conventions

- **Lane banner** at the top of every doc: `> _Lane: 🛠 Pipeline / 🌐 Site / ⚪ Both._` Helps grep + helps the eventual `forge spinout` script decide what travels where.
- **File naming** per [`mothership/15b-naming-conventions.md §3`](./mothership/15b-naming-conventions.md): `NN[a-z]?-kebab-case-title.md` for operator docs; `00-INDEX.md` (ALL CAPS) for folder indexes; `README.md` (mixed case) for human-readable entry points; `Title-Case.md` for wiki pages (GitHub wiki convention).
- **Forbidden strings** in operator-scope docs per [`mothership/15-terminology-and-brand.md §6`](./mothership/15-terminology-and-brand.md): `Lumivara People Advisory`, `Lumivara People Solutions`, `people advisory`, `lumivara.ca`, `Beas Banerjee` — except inside `15 §7` (the Client #1 example appendix) or a labelled migration-history doc.
- **Cross-linking**: prefer relative links (`./mothership/02b-dual-lane-architecture.md`) over absolute URLs so the docs travel cleanly when the repo splits.

*Last updated: 2026-04-30 — refreshed to point at today's pipeline-lane additions: `llm-monitor` (operator runbook + KNOWN_ISSUES + RECOMMENDATIONS + daily digests under `mothership/llm-monitor/`), the `record-ingest` operator recording pipeline (`scripts/record-ingest/` + `recordings/` archive), the doc-task seeder (`docs/ops/doc-task-seeder.md`), the extended five-leg `codex-review` fallback ladder (`docs/AI_ROUTING.md`), the `15c` brand + domain ADR, and **the negative-list rationale pack at [`docs/mothership/sales-verticals/00a-negative-list-rationale.md`](./mothership/sales-verticals/00a-negative-list-rationale.md)** — the source-of-truth reasoning behind the new "Why we won't sell you SEO" + expanded "What this is *not*" slides distilled into all six per-vertical pitch decks (`docs/decks/vertical-pitches/`) and into the master + shareable decks (`docs/decks/06-master-deck.md`, `06a-master-deck-shareable.md`), each with regulator + platform-TOS citations and the structural alternative we sell instead.*
