<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SALES PLAYBOOK

  This file is the per-vertical sales positioning for **family medicine /
  general-practice clinics** (single-MD or 2–8 physician group practices,
  Ontario / GTA primary, US-secondary). It is read before a discovery call,
  not pasted into one. The client-facing distillation lives in
  `../../decks/04-prospective-client-deck.md` (P2 variant).

  Hard rules (inherited from `00-INDEX.md`):
    1. Never ships in a client repo.
    2. Never forwarded verbatim to a prospect.
    3. Numbers that drive a pitch trace back to `../../research/03-source-bibliography.md`
       or are flagged inline `[OE]` (operator estimate) / `[S]` (soft / aggregated).
================================================================================
-->

# Doctors — family medicine / GP clinic sales template

> _Lane: 🛠 Pipeline — operator-only sales positioning. Persona alignment: P2 ("trust-driven local health practice", `../../research/04-client-personas.md §P2`). Default tier: T2._

---

## §1 — Snapshot

**Vertical.** Family medicine / general-practice / primary-care clinics. Single-physician practices, 2–8 physician group practices, Family Health Teams (FHTs), Family Health Organizations (FHOs), Family Health Networks (FHNs), and the Canadian "rostered + walk-in" hybrid. US analogue: small independent primary-care practices (PCPs), small DPC (direct-primary-care) clinics, concierge-medicine practices.

**Persona alignment.** P2 — "the trust-driven local health practice." Owner is a clinician, not a marketer; the website is a trust signal first, an operational tool second.

**Default tier.** Tier 2 (CAD $4,500 setup + $249/mo). Tier 3 if multi-location, multi-language, or if booking integration spans Cal.com / Jane / Ocean / NexHealth. Never Tier 0 — the regulator-of-record (CPSO / state medical board / HIPAA / PHIPA) makes the unmaintained version a real liability.

**Headline pain in one sentence.** "Our patients can't book online, our hours are wrong on Google, and the compliance officer just flagged that we're not AODA-compliant — and the developer who built the site in 2019 has stopped returning calls."

---

## §2 — Who they are

**Practice shape.**
- 1 physician (solo) → 8 physicians (group). At 8+ physicians the practice typically has a marketing budget and an internal admin lead, drifting toward agency-territory; that's our Tier 3 ceiling, not a sweet spot.
- Staff: 1 office manager, 2–4 medical secretaries / receptionists, 1–2 RNs / NPs, occasional locum coverage.
- One physical clinic location is typical; FHTs sometimes operate 2–3 satellites in the same city.

**Geography (Lumivara Forge prospecting priority).**
1. **Southern Ontario primary** — GTA, Hamilton, Niagara, Waterloo region, Kingston, London. Operator visibility + warm-network sourcing + AODA leverage land hardest here.
2. **Canadian metro secondary** — Vancouver, Calgary, Ottawa, Montreal-anglophone. Different provincial accessibility statutes (`§9` below for the cross-walk).
3. **US tertiary** — Northeast US (NY, NJ, MA, PA), Pacific Northwest (WA, OR), and any state with active ADA litigation pressure (NY, FL, CA — see `[V] §B-ADA-Lawsuits` Note column for the 1,021 NY filings).

**Practice age.** 8–25 years. Sites built in 2018–2021. The "we'll fix the site after COVID" backlog is the underlying mechanic — it's now 2026 and the post-COVID telehealth wave has compounded the staleness.

**Owner archetype.** Clinical-first, marketing-skeptical, time-poor, evidence-driven. Reads BMJ / NEJM / Annals of Family Medicine, not Marketing Week. Will not respond to "growth-hack your patient acquisition" copy. Will respond to "your CPSO advertising-policy compliance is a legal property of the system, not your office manager's memory."

**Decision-maker(s).** The senior physician-owner is the budget-holder. The office manager is the operational bottleneck and *will* be in the second discovery call. If you don't get the office manager on side, the deal stalls in implementation regardless of what the physician signs.

---

## §3 — Core issues / pain points

The operator hears these in approximately this order on a discovery call:

1. **"Our hours on the website are wrong."** Almost universal. Holiday closures, locum-coverage windows, telehealth-day shifts. Owner cannot edit the site without calling the developer. The solution is so obviously "fix the site" that the owner mistakes Lumivara Forge for a CMS, not an autopilot — clarify early.

2. **"Patients can't see what we accept."** OHIP vs. private vs. WSIB vs. uninsured-services pricing on a Canadian site; insurance accepted (Aetna, Cigna, BCBS) on a US site. The owner has been dictating the answer to the same 30 patients on the phone every week.

3. **"The site is not AODA / ADA compliant and our compliance officer is asking."** Provincial mandate (Ontario AODA, Manitoba AMA, Quebec law on accessibility). For US practices, Section 504 / ADA Title III pressure plus the `[V] §B-ADA-Lawsuits` 3,117-filings + 27% YoY signal. Healthcare is in the top three targeted sectors for ADA web lawsuits ([S] healthcare-vertical aggregation; verify against UsableNet 2025 report row when added to bibliography).

4. **"Online booking is half-broken."** Many Canadian primary-care practices use Ocean (CognisantMD), Jane App, MedeoHealth, or Tia Health. The site links to one of these but the link is dead, points to the wrong language, or routes to the locum's calendar. US practices use NexHealth, Tebra, Solutionreach, Zocdoc — same pattern of broken integration.

5. **"Reviews look bad."** RateMDs (Canada) or Healthgrades / Vitals / Yelp / Zocdoc / Google (US) carries 8 reviews from 2018, three of which are angry. The site does not solicit reviews from the 4,000 satisfied patients seen since.

6. **"New-patient form is a PDF."** A 6-page intake PDF is downloaded, printed, filled in by hand, scanned, and emailed back — when it could be a structured digital intake routing into the EMR (Accuro, OSCAR, EMR-PC, Epic, Athena). The PDF exists because the original developer didn't want to deal with PHIPA/HIPAA-compliant form handling.

