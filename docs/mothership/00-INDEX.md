<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SOURCE OF TRUTH

  Everything under `docs/mothership/` is the **mothership business pack**.
  It defines the operator's freelance practice (provisional name:
  *Lumivara Forge* — see 01-business-plan §1 for naming options).

  Hard rules:
    1. Nothing in this folder ever ships in a client's repo.
    2. Nothing in this folder is pasted verbatim into a client-shared
       chat, email, gist, or proposal.
    3. The only artefact a client receives is `07-client-handover-pack.md`
       — and even that gets re-rendered per engagement before it leaves
       the operator's machine (see §3 of that file).

  Treat this folder the way you'd treat your accountant's working papers
  for your own business: useful, sensitive, never the deliverable.
================================================================================
-->

# Mothership Business Pack — Master Index

> _Lane: 🛠 Pipeline — operator-only business pack; never copied to a client repo._
>
> **Folder name retained.** Per the operator decision on 2026-04-29, this folder stays as `docs/mothership/` even though [`15b §2`](./15b-naming-conventions.md) locks the long-term rename to `docs/platform/`. Prose terminology (`mothership` → `platform` in noun usage) is being swept incrementally — `scripts/dual-lane-audit.sh` keeps the brand-drift checks green. The companion folder `docs/freelance/` was renamed to `docs/storefront/` on the same day per the same lock.

This folder is the **operator-side runbook for the practice that builds, ships, and maintains small-business websites with an AI autopilot**. It is the successor to (and supersedes for operator concerns) `docs/TEMPLATE_REBUILD_PROMPT.md`. The original template stays as a historical artefact; the v3 rebuild prompt lives at `06-operator-rebuild-prompt-v3.md`.

