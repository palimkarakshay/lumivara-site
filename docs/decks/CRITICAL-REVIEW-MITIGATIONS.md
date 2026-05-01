<!-- Mitigations counter to docs/decks/CRITICAL-REVIEW.md. Operator-scope. -->

# Critical-review mitigations — 2026-04-30

> _Lane: 🛠 Pipeline — operator-scope counter-plan to [`CRITICAL-REVIEW.md`](./CRITICAL-REVIEW.md). Read the review first; this file maps each problem to a concrete fix._

The review identified problems. This document maps each problem to a **single, dated, operator-runnable mitigation** — and where multiple bots disagreed on the right move, records all positions.

The single most important verdict: **the PoC does not need further perfection. The bottleneck is sales, not engineering.** Section §1 below answers the operator's direct question; §2 maps each review-section to a fix; §3 is the resequenced project plan; §4 is the new top-of-backlog activity (Sales Sprint S0).

---

## §1 — Does the PoC need to be "perfected" first?

**No.**

The PoC is good enough. The platform built so far — n8n, multi-vendor LLM fallback, Dual-Lane Repo split, plan-then-execute, axe-core CI gate, Lighthouse CI gate, the four-tier cron cadence, `llm-monitor` self-awareness — is **above** the level a paying solo dentist or boutique-firm owner would notice or pay extra for. The §1.1 streak gate ("10 consecutive auto-routine issues land green with zero operator intervention") is an **internal quality bar**, not a customer-impact bar. A prospect does not buy "10 consecutive green issues." A prospect buys *"my site got faster, my recall flow is working, and I texted you a change yesterday and it shipped this morning."* The operator has those properties on `lumivara-forge.com` already.

The operator's own one-line decision rule from [`docs/mothership/01-business-plan.md §9`](../mothership/01-business-plan.md) — *"If a feature, doc, or tool helps the operator serve **paid retainer clients** better — build it. If it helps the operator serve **prospects, hypothetical SaaS users, or other agencies** better — defer it"* — applied honestly, freezes most of [`docs/migrations/00-automation-readiness-plan.md`](../migrations/00-automation-readiness-plan.md) Phases 1–6 until **at least one paid retainer client exists**. There are zero paid retainer clients today. By the operator's own rule, the PoC perfection plan, the platform-repo bootstrap, the Dual-Lane Repo spinout, and the Phase-5 "first fully bot-driven onboarding" are all **deferred** until that single condition flips.

This does not mean delete the work. It means **freeze the work and pivot operator hours to sales**. The platform sits where it is, on this repo, running today. It will still be there when client #2 closes. What will not still be there is the operator's runway if the next 90 days produce zero revenue while the platform-perfection backlog grows.

The only PoC-side work that should continue in parallel with sales is **bug fixes the operator notices while demoing**. If a prospect call exposes a broken contact form, fix that. If the demo crashes on a Pixel 7, fix that. Everything else waits.

---

## §2 — Mitigation table (one row per problem identified in CRITICAL-REVIEW.md)

