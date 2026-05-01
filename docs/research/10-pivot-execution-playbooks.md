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

## §2 — Playbook A: Stage-1 freelance build practice

**Match score:** 7.0 / 10 (the original `08 §7.4` recommendation, kept
as a fallback). One-time custom Next.js builds for Canadian SMBs at
CAD $4,500–$6,000 + optional CAD $79–$149/mo improvement-run
subscription.

### §2.A.1 Prerequisites

- Pre-flight §1 complete (especially §1.5 personal landing page).
- A 90-second screen recording of the *operator's own* live site +
  three Lighthouse / axe scorecards as the proof point.
- A two-page case-study PDF describing the operator's existing portfolio
  site as if it were a paying client engagement.

### §2.A.2 Week-by-week

| Wk | Goal | Specific actions | Deliverable |
|---|---|---|---|
| 1 | Inbound surface | Stand up `<operator-name>.dev/build`. Three sample sites linked. Stripe checkout button (CAD $4,500 + CAD $99/mo). | Public storefront page. |
| 2 | First batch of cold outreach | List 50 Toronto-area solo professionals with broken / slow / inaccessible sites (filter by Lighthouse < 60). Send 10 personalised emails per day Tuesday–Friday. | 40 cold emails sent; CSV with reply tracking. |
| 3 | Discovery calls | First 2–3 discovery calls. Quote CAD $4,500 setup + CAD $99/mo from the SoW template. **No discounts**. | 1 signed proposal. |
| 4 | First build kickoff | Standard intake form (`docs/storefront-stage1/intake.md`); domain + Vercel Pro on the client's account; design spike day 1; content draft day 2; first-pass build day 3–5. | First-pass live preview. |
| 5–6 | Iteration | Two rounds of revisions. Lighthouse 90+ on all routes; axe-core zero violations; PageSpeed Insights green. | Production launch. |
| 7 | Handover + improvement-run start | 30-minute walkthrough call recorded. First $99 monthly invoice. Add the engagement to the case-study queue. | Client live + on retainer. |
| 8+ | Steady state | One build per 2–3 weeks; second cohort of 50 cold emails; first improvement-run PRs. | Steady cadence. |

### §2.A.3 Success metrics

- **Week 4:** ≥ 1 signed proposal at full price.
- **Week 8:** ≥ 1 client live + on retainer.
- **Week 12:** ≥ 2 clients live; CAD $9,000+ invoiced; ≥ 20% reply rate
  on cold outreach (else the §1.6 positioning is wrong).
- **Month 6:** 8–12 clients live; CAD $45,000+ invoiced + CAD
  $1,000+/mo MRR.

### §2.A.4 Failure detection

- **Day 30:** zero proposals sent → operator has reverted to
  documentation hobby; corrective per `09 §4.3`.
- **Day 45:** no replies despite 60 cold emails → personalisation
  insufficient or positioning wrong; rewrite the email template
  using a single named pain point.
- **Day 60:** replies but no closes → price objection; do not
  discount. Re-qualify the prospect's budget upstream.

### §2.A.5 Costs

| Item | Cost |
|---|---|
| Personal domain | ~ CAD $20/yr |
| Email tooling (Resend free tier) | $0 |
| LinkedIn Sales Navigator (optional) | USD $99/mo (skip until month 3) |
| Anthropic API for build automation | ≤ USD $50/build (passed through) |
| Operator time | ~30–40 hr/build |

### §2.A.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $40–$90k |
| **Time-to-first-invoice** | 4–6 weeks |
| **Opportunity cost** | High — ties operator hours to per-build labour; no leverage |
| **Reversibility** | High — abandon at any time, keep the portfolio |

### §2.A.7 Day 1 action

Open `<operator-name>.dev/build` storefront page in a fresh repo. Three
hours; ship by EoD. The storefront's URL is the asset that converts
every other piece of outreach.

---

