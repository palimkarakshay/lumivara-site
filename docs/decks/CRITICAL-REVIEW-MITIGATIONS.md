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

> _Updated 2026-05-01 to insert Phase 1A\* (demo-readiness) between 0A and 1B, per [§8 demo-readiness gate](#8--demo-readiness-gate-the-hard-prerequisite-to-sales-sprint-s0) and the four named integration gaps (G1–G4 in §8.2.7). Phase 4 also gains a 90-day post-revenue deadline per §10.4 (Path B)._

| Phase | Name | Status | Trigger to start | Trigger to finish |
|---|---|---|---|---|
| **0A** | Brand+domain unblock (minimum viable identity) | **Active — this week** | Today | `lumivara-forge.com` + `.ca` registered, working name committed for 90 days, GitHub org created, `outreach@…` email sends and receives |
| **1A\*** | **Demo-readiness gate (G1–G4 + checklist 8.2.1–8.2.6)** — hard prerequisite to 1B | **Active immediately after 0A — 2-4 week time-box** | Phase 0A finishes | All four named gaps closed (G1 n8n wired, G2 admin preview embed, G3 publish-button auto-deploy, G4 Path-B ownership-claim language committed) AND 5/5 borrowed-phone loops succeed AND all six §8.2 rows pass |
| **1B** | **Sales Sprint S0 — close paying client #2** | **Active when 1A\* passes OR §9.1 stack is committed in writing** | 1A\* passes OR §9.1 honest-pitch language adopted in `04-prospective-client-deck.md` | One paid CAD invoice from a non-operator client |
| 1A | PoC streak (was Phase 1) | **Parallel-OK — demoted from gate to telemetry** | Already running | 10/10 streak completes whenever it completes; no calendar pressure |
| 0B | Phase 0 §2.2 rows 3–12 (second Owner, Resend, Twilio, Railway, recovery envelope) | **Frozen until first prospect reply that books a discovery call** | First booked discovery call | Operator can run a clean Vercel deploy + send a Resend email under the brand |
| 2 | Run S1 mechanical rename | **Blocked-on-revenue** | Client #2 invoice paid AND brand name still feels right | Audit-grep clean per existing §4.4 |
| 3 | Bootstrap platform repo (P5.1–P5.5) | **Blocked-on-revenue** | Phase 2 done | `forge --help` runs; `forge provision --dry-run` prints the plan |
| 4 | Spin Client #1 out | **Blocked-on-revenue, deadlined post-revenue** — must complete by client #2's day 90 under Path B (§10.4) | Phase 3 done AND client #2 has run for 30 days without operator infrastructure failures | Existing §6.4 exit criterion; client takes ownership of vanilla site repo on day 90 |
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

## §11 — Additional gaps (G5–G24) surfaced 2026-05-01

> _Inspection of `src/lib/admin/`, `src/app/admin/`, `docs/n8n-workflows/`, `package.json`, and `docs/mothership/08-future-work.md` revealed both more-built-than-claimed code and additional gaps the operator hasn't yet named._
>
> **Important nuance on G1–G4 from this inspection.** The HMAC handshake (`src/lib/admin/webhooks.ts` — full sign/verify with timing-safe-equal, 5-min replay window), the `confirmDeploy` Server Action with `assertSafePromotion` + idempotency keys, the `findPreviewByCommit` Vercel lookup, and all six n8n workflow JSON exports (`docs/n8n-workflows/admin-portal/{intake-web,intake-email,intake-sms,client-input-notify,client-input-record,deploy-confirmed}.json`) **are implemented in code**. The gap is not "code missing" — it is **configuration + runtime + import**: the n8n instance must be running, the JSON files must be imported into it, the credentials must be wired, and three Vercel env vars (`N8N_INTAKE_WEBHOOK_URL`, `N8N_DECISION_WEBHOOK_URL`, `N8N_DEPLOY_WEBHOOK_URL`) plus `N8N_HMAC_SECRET` must be set in production. Until those are set, every dispatch fails with the explicit error *"Intake/Decision/Deploy webhook is not wired up yet."* G1–G4 are real demo-blockers; the fix is hours of configuration, not weeks of coding.

### §11.1 — Gap inventory

| # | Gap | Class | Blocks | Effort | Owner |
|---|---|---|---|---|---|
| G5 | **Vercel env vars not set in production.** `N8N_INTAKE_WEBHOOK_URL`, `N8N_DECISION_WEBHOOK_URL`, `N8N_DEPLOY_WEBHOOK_URL`, `N8N_HMAC_SECRET` — without these, every dispatch in `src/lib/admin/webhooks.ts` fails with a clear error message. | Operator-blocking (config only) | Demo, all of G1–G3 | 30 min | Operator |
| G6 | **n8n instance not provisioned + credentialed.** All six workflow JSONs exist; need a running n8n (Railway $5/mo or Oracle Cloud free-tier), import the bundle, wire 5 credentials per workflow (Twilio / GitHub PAT / Anthropic / IMAP / Resend), activate, copy webhook URLs into Vercel env. | Operator-blocking | G1, demo, all phone-edit flow | 1–2 days first time | Operator |
| G7 | **Stripe / payment automation absent.** `08-future-work §3` schedules Stripe Subscriptions + day-0/+7/+14/+30/+60 lockout ladder. Not built. No Stripe SDK in `package.json`. | Automation-blocking | Take real money on a recurring basis without manual invoicing | 3–5 days | Automation |
| G8 | **MSA / SOW templates absent.** `08-future-work §2` schedules these "before client #2." Not drafted. Operator cannot legally take money without a contract. | Operator-blocking (lawyer required) | Closing client #2 | $1,500–$2,500 lawyer fee + 1 week | Operator (with lawyer) |
| G9 | **Resend domain authentication for `lumivara-forge.com` not set up.** No DKIM / SPF / DMARC for outbound. **This affects Sales Sprint S0 reply rates directly** — cold emails from an unauthenticated domain land in spam. | Operator-blocking (DNS config) | Cold-email reply rate; magic-link deliverability for client #1+ | 30 min | Operator |
| G10 | **PIPEDA / privacy posture incomplete.** Site has a `/privacy` route (rendered) but no PIA template, no breach-notification runbook (only a research seed at `docs/research/07-pipeda-breach-notification.md`), no `/subprocessors` page, no Quebec Law 25 French-language fallback. Trigger threshold: client #3. | Mixed | Closing client #3 (and Quebec clients before) | 2–3 days drafting + 1 lawyer pass | Operator |
| G11 | **No error monitoring / observability.** No Sentry, no OpenTelemetry. Silent failures in production go unnoticed until a client texts to complain. The HMAC dispatch returns errors that are logged to console.error only. | Automation-blocking | Sustainable delivery past client #3 | 4 hours (Sentry free tier) | Automation |
| G12 | **Per-client rate-limiting not enforced at runtime.** Documented in `01-business-plan §8` and `04-tier-based-agent-cadence.md` as "per-client rate limit + tier cadence" but no rate-limit middleware in `src/middleware.ts` or `src/lib/admin/`. One client could flood the queue. | Automation-blocking | Multi-client load | 1 day (Upstash Redis already installed) | Automation |
| G13 | **No Twilio SDK in `package.json`.** SMS intake workflow exists in n8n but Next.js side never sends or receives SMS directly. **Drop Twilio entirely for first 5 clients** — see §13 alternatives below. | Architectural choice | (Optional) | 0 hours (decision, not work) | Operator |
| G14 | **iOS Shortcut / Android equivalent definition not checked into the repo.** The "tap a phone shortcut to submit an edit" mechanic depends on a Shortcuts file that the operator and clients install. No `.shortcut` file or import-link in the repo. | Operator-blocking | The headline phone-edit demo | 2–3 hours (build + record install video) | Operator |
| G15 | **1Password Business + recovery envelope not yet drilled.** `docs/mothership/21-vault-strategy-adr.md` schedules this; no evidence it has been completed. | Operator-blocking | Sustainable delivery; insurance audit | 1 hour (operator) + 1 day quarterly drill | Operator |
| G16 | **E&O / cyber liability insurance not in force.** `01-business-plan §8` says "insurance above $50k revenue." If the operator wants to honestly claim "covered" in any deck before $50k, this needs to be quoted. | Operator-blocking | Honesty in advertising; closing legal/health prospects | 2–4 hours (broker call + binding) | Operator |
| G17 | **Per-client engagement evidence log not auto-populated.** `docs/mothership/19-engagement-evidence-log-template.md` exists as a template; no tooling auto-appends Lighthouse scores, axe-core results, content shipments, or audit-log entries to it. | Automation-blocking | Sales asset (the case-study artefact); regulator/insurer audits | 1–2 days (GitHub Action that appends) | Automation |
| G18 | **No client onboarding self-serve flow.** The "5-min intake form → moodboard sign-off in 24h" promised in the prospective-client deck is operator-manual today. | Mixed | Bottleneck on operator hours during sales success | 2 days (Server Action + Resend confirmation) | Automation |
| G19 | **Push notifications when preview ready.** Currently the loop closes via SMS or email (n8n workflows). No Web Push API or PWA notification when a preview link arrives. The 90-second loop relies on the client refreshing or noticing an SMS. | Automation-blocking | The wow factor of the demo | 1 day (Web Push + service worker) | Automation |
| G20 | **Test coverage on the load-bearing paths.** 13 unit tests in `src/__tests__/` (admin-webhooks, admin-vercel-idempotency, admin-deployments-promote-selected, admin-clients, admin-status-map, admin-tiers, admin-main-history, admin-ask-parser, dashboard-cron, content-diagnostic, content-services, site-config, utils). **No e2e test of the full phone-edit loop** — only `e2e/a11y.spec.ts` and `e2e/smoke.spec.ts`. The single most demo-relevant test (intake → AI → PR → preview → publish → prod) is not covered end-to-end. | Automation-blocking | Confidence in 8.2.1 borrowed-phone test | 2 days (Playwright e2e w/ stubbed n8n) | Automation |
| G21 | **No domain-transfer-at-end-of-engagement runbook.** *"You take the domain"* is in every deck; the operational steps to actually transfer registrar control aren't documented. | Operator-blocking | Honesty in handover claims | 4 hours (write runbook + dry-run on operator's own domain) | Operator |
| G22 | **No `/subprocessors` page.** `08-future-work §1.5` flags this. Anthropic, Google, OpenAI, Vercel, Resend, Twilio, GitHub, Railway all process data on behalf of clients. PIPEDA/Law 25 require disclosure. | Operator-blocking | PIPEDA compliance for client #3+ | 2 hours (write content) + 1 day (page + sitemap) | Mixed |
| G23 | **Auto-merge gate is "opt-in per label" but the labels aren't documented anywhere clients can see.** *"Auto-routine label = bot may merge."* Clients (and the operator on a Friday) don't know which changes will auto-merge. Surface in `/admin/changes/[id]` as a visible badge. | Automation-blocking | Trust during demo; disputes if a "wrong" change ships | 2 hours | Automation |
| G24 | **The `forge provision` CLI promised in `00-automation-readiness-plan.md` Phase 3 doesn't exist.** Without it, onboarding client #2 is a manual operator job (re-running `06-operator-rebuild-prompt-v3.md`). The deck pack's *"first fully bot-driven onboarding"* (Phase 5) is blocked behind a CLI that hasn't been written. | Automation-blocking, Blocked-on-revenue | Phase 5 onboarding cleanup; client #3+ velocity | 1–2 weeks | Automation |

