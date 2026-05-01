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

## §6 — Playbook E: AODA / WCAG 2.1 AA audits-and-remediation as a productized service

**Match score:** 7.5 / 10 (Leg B of the recommended `09 §3` stack).
Audit existing Ontario business sites against WCAG 2.1 Level AA, deliver
a PDF report + a remediation PR, optionally retain the client at
$200–$400/mo for monthly monitoring. Anchored on the **December 31
2026 statutory compliance deadline** for Ontario private businesses
with 50+ employees.

### §6.E.1 Prerequisites

- Pre-flight §1 complete.
- A vendor list of 10 named Ontario business-services directories on
  which to list the service (Yellow Pages Canada, Connect Ontario,
  ProfessionalDirectory.ca, etc.).
- A working axe-core + Lighthouse pipeline against any URL (the
  operator already has this in CI; package it as a CLI tool that
  outputs a styled PDF).
- A 1-page audit deliverable template with: Lighthouse summary, axe
  violations grouped by WCAG criterion, severity ranking, top-10
  remediation list with code samples.

### §6.E.2 Week-by-week

| Wk | Goal | Specific actions |
|---|---|---|
| 1 | Productize the audit | Build `<operator-name>.dev/audit` storefront. Stripe checkout: CAD $4,000 audit-only / CAD $6,000 audit + remediation PR / CAD $300/mo monitoring retainer. |
| 2 | List on directories | Submit to 10 directories. Send 30 personalised emails to Ontario businesses with obviously-broken Lighthouse scores. |
| 3 | First sales | First 1–2 audit calls. Audit can be sold without the regulatory framing first; bring the December 31 2026 deadline up only on the second call as a closing nudge. |
| 4 | First delivery | First audit signed and delivered. **48-hour SLA from kickoff.** PDF report + a single PR with the top-10 fixes. |
| 5–6 | Steady cadence | 2–3 audits booked per week. Begin posting case-study snippets on LinkedIn (with client permission). |
| 7–8 | First retainer | First monthly-monitoring retainer signed. Now the CI runs against the client's site weekly. |
| 9–12 | Pipeline scale | 8–12 audits delivered cumulatively; 4–6 monitoring retainers; LinkedIn posts producing 1–2 inbound/wk. |

### §6.E.3 Success metrics

- **Week 4:** ≥ 1 audit delivered.
- **Week 8:** ≥ 4 audits delivered + ≥ 1 monitoring retainer.
- **Month 6:** ≥ 15 audits + ≥ 6 retainers; CAD $60k+ invoiced from
  audits + CAD $1,500+/mo from retainers.
- **Q4 2026 (deadline approach):** demand spike — 2–3 audits per week
  realistic; raise prices by 25%.

### §6.E.4 Failure detection

- **Day 30:** no audit booked despite 60 outreach messages — buyers
  do not perceive AODA December 2026 deadline as binding. Pivot the
  framing from *"compliance audit"* to *"accessibility ROI report"*
  with the ADA Title III lawsuit data (`08 §6.2`) as the wedge.
- **Day 60:** audits delivered but no retainers — productization
  shape is right but pricing on the retainer is wrong. Drop monthly
  retainer to CAD $199 with a 6-month term to seed the case studies.
- **Day 90 (after the deadline framing has saturated):** demand
  flatlines — pivot the post-deadline offer to *"AODA attestation
  package + maintenance"* at lower price, higher volume.

### §6.E.5 Costs

| Item | Cost |
|---|---|
| Personal-domain `/audit` storefront | $0 (incremental) |
| Stripe billing | 2.9% + CAD $0.30 per transaction |
| Cold-email tool | USD $30–$80/mo |
| axe-core + Lighthouse infrastructure | $0 (already built) |
| Operator time per audit | ~3–5 hr |
| Operator time per audit + remediation PR | ~8–12 hr |

### §6.E.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $50–$130k |
| **Time-to-first-invoice** | 3–4 weeks |
| **Opportunity cost** | Low — uses platform's strongest CI capability |
| **Reversibility** | Very high — service is self-contained, contracts are per-engagement |