## §3 — Playbook B: Senior freelance via Toptal / A.Team / Arc / direct

**Match score:** 8.5 / 10. Sell senior + AI-integration **hours** at
CAD $175–$250/hr through talent marketplaces and direct outreach. No
productized service framing.

### §3.B.1 Prerequisites

- Pre-flight §1 complete.
- A LinkedIn page reflecting the §1.6 positioning — *Senior software
  engineer, AI integration specialist, Toronto*.
- The live `<operator-name>.dev` calling card with three case studies:
  the existing site + two pieces of platform work (the multi-LLM
  fallback ladder, the Plan-then-Execute pipeline) framed as *"shipped
  in production for an HR-consulting client #1."* No platform-product
  framing.
- A 1-page resume that ranks the most recent role first; the
  Lumivara-Forge platform appears as *"Engineer of record, Lumivara
  client #1, 2024–2026"* on a single line.

### §3.B.2 Week-by-week

| Wk | Goal | Marketplace path | Direct path |
|---|---|---|---|
| 1 | Apply | Submit Toptal application. Submit A.Team application. List on Arc.dev. List on Contra. | Send 30 LinkedIn DMs to mid-market AI engineering leaders. |
| 2 | Screening | Toptal Stage 1 screening (English + personality). A.Team profile review. | First 1–2 discovery calls from LinkedIn replies. |
| 3 | Technical screens | Toptal Stage 2 (timed test). A.Team mission application. | First proposal at CAD $200/hr × ~80 hrs = CAD $16k. |
| 4 | Final stages | Toptal Stage 3 (live coding). A.Team final mission interview. | First engagement starts; Stripe invoice on net-14. |
| 5 | Listed | Toptal profile live (~25–35% pass rate per Stage 3). A.Team mission live. | Steady-state outreach: 10 DMs/wk. |
| 6 | Active | First Toptal mission (often a 20–40 hr/wk engagement). | Second engagement signed. |
| 7+ | Steady state | 25–30 billable hours/wk distributed across marketplace + direct. | — |

### §3.B.3 Success metrics

- **Week 4:** ≥ 1 marketplace application accepted to final round AND
  ≥ 1 direct prospect at proposal stage.
- **Week 8:** ≥ 1 engagement live; first invoice sent.
- **Month 3:** ≥ 25 billable hours/wk averaged; CAD $20k+/mo gross.
- **Month 6:** ≥ 30 billable hours/wk averaged; CAD $25–$35k/mo gross;
  one referral inbound.

### §3.B.4 Failure detection

- **Day 21:** rejected by both Toptal and A.Team and zero direct
  proposals — positioning is too generic. Re-anchor to a single
  vertical (FinTech, regulated industries, AI-native startups) and
  resubmit.
- **Day 45:** marketplace listed but zero matches — rate is wrong
  (too high or too low) or geographic filter is excluding Toronto.
  Adjust rate by ±20%, re-apply geographic prefs.
- **Day 60:** active engagements but rate < CAD $150/hr — capacity
  problem, not pricing problem. Refuse the next sub-rate engagement.

### §3.B.5 Costs

| Item | Cost |
|---|---|
| Toptal | $0 to apply; Toptal takes ~50% margin on displayed rate |
| A.Team | $0 to apply; engineer keeps 100% of negotiated rate; 15-day post-invoice payment |
| Arc.dev | $0 to apply |
| Contra | $0 listing; 0% take rate (free tier) |
| LinkedIn Sales Navigator | USD $99/mo (recommended at month 2) |
| Operator time | 30–40 hr/wk billable + 5 hr/wk pipeline |

### §3.B.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $130–$220k |
| **Time-to-first-invoice** | 3–6 weeks (direct path) or 4–8 weeks (marketplace) |
| **Opportunity cost** | Medium — billable-hours model caps at one operator |
| **Reversibility** | Very high — engagement contracts are short |

### §3.B.7 Day 1 action

