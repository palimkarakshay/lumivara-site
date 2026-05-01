<!-- OPERATOR-ONLY. Detailed week-by-week execution playbooks for each of
     the eleven pivot candidates A-K from 09 §2. Companion to 09. -->

# 10 — Pivot Execution Playbooks (A–K)

> _Lane: 🛠 Pipeline — operator-scope tactical playbooks. Companion to
> [`09-pivot-plan-and-archive-list.md`](./09-pivot-plan-and-archive-list.md)
> (the strategic plan). This file goes one level deeper: for **each** of
> the eleven pivot candidates A–K in `09 §2`, a step-by-step execution
> plan with prerequisites, week-by-week actions, deliverables, success
> criteria, failure detection, costs, and impact analysis. Read `09`
> first._
>
> _Audience: the operator on a Tuesday, after deciding which pivot to
> execute (or which subset of legs to run). Read once. Do not
> paraphrase outside this repo._

---

## How to read this document

`09 §3` recommends a **hedged three-leg stack**: Leg A (senior freelance
+ AI-integration consulting via the Claude Partner Network), Leg B
(AODA / WCAG 2.1 AA audits-and-remediation against the December 31
2026 deadline), Leg C (corporate interview loops in parallel as price
discovery). This document expands `09 §3` from a strategic outline
into ready-to-execute playbooks — and it also documents the playbooks
for the **other eight pivots** (D–K) in case operator circumstances
change.

Structure:

1. **Common pre-flight** — actions every pivot in §2 requires before
   week 1. The most important of these is closing the §5.6 ToS
   landmine; the others are infrastructure hygiene.
2. **Per-pivot playbook** — one section per Pivot A through K. Each
   has: prerequisites, week-by-week steps, deliverables, success
   metrics, failure detection, costs, and a 4-row impact summary
   (revenue / time / opportunity-cost / reversibility).
3. **Cross-pivot impact matrix** — single table comparing all eleven
   pivots on the same axes for one-glance decision-support.
4. **Common failure modes across pivots** — five generic failure
   patterns and corrections.
5. **Bibliography and methodology** — the execution-detail research
   pass that informed this document.

Each playbook ends with a **Day 1 action** — the first 30-minute
action the operator should take if they pick that pivot.

---

## §1 — Common pre-flight (every pivot)

Five actions are pivot-agnostic. They unblock every playbook below.
Sequenced so that any failure is loud and early.

### §1.1 Close the §5.6 ToS landmine