**Calendar leverage:** December 31 2026 is a hard regulatory date. The
revenue band tightens upward as the deadline approaches in Q3–Q4 2026
and softens in Q1 2027. Plan the operator's vacation accordingly.

### §6.E.7 Day 1 action

Run `npx lighthouse <competitor-site>.com --output html` and
`npx @axe-core/cli <competitor-site>.com` against three named Ontario
business sites the operator can think of in 30 minutes. The output is
the first audit deliverable's draft. The audit storefront page can be
written around it.

---

## §7 — Playbook F: Developer-targeted Next.js + AI-pipeline boilerplate

**Match score:** 5.5 / 10 (cautioned in `09 §3.4` — the Tailwind Labs
trap). Sell a paid template at one-time USD $199–$499 to other
developers + agencies; optional support contracts.

### §7.F.1 Prerequisites

- Pre-flight §1 complete.
- A second domain (e.g., `<product-name>.dev`).
- A working "starter kit" extracted from the Lumivara repo with the
  multi-LLM pipeline removed (single Anthropic call, single API key
  pattern).

### §7.F.2 Week-by-week

| Wk | Goal | Specific actions |
|---|---|---|
| 1–2 | Extract starter | Copy `K-SITE-CORE` + `K-PLATFORM-MINIMAL` to a new repo. Strip every Lumivara-specific reference. Write a 30-page "getting started" guide. |
| 3 | Storefront | Build `<product-name>.dev` with Stripe checkout (USD $199 standard / $499 enterprise). |
| 4 | First buyers | Launch on Hacker News, Indie Hackers, X. Time the launch for a Tuesday 9am ET. |
| 5–8 | Iterate | Respond to support questions. Ship 2–3 weekly updates. Build a Discord. |
| 9–12 | Steady state | Monthly revenue = launch peak ÷ 6 (typical). Approx USD $1–$3k/mo. |

### §7.F.3 Success metrics

- **Week 4:** ≥ USD $5k in launch-week sales (~ 20–25 unit sales).
- **Month 3:** USD $1k+/mo recurring sales.
- **Month 12:** USD $20–$80k cumulative revenue.

### §7.F.4 Failure detection

- **Week 4:** < USD $1k in launch sales — landing page or positioning
  wrong. **Do not relaunch immediately**; write 6 case-study posts
  first.
- **Month 3:** sales decay to < USD $300/mo — the Tailwind Labs trap
  has activated; AI codegen is replacing the value of the boilerplate.
  Pivot the offer to *"the playbook (PDF + cohort)"* not *"the code."*

### §7.F.5 Costs

| Item | Cost |
|---|---|
| Second domain | ~ CAD $20/yr |
| Stripe | 2.9% + CAD $0.30 per transaction |
| Discord | $0 |
| Marketing time | ~ 5–10 hr/wk for the first 2 months |
| Operator time | ~ 60 hr extraction + 5 hr/wk maintenance |

### §7.F.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $20–$80k |
| **Time-to-first-invoice** | 4–6 weeks |
| **Opportunity cost** | High — labour-replacement curve is against the offer |
| **Reversibility** | Very high — abandon at any time |

### §7.F.7 Day 1 action

**Don't** start this without a primary income leg already producing.
The Day 1 action is to re-read `09 §3.4` and decide whether the
boilerplate trap is worth the lost focus on Pivot A / B / C / E.

---

## §8 — Playbook G: Micro-SaaS spin-offs from platform pieces

**Match score:** 4.5 / 10 (lowest in the matrix). Micro-SaaS
spin-offs of pieces that already work: admin-portal-as-a-service,
llm-monitor as a tiny SaaS, deck-rendering as a service.

### §8.G.1 Prerequisites

- Pre-flight §1 complete.
- A primary income leg already producing (see Pivot A/B/C/E/H).
- An honest answer to: *"would I personally pay for this?"* — if no,
  do not ship it.