### §11.2 — Counts

- **Operator-blocking gaps (humans, paperwork, money):** G5, G6, G8, G9, G10, G14, G15, G16, G21, G22 — **10 gaps**.
- **Automation-blocking gaps (code/configuration the bot or operator-with-bot can fix):** G7, G11, G12, G17, G18, G19, G20, G23, G24 — **9 gaps**.
- **Architectural choice (no work, just commit to a direction):** G13 — **1 gap**.

The operator-blocking gaps are **time-and-money**, not skill — domain DNS, lawyer fees, insurance, vault drill, SHA. The automation-blocking gaps are mostly **1–2-day chunks**, except G7 (Stripe, 3–5 days, second-opinion estimate 2–3 weeks) and G24 (`forge provision` CLI, 1–2 weeks, second-opinion estimate 3–4 weeks). **None are blockers on closing the first paying client** if the §9.1 manual-with-disclosure stack is committed.

### §11.3 — Additional gaps surfaced by independent codebase audit

> _Independent Explore-agent audit of 18 implementation areas returned a **delivery-readiness score of 5.5/10** — substantively higher than the original review's "documentation hobby" framing implied, but consistent with the central diagnosis: real core platform, missing middle. The audit named three gaps the §11.1 inventory missed and a separate set of "hidden cliff" gaps that don't block client #2 but block client #5._