> **Brand under reconsideration (2026-04-30).** `Lumivara Forge` was locked 2026-04-28 (`15 §4`); on 2026-04-30 the operator re-opened the decision wanting a cleaner, leaner, non-hyphenated alternative. See [`15c-brand-and-domain-decision.md`](./15c-brand-and-domain-decision.md). Pre-vetted shortlist in [`15 §2`](./15-terminology-and-brand.md). Domain strategy is committed and unaffected: separate registered operator domain, **not** co-hosted on `lumivara.ca` (which follows Client #1 to her repo at Phase 4 spinout). Phase 0 of the migration plan, the second drift sweep, and `src/lib/site-config.ts` builder URL are all blocked on the brand decision.

---

## Why this folder exists

The `palimkarakshay/lumivara-site` repo started as a guinea-pig:
- Build a real marketing site for *Lumivara People Advisory* (Beas's HR consulting practice — a **client business**, not the mothership).
- Use that build as the laboratory to vibe-code the autopilot system: triage → plan → execute → review → auto-merge → Vercel deploy, with multi-AI fallback, an operator dashboard, and a mobile admin portal for non-technical clients.

That experiment succeeded. What now needs separating:

| Asset | Where it should live |
|---|---|
| The marketing site for *Lumivara People Advisory* | A **client repo** owned (eventually) by the client. Today it is `palimkarakshay/lumivara-site`; on next rebuild it migrates to `palimkarakshay/lumivara-people-advisory-site` and is treated as Client #1. |
| The autopilot system, n8n workflows, multi-AI router, admin-portal architecture, dashboard, operator runbooks, freelance go-to-market, this folder | A **new private mothership repo**: `palimkarakshay/{{BRAND_SLUG}}-mothership` (e.g. `palimkarakshay/lumivara-forge-mothership`). |

The mothership repo is the operator's intellectual property and the moat. Client repos are clean Next.js sites with a thin admin portal that calls operator-controlled n8n webhooks — they never see the autopilot.

---

## Read order

Read top-to-bottom on your first pass; cross-link from each doc thereafter.

| # | File | What it answers | Audience | Read once vs. per-engagement |
|---|---|---|---|---|
| 00 | `00-INDEX.md` (this file) | "Where do I find X?" | Operator | Once |
| 01 | `01-business-plan.md` | "What is the business, what does it sell, and what name does it operate under?" | Operator | Once, revisit quarterly |
| 02 | `02-architecture.md` | "How is the mothership repo structured, and how do the per-client site + pipeline repos relate to it?" — Dual-Lane Repo canonical | Operator | Once |
| 02b | `02b-dual-lane-architecture.md` | "What is Dual-Lane Repo, in one self-contained file?" — the canonical architecture statement (locked 2026-04-28) | Operator | Once; cross-linked from every doc that touches architecture |
| 03 | `03-secure-architecture.md` | "How do I keep client zones, secrets, and costs strictly isolated from the mothership?" — Dual-Lane Repo aligned; canonical App identity model at `§3.X`, two-phase HMAC rotation at `§3.Y` | Operator | Once, revisit on every secret rotation |
| 03b | `03b-security-operations-checklist.md` | "What does the operator do, and how often, to keep the security posture from drifting?" — monthly + quarterly cadences, recovery drill template, secret rotation schedule matrix, anti-pattern detection | Operator | **Per monthly + quarterly pass** |
| 04 | `04-tier-based-agent-cadence.md` | "How often does the AI bot run for a Tier 0 / 1 / 2 / 3 client, and which models does it use?" | Operator | Once, revisit when pricing tiers change |
| 05 | `05-mothership-repo-buildout-plan.md` | "What are the phases I run Claude through to build the new mothership repo from scratch?" | Operator (run with Claude) | Once |
| 06 | `06-operator-rebuild-prompt-v3.md` | "Per-client engagement: what do I run, in what order, to spin up a new client site?" | Operator | **Per engagement** |
| 07 | `07-client-handover-pack.md` | "What do I send to the client?" — includes dummy intake forms | Operator → Client | **Per engagement** (rendered per client) |
| 08 | `08-future-work.md` | "What's deferred? Legal, vault, market research, contracts, payments." | Operator | Once, revisit before each big milestone |
| 09 | `09-github-account-topology.md` | "Should I create a new GitHub org/account, and what are the three identities?" | Operator | Once |
| 09b | `09b-lumivara-forge-setup-plan.md` | "How do I actually set up the Lumivara Forge GitHub org with real slugs?" — companion to 09 (renamed 2026-04-29 from `10-lumivara-infotech-setup-plan.md`; the prior `10` collided with the critique series, and the 'Infotech' working name was retired by `15 §4`) | Operator | Once (at brand-lock time) |
| 10 | `10-critique-executive-summary.md` | "Is the pack viable? What are the top 10 issues?" | Operator | Read first when revisiting the pack |
| 11 | `11-critique-architectural-issues.md` | "What structural problems block production?" — names the cron-on-default-branch bug + three pick-one fix patterns. **Dual-Lane Repo chosen 2026-04-28; canonical statement now in `02b`.** | Operator | Once; closed in canonical docs by Dual-Lane Repo propagation (this PR series) |
| 12 | `12-critique-security-secrets.md` | "Where do the secrets / cost-firewall leaks come from?" — single-Owner break-glass, per-client Resend keys, two-phase HMAC rotation, GitHub-App swap | Operator | Once; closed by Run B in `16 §2` |
| 13 | `13-critique-ai-and-scaling.md` | "Do the maths reconcile? Where are the scaling cliffs?" — Action minutes, AI cost, Claude/Actions/n8n cliffs, model-rubric notes | Operator | Once; closed by Run C in `16 §3` |
| 14 | `14-critique-operations-sequencing.md` | "What sequencing/coherency gaps need closing?" — Tier-0 honesty, OAuth manual scope, rollback paths, backups, engagement-log schema | Operator | Once; closed by Run D in `16 §4` |
| 15 | `15-terminology-and-brand.md` | "Better names for mothership/operator/agent, brand alternatives, terminology policy (§6), and the client-example appendix (§7) that anchors all legitimate Client #1 references" | Operator | Once; rename ships via Run S1 in `16 §5`; §6 + §7 enforced reviewer-side until a CI lint lands |
| 15c | `15c-brand-and-domain-decision.md` | "ADR (2026-04-30): D1 commits the operator umbrella to a separate registered domain (no co-hosting with `lumivara.ca`); D2 re-opens the `Lumivara Forge` brand decision pending a cleaner, leaner, non-hyphenated alternative — Phase 0, second drift sweep, and `src/lib/site-config.ts` builder URL all blocked on D2" | Operator | Once; close by amending §3 with a "Resolved" stanza when D2 lands |
| 16 | `16-automation-prompt-pack.md` | "Copy-paste prompts for Claude Code in the browser to close the critiques" | Operator | **Per critique-closure run** |
| 18 | `18-provisioning-automation-matrix.md` | "Every per-engagement provisioning step keyed by Step ID, with system owner, automation status, blocking deps, validation command, and evidence artefact." | Operator | **Per engagement, every step** |
| 19 | `19-engagement-evidence-log-template.md` | "Per-client evidence log the operator copies into `docs/clients/<slug>/evidence-log.md` and appends to as each provisioning step lands." | Operator | **Per engagement, appended throughout** |
| 17 | `17-claude-issue-seeding-pack.md` | "Pre-built issue / prompt seeds for Claude Code Cloud agents to bootstrap the mothership repo" | Operator | **Per seeding run** |
| 18 | `18-capacity-and-unit-economics.md` | "Single source of truth for Action minutes, AI cost envelopes, operator-time, scaling cliffs, and the assumption change log" | Operator | Once; update via §7 change log when any assumption moves |
| 20 | `20-launch-and-operating-cost-model.md` | "Practice-wide cost model: one-time launch costs, all recurring categories (legal, payment processing, accounting, insurance, marketing, operator tools), Year-1 vs Year-3 burn, and cost-per-customer breakeven against the planned T2 headline tier" | Operator | Once; refresh annually + before any vendor swap or pricing change |
| 21 | `21-ip-protection-strategy.md` | "IP inventory and protection plan: what we own, which legal mechanism (copyright / trademark / trade secret / patent) protects each, contractor + per-engagement IP assignment, insurance posture (E&O / cyber / IP infringement), Canada-first jurisdictional notes with US/EU triggers, consolidated lawyer-review checklist" | Operator | Once; refresh before each lawyer engagement and on any new asset class |
| 21 | `21-vault-strategy-adr.md` | "Which vault stores the operator's IP and business secrets, what goes in it, who can see what, and how does it stay separate from the per-client runtime topology in `03 §3`?" — picks 1Password Business with vendor-agnostic structure / roles / rotation / SOP / migration plan from `pass` | Operator | Once; revisit at Cliff 5 (`18 §6`) when a second seat lands |
| 22 | `22-engagement-risk-protection.md` | "What is Lumivara Forge's documented posture against the three client-engagement risks — data privacy (PIPEDA / Law 25), IP leakage in client contracts, and clients failing to pay after signing? What gets disclosed at onboarding, what goes in the MSA / SOW, and what is explicitly a human-only step?" — drafts §3 IP clauses + §4 non-payment safeguards + §5 risk register + §6 onboarding flow for counsel review | Operator | **Per engagement (§6) + once for counsel review** |
| 23 | `23-operator-recording-pipeline.md` | "How do I capture, transcribe, classify, and archive client meetings, advisor / investor calls, public competitor events, solo musings, and third-party research recordings — using only free tools, with verifiable anti-drift discipline, and a conservative self-automation hand-off to the existing triage pipeline?" — specifies the consent stance (§1), free toolchain (§2), append-only architecture (§3), folder layout (§4), per-section self-automation rules (§5), and operating cadence (§7) for [`scripts/record-ingest/`](../../scripts/record-ingest/) and [`recordings/`](../../recordings/) | Operator | Continuous; revise when the section list or self-automation gate changes |
| 11 | `11-market-research.md` | "What is the market size, competitive landscape, channel/conversion model, and expansion vision for Product 1 (Lumivara Forge Sites)?" — TAM/SAM/SOM estimates, six-competitor scan, §3 phase-1 validation questions, §4 four-phase expansion (verticals → geo → white-label → SaaS). Pulled forward from `08 §5` per issue #112. | Operator | Once; revisit quarterly from month 6 of paid operations |
| — | `dual-lane-enforcement-checklist.md` | "What MUST and MUST-NOT be true on every client repo for the two-repo / two-branch trust model? How do I gate a spinout against it?" — the canonical enforcement of `02` + `03` | Operator | **Per spinout + quarterly audit** |
| — | `templates/00-templates-index.md` | "Vertical-specific content prompts and intake forms for each client business type — restaurant + plumber + realtor + recruiter are full; six more verticals planned" | Operator | **Per engagement (restaurant + plumber + realtor + recruiter = full; others = planned)** |
| — | [`docs/migrations/lumivara-people-advisory-spinout.md`](../migrations/lumivara-people-advisory-spinout.md) | "How do I spin Lumivara People Advisory out into its own client repo, end-to-end?" — phased one-shot runbook with allow/deny tables (`docs/migrations/_artifact-allow-deny.md`), per-phase dry-run / rollback / acceptance, and Dual-Lane Repo §4/§5 as gate / acceptance set | Operator | **Once (per Client #1 spinout)** |

Existing context that this folder builds on (do not duplicate):

- `docs/storefront/01-gig-profile.md` — outward-facing pitch, gigs, FAQ, "say no to" filters
- `docs/storefront/02-pricing-tiers.md` — four-tier ladder with prices and decision tree
- `docs/storefront/03-cost-analysis.md` — break-even and quit-the-day-job ramp
- `docs/storefront/05-template-hardening-notes.md` — running list of system-hardening items
- `docs/storefront/07-client-migration-strategy.md` — operator playbook for prospects who already have a website (Path A keep-and-integrate, Path B full migration, hybrids, edge cases, decision matrix). Sales-shareable distillation lives at `docs/storefront/08-client-migration-summary.md`. Cross-link rather than duplicate; the strategy doc is operator+sales-facing and lives in `docs/storefront/` per the §1 rule that operator-only mechanics stay in `docs/mothership/` while client-routing playbooks stay in the storefront pack.
- [`docs/research/00-INDEX.md`](../research/00-INDEX.md) — **evidentiary layer for all stakeholder decks**: two raw Gemini Deep Research outputs preserved verbatim under `raw/`, three synthesis docs, a [V]/[S]/[C]-flagged source bibliography, plus client personas, switch reasons, and honest drawbacks. Anything claimed in `docs/decks/` or `docs/storefront/04-slide-deck.md` traces back to a row in `03-source-bibliography.md`.
- [`docs/decks/00-INDEX.md`](../decks/00-INDEX.md) — **stakeholder deck pack**: investor, partner (co-operator), employee (engineer / VA), prospective-client (persona-tailored), and advisor (pressure-test). Each deck cites verified rows in `docs/research/03-source-bibliography.md`.
- `docs/AI_ROUTING.md` — multi-AI router policy and fallback chains
- `docs/ADMIN_PORTAL_PLAN.md` — admin-portal architecture (5 phases)
- `docs/N8N_SETUP.md` — n8n on Railway
- `docs/wiki/Home.md` — **dual-lane wiki** (🛠 Operator / 🌐 Client / ⚪ Both). The wiki is the working summary of this pack for the operator and is the source from which per-client wikis are scaffolded; only the 🌐 and ⚪ pages are copied into a client repo (see `docs/wiki/_partials/lane-key.md` and `docs/wiki/_partials/do-not-copy.md`).
- [`docs/ops/variable-registry.md`](../ops/variable-registry.md) — **canonical inventory of every named key** (GitHub Actions secrets/vars, Vercel env, n8n credentials, dashboard vars, operator-vault entries) with scope / owner / rotation / references. The audit cadence in `03-secure-architecture.md §3.2` walks this file. (#142)
- [`docs/ops/platform-baseline.md`](../ops/platform-baseline.md) — **expected GitHub + Vercel deployment topology** (secrets, vars, branch protection, Pages, webhooks, env-var scopes) that the audit runbook diffs the live configuration against. (#145)
- [`docs/ops/audit-runbook.md`](../ops/audit-runbook.md) — **end-to-end audit procedure**: export from GitHub + Vercel, compare against baseline + registry, file one issue per delta, bump `_Last verified_` stamps. Quarterly + on every secret rotation. (#145)
- [`docs/ops/codex-fix-classify-fixtures.md`](../ops/codex-fix-classify-fixtures.md) — **fixture catalogue pinning the Codex hallucination-filter classifier** (`scripts/codex-fix-classify.py`). Spec the negative-test runner (`scripts/test-codex-fix-classify.py`, wired into `ai-smoke-test.yml`) iterates against; weakening any guard breaks a fixture. (#178)

---

## How this folder was generated

This pack was assembled in one Claude session. The previous attempt errored out partway through; this index is the durable map so future sessions can resume by phase.

### Phased build plan (for resumption)

Each phase is sized to fit comfortably inside a single Claude run with the 50%/80% budget gates of `AGENTS.md`. If a phase exits early at 50/80%, the next session resumes the same phase.

| Phase | Deliverable | Status (apr 2026) |
|---|---|---|
| **P0 — Survey** | Read existing repo, freelance pack, template prompt, AI routing, admin-portal plan | ✅ Done |
| **P1 — Foundation docs** | `00-INDEX`, `01-business-plan`, `02-architecture`, `03-secure-architecture` | ✅ Done in this session |
| **P2 — Operations docs** | `04-tier-based-agent-cadence`, `05-mothership-repo-buildout-plan` | ✅ Done in this session |
| **P3 — Engagement playbooks** | `06-operator-rebuild-prompt-v3`, `07-client-handover-pack` (with dummy clients) | ✅ Done in this session |
| **P4 — Future-work stubs** | `08-future-work.md` (legal, vault, contracts, payments, market research) | ✅ Done in this session; §5 (market research) pulled forward and expanded into [`11-market-research.md`](./11-market-research.md) per issue #112 |
| **P4.5 — External critique** | `10`–`15` (this session's review of the pack) + `16` (the prompt-pack to close it) | ✅ Done in this session |
| **P4.6 — Critique closure** | Run A (`16 §1`) → fix architectural cron flaw; Run B (`16 §2`) → close security gaps; Run C (`16 §3`) → reconcile maths; Run D (`16 §4`) → operations sweep | ⏳ **Run before any P5 work** |
| **P5 — Mothership repo bootstrap** | Run `05-mothership-repo-buildout-plan.md` end-to-end against an empty `palimkarakshay/{{BRAND_SLUG}}-mothership` repo | ⏳ After P4.6 |
| **P6 — Migrate Client #1** | Re-scaffold *Lumivara People Advisory* into a clean per-client repo using `06-operator-rebuild-prompt-v3.md` | ⏳ After P5 |
| **P7 — Hardening tasks** | Walk `docs/storefront/05-template-hardening-notes.md` items into issues against the new mothership repo | ⏳ After P6 |
| **P8 — Legal & vault** | Implement items in `08-future-work.md` (PIPEDA, contracts, secrets vault, market study) | ⏳ Spread across months 2–6 |

### How to resume after a context-clear

If a future Claude session is asked to "continue the mothership work":

1. Read this file (`00-INDEX.md`) first — it is the map.
2. Look at the **Status** column above to find the first ⏳ phase.
3. Open the doc that owns that phase's deliverable (e.g. `05-mothership-repo-buildout-plan.md` for P5).
4. Inside each doc, every section header includes a `<!-- phase: P5.1 -->` marker so a partial run can mark progress and exit cleanly.
5. Always commit at phase boundaries; never carry partial deliverables across budget gates.

---

## What goes where (decision rule)

When you're tempted to add a new doc, use this table to decide where it goes:

| Question | Answer | Folder |
|---|---|---|
| Is this only ever read by the operator? | Yes | `docs/mothership/` |
| Is it a per-engagement playbook the operator runs? | Yes | `docs/mothership/` |
| Is it client-shareable text or a per-client form? | Yes | Render from `07-client-handover-pack.md` into the per-client repo's `docs/client/` (created at engagement time, never in the mothership) |
| Is it about the autopilot's internal mechanics (workflows, scripts)? | Yes | `docs/mothership/` plus the actual workflow lives in the new mothership repo |
| Is it about a specific *client business's* content/branding/copy? | Yes | The client's own repo, never here |
| Is it the public-facing pitch (Fiverr/LinkedIn/Upwork)? | Yes | `docs/storefront/` (already exists; keep it as the storefront) |

---

## Brand placeholder convention

Until the brand is locked, this folder uses `{{BRAND}}` for the practice name and `{{BRAND_SLUG}}` for the kebab-case form. When the operator picks a name from `01-business-plan.md §1`, do a single global find-replace pass against this folder. Example: `{{BRAND}}` → `Lumivara Forge`, `{{BRAND_SLUG}}` → `lumivara-forge`.

The operator's GitHub org slug, the bot account name, the Resend sending domain, and the n8n workflow prefixes all derive from `{{BRAND_SLUG}}` — pick once, it propagates.

---

## Quick links

- **Canonical architecture (Dual-Lane Repo):** `02b-dual-lane-architecture.md`
- **Capacity / cost / cliffs (single source of truth):** `18-capacity-and-unit-economics.md` — §1 assumptions, §6 cliffs, §7 change log
- **Launch + operating cost model (practice-wide P&L, breakeven, plan-lock table):** `20-launch-and-operating-cost-model.md` — §2 launch, §3 recurring, §4 Year-1 vs Year-3, §5 breakeven, §6 plan-lock
- **IP protection strategy (inventory, mechanism, contracts, insurance, jurisdictions, lawyer-review checklist):** `21-ip-protection-strategy.md` — §1 inventory, §2 mechanisms, §3 assignment policy, §4 insurance, §5 jurisdictions, §6 sequencing, §7 lawyer checklist
- New mothership repo bootstrap: `05-mothership-repo-buildout-plan.md`
- Per-engagement playbook: `06-operator-rebuild-prompt-v3.md`
- **Per-engagement provisioning matrix (Step IDs + validation + evidence): `18-provisioning-automation-matrix.md`**
- **Per-engagement evidence-log template: `19-engagement-evidence-log-template.md`**
- Gate-check / evidence-capture / rollback-path triad: `06 §2 / §3 / §4 / §5 / §6 / §7`
- Client-facing pack template: `07-client-handover-pack.md`
- Tier-based AI cadence: `04-tier-based-agent-cadence.md`
- Cost firewall + zone isolation: `03-secure-architecture.md`
- **Canonical variable inventory: [`docs/ops/variable-registry.md`](../ops/variable-registry.md)**
- **Security operations cadence (monthly / quarterly / drill / rotation matrix / anti-patterns): `03b-security-operations-checklist.md`**
- **Vault strategy (operator IP & business secrets — 1Password Business; per-client runtime topology stays in `03 §3`): `21-vault-strategy-adr.md`**
- **Engagement risk protection (data privacy + IP clauses + non-payment safeguards + onboarding/disclosure flow — drafts the operator's MSA/SOW input for counsel review): `22-engagement-risk-protection.md`**
- **Dual-Lane Repo enforcement (MUST / MUST-NOT, pre-migration gate, post-migration verification): `dual-lane-enforcement-checklist.md`**
- **Terminology policy + forbidden strings: `15-terminology-and-brand.md §6`** — what may appear where, with the audit-grep recipe.
- **Client example appendix: `15-terminology-and-brand.md §7`** — the single canonical home for legitimate Client #1 references in operator-scoped docs.
- **Client #1 spinout runbook: [`docs/migrations/lumivara-people-advisory-spinout.md`](../migrations/lumivara-people-advisory-spinout.md)**
- **Vertical content prompt pack: `templates/00-templates-index.md`**
- **LLM monitor — bot self-awareness pipeline:** `llm-monitor/runbook.md` (operator runbook), `llm-monitor/KNOWN_ISSUES.md` (last 14 days of field bugs ingested by triage / plan / execute prompts), `llm-monitor/RECOMMENDATIONS.md` (running list of bot-fleet enhancement suggestions). Daily artifacts under `llm-monitor/digests/` and `llm-monitor/newsletters/` (operator-technical + client-facing).
- Future legal / vault work: `08-future-work.md`

---

## Dual-Lane Repo canonical, as of 2026-04-28

The architecture is locked. Each engagement gets two private repos in the operator's org — `<slug>-site` (client-readable) and `<slug>-pipeline` (operator-only) — with a single org-level GitHub App bridging them via short-lived installation tokens. The deprecated `operator/main` branch overlay and the legacy `VENDOR_GITHUB_PAT` are gone from the canonical docs (`02`, `02b`, `04`, `05`, `06`, `09`); they survive only inside the critique series (`10`, `11`, `12`) and the migration prompt-pack (`16`, `17`), where they appear under prominent **Historical / decision record** banners. When in doubt, `02b` is the source of truth.

*Last updated: 2026-04-28.*