### §8.G.2 Week-by-week (per spin-off; runs in parallel with 5–10 hr/wk slot)

| Wk | Goal | Specific actions |
|---|---|---|
| 1–2 | Extract one piece | Pick the smallest piece (e.g., `llm-monitor` digest as a Stripe-billed RSS subscription). Strip operator-specific config. |
| 3 | Storefront | Single-page Stripe checkout. USD $9–$19/mo. |
| 4 | Launch | Post on Indie Hackers + r/SideProject + X. |
| 5–8 | Iterate | Respond to first 5 customer requests. |
| 9–12 | Steady state | Either MRR > USD $300 (continue) or < USD $100 (kill). |

### §8.G.3 Success metrics

- **Week 4:** ≥ 5 paying signups (~ USD $50–$100 MRR).
- **Month 3:** USD $300+ MRR (the threshold for "keep working on it").
- **Month 12:** **most spin-offs go to zero**; one in three reaches
  USD $1k+ MRR. Plan accordingly.

### §8.G.4 Failure detection

- **Week 6:** < 3 paying signups — kill within 30 days. Do not
  iterate on a dead micro-SaaS.

### §8.G.5 Costs

| Item | Cost |
|---|---|
| Hosting (Vercel hobby tier — non-commercial allowed since *the operator pays for it*; flip to Pro at MRR > USD $300) | $0 to USD $20/mo |
| Stripe | 2.9% + CAD $0.30 |
| Operator time | ~ 5–10 hr/wk per active spin-off |

### §8.G.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $0–$30k yr 1 (most go to zero) |
| **Time-to-first-invoice** | 4–6 weeks per spin-off |
| **Opportunity cost** | Medium — capped at 5–10 hr/wk per spin-off |
| **Reversibility** | Very high — kill the project at any time |

### §8.G.7 Day 1 action

Do not start. Pick Pivot E (Leg B) instead. Revisit Pivot G as a
month-9+ optionality once a primary income leg is producing.

---

## §9 — Playbook H: Fractional principal / staff engineer at SMBs

**Match score:** 8.0 / 10. 1–2 days/week retainer with one or two
SMBs at CAD $1,200–$2,500/day. Strategic engineering judgement, not
hands-on shipping.

### §9.H.1 Prerequisites

- Pre-flight §1 complete.
- 10+ years of senior engineering experience the operator can talk
  about credibly in a 60-minute call (the operator does have this).
- A 1-page "fractional CTO services" brief: *"I serve as part-time
  principal engineer to one or two clients at a time — strategic
  technology decisions, vendor selection, security review, AI
  integration architecture. Engagements are 1–2 days/week, 6+ months."*

### §9.H.2 Week-by-week

| Wk | Goal | Specific actions |
|---|---|---|
| 1 | Positioning | Stand up `<operator-name>.dev/fractional-cto`. List on Toptal Fractional, Pangea, Toptal Senior Executive, and direct LinkedIn outreach. |
| 2 | First 30 intros | Target: VP Engineering / CTO of 50–500-person Canadian companies that have posted "looking for senior engineering leadership" or have had AI initiatives stall. |
| 3–4 | First discovery calls | First 3 prospects. **Do not discount the day-rate**; lead with the engagement structure (1–2 days/wk, 6-month minimum). |
| 5–6 | First proposal | Send a 2-page proposal with named outcomes per quarter. |
| 7–10 | First engagement | First retainer signed at CAD $8–$15k/mo. |
| 11–12 | Second engagement | Second retainer signed; combined MRR CAD $20k+. |

### §9.H.3 Success metrics

- **Week 8:** ≥ 1 retainer signed.
- **Month 4:** ≥ 2 retainers active; CAD $15k+/mo.
- **Month 12:** ≥ 2 retainers + 1–2 fixed-fee strategic projects/yr.

### §9.H.4 Failure detection

- **Day 45:** zero discovery calls — positioning not reaching senior
  buyers. Re-anchor with case studies of named technical decisions
  (not products) the operator has made.