7. **"We have no way to publish a clinic announcement quickly."** Closures, public-health advisories (mpox, measles re-emergence in 2024–25, shingles vaccine eligibility changes), recall notices. Each requires a $200 invoice + 3-day turnaround from the original developer.

8. **"Our SEO is invisible."** "Family doctor near me" Google Business Profile claim is half-set-up; the website's structured data (`MedicalClinic` JSON-LD, `Physician` schema) is missing entirely. Competitors with newer sites are above them in the local 3-pack.

---

## §4 — Basic requirements (table-stakes)

What every doctor-vertical prospect believes they're shopping for. Any vendor pitching them must check all eight:

| # | Basic requirement | What "good" looks like |
|---|---|---|
| B1 | Mobile-first, fast, accessible site | Lighthouse ≥ 90 mobile; axe-core 0 critical issues; AODA / ADA compliant out of the box. |
| B2 | Hours, address, phone clearly visible | One tap to call; one tap to map; office hours as structured data (`OpeningHoursSpecification`). |
| B3 | List of services + insurance accepted | Plain English; no medicalese; "what we do" + "what we don't do." |
| B4 | Online booking — at minimum a link that works | Deep-links into Ocean / Jane / Tia / Maple / NexHealth / Tebra; respects locale (en-CA vs en-US). |
| B5 | Working contact form that lands in a real inbox | PHIPA / HIPAA-aware; no PHI in the form unless explicitly architected with BAA / DPA. |
| B6 | Physician bios with credentials | CCFP / FCFP / MD-PhD / board-certifications; CPSO / state-board registration number visible. |
| B7 | Fast load on 4G in a hospital waiting room | Core Web Vitals pass on mobile; not 36% like the WordPress baseline (`[S] §B-WP-CWV`). |
| B8 | Editable by the office manager without a developer call | A real CMS workflow — the **phone-edit pipeline** is the differentiator here, not just a basic CMS. |

If a competing vendor checks 6/8, the prospect will stay. If a vendor checks <5/8 *and* charges $200/edit afterward, this is exactly the practice we're displacing.

---

## §5 — Aspirational requirements (where the upsell lives)

What the practice *wants* but hasn't asked for yet — surface these on the second discovery call, not the first.

| # | Aspirational | Why it lands | Tier-fit |
|---|---|---|---|
| A1 | Patient-education content on a real cadence (vaccine eligibility, screening guidelines, public-health advisories) | "Be the doctor patients trust enough to text." Phone-edit lets the physician dictate a 200-word patient-friendly explainer in the parking lot between patients. | T2 |
| A2 | Online intake forms that route into the EMR | Replaces the 6-page PDF; structured data into Accuro / OSCAR / Epic / Athena via a HIPAA-compliant intake provider (Ocean, JotForm Health, Formstack Health). Add-on, not core scope. | T3 |
| A3 | Multi-language site (English + French in Ontario; English + Spanish in US Northeast / SW; English + Mandarin in GTA) | Clinical population reflects the city. Patient-trust signal is enormous. | T3 |
| A4 | Telehealth landing page that is its own funnel | Telehealth bookings have 25–40% higher show-rates than in-person ([S] telehealth no-show aggregation; verify against AHRQ / Doxy.me data); a dedicated landing page captures the right intent. | T2 |
| A5 | Review-collection automation (post-visit text → Google review) | Solves the 8-reviews-from-2018 problem. Integrates with NiceJob / Birdeye-class tools or a custom Resend workflow. | T2 add-on |
| A6 | "What's new at the clinic" feed visible without leaving the home page | Office-manager publishes "Dr. Singh away Aug 12–19, locum Dr. Patel covering" from her phone. The patient who would have called to ask, doesn't. | T2 |
| A7 | Accessible video clips of the physicians (1-minute "what to expect on your first visit") | Increases conversion on the contact-form side; trust signal proven across `§B-Outdated-75`-class consumer-trust research. | T2 add-on |
| A8 | Compliance dashboard the physician can show their lawyer | A dated record of accessibility scans, content updates, and PHIPA / HIPAA review. Differentiates Lumivara Forge from any DIY builder. | T3 |

---

## §6 — How Lumivara Forge covers basic + aspirational

Feature-by-feature mapping. This is the discovery-call recap slide.

| Requirement | Lumivara Forge mechanism |
|---|---|
| B1 mobile-first / accessible | Next.js + axe-core + Lighthouse in CI on every preview build; build fails if a11y regresses (mitigation `D5` in `../../research/06-drawbacks-and-honest-risks.md`). |
| B2 hours / address / phone | Structured `OpeningHoursSpecification` + `MedicalClinic` JSON-LD generated from the intake form; phone-edit shortcut updates hours in 30 seconds. |
| B3 services + insurance | MDX content section regenerated on every phone-edit; the operator drops a one-line "now accepting Sun Life" change into the textbox and the site updates. |
| B4 booking link | Deep-link into the client's existing Ocean / Jane / NexHealth account; we never replace the booking system, we wrap it. The booking system stays in the client's name. |
| B5 contact form | Resend-routed mailbox; PHIPA / HIPAA disclaimer auto-inserted; no PHI captured by default — the form prompts the patient to use the booking system for anything clinical. |
| B6 physician bios | MDX template with structured `Physician` schema; college / board registration number is a required field on intake. |
| B7 fast load | Vercel + edge-hosted + image optimisation pipeline; 50–70% load-time advantage over WordPress baseline (`[S] §B-Headless-Perf`). |
| B8 office-manager editable | The phone-edit pipeline is the differentiator. Unlimited edits at T2. The office manager sends a text → preview link arrives → physician taps publish. |
| A1 patient-education cadence | Monthly improvement run includes a 1-2 article publish slot; the operator ghost-writes from a 30-second physician dictation. |
| A2 intake forms → EMR | Add-on (CAD $300–$600 setup); we wire Ocean / Jane / Formstack-Health into the site, the EMR stays in the client's vendor relationship. |
| A3 multi-language | T3 default; en-CA + fr-CA in Ontario; en-US + es-US in US-Northeast; en-CA + zh-Hans in GTA. Generated from the same intake source-of-truth so translations stay synchronised. |
| A4 telehealth funnel | A dedicated `/telehealth` page; structured `MedicalWebPage` schema; the booking link routes to the telehealth-only calendar in the EMR. |
| A5 review-collection | Resend-driven post-visit email sequence (T2 add-on, CAD $250 setup); links to Google Reviews / RateMDs / Healthgrades. |
| A6 "what's new" feed | MDX-based clinic-announcements section; the office manager phone-edits it. |
| A7 video clips | Vercel hosting + native `<video>` with captions (accessibility-mandatory); we don't host on YouTube to avoid third-party tracking + privacy concerns. |
| A8 compliance dashboard | T3 deliverable. A `/compliance` admin-only page with the last 12 months of axe-core scans, Lighthouse a11y trend, content-change audit log. |