| # | Gap | Class | Notes |
|---|---|---|---|
| **G25** | **Admin allowlist is hardcoded in `src/lib/admin-allowlist.ts`.** Adding a new admin = code commit + deploy. No `/admin/settings` UI for allowlist CRUD; no audit log on allowlist changes. | Automation-blocking | 3–4 days. Migrate to Upstash Redis (already a dep). At client #4+ the operator manages multiple delegated admin emails; hardcoded list doesn't scale. |
| **G26** | **Per-client OAuth provisioning is half-baked.** `forge provision` CLI is planned to auto-create Vercel projects, n8n workflows, Twilio numbers — **but** Google Cloud Console OAuth 2.0 client creation is UI-only (no API), and Microsoft Entra consent prompts can't be automated. `14-critique-operations-sequencing §3` acknowledges *"~70% can be automated; OAuth apps will remain manual."* | Mixed | 1–2 weeks. The fix is a guided manual-step overlay in `forge provision` (copy-paste prompts with screenshots, validation checks), not full automation. |
| **G27** | **Phone-shortcut path was deprecated (`docs/_deprecated/PHONE_SETUP.md`).** Canonical phone-edit path is now: client uses the `/admin` web form on their phone (PWA-style) → n8n → AI → preview → tap publish. The deck pack still occasionally implies an iOS Shortcut. **Update deck language** to match the canonical web-form path. | Architectural alignment | 1 hour. This is a deck wording fix, not a code fix. |

### §11.4 — "Hidden cliff" gaps (don't block client #2; block client #5)

These do not stop the demo. They stop the *sustainable delivery model* the deck pack promises. Address before the cap binds.

| # | Hidden-cliff gap | Why it bites at scale |
|---|---|---|
| H1 | **No operator capacity-model enforcement.** Decks claim a 30-client cap but no tooling stops the operator taking a 31st. No client-pause CLI; no "you're at 25, time to hire" prompt. | At client #25–35, operator burnout is the single biggest existential risk per `01-business-plan §8`. Without enforcement, the cap is honour-system. |
| H2 | **No client-success / ROI metrics.** Admin portal shows triage/execute pipeline status, not *"is client #1 getting ROI?"* No churn prediction, no usage-based tier-upgrade prompt. | Renewal conversations at month 12 are unsupported by data. Operator is selling tier upgrades from gut feel, not from "you used X this month, T3 would unlock Y." |
| H3 | **No multi-operator handoff playbook.** All runbooks (`06`, `07`, `19-evidence-log`) assume one operator. Vault has access control; GitHub CODEOWNERS / approval rules do not exist. | Adding a contractor (per §9.1 stack) breaks several invariants the documentation assumes. |
| H4 | **No vendor-portability story.** Decks claim *"operator-licensed system."* In reality Vercel, Resend, Twilio, n8n on Railway are operator-account-dependent. If the operator vanishes, the client's n8n workflows on the operator's Railway are stranded. | The "what happens if you go away" check in `04-prospective-client-deck.md` is partially false: site keeps running on Vercel; the autopilot does not. |
| H5 | **No cost monitoring per client.** No CLI like `forge costs --month 2026-04 --by-client` summing Vercel + Twilio + Railway + Anthropic + Gemini per client. Operator discovers overruns in credit-card bills. | At 10+ clients, single-client AI/SMS overrun is invisible until billing date. |
| H6 | **No client-escalation runbook.** Client #2 says *"my site is slow"* — no dashboard surfaces *"this client's intake-webhook latency is 5× baseline"*; no documented RCA flow. | Multi-client mode without an escalation playbook is a recipe for missed SLAs. |
| H7 | **Missing e2e test for the full intake → prod loop.** 13 unit tests exist; only `e2e/a11y.spec.ts` and `e2e/smoke.spec.ts`. The single most demo-relevant flow is not covered. | Demo-day will be the first end-to-end test the loop has had. Murphy. |
| H8 | **No deployment health check on the live site.** `deploy-drift-watcher` checks main vs prod; doesn't check whether prod is actually *serving* traffic or whether the client's custom-domain DNS broke. | Operator finds out the client's site is down via the client's angry text, not via monitoring. |

### §11.5 — Revised delivery-readiness score

**5.5/10**, where 10 is what the deck pack claims. The Explore-agent audit named the components that move the score:

- **Score-up:** Admin portal real (Auth.js + GitHub + Vercel integration); HMAC handshake production-grade (timing-safe, replay-protected); deploy-drift-watcher prevents silent prod overwrites; n8n workflow templates exportable; evidence-log template schema-complete; deploy-promotion guard (`assertSafePromotion`) implemented and tested.
- **Score-down:** `forge provision` CLI is critical-path-blocked (manual 13 steps per client); Stripe automation a stub; legal templates absent; PIPEDA posture incomplete; no error monitoring; admin allowlist hardcoded.

The score is **acceptable for closing client #2** under the §9.1 manual-with-disclosure stack. It is **not acceptable for client #5** without the four catch-up workstreams in §12.

---


---



> _Surfaced 2026-05-01 as G4 in §8.2.7. The Dual-Lane Repo design (`docs/mothership/02b-dual-lane-architecture.md`) promises a clean separation: client repo is "vanilla" (just the site), pipeline repo is "operator-side" (workflows, prompts, n8n, dashboard). The current implementation does not match the design. This section names the gap and proposes three resolution paths._

### §10.1 — What the design promises vs. what's shipped

| Concern | Design (`02b`) | Current state |
|---|---|---|
| Client repo contents | Site code, MDX content, design tokens, `/admin` portal, middleware | Site code AND `.github/workflows/` (triage, execute, plan, codex-review, auto-merge), `scripts/triage-prompt.md`, `scripts/execute-prompt.md`, `scripts/lib/`, `n8n-workflows/`, `docs/mothership/`, `docs/storefront/`, `docs/decks/`, `docs/migrations/` |
| Pipeline repo contents | All operator-side: workflows, scripts, n8n exports, runbooks, prompts | Does not exist as a separate repo; lives commingled in this repo |
| Client-handover state | Client gets ownership of vanilla site repo on day 1 | Operator would need to scrub a polluted repo at handover, OR the client receives operator IP they shouldn't have |

The deck-pack pitch — *"You own the code from day one"* — is **structurally false** until the spinout completes. A prospect who reads it and asks *"so the GitHub repo is mine?"* gets a true answer only on the site-code subset; the pipeline subset, today, is in the same tree.

### §10.2 — The three resolution paths