- **Day 90:** discovery calls but no signed retainers — buyer does
  not believe a solo-operator can sustain a 1–2 day/week commitment.
  Bring a peer reference: a single named former colleague or client
  who can validate the operator's reliability.

### §9.H.5 Costs

| Item | Cost |
|---|---|
| Personal landing page expansion | $0 |
| LinkedIn Sales Navigator | USD $99/mo |
| Pangea / Toptal Fractional listing | $0 |
| Operator time | ~ 12–20 hr/wk per retainer |

### §9.H.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $80–$180k |
| **Time-to-first-invoice** | 6–10 weeks |
| **Opportunity cost** | Medium — 1 weekly synchronous call per retainer; otherwise async |
| **Reversibility** | Medium — retainers have 30-day notice clauses |

### §9.H.7 Day 1 action

Apply to Pangea (`pangea.app`) and Toptal Fractional. Both ≤ 30 minutes.
Listing produces inbound at the operator's experience level.

---

## §10 — Playbook I: Full pause — senior platform / staff engineering role

**Match score:** 9.0 / 10. Take a senior IC / staff engineering role
at a Canadian or remote-friendly US company. Restart side-project
ambition in 12–24 months. Highest floor, lowest variance.

### §10.I.1 Prerequisites

- Pre-flight §1 complete (yes — even for a job hunt, the §5.6 ToS
  exposure must be closed before the operator's name is on a public
  job-search profile).
- A 1-page resume (NOT a 4-page CV) ranking the most recent role first.
- A LinkedIn profile aligned with the §1.6 positioning.
- The operator is psychologically ready to take a corporate role —
  this is not a fallback for someone who is genuinely allergic to
  meetings, since staff IC roles ship with weekly architecture review,
  on-call, and incident response.

### §10.I.2 Week-by-week

| Wk | Goal | Specific actions |
|---|---|---|
| 1 | Resume + LinkedIn refresh | Update résumé and LinkedIn. Tag `lumivara-forge.com` as a 2-year solo platform engagement on the résumé and the LinkedIn header. |
| 2 | Apply broad | Apply to 30 senior IC / staff roles: Shopify, Cohere, Wealthsimple, Coinbase Canada, Postman, Vercel (if posting), Anthropic (if posting), Hugging Face Canada, AI-native Canadian startups (Cohere Labs, Tenstorrent, Borealis AI, Vector Institute spinouts). Plus 10 remote-US (Stripe, GitHub, GitLab, HashiCorp, Vercel, Linear, Anthropic). |
| 3–4 | Phone screens | First 5–10 phone screens. Decline non-senior offers immediately. |
| 5–6 | Technical interviews | 2–4 technical loops. Bring the platform repo as the take-home. |
| 7–10 | Final rounds | 1–3 onsite / final loops. |
| 11 | Offer evaluation | Compare offers; negotiate. Toronto staff IC band: CAD $185–$236k base; remote US staff: CAD $220–$320k. |
| 12 | Decision | Accept best offer OR continue to month 4 with the freelance pipeline as the bridge. |

### §10.I.3 Success metrics

- **Week 4:** ≥ 5 phone screens active.
- **Week 8:** ≥ 1 final-round in flight.
- **Week 12:** ≥ 1 offer in hand.
- **Soft target:** offer ≥ CAD $200k base.

### §10.I.4 Failure detection

- **Week 4:** < 2 phone screens — résumé / LinkedIn positioning not
  reaching staff-level recruiters. Sharpen the §1.6 positioning to one
  staff-IC specialty (AI infrastructure, distributed systems, dev
  platform).
- **Week 8:** phone screens but no technical loops — performance on
  the screens is below bar. Practice with a peer or a paid coach
  (Pramp, IGotAnOffer).
- **Week 12:** technical loops but no final-rounds — buy a 4-week
  Leetcode subscription and grind. Re-apply in 6 weeks.

### §10.I.5 Costs