Open the Toptal application form (`https://www.toptal.com/freelance-jobs`)
and the A.Team application form (`https://www.a.team/join`). Submit
both before lunch. They take ≤ 30 minutes each.

---

## §4 — Playbook C: AI-integration consulting for digital agencies

**Match score:** 8.5 / 10. Sub-contractor model: digital agencies
already selling to mid-market clients want to ship AI features but
lack the engineering. The operator becomes the named engineer-of-record
behind 3–5 agency relationships.

### §4.C.1 Prerequisites

- Pre-flight §1 complete.
- Anthropic Claude Partner Network application submitted (free; see
  §10.A.2 in the bibliography for URL). Foundations certification
  scheduled.
- A 1-page sub-contractor agreement template (CAD-denominated,
  hourly + fixed milestones, 50/50 IP split, mutual NDA, named-engineer
  clause).
- A single page on `<operator-name>.dev/agencies` describing the
  engagement model: *"I build the AI feature, you keep the client
  relationship and the brand on the deliverable. Fixed-fee or hourly,
  your call."*

### §4.C.2 Week-by-week

| Wk | Goal | Specific actions |
|---|---|---|
| 1 | Apply Claude Partner Network | Submit at the Anthropic partner page. Schedule the Foundations certification (free). |
| 2 | Identify first 20 agency targets | Search LinkedIn for "AI consultant" / "AI implementation" / "digital agency" within Ontario + remote-friendly. Filter for 5–25 employee agencies that have posted "looking for AI engineer" within the last 6 months. |
| 3 | First 10 introductions | Send 10 personalised messages: *"You're looking for someone to ship X. I'm Anthropic Partner Network certified, work as a sub-contractor, your brand on the deliverable. 30 min next week?"* |
| 4 | First agency call | Discovery call with first 1–2 agencies. Discuss a specific project they need. Quote a 4–8-week fixed fee at CAD $20–$60k. |
| 5 | First proposal | Send written proposal with milestones. Sub-contractor agreement attached. |
| 6 | First engagement | First milestone delivered + invoiced. **The agency pays even if their end-client delays**, per the sub-contractor agreement. |
| 7–10 | Engagement 1 + pipeline 2 | Deliver milestones 2–3 of engagement 1. Send next 10 agency intros. |
| 11–12 | Engagement 1 closes; engagement 2 starts | First retainer-style relationship: *"Keep me on at CAD $4,000/mo for 20 hours, I take any AI work that comes in."* |

### §4.C.3 Success metrics

- **Week 6:** ≥ 1 agency engagement signed.
- **Week 12:** ≥ 2 agencies in steady relationships; CAD $10k+/mo
  invoiced.
- **Month 6:** ≥ 3 agency retainers (CAD $10–$15k/mo combined) + 1–2
  fixed-fee engagements/month.

### §4.C.4 Failure detection

- **Day 30:** no agency replies despite 30 messages — positioning
  generic. Sharpen to one specific agency vertical (e.g., legal-tech
  agencies, CPA-tech agencies, healthcare-marketing agencies).
- **Day 60:** discovery calls but no signed engagements — pricing too
  high for the agency's mark-up math. Move from fixed-fee to hourly
  with a not-to-exceed cap.
- **Day 90:** one engagement, no second — agency relationship not
  scaling; re-evaluate channel mix.

### §4.C.5 Costs

| Item | Cost |
|---|---|
| Claude Partner Network membership | $0 |
| Foundations certification | $0 |
| LinkedIn Sales Navigator | USD $99/mo (recommended) |
| Anthropic API per engagement | ≤ USD $200/mo per agency (passed through) |
| Operator time | ~20–30 hr/wk per active engagement |

### §4.C.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $90–$220k |
| **Time-to-first-invoice** | 6–10 weeks |
| **Opportunity cost** | Low — leverages platform expertise; agencies absorb sales cycle |
| **Reversibility** | High — agency contracts are 4–12-week milestones |

