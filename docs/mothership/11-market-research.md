<!-- OPERATOR-ONLY. Market-and-product viability research for Lumivara Forge Sites.
     Pulled forward from 08 §5; revisit quarterly from month 6 of paid operations. -->

# 11 — Market Research: Lumivara Forge Sites (Product 1) and Expansion Vision

> _Lane: 🛠 Pipeline — operator-only market-and-product research; never copied to a client repo._
>
> **Pulled forward.** [`08-future-work.md §5`](./08-future-work.md) deferred this work to month 6 of paid operations. The operator pulled it forward (issue #112) so that pricing, channel, and expansion decisions taken before client #1 lands are at least anchored against TAM / SAM / SOM and a competitive scan, rather than guesses. The status row in `00-INDEX.md` for `08 §5` is updated accordingly.
>
> **Live figures placeholder.** Several rows below need current Stats Canada / CFIB numbers and are flagged `[SOURCE NEEDED — …]`. The operator is expected to fill those in during the first quarterly refresh, citing the source in-line. Until that happens the qualitative conclusions stand; the numeric magnitudes do not.

This doc is the canonical answer to: *"Is there a real market for the Lumivara Forge Sites product, who is already in that market, and where does the practice expand once the headline product is validated?"* It supersedes the light market-research notes in `docs/storefront/01-gig-profile.md` (target customers, channels) and pulls forward the deferred §5 from `08-future-work.md`.

---

## §1 Product 1 — Automated self-maintained websites: market viability

### 1.1 Target market definition

| Dimension | Definition |
|---|---|
| Geography | Ontario-first; Canada-wide expansion in months 12–24 (BC then Quebec — see [§4.2](#42-geo-expansion-months-1224)). |
| Business type | Local small businesses without a web presence or with a stale, decaying one. **Not** SaaS, **not** e-commerce, **not** enterprise. |
| Headcount | 1–10 employees, owner-operated. |
| Revenue | CAD $100k – CAD $2M annual. The lower bound filters out hobby businesses; the upper bound filters out businesses that should be paying agency rates. |
| Decision-maker | The owner / founder. One signature, one cheque, one inbox. No procurement. |
| Disqualifiers | High-volume e-commerce (use Shopify), regulated industries needing bespoke compliance (medical, financial advice), enterprise procurement cycles. |

### 1.2 Market size — TAM / SAM / SOM

The numbers below cite ranges that are directionally correct based on the operator's prior reading of CFIB / Stats Canada small-business data. They must be replaced with live figures during the first quarterly refresh.

| Layer | Definition | Estimate | Source |
|---|---|---|---|
| **TAM (Canada)** | All Canadian small businesses (1–99 employees) | ~1.2M businesses | `[SOURCE NEEDED — Stats Canada SME profile, latest year — statcan.gc.ca]` |
| **TAM (Canadian SBs without a professional web presence)** | TAM × % without a usable site | ~30–40% of TAM ≈ 360k–480k | `[SOURCE NEEDED — CFIB digitisation survey, latest]` |
| **TAM (Ontario slice)** | Ontario share of Canadian small businesses | ~38% of national → ~140k–180k | `[SOURCE NEEDED — Stats Canada provincial breakout]` |
| **SAM** | Ontario subset that can/will pay CAD $49–$599/mo for a managed site (proxy: revenue > CAD $200k) | ~25–35% of Ontario TAM ≈ 35k–60k | Operator estimate; validate via channel-conversion data after first 10 clients |
| **SOM (12-month)** | What one founder-operator can realistically close, build, and retain | 10–25 paying clients | Capacity-bounded — see [`docs/mothership/18-capacity-and-unit-economics.md §6`](./18-capacity-and-unit-economics.md) Cliff 1–4 |

**Read of the numbers.** Even at the bottom of every range above, the addressable Ontario market is 5+ orders of magnitude larger than the SOM — meaning *demand is not the constraint; reach and operator capacity are*. This matches the "reach is the bottleneck" sanity-check in [`docs/storefront/03-cost-analysis.md` Part G](../storefront/03-cost-analysis.md).

### 1.3 Revenue opportunity

Tier prices and headline tier from [`docs/storefront/02-pricing-tiers.md`](../storefront/02-pricing-tiers.md). Steady-state mix assumed: 10% Tier 0, 30% Tier 1, 50% Tier 2 (the headline tier per the same doc), 10% Tier 3.

| Active clients | T0 (10%) | T1 (10%×$99) | T2 (50%×$249) | T3 (10%×$599) | Blended MRR (CAD) |
|---|---|---|---|---|---|
| 10 | 1 × $0 | 3 × $99 = $297 | 5 × $249 = $1,245 | 1 × $599 = $599 | **~$2,141** |
| 20 | 2 × $0 | 6 × $99 = $594 | 10 × $249 = $2,490 | 2 × $599 = $1,198 | **~$4,282** |
| 30 | 3 × $0 | 9 × $99 = $891 | 15 × $249 = $3,735 | 3 × $599 = $1,797 | **~$6,423** |

Cross-reference: the projection table in [`docs/storefront/03-cost-analysis.md` Part D](../storefront/03-cost-analysis.md) reaches ~CAD $9.2k MRR by month 12 at 32 active clients with a slightly Tier 2-heavier mix; the blended-mix numbers above land slightly more conservative because they assume a flatter tier distribution. Both clear the day-job-replacement number from `03 Part C` once setup-fee revenue is layered on.

### 1.4 Competitive landscape

Six named competitors plus the operator's own product. Columns scored as Yes / Partial / No.

| Competitor | Category | Price range (USD/mo unless noted) | AI-maintained? | Phone-editable? | Subscription-priced? | Autopilot improvement runs? |
|---|---|---|---|---|---|---|
| **Squarespace** | DIY SaaS website builder | $16–$49 | No | Partial (mobile editor exists; prompt-style edits do not) | Yes | No |
| **Wix** | DIY SaaS website builder | $17–$159 | Partial (Wix ADI does layout once; not ongoing) | Partial | Yes | No |
| **GoDaddy Websites + Marketing** | DIY + light agency | $10–$25 | No | No | Yes | No |
| **Duda** | Agency-resold builder | $19–$99 (agency pays) | No | No | Yes (agency contract) | No |
| **Local web design studios (Toronto / GTA)** | One-time bespoke build | CAD $1,000–$10,000 upfront + ad-hoc change requests | No | No | No (project + retainer split) | No |
| **Fiverr / Upwork freelancers** | One-time gig | $200–$2,000 build, then nothing | No | No | No | No |
| **Lumivara Forge Sites (this product)** | Subscription + autopilot | CAD $49–$599/mo + setup (see [`02-pricing-tiers.md`](../storefront/02-pricing-tiers.md)) | **Yes** | **Yes** | **Yes** | **Yes** |

**Moat read.** No competitor in the Ontario small-business segment combines (a) AI-maintained ongoing improvements, (b) phone-first edit submission, and (c) an inclusive monthly subscription that bakes in change-requests. DIY builders force the owner to do the editing; bespoke studios + freelancers do the editing once and then bill ad-hoc; agency-resold builders (Duda) require an agency in the loop. Lumivara Forge Sites occupies the empty quadrant.

The moat is **operational, not technological**. Anyone with the same model access can build the same product; what is hard to copy is the per-tier cadence, the multi-AI fallback, the phone-edit pipeline, and the operator runbook around them. That is exactly the IP set protected by [`21-ip-protection-strategy.md`](./21-ip-protection-strategy.md).

### 1.5 Viability verdict

**Verdict: viable, conditional on reach.** The product fills an empty quadrant in a large addressable market, sells against weak alternatives (DIY tools that the target customer demonstrably does not use, or one-time builds that decay), and the unit economics in [`docs/storefront/03-cost-analysis.md`](../storefront/03-cost-analysis.md) clear day-job-replacement at 25–30 active clients. The single binding constraint is acquisition — the operator must reliably close ~3 retainer clients per month from cold to hit the 12-month projection. That is the question §2 below addresses.

---

## §2 Product 1 — Channels and conversion assumptions

### 2.1 Channel priority

Ranked by expected LTV ÷ CAC after 12 months of operation (best ratio first):

1. **Warm referrals** — the operator's existing professional network (LinkedIn 1st-degree connections, prior colleagues, prior clients). Highest close rate, shortest sales cycle, lowest CAC.
2. **LinkedIn DMs + posts** — outbound DMs to 2nd-degree connections in target verticals; cadence-driven posting (1–2 posts/week showing real client outcomes). Medium close rate, medium cycle, low CAC.
3. **Fiverr / Upwork** — high inbound volume, but lower-fit prospects skewed toward Tier 0 / Tier 1. Useful as a top-of-funnel during the first 6 months while the operator builds five-star reviews; deprioritise once warm channels are producing.
4. **Own infotech website (`lumivara-forge.com`)** — long-term organic SEO + portfolio. Low immediate yield; compounds over 12–24 months. Worth shipping in the first month even though it won't pay back until month 6+.

### 2.2 Conversion funnel assumptions

The funnel below is conservative — designed to be beaten, not hit exactly.

| Stage | Definition | Assumed rate | Notes |
|---|---|---|---|
| Impression | Anyone who sees a post / DM / gig listing / referral mention | — | Top of funnel |
| Visit | Clicks through to the storefront, the case-study post, or the gig | 2–5% of impressions | Channel-dependent; LinkedIn posts ~2%, Fiverr listings ~5% |
| Discovery call booked | Replies / books a 30-min intro | 5% of visits | The hard step — most prospects bounce here |
| Proposal sent | Operator decides client is a fit and sends a written proposal | 50% of calls | The other 50% are filtered out by the [`docs/storefront/01-gig-profile.md`](../storefront/01-gig-profile.md) "say no to" rules |
| Signed | Client signs MSA + SOW and pays setup fee | 50% of proposals | Tier 2 close rate; Tier 0 closes at ~70%, Tier 3 at ~30% |

**End-to-end rate, blended:** ~0.5% of impressions → signed. To produce **3 signed clients per month**, the operator needs **~600 net impressions per month per channel × 3–4 active channels** = on the order of 2,000+ impressions total. This is achievable on LinkedIn at 1–2 posts per week with engagement.

### 2.3 CAC estimate by channel

| Channel | Mostly-money CAC | Mostly-time CAC | Combined CAC (CAD/client) |
|---|---|---|---|
| Warm referrals | $0 | ~1 hr/client (the discovery call only) | **~$0–$50** (notional time cost) |
| LinkedIn DMs + posts | $0 | ~3–5 hr/client (writing, DMing, replying) | **~$150–$250** at $50/hr internal rate |
| Fiverr / Upwork | $0 (no ads) | ~2 hr/client (gig-listing maintenance + per-prospect questions) | **~$100–$150** |
| Own site (organic) | $20/mo Vercel + $20/yr domain ≈ $20/mo | ~10 hr/mo writing posts ÷ N clients | **~$50** at scale, **~$500** in month 1 |

CACs are well within Tier 2 / Tier 3 LTV (next subsection). Tier 0 / Tier 1 — barely. That is the strategic argument for treating Tier 0 as a [loss-leader](./18-capacity-and-unit-economics.md) and concentrating sales effort on Tier 2 prospects.

### 2.4 LTV estimate

LTV = (monthly fee × retention months) + setup fee. Retention is the variable that dominates.

| Tier | Setup | Monthly | Assumed retention (median, to validate) | **LTV (CAD)** |
|---|---|---|---|---|
| Tier 0 | $1,200 | $0 | 1 month (it's a one-time build) | $1,200 |
| Tier 1 | $2,400 | $99 | 18 months | $4,182 |
| Tier 2 | $4,500 | $249 | 18 months | $8,982 |
| Tier 3 | $7,500 | $599 | 24 months | $21,876 |

The 18-month retention assumption is the same one called out in [`08-future-work.md §5`](./08-future-work.md) as needing empirical validation. The LTV-by-tier validation is question 2 in §3 below.

---

## §3 Phase-1 validation questions (first 6 months)

The four questions reproduced from [`08-future-work.md §5`](./08-future-work.md) plus two additions. Each has an instrumentation plan; together they form the operator's monthly-review checklist from month 1 onward.

### 3.1 Where does the autopilot break down?

**Hypothesis to falsify:** the autopilot is fit-for-purpose across all six target verticals (restaurant, plumbing, real-estate, recruitment, law, accounting + the four secondary verticals from [§4.1](#41-adjacent-verticals-months-618)).

**Failure thresholds:**
- > 3 manual-override incidents per client per month → mark vertical "needs hardening".
- > 1 in 5 phone edits requires operator rewrite → mark vertical "not autopilot-ready".
- > 25% of monthly improvement-run PRs reverted within 30 days → autopilot tuning required.

**Instrumentation:** label every PR `manual-override` when the operator hand-edits before merge; weekly review.

### 3.2 What is the empirical LTV by tier?

**Method:** Stripe subscription cohort analysis from client #1 onward. Track median months-to-cancel by tier. Replace the placeholder retention numbers in [§2.4](#24-ltv-estimate) once each tier has 5+ data points.

**Decision rule:** if Tier 1 retention < 6 months, Tier 1 is unprofitable and should be sunset; Tier 0 + Tier 2 only.

### 3.3 What channels actually convert?

**Method:** UTM-tag every inbound link (LinkedIn posts, Fiverr profile, organic site, referrals via discovery-call form). Track signed clients by source.

**Decision rule:** drop any channel that has produced zero signed clients in a 90-day window despite ≥ 100 impressions.

### 3.4 When does the bot need human rescue?

**Method:** the `manual-override` label from §3.1 doubles as the rescue counter. Track per-client per-month. Tier 0 / Tier 1 expectation: ≤ 1 rescue/mo. Tier 2 / Tier 3 expectation: ≤ 2 rescues/mo.

**Decision rule:** if rescues exceed 4× the expected rate for a single client over two consecutive months, escalate the client to the next tier OR offboard.

### 3.5 What is the actual churn driver?

**Method:** every cancelled client receives a 5-question exit survey (price / fit / quality / responsiveness / "other"). Operator reviews quarterly.

**Decision rule:** if "price" is the top reason in > 50% of exits, prices are too high for the channel mix; if "fit" dominates, the "say no to" filter in [`01-gig-profile.md`](../storefront/01-gig-profile.md) needs tightening.

### 3.6 What is the referral rate?

**Method:** ask every client at month 3 and month 6: "would you refer us?" and track who actually does. UTM-tag referral links uniquely so referrals show up in §3.3 instrumentation.

**Decision rule:** if referral rate < 10% by month 12, the customer experience has a quiet defect; investigate via §3.5 surveys.

---

## §4 Next product — expansion vision

The operator hinted at "automation / self-sustaining / branding / communication / marketing" sub-products in [`15-terminology-and-brand.md §3`](./15-terminology-and-brand.md). This section sequences them.

### 4.1 Adjacent verticals (months 6–18)

Same product (Lumivara Forge Sites), new audience. The ten verticals already enumerated in the operator's gig profile and brand-voice notes:

| Vertical | Ontario count (rough) | Site complexity | Tier fit | Notes |
|---|---|---|---|---|
| Restaurant | High — `[SOURCE NEEDED — restaurant count, Restaurants Canada]` | Low (menu + hours + booking) | T1–T2 | Templates already started — see `templates/00-templates-index.md` |
| Plumbing | Medium — `[SOURCE NEEDED — CHBA / trades registry]` | Low (services + quote form + emergency contact) | T1 | Stub template |
| Real-estate (solo agent) | High | Medium (listings feed) | T2 | Stub template |
| Recruitment / staffing (small firm) | Medium | Medium (open-roles feed) | T2 | Stub template |
| Law (solo practitioner) | Medium | Low–medium | T2–T3 | Compliance-sensitive — see [§4.2 Quebec note](#42-geo-expansion-months-1224) |
| Barber / salon | High | Low | T1 | Booking integration is the pull |
| Accounting (solo CPA) | Medium | Low | T2 | Tax-season seasonality |
| Physiotherapy / wellness | Medium | Low–medium | T2 | Booking + patient intake |
| Electrical contractor | Medium | Low | T1 | Mirrors plumbing |
| Dental (single-location) | Medium | Medium | T2–T3 | Patient intake compliance — review with counsel before targeting |

**Sequencing rule:** prove the autopilot in vertical *N* (≥ 3 paying clients, all four §3 questions answered) before targeting vertical *N+1*. This protects the operator from running ten half-tuned templates at once.

### 4.2 Geo expansion (months 12–24)

| Province / region | Compliance friction | Other friction | Trigger |
|---|---|---|---|
| **BC** | Low — PIPA-BC mostly mirrors PIPEDA | None significant | After Ontario MRR > CAD $5k |
| **Quebec** | **High — Law 25** (French-language privacy page, consent flows, sub-processor list, mandatory DPO designation for some sites) — see [`08-future-work.md §1`](./08-future-work.md) | French-language content production | Defer until counsel-reviewed Law 25 stack lands; not before month 18 |
| **US (Ontario border markets — Detroit / Buffalo)** | Medium — CCPA + state-level patchwork | USD billing + cross-border tax (NEXUS) | Defer until total MRR > CAD $10k AND a US accountant is engaged |

### 4.3 White-label for agencies (months 18–36)

Already designed as **Tier 4 — Agency / White-label** in [`docs/storefront/02-pricing-tiers.md`](../storefront/02-pricing-tiers.md).

- **Trigger:** 20 active direct clients + the operator has spare capacity AND is not actively prospecting.
- **Revenue model:** per-agency reseller licence fee + per-site monthly royalty, capped at 5 sites per agency contract before custom enterprise pricing.
- **Risk:** agencies may try to negotiate the operator's brand off the site footer; the "Built on Lumivara Forge" credit clause must be non-negotiable to preserve the moat.

### 4.4 Platform / SaaS (months 30–48)

Productise the autopilot itself — multi-tenant SaaS where agencies (and eventually direct customers) buy seats.

- **Pre-requisites:** all of [`08-future-work.md`](./08-future-work.md) §§1–4 complete (PIPEDA / contracts / payments / vault), plus a GitHub App / SOC-2 readiness pass.
- **Capacity gating:** not a target before client #30 lands. Document as aspiration; do not build before the direct-service product is fully validated.

This phase is intentionally 3+ years out. Promoting it earlier risks distracting the operator from the validated direct-service product that is paying the bills.

---

## §5 Summary and recommended next steps

**Verdict (one paragraph).** Lumivara Forge Sites is viable in the Ontario small-business segment because (a) the addressable market is several orders of magnitude larger than one operator can service, (b) the existing competitor set leaves an empty quadrant — AI-maintained, phone-editable, subscription-priced — that the product fills, (c) unit economics clear day-job-replacement at 25–30 active clients per `03-cost-analysis.md`, and (d) the moat is operational rather than technological, which the existing IP-protection plan in `21-ip-protection-strategy.md` already protects. The single binding risk is acquisition reach; everything in §3 is instrumented to surface that risk early.

**One action per quarter for the next year:**

| Quarter | Single most important action | Outcome that proves it landed |
|---|---|---|
| **Q1 (months 0–3)** | Lock brand (done — `15 §4`), set up the Lumivara Forge GitHub org per `09b`, and onboard Client #1 properly through `06-operator-rebuild-prompt-v3.md` | One paying client live; autopilot running on cadence; evidence log in `19` populated |
| **Q2 (months 3–6)** | Pursue first two arms-length paid clients via warm referrals + LinkedIn; validate channel assumptions from §2.1 | Two arms-length clients signed; UTM data shows which channels actually converted |
| **Q3 (months 6–9)** | Run §3 validation questions against the first 3+ clients; choose first adjacent vertical from [§4.1](#41-adjacent-verticals-months-618) | All six §3 questions have an empirical answer; Q4 vertical is named with a target client count |

After Q3 the cadence becomes "monthly review" with quarterly refreshes of this doc. Anything that drifts more than 25% from the assumptions above earns a row in [`18 §7`](./18-capacity-and-unit-economics.md) (assumption change log) and a re-read of the Q3 / Q4 plan.

---

## §6 Client #1 mapping note

> _Client example — see 15 §7._
>
> The first paying client of Lumivara Forge Sites is the existing site already running in this repo (today: `palimkarakshay/lumivara-site`; post-P5.6 spinout: `palimkarakshay/lumivara-people-advisory-site`). Treat that client as the calibration data point for §3.1–§3.4 only — its retention, channel-source, and rescue count seed the empirical numbers but should not be generalised to arms-length clients until two more independent clients are onboarded. The §3 validation questions formally re-open at client #2.

---

*Last updated: 2026-04-29. Refresh quarterly from month 6 of paid operations; replace every `[SOURCE NEEDED]` with a live citation at the first refresh.*