| Item | Cost |
|---|---|
| LinkedIn Premium | USD $39.99/mo (recommended for Recruiter messaging visibility) |
| Coaching (optional) | USD $300–$1,500/coach |
| Operator time | ~ 10–20 hr/wk during search |

### §10.I.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $180–$320k base + equity |
| **Time-to-first-invoice (paycheque)** | 8–14 weeks |
| **Opportunity cost** | High — full-time commitment displaces side-project work for 12+ months |
| **Reversibility** | High — quit at any time, but employer's notice clause may bind |

### §10.I.7 Day 1 action

Open `levels.fyi` and read the Toronto staff-engineer comp data for
five named companies. The first 30-minute action is information,
not application. The application step lives in week 2.

---

## §11 — Playbook J: HR-services-for-Canadian-SMB partnership

**Match score:** 6.5 / 10 (demoted in `09 §3.3` to month 9+ optionality).
Partner with a complementary services practitioner (HR consultant,
employment lawyer, or compliance specialist) who already serves the
same SMB segment. The operator delivers the digital surface (compliant
employee handbooks as microsites, pay-transparency-aware careers
pages, AODA-compliant policy portals); the partner delivers the
regulatory product and the client relationship.

### §11.J.1 Prerequisites

- Pre-flight §1 complete.
- A primary income leg already producing (the partnership path is
  high-leverage but slow to ramp).
- An identified candidate partner — a real practitioner the operator
  knows or can introduce themselves to. **Do not start J without a
  concrete candidate.**
- A 1-page partnership proposal: *"You bring the HR / legal /
  compliance product and the client relationship. I bring the
  engineering for the digital artefact. 60/40 revenue split favouring
  the partner who owns the relationship."*

### §11.J.2 Week-by-week

| Wk | Goal | Specific actions |
|---|---|---|
| 1–2 | Partner conversations | 3 coffee calls with candidate partners. |
| 3–4 | First pilot | Pick the strongest candidate. Run a CAD $0 pilot for one of the partner's existing clients — typically an employee-handbook-as-microsite project. |
| 5–6 | Pilot delivery | Ship the pilot. Capture before/after artefacts. |
| 7–8 | Formalise the partnership | Written agreement: revenue split, IP ownership, termination clauses, conflict-of-interest rules. |
| 9–12 | First paid engagement | Partner sells to their first paying client; operator delivers. |
| 13–24 | Steady cadence | 1–2 engagements/month. CAD $7–$15k per engagement; ~CAD $4–$9k to operator after split. |

### §11.J.3 Success metrics

- **Week 8:** pilot delivered + partnership agreement signed.
- **Week 16:** ≥ 1 paid engagement delivered.
- **Month 12:** 8–15 engagements delivered; CAD $40–$120k to the
  operator.

### §11.J.4 Failure detection

- **Week 4:** no candidate partner has agreed to a pilot — partnership
  thesis is wrong; do not pivot to a different candidate within 4
  weeks. Park the playbook and revisit at month 9+.
- **Week 16:** pilot delivered but partner cannot sell — the partner's
  own demand is the bottleneck, not the engineering. Operator should
  re-evaluate whether the partner has the SMB relationships claimed.

### §11.J.5 Costs

| Item | Cost |
|---|---|
| Pilot engagement | $0 to operator (operator absorbs the labour) |
| Operator time | ~ 30 hr pilot + ~ 15–25 hr per paid engagement |
| Anthropic API per engagement | ≤ USD $30 (passed through) |

### §11.J.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $30–$120k yr 1 |
| **Time-to-first-invoice** | 12–16 weeks |
| **Opportunity cost** | High — 16-week ramp; dependent on partner's sales capacity |
| **Reversibility** | Medium — partnership agreements have notice clauses |

### §11.J.7 Day 1 action

Do not start before pre-flight is complete and a primary income leg
is producing. The Day 1 action is to identify a single named
candidate partner the operator can credibly approach, not to start
delivering.

---

## §12 — Playbook K: Hybrid (day-job + small Stage-1 side practice)

