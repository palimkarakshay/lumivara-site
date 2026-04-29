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

This folder is the **operator-side runbook for the freelance practice that builds, ships, and maintains small-business websites with an AI autopilot**. It is the successor to (and supersedes for operator concerns) `docs/TEMPLATE_REBUILD_PROMPT.md`. The original template stays as a historical artefact; the v3 rebuild prompt lives at `06-operator-rebuild-prompt-v3.md`.

> **Provisional brand:** *Lumivara Forge* — see `01-business-plan.md §1` for four other options and the trade-offs. Treat the brand as `{{BRAND}}` everywhere in this folder so a global rename is cheap.

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
| 02 | `02-architecture.md` | "How is the mothership repo structured, and how do the per-client site + pipeline repos relate to it?" — Pattern C canonical | Operator | Once |
| 02b | `02b-pattern-c-architecture.md` | "What is Pattern C, in one self-contained file?" — the canonical architecture statement (locked 2026-04-28) | Operator | Once; cross-linked from every doc that touches architecture |
| 03 | `03-secure-architecture.md` | "How do I keep client zones, secrets, and costs strictly isolated from the mothership?" — Pattern C aligned; canonical App identity model at `§3.X`, two-phase HMAC rotation at `§3.Y` | Operator | Once, revisit on every secret rotation |
| 03b | `03b-security-operations-checklist.md` | "What does the operator do, and how often, to keep the security posture from drifting?" — monthly + quarterly cadences, recovery drill template, secret rotation schedule matrix, anti-pattern detection | Operator | **Per monthly + quarterly pass** |
| 04 | `04-tier-based-agent-cadence.md` | "How often does the AI bot run for a Tier 0 / 1 / 2 / 3 client, and which models does it use?" | Operator | Once, revisit when pricing tiers change |
| 05 | `05-mothership-repo-buildout-plan.md` | "What are the phases I run Claude through to build the new mothership repo from scratch?" | Operator (run with Claude) | Once |
| 06 | `06-operator-rebuild-prompt-v3.md` | "Per-client engagement: what do I run, in what order, to spin up a new client site?" | Operator | **Per engagement** |
| 07 | `07-client-handover-pack.md` | "What do I send to the client?" — includes dummy intake forms | Operator → Client | **Per engagement** (rendered per client) |
| 08 | `08-future-work.md` | "What's deferred? Legal, vault, market research, contracts, payments." | Operator | Once, revisit before each big milestone |
| 09 | `09-github-account-topology.md` | "Should I create a new GitHub org/account, and what are the three identities?" | Operator | Once |
| 10 | `10-lumivara-infotech-setup-plan.md` | "How do I actually set up the Lumivara Infotech GitHub org with real slugs?" | Operator | Once (at brand-lock time) |
| 09 | `09-github-account-topology.md` | "Should I create a new GitHub org? Free vs paid? Bot account?" | Operator | Once |
| 10 | `10-critique-executive-summary.md` | "Is the pack viable? What are the top 10 issues?" | Operator | Read first when revisiting the pack |
| 11 | `11-critique-architectural-issues.md` | "What structural problems block production?" — names the cron-on-default-branch bug + three pick-one fix patterns. **Pattern C chosen 2026-04-28; canonical statement now in `02b`.** | Operator | Once; closed in canonical docs by Pattern C propagation (this PR series) |
| 12 | `12-critique-security-secrets.md` | "Where do the secrets / cost-firewall leaks come from?" — single-Owner break-glass, per-client Resend keys, two-phase HMAC rotation, GitHub-App swap | Operator | Once; closed by Run B in `16 §2` |
| 13 | `13-critique-ai-and-scaling.md` | "Do the maths reconcile? Where are the scaling cliffs?" — Action minutes, AI cost, Claude/Actions/n8n cliffs, model-rubric notes | Operator | Once; closed by Run C in `16 §3` |
| 14 | `14-critique-operations-sequencing.md` | "What sequencing/coherency gaps need closing?" — Tier-0 honesty, OAuth manual scope, rollback paths, backups, engagement-log schema | Operator | Once; closed by Run D in `16 §4` |
| 15 | `15-terminology-and-brand.md` | "Better names for mothership/operator/agent and brand alternatives" | Operator | Once; rename ships via Run S1 in `16 §5` |
| 16 | `16-automation-prompt-pack.md` | "Copy-paste prompts for Claude Code in the browser to close the critiques" | Operator | **Per critique-closure run** |
| 17 | `17-claude-issue-seeding-pack.md` | "Pre-built issue / prompt seeds for Claude Code Cloud agents to bootstrap the mothership repo" | Operator | **Per seeding run** |
| 18 | `18-capacity-and-unit-economics.md` | "Single source of truth for Action minutes, AI cost envelopes, operator-time, scaling cliffs, and the assumption change log" | Operator | Once; update via §7 change log when any assumption moves |
| — | `pattern-c-enforcement-checklist.md` | "What MUST and MUST-NOT be true on every client repo for the two-repo / two-branch trust model? How do I gate a spinout against it?" — the canonical enforcement of `02` + `03` | Operator | **Per spinout + quarterly audit** |
| — | [`docs/migrations/lumivara-people-advisory-spinout.md`](../migrations/lumivara-people-advisory-spinout.md) | "How do I spin Lumivara People Advisory out into its own client repo, end-to-end?" — phased one-shot runbook with allow/deny tables (`docs/migrations/_artifact-allow-deny.md`), per-phase dry-run / rollback / acceptance, and Pattern C §4/§5 as gate / acceptance set | Operator | **Once (per Client #1 spinout)** |

Existing context that this folder builds on (do not duplicate):

- `docs/freelance/01-gig-profile.md` — outward-facing pitch, gigs, FAQ, "say no to" filters
- `docs/freelance/02-pricing-tiers.md` — four-tier ladder with prices and decision tree
- `docs/freelance/03-cost-analysis.md` — break-even and quit-the-day-job ramp
- `docs/freelance/05-template-hardening-notes.md` — running list of system-hardening items
- `docs/AI_ROUTING.md` — multi-AI router policy and fallback chains
- `docs/ADMIN_PORTAL_PLAN.md` — admin-portal architecture (5 phases)
- `docs/N8N_SETUP.md` — n8n on Railway
- `docs/wiki/Home.md` — **dual-lane wiki** (🛠 Operator / 🌐 Client / ⚪ Both). The wiki is the working summary of this pack for the operator and is the source from which per-client wikis are scaffolded; only the 🌐 and ⚪ pages are copied into a client repo (see `docs/wiki/_partials/lane-key.md` and `docs/wiki/_partials/do-not-copy.md`).

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
| **P4 — Future-work stubs** | `08-future-work.md` (legal, vault, contracts, payments, market research) | ✅ Done in this session |
| **P4.5 — External critique** | `10`–`15` (this session's review of the pack) + `16` (the prompt-pack to close it) | ✅ Done in this session |
| **P4.6 — Critique closure** | Run A (`16 §1`) → fix architectural cron flaw; Run B (`16 §2`) → close security gaps; Run C (`16 §3`) → reconcile maths; Run D (`16 §4`) → operations sweep | ⏳ **Run before any P5 work** |
| **P5 — Mothership repo bootstrap** | Run `05-mothership-repo-buildout-plan.md` end-to-end against an empty `palimkarakshay/{{BRAND_SLUG}}-mothership` repo | ⏳ After P4.6 |
| **P6 — Migrate Client #1** | Re-scaffold *Lumivara People Advisory* into a clean per-client repo using `06-operator-rebuild-prompt-v3.md` | ⏳ After P5 |
| **P7 — Hardening tasks** | Walk `docs/freelance/05-template-hardening-notes.md` items into issues against the new mothership repo | ⏳ After P6 |
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
| Is it the public-facing pitch (Fiverr/LinkedIn/Upwork)? | Yes | `docs/freelance/` (already exists; keep it as the storefront) |

---

## Brand placeholder convention

Until the brand is locked, this folder uses `{{BRAND}}` for the practice name and `{{BRAND_SLUG}}` for the kebab-case form. When the operator picks a name from `01-business-plan.md §1`, do a single global find-replace pass against this folder. Example: `{{BRAND}}` → `Lumivara Forge`, `{{BRAND_SLUG}}` → `lumivara-forge`.

The operator's GitHub org slug, the bot account name, the Resend sending domain, and the n8n workflow prefixes all derive from `{{BRAND_SLUG}}` — pick once, it propagates.

---

## Quick links

- **Canonical architecture (Pattern C):** `02b-pattern-c-architecture.md`
- **Capacity / cost / cliffs (single source of truth):** `18-capacity-and-unit-economics.md` — §1 assumptions, §6 cliffs, §7 change log
- New mothership repo bootstrap: `05-mothership-repo-buildout-plan.md`
- Per-engagement playbook: `06-operator-rebuild-prompt-v3.md`
- Client-facing pack template: `07-client-handover-pack.md`
- Tier-based AI cadence: `04-tier-based-agent-cadence.md`
- Cost firewall + zone isolation: `03-secure-architecture.md`
- **Security operations cadence (monthly / quarterly / drill / rotation matrix / anti-patterns): `03b-security-operations-checklist.md`**
- **Pattern C enforcement (MUST / MUST-NOT, pre-migration gate, post-migration verification): `pattern-c-enforcement-checklist.md`**
- **Client #1 spinout runbook: [`docs/migrations/lumivara-people-advisory-spinout.md`](../migrations/lumivara-people-advisory-spinout.md)**
- Future legal / vault work: `08-future-work.md`

---

## Pattern C canonical, as of 2026-04-28

The architecture is locked. Each engagement gets two private repos in the operator's org — `<slug>-site` (client-readable) and `<slug>-pipeline` (operator-only) — with a single org-level GitHub App bridging them via short-lived installation tokens. The deprecated `operator/main` branch overlay and the legacy `VENDOR_GITHUB_PAT` are gone from the canonical docs (`02`, `02b`, `04`, `05`, `06`, `09`); they survive only inside the critique series (`10`, `11`, `12`) and the migration prompt-pack (`16`, `17`), where they appear under prominent **Historical / decision record** banners. When in doubt, `02b` is the source of truth.

*Last updated: 2026-04-28.*