**Why first:** Anthropic / Vercel / GitHub ToS exposure (`08 §5.6`)
hangs over every pivot in §2 that retains *any* Anthropic API call
against the operator's identity. Pivots A, B, C, D, E, F, G, J, K all
have at least one Anthropic call; only H (fractional CTO billed at the
client's API key) and I (full pause) avoid it.

**Steps (≤ 8 hours of operator work):**

1. **Open an Anthropic API console workspace** at `console.anthropic.com`
   on the operator's primary email. **Do not reuse the Pro/Max OAuth
   token for any commercial pipeline going forward.**
2. **Generate a per-engagement API key** for the first paying client.
   Set a hard monthly cap at USD $50 in the Anthropic console (limits
   page). Use a deterministic key-naming scheme: `{client-slug}-{yyyymm}`.
3. **Bill the API line through the client SoW as a pass-through.**
   Add a single line to every SoW: *"Third-party AI vendor cost
   (Anthropic, Gemini, OpenAI) is billed at cost-pass-through up to
   USD $X/month, with overage requiring written approval. The
   operator does not earn margin on third-party AI vendor cost."*
4. **Move all Vercel client deployments to the client's own Vercel
   account on the Pro tier** before any commercial production traffic
   lands. The operator's Vercel account stays Hobby and hosts only
   the operator's own portfolio site.
5. **Move all client-site GitHub repositories to the client's own
   GitHub account** with the operator added as a collaborator. The
   operator's GitHub account does not own any client production
   repository.

**Done when:** the operator can show, for any active engagement, that
(a) the Anthropic API key is on commercial billing, (b) Vercel is on
the client's Pro account, (c) the GitHub repo is owned by the client.

**Cost:** ≈ USD $20/seat/month per client Vercel project (passed
through to the client) + Anthropic API at cost (capped at the SoW
clause). The operator's own monthly platform cost goes to **near-zero**
once the platform side-products in `09 §5` archive.

**Impact if skipped:** any Anthropic enforcement event takes the
entire client portfolio dark in one motion. This is the single
highest-leverage pre-flight item.

### §1.2 Resolve the §5.9 contamination

**Why next:** the dual-lane audit (`AGENTS.md` § Dual-Lane) blocks any
clean spinout while `src/app/lumivara-infotech/` exists in the client
repo. The contamination row is independent of pivot choice.

**Steps (≤ 2 hours):**

1. **Decide the contamination action** per `09 §5.9`:
   - **Default — delete** the route + `src/content/lumivara-infotech.ts`.
     The operator's Fiverr-style pitch belongs on a separate domain.
   - **Alternative — relocate** to a separate Vercel project at
     `lumivara-forge.com` (or whatever the operator's chosen
     infotech domain is). Net 2–4 hours.
2. **Run** `bash scripts/dual-lane-audit.sh` and confirm the §2
   contamination check passes.
3. **Update `.dual-lane.yml`** if the route is deleted (remove the
   `lumivara-infotech` allow-list rows from §3 and §4 if present).

**Done when:** dual-lane audit clears §1–§6 except the pre-existing
violations in `dashboard/package-lock.json` and `src/__tests__/`.

### §1.3 Stop the cron-driven workflows

**Why third:** while the platform is being archived, the schedule-
driven autopilot workflows (`triage.yml`, `execute*.yml`,
`plan-issues.yml`, `deep-research.yml`, `codex-review*.yml`,
`ai-smoke-test.yml`, `llm-monitor*.yml`, `record-ingest-smoke.yml`,
`render-decks.yml`, `deploy-drift-watcher.yml`, etc.) keep firing
against the operator's Anthropic OAuth token, billing minutes against
the GitHub Pro org, and producing PRs on a dead thesis.

**Steps (≤ 30 minutes):**

1. In each affected workflow file, **comment out the `schedule:`
   block** (do not delete the file yet — that's `11`'s job). Leave
   the `workflow_dispatch` block intact so the operator can run on
   demand if needed.
2. Verify on the next scheduled hour that no run fires (GitHub Actions
   tab → Recent activity).

**Done when:** zero scheduled runs fire across any of the listed
workflows for 24 consecutive hours.

### §1.4 Get a clean Stripe / Wave account for CAD billing

**Why fourth:** every revenue-generating pivot below requires invoicing.
Stripe has 2.9% + CAD $0.30 per transaction (USD denominated). Wave
is Canadian-native, free for invoicing, 2.9% + $0.30 only when paid by
card; ACH/EFT is free.

**Recommendation:** **Wave for CAD-denominated invoices** (the
operator is Canadian, most clients in Pivots A/B/C/D/E will be
Canadian). **Stripe for USD-denominated invoices** when the client is
US-based or wants to pay by credit card.

**Steps (≤ 2 hours):**

1. Sign up at `waveapps.com`. Verify business email + Canadian banking.
2. Sign up at `dashboard.stripe.com/register` for the USD lane.
3. Build a single SoW template that names the third-party-AI-cost
   pass-through clause (see §1.1).
4. Build a single invoice template that includes a 14-day payment
   term and a 1.5%/month late-payment clause.

### §1.5 Personal-domain landing page (replaces the operator's storefront)

**Why fifth:** the operator's calling card today is `lumivara-forge.com`
(per `08 §6.4`). After §1.2, that domain is either deleted or moved
out of the client repo. The pivot needs a **personal calling card** —
a one-page Next.js site with the operator's name, headshot, three-line
positioning, and a contact form.

**Steps (≤ 4 hours):**

1. Buy `<operator-name>.dev` or `<operator-name>.ca` (CAD ≤ $20/year).
2. Spin up a fresh Next.js + Tailwind starter from the salvaged
   `K-SITE-CORE` code in `09 §6.1`. **Single page**, no MDX, no admin
   portal, no contact-form admin UI. Just Resend-backed email.
3. Three-line copy on the home page (the §1.6 positioning).
4. Deploy to a personal Vercel team on the Hobby tier (the operator's
   own portfolio site is non-commercial; Hobby is permissible).

**Done when:** `<operator-name>.{dev|ca}` resolves to a styled page
with a working contact form sending to the operator's inbox.

### §1.6 Lock the positioning sentence

The single most consequential creative decision for §1.5. The
recommended sentence (per `09 §3`):

> *"Senior software engineer, Toronto. I help mid-market companies
> ship AI features into production — multi-LLM agent pipelines, CI
> gates, plan-then-execute workflows. Available for engagements via
> the Anthropic Claude Partner Network and direct."*

Three things this sentence does not say: "marketing site," "$249/mo,"
"phone-edit." It also does not lead with "I built …" — the
demonstration is the codebase, not the bragging.

### §1.7 Pre-flight summary impact

| Pre-flight | Time cost | Money cost | Impact if skipped |
|---|---|---|---|
| §1.1 ToS landmine | ≤ 8 h | ~ USD $20/client/mo (passed through) | Single Anthropic enforcement event = portfolio dark |
| §1.2 Contamination | ≤ 2 h | $0 | Dual-lane audit blocks every clean spinout |
| §1.3 Stop crons | ≤ 30 min | $0 | Anthropic quota burns daily; GitHub minutes accrue |
| §1.4 Billing | ≤ 2 h | $0 to start | No way to invoice = no revenue, regardless of pivot |
| §1.5 Personal landing | ≤ 4 h | ≤ CAD $20/yr | Calling card is the contaminated client repo |
| §1.6 Positioning | ≤ 30 min | $0 | Every pivot below opens with "what is it you do?" with no answer |
| **Total pre-flight** | **≤ 17 hours** | **≤ CAD $40 + ~USD $20/client/mo passed through** | — |

**Pre-flight is two operator-days of focused work.** Every playbook
below assumes pre-flight is complete. If pre-flight is not complete
and the operator starts a pivot anyway, the pivot fails on operator
behaviour, not strategy (`09 §4.3`).

---

*Per-pivot playbooks A–K fill in over the next commits.*