**Match score:** 9.5 / 10 — the matrix winner. Run Pivot I (day-job)
as the primary income, with Pivot A (Stage-1 freelance build practice)
deliberately rate-limited to 1 build per quarter as a side practice.

### §12.K.1 Prerequisites

- Pre-flight §1 complete.
- The operator is willing to take a corporate role (see Pivot I
  prerequisites — the psychological readiness condition matters).
- The day-job employer's policy on side projects has been read —
  Shopify allows it with a written disclosure; Canadian banks allow
  with disclosure; some US firms require explicit pre-approval.

### §12.K.2 Week-by-week (parallel tracks)

| Wk | Day-job track (Pivot I) | Side practice track (Pivot A) |
|---|---|---|
| 1–4 | Apply, screen, interview per §10.I.2. | Pre-flight §1 complete. Personal landing page live (§1.5). |
| 5–8 | Final rounds. | Take **zero** new clients during the interview period — the operator's attention is on the loop. |
| 9–12 | Offer + start date negotiation. Negotiate side-project disclosure clause with the new employer. | Begin a single low-stakes pilot client at sub-rate (CAD $2,000) to keep the craft warm. |
| 13–24 | Day-job onboarding (typically 8–12 weeks at staff IC). | Pause the side practice during onboarding. |
| 25+ | Steady state. | One build per quarter at full rate. CAD $4,500 setup × 4/yr = CAD $18,000. |

### §12.K.3 Success metrics

- **Month 3:** day-job offer accepted + side-practice pilot client
  delivered.
- **Month 6:** day-job onboarding complete; first paid side-practice
  build delivered.
- **Month 12:** day-job at full productivity; side practice at 1 build
  per quarter steady cadence.

### §12.K.4 Failure detection

- **Month 3:** no day-job offer + no side-practice client — the
  hybrid is failing on both legs. The operator has likely diluted
  attention; commit fully to one track for the next 4 weeks.
- **Month 9:** day-job onboarding consuming all evenings/weekends —
  the hybrid is structurally broken. Drop the side practice for 6
  months and revisit.
- **Month 12:** side practice consuming day-job performance — the
  side practice is exceeding the rate-limit. Either return to single-
  track Pivot B (full freelance) or reduce side-practice further.

### §12.K.5 Costs

| Item | Cost |
|---|---|
| All Pivot I costs | Per §10.I.5 |
| All Pivot A costs (rate-limited) | Per §2.A.5 |
| Operator time | Day-job 40 hr/wk + side practice 5–10 hr/wk during quarters with active builds |

### §12.K.6 Impact summary

| Axis | Value |
|---|---|
| **12-month revenue (base)** | CAD $200–$370k combined |
| **Time-to-first-invoice (paycheque)** | 8–14 weeks (day-job); 4–6 weeks (side practice) |
| **Opportunity cost** | Low — both legs draw from existing platform investment + experience |
| **Reversibility** | Very high — quit either leg independently |

### §12.K.7 Day 1 action

Open the Pivot I day-1 action (`levels.fyi` Toronto staff-engineer
data) AND the Pivot A day-1 action (`<operator-name>.dev/build`
storefront page). Allocate 30 minutes to the first, 30 minutes to the
second. The hybrid begins as both tracks running concurrently with
explicit time boxes.

---

## §13 — Cross-pivot impact matrix (one-glance)

For each pivot A–K, summarised on six axes for one-glance comparison.