| Path | What it costs | What it preserves | When to pick |
|---|---|---|---|
| **Path A — Bring Phase 4 (Client #1 spinout) forward.** Execute `docs/migrations/lumivara-people-advisory-spinout.md` end-to-end **before** Sales Sprint S0 starts. Cost: 2–3 weeks of operator time; delays sprint by same. | Day-1 ownership pitch stays true. The vanilla-site demo is real. | The full deck-pack pitch as written. | Operator has the appetite for 2–3 more weeks of platform work and believes the ownership pitch is the load-bearing differentiator. |
| **Path B — Defer the ownership claim to 2026-Q3.** Adjust the prospect-facing deck (`04-prospective-client-deck.md`) to promise *"you own the code by month 3"* instead of *"day 1."* Sprint S0 starts on schedule. | Sprint timing. The platform-stays-where-it-is posture. | Most of the offer; weakens the "no lock-in" claim by 90 days. | Operator wants revenue first; willing to discount the moat by 90 days; trusts that prospects will accept "month 3 ownership" as honest. |
| **Path C — Promise pipeline-only-licence with site-handover-on-cancellation.** Reframe: the operator **leases** the pipeline-running repo to the client; on contract end, operator extracts the site code + assets to a fresh client-owned repo and hands it over. Sprint S0 starts on schedule. | A bit of architectural narrative work; no Phase 4 work. | Honest framing throughout. Reads as "managed service" rather than "self-owned". | Operator wants to skip Phase 4 entirely until forced by client #5 economics. |

### §10.3 — Recommendation

**Pick Path B.** The reasoning:

- **Path A** sounds principled but spends 2–3 weeks on Phase 4 work before any revenue. That contradicts the entire spirit of the resequencing — sales-first means the platform-spinout work waits behind revenue. Phase 4 was deliberately marked `Blocked-on-revenue` in §5.1 for this reason.
- **Path C** is the most accurate description of the current platform reality, but it sells a different product than the deck pack describes. Switching mid-sprint to a "managed lease" pitch is a bigger rewrite than the §9.1 honest-pitch update.
- **Path B** preserves the ownership claim (which is real, eventually) while being honest about the timing. The deck edit is a single sentence: *"At day 90, when the platform spinout completes, you take full ownership of the site repository — code, hosting account, domain, all of it. Until then, the operator hosts and runs the autopilot from a managed environment."*

This pairs naturally with the §9.1 stack (manual-with-disclosure for the first 90 days). Both align on the same 90-day "transition to fully-owned" arc. Both are honest. Both close.

### §10.4 — What this means for Phase 4

Phase 4 (`Spin Client #1 out`) and Phase 3 (`Bootstrap platform repo`) are no longer just `Blocked-on-revenue` — they are the **gate to the day-90 ownership transfer** under Path B. They must complete before the first paying client's day 90, or the operator has to extend the managed-environment phase. Practically:

- **If Sales Sprint S0 closes client #2 on day 30:** Phase 3 + 4 must complete by day 90 to make the ownership transfer date. ~2 months of platform work, parallel to running the new client's monthly cadence. Tight but doable.
- **If Sales Sprint S0 closes client #2 on day 60:** Phase 3 + 4 has 30 days. Tighter; Path C (the managed-lease pitch) becomes the fallback if the spinout slips.
- **If Sales Sprint S0 closes client #2 on day 90:** Phase 3 + 4 starts simultaneously with the new client's onboarding. Path C is effectively the active model.

The discipline this encodes: **the operator's first revenue is also the alarm clock on the spinout.** The platform-spinout work that previously had no deadline now has a 90-day post-revenue deadline, attached to a real customer commitment. That is healthier than the current open-ended Phase 4 plan.

---

## §12 — Detailed task list (operator-blocking vs automation-blocking)

> _Synthesises §11.1 + §11.3 + §11.4 into a single sequenced action plan. Tasks split into two lanes that can run in parallel — operator-blocking tasks need a human, automation-blocking tasks can be picked up by the existing auto-routine bot pipeline once labelled. Priorities are P0 (this week, blocks the demo), P1 (within 4 weeks, blocks Sales Sprint S0), P2 (before client #3), P3 (hidden cliff — before client #5)._

### §12.1 — Operator-blocking tasks (humans / paperwork / money / DNS)

| Pri | Task | Effort | Output / done-when |
|---|---|---|---|
| **P0** | **Set Vercel production env vars** (G5): `N8N_INTAKE_WEBHOOK_URL`, `N8N_DECISION_WEBHOOK_URL`, `N8N_DEPLOY_WEBHOOK_URL`, `N8N_HMAC_SECRET`. | 30 min | All three webhook dispatch helpers in `src/lib/admin/webhooks.ts` stop returning *"…not wired up yet"* errors in production. Also add to `needs-vercel-mirror` label issue per `AGENTS.md`. |
| **P0** | **Provision n8n + import the 6 workflows** (G6). Pick host (Railway $5/mo OR Oracle Cloud free-tier — see §13). Import bundle from `docs/n8n-workflows/admin-portal/`. Wire credentials per workflow per the `README.md` there. Activate. Copy webhook URLs into Vercel env (closes P0 row above). | 1–2 days first time | All 6 workflows show "Active" in n8n UI; one synthetic test request through `intake-web` lands as a GitHub issue in the test client. |
| **P0** | **Set up Resend domain authentication** (G9) for `lumivara-forge.com` — DKIM + SPF + DMARC DNS records added at registrar. | 30 min | Test send from `outreach@lumivara-forge.com` lands in inbox (not spam) on Gmail + Outlook + iCloud. Affects **Sales Sprint S0 reply rates directly.** |
| **P0** | **Buy `lumivara-forge.com` + `.ca`**, point at Vercel project, set up the `outreach@…` mailbox via Resend or Google Workspace. Pre-existing in §5.6 step 1; restated here for the operator-task lane. | 30 min | Domain resolves, MX/A records green, mailbox sends + receives. |
| **P0** | **Update `04-prospective-client-deck.md` + `vertical-pitches/dentists.md` for Path B + §9.1 honesty.** Ownership claim → "day 90 transfer." Negative list collapsed to 3 bullets. Replace dental `[S]` figure (G27 phone-shortcut wording also fixed here). | 2 hours | Deck reads under §9.1 honest-pitch language; ready to attach to Sales Sprint S0 emails. |
| **P0** | **Build `prospects.csv`** — 50 named Ontario dentists, columns per §6 of the original review. | 4 hours | 50 rows; ready Thu morning for first cold email batch. |
| **P0** | **Record 90-second phone-edit loop screen capture** (§8.2.2) on `lumivara-forge.com` from a borrowed phone. | 2 hours | One MP4 / Loom link, hosted on `lumivara-forge.com` or Loom; attaches to every cold email. |
| **P0** | **Run §8.2.1 borrowed-phone test, 5×.** Fix any breakage discovered. | 1 day | All 5 loops succeed end-to-end <4 min wall-clock each. |
| **P0** | **Publish one before/after Lighthouse case study** on `lumivara-forge.com`. | 4 hours | Live URL; Lighthouse before/after numbers + axe-violation count + audit-log link. |
| **P0** | **Drafted `docs/ops/demo-recovery-playbook.md`** with one-line operator response for each of the 4 breakage scenarios (§8.2.3). | 2 hours | Page exists in repo; the act of writing it surfaces gaps. |
| **P1** | **Engage Canadian small-business lawyer for MSA + SOW templates** (G8). $1,500–$2,500 flat fee. | 1 week wall-clock; 4 hours operator | MSA + SOW + AUP templates in `docs/operator/legal/`. Without this, no legal close on client #2. |
| **P1** | **Quote E&O / cyber liability insurance** (G16). $400/yr Ontario sole-prop band. Bind before any non-operator client invoice clears. | 2–4 hours (broker call + binding) | Policy in force; certificate-of-insurance available on request. |
| **P1** | **1Password Business + recovery envelope drill** (G15). | 1 hour first time + quarterly | Vault opened; recovery kit printed and sealed; first quarterly drill on calendar. |
| **P1** | **Pre-arrange Ontario freelance Next.js fallback dev** (§9.1 option 6) on hourly retainer-when-invoked terms. | 4 hours (LinkedIn search + 2 calls) | Verbal agreement + email summary; no money changes hands until invoked. |
| **P1** | **Publish `/subprocessors` page** (G22) listing Anthropic, Google, OpenAI, Vercel, Resend, Twilio (if used), GitHub, Railway. | 2 hours | Page live; sitemap entry; linked from `/privacy`. |
| **P1** | **Write `docs/ops/domain-transfer-runbook.md`** (G21) — the operational steps to actually transfer registrar control at end-of-engagement. | 4 hours | Runbook + dry-run on operator's own domain before client #2. |
| **P2** | **PIPEDA: PIA template + breach-notification runbook** (G10). One-pager per tier; promote `docs/research/07-pipeda-breach-notification.md` from research seed to operational doc. | 2–3 days | Templates in `docs/operator/legal/`; trigger threshold: client #3. |
| **P2** | **Quebec Law 25 French-language privacy page.** | 1 day (translator) | French `/privacy` route; trigger: first Quebec prospect. |
| **P3** | **Operator capacity-model enforcement** (H1) — write a `forge clients --status` script that warns at 25 active clients and refuses new at 30. | 1 day | CLI flag works; warning banner in admin portal. |

**Operator P0 wall-clock total: ~3–4 working days**, parallelisable across Mon–Fri of week 1. The §5.6 day-by-day plan is exactly this list ordered by day-of-week.

### §12.2 — Automation-blocking tasks (bot-runnable; label `auto-routine`)

| Pri | Task | Effort | Done-when |
|---|---|---|---|
| **P0** | **Embed Vercel preview link inline in `/admin/client/[slug]/request/[number]/page.tsx`** (G2 nuanced — currently surfaced on `/preview` aggregate page, not the per-request detail). React component reading `findPreviewByCommit` result. | 1 day | A "Preview" button + inline iframe appears on the request page when the PR's preview build is `READY`. |
| **P0** | **Surface auto-merge label as a visible badge** on `/admin/client/[slug]/request/[number]` (G23). | 2 hours | Badge says *"Auto-merge eligible"* or *"Operator-review only"* per the labels on the linked PR. |
| **P0** | **Playwright e2e test of the intake → preview → publish loop** (G20 / H7). Stub n8n with a local Express handler returning 200 OK; assert the Server Actions invoke as expected and the deploy log records. | 2 days | `e2e/admin-publish-flow.spec.ts` green in CI. |
| **P1** | **Per-client rate limiting middleware** (G12) on the public-facing intake endpoints. Use Upstash Redis (already in deps). 10 requests / minute default; configurable per client tier. | 1 day | Rate-limit header on responses; 429 on exceed; logged to deploy-log table. |
| **P1** | **Sentry integration** (G11) — server + client. Free tier covers up to 5k events/mo. | 4 hours | Errors land in Sentry; daily digest email to operator. |
| **P1** | **Engagement evidence log auto-population** (G17). GitHub Action that, on every PR merge into a client's main branch, appends a row to `docs/clients/<slug>/evidence-log.md` with Lighthouse delta + axe results + change-summary. | 1–2 days | Evidence log auto-grows; manual entries no longer required. |
| **P1** | **Web Push notification for preview-ready** (G19). PWA service worker on `/admin`. | 1 day | When `findPreviewByCommit` returns `READY`, the client's open-tab admin page receives a push; tab can be closed and notification still arrives. |
| **P1** | **Intake form self-serve flow** (G18). Server Action that takes the 5-min intake form, generates a moodboard preview via the AI pipeline, sends a Resend confirmation email with the preview link. | 2 days | New prospect visits `/intake`, fills in 8 fields, gets a moodboard within 24h without operator touching anything. |
| **P1** | **Migrate admin allowlist from hardcoded array to Upstash Redis** (G25), with `/admin/settings` UI for CRUD + audit log. | 3–4 days | Adding a new admin email no longer requires a code commit. |
| **P2** | **Stripe Subscriptions automation** (G7). Product per tier; `forge bill` CLI; n8n `payment-failed` workflow with day-0/+7/+14/+30/+60 lockout ladder. | 3–5 days minimum; second-opinion estimate 2–3 weeks for full lockout ladder | Automated invoice on signup; failed-charge handling; admin-portal "subscription paused" banner at +14 days. |
| **P2** | **Deploy-drift-watcher post-deploy auto-retry + 4h escalation** (H1 / drift-watcher refinement). | 3–5 days | Drift issue auto-closes when watcher confirms `drift = 0`; escalates to operator if drift persists > 4 hours. |
| **P2** | **Cost monitoring CLI** (H5): `forge costs --month --by-client`. | 3 days | CLI sums Vercel + Twilio + Railway + Anthropic + Gemini per client; flags anomalies; emails monthly digest. |
| **P3** | **`forge provision` CLI** (G24). The Phase 5 onboarding deliverable. 1–2 weeks operator estimate; 3–4 weeks per second-opinion audit. **This is the largest single chunk in the list. Do not start until client #2 has paid.** | 1–4 weeks | One command provisions a new client end-to-end (with the OAuth manual-step overlay per G26). |
| **P3** | **Multi-operator handoff playbook** (H3) + GitHub CODEOWNERS rules. | 1 week | Adding a contractor to the org doesn't break invariants. |

**Automation P0 wall-clock total: ~3.5 days** — parallelisable with the operator P0 lane. P1 lane: ~2 weeks. P2/P3 lanes: post-revenue work.

### §12.3 — How the two lanes interact

The operator and automation lanes run **in parallel**, not sequential. The operator does §12.1 P0 (~3–4 days, mostly DNS / config / writing) while the bot — using the existing auto-routine label and the `execute.yml` cron — picks up §12.2 P0 (preview-embed inline, auto-merge badge, e2e test). By Thursday of week 1, both lanes converge: the operator has a working domain + 50-prospect list + recorded loop + honest deck + drafted recovery playbook; the bot has shipped the inline-preview UX + auto-merge badge + e2e test.

**Forbidden during P0 week:** operator does NOT pick up automation-lane tasks. The operator's job is the §12.1 list. Automation lane is the bot's job. If the bot can't pick up a §12.2 task because of `infra-allowed`-label exclusions, the operator stamps the label and moves on; they do not implement.

---

## §13 — Tech-stack and automation-approach alternatives

> _Per operator request 2026-05-01: evaluate whether better alternatives exist to the current stack and automation approach. Current stack has real production-grade pieces (HMAC handshake, deploy-promotion guard, admin portal) but several components are over-engineered for a solo operator with zero clients, and a few components are under-built for the use case. This section names the swaps that would reduce operational complexity without giving up the moat._

### §13.1 — The high-leverage swaps (recommended this quarter)

| # | Swap | Current | Recommended alternative | Why | Migration cost |
|---|---|---|---|---|---|
| **S1** | **Drop Twilio for first 5 clients (G13).** | Per-client SMS number ($1.15/mo USD per client + setup tax). | **Email-only intake + web form (`/admin` PWA on phone).** SMS deferred to client #5+ when demand justifies it. | Twilio adds setup tax (per-client number provisioning, n8n SMS workflow credentialing) for marginal value. The existing `/admin` web form on a phone is the canonical phone-edit path per G27 (the iOS Shortcut path was already deprecated). Cuts G6 wiring effort roughly in half. | 0 hours — it's a decision. Update `intake-sms.json` workflow status to "deferred"; remove SMS-related slides from prospective-client deck. |
| **S2** | **Replace n8n with Inngest** (or commit fully to n8n). | n8n on Railway / Oracle Cloud free-tier — 6 workflow JSONs, 5 credentials per workflow, JSON replication for new clients via `sed` (per `docs/n8n-workflows/admin-portal/README.md`). | **Inngest** — serverless workflow engine; pay-as-you-go (free tier covers solo-operator volume); idiomatic TypeScript SDK; runs as Next.js routes; no credential UI to wire per workflow. **OR** commit fully to n8n and stop drifting. The half-built state (n8n-as-canonical-hub but Server Actions doing HMAC dispatch) is the worst of both. | Inngest eliminates G1 (n8n hub not wired) entirely — workflows live as TypeScript in the same Next.js codebase. Eliminates per-client JSON-replication. Eliminates the Railway/Oracle hosting decision. Trade-off: lose n8n's visual workflow builder (operator value-loss low: solo eng-operator doesn't need a no-code surface; the contractor in the §9.1 stack also reads code). | **2–3 days** to port the 6 workflows. Net win: subsequent gap-fixes (G7 Stripe, G17 evidence-log auto-pop, G19 push notifications) become Server Actions instead of new n8n workflows. |
| **S3** | **Cut the 5-leg LLM fallback ladder to 2 legs.** | Claude Opus → Gemini 2.5 Pro → Gemini 2.5 Flash → GitHub Models (Llama 3.3-70B + GPT-4.1-mini) → OpenRouter (DeepSeek R1 + Qwen3-Coder). Five vendors, custom routing in `scripts/codex-review-fallback.py`. | **Claude primary + OpenRouter fallback** (or LiteLLM proxy as the single endpoint with vendor-side fallback). Two legs cover 99% of real outage cases. | The 5-leg ladder is genuine over-engineering — built because possible, not because demanded. Real Claude availability is ~99.9%; a single fallback gets you to ~99.99%. The further legs are vanity. The `llm-monitor` self-awareness pipeline that watches all five providers is similarly oversized. | **1 day** to simplify. Keep `codex-review` for the second-opinion code review (it's a different use-case). Reduces `llm-monitor` workload + per-provider credential management. |
| **S4** | **Defer Stripe automation; use manual Stripe invoicing for clients #2–#5.** | `08-future-work §3` documents a full day-0/+7/+14/+30/+60 lockout ladder via n8n `payment-failed` workflow + Server Actions. Estimated 2–3 weeks per second-opinion audit. | **Stripe Invoicing UI** (manual, web app) for first 5 clients. Zero-code. Operator clicks "send invoice" once a month. Auto-charge isn't built; auto-pause isn't built; lockout ladder isn't built. | At <5 clients, manual invoicing is 30 min/month total. The lockout ladder is solving a problem the operator does not yet have. Defer to client #6 when load justifies the build. | 0 hours — it's a decision. Update `08-future-work §3` status to "deferred to client #6." |
| **S5** | **Defer the `forge provision` CLI** (G24). | 13-step manual onboarding playbook (`06-operator-rebuild-prompt-v3.md`); CLI is Phase 5 deliverable, ~3–4 weeks per second-opinion estimate. | **Document + checklist** instead of CLI for clients #2–#5. The manual 13-step onboarding takes 2–4 hours per client; CLI development takes 3–4 weeks. At 3 clients × 4 hours = 12 hours of manual work vs 120 hours of CLI build = 10× ROI on staying manual. Build the CLI when manual onboarding hits ~10 clients × 4 hours = 40 hours/quarter and a 3-week build pays back in 1 quarter. | Reframes Phase 5 from a blocker into a milestone. Aligned with §5.1's Blocked-on-revenue posture. | 0 hours — also a decision. |
| **S6** | **Defer the brand rename for 90 days** (already in §5.4). | Brand rename ADR (`15c §3`) re-opened, blocking Phase 0. | **Ship under `Lumivara Forge` working name; revisit only after client #2 closes if at all.** | A prospect who would have signed under `loom.com` and balks at `lumivara-forge.com` does not exist. | 0 hours. |

**Aggregate effect of S1–S6:** ~3–4 days of swap work eliminates 4–6 weeks of "build the unfinished platform" work, and removes 4 of the 18-area implementation gaps from the critical path. The platform that remains is **smaller, more legible, and more honestly priced.**

### §13.2 — The architectural questions worth asking once

These are not swaps to make this quarter; they are decisions to commit to before scaling past client #5.

| # | Question | Two-line answer | Re-decide when |
|---|---|---|---|
| **A1** | Auth.js v5 beta vs Clerk vs Supabase Auth? | Stay on Auth.js v5 beta until a real Auth.js bug bites in production. **Clerk migration path documented as fallback** ($25/mo, ~1 day to migrate). | First Auth.js beta-instability incident, OR client #5. |
| **A2** | n8n vs Inngest vs Vercel-only? | If S2 isn't taken, lock down n8n: standardise hosting (Oracle Cloud free-tier wins on cost), document credential rotation, write the per-client replication script (`forge n8n-clone <slug>`). | If S2 is taken, this is settled. Otherwise, client #5. |
| **A3** | Dual-Lane Repo (two-repo) vs single-repo + CODEOWNERS? | Dual-Lane is correct for the IP story but **defer the spinout** (§10 Path B). At the day-90 ownership transfer date for client #2, do the spinout for that one client; do not pre-build for hypothetical clients. | Client #2's day 90. |
| **A4** | Marp decks vs Pitch / Beautiful.ai / no slides? | Stay on Marp. The decks are over-produced regardless of tool; the issue is volume and audience-mismatch (§5 freezes), not rendering. | Never; this isn't load-bearing. |
| **A5** | Claude Code (OAuth) vs Cursor / Aider / Copilot Workspace? | Claude Code's OAuth integration with `CLAUDE_CODE_OAUTH_TOKEN` is a meaningful operational win — single seat, max-tier quota shared across cron paths and interactive sessions. **Stay.** | Anthropic deprecates the OAuth path or pricing model. |
| **A6** | GitHub Actions vs self-hosted runner vs Vercel Cron? | GitHub Actions free tier is fine until cliff #2 (~16 active clients per `18-capacity-and-unit-economics.md §6`). Migrate to a $5/mo Hetzner self-hosted runner at that cliff. | Cliff #2 or first GitHub Actions free-tier overage bill. |
| **A7** | The Plan-then-Execute pipeline — keep, simplify, drop? | **Keep for client-impacting issues** (the client reads the plan first — that's the value). **Drop for trivial copy edits** (the plan step adds latency for marginal value). Add a `skip-plan` label that triage can apply. | Once 50+ auto-routine PRs have shipped; measure plan-utility-per-PR. |
| **A8** | The 4-tier client cadence (T0–T3) vs single tier? | Single tier ("the practice tier") for clients #2–#5. The 4-tier ladder is sales theatre when there are zero clients to differentiate. Re-introduce tiers when prospects ask for differentiation, not before. | First prospect explicitly asks "do you have a smaller / bigger plan?" |

### §13.3 — The big "approach to automation" choice

The deck pack describes a **platform-first** approach: build a multi-vendor AI orchestration apparatus, then sell it as a managed service. The honest §9.1 stack reframes it as a **service-with-AI-leverage** approach: the operator is the service; the AI is the leverage that lets the operator hold 30 clients on solo-operator economics.

These are not subtle differences. They have different tech-stack implications.

| Approach | What you need (tech) | What you defer | When right |
|---|---|---|---|
| **Platform-first** (current decks) | Full Dual-Lane Repo + `forge provision` CLI + Stripe lockout ladder + multi-vendor LLM ladder + n8n hub + per-client OAuth provisioning + cost-monitoring CLI before scaling. | Sales until the platform is "ready." | When you have a paying client base willing to wait while you finish. |
| **Service-with-AI-leverage** (§9.1 + this section) | Working `/admin` portal + HMAC dispatch + 1 LLM provider with 1 fallback + email-only intake + manual Stripe Invoicing + manual onboarding checklist + the operator personally reviewing every PR before publish for first 90 days per client. | Almost everything in column 2 — until revenue justifies it. | When you have zero clients and need to find out if the offer sells. **This is you, today.** |
| **Concierge/Service-as-Software** (alternative) | Cursor + Claude Code + the operator's laptop. **No platform at all.** Client texts the operator; operator implements via AI tools; ships. | Phone-edit demo, multi-vendor ladder, Dual-Lane spinout — all of it. | When the goal is "find product-market fit fast"; the AI is invisible to the client; operator can pivot the offer weekly. |

The §9.1 stack already encodes the **Service-with-AI-leverage** column. The recommendation in §13.1 (S1–S6) collapses the tech-stack to roughly that level. **Concierge** is the radical alternative — drop the entire platform and run the offer from a laptop until product-market fit lands. It is a real option. Its tradeoff: operator gives up the 30-client cap math (no automation = no leverage = ~10-client cap) in exchange for moving 5× faster on offer iteration. Worth considering only if Sales Sprint S0 reply rate is <2% by week 3 of the dentist vertical, signalling that the offer is wrong, not the platform.

### §13.4 — One-paragraph recommendation

**Take S1, S2 (or S2-equivalent commitment to n8n), S3, S4, S5, S6 this quarter.** Total: ~3–4 days of swap work. **Result:** the platform shrinks to its actual load-bearing components (admin portal + HMAC + deploy guard + 2-leg LLM + 1 workflow tool + manual onboarding); 8 of the 18-area gaps drop off the critical path; Sales Sprint S0 starts on schedule with a smaller, more honest, more demonstrable product. Defer A1–A8 until they bite. Reserve **Concierge** as the fallback if Sprint S0 returns reply-rate signal that the offer itself is wrong.

This is the path that keeps the operator selling without lying about the platform, and that doesn't spend the next 4–6 weeks finishing infrastructure for clients who haven't said yes yet.

---



A single GitHub issue should track Sales Sprint S0 at the operator level. Suggested title: *Sales Sprint S0 — first paying client #2 (90-day time-box, started YYYY-MM-DD)*. Labels: `meta/sales-sprint`, `priority/P1`, `human-only`. Body uses the §5.6 day-by-day plan as a checklist; updates happen in comments daily.

When client #2 invoices and the deposit clears, that issue closes. The act of closing it is the trigger to unfreeze the deck pack and resume the platform-spinout work in the §5.1 order.

---

*Last updated: 2026-05-01. Operator-scope. Read [`CRITICAL-REVIEW.md`](./CRITICAL-REVIEW.md) first; this file is the counter-plan.*