| # | Problem (from review) | Severity | Mitigation (single, dated) | Owner | Done when |
|---|---|---|---|---|---|
| M1 | Pre-revenue, post-PMF posture (`§1.1`) | Critical | Run **Sales Sprint S0** (§4 below) — 50 prospects, one vertical, 7 days. | Operator | Reply rate measured + at least 1 booked discovery call OR sprint declared failed and re-run with different vertical. |
| M2 | 30-client cap is cope (`§1.2`) | High | Replace "30-client cap" language with "single-operator working capacity ≈ 30 clients" everywhere it appears. The cap is a capacity description, not a strategic moat. Strip moat-claims from `01`, `02`, `06`, `06a`. | Operator | `git grep -i "30-client cap"` returns zero hits in `docs/decks/`. |
| M3 | Negative list as faux moat (`§1.3`) | High | Collapse negative-list slide in client-facing decks to **3 bullets max**. Keep the operator-only `00a-negative-list-rationale.md` as the long-form internal doc. Do **not** lead with refusals on the prospect deck — lead with the one thing that works (phone-edit demo). | Operator | Negative-list slide in `04-prospective-client-deck.md` is one slide, three bullets, no regulator citations. |
| M4 | Ring-fenced "settled" advisor scope (`§1.4`) | Medium | Delete the "What's settled" slide from `05-advisor-deck.md`. Every claim is contested when there are zero clients. | Operator | Slide gone; advisor deck is renamed *Advisor open-questions briefing* until client #5. |
| M5 | Five-deck creative-writing strategy (`§1.5`) | Critical | **Freeze** `01-investor-deck.md`, `02-partner-deck.md`, `03-employee-deck.md`, `05-advisor-deck.md`, `06-master-deck.md`, `06a-master-deck-shareable.md`. No edits, no refreshes, no rebuilds, until client #5 closes. Add a freeze banner to each. | Operator | Freeze banner present on six files; CI rule rejects non-banner edits on those paths. |
| M6 | Brand & domain unresolved (`§1.6`) | Medium | **48-hour decision rule.** By 2026-05-02, the operator picks one of: (a) keep `Lumivara Forge`, register `.com`/`.ca`, ship; (b) pick `Cadence` (the runner-up locked in `docs/mothership/01-business-plan §1`), register, ship; (c) defer all brand work for 90 days and operate as `Lumivara Forge` placeholder. `Lighthouse` and `Helm` are removed from the shortlist immediately (collision caveats). | Operator | `15c §3 "Resolved"` stanza is filled in; or a 90-day-defer note is recorded with end date. |
| M7 | Closed-loop self-citation (`§4.1`) | High | Add an `[E]` flag — *"externally-published primary source, segment-matched to deck ICP"* — to `docs/research/03-source-bibliography.md`. Any number used as a forecast input or load-bearing comparator must carry `[E]` (not just `[V]`). The pre-publication gate in `00-INDEX.md` updates to require `[E]` for the law-firm-spend, dental-spend, and solopreneur-margin rows. | Operator | Three rows above are `[E]`-tagged or removed from external decks. |
| M8 | Law-firm $120–$150k SEO stat is a category error (`§2.1`) | Critical | Replace with a segment-matched figure for Ontario solo + 2–10-lawyer boutiques. Use Clio's annual *Legal Trends Report* (free, segment-cut) as the primary source if the figure is published; fall back to "Ontario solo-practice marketing spend: $0–$5k/yr typical (segmentation caveat)" with explicit footnote. | Operator | Lawyer vertical pitch deck + investor deck + partner deck no longer cite the $120k figure for solo personas. |
| M9 | Dental "5–10% of revenue" stat is `[S]` used as `[V]` (`§2.2`) | High | Same treatment: source from CDA / ODA / ADA-HPI segmented data; if no segmented source surfaces, footnote a defensible Ontario-single-location range and stop quoting the $11k–$30k figure as if it were `[V]`. | Operator | Dental vertical pitch + prospective-client deck either cite an `[E]`-flagged figure or remove the cost-comparison table. |
| M10 | "95% pre-comp gross margin" is a tautology (`§2.3`) | Medium | Drop the "95% pre-comp gross margin" headline. Replace with **net-take-home-per-hour** as the unit-economics signal, computed only after client #5. Until then, no margin headline appears in any deck. | Operator | Margin headline removed from `01`, `02`, `06`, `06a`. |
| M11 | TAM slide is performative (`§2.4`) | Medium | Delete the TAM/SAM slide from `01-investor-deck.md` and `06-master-deck.md`. A 30-client services practice does not benefit from a $161B-market footnote. | Operator | TAM slide gone from both files. |
| M12 | Take-home is a budget, not a forecast (`§2.5`) | High | Reframe the year-1 take-home headline: *"If we close 30 retainer clients at the current price list, take-home would be ~CAD $118–$128k. We have closed zero. The forecast is conditional on the close-rate we are now measuring (Sales Sprint S0)."* Headline lands only after Sprint S0 returns reply-rate + close-rate evidence. | Operator | Conditional language present; or the headline is removed entirely. |
| M13 | DesignJoy comparator is rigged (`§2.6`) | Medium | Remove DesignJoy from the price-comparison table in `04-prospective-client-deck.md` and the vertical-pitch decks. Replace with a real local comparator the buyer has actually considered (e.g. *"WSI / Townsweb / DentalROI bundle: $4,800–$9,600 + per-edit invoicing"*). | Operator | DesignJoy gone from comparator tables. |
| M14 | "We don't quote 22.4× / 22.3%" is cited four times (`§2.7`) | Low | `git grep` for `"22.4"` and `"22.3"` across `docs/decks/` and `docs/research/`; delete every occurrence including the meta-references. | Operator | grep returns zero hits in `docs/decks/`. |
| M15 | Platform built before client #2 (`§3`) | Critical | **Hard freeze on platform work.** No new platform features land between today and client #2 closing. Pipeline-lane PRs that are platform-improvement-only get the `frozen-until-client-2` label and are not auto-merged. Bug fixes and security patches are exempt. | Operator | CI rule + label exists; PR titles audited weekly. |
| M16 | Closed-loop forecast citations (`§4.1`) | High | Same fix as M7 — `[E]` flag. Plus: every deck slide that quotes a number now must inline-cite an *external* URL or filing reference, not a `docs/...` path. | Operator | Sample audit on `01-investor-deck.md` shows external citations on every numeric claim. |
| M17 | "What we are not" defensive opener (`§4.2`) | Low | Delete the slide from `01-investor-deck.md`. (The deck itself is frozen by M5; this is on the unfreeze-checklist for client #5.) | Operator | Slide gone when deck unfreezes. |
| M18 | "We are not raising" investor-deck fig leaf (`§4.3`) | Medium | Either delete `01-investor-deck.md` or rename to *"How this practice would be evaluated by an investor — operator-internal."* Sequester to operator-only. | Operator | File moved to `docs/_deprecated/` or renamed + frozen per M5. |
| M19 | Unfalsifiable "Show us another retainer-services business…" pitch sentence (`§4.4`) | Medium | Replace in all decks with the conditional version: *"If we close 30 clients, we expect lower churn / higher NPS / inelastic pricing. Here is the experiment that would falsify it: …"* | Operator | The unfalsifiable sentence does not appear in any unfrozen deck. |
| M20 | *"Pitch line:"* tic (`§4.5`) | Low | Strip the *Pitch line:* slot from the master deck and stakeholder decks during the unfreeze refresh. Pitch lines that survive a real prospect call earn their place; pitch lines authored for slides do not. | Operator | `git grep -c "Pitch line"` drops below 10 across `docs/decks/`. |

---

## §3 — Sales-acquisition creative options (Sales Sprint S0)

The review's prescription was *"50-prospect spreadsheet, 10 cold emails per day, one vertical, one week."* That is the floor. A second-opinion bot was asked for **alternative or complementary** tactics that leverage what the operator already built. Seven candidates returned; the bot's own ranking was *keep tactics 1, 2, 3 — kill 4, 5, 7 — defer 6 as a passive multiplier on tactic 2.* Recorded here in the bot's order; the operator picks the slate.

### S0.T1 — Personalised "competitor audit" Loom

- Pick **dentists** first (recall-flush season May–August, owner-decision-makers reading email).
- Run the existing axe / Lighthouse CI against three named local Ontario dental sites; record a 4-minute Loom showing the top 3 regulator-relevant violations on the prospect's *own site.*
- Send the personal Loom link, not a pitch deck. *"Your site fails RCDSO advertising-readability standards on these 3 items, here is the 90-second fix."*
- Expected reply rate band: **15–25%** (vs. cold-email 1–3%). The proof is undeniable; the operator's face creates trust; the deliverable exists before any contract.
- Cost: $0 (Loom free tier). 6 hours week 1.
- Failure detection: by Friday, if 0 of 15 Looms produced a reply, the violation framing is wrong, not the channel — pivot to stricter RCDSO Standard-of-Practice clause-number framing.

### S0.T2 — "Free rebuild, pay day 30" — risk-reversal offer

- Offer 5 dental practices a complete T1 rebuild at zero upfront cost; they pay $2,400 + $99/mo only if they keep it past day 30. Operator owns the domain config until then; reversal is one DNS flip.
- One-page offer terms in a Google Doc — **do not write a new deck for this.** Use existing playbook.
- DM 20 owner-dentists on LinkedIn with the offer + one Loom from S0.T1.
- The operator's marginal cost per build is near-zero because the AI pipeline is already built — *this is the entire point of having spent the time on the platform.* One conversion at $2,400 + 12×$99 = $3,588 LTV; 1-in-5 close rate is profitable.
- Failure detection: if more than 3 say yes by Wednesday, **stop pitching** — operator can deliver 5 builds in 14 days, not more.
- Cost: ~$50. 25–35 hours over 30 days.

### S0.T3 — Adjacent-vendor referral pact (the "deliberately not us" list as credibility asset)

- Sign mutual-referral terms with 2 Ontario bookkeepers serving lawyers + 1 dental EMR migration consultant (Dentrix / AbelDent). They send web work; operator sends back EMR / bookkeeping leads from intake forms.
- Search LinkedIn for "Dentrix consultant Ontario" / "bookkeeper LSO trust accounting." Identify 6 humans, message 3 lines, three coffee calls by week-end.
- The negative list the operator already wrote *is* the credibility artefact: *"here's what I refuse to do, so I'll never compete with you."*
- One warm intro from a bookkeeper with 40 lawyer clients converts at 30–50% — vs. cold email's 1%.
- Cost: $80 in coffees. 6 hours.
- Failure detection: by Sunday, if no referral named, the relationship is theatre — set a 14-day "first intro or it's dead" deadline.

### S0.T4–T7 — Deferred / ranked lower

- **T4 — Post-tax-season accountant reactivation wave (May 5–15).** Real seasonal arbitrage; deferred only because splitting focus across a second vertical before the first one is proven is premature. Revisit if dentists fail at week 3.
- **T5 — Sponsored lunch-and-learn at ODA / OAO / county-law-association.** Booking lead time is 4–12 weeks; mismatched to the 30-day window. Revisit June.
- **T6 — Case-study-as-marketing on `lumivara-forge.com` from "Client Zero".** Passive multiplier on T2: prepare the case-study template page this week, populate the moment a T2 yes lands.
- **T7 — LinkedIn DM keyed to regulator-of-record clauses.** Strictly weaker than T1 (a Loom on the same channel), and competes for LinkedIn rate-limits. Skip.

### S0 — The 7-day plan (synthesised)

| Day | Action | Outcome target |
|---|---|---|
| Mon | Domain `lumivara-forge.com` registered → A record → 1-page Vercel landing → `outreach@…` mailbox via Resend or Workspace; pick **dentists**; run axe vs. 3 named Ontario practices; record 3 Looms; send 3 personal Loom DMs by EOD; draft 1-page "Free Rebuild, Pay Day 30" terms; list 6 adjacent vendors. | Domain live; 3 Looms sent; 6 vendor-coffee-asks drafted. |
| Tue | Send 6 vendor-coffee asks; record 3 more competitor Looms; send; prep case-study template page on `lumivara-forge.com`; finish populating `prospects.csv` to 50 rows. | 6 Looms sent; 50 named prospects in CSV. |
| Wed | Two coffee calls; 3 more Looms sent; first replies start landing → book demos same-day; **fix the one load-bearing factual error** in the dentist pitch (replace dental `[S]` figure with a defensible range from CDA / ADA HPI per §4 below); ship the Client #1 before/after Lighthouse case study. | 9 Looms sent; ≥1 demo on calendar; one factual fix shipped; case study live. |
| Thu | First 10 cold emails sent (dentist pitch attached, NOT the master deck); demo any booked calls live against the prospect's own site; send Free-Rebuild offer to anyone who reaches *"but I already have a site."* | 10 cold emails sent; ≥1 live demo. |
| Fri | Second 10 cold emails sent; tally — Looms sent (target 15), replies (target 3), demos (target 1), partnership intros secured (target 1). If reply rate <10%, rewrite the violation framing over the weekend. | 20 cold emails sent EOW; one Friday retro entry in the operator journal. |
| Sat | **Off**, or build the case-study template if it slipped. No deck-writing. | — |
| Sun | Refill list to 50 dentists; pre-stage next week's 15 Looms by site selection only (record Mon). | Next week's pipeline pre-staged. |

The Friday-night journal entry has one forbidden phrase: *"I should write another deck."* If it appears, the operator deletes it and writes nothing for 48 hours.

---

## §4 — Number-replacement plan (the load-bearing-and-broken numbers)

The review identified two load-bearing numbers that don't survive the operator's actual ICP. The independent reviewer surfaced a third (the solopreneur-margin band) with the same defect. This section replaces all three with defensibly-segmented sources and proposes a fourth bibliography flag.

### §4.1 — Law-firm web/SEO spend (replaces `§B-Law-Firm-Spend` for ICP context)

**ICP this deck targets:** Ontario solo practitioners and 2–10-lawyer boutiques (immigration, family, real estate, wills, small-business). **Not:** AmLaw / personal-injury / mass-tort firms with national keyword campaigns.

| Source | Cadence | Free? | What to extract | Status |
|---|---|---|---|---|
| **Clio — *Legal Trends Report*** (`clio.com/resources/legal-trends/`, year-stamped sub-paths) | Annual (Oct–Nov) | Free | Firm-size cross-tab on marketing-spend % of revenue + primary client-acquisition channels. Solo / 2–5 lawyer rows specifically. | Primary — most ICP-matched single source available |
| **LSO — *Annual Report* and *Lawyer Statistical Snapshot*** (`lso.ca/about-lso/annual-report`) | Annual | Free | Distribution of Ontario lawyers by firm size — anchors SAM denominator | Candidate — operator to verify which year's report includes spend questions |
| **Canadian Lawyer Magazine — *Legal Fees / Compensation Survey*** (`canadianlawyermag.com/surveys-reports/`) | Annual | Free summary | Gross revenue per lawyer in Canada × 2–5% marketing assumption → derived spend | Candidate — operator to verify which year segments marketing spend explicitly |

**Honest replacement range (compute this from the chain, footnote it):**
> *Solo / small-firm gross revenue per lawyer in Ontario typically sits in the $150k–$400k band; Clio segmented marketing % for solos is typically 2–6% of revenue. That yields **$3k–$24k/yr total marketing**, of which **web + SEO is typically 30–50%, so $1k–$12k/yr** for the deck's actual ICP. Sources: Clio Legal Trends Report [year], firm-size cross-tab; LSO Annual Report [year]; revenue band derived from Canadian Lawyer compensation survey [year]. Range reflects the segment matched to this deck's ICP. It is not comparable to industry-aggregate "law-firm SEO spend" figures — those aggregates are dominated by AmLaw and personal-injury firms with national keyword campaigns and overstate the line for the ICP this deck addresses.*

This means the "Lumivara's slot: < 5% of their existing web/SEO line" claim **reverses**. The honest pitch is: T2 ($7,488 over 24 months) is *comparable to or above* what a solo lawyer spends today on web + SEO, but it includes the build, the maintenance, the accessibility CI, and the autopilot — and replaces the per-edit-invoice tax. Sell on **scope replacement**, not budget reallocation.

### §4.2 — Dental marketing spend (replaces `§B-Dental-Spend`)

**ICP this deck targets:** Ontario single-location, owner-operated general dentists with 1–2 dentists, $750k–$1.2M gross. **Not:** DSO-affiliated, multi-location, or US specialty practices.

| Source | Cadence | Free? | What to extract | Status |
|---|---|---|---|---|
| **CDA — *Economic Realities of Practice* / practice-survey publications** (`cda-adc.ca`) | Periodic | Free summary | Practice-level expense ratios for general practitioners — marketing line as % of overhead | Candidate — operator to verify the most recent year and whether marketing is broken out as its own line |
| **ODA — practice-management surveys + *ODA Suggested Fee Guide* support** (`oda.ca`) | Annual fee guide | Free summary; member-gated for full data | Marketing benchmarks segmented by practice size; Ontario-specific signal | Candidate — operator to verify what is publicly available |
| **ADA Health Policy Institute — *Survey of Dental Practice* + HPI briefs** (`ada.org/resources/research/health-policy-institute`) | Multi-year SDP cycle; HPI briefs more frequent | Free | Solo-practice expense distribution; "professional advertising" line segmented by ownership type | Verified-likely; use as cross-check on CDA, not as primary citation in a Canadian deck |

**Honest replacement range:**
> *Independent solo dental practices in ADA HPI cuts typically show marketing/advertising at **1–4% of gross revenue** — substantially lower than the 5–10% aggregate. Applied to a $1M Ontario practice, that's **$10k–$40k/yr total marketing**, of which **web + SEO is conventionally one-third or less, so $3k–$13k/yr** for the actual ICP. Sources: ADA HPI Survey of Dental Practice [year], solo-owner cross-tab; CDA practice survey [year, where available]. Range matches single-location, owner-operated general practice; excludes DSO-affiliated and multi-location practices, where marketing intensity is structurally higher.*

If even this is not sourceable cleanly within a week, the right call is to **drop the dollar number entirely** and lead the dental pitch with the verifiable phenomena (ADA Title III filings, WebAIM accessibility error counts, the prospect's actual Lighthouse score) instead of a contested spend figure. The deck does not need a spend number to close; it needs a *pain* number the prospect can verify themselves.

### §4.3 — Solopreneur-margin band (the third broken number, hidden)

`§B-Solopreneur-Margin` — the *"AI-enabled solo operators commonly report 65–75% gross margins; agencies compress to 40–50%"* comparison — is `[S]` and has the same defect: the 65–75% figure comes from US AI-tooling-vendor blogs surveying their own customer base (selection bias toward already-AI-leveraged operators), and the 40–50% agency figure compares post-payroll margin against the operator's pre-comp number. **Apples-to-oranges.** Drop the comparison from `01-investor-deck.md` and `02-partner-deck.md` until a like-for-like source exists.

### §4.4 — Bibliography flag-system change

**Add a fourth flag, `[E]`** — *"externally-published primary source whose sample is segment-matched to the deck's ICP."* The current `[V]` conflates *"the URL resolves and the figure is correctly transcribed"* with *"the figure describes the population this deck targets,"* and the First Page Sage row is the proof: it is correctly `[V]` for transcription and category-wrong for ICP simultaneously. Promoting segmentation to its own flag forces every author to answer the question explicitly before a row clears the pre-publication gate.

The pre-publication gate in [`docs/decks/00-INDEX.md`](./00-INDEX.md) updates to require `[E]` (not just `[V]`) for any number used as a forecast input or load-bearing comparator. The `[V]` flag remains valid for macro phenomena that don't claim ICP fit (e.g. the 75% / 3,117 / 95.9% headline stats — see §4.5).

### §4.5 — Numbers that are fine (do not over-correct)

- **75% of consumers abandon outdated sites (HostingAdvice 2024).** Macro-phenomenon, not ICP-specific spend. Keep with one footnote noting this is US consumer behaviour.
- **3,117 ADA Title III filings in 2025 (+27% YoY) (Seyfarth Shaw).** Macro-phenomenon, US-jurisdiction. Keep, but add a one-line footnote that this is US ADA Title III, not Canadian AODA, and that AODA is the regulatory floor an Ontario prospect actually faces.
- **95.9% of WebAIM Million pages fail WCAG (WebAIM 2024).** Macro-phenomenon. Keep.

The fix is targeted at ICP-specific spend numbers, not macro tailwind numbers.

---