| # | Pivot | Fit | 12-mo CAD | TTFI (wk) | Op time / wk steady | Reversibility | Platform leverage |
|---|---|---:|---|---:|---|---|---|
| **A** | Stage-1 freelance build practice | 7.0 | $40–90k | 4–6 | ~30 hr | High | Low (~15%) |
| **B** | Senior freelance via Toptal/A.Team/direct | 8.5 | $130–220k | 3–8 | ~30 billable + 5 pipeline | Very high | Medium (~30%) |
| **C** | AI-integration consulting for agencies | 8.5 | $90–220k | 6–10 | ~25 hr | High | High (~70%) |
| **D** | Niche-vertical productized service | 6.0 | $30–80k | 8–12 | ~25 hr | Medium | Medium (~30%) |
| **E** | AODA / WCAG audits-and-remediation | 7.5 | $50–130k | 3–4 | ~25 hr | Very high | Medium (~40%) |
| **F** | Developer boilerplate / OSS+support | 5.5 | $20–80k | 4–6 | ~10 hr | Very high | Medium (~50%) |
| **G** | Micro-SaaS spin-offs | 4.5 | $0–30k yr 1 | 4–6 | ~5–10 hr per spin-off | Very high | High (~70%) |
| **H** | Fractional principal / staff engineer | 8.0 | $80–180k | 6–10 | ~12–20 hr per retainer | Medium | Low (~20%) |
| **I** | Full pause / senior IC role | 9.0 | $180–320k | 8–14 | ~40 hr | High | Low (~10%) |
| **J** | HR-services partnership | 6.5 | $30–120k | 12–16 | ~15–25 hr per engagement | Medium | Medium (~40%) |
| **K** | Hybrid: I + A (matrix winner) | 9.5 | $200–370k | 4–14 | 40 + 5–10 hr | Very high | Medium (~25%) |

**TTFI** = time-to-first-invoice. **Platform leverage** = approximate
% of the existing K-PLATFORM-MINIMAL + K-SITE-CORE code paths the
pivot reuses.

The matrix winner (K) leverages only ~25% of the platform — confirming
`09 §2`'s warning that pivots maximising platform reuse (F at 50%, G at
70%, C at 70%) score worst-to-middle on the fit axis. **Platform
leverage is not value; demand for what the platform produces is value,
and most of what the platform produces does not have demand.**

---

## §14 — Common failure modes across pivots

Five generic patterns the operator should self-monitor regardless of
which pivot is chosen.

### §14.1 Reversion to the documentation hobby

**Detection:** the operator opens a markdown file in the archive folder,
or starts drafting a new deck "to clarify positioning," or refactors the
platform "while we're here." Per `09 §4.2` this is forbidden for 90
days. The reversion typically appears 14–30 days into a pivot when the
first sales cycle has not yet produced an invoice and dopamine returns
to writing.

**Correction:** a 24-hour writing freeze. The operator's day looks like
*"open prospects.csv → make 5 outreach contacts → close laptop"* until
the first invoice lands.

### §14.2 Hidden over-discounting

**Detection:** the operator quotes a discounted rate to "close the
first one." The first paying client at half-rate sets the ceiling for
every subsequent client because referrals price-anchor.

**Correction:** never discount price; substitute scope. *"I can do the
full audit at the listed CAD $4,000, or a focused 5-page-only audit
at CAD $2,000 — same per-page rate."*

### §14.3 Single-channel dependence

**Detection:** the operator has all proposals coming from one source
(LinkedIn alone, Toptal alone, a single referrer). When that source
softens, revenue collapses.

**Correction:** by month 3, every active pivot must have ≥ 2 distinct
inbound channels producing ≥ 1 proposal each per month. If one
channel produces 4× the volume of the next, the operator is
single-channel-dependent regardless of how many channels are listed.

### §14.4 Sub-rate engagement creep

**Detection:** the operator's average effective hourly rate has
declined for 3 consecutive months without a deliberate decision to
reduce it.

**Correction:** quarterly rate review. If the average has declined
without a written decision behind it, the operator is taking sub-rate
work to feel productive. Refuse the next sub-rate engagement.

### §14.5 The "while-I'm-here" platform refactor

**Detection:** the operator pushes a commit to the active repo that
does not directly serve a paying client's deliverable. **Any commit.**
The cleanest archive in the world is undone by the operator's reflex
to "tidy" the platform when they are between active engagements.

**Correction:** a one-line gitignore-style rule for the operator's
own behaviour: *"This week, no commits to anything in this repo
unless they ship to a client by EoW."* Re-read on Monday.

---

## §15 — Bibliography and methodology