---

## §7 — Current problems and risks (status quo)

Failure modes the practice already lives with. We name them on the discovery call and pair each with §8.

| # | Failure mode | Concrete example |
|---|---|---|
| P1 | Stale clinical info | Site says "Dr. Singh accepting new patients" — Dr. Singh has been on parental leave for 6 months. A new-patient inquiry comes in; the front desk has to disappoint the patient. |
| P2 | AODA / ADA non-compliance | Compliance officer flags missing alt text + colour-contrast failure on the booking CTA. Risk: provincial AODA fine (`§9` for the statute); US ADA Title III lawsuit ($25k–$75k typical settlement; trial costs higher). |
| P3 | PHIPA / HIPAA exposure on the contact form | Patient pastes their entire symptom history into a "general inquiry" form that emails the office in plain text. Exposure: provincial privacy commissioner complaint; HIPAA breach notification at $50k–$1.5M civil-penalty range. |
| P4 | Booking-link rot | The Jane / Ocean / Tia link broke 4 months ago; the office didn't notice; the patient who couldn't book went to a competitor. Lost-LTV-per-patient is real. |
| P5 | CPSO / state-board advertising-policy violation | Site claims "best family doctor in Hamilton" — CPSO Policy on Advertising prohibits comparative superiority claims (CPSO Policy #2-16 / verify current revision). Investigation triggered by competitor or patient complaint. |
| P6 | Outdated post-COVID telehealth presentation | Site still says "in-person only" or "telehealth temporarily unavailable due to COVID." Patient assumes the practice doesn't offer telehealth and goes to Maple / Felix / Rocket Doctor / Teladoc / Amwell. |
| P7 | Reviews skew negative because nobody asks happy patients | 70% of the 4 reviews are 1-star; the 4,000 happy patients never left a review. Local-pack ranking decays; new-patient inquiries decline. |
| P8 | Vendor cannot be reached | The 2019 vendor pivoted, was acquired, or just won't answer. The practice owns the domain (sometimes), the hosting account (sometimes), the code (rarely). Migration cost is hidden. |
| P9 | Privacy-officer concerns about third-party trackers | Older sites carry Facebook Pixel, Google Analytics, Hotjar — all with potential PHIPA/HIPAA implications when patients arrive from a Google search "anxiety symptoms." |
| P10 | Mobile-edit impossible | Office manager wants to update hours from her phone Saturday morning — "the site is locked behind a desktop CMS." |

---

## §8 — How Lumivara Forge mitigates each risk

One-to-one with §7. This is the discovery-call follow-up email after the second call.

| # | Mitigation |
|---|---|
| P1 → M1 | Phone-edit + monthly improvement run = stale clinical info corrected within 24 hours of the physician noticing it. |
| P2 → M2 | axe-core + Lighthouse in CI; build fails if a11y regresses. Documented for the compliance officer (T3 compliance dashboard). |
| P3 → M3 | Form architecture deliberately rejects PHI capture; auto-redirects clinical questions to the booking system; PHIPA / HIPAA-aware copy on every form. Add-on for full HIPAA-compliant intake (BAA-eligible vendor). |
| P4 → M4 | Booking-link health-check workflow runs nightly; broken link = automatic GitHub issue + operator email. Resolution time: same business day on T2. |
| P5 → M5 | CPSO / state-board advertising-policy lint as a content review step in the operator playbook (`../06-operator-rebuild-prompt-v3.md` — add a vertical-specific lint pass for medical practices). |
| P6 → M6 | Telehealth landing page included by default for any post-2024 medical-vertical engagement; deep-links the practice's existing telehealth provider. |
| P7 → M7 | Review-solicitation add-on (Resend workflow); 4–6× lift in monthly review volume in the first quarter ([OE]; not a vendor-stat we can quote externally). |
| P8 → M8 | Dual-Lane Repo (`../02b-dual-lane-architecture.md`) — domain, code, and hosting in the client's name from day one. If we are ever unreachable, the client keeps a running site with a real Next.js codebase they can hand to any developer. |
| P9 → M9 | Cookie / consent banner add-on (CAD $250); analytics by default goes through Vercel Analytics or Plausible (no third-party trackers). |
| P10 → M10 | Phone-edit pipeline is the explicit core mechanic. The office manager's Saturday-morning hours update is a 30-second tap, not a Monday-morning phone call. |

---

## §9 — Regulator-of-record

This vertical's *single most underweighted* selling angle is the regulator. Doctors care about the regulator because the regulator can suspend their licence; nothing else has that property. Names below are operator-internal; on a discovery call, name only the regulator that actually applies to the prospect's province / state.

**Ontario (primary territory).**
- **CPSO — College of Physicians and Surgeons of Ontario.** Policies of immediate web-relevance: *Policy on Advertising* (#2-16; verify current revision against the CPSO website at the time of pitch), *Practice Management Considerations for Physicians*, *Closing a Medical Practice*. CPSO can issue a caution, a remedial agreement, or a public referral to discipline.
- **AODA — Accessibility for Ontarians with Disabilities Act, 2005.** *Integrated Accessibility Standards Regulation* (O. Reg. 191/11) requires WCAG 2.0 Level AA for all *new* internet websites for organisations of 50+ employees. A small clinic typically falls under the customer-service standard — but multi-physician practices crossing 50-staff (FHTs at scale) are squarely in WCAG-AA territory. Penalties: up to $100,000/day for corporations, $50,000/day for individuals (Director). Enforcement is rare but real.
- **PHIPA — Personal Health Information Protection Act, 2004.** Ontario's IPC (Information and Privacy Commissioner) is the regulator. Patient-facing forms that capture health information are within scope. Notification thresholds — see [`../../research/07-pipeda-breach-notification.md`](../../research/07-pipeda-breach-notification.md) for the cross-walk to PIPEDA federal rules.

**Other Canadian provinces.**
- **CPSBC** (BC), **CPSA** (Alberta), **CMQ** (Quebec), **CPSNB / CPSNS** (Atlantic provinces) — provincial colleges; advertising-policy patterns are similar but not identical.
- **AMA** (Manitoba), **ASA** (Saskatchewan accessibility), provincial accessibility statutes vary in scope.

**United States.**
- **State medical boards** (e.g. NY State Board for Medicine, Medical Board of California, Texas Medical Board) — advertising / patient-solicitation policies vary; New York and California are the strictest on testimonials and superiority claims.
- **HIPAA** — Office for Civil Rights (OCR) at HHS is the federal regulator. Patient-facing intake / contact forms that capture PHI require BAA with the vendor.
- **ADA Title III** — DOJ + private right-of-action. 3,117 federal lawsuits filed in 2025 (`[V] §B-ADA-Lawsuits`); healthcare is consistently a top-3 sector.
- **State accessibility statutes** — Unruh Civil Rights Act (CA), NY Human Rights Law (NY) — augment federal ADA exposure.

The pitch sentence: *"Right now, your AODA / ADA compliance is a property of your office manager's memory. After we ship the site, it becomes a property of the build pipeline — every change is scanned automatically, and a regression fails the build before it can be published."*

---

## §10 — Why now

Three numbers that justify acting this quarter, not next year.

| # | Number | Source | Pitch use |
|---|---|---|---|
| W1 | **3,117 federal-court ADA-website lawsuits in 2025, +27% YoY** | `[V] §B-ADA-Lawsuits` | "The trend is up. The cost of being non-compliant is rising faster than the cost of being compliant." |
| W2 | **75% of consumers have abandoned an inquiry due to an outdated-looking site** | `[V] §B-Outdated-75` | "Three-quarters of the patients clicking through from Google and bouncing — they didn't switch to a competitor because of clinical reasons. They switched because your site read 'closed.'" |
| W3 | **~6.5 million Canadians (≈18% of adults) lack a family doctor (CIHI / OurCare 2024 estimates)** | [S] OurCare research / verify against CIHI 2025 update before quoting externally | "There has never been a better time to be discoverable. The waiting list is at the door — your site is the front desk." |

For US practices, swap W3 for the local-search-intent figure: 96% of adults with a non-emergency medical need start at a search engine ([S] healthcare-search aggregation; cross-walk to `[V] §B-Law-Firm-Spend` 96%-search-start figure as a directional analogue, footnote in deck).

---

## §11 — Why they should switch (selected R-reasons)

From `../../research/05-reasons-to-switch-to-lumivara-forge.md`. **Lead with R4, R1, R3.** Footnote R5. **Never use all seven.**

- **R4 — Cap the legal-liability surface.** Compliance becomes a property of the system, not a discretionary item. This is the *only* angle that lands hard with the physician-as-buyer; lead with it.
- **R1 — Stop the silent decay.** 75% / `[V] §B-Outdated-75` lands cleanly here; the practice's own staff have been embarrassed by the site for months.
- **R3 — Stop being your own webmaster.** The office manager has been trying to be the developer. We give her back ~2.5 hours/month of operator time (`docs/mothership/18 §4`). Owners feel this within 30 days.
- **R5 (footnote) — Own everything you paid for.** "If you cancel, you keep the site. We just stop the autopilot." Removes the lock-in fear most practices have from the 2019-vendor relationship.

**Do NOT lead with R6 or R7** in this vertical. R6 is a competitor-pricing argument that physicians don't have a frame for (DesignJoy is not a name on their radar). R7 is engineering-credibility framing that lands flat with clinical buyers.

---

## §12 — Benefits (top 3)

Ranked. The top three carry the pitch; the rest are footnotes.

1. **The compliance officer stops asking.** AODA / ADA / PHIPA / HIPAA become properties of the build pipeline. The physician can show their lawyer a dated record of every accessibility scan, every content change, every privacy review. That is a substantively different artefact from "we hired Acme Web Design five years ago."
2. **The office manager gets her Saturdays back.** Phone-edits from anywhere. Hours, locum-coverage windows, holiday closures — all updated in 30 seconds. The "I'll send Karen to update it Monday" reflex disappears.
3. **The practice gets discoverable again.** Structured `MedicalClinic` + `Physician` JSON-LD; Google Business Profile aligned with site content; review-collection workflow that lifts the local-pack 3-pack ranking within 90 days ([OE] timing, validate per-engagement).

Subordinate benefits (mention if asked, do not lead):
- A real Next.js codebase the practice owns; future-developer-friendly.
- Patient-education content cadence becomes possible; brand voice strengthens over time.
- Telehealth funnel captures intent that currently bleeds to Maple / Felix / Rocket Doctor / Teladoc.

---

## §13 — Financial analysis & cost-benefit

The slide that closes the deal. Anchor the call here.

### Current spend (typical Canadian primary-care practice, 1–4 physicians)

| Line item | Annual spend (CAD) | Source |
|---|---|---|
| Existing site annual maintenance + ad-hoc edits ($150–$300 × 6–12 invoices/yr) | $1,800 – $3,600 | `[S] §B-Boutique-Agency` |
| Hosting + domain (small site on legacy WP / Squarespace) | $250 – $700 | `[V] §B-Wix-Squarespace` |
| Reputation / review software (Birdeye / NiceJob / Solutionreach) | $1,800 – $4,800 | [S] vendor pricing pages, verify current |
| EMR integration / form vendor | $1,200 – $3,600 | [S] Ocean / Jane / NexHealth pricing tiers |
| AODA / ADA audit + remediation (one-off; recurring once flagged) | $2,000 – $6,000 | [OE]; verify against Siteimprove / Level Access pricing for the prospect |
| **Total annual outlay (status quo)** | **CAD $7,050 – $18,700/yr** | |

### Lumivara Forge T2 spend

| Line item | Cost (CAD) |
|---|---|
| One-time setup | $4,500 |
| Monthly retainer | $249 × 12 = $2,988/yr |
| Annual run-rate after Year 1 | $2,988/yr |
| 24-month total (Year 1 + Year 2 retainer) | $4,500 + $5,976 = **$10,476** |

### Headline arbitrage

| Metric | Status quo | Lumivara Forge T2 | Delta |
|---|---|---|---|
| Year-1 spend | $7,050 – $18,700 | $7,488 ($4,500 + $2,988 retainer) | -$0 to -$11,200 |
| Year-2 spend | $7,050 – $18,700 | $2,988 | **-$4,062 to -$15,712** |
| 24-month cumulative | $14,100 – $37,400 | $10,476 | **-$3,624 to -$26,924** |

### Single-client-acquired payback (the slide that closes physicians)

A new rostered patient in an FHO/FHN model is worth ~CAD $300–$450/year in capitation income to the practice ([S]; verify against the Ontario Ministry of Health's current capitation rates before quoting). Over the typical 7–10 year patient-lifetime, that is **CAD $2,100 – $4,500 in contribution per patient.**

| Outcome | Value |
|---|---|
| New rostered patients required to pay for full 24 months of T2 | **~3 patients (low end) to 5 patients (high end).** |
| Typical Lumivara Forge launch impact, conservative ([OE], validate per-engagement) | 8–15 incremental new-patient inquiries / year that close, after working booking + Google Business Profile + review-collection. |
| Implied 24-month ROI at the conservative end | **3–5× the entire engagement cost.** |
| Implied ROI if the single ADA-lawsuit avoidance is counted | Open-ended — typical settlement $25k–$75k USD per `[V] §B-ADA-Lawsuits` aggregations + adjacent UsableNet / Seyfarth reports. |

The pitch sentence: *"You need three to five new patients across two years to break even on the entire engagement. Anything beyond that — and the avoided legal exposure on day one — is upside."*

For US private-pay / DPC / concierge practices, swap rostered-patient capitation for membership-fee revenue ($1,500–$5,000/yr per patient is typical for DPC; concierge memberships run $2,500–$10,000+). Payback is faster — typically **1–2 patients** to break even over 24 months.

---

## §14 — Risks of switching + how we de-risk

Every prospect has these in their head; pre-empt them on the discovery call.

| Switching risk | The fear | How we de-risk |
|---|---|---|
| "What if you go out of business in year 2?" | Existential vendor risk. Real after a 2019-vendor experience. | Dual-Lane Repo (`../02b-dual-lane-architecture.md`). The domain, code, and hosting are in the client's name from day one. If we go away, the running site stays live. The autopilot stops; nothing else moves. |
| "What if your AI breaks something?" | Hallucination → patient-facing error. | Plan-then-Execute (the operator + AI present a written plan, the practice approves), Vercel preview, axe-core + Lighthouse CI gate, tap-to-publish. Zero changes go live without a human approval. (`D1` in `../../research/06-drawbacks-and-honest-risks.md`.) |
| "We tried Squarespace and it was a disaster" | The owner thinks DIY = pain. | Phone-edit replaces DIY; the owner never opens the desktop CMS. The pain they remember is the *work*, not the editing. We remove the work. |
| "Our existing site has 4 years of SEO equity — we can't risk losing rankings" | Migration risk. Ranks dropping after migration is a genuine pattern. | 301-redirect map at migration; sitemap submission to Google Search Console + Bing Webmaster; 30-day post-launch ranking-monitor. Where ranks slip, we patch within 7 days as part of the launch retainer. |
| "Our developer hosts our domain" | Vendor lock-in fear, often legitimate. | Migration setup add-on (CAD $400–$800) handles domain transfer + DNS update + email continuity. We'd rather absorb the cost than skip the step. |
| "We don't want patient data exposed" | PHIPA / HIPAA discipline, fully justified. | The default architecture *rejects* PHI capture on contact forms. Anything PHI-bearing routes through the practice's existing EMR / BAA-eligible vendor. We never become a covered entity. |
| "What about the office manager — will she figure it out?" | Adoption-drag fear (`D2`). | The 30-min onboarding call walks her through the phone shortcut in real-time. Multi-channel ingest (phone / web admin / email / SMS) — whichever channel she prefers, the pipeline accepts it. |

---

## §15 — Sales conversation flow (discovery → proposal → close)

Three-call structure. Each call has a fixed agenda and a fixed deliverable.

### Call 1 — Discovery (45 min, physician + office manager)

**Outcome:** confirm fit; agree on persona (P2); name the top three pain points; agree to a written proposal.

Fixed agenda:
1. **(10 min) "Walk me through how someone books an appointment with you today."** Note every break in the funnel — broken link, wrong hours, inaccessible booking flow, unsupported language.
2. **(10 min) "Walk me through the last three things you tried to change on the site."** Surface §3 P1 + P10 — the office manager's stale-content backlog.
3. **(10 min) "What does your compliance officer say about AODA / ADA / PHIPA / HIPAA?"** Surface §7 P2 / P3 / P9.
4. **(10 min) ROI math sketch — pick the top end of §13 and walk it through with their numbers.** Do not commit a price; commit a tier.
5. **(5 min) Close: "I'll send a one-pager tomorrow. Here's what we'll need from you to confirm the fit — domain registrar login (or screenshot), hosting login (or screenshot), and a list of any third-party booking tools."**

### Call 2 — Proposal walkthrough (30 min, physician decision-maker)

**Outcome:** signed Statement of Work; deposit invoice paid.

Fixed agenda:
1. **(5 min) Recap the three pain points from Call 1.**
2. **(10 min) Walk through the §13 ROI table with their actual numbers** (current spend in their hand from their bookkeeper).
3. **(10 min) Walk through the §14 risk-of-switching table** — pre-empt every objection.
4. **(5 min) Close: "Tier 2, $4,500 setup, $249/mo. Deposit is half of setup. I send you the SOW today. Sign returns within five business days; we kick off Day 1 of the next sprint."** No discount. If they balk, drop to T1; do not discount T2.

### Call 3 — Close + kickoff (20 min, physician + office manager)

**Outcome:** signed SOW; intake call scheduled; phone-edit shortcut installed on office manager's phone.

Fixed agenda:
1. **(5 min) Confirm SOW signature; confirm deposit payment.**
2. **(10 min) Schedule intake call (60 min) for content + integrations review.**
3. **(5 min) Office-manager phone-shortcut install. Live, in real time.**

---

## §16 — Objection handlers

The objections operator has actually heard from this vertical (or expects, flagged `[OE]` where evidence-of-encounter is operator-anticipated, not yet operator-validated). Add to this list after every call.

**O1. "We just spent $X on a redesign in 2022 — we can't afford another."**
> "Right. Two ways to look at it: First, what we deliver isn't a redesign, it's a maintenance pipeline that prevents the next 2022. Your '22 spend bought you a snapshot — ours buys you a process. Second, on the math: T2 over 24 months runs $10,476 against your current $7,050–$18,700/yr line items. If your current spend is at the high end, T2 is cheaper outright by year-2."

**O2. "We need our site to be HIPAA / PHIPA compliant — your AI sees patient data?"**
> "By design, no. Patient data lives in your EMR. The site never captures PHI on a contact form — clinical questions are auto-redirected to your booking system. The AI sees public marketing content (services list, hours, physician bios), not patient records. If you ever want a HIPAA-compliant intake, that's a specific add-on with a BAA-eligible vendor — we can scope it, but it's not in the default."

**O3. "We tried a chatbot in 2023 and it was a disaster."**
> "Agreed. We don't ship a public-facing AI chatbot. The AI is on the *operator side* — it helps the operator (us) ship your changes faster. Your patients see a normal website, exactly the same as if a senior developer had been on call all month."

**O4. "What about all the testimonials we have — those are gold."**
> "All migrated. We carry over every testimonial that complies with the CPSO advertising policy (no comparative superiority, no implication of regulated outcomes). Where a testimonial has language that the policy disallows, we flag it and you decide whether to edit or remove it. We never silently drop content."

**O5. "Our office manager isn't tech-savvy."**
> "She doesn't need to be. The phone-edit shortcut is one tap + a sentence ('Update Wednesday hours to 9-5'). It's easier than texting a contractor. We do the 30-minute install on her phone live during the kickoff call. If she ever prefers email, the pipeline accepts email too — same outcome." [`D2` in `../../research/06-drawbacks-and-honest-risks.md`.]

**O6. "Our last vendor charged $X — why are you more / less?"**
> *More:* "They charged you for the build and then walked away. We charge for the build *and* keep maintaining it — every month. Look at year-2: their cost is $0 plus surprise invoices; ours is $2,988 with no surprises and continuous improvement."
> *Less:* "We are smaller. We don't have an account-manager-plus-PM-plus-developer trio billing you their salary. The savings is the structural difference, not a discount."

**O7. "We don't have time to do an intake call."** [OE — operator anticipated.]
> "Intake is 45 minutes, with the office manager. After that, you (the physician) come in for 30 minutes on the proposal. If we can't make this work in those two slots, we shouldn't be working together — that ratio is the entire promise of the autopilot. The intake replaces the back-and-forth that would otherwise stretch over 4 weeks."

**O8. "Send me a quote and I'll think about it."** (the soft no)
> "I will. The thing I'd ask is: if the quote and the math work, what's the next step on your side — board approval, partner sign-off, anything else? I'd rather know now so I time the follow-up around your decision cycle, not random Tuesday."

---

## §17 — Sources & citations

Every load-bearing number traces back to [`../../research/03-source-bibliography.md`](../../research/03-source-bibliography.md) or carries an inline `[OE]` / `[S]` flag.

| Claim in this template | Anchor | State |
|---|---|---|
| 75% of consumers abandoned an inquiry due to outdated site | `§B-Outdated-75` | `[V]` |
| 3,117 federal-court ADA-website lawsuits in 2025; +27% YoY | `§B-ADA-Lawsuits` | `[V]` |
| 95.9% of WebAIM Million pages had WCAG failures (2024) | `§B-WebAIM` | `[V]` |
| Squarespace / Wix $17–$139/mo; $240–$600/yr | `§B-Wix-Squarespace` | `[V]` |
| Boutique agencies $6k–$12k upfront + $75–$150/hr edits | `§B-Boutique-Agency` | `[S]` |
| Headless architectures 50–70% faster load | `§B-Headless-Perf` | `[S]` |
| Only 36% of WordPress sites pass mobile Core Web Vitals | `§B-WP-CWV` | `[S]` |
| ~6.5M Canadians lack a family doctor | OurCare 2024 / CIHI 2025 — *not yet a row in `03`; add before externally quoting* | `[S]` |
| Capitation income $300–$450/yr per rostered patient (Ontario FHO/FHN) | Ontario MoH capitation schedules — *not yet a row in `03`* | `[S]` |
| Healthcare top-3 ADA target sector | UsableNet 2025 sector report — *add row before externally quoting* | `[S]` |
| Telehealth show-rate lift 25–40% over in-person | AHRQ / Doxy.me telehealth data — *not yet a row in `03`* | `[S]` |
| AODA WCAG 2.0 AA mandate; $50k–$100k/day penalties | O. Reg. 191/11; AODA s.21 — *add primary statute row to `03`* | `[V]` (statute text, not a research paper) |

**Operator follow-up** — file an issue tagged `area/research` to backfill `03-source-bibliography.md` with the four `[S]`-flagged rows above (OurCare, capitation, UsableNet sector, telehealth show-rate). Until those rows land, the `[S]` claims here are operator-internal only — never externally quoted on a deck or a proposal.

---

## §18 — Operator notes

What to watch for, what to never say, what to upsell after month 6.

**Never say.**
- "We can guarantee you'll rank #1 for 'family doctor in [city]'." Both the CPSO advertising policy and Google's own quality guidelines reject performance guarantees in this vertical. Promising a ranking is grounds for a CPSO complaint *and* a Google penalty.
- "Our AI writes your patient-education content." Physicians need to know that they (or a staff clinician) review every word before it ships. The AI assists; the clinician approves. Frame it that way every time.
- "We do HIPAA / PHIPA compliance." We help structure a system that supports compliance; we are not a compliance vendor. Their lawyer / privacy officer signs off on compliance, not us.

**Watch for.**
- A practice that wants a *full EMR replacement.* Out of scope; refer them to OSCAR, Accuro, Athena, Epic-LITE. We integrate with EMRs; we don't replace them.
- A practice that wants *patient portals with secure messaging.* Out of scope at T2; possible at T3 with explicit BAA-eligible vendor wiring. Set this expectation on Call 1 — it shapes pricing.
- A practice that has been *sued for ADA already.* The conversation pivots — they need a remediation report, not a build. Possible engagement, but the SOW shape is different (see `D5` mitigation in `../../research/06-drawbacks-and-honest-risks.md`).
- A practice with *>8 physicians* and a marketing manager. They're agency-shaped; T3 minimum, and even then we should question whether they're in our sweet spot.

**After month 6 — what to upsell.**
1. **Multi-language (T3 add-on).** By month 6 the office manager has data on which patient inquiries got lost in translation. Concrete pitch: "Let's add Mandarin / Spanish / French — your inquiry loss is sitting in the data."
2. **Review-collection (T2 add-on, CAD $250 setup + automated workflow).** First-quarter Google review volume is the leading indicator; if it's still ≤5/quarter at month 6, the upsell is automatic.
3. **EMR-integrated intake form (T3 add-on, CAD $300–$600).** By month 6 the office manager has filed enough manual PDFs that the ROI is visible to her without us having to argue it.
4. **Patient-education cadence (no fee, lift in retainer perceived value).** Ghost-write 2 articles/month from physician dictation; the long-tail SEO + brand-voice compounds. This is the retention move, not a new line item.

**Where the deal dies.**
- The senior physician signs but the office manager wasn't on Call 1. She blocks the kickoff. Mitigation: refuse to schedule Call 2 without the office manager confirmed for Call 3. This is the biggest predictable failure mode in this vertical.
- The practice insists on a per-edit billing model. Drop them. The unit economics don't work; we are explicit on this in `../../research/04-client-personas.md §A1`.
- The practice expects us to also handle their Google Ads / Meta Ads. We don't. Refer to a partner agency. Setting this boundary on Call 1 saves three weeks of misaligned scope on the build.

**Upsell cadence after month 12.**
- Month 12: T3 conversation if they have any of (multi-location, careers / hiring page, 2nd language, EMR-integrated intake).
- Month 18: refer-a-doctor program — our target P2 expansion is the prospect's own physician network. One referral within their FHT is more valuable than 50 cold prospects.
- Month 24: renew at index-adjusted retainer (`docs/storefront/02-pricing-tiers.md §When to raise prices`).

---

## §19 — Specific-target search heuristics (operator prospecting)

> _This section is **operator-only research scaffolding** — concrete heuristics for finding doctor-vertical prospects with deteriorated sites in Southern Ontario / GTA / Northeast US. We do not name and shame specific practices in this document; doing so risks defamation and operator-trust issues. Instead, the heuristics below tell the operator what to look for and which evaluation signals are load-bearing. The actual prospect names live in the operator's CRM, not in version control._

### Where to look (Southern Ontario priority)

1. **Health Quality Ontario primary-care directory** + **CPSO public register** (filter: family medicine, accepting new patients, GTA / Hamilton / Niagara / Waterloo). Cross-walk against:
2. **Google Business Profile local-3-pack** for "family doctor near me" in the prospect city. Practices in positions 4–10 of the local pack are the highest-yield — they are visible enough to know they're competing, low enough to feel pain.
3. **RateMDs Ontario** practices with an old-style provider-page website link (look for `<vendor>.ca/<practice-slug>` patterns common to legacy directory-builder vendors).
4. **Ontario Medical Association membership directory** — cross-reference against "site looks 2018" heuristics below.
5. **FHT (Family Health Team) public list** — Ontario MoH publishes this; FHTs at 5–25 staff are squarely P2.

### Where to look (US-Northeast secondary)

1. **State medical-board public licensee lists** (NY, NJ, MA, PA) with practice addresses.
2. **Healthgrades / Vitals / Zocdoc** — sort by review count *ascending* among Highly Rated practices; under-marketed practices are the ones who haven't asked for reviews.
3. **NPI registry** (US National Provider Identifier) — cross-walk to practice websites.

### Evaluation signals — "is this site in the displacement window?"

Score 1 point per `Yes`. **5+/10 = strong prospect; 7+/10 = priority outreach.**

```
[ ] Built before 2022 (look at the footer copyright year, or the
    Wayback Machine first-snapshot date)
[ ] Mobile Lighthouse score < 70 (operator runs a Lighthouse audit on
    the prospect's home page from the browser before the call)
[ ] axe DevTools shows ≥ 5 critical / serious accessibility issues
[ ] Booking link is broken or routes to a generic landing page
[ ] No structured data (no JSON-LD MedicalClinic / Physician schema)
[ ] Hours visible on site disagree with hours on Google Business Profile
[ ] Telehealth either not mentioned or mentioned as "during COVID"
[ ] Vendor name visible in footer ("Powered by <vendor>") — historically
    a tell that the practice does not own the domain or hosting
[ ] No new content (blog / clinic-announcements) in > 12 months
[ ] No SSL certificate / mixed-content warnings (rare in 2026 but still
    appears on some legacy WP installs)
```

### Vendor patterns historically dominant in this vertical

These are the *categories* of vendor whose clients become Lumivara Forge prospects. Naming the categories rather than naming individual companies keeps this doc defensible.

| Vendor pattern | Pitch they made (typical) | What they delivered | Why we differentiate |
|---|---|---|---|
| "Healthcare-specialist site builder" (US: ProSites / Officite-class; CA: regional) | Industry-specific templates, "your peers use us," monthly fee covers hosting + occasional updates | Templated site indistinguishable from 50 other practices; per-edit billing on top of monthly fee; SEO promises rarely measured | We are not a template; phone-edits are unlimited; client owns the code; SEO is a CI gate, not a pitch |
| Local "agency built our friend's clinic site" | Custom design, "we'll be here for you" | One-shot custom build, agency winds down or pivots, $200/edit, no maintenance cadence | We are a *retainer* by design, not a $X-up-front; Dual-Lane Repo means client doesn't depend on our continued existence |
| EMR-vendor "free site as part of your subscription" (Officite / Tebra-class US bundles, Telus Health legacy CA bundles) | "Bundled with your EMR," "no extra fee" | Lock-in to the EMR; site dies when the practice changes EMR; design constrained to vendor templates | We integrate with EMRs but never depend on them; client owns the code regardless of EMR choice |
| WordPress + a reputation-management upsell (Solutionreach / Birdeye / NiceJob class) | "Get more reviews, automated" | Reputation-tool subscription compounds on top of a WP site that itself is decaying | Review-collection is an add-on layered onto a maintained site, not a band-aid on an unmaintained one |
| DIY (Squarespace / Wix / Hostinger) | "Build it yourself, $17/mo" | Owner spends weekends fighting the editor; 71% spotted as DIY at first click (`[V] §B-Outdated-75`) | Phone-edit removes the "build it yourself" labour entirely |

### Past-vendor pitch differentiation (call script)

When the prospect names a past vendor, lean on this template:

> *"I'm familiar with <vendor pattern>. Their pitch to you in <year> was probably something like '<pitch>'. What you got was probably '<delivery>'. The thing they didn't tell you is that the maintenance side of it is where the value lives — and they priced that as a per-edit invoice because their cost model required it. We priced ours as a flat retainer because our cost model is built around AI-assisted maintenance — that's how we deliver unlimited phone-edits at $249/mo without going broke. The maintenance pipeline is the product, not the build."*

Do **not** name the vendor disparagingly on the call. Speak in patterns. The prospect typically completes the sentence themselves.

---

## §20 — Cross-references

- **Persona pack:** [`../../research/04-client-personas.md §P2`](../../research/04-client-personas.md)
- **Why-switch reasons:** [`../../research/05-reasons-to-switch-to-lumivara-forge.md §R4 §R1 §R3 §R5`](../../research/05-reasons-to-switch-to-lumivara-forge.md)
- **Honest drawbacks:** [`../../research/06-drawbacks-and-honest-risks.md §D1 §D2 §D5`](../../research/06-drawbacks-and-honest-risks.md)
- **PIPEDA breach-notification cross-walk:** [`../../research/07-pipeda-breach-notification.md`](../../research/07-pipeda-breach-notification.md)
- **Pricing tiers:** [`../../storefront/02-pricing-tiers.md`](../../storefront/02-pricing-tiers.md)
- **Cost analysis:** [`../../storefront/03-cost-analysis.md`](../../storefront/03-cost-analysis.md)
- **Source bibliography:** [`../../research/03-source-bibliography.md`](../../research/03-source-bibliography.md)
- **Engagement evidence log:** [`../19-engagement-evidence-log-template.md`](../19-engagement-evidence-log-template.md)
- **Prospective-client deck (P2 variant):** [`../../decks/04-prospective-client-deck.md`](../../decks/04-prospective-client-deck.md)
- **Sales-vertical index:** [`./00-INDEX.md`](./00-INDEX.md)

---

*Last updated: 2026-04-30 — initial Full publication. Operator follow-up: backfill the four `[S]`-flagged source rows in §17 before externally quoting any of OurCare, capitation, UsableNet, or telehealth-show-rate figures.*
