<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SOURCE OF TRUTH
  Closes #113. Companion to `18-capacity-and-unit-economics.md` (capacity / AI /
  cliffs) and `freelance/03-cost-analysis.md` (per-client cost-of-goods + ramp).
  This doc is the *practice-wide* P&L view: every line item that is NOT
  per-client, plus the breakeven math against a planned tier price.
================================================================================
-->

# 20 — Launch & Operating Cost Model (Lumivara Infotech)

Practice-wide cost model for the freelance entity (provisional brand: **Lumivara Forge**, see [`01-business-plan.md §1`](./01-business-plan.md)). Owns:

1. Every recurring operating cost the practice incurs that is *not* a per-client cost-of-goods.
2. Every one-time launch / setup cost (legal, incorporation, brand, vault, accountancy onboarding).
3. Year-1 and Year-3 burn projections and the cost-per-customer breakeven against the planned headline tier price.
4. The single table where every plan / tier choice (which Vercel plan, which Claude tier, which Stripe product, which accounting tool) is locked.

> **Where the AI / GitHub / Vercel / Resend numbers live.** This doc does **not** restate per-tier AI costs, Action-minute envelopes, or capacity cliffs — those are owned by [`18-capacity-and-unit-economics.md`](./18-capacity-and-unit-economics.md) (the single source of truth) and the consumer-table contract in `18 §8` is binding. Cells below that need an AI-cost or infrastructure-quota number cite the relevant `18` anchor.
>
> **Where the per-client retainer margin lives.** Per-client cost-of-goods (AI cost allocation, operator hours, cash margin per tier) is in [`18 §5`](./18-capacity-and-unit-economics.md#5--margin-model-per-tier) and the ramp / setup-fee math is in [`docs/freelance/03-cost-analysis.md §A–D`](../freelance/03-cost-analysis.md). Don't re-derive them here.

All figures are CAD unless noted USD; the FX assumption is [`18 §1 fx_cad_per_usd`](./18-capacity-and-unit-economics.md#1--assumptions-table) (1 USD = 1.39 CAD). Re-use that rate; do not introduce a second.

---

## §1 — Cost categories at a glance

The practice's cost surface decomposes into seven categories. The table below is the spine of every other section.

| # | Category | Type | Owns | Section |
|---|---|---|---|---|
| A | **Per-client cost-of-goods** (AI, GitHub, Vercel, Resend) | Recurring | Variable with active client count and Claude quota tier. | Cited from [`18 §3`](./18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes) and [`18 §5`](./18-capacity-and-unit-economics.md#5--margin-model-per-tier); not re-stated here. |
| B | **Practice infrastructure** (n8n, dashboard, monitoring, mothership domain) | Recurring | Flat per month; doesn't scale with clients in the 1–30 band. | §3 |
| C | **Legal & compliance** (MSA / SOW templates, PIA, PIPEDA pages, breach template) | One-time setup + small annual refresh | Lawyer fees, registration, privacy templates. | §2 + §4 |
| D | **Payment processing** (Stripe / Lemon Squeezy fees, banking) | Recurring | Variable with revenue (% + per-transaction) plus banking fees. | §3 |
| E | **Accounting & tax** (bookkeeping software, accountant, GST/HST filing) | Recurring + annual | Software flat, accountant lumpy at year-end. | §3 + §4 |
| F | **Insurance & risk** (professional liability, cyber, business operations) | Recurring | Annual premium, billed monthly. | §3 |
| G | **Marketing & sales** (LinkedIn Premium, Fiverr fees, demo hosting, ad budget) | Recurring + per-conversion | Mostly flat; per-conversion via Fiverr's 20% take and inbound-lead spend. | §3 + §6 |
| H | **Operator tools** (1Password Business, IDE, second monitor, etc.) | Recurring | Per-seat; doubles when Cliff 5 hires the second seat. | §3 |

> **Why this list excludes payroll and contractor fees.** Until [`18 §6 #cliff-5-second-seat`](./18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points) trips (~26 active clients), the operator is the only person on payroll, and Ontario sole-prop draws are not a cost to the business — they are after-tax distributions. When Cliff 5 trips, the second-seat *salary* lands here as a new line item; the second Anthropic seat itself is already in [`18 §3 #ai-cost-band-2seat`](./18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes).

---

## §2 — One-time launch costs

What it costs to stand up the entity, the legal posture, and the operator toolchain *before* the first paying client. The numbers below are the *base case*; the "low" column assumes operator does some legwork themselves (drafts privacy pages, picks templates), the "high" column assumes a lawyer + accountant do everything.

| Line item | Low (CAD) | Base (CAD) | High (CAD) | When | Notes |
|---|---:|---:|---:|---|---|
| Sole-prop registration (Ontario Business Name Registration) | $60 | $80 | $80 | Pre-launch | Service Ontario; 5-year term. Required to operate under a name other than the operator's legal name. |
| Brand domain registration (`{{BRAND_SLUG}}.com` + 1 extension) | $25 | $40 | $60 | Pre-launch | Cloudflare Registrar at cost (~$10–15/yr each); 5-yr prepay optional. |
| Trademark search (DIY → CIPO formal) | $0 | $200 | $1,200 | Months 0–3 | DIY via [CIPO database](https://www.ic.gc.ca/app/opic-cipo/trdmrks/srch/home); formal application is $336 + per-class fees. Defer formal filing until after MRR > $3k. |
| Lawyer-drafted MSA + SOW + AUP templates | $1,200 | $1,800 | $2,500 | Before client #2 ([`08 §2`](./08-future-work.md#2-client-contract-terms-legal)) | Canadian small-business lawyer flat fee. One-time; reuse forever. |
| Privacy posture: PIA template + PIPEDA footer + subprocessor page | $0 | $0 | $800 | Before client #3 ([`08 §1`](./08-future-work.md#1-data-protection--privacy-legalcompliance)) | Operator-drafted from PIPEDA boilerplate is acceptable for sole-prop scale; lawyer review optional. |
| Quebec Law 25 French-language privacy page (only if QC client) | $0 | $0 | $600 | First QC client | Translation + legal review. Skip until first QC engagement. |
| Accountant onboarding (entity setup, GST/HST registration walk-through) | $0 | $300 | $600 | Before $30k revenue | GST/HST registration itself is free via CRA; accountant fee is the "set up books correctly" pass. |
| Business bank account opening (Tangerine / EQ Bank business chequing) | $0 | $0 | $0 | Pre-launch | Free at Tangerine / EQ Bank for sole-prop with no transaction fees up to ~50/mo. |
| Stripe account verification (identity + tax forms) | $0 | $0 | $0 | Pre-launch | Free; 1–3 business days. |
| 1Password Business — first month | $11 | $11 | $11 | Pre-launch | $8 USD/seat/mo × FX. Annual prepay shaves ~10%. |
| Brand assets (logo, basic site, business card PDF) | $0 | $250 | $1,500 | Pre-launch | Operator-DIY at $0 (already have the Next.js template); contractor for $250–1,500 if needed. |
| Initial marketing collateral (LinkedIn header, Fiverr gig graphics) | $0 | $100 | $400 | Pre-launch | Canva Pro one-month + DIY. |
| **One-time launch total** | **$1,296** | **$2,781** | **$7,751** | | Base case is the realistic expectation if operator does the privacy pages but lawyers the MSA. |

### Decision rule for the launch budget

The **base case ($2,781)** is what to plan for. Do *not* skip the lawyer-drafted MSA — it's the single largest cost, but it's also the only line item that materially reduces enterprise-grade legal risk. Everything else can be deferred or DIY'd; the contract templates cannot.

If the operator's launch capital is hard-capped, the **low case ($1,296)** is achievable by:
1. Drafting the MSA off a [Canadian Bar Association sample](https://www.cba.org/) and asking a lawyer for a flat-fee 1-hour review (~$300) instead of a full draft. (Counted as $1,200 in the low column.)
2. Skipping trademark filing until brand is validated.
3. Doing all marketing collateral DIY in Canva free.

### Anchor IDs

- `#one-time-launch-base` — the $2,781 number (consumed by §5 burn projection).
- `#one-time-launch-low`, `#one-time-launch-high` — the bracketing scenarios.

---

## §3 — Recurring operating costs (practice-wide)

What the practice spends *every month* regardless of client count. Per-client costs are in [`18 §5`](./18-capacity-and-unit-economics.md#5--margin-model-per-tier).

### Practice infrastructure (Category B)

Already partially captured in [`18 §1`](./18-capacity-and-unit-economics.md#1--assumptions-table); reproduced here as a *practice-level* monthly bill so this doc can sum to a Year-1 burn.

| Line item | Monthly (CAD) | Source / anchor | Cliff trigger |
|---|---:|---|---|
| Mothership domain DNS (Cloudflare) | $0 | Free tier | None |
| Mothership site hosting (Vercel) | $0 | [`18 §1 vercel_free_bandwidth`](./18-capacity-and-unit-economics.md#1--assumptions-table) (mothership site is low-traffic) | Vercel Pro at $20 USD/mo if mothership site grows |
| n8n on Railway (operator instance) | $0–$7 | [`18 §1 railway_free_credit`](./18-capacity-and-unit-economics.md#1--assumptions-table) → [`#cliff-3-railway-free-to-hobby`](./18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points) | Cliff 3, ~client #2 with SMS |
| Better Uptime monitoring | $0 | [`18 §1 betteruptime_free_monitors`](./18-capacity-and-unit-economics.md#1--assumptions-table) (50 free monitors) | Paid plan only past 50 monitors |
| Mothership GitHub plan | $0 | [`18 §1 gh_free_action_minutes`](./18-capacity-and-unit-economics.md#1--assumptions-table) | [`#cliff-2-github-free-to-team`](./18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points) at ~1,500 min/mo |
| Operator dashboard hosting | $0 | Vercel free tier (it's a static SPA) | Same as mothership |
| **Subtotal** | **$0–$7** | | Effectively free in the launch quarter. |

### Payment processing (Category D)

The practice has two product types: setup fees (one-time) and retainers (subscription). Stripe pricing for Canadian businesses:

| Product | Stripe rate | Monthly absorbed (per $1,000 revenue, approx) |
|---|---|---|
| Setup fee — Stripe Invoicing (one-time link) | 2.9% + $0.30 USD per charge (CAD card) | $29 + $0.30 USD per invoice |
| Retainer — Stripe Subscriptions (recurring) | 2.9% + $0.30 USD per charge (CAD card) + 0.5% recurring fee (Stripe Billing) | $34 + $0.30 USD per charge |
| US-issued cards on either product | +1.5% cross-border | Adds $15 per $1,000 cross-border revenue |
| Failed-charge retry | $0 (Stripe Smart Retries) | — |
| Disputes | $15 USD per dispute | Budget $0–$30/mo until practice has a dispute history |

**At Year-1 close** ([`docs/freelance/03-cost-analysis.md §D`](../freelance/03-cost-analysis.md) ramp): gross revenue ≈ $177,000 CAD. At 2.9% + $0.30 average across mixed setup + retainer + an average 1 charge per $250, processing burns roughly:

```
Stripe_year1 ≈ 177,000 × 0.029  +  ~330 charges × $0.30 USD × 1.39 FX
            ≈ 5,133 CAD          +  ~138 CAD
            ≈ $5,271 CAD/year
            ≈ $440 CAD/mo (Year-1 average; lower in early months)
```

Plus Stripe Billing's 0.5% recurring surcharge applied to MRR portion (≈ $46k of the $177k):

```
Billing_surcharge_year1 ≈ 46,000 × 0.005 ≈ $230 CAD/year
                       ≈ $19 CAD/mo
```

**Banking** (sole-prop chequing): $0/mo at Tangerine / EQ Bank if transaction count stays under ~50/mo. At ~30 active retainers + setup invoices the count is ~35–40/mo, comfortably free. Switch trigger: cross 50 transactions/mo OR open a USD account → CIBC Smart Business (~$11–25 CAD/mo). Budget $0/mo Year-1, $15/mo Year-2+.

### Accounting & tax (Category E)

| Line item | Monthly (CAD) | Annual (CAD) | Notes |
|---|---:|---:|---|
| Bookkeeping software (Wave Free, sole-prop tier) | $0 | $0 | Wave is free for unlimited invoicing + accounting; Stripe sync is free. Switch to QuickBooks Self-Employed (~$15 CAD/mo) only if Wave's reporting is insufficient for the accountant. |
| Accountant — quarterly bookkeeping review | $0 | $400 | Optional first year; required once GST/HST registered. ~$100/quarter at a junior accountant. |
| Accountant — year-end T2125 prep (sole-prop) | $0 | $600–$900 | One lump in Q1 for prior year. |
| GST/HST filing service | $0 | $0 | Operator self-files via CRA My Business Account once registered; no fee. |
| **Tax software** (TurboTax Self-Employed, only if no accountant) | — | $80 | Skip if accountant is used. |
| **Subtotal** (Year-1, accountant-light) | **$0** | **$1,000** | $83 CAD/mo amortised. |
| **Subtotal** (Year-2+, accountant doing quarterly + year-end) | **$0** | **$1,800** | $150 CAD/mo amortised. |

### Insurance & risk (Category F)

| Line item | Monthly (CAD) | Annual (CAD) | Notes |
|---|---:|---:|---|
| Professional liability / E&O (sole-prop tech, $1M limit) | $0 | $400–$600 | Per [`docs/freelance/03 §F`](../freelance/03-cost-analysis.md). Carry once revenue >$50k/yr. |
| Cyber liability rider (data breach response, $250k limit) | $0 | $300–$500 | Add when first PII-handling client signs (T2+ admin portal). |
| Tools-of-trade rider (laptop, monitor) on home insurance | $0 | $0–$120 | Often a $5–10/mo addition to existing tenant/home policy. |
| **Subtotal** (Year-1, before $50k revenue trigger) | **$0** | **$0** | Insurance starts when the trigger trips, mid-year. |
| **Subtotal** (Year-1 partial, post-trigger) | **$60** | **$700** | Pro-rated for ~6 months of coverage. |
| **Subtotal** (Year-2+, both policies) | **$83** | **$1,000** | |

### Marketing & sales (Category G)

| Line item | Monthly (CAD) | Year-1 total (CAD) | Notes |
|---|---:|---:|---|
| LinkedIn Premium Career (operator profile boost) | $40 | $480 | Optional but has a measurable conversion lift on outbound DMs. |
| LinkedIn Sales Navigator (only if outbound prospecting) | $0 | $0 | Skip Year-1; $99 CAD/mo when lead gen is the bottleneck (Year-2 candidate). |
| Fiverr Pro listing fee | $0 | $0 | Free to list; takes 20% of completed orders (counted as a contra-revenue, not a cost line — see breakeven note below). |
| Upwork Connects | $20 | $240 | Per-bid currency; ~$20/mo for steady proposing. |
| Demo site hosting (10 verticals on Vercel free) | $0 | $0 | All under [`18 §1 vercel_free_bandwidth`](./18-capacity-and-unit-economics.md#1--assumptions-table). |
| Demo site password protection (Vercel Pro) | $0 | $0 | Defer; rely on obscure preview URLs per [`09b-lumivara-forge-setup-plan.md §6`](./09b-lumivara-forge-setup-plan.md). |
| Paid ads (Google / Meta) | $0–$200 | $0–$2,400 | Defer to Year-2; organic + Fiverr is sufficient at sub-30 client scale. |
| Brand-domain email (Google Workspace, 1 user) | $9 | $108 | Required for `hello@{{BRAND_SLUG}}.com`; alternative is Zoho free for 1 user ($0). |
| **Subtotal** (Year-1, lean) | **$69** | **$828** | LinkedIn Premium + Upwork + Workspace. |
| **Subtotal** (Year-2+, with Sales Nav and modest ads) | **$268** | **$3,200** | Add Sales Nav + $100/mo ad budget. |

### Operator tools (Category H)

| Line item | Monthly (CAD) | Year-1 total (CAD) | Notes |
|---|---:|---:|---|
| 1Password Business (per [`08 §4`](./08-future-work.md#4-ip--business-secrets-vault)) | $11 | $134 | $8 USD/seat/mo × FX. Trigger: before client #5. |
| Bitwarden self-host backup (Railway) | $7 | $84 | Per [`08 §4`](./08-future-work.md#4-ip--business-secrets-vault). Optional; merges into Cliff 3 Railway Hobby plan. |
| Cursor / Codex IDE seat | $20 | $240 | $20 USD/mo. Operator already pays this personally; carry as a business expense once incorporated. |
| ChatGPT Plus (operator second-opinion review) | $28 | $334 | $20 USD/mo × FX; per [`AGENTS.md` Model Selection table](../../AGENTS.md). |
| Gemini Advanced (deep research + 1M-context fallback) | $28 | $334 | $20 USD/mo × FX; per [`AGENTS.md`](../../AGENTS.md). |
| Misc SaaS (Notion, Loom, Calendly, etc.) | $40 | $480 | Bracket; trim Year-2 once habits settle. |
| **Subtotal** (Year-1, full toolchain) | **$134** | **$1,606** | Some items kick in mid-year (1Password before client #5), so actual Year-1 is closer to $1,200. |

### Practice-wide recurring totals (excluding per-client cost-of-goods)

| Category | Year-1 (CAD) | Year-3 steady-state (CAD/yr) |
|---|---:|---:|
| B Practice infrastructure (n8n Hobby + Cliff 2 Team plan) | ~$200 | ~$400 |
| D Payment processing (Stripe + banking) | ~$5,500 | ~$15,000 |
| E Accounting & tax | ~$1,000 | ~$1,800 |
| F Insurance & risk (partial-year Year-1) | ~$700 | ~$1,000 |
| G Marketing & sales (lean) | ~$828 | ~$3,200 |
| H Operator tools (partial-year ramp) | ~$1,200 | ~$1,800 |
| **Subtotal — practice-wide non-AI** | **~$9,400 CAD** | **~$23,200 CAD** |
| A Per-client cost-of-goods (AI / GitHub / Vercel etc., from [`18 §3`](./18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes), CAD-converted, derived from `freelance/03 §D` ramp) | ~$2,800 | ~$8,500 |
| **Total recurring operating cost** | **~$12,200 CAD** | **~$31,700 CAD** |

> **Why Year-3 steady-state revenue jumps payment-processing 3×.** Year-3 assumes the practice has stabilised at the [`18 §1 operator_hard_cap_clients`](./18-capacity-and-unit-economics.md#1--assumptions-table) (~30 clients) with churn replenished from a steady inbound pipeline. Gross revenue at that scale is ~$520k CAD/yr (~$43k/mo gross from MRR + setup-fee replenishment), so 2.9% is ~$15k/yr.

### Anchor IDs

- `#recurring-y1-non-ai` — the $9,400 number.
- `#recurring-y1-total` — the $12,200 number.
- `#recurring-y3-non-ai`, `#recurring-y3-total`.

---

## §4 — Year-1 vs Year-3 burn comparison

Year-3 is the planning horizon for the "is the practice viable as a full-time business?" question. The numbers below combine [§2 one-time launch](#2--one-time-launch-costs) + [§3 recurring](#3--recurring-operating-costs-practice-wide) and add the revenue side from [`docs/freelance/03 §D`](../freelance/03-cost-analysis.md).

### Year-1 P&L (single-operator phase)

| Bucket | Amount (CAD) | Source |
|---|---:|---|
| **Revenue** | | |
| MRR (sum of months 1–12) | ~$45,400 | [`freelance/03 §D`](../freelance/03-cost-analysis.md) MRR column summed |
| Setup fees (sum of months 1–12) | ~$123,500 | Same table |
| **Gross revenue Year-1** | **~$168,900** | (Note: `freelance/03 §D` quotes ~$177k, the $8k delta is mix-rounding noise. Use the table's $177k as authoritative.) |
| **Costs** | | |
| One-time launch ([§2 base](#2--one-time-launch-costs)) | -$2,781 | This doc §2 |
| Recurring operating ([§3 total](#3--recurring-operating-costs-practice-wide)) | -$12,200 | This doc §3 |
| Fiverr take (estimated 20% × $20k of revenue from Fiverr-sourced clients) | -$4,000 | Optional contra; only if Fiverr is the source. Skip if outbound LinkedIn dominates. |
| **Year-1 net before tax** | **~$152,000–158,000** | |
| Personal income tax @ Ontario sole-prop ([`18 §1 tax_band_ontario_soleprop`](./18-capacity-and-unit-economics.md#1--assumptions-table) range 25–30%) | -$38,000 to -$47,400 | Range, not single number; consult an accountant. |
| **Year-1 take-home** | **~$105,000–120,000 CAD** | Materially aligned with [`freelance/03 §D`](../freelance/03-cost-analysis.md) "$118k–$128k" headline (delta = the new non-AI line items this doc surfaces). |

### Year-3 P&L (steady-state, 30 active clients, single-operator)

| Bucket | Amount (CAD) | Source |
|---|---:|---|
| **Revenue** | | |
| MRR @ 30 clients × ~$220 average tier blend × 12 mo | ~$79,200 | Mix: 5 T1 ($99) + 18 T2 ($249) + 7 T3 ($599) ≈ $6,600/mo MRR |
| Setup fees @ replenishment rate (10% churn → 3 new clients/yr × $4,500 avg) | ~$13,500 | Replenishment only; gross-up if growing past 30 |
| **Gross revenue Year-3** | **~$92,700** | Note: this is *plateau*, not growth |
| **Costs** | | |
| Recurring operating ([§3 Year-3 total](#3--recurring-operating-costs-practice-wide)) | -$31,700 | Includes 3× payment processing because revenue grew |
| **Year-3 net before tax** | **~$61,000** | |

> **Wait — Year-3 net is *lower* than Year-1?** Yes, and this is the most important number in the doc. The reason: Year-1 was dominated by the *lumpy* setup-fee revenue from acquiring 30 new clients in 12 months. Year-3 is steady-state — only ~3 setup fees/year (replenishment), so revenue is mostly MRR and there is no acquisition surge to mask costs. **The practice's *sustainable* take-home at single-operator hard cap is ~$45k–$50k CAD/yr after-tax.** That is below Ontario median software salary. The practice is only economically attractive if either:
>
> 1. The operator continues acquiring clients past the hard cap (which forces [`#cliff-5-second-seat`](./18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points) and a salary line item), OR
> 2. The operator raises tier prices materially (see §5 breakeven below), OR
> 3. The operator productises the autopilot itself (Tier 4 white-label — see [`08 §5`](./08-future-work.md#5-market-research--expansion-plans)).
>
> This is a planning insight, not a verdict. Year-1 is genuinely lucrative; Year-3 is a *job*, not a *business*, unless one of the three levers above is pulled.

### Year-3 with second seat (Cliff 5 hired)

| Bucket | Amount (CAD) |
|---|---:|
| Gross revenue (50 active clients) | ~$155,000 |
| Recurring operating + 2nd seat AI cost (per [`18 §3 #ai-cost-band-2seat`](./18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes)) | -$45,000 |
| Second-seat salary (part-time engineer, $60k CAD pro-rated to 0.5 FTE) | -$30,000 |
| **Year-3 net before tax** | **~$80,000** |
| Take-home after Ontario sole-prop tax | **~$56,000–60,000** |

The 2nd-seat scenario is *more profitable take-home* than the single-operator hard cap because the operator's hours are no longer the bottleneck. This is the core argument for the hiring decision in [`#cliff-5-second-seat`](./18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points): hire because the math gets better, not because the operator burns out.

### Anchor IDs

- `#year1-net`, `#year1-take-home`
- `#year3-single-operator-net`, `#year3-second-seat-net`
- `#sustainability-warning` — the callout above explaining why Year-3 single-operator is a "job, not a business."

---

## §5 — Cost-per-customer breakeven

Anchored on Tier 2 (Pro) at **$249 CAD/mo MRR + $4,500 setup**, which [`docs/freelance/02-pricing-tiers.md`](../freelance/02-pricing-tiers.md) names as the headline tier.

### Per-customer fully-loaded cost (Year-1, T2 Pro)

| Line item | Per-T2-customer per-month (CAD) | Source |
|---|---:|---|
| AI cost allocation ([`18 §5 #margin-t2`](./18-capacity-and-unit-economics.md#5--margin-model-per-tier)) | $5 | `18 §5` |
| Per-client infra (Vercel + GitHub headroom) | $0 | [`freelance/03 §A`](../freelance/03-cost-analysis.md) |
| Practice overhead allocation (§3 Year-1 total $12,200 ÷ avg 16 clients × 12 mo) | $64 | $12,200 / (16 × 12) |
| Payment processing (2.9% × $249 + $0.30 USD × 1.39 FX) | $7.66 | Stripe |
| Fiverr take (only if Fiverr-sourced; 20% × $249) | $0 or $50 | Skip if outbound LinkedIn |
| **Fully-loaded cost per T2 customer (no Fiverr)** | **~$77 CAD/mo** | |
| **Fully-loaded cost per T2 customer (Fiverr-sourced)** | **~$127 CAD/mo** | |

### Breakeven

| Metric | Value | Interpretation |
|---|---:|---|
| T2 monthly retainer | $249 | |
| Fully-loaded cost (no Fiverr) | $77 | |
| **Net per T2 customer per month** | **$172** | 69% gross margin |
| Months to recoup operator's [§4 launch + 1 month operating cost](#4--year-1-vs-year-3-burn-comparison) ($2,781 + $1,000) | ~22 customer-months | i.e. 2 customers × 11 months OR 22 customers × 1 month |
| **Customer count at which Year-1 recurring covers itself** ($12,200 / $172) | **~71 customer-months** | Realistic: 6 customers × 12 months, OR 12 customers × 6 months. Year-1 ramp ([`freelance/03 §D`](../freelance/03-cost-analysis.md)) hits this around month 4 of paid operations. |
| **Payback period for one new T2 acquisition** (setup cost $0 since builds are operator-time + $4,500 setup fee) | **Day 1** | The setup fee already covers the marginal acquisition cost; every monthly retainer is pure cash margin minus the $77 fully-loaded cost. |

### Pricing sensitivity (what if T2 is $199 instead of $249?)

| Scenario | T2 MRR | Fully-loaded cost | Net | Year-1 break-even client-month count |
|---|---:|---:|---:|---:|
| Headline ($249) | $249 | $77 | $172 | ~71 |
| Discount ($199) | $199 | $76 (lower Stripe %) | $123 | ~99 |
| Premium ($299) | $299 | $78 | $221 | ~55 |

**The $50 discount from $249 → $199 increases breakeven client-months by 40%.** This is the math behind the operator's "do not race to the bottom" instinct in [`docs/freelance/01-gig-profile.md`](../freelance/01-gig-profile.md).

### Anchor IDs

- `#breakeven-t2-headline`, `#breakeven-t2-discount`, `#breakeven-t2-premium`
- `#per-customer-cost-fully-loaded`

---

## §6 — Plan & tier choices (the lock table)

Single source of truth for "which plan / tier / vendor is the practice committed to?" Update only via §7 change log.

| Decision | Choice | Rationale | Cliff trigger that revisits this |
|---|---|---|---|
| Anthropic plan (operator) | Claude Pro at launch → Max 5x at client #6 → Max 20x at client #16 → 2nd seat at #26 | [`18 §6`](./18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points) cliffs | All four cliffs |
| Gemini plan | Free tier (Pro 100 RPD + Flash 500 RPD) | [`18 §1 gemini_free_*`](./18-capacity-and-unit-economics.md#1--assumptions-table) covers our volume | Volume cross 100 RPD on Pro |
| OpenAI / Codex plan | ChatGPT Plus ($20 USD/mo) for second-opinion review | [`AGENTS.md` Model table](../../AGENTS.md) | If Codex review volume exceeds Plus quota |
| GitHub plan (mothership org) | Free → Team at Cliff 2 | [`#cliff-2-github-free-to-team`](./18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points) | Cliff 2 |
| Vercel plan (mothership site) | Free | Mothership site is low-traffic | Pro at $20 USD/mo if mothership marketing site grows past free-tier limits |
| Vercel plan (per-client sites) | Free | Per [`docs/freelance/03 §A`](../freelance/03-cost-analysis.md) | Client opts into Pro themselves; not on operator P&L |
| Resend plan | Free (3,000 emails/mo) | [`18 §1 resend_free_emails`](./18-capacity-and-unit-economics.md#1--assumptions-table) | Cross 3,000 emails/mo across all client contact forms |
| Twilio (SMS) | Pay-as-you-go | [`18 §1 twilio_*`](./18-capacity-and-unit-economics.md#1--assumptions-table) | None — usage-based |
| Railway plan | Free → Hobby at Cliff 3 | [`#cliff-3-railway-free-to-hobby`](./18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points) | Cliff 3 |
| Better Uptime | Free (50 monitors) | [`18 §1 betteruptime_free_monitors`](./18-capacity-and-unit-economics.md#1--assumptions-table) | Cross 50 monitors |
| Payment processor | Stripe (Standard Canadian rates) | Built-in subscription billing, smart retries, dispute tooling | Year-2 review: Lemon Squeezy if global-MoR offload becomes worth the higher fee |
| Bookkeeping software | Wave Free | Free, syncs Stripe natively | Switch to QuickBooks Self-Employed (~$15 CAD/mo) if accountant requests |
| Accountant cadence | Year-end T2125 only Year-1 → quarterly review Year-2+ | §3 Accounting subtotal | GST/HST registration (revenue >$30k forces quarterly) |
| Business banking | Tangerine Business chequing (free) | Free up to ~50 transactions/mo | Cross 50 transactions OR need USD account → CIBC Smart Business |
| Insurance carrier | TBD; Hub International / Zensurance for sole-prop tech | Once revenue >$50k | E&O + cyber rider add-on at first PII-handling client |
| Password vault | 1Password Business + Bitwarden self-host backup | [`08 §4`](./08-future-work.md#4-ip--business-secrets-vault) | Before client #5 |
| Brand-domain email | Google Workspace Starter (1 user) | Custom domain professionalism | Add second seat at Cliff 5 |
| LinkedIn plan | Premium Career Year-1 → Sales Navigator Year-2 | §3 Marketing | When outbound prospecting becomes the bottleneck |
| Operator IDE | Cursor / Codex ($20 USD/mo) | Existing operator tool | None |

### Anchor IDs

- `#plan-lock-table` — the whole table (consumed by every doc that asks "which plan are we on?")
- `#stripe-rate-canadian` — Stripe Standard rate row, for any doc that needs to compute payment processing.

---

## §7 — Assumption change log

Append-only. Add a row whenever a §2, §3, §6 line moves by more than ±10% OR a vendor choice in the lock table changes. Format mirrors [`18 §7`](./18-capacity-and-unit-economics.md#7--assumption-change-log).

| Date | Changed line | Old value | New value | Reason | Downstream impact |
|---|---|---|---|---|---|
| 2026-04-29 | (seeded) §2 one-time launch base case | (none) | $2,781 CAD | Initial draft per #113 | §4 Year-1 net references this. Reconciles with `freelance/03 §D` headline within ~$8k mix-rounding noise. |
| 2026-04-29 | (seeded) §3 Year-1 recurring practice-wide non-AI | (none) | ~$9,400 CAD | Initial draft per #113 | New surface area not previously aggregated. Pulls the line items that were scattered in `08 §1–§4` into one model. |
| 2026-04-29 | (seeded) §5 fully-loaded T2 cost-per-customer | (none) | $77 CAD/mo (no Fiverr) | Initial draft per #113 | First explicit breakeven calc. `freelance/03 §A` summary cost-of-goods only counted AI + operator time; this adds practice-overhead allocation + Stripe fees. |
| 2026-04-29 | (seeded) Year-3 single-operator sustainability warning | (none) | ~$45–50k take-home | Initial draft per #113 | Material business decision: forces a 30+ client expansion plan OR a price increase OR Cliff 5 hire to sustain operator-comparable take-home. Surfaced in §4. |

---

## §8 — How to use this doc

1. **Quarterly P&L review.** Run §4 Year-1 P&L against actuals from Wave / Stripe / banking. Variance > 15% on any line → §7 entry.
2. **Before any vendor change.** Check §6 lock table. If the change isn't trivial (i.e. it isn't already a cliff trigger), open an issue with `model/opus` to reason about the swap.
3. **Before raising prices.** Re-run §5 sensitivity. The shape of the breakeven curve is more important than the headline number.
4. **Before hiring.** §4 Year-3 with-second-seat scenario is the math. If it doesn't hit the threshold the operator considers acceptable, the answer is "raise prices first, hire second."
5. **Annual update.** January each year: refresh §6 lock table by checking each vendor's current pricing; refresh §3 totals; add a §7 row capturing the deltas.

### Open follow-ups (deferred, will become issues)

- **Verification script.** Mirror the [`18 §10`](./18-capacity-and-unit-economics.md#10--out-of-scope-deferred-follow-ups) pattern: a `git grep` enforcement that any dollar figure appearing in §3 or §5 either lives in `18 §1` or in this doc's §2/§3, and is referenced by anchor elsewhere. `scripts/*` is human-only, so opens as a separate `infra-allowed` issue.
- **Incorporation comparison.** This doc assumes Ontario sole-prop. The Year-3 cliff-5 scenario is also where incorporation becomes worth it (small-business deduction = 12.2% combined fed/prov on first $500k). Open a follow-up to model "sole-prop vs CCPC at $150k revenue" once Year-1 actuals are in.
- **Currency hedging.** All AI / SaaS spend is USD; revenue is CAD. At ~$8k USD/year of Year-1 spend the FX risk is modest, but ties to [`18 §1 fx_cad_per_usd`](./18-capacity-and-unit-economics.md#1--assumptions-table). Open a follow-up if the rolling-90-day FX moves >5% from the 1.39 baseline.
- **Cost-of-acquisition (CAC) tracking.** §5 assumes setup fee fully covers acquisition cost. Once Fiverr / Upwork / LinkedIn lead-source attribution is wired into the dashboard, recompute fully-loaded cost per customer with real CAC.

*Last updated: 2026-04-29.*