The execution-detail research agent commissioned for this document
returned named sources for each playbook's specific URLs, prices,
and timelines. The agent ran in parallel with the writing of this
document; its findings landed in the §10–§12 ranges and are folded
into §16 below.

### §15.1 Top-level sources by playbook

- **Playbook A** — sourced from `08 §7`, `09 §3` and the operator's
  own Stage-1 cost model in `docs/_archive/.../storefront/03-cost-analysis.md`.
- **Playbook B** — Toptal application flow + acceptance band: see
  `09 §10.1`. A.Team profile flow: same.
- **Playbook C** — Anthropic Claude Partner Network: see `09 §10.1`.
- **Playbook D** — vertical SaaS comparable (Auxpanel): see `09 §10.1`.
- **Playbook E** — AODA December 31 2026 deadline: AODA Ontario
  reference at `aoda.ca/about-the-aoda/`. Audit pricing band: see
  `09 §10.3`.
- **Playbook F** — Tailwind Labs precedent + Marc Lou / ShipFa.st
  decay: `09 §10.1`.
- **Playbook G** — micro-SaaS revenue distribution: `09 §10.1`.
- **Playbook H** — Pangea + Toptal Fractional + Canadian fractional-
  CTO rates: `09 §10.3`.
- **Playbook I** — Levels.fyi Shopify staff-IC bands + Canadian tech
  hiring market: `09 §10.1`.
- **Playbook J** — HR compliance Canadian regulatory tailwinds:
  `09 §10.3`.
- **Playbook K** — combined sources from I + A.

### §15.2 Limits

- **Marketplace acceptance rates fluctuate.** Toptal and A.Team
  acceptance is more anecdotal than data-driven. The operator should
  treat marketplace listings as one of multiple parallel paths, not
  the path.
- **AODA December 31 2026 deadline assumes no statutory amendment.**
  Ontario has historically extended deadlines once; a six-month
  extension would soften Pivot E's revenue band but not eliminate it.
- **The Canadian tech hiring market in May 2026 is hostile** but
  Toronto and remote-friendly US firms remain tractable for the
  operator's seniority. The Pivot I revenue band assumes one offer
  inside 14 weeks; reality may be 8 or 24.

---

## §16 — Appendix: the 7-day kickoff for the recommended stack (Legs A + B + C in parallel)

If the operator picks the recommended `09 §3` stack, the next 7
calendar days look like this. Day 1 is the day this doc commits.

| Day | Action |
|---|---|
| **Mon** | Pre-flight §1.1 (Anthropic API console, per-engagement key, SoW pass-through clause). 4 hours. |
| **Tue** | Pre-flight §1.2 (resolve `lumivara-infotech` contamination — delete or relocate). 2 hours. |
| **Wed** | Pre-flight §1.3 (comment out `schedule:` blocks on cron-driven workflows). 30 minutes. Then §1.4 (Wave + Stripe accounts). 2 hours. |
| **Thu** | Pre-flight §1.5 (personal-domain landing page; deploy on Vercel Hobby). 4 hours. |
| **Fri** | Pre-flight §1.6 (lock the positioning sentence). 30 minutes. Then submit Toptal + A.Team applications (Pivot B, §3.B.7). 1 hour. |
| **Sat** | Submit Anthropic Claude Partner Network application (Pivot C, §4.C.7). 20 minutes. Build the AODA-audit storefront page (Pivot E, §6.E.1). 3 hours. |
| **Sun** | Off. Or build the resume + LinkedIn refresh for Pivot I (§10.I.7). 2 hours. |

By end of week 1, the operator has: ToS-clean billing setup, all four
inbound surfaces live (Toptal, A.Team, Claude Partner Network,
AODA-audit storefront), no cron-driven workflows firing, and a
hard-decision date scheduled for Sunday week 2 on whether to engage
Pivot I in earnest (the Leg C hedge).

---

*Last updated: 2026-05-01. Companion to `09-pivot-plan-and-archive-list.md`.
Read both. The strategic decision lives in `09`; the tactical execution
lives here.*