### §4.C.7 Day 1 action

Submit the Claude Partner Network application at
`anthropic.com/partners`. ≤ 20 minutes; the directory listing is the
asset that drives every subsequent agency intro.

---

## §5 — Playbook D: Niche-vertical productized service (one vertical only)

**Match score:** 6.0 / 10 (demoted in `09 §3.3` to month 9+ optionality).
Pick **one** vertical (dental, legal, real-estate, accounting,
recruiting). Build a vertical-specific landing page, sell at CAD
$1,500–$3,000 setup + CAD $99–$199/mo, narrowed scope per vertical.

### §5.D.1 Prerequisites

- Pre-flight §1 complete.
- One full month of Pivot A or B revenue first (rent paid for the
  6-month build-out).
- A real first reference customer in the chosen vertical (the operator
  knows one, or has a warm intro to one). **Do not start D with no
  reference customer in the vertical.**

### §5.D.2 Week-by-week (12 weeks for the build, then 12 weeks for sales)

| Wk | Phase | Specific actions |
|---|---|---|
| 1–2 | Vertical research | Read the regulator's website end-to-end (RCDSO for dental, LSO for legal, etc.). Build a one-page "what your site is missing" checklist specific to the vertical. |
| 3–4 | Reference customer build | Build the vertical-specific marketing site for the reference customer at half the eventual list price (CAD $750–$1,500 setup). |
| 5–6 | Vertical-specific landing page | `<operator-name>.dev/<vertical>` — case study from the reference customer + the regulator-specific checklist + a Stripe checkout button. |
| 7–8 | First cold outreach batch | List 50 named practices in the vertical. Cold-email 10/day Tuesday–Friday with a personalised audit of their current site. |
| 9–10 | First discovery calls | 2–3 calls. Sell at full price (CAD $1,500–$3,000 + $99–$199/mo). |
| 11–12 | First non-reference customer | Build for the first paying customer in the vertical. |
| 13–24 | Steady-state sales | 1 customer/month at the start; 2–3/month by month 6. |

### §5.D.3 Success metrics

- **Week 12:** ≥ 1 paying non-reference customer in the chosen vertical.
- **Month 6:** ≥ 6 paying customers; CAD $20k setup + CAD $1,000+/mo
  MRR.
- **Month 12:** 12–25 paying customers; CAD $30–$60k MRR + ongoing
  setup revenue.

### §5.D.4 Failure detection

- **Week 12:** no signed non-reference customer — vertical wrong, or
  positioning wrong. **Do not pivot to a second vertical inside the
  first 12 weeks.** Re-segment within the chosen vertical instead
  (e.g., "general dentists" → "single-location independent dentists in
  Ontario regional cities").
- **Month 6:** < 4 customers — vertical demand is real but conversion
  is broken. Audit: cold-email reply rate, discovery-call show rate,
  proposal-to-close rate. The bottleneck is one of those three.

### §5.D.5 Costs

| Item | Cost |
|---|---|
| Vertical-specific landing page | Built from existing K-SITE-CORE; ~ 20 hr |
| Cold-email tool (Instantly / Apollo) | USD $30–$80/mo |
| Anthropic API per engagement | ≤ USD $30/build (passed through) |
| Operator time | ~ 10–20 hr/wk during build; ~ 25–30 hr/wk during sales sprint |

### §5.D.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $30–$80k |
| **Time-to-first-invoice** | 8–12 weeks |
| **Opportunity cost** | High — 6 months before steady state; vertical lock-in |
| **Reversibility** | Medium — re-positioning to a second vertical resets the case-study work |

### §5.D.7 Day 1 action

Open the regulator website for the chosen vertical (RCDSO for dental,
LSO for legal, CPA Ontario for accounting). Read the practice-marketing
section in full. The first 30-minute action is information-gathering,
not building.

---

*Playbooks E–K fill in over the next commits.*
