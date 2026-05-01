<!-- Mitigations counter to docs/decks/CRITICAL-REVIEW.md. Operator-scope. -->

# Critical-review mitigations — 2026-04-30

> _Lane: 🛠 Pipeline — operator-scope counter-plan to [`CRITICAL-REVIEW.md`](./CRITICAL-REVIEW.md). Read the review first; this file maps each problem to a concrete fix._

The review identified problems. This document maps each problem to a **single, dated, operator-runnable mitigation** — and where multiple bots disagreed on the right move, records all positions.

The single most important verdict: **the PoC does not need further perfection. The bottleneck is sales, not engineering.** Section §1 below answers the operator's direct question; §2 maps each review-section to a fix; §3 is the resequenced project plan; §4 is the new top-of-backlog activity (Sales Sprint S0).

---

## §1 — Does the PoC need to be "perfected" first?

**Mostly no — with one important exception.** See [§8 below](#8--demo-readiness-gate-the-hard-prerequisite-to-sales-sprint-s0) for the nuance the operator surfaced 2026-05-01.

The PoC is good enough on the operator-side platform polish dimension (the §1.1 streak gate in `01-poc-perfection-plan.md`). The platform built so far — n8n, multi-vendor LLM fallback, Dual-Lane Repo split, plan-then-execute, axe-core CI gate, Lighthouse CI gate, the four-tier cron cadence, `llm-monitor` self-awareness — is **above** the level a paying solo dentist or boutique-firm owner would notice or pay extra for. The §1.1 streak gate ("10 consecutive auto-routine issues land green with zero operator intervention") is an **internal quality bar**, not a customer-impact bar. A prospect does not buy "10 consecutive green issues." A prospect buys *"my site got faster, my recall flow is working, and I texted you a change yesterday and it shipped this morning."* The operator has those properties on `lumivara-forge.com` already.

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

## §5 — Resequenced project plan

The existing phase map at [`docs/migrations/00-automation-readiness-plan.md §1`](../migrations/00-automation-readiness-plan.md) is **infrastructure-first, sales-last**: Phase 0 (identity) → Phase 1 (PoC perfection) → Phase 2 (mechanical rename) → Phase 3 (platform repo) → Phase 4 (Client #1 spinout) → Phase 5 (Client #2 onboarding *from a clean slate*). Under that map, the first paying client is gated on three levels of platform work that each take days–weeks. This is the documentation hobby's project plan.

The resequenced map below pulls the first paying client to the **front**, demotes the §1.1 streak from a hard gate to background telemetry, and freezes the platform-spinout work behind revenue.

### §5.1 — The new phase map

| Phase | Name | Status | Trigger to start | Trigger to finish |
|---|---|---|---|---|
| **0A** | Brand+domain unblock (minimum viable identity) | **Active — this week** | Today | `lumivara-forge.com` + `.ca` registered, working name committed for 90 days, GitHub org created, `outreach@…` email sends and receives |
| **1B** | **Sales Sprint S0 — close paying client #2** | **Active — runs alongside everything below** | Phase 0A finishes | One paid CAD invoice from a non-operator client |
| 1A | PoC streak (was Phase 1) | **Parallel-OK — demoted from gate to telemetry** | Already running | 10/10 streak completes whenever it completes; no calendar pressure |
| 0B | Phase 0 §2.2 rows 3–12 (second Owner, Resend, Twilio, Railway, recovery envelope) | **Frozen until first prospect reply that books a discovery call** | First booked discovery call | Operator can run a clean Vercel deploy + send a Resend email under the brand |
| 2 | Run S1 mechanical rename | **Blocked-on-revenue** | Client #2 invoice paid AND brand name still feels right | Audit-grep clean per existing §4.4 |
| 3 | Bootstrap platform repo (P5.1–P5.5) | **Blocked-on-revenue** | Phase 2 done | `forge --help` runs; `forge provision --dry-run` prints the plan |
| 4 | Spin Client #1 out | **Blocked-on-revenue** | Phase 3 done AND client #2 has run for 30 days without operator infrastructure failures | Existing §6.4 exit criterion |
| 5 | Onboard Client #2 cleanly via `forge provision` | **Parallel-OK with Phase 4 if client #2 was provisioned manually first** | Phase 4 done | SMS-to-published cycle under 4h on smoke client |
| 6 | Hardening + handover | **Parallel-OK** | Phase 5 done OR client #3 closes, whichever first | Recurring; never "completes" |
| 6.5 | Capacity-policy review | **Deferred — see §5.5** | Client #5 invoice paid | Capacity-language committed to docs |

**Frozen ≠ deleted.** The work in `00-automation-readiness-plan.md` and `01-poc-perfection-plan.md` is still the technical north star. It just stops being a dependency for the next dollar.

### §5.2 — Phase 1B (Sales Sprint S0) in detail

- **Entry criterion:** Phase 0A done — domain live, working email under the brand, `prospects.csv` populated to 50 named rows.
- **Cadence:** Mon–Fri, 10 cold outreach actions before noon (mix of cold email, personalised Loom DM, vendor-coffee asks per §3 above). 30 minutes of LinkedIn / association-directory mining to keep the pipeline at 50+. End-of-day: log replies. Friday EOD: reply-rate review.
- **Forbidden during the sprint:** writing new decks, refactoring existing decks, opening Phase 0 §2.2 rows 3–12, touching the platform repo, renaming the brand, editing the negative list.
- **Exit criterion:** **one paid invoice in CAD** from a non-operator client, deposit cleared.
- **Hard time-box: 90 days** from the day the first cold email goes out. If no paid invoice by day 90, the working hypothesis fails. The response is **not** *"more sprint"* or *"more deck."* The response is to step back and challenge one of: target persona, price, channel, or whether this is a business at all. Do not extend the sprint without changing one of those four variables.

### §5.3 — The §1.1 streak gate, narrowed

The streak (*"10 consecutive auto-routine issues land green with zero operator intervention"*) gates **one thing only: Phase 2 (Run S1 mechanical rename).** It is a perfectly reasonable internal confidence signal for *"the autopilot is stable enough that I can do a 150-reference find-replace across the docs and trust the bot to land it cleanly."* That is what the gate was designed for, narrowly, and that is what it should still do. Everything else the gate currently blocks — Phases 3, 4, 5, 6, and (implicitly) sales itself — is unhitched.

### §5.4 — Phase 0 brand+domain decision

**Recommendation: ship under the working name `Lumivara Forge` with the registered domain. Defer any rename for 90 days.** The brand-rename ADR (`15c §3`) is the documentation hobby in microcosm — re-opening a name decision that was locked 48 hours earlier, while having zero clients. The reviewer's catch on `Lighthouse` (the CI-tool name collision in the shortlist) is the tell: the operator is not actually ready to lock a name under sales pressure, because there is no sales pressure.

A prospect who would have signed at `loom.com` and balks at `lumivara-forge.com` does not exist. Picking a new name now means: redo PR #200 drift sweep, redo trademark filing, redo `15 §4`/§5 lock, redo this ADR — three more weeks of writing, zero more sales calls. **Defer.** If the brand still feels wrong at day 90, decide then with real customer data instead of taste.

### §5.5 — The 30-client cap

**Replace with capacity-language; defer the cap policy until client #5 closes.** The cap is currently doing two jobs — (a) protecting operator burnout, which is real, and (b) signalling discipline to readers, which is performative when there are no clients. Until five paid clients exist, the cap has no empirical grounding and should not appear in any external artefact.

Internally, replace every *"30-client cap"* reference with: *"Single-operator working capacity is approximately 30 active retainer clients; this is a forecast, not a limit, and will be re-validated after client #5."* This kills the *"velvet rope on an empty restaurant"* optics, preserves the burnout safeguard for honest internal planning, and defers the actual policy decision to the moment when the operator has data. After client #5, the operator will know whether 30 is too high (churn faster than expected), too low (each client takes less time than budgeted), or about right. **Decide then.**

### §5.6 — The five things this week (Mon–Fri)

1. **Mon — Domain + working email under the brand.** Buy `lumivara-forge.com` and `lumivara-forge.ca` (Cloudflare or Namecheap), point an A record at a 1-page Vercel placeholder, set up `outreach@lumivara-forge.com` via Resend or Google Workspace.
2. **Tue — Build `prospects.csv`.** 50 named rows, **dentists** (the strongest existing vertical asset; the May–August recall-flush season fits the 90-day window).
3. **Wed — Fix the one load-bearing factual error and ship the case study.** Per §4.2 above, replace the dental `[S]` figure with a defensible CDA/ADA-HPI range; add a one-page Client #1 before/after Lighthouse case study to `lumivara-forge.com`.
4. **Thu — First 10 cold emails sent.** Use the dentist vertical pitch as the attachment, NOT the master deck. Track replies in `prospects.csv`.
5. **Fri — Second 10 cold emails sent + week-1 retro.** 20 emails out by EOW. Friday-night journal entry: reply count, objection patterns, vertical-swap decision. Forbidden phrase: *"I should write another deck."*

The 90-day clock starts the moment Thursday's first email lands in someone's inbox.

---

## §6 — File-by-file fix list

The mitigations above translate to specific edits. This list is the operator's checklist for the unfreeze pass after client #2 closes.

| File | Change | Mitigation refs |
|---|---|---|
| `docs/decks/01-investor-deck.md` | Freeze banner; on unfreeze: delete TAM slide, "What we are not" slide, $120k SEO, 95% margin headline, all "22.4×/22.3%" references, "Show us another retainer-services business…" sentence; rename to *Investor-evaluation framework — operator-internal*. | M5, M11, M14, M17, M18, M19, M10, M8 |
| `docs/decks/02-partner-deck.md` | Freeze banner; on unfreeze: delete $120k SEO, 95% margin, solopreneur-margin comparison; replace cap language with capacity language. | M5, M2, M8, M10, §4.3 |
| `docs/decks/03-employee-deck.md` | Freeze banner; revisit at client #25–#35. | M5 |
| `docs/decks/04-prospective-client-deck.md` | **Active edit allowed during sprint.** Collapse negative list to 3 bullets. Remove DesignJoy comparator. Replace "$120k–$150k SEO" persona figure with §4.1 honest range. Replace `[S]` dental range with §4.2 honest range or remove the chart. Lead the deck with the four-checks-during-the-call slide; demote the why-now stats. | M3, M13, M8, M9 |
| `docs/decks/05-advisor-deck.md` | Freeze banner; delete "What's settled" slide; rename to *Advisor open-questions briefing.* | M4, M5 |
| `docs/decks/06-master-deck.md` + `06a-master-deck-shareable.md` | Freeze banner. | M5 |
| `docs/decks/vertical-pitches/lawyers.md` | Replace $120k–$150k figure with §4.1 honest range; or drop the lawyer pitch from S0 outreach this week and use dentists only. | M8, §4.1 |
| `docs/decks/vertical-pitches/dentists.md` | **Active edit during sprint.** Replace $11k–$30k figure with §4.2 honest range or remove the dollar comparison. Lead with axe-violation evidence on the prospect's own site. | M9, §4.2 |
| `docs/research/03-source-bibliography.md` | Add `[E]` flag definition + retag rows: `§B-Law-Firm-Spend`, `§B-Dental-Spend`, `§B-Solopreneur-Margin` either re-sourced to `[E]` or removed from the externally-shareable rows list. Add US-jurisdiction footnote to `§B-ADA-Lawsuits` and `§B-Outdated-75`. | M7, §4.4, §4.5 |
| `docs/decks/00-INDEX.md` | Pre-publication gate updates: require `[E]` for any number used as forecast input or load-bearing comparator. | §4.4 |
| `docs/migrations/00-automation-readiness-plan.md` | Insert resequencing banner pointing here; add Phase 1B (Sales Sprint S0) as parallel to Phase 1A; mark Phases 2–6 *Blocked-on-revenue.* | §5.1 |
| `docs/migrations/01-poc-perfection-plan.md` | Banner: *"§1.1 streak gates Phase 2 only; demoted from blanket gate as of 2026-05-01."* | §5.3 |
| `docs/mothership/15c-brand-and-domain-decision.md` | Resolution stanza: *"Defer brand rename for 90 days; ship under `Lumivara Forge`; revisit after client #2 closes if at all."* Remove `Lighthouse` and `Helm` from the shortlist. | §5.4, M6 |
| `docs/mothership/18-capacity-and-unit-economics.md` | Replace "30-client cap" language with capacity language; defer policy decision until client #5. | §5.5, M2 |
| `docs/mothership/01-business-plan.md` | Replace "30-client cap" with capacity language. | §5.5, M2 |
| `docs/BACKLOG.md` | Add Sales Sprint S0 as the new top recurring item; mark POC perfection paused; add 90-day clock. | §5.2 |

---

## §8 — Demo-readiness gate (the hard prerequisite to Sales Sprint S0)

> _Added 2026-05-01 in response to operator pushback: **"I don't know if I can produce this end product with existing technical knowledge and AI assistance. What happens when the first paying customer asks for a demo? What if I cannot automate the 'simple' phone/admin edits to the client's website?"** The pushback is correct. The previous §1 verdict ("PoC is good enough") was right about **operator-side platform polish** (the §1.1 streak gate) but ambiguous about **demo-readiness** (the §6 gate in `01-poc-perfection-plan.md`). This section closes the gap._

### §8.1 — The two PoC-readiness questions, separated

| Question | Gate | Verdict | Why |
|---|---|---|---|
| (A) *"Do 10 consecutive auto-routine issues land green with zero operator intervention?"* | `01-poc-perfection-plan.md §1.1` (streak) | **Not load-bearing for sales.** Background telemetry. | Internal quality bar. Prospects don't see it. A prospect does not buy "10 consecutive green issues." |
| (B) *"Can the operator sit a prospect down today and run the phone-edit loop end-to-end without lying about anything?"* | `01-poc-perfection-plan.md §6` (demo-ready) | **Hard prerequisite to Sales Sprint S0.** | This is the customer-impact gate. If the demo fails, every cold email written is a check the platform can't cash. |

The previous §1 verdict ("the PoC is good enough") referred to (A). It does not extend to (B). (B) is non-negotiable and time-boxed.

### §8.2 — The 1-week demo-readiness checklist

Six concrete things the operator must complete **before Thursday's first cold email goes out** in §3 / §5.6:

| # | Test | Pass criterion | Failure response |
|---|---|---|---|
| 8.2.1 | **Run the loop on a borrowed phone, 5 times in a row.** Borrow a friend's iPhone or Android. Install the phone-edit shortcut from scratch (no operator-only configuration). Send a real edit. Get a real preview link. Tap publish. Repeat 5×. | All 5 succeed end-to-end in <4 minutes wall-clock per loop. | Identify the breaking step; fix or document it. Revisit 24 hours later. |
| 8.2.2 | **Record the loop as a 90-second screen capture.** Becomes the proof asset that goes in every cold email AND the demo-fallback recording. | Single file, <2 min, MP4 or Loom share-link, hosted on `lumivara-forge.com` or Loom. | Re-record after each fix from 8.2.1. |
| 8.2.3 | **Pre-rehearse the four breakage scenarios.** Vercel preview takes >30s; AI returns nonsense; HMAC fails; SMS doesn't arrive. Each gets a one-line operator response in writing. | One-page `docs/ops/demo-recovery-playbook.md` exists with four scripted lines. | Operator drafts the page; the act of writing it surfaces gaps. |
| 8.2.4 | **Honestly enumerate what cannot yet be done live.** Multi-page content restructures, booking-system integrations, multi-language. | One-page `docs/ops/demo-cant-yet-do.md` exists. The discovery call says: *"working today: X, Y, Z. Tier 3 add-on, available in 60 days: A, B, C."* | Operator drafts; this is honesty discipline, not a fixable bug. |
| 8.2.5 | **Verify accessibility CI catches a real WCAG failure live.** Push a div with an `<img>` missing `alt`. Watch axe-core fail the build. Recover. | One commit + one failing build URL + one recovery commit, captured in the case-study log. | If axe-core doesn't catch this, the gate is broken — fix the gate before any deck claims it. |
| 8.2.6 | **One before/after Lighthouse case study live on `lumivara-forge.com`.** Number, date, audit log link. | Case-study page accessible at a stable URL; audit log linked. | This is the single most-asked artefact in discovery calls. Without it, every prospect call ends in *"send me an example."* |

**Time-box: 7 calendar days from the start of Phase 0A.** If 8.2.1 fails after 7 days, the question is no longer *"how do I make this work?"* — it is *"do I run delivery on the manual-with-disclosure path in §9?"* Either answer is fine. Both unblock the sprint. The only forbidden answer is *"keep building, defer the sprint."*

### §8.2.7 — Four named integration gaps surfaced 2026-05-01

> _Operator surfaced four specific demo-blockers that the abstract 8.2.1–8.2.6 checklist did not name. Each one independently collapses the demo. Each must pass before Sales Sprint S0 starts, OR the §9.1 stack must be committed in writing._

| # | Gap | What's missing | Why it kills the demo | Fix path |
|---|---|---|---|---|
| **G1** | **n8n orchestration hub not wired into the demo PoC.** *(Operator term: "Oracle/n8n integration" — clarify in `docs/N8N_SETUP.md` whether "Oracle" means Oracle Cloud free-tier hosting for n8n, an operator-side orchestrator metaphor, or something else.)* | The phone-edit shortcut → SMS / webhook → AI → GitHub PR pipeline depends on n8n routing every event. If n8n isn't running, isn't reachable, or doesn't have credentials configured for Twilio + GitHub + Claude/Gemini, the loop breaks at the first hop and the demo never reaches a preview link. | Without this, *no* phone-edit demo runs. The deck pack's central promised mechanic is dead-on-arrival. | (a) Confirm hosting target — Railway (current docs) or Oracle Cloud free-tier (cheaper, more setup); commit to one and stop drifting. (b) Wire the four credentials (Twilio inbound webhook, GitHub App PAT, Anthropic OAuth, Gemini API key) end-to-end on a single demo workflow. (c) Run 8.2.1 the same day n8n goes live; do not run it before. |
| **G2** | **Vercel preview link not embedded in the client's `/admin` page.** | The pipeline opens a Vercel preview URL automatically, but the client's `/admin` portal doesn't surface it inline — the client has to click out to GitHub, find the PR, find the preview link, click it. | The "tap-to-preview" promise is broken. Every step the client has to navigate manually is a step where the operator has to be on the call to coach them. The demo becomes operator-led GitHub-tour theatre instead of client-self-serve magic. | Add a single React component to `/admin/changes/[id]` (or wherever the change-list lives) that embeds the Vercel preview URL as: (i) a clickable button labelled *"Preview"* (opens in new tab), and (ii) ideally an `<iframe>` showing the preview inline at small-viewport size. The deploy hook payload from Vercel already contains the `preview_url`; surface it in the admin Server Action. |
| **G3** | **"Tap to publish" doesn't actually trigger production deployment.** | Even if the preview lands and the client taps a "publish" button, the button doesn't currently run `gh pr merge` → Vercel production deploy. The publish flow stops at the preview gate. | This is the single biggest deck-vs-reality gap. The deck pack's pitch line is *"you tap publish, it goes live."* Today, *"you tap publish, the operator manually merges the PR."* That's a different product. | Implement the publish-button Server Action: (i) verify HMAC + Auth.js session, (ii) call Octokit `pulls.merge` against the open auto-routine PR, (iii) record the merge in the audit log, (iv) wait for Vercel deploy webhook (`deployment.succeeded`) and re-render the admin page with the production URL. The infrastructure for steps (ii)–(iv) is already in `docs/deploy/production-integrity.md` — the gap is the button itself. |
| **G4** | **Dual-Lane Repo separation is theoretical, not implemented.** Client repo currently mixes site code (client-owned) with pipeline code (operator-owned). | When you hand the client their repo at end-of-engagement, it ships with operator IP — `.github/workflows/`, `scripts/triage-prompt.md`, `n8n/` exports, `docs/mothership/` references, etc. Either (a) the client gets operator IP they shouldn't have, or (b) the operator's "you own the code" pitch is a lie because the operator scrubs the repo at handover and the client doesn't actually own what was running. | Both outcomes are deal-breakers. The "client owns the code" promise is the moat against Squarespace. If it's not true, the moat doesn't exist. | This is **Phase 3 (Bootstrap platform repo) + Phase 4 (Spin Client #1 out)** in `00-automation-readiness-plan.md`. They are currently `Blocked-on-revenue` per §5.1. **Reconsider:** if the spinout has not happened, the demo cannot honestly include the *"you own the code"* story. Two paths: (i) **defer the ownership claim** in the prospect-facing deck until after Phase 4 completes — pitch a 2026-Q3 ownership transfer instead of day-1 ownership; (ii) **bring Phase 4 forward** and execute it before Sales Sprint S0 starts, accepting an extra 2–3 week delay to the sprint kickoff. |

**Read this honestly:** G1 + G2 + G3 each block the demo independently. G4 blocks the *truthfulness* of the demo even if G1–G3 work. Three of the four are 1–3 day fixes given the existing infrastructure; the fourth (G4) is a 1–3 week project. The operator's question — *"what if I cannot automate the simple phone/admin edits?"* — is exactly G1 + G2 + G3, and the honest answer is **the platform is not yet at a state where any of those three are demo-able end-to-end.**

This does **not** invalidate the rest of this document. It changes the **time-box on Phase 1A\*** from "1 week" to "**2–4 weeks**, hard-capped at 4." If the four gaps cannot close in 4 weeks, the §9.1 stack (manual-with-disclosure + hire-as-you-sell + fallback dev) becomes the active delivery model and the deck pack adopts the §9.1 honest pitch language *before* any cold email goes out.



### §8.3 — How this changes the resequenced phase map

| Phase | Before | After |
|---|---|---|
| 0A | Brand+domain unblock | Same |
| **1A\*** | (did not exist) | **Demo-readiness gate (§8 — 1-week time-box) — the hard prerequisite to 1B** |
| 1B | Sales Sprint S0 | Same — but cannot start until 1A* passes OR §9 fallback is committed |
| 1A | PoC streak (telemetry) | Same |
| 2–6 | Blocked-on-revenue | Same |

A failure on 1A* does not block sales — it routes sales through §9 (delivery-risk options). Sales never blocks indefinitely on platform work; it routes through whichever delivery model the demo-test honestly supports.

---

## §9 — Delivery-risk options (if you cannot reliably deliver what the decks claim)

> _The honest answer to the operator's pushback: the deck pack pretends the platform handles 100% of delivery. It probably handles 60–80%, and the gap is closed by the operator + a contractor who is paid out of the client's deposit. **That is still a real, profitable business** — it just isn't the fully-automated business the decks describe._

Six options, ranked by how much of the existing offer they preserve. The honest read at the bottom: **options 1 + 4 + 6 stack** and let the operator take a paying client this quarter regardless of where the demo-readiness gate lands.

| # | Option | What changes | What stays | Best when… |
|---|---|---|---|---|
| 1 | **Manual-with-disclosure** | *"For the first 90 days the operator personally reviews every PR before publish."* AI proposes, operator approves and ships. Loop wall-clock: 1–4 hours, not 90 seconds, on the operator-merge step. The phone-submit step still works as advertised. | T2 price, monthly improvement run, accessibility CI, ownership story, regulator framing. | 8.2.1 passes intermittently; the AI plan is solid but the auto-merge gate is shaky. |
| 2 | **Sell only what reliably works.** | Scope the offer to "small content edits + accessibility fixes" — both of which the platform absolutely handles today. Drop multi-page restructures and complex integrations from the T2 default; quote them as add-ons. | Phone-edit loop, ownership, regulator framing, monthly cadence. | The AI is unreliable on complex changes but bullet-proof on simple ones. |
| 3 | **Audit-first engagement.** | First $500–$1,000 is a paid Lighthouse + axe + advertising-policy audit, delivered as a 30-min Loom + 10-page PDF. Zero AI delivery risk; pure operator skill. Some prospects convert to T1/T2 after. | Lead-gen, rapport, vertical positioning, regulator framing. | The platform isn't ready and the operator wants revenue + signal in 30 days. |
| 4 | **Hire-as-you-sell.** | First paying client's $4,500 deposit funds 50–80 hours of an Ontario freelance Next.js dev as the AI safety net. Disclosed in the contract: *"Lumivara Forge engages a junior contractor on engagements where the autopilot is in build-up phase."* | All deliverables; the cap question reframes from "burnout" to "subcontract budget." Net margin compresses by 30–50% on the first 2–3 clients; recovers by client #5 as the platform stabilises. | The platform handles 60–80% but the operator can't personally close the rest. |
| 5 | **Niche further.** | Don't sell "managed website" — sell *"weekly content shipping for solo professionals on their existing site."* The phone-edit loop is the only deliverable. T1 only; no rebuilds. | Phone-edit loop, monthly cadence, ownership story (writes to the client's existing repo / CMS). | The full "managed website + autopilot" offer is too ambitious for the current platform; a smaller anchor offer closes faster. |
| 6 | **Pre-arrange a freelance fallback dev.** | Identify one Ontario freelance Next.js dev willing to work hourly on 24-hour notice when the AI fails. Costs $0 until invoked. Build a relationship before you need it; not after. | Everything in the existing offer. | Always. This is cheap insurance regardless of which other options stack. |

### §9.1 — The recommended stack

**Options 1 + 4 + 6 stack.** Manual-with-disclosure (1) is the honest pricing posture. Hire-as-you-sell (4) makes the first 2–3 clients deliverable even if the AI is at 60%. Pre-arranged fallback dev (6) is free insurance.

The combined offer reads, on the prospective-client deck, like this:
> *"For the first 90 days, every change is reviewed by a human before publish — usually the operator, sometimes a contracted senior engineer when the queue is full. After 90 days, well-tested change types ship through automation; complex changes stay human-reviewed. You see exactly which lane each change took, in your monthly report."*

This is **more honest than the current decks** and **more closeable than the current decks**. The current pitch promises end-to-end automation that the platform may not yet support; the §9.1 pitch promises end-to-end *speed* that the operator + contractor + AI absolutely can support.

### §9.2 — What this does to the unit economics

The current model (`docs/storefront/03-cost-analysis.md` Part D) assumes ~95% pre-comp gross margin, contingent on the operator absorbing all delivery hours alone. Under the §9.1 stack:

- First 2–3 clients: contractor at $50–$80/hr × ~30 hrs/client/month = $1,500–$2,400/mo per client. Net margin on T2 ($249/mo) **goes negative** for the first 2–3 clients — the deposit subsidises the contractor for the first 6–12 months of each engagement.
- Clients #4 onward: as the platform stabilises and the operator's documentation of common edit-types accumulates, contractor hours fall to ~10/client/month, then ~3/client/month. Margin recovers to ~70% pre-comp by client #5, ~85% by client #10.
- The 30-client "cap" becomes irrelevant earlier — the operator can credibly take more clients with contractor support, but probably shouldn't, because the contractor is the bottleneck not the operator.

This is a different business than the decks describe. **It is a business.** The decks-as-written promise a margin profile that depends on the platform working at 95%; §9.1 admits the platform works at 60–80% and prices accordingly. Both are honest at different platform-maturity levels. The operator's job over the next 90 days is to figure out which one is true.

### §9.3 — What goes in front of a prospect on Day 1

Three artefacts, no platform claims that aren't verifiable:

1. **The 90-second loop recording** (from 8.2.2).
2. **The Client #1 before/after Lighthouse case study** (from 8.2.6).
3. **The §9.1 honest pitch language** (manual-with-disclosure, contractor-funded for first 90 days).

That is enough to close a discovery call honestly. Everything else in the deck pack is supporting material that can be added when ready.

---

## §7 — Tracking

A single GitHub issue should track Sales Sprint S0 at the operator level. Suggested title: *Sales Sprint S0 — first paying client #2 (90-day time-box, started YYYY-MM-DD)*. Labels: `meta/sales-sprint`, `priority/P1`, `human-only`. Body uses the §5.6 day-by-day plan as a checklist; updates happen in comments daily.

When client #2 invoices and the deposit clears, that issue closes. The act of closing it is the trigger to unfreeze the deck pack and resume the platform-spinout work in the §5.1 order.

---

*Last updated: 2026-05-01. Operator-scope. Read [`CRITICAL-REVIEW.md`](./CRITICAL-REVIEW.md) first; this file is the counter-plan.*
