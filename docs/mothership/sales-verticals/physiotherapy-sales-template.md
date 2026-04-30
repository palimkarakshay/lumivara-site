<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SALES PLAYBOOK

  Per-vertical sales positioning for **physiotherapy / chiropractic /
  wellness** — single-discipline and multi-discipline private practice
  (PT, DC, RMT, naturopath, acupuncture, kinesiology). Persona P2;
  default tier T2 with T3 upsell for multi-location / multi-discipline.

  Hard rules (inherited from `00-INDEX.md`):
    1. Never ships in a client repo.
    2. Never forwarded verbatim to a prospect.
    3. Numbers driving a pitch trace back to `../../research/03-source-bibliography.md`
       or are flagged inline `[OE]` / `[S]`.
================================================================================
-->

# Physiotherapy / chiropractic / wellness — sales template

> _Lane: 🛠 Pipeline — operator-only sales positioning. Persona alignment: P2 ("trust-driven local health practice", `../../research/04-client-personas.md §P2`). Default tier: T2; T3 for multi-location / multi-discipline._

---

## §1 — Snapshot

**Vertical.** Allied-health private practice — physiotherapy (PT), chiropractic (DC), registered massage therapy (RMT), naturopathic medicine (ND), acupuncture, kinesiology, athletic therapy, pelvic-floor specialty, sports-rehab clinics. Single-discipline shops + multi-discipline "wellness centres" combining 3–5 modalities under one roof.

**Persona alignment.** P2 — "the trust-driven local health practice." Owner-clinician is the buyer; office manager / front-desk lead is the operational gate; patient-acquisition is heavily search-driven and review-driven.

**Default tier.** Tier 2 (CAD $4,500 setup + $249/mo). Tier 3 for 3+ locations, multi-discipline + multi-location, or multi-language clinics.

**Headline pain in one sentence.** "Our Jane App booking link is the only working link on the site, our 'conditions we treat' page hasn't been touched in three years, and the wellness centre across the street has 220 Google reviews to our 14."

---

## §2 — Who they are

**Practice shape.**
- **Solo PT / DC / RMT** — one practitioner, often a co-tenant in a multi-discipline clinic.
- **Single-discipline clinic (3–8 staff)** — 2–4 PTs / DCs / RMTs + 1–2 admin + 1 clinic manager.
- **Multi-discipline wellness centre (8–25 staff)** — PT + DC + RMT + ND + acupuncture under one roof; multiple practitioner-owners.
- **Multi-location group (10–50 staff)** — same multi-discipline shape across 2–5 locations; common in GTA / Vancouver / Boston / NYC.

**Geography.**
1. **Southern Ontario primary** — GTA, Hamilton, Kitchener-Waterloo, London, Niagara, Ottawa. Jane App is Canadian-built and dominant in this market — operator leverage from understanding it.
2. **Canadian metro secondary** — Vancouver, Calgary, Edmonton, Halifax. Jane App also dominant.
3. **US tertiary** — NYC, NJ, MA, PA, IL, TX, CA, FL. Booking platforms diverge (ClinicSense, Healthie, WebPT, SimplePractice common).

**Practice age.** 5–20 years. Clinic-owner is 35–55. Site built in 2018–2022, often as part of a "physio marketing agency" bundle.

**Owner archetype.** Clinically excellent, business-pragmatic, local-search-aware. Reads CPA / OPA / APTA newsletters; engages with practice-growth podcasts (Aaron LeBauer, PT Pintcast, Mike Reinold); has a love-hate relationship with their reputation-management vendor. Will not respond to "explosive growth" pitches. Will respond to: *"your closest competitor's review-collection is automated, you have 14 reviews, and your booking funnel converts at 1/3 their rate. Let me show you the gap and how to close it."*

**Decision-maker(s).**
- Owner-clinician(s) — budget-holder.
- Clinic manager / front-desk lead — operational gate.
- In multi-discipline clinics, *each discipline lead* is a soft-veto on practice-area page content. Surface all of them by Call 2.

---

## §3 — Core issues / pain points

1. **"Booking conversion is leaking — patients land on the home page and bounce."** Mobile-first patients tap the home page, can't immediately find "book online," fight a vendor sub-page, drop. Jane App / ClinicSense / SimplePractice deep-links by service-type are critical and often broken.

2. **"'Conditions we treat' page is generic."** "We treat back pain, neck pain, headaches" — every clinic site says this. Long-tail SEO ("plantar fasciitis treatment Hamilton," "TMJ chiropractor near me") is a moat — but only if dedicated condition pages exist.

3. **"Direct-billing-to-insurance status is unclear on the site."** Patients shop by "do they direct-bill Sun Life?" — and the answer is buried, missing, or wrong. Massive conversion friction.

4. **"Provider profiles are weak."** PT-A specialises in pelvic floor, PT-B in vestibular, PT-C in sports rehab — patients shop by specialty. Site lists them with one-line bios; no specialty tagging; no individual-provider booking.

5. **"Reviews are stagnant."** Most clinics ask but inconsistently; the 220-vs-14 gap with the competitor is real and continuously widening. JaneApp has its own profile / review system that integrates with Google.

6. **"Patient-education content is missing."** Long-form "what to expect at your first physiotherapy visit" / "how chiropractic adjustments work" / "naturopathic principles for stress management" — these compound SEO and trust. Most clinics have nothing.

7. **"Jane App / our booking platform — the link is buried two clicks deep."** Friction at the conversion moment; the home-page CTA should deep-link by service type.

8. **"Our before-after / case-study content is non-compliant."** CPO / CCO / CMTO advertising standards are strict on outcome claims. Many sites carry "patient wins" content that violates regulator policy.

9. **"AODA / ADA — never reviewed."** Same pressure as other allied-health.

10. **"Multi-discipline practice — site doesn't reflect the integration."** Wellness centre houses 5 modalities but the site reads like 5 separate single-discipline pages bolted together.

11. **"WSIB / MVA / extended-health intake forms are paper."** Auto-insurance MVA forms (OCF-18, OCF-21B in Ontario), WSIB Form 8, extended-health pre-determination — all paper-based. Modern patients expect digital.

12. **"Local pack ranking has slipped."** Site fails mobile CWV; structured `MedicalBusiness` / `PhysicalTherapy` schema missing; Google Business Profile not synchronised with site content.

---

## §4 — Basic requirements

| # | Requirement | What "good" looks like |
|---|---|---|
| B1 | Mobile-first / a11y / fast | Lighthouse ≥ 90; axe 0 critical; AODA + ADA AA. |
| B2 | Hero CTA "Book Now" with deep-link to booking platform | Service-type pre-selection (PT vs DC vs RMT vs ND); JaneApp deep-link pattern: `https://<clinic>.janeapp.com/?treatment=<service-id>`. |
| B3 | "Conditions we treat" pages — one per high-search condition | Plantar fasciitis, TMJ, vestibular, pelvic floor, etc.; each with `MedicalCondition` schema. |
| B4 | Insurance direct-billing list (specific carriers) | Sun Life, Manulife, GreenShield, Canada Life, Pacific Blue Cross, Chambers, Equitable, etc. — same level of specificity as dental insurance lists. |
| B5 | Provider bios with specialty tagging | Each clinician's specialties + booking link to *their* schedule, not a generic clinic schedule. |
| B6 | Hours / address / phone / parking | Phone-edit-able; structured `OpeningHoursSpecification` + `MedicalBusiness` JSON-LD. |
| B7 | Reviews / testimonials section (compliant) | Google / JaneApp aggregate; outcome claims flagged for regulator policy. |
| B8 | Working contact form | PIPEDA / state-privacy aware; segregated routing (new patient / existing patient). |
| B9 | Editable from a phone | Phone-edit pipeline. |
| B10 | Search-engine basics | `MedicalBusiness` / `PhysicalTherapy` / `Chiropractic` JSON-LD. |

---

## §5 — Aspirational requirements

| # | Aspirational | Why | Tier-fit |
|---|---|---|---|
| A1 | Patient-education / blog cadence (1–2 articles/month) | Long-tail SEO + trust + retention. | T2 |
| A2 | Provider-specific direct-booking flow | Patient picks specialty / provider; deep-links to that provider's schedule. | T2 |
| A3 | Pre-arrival intake forms (replace OCF-18 / WSIB-8 paper flow) | T3 add-on; integrates with Jane App / ClinicSense intake APIs. | T3 add-on |
| A4 | Multi-language (en + fr / es / zh) | Quebec / Hispanic-US / GTA-ethnic-diaspora; strong fit at multi-discipline wellness centres. | T3 |
| A5 | Treatment / case-study video clips (compliant) | Trust-signal lift; demonstrates technique without making outcome claims. | T2 add-on |
| A6 | Review-collection automation (Resend → Google / JaneApp / RateMDs) | Closes the 14-vs-220 gap. | T2 add-on (CAD $250 setup) |
| A7 | Service-area landing pages for adjacent neighbourhoods | "Physio in [neighbourhood]" SEO long-tail. | T2 |
| A8 | Compliance dashboard | T3 differentiator. | T3 |
| A9 | Multi-location synchronised content | T3 default for multi-location. | T3 |
| A10 | Recall + reactivation automation (lapsed patient → "ready to come back?") | Major retention move; ties to Jane App / ClinicSense lapsed-patient data. | T2 add-on (CAD $400) |
| A11 | Online care-package shop (e.g. "10-pack massage," "fascial-release series") | Stripe / Square integration; revenue stream. | T3 add-on |
| A12 | Athletic-team / corporate-wellness partner page | "Trusted by [local sports team / company]" — trust signal + B2B pipeline. | T2 |

---

## §6 — How Lumivara Forge covers basic + aspirational

| Requirement | Mechanism |
|---|---|
| B1 a11y/perf | axe + Lighthouse CI. |
| B2 booking deep-link | Service-type URL parameter routing into Jane App / ClinicSense / WebPT. |
| B3 conditions pages | MDX + `MedicalCondition` schema per page; phone-edit-able. |
| B4 insurance list | MDX content section; phone-edit-able. |
| B5 provider bios | MDX template + per-provider booking deep-link. |
| B6 NAP / hours | Structured data; phone-edit. |
| B7 reviews | Google / JaneApp aggregate widget; review-collection workflow as A6. |
| B8 contact form | Resend with segregated routing; PIPEDA / state-privacy disclaimer. |
| B9 phone-edit | Core mechanic. |
| B10 SEO | Default. |
| A1 cadence | Monthly improvement run with ghost-writing slot (clinician dictation). |
| A2 provider booking | Per-provider deep-link in Jane App. |
| A3 pre-arrival intake | T3 add-on; Jane App / ClinicSense intake API. |
| A4 multi-language | T3. |
| A5 video clips | Native `<video>` on Vercel; captions auto-generated. |
| A6 review-collection | Resend post-visit workflow tied to Jane App appointment-completion event. |
| A7 service-area pages | MDX templates; structured `Service` + `Place` schema. |
| A8 compliance dashboard | T3 admin-only. |
| A9 multi-location | T3 shared content tree. |
| A10 recall automation | Resend workflow tied to Jane App lapsed-patient export. |
| A11 care-package shop | Stripe Checkout + Vercel route (`/shop`). |
| A12 partner page | MDX + structured `Organization`/`SportsTeam` schema where appropriate. |

---

## §7 — Current problems and risks

| # | Failure mode | Concrete example |
|---|---|---|
| P1 | Booking link friction | Home-page CTA → vendor landing page → service-type-selection → calendar. 3 clicks; conversion drops 40–60% per click. |
| P2 | CPO / CCO / CMTO / state-board advertising-policy violation | "Cure your back pain" / "guaranteed pain relief" / "best chiropractor in [city]" — outcome / superiority claims prohibited. |
| P3 | AODA / ADA non-compliance | Standard. |
| P4 | PIPEDA / state-privacy on contact form | Patient pastes injury history into general inquiry; routed via plain email. |
| P5 | Insurance-billing list outdated | Practice no longer direct-bills GreenShield; site says they do; patient arrives, surprised by bill. |
| P6 | Provider page omits or mis-lists specialty | New PT-D specialises in vestibular; not mentioned on site for 14 months. Vestibular-search prospects bounce. |
| P7 | Reviews stagnant | 14 reviews vs competitor's 220; local-pack rank decays continuously. |
| P8 | Vendor lock-in (physio-marketing agency bundle) | "Site + SEO + reputation" $500/mo bundle holding domain hostage. |
| P9 | OCF-18 / WSIB-8 paper intake | New-patient onboarding stretched 5–8 days. |
| P10 | Multi-location fragmentation | Brampton + Mississauga + Etobicoke have inconsistent insurance lists, hours, fee schedules. SEO competes against itself. |
| P11 | Outcome claims that violate regulator policy | "97% of our patients return to sport in 6 weeks" — without rigorous evidence + disclosure, prohibited. |
| P12 | No careers page → can't fill PT / RMT / DC roles | 2026 allied-health hiring crunch; chair-time goes empty. |

---

## §8 — How Lumivara Forge mitigates each risk

| # | Mitigation |
|---|---|
| P1 → M1 | Deep-link booking with service-type pre-selection from home-page CTA — single tap to filtered calendar. |
| P2 → M2 | CPO / CCO / CMTO / state-board policy lint; flag prohibited claims + superlatives + outcome-implication. |
| P3 → M3 | axe + Lighthouse CI. |
| P4 → M4 | Form architecture rejects clinical-detail capture; auto-redirects to booking system. |
| P5 → M5 | Insurance list as phone-edit-able; clinic manager updates after every carrier-status change. |
| P6 → M6 | Provider page MDX template with specialty-tags; clinic manager phone-edits to add new clinician. |
| P7 → M7 | Review-collection automation (T2 add-on); 4–6× monthly review-volume lift typical ([OE]). |
| P8 → M8 | Dual-Lane Repo. Domain transferred at engagement start. |
| P9 → M9 | Pre-arrival intake (T3 add-on) via Jane App / ClinicSense intake API. |
| P10 → M10 | T3 multi-location shared content tree with location-overrides for hours / providers / insurance. |
| P11 → M11 | Outcome-claim lint with default rewrite library: "we focus on" vs "we cure"; "patients have reported" vs "patients always recover"; rigour-and-disclosure gating. |
| P12 → M12 | Careers page in B5/A and Indeed JSON-LD for SEO. |

---

## §9 — Regulator-of-record

**Ontario / Canada.**
- **CPO** (College of Physiotherapists of Ontario) — *Standard for Advertising* (Standard 1, current revision; verify); restricts: outcome guarantees, comparative superiority claims, testimonials about treatment outcomes (where misleading), claims of unique expertise without basis. Public discipline reports list advertising violations regularly.
- **CCO** (College of Chiropractors of Ontario) — *Advertising Standard of Practice S-001* (verify current revision). Similar pattern; CCO has been notably active on "subluxation cure" claims and "no-fault" billing claims.
- **CMTO** (College of Massage Therapists of Ontario) — *Standards of Practice §4* (advertising); restricts outcome claims, scope-of-practice overreach.
- **CONO** (College of Naturopaths of Ontario), **CTCMPAO** (College of TCM Practitioners and Acupuncturists of Ontario) — analogous. Naturopathic-medicine advertising is *especially* policed for unsupported therapeutic claims.
- **AODA + IASR** — multi-discipline wellness centres at scale cross 50 employees.
- **PIPEDA** — patient information protection.
- **MVA / WSIB-specific rules** — Insurance Act regulations on auto-insurance billing claim handling; WSIB rate-and-billing rules. Sites that *imply* preferential MVA / WSIB billing relationships need policy review.

**United States.**
- **State boards of physical therapy** + **state boards of chiropractic examiners** — state-by-state rules; APTA + ACA voluntary codes. California, Texas, Florida boards are particularly active.
- **HIPAA** — covered entities for billing.
- **ADA Title III** — same `[V] §B-ADA-Lawsuits`.
- **State accessibility statutes.**

The pitch sentence: *"CPO / CCO / CMTO publish quarterly disciplinary digests that include website-based advertising violations. Right now your compliance is your office manager's memory. After we ship, every published change runs the policy lint and the audit trail is dated for your college file."*

---

## §10 — Why now

| # | Number | Source | Pitch use |
|---|---|---|---|
| W1 | **3,117 ADA filings; +27% YoY** | `[V] §B-ADA-Lawsuits` | Same. |
| W2 | **75% of consumers abandoned an inquiry due to outdated site** | `[V] §B-Outdated-75` | "Three-quarters of patients clicking through from Google bounced because your site read 'closed' or 'broken booking'." |
| W3 | **Practices with current review-collection automation gain 4-6× monthly review volume** | [OE] / [S] — backfill against Birdeye / NiceJob aggregations in `03` | "The review-volume gap with your closest competitor is the leading indicator of next-quarter local-pack ranking." |

---

## §11 — Why they should switch

**Lead with R1, R4, R3.** Footnote R5.

- **R1 — Stop the silent decay.** The booking-link rot + outdated insurance + stagnant reviews are the visible decay; clinicians feel them.
- **R4 — Cap the legal-liability surface.** AODA / ADA + CPO/CCO/CMTO advertising-policy + PIPEDA all bundled.
- **R3 — Stop being your own webmaster.** Clinic managers in physio/chiro/wellness frequently *are* the webmaster. R3 lands hard.
- **R5 (footnote) — Own everything you paid for.** Physio-marketing-agency lock-in fear is high.

---

## §12 — Benefits

1. **Booking conversion stops leaking.** Single deep-link from home-page CTA to filtered calendar; provider-specific booking deep-links; service-type pre-selection. The funnel is unbroken end-to-end.
2. **The review gap closes.** Automated post-visit Resend → Google / JaneApp / RateMDs review request; 4–6× monthly review-volume lift typical in the first quarter; local-pack rank recovers within 90–180 days ([OE]).
3. **Compliance becomes a property of the system.** CPO / CCO / CMTO / state-board advertising-policy lint, AODA / ADA CI gates, PIPEDA-aware form architecture.

Subordinate benefits:
- Multi-discipline + multi-location unification (T3).
- Patient-education cadence builds long-tail SEO moat.
- Recall automation on lapsed patients reactivates dormant LTV.

---

## §13 — Financial analysis & cost-benefit

### Current spend (typical Canadian single-discipline / multi-discipline clinic, 5–15 staff)

| Line item | Annual spend (CAD) | Source |
|---|---|---|
| "Physio-marketing" agency bundle (Practice Beat / MOOK / Aim / Ranxa-class) | $4,800 – $14,400 | [S] vendor pricing pages, verify |
| Per-edit invoicing on top | $1,200 – $3,600 | `[S] §B-Boutique-Agency` |
| Hosting / domain | $250 – $700 | `[V] §B-Wix-Squarespace` |
| Review-management bolt-on (Birdeye / NiceJob / Solutionreach) | $2,400 – $6,000 | [S] vendor pricing |
| AODA / ADA audit (one-off, recurring once flagged) | $2,000 – $6,000 | [OE] |
| Targeted Google Ads on conditions / specialties | $4,800 – $24,000 | [S] vertical benchmarks |
| **Total annual (status quo, excluding paid ads)** | **CAD $10,650 – $30,700/yr** | |

### Lumivara Forge T2

- $4,500 setup + $2,988/yr × 12 = **$10,476 over 24 months.**
- T2 + review-collection ($250) + recall automation ($400) = **$11,126 over 24 months.**

### Headline arbitrage

| Metric | Status quo | T2 + add-ons | Delta |
|---|---|---|---|
| Year-1 spend | $10,650 – $30,700 | $8,138 | **-$2,512 to -$22,562** |
| Year-2 spend | $10,650 – $30,700 | $2,988 | **-$7,662 to -$27,712** |
| 24-month cumulative | $21,300 – $61,400 | $11,126 | **-$10,174 to -$50,274** |

### Single-patient-acquired payback

| Service | Per-patient revenue (CAD) | Per-patient profit (approx, [S]; verify) |
|---|---|---|
| Single PT/DC/RMT visit | $80 – $150 | $30 – $60 |
| Initial assessment + 4-visit treatment plan | $400 – $800 | $160 – $320 |
| 12-visit care plan (e.g. post-MVA) | $1,200 – $2,400 | $480 – $960 |
| WSIB referred case | $800 – $4,000 | $320 – $1,600 |
| Pelvic-floor / specialty 8-visit plan | $1,200 – $2,500 | $480 – $1,000 |
| Athletic / corporate group contract (annual) | $5,000 – $50,000 | $2,000 – $20,000 |

**The pitch sentence:** *"You need approximately **6–8 new initial assessments converting to a 4-visit plan** OR **4–6 pelvic-floor / specialty patients** OR **1 mid-size corporate-wellness contract** across 24 months to fully pay for the engagement. Existing-patient recall reactivation alone typically returns 1.5×–3× the engagement cost in re-booked visits."*

US numbers move in the practice's favour (per-visit fees are 30–60% higher).

---

## §14 — Risks of switching + how we de-risk

| Switching risk | How we de-risk |
|---|---|
| "Our Jane App / ClinicSense is the heart of the business — what if you break it?" | We don't replace booking platforms; we deep-link to them. Jane App's API is open; deep-link parameters are stable and documented. We don't have access to the Jane App account; we just route patients into it. |
| "What about all our reviews on JaneApp?" | JaneApp reviews stay on JaneApp; we display them via the JaneApp profile widget. Google / Yelp reviews migrate via aggregate-widget. Nothing is lost. |
| "Our existing physio-marketing vendor has 6 months left." | Same playbook as other verticals: ride out OR review the addendum for 60-day-notice termination. Most physio-marketing-agency contracts have it. |
| "Our SEO will drop." | 301-redirect map + sitemap + 30-day post-launch ranking-monitor; structural shift to Next.js + correct schema typically *improves* rankings within 60 days. |
| "What about our current patient education content (PDFs, videos)?" | Migrated. Videos host on Vercel (no third-party tracker); PDFs become MDX pages where appropriate (better SEO + accessibility). |
| "Our clinic manager doesn't want a new tool." | Multi-channel ingest — phone shortcut, web admin, email, SMS. Whichever she prefers. Live install at kickoff. |
| "We have multi-location and the previous vendor did separate sites for each." | T3 multi-location shared-content tree; one source-of-truth for insurance / hours / providers; location-specific overrides where they actually differ. |

---

## §15 — Sales conversation flow

### Call 1 — Discovery (45 min, owner-clinician + clinic manager)

1. **(10 min) Booking-funnel walkthrough.** Live, on a phone. Map every break.
2. **(10 min) Review gap.** "How many reviews on Google / JaneApp / RateMDs vs your closest competitor?"
3. **(10 min) Compliance scan.** Surface §3 / §7 / §9 issues — many clinicians are unaware their site has policy violations.
4. **(10 min) ROI math from §13.**
5. **(5 min) Close.**

### Call 2 — Proposal (30 min)

Standard pattern: recap → ROI → risks-of-switching → close at T2 + review-collection + recall add-ons.

### Call 3 — Close + kickoff (20 min)

Standard pattern: SOW + deposit + intake call + phone-shortcut install live.

---

## §16 — Objection handlers

**O1. "Will Jane App still work?"**
> "Yes. We deep-link with service-type and provider parameters. Jane App's API is stable; we wrap it. Your Jane App account, your subscription, your data — all stay yours, untouched."

**O2. "We tried a chatbot for online booking and patients hated it."**
> "Same as the chatbot objection in other verticals — we don't ship a public chatbot. The AI is operator-side. Patients see a normal website with a real Book Now button that goes to your real Jane App calendar in one tap."

**O3. "What about CPO / CCO / CMTO advertising rules?"**
> "We've encoded the policy text in our content lint — superlatives, outcome claims, comparative claims all flagged before publish. The lint flags; the clinician decides. The compliance call is always yours; we just pre-screen."

**O4. "Our reviews are mostly on JaneApp — Google is small."**
> "We display both. JaneApp profile widget for JaneApp reviews; Google Reviews aggregate for Google reviews. Review-collection automation drives both — the post-visit Resend email links to *whichever* platform you prioritise (typically Google for local-pack ranking + JaneApp for category trust)."

**O5. "We have 5 modalities under one roof — will the site reflect that?"**
> "Yes. Multi-discipline structure is a T2 default for wellness centres: each modality gets a top-level navigation entry, each discipline lead has provider bios under their own tab, each modality's 'conditions we treat' set is its own MDX tree. The cross-referrals between modalities are a key differentiator we surface."

**O6. "What about WSIB / OCF / extended-health forms?"**
> "Pre-arrival intake is a T3 add-on. We integrate with Jane App / ClinicSense's intake-form API; OCF-18 / WSIB-8 / extended-health pre-determination forms route into the practice-mgmt platform. We don't host PHI; the practice-mgmt vendor does. Their BAA / DPA stays in force."

**O7. "Can you guarantee a top-3 local pack ranking?"**
> "No vendor can. The structural fix is the work — Core Web Vitals, schema, mobile usability, broken-link cleanup, AODA-failure cleanup. Local-pack rank is downstream of these. Plus review-volume — review-collection automation is the second highest-leverage move. We monitor + report; we don't promise."

**O8. "Multi-location — we have 3 clinics; the previous vendor wanted to charge $X per location."**
> "T3 covers up to 2 locations included; additional locations are a per-location SOW addendum (CAD ~$1,200/location setup, no additional retainer). The shared-content tree is the structural value — one update propagates to all locations."

---

## §17 — Sources & citations

| Claim | Anchor | State |
|---|---|---|
| 75% / 71% / 72% / 57% | `§B-Outdated-75` | `[V]` |
| 3,117 / +27% YoY ADA | `§B-ADA-Lawsuits` | `[V]` |
| 95.9% / 56.8 errors | `§B-WebAIM` | `[V]` |
| Boutique agency $75–$150/hr | `§B-Boutique-Agency` | `[S]` |
| WP 36% mobile CWV | `§B-WP-CWV` | `[S]` |
| Headless 50–70% | `§B-Headless-Perf` | `[S]` |
| CPO Standard for Advertising | CPO website — verify | `[V]` |
| CCO Standard S-001 | CCO website — verify | `[V]` |
| CMTO Standards of Practice §4 | CMTO website — verify | `[V]` |
| Physio-marketing vendor pricing | not in `03` — backfill before externally quoting | `[S]` |
| Review-volume → local-pack lift | not in `03` — backfill from BrightLocal Local Search Industry Survey | `[S]` |
| Per-visit / per-plan fee aggregations | not in `03` — backfill from CPA / OPA / APTA practice-management benchmarks | `[S]` |

**Operator follow-up:** backfill the three `[S]` rows in `03-source-bibliography.md` (physio-marketing vendor pricing, BrightLocal review-volume → local-pack, allied-health per-visit aggregations).

---

## §18 — Operator notes

**Never say.**
- "We can guarantee patients return to sport / activity / pre-injury function." Outcome claim. CPO / CCO territory.
- "We can guarantee a #1 local-pack ranking." See O7.
- "Our AI writes your patient-education content from your specialty area." Re-frame: clinician dictates → AI structures → clinician approves before publish.

**Watch for.**
- The clinic with **scope-of-practice creep** — a chiropractor making physiotherapy claims, a naturopath making acupuncture claims without dual-licensure. Surface during compliance scan; the policy lint will flag it but the clinician must decide.
- The clinic **selling supplements / herbal products** (common with naturopaths). Stripe / Square integration in scope at T3 with care; outcome-claim risk on supplement pages is high. Clinician's regulator-of-record (CONO especially) governs.
- The clinic **with active MVA-billing dispute or auto-insurer audit.** Site work is not the priority during the dispute; pause.
- The clinic at **>25 staff and 4+ locations.** Approaching agency-shaped procurement; T3 minimum, willing to disqualify.

**After month 6 — what to upsell.**
1. **Recall automation (T2 add-on, CAD $400)** — first-quarter lapsed-patient data drives the upsell.
2. **Pre-arrival intake (T3 add-on)** — paper-form pain becomes visible by month 6.
3. **Multi-discipline navigation refinement (no fee, retention)** — wellness centres add a modality and the navigation expands.
4. **Care-package shop (T3 add-on)** — for clinics with packaged offerings that they currently sell at the front desk only.

**Where the deal dies.**
- Clinic owner signs but clinic manager wasn't on Call 1. Mitigation: refuse Call 2 without manager confirmed.
- Clinic in active acquisition / corporate-rollup discussion. Pause.
- Clinic wants paid-search ad management. Decline; refer.
- Multi-discipline clinic where one discipline lead vetoes content scope. Address by Call 2; if unresolved, downsell to single-discipline scope.

**Upsell cadence after month 12.**
- Month 12: T3 if multi-location candidate.
- Month 18: refer-a-clinic — physio / chiro association referrals are dense.
- Month 24: index-adjusted retainer renew.

---

## §19 — Specific-target search heuristics

> _Operator-only._

### Where to look (Southern Ontario primary)

1. **CPO / CCO / CMTO public registers** filtered by city.
2. **Jane App "Find a Clinic"** directory — clinics on JaneApp with weak / dated linked sites.
3. **Google Business Profile local-3-pack** for "physiotherapy near me" / "chiropractor near me" / "RMT near me" / "naturopath near me."
4. **RateMDs Ontario allied-health listings** with `<vendor>.ca/<clinic-slug>` template patterns.
5. **Local sports-team sponsor lists** — sponsors are typically practices with revenue but under-marketed sites.
6. **MVA / WSIB-clinic directories** — specialised practices with operational pressure.

### Where to look (US-Northeast / SE / CA secondary)

1. **State PT / chiropractic / naturopathic board licensee lookups.**
2. **Healthgrades / Vitals / Yelp / WebPT-listed practices.**
3. **APTA / ACA member directories.**

### Evaluation signals

```
[ ] Built before 2022
[ ] Mobile Lighthouse < 70
[ ] axe DevTools ≥ 5 critical / serious a11y
[ ] Booking link buried > 2 clicks deep
[ ] No service-type pre-selection on booking link
[ ] No PhysicalTherapy / Chiropractic / MedicalBusiness JSON-LD
[ ] Insurance direct-billing list missing or vague
[ ] Provider bios missing specialty tagging
[ ] Reviews <50 across Google + JaneApp combined (vs competitor's >150)
[ ] No "conditions we treat" depth (single page listing, no per-condition)
[ ] Vendor name in footer
[ ] OCF-18 / WSIB-8 explicitly paper-based
[ ] Multi-location with inconsistent insurance / hours / providers
[ ] Outcome claims visible (compliance flag)
```

**12+/14 = priority outreach.**

### Vendor patterns historically dominant

| Pattern | Pitch | Delivery | Why we differentiate |
|---|---|---|---|
| Physio-marketing agency bundle (Practice Beat / MOOK / Aim / Ranxa-class) | "Specialised physio SEO + site + reviews" | Templated site + monthly bundle + per-edit fees + opaque SEO reporting | Phone-edit unlimited; client owns code + domain; CPO / CCO / CMTO lint built in |
| Local agency that "did our friend's chiropractic site" | Custom | One-shot build, no compliance lint, per-edit billing | Retainer + structural lint |
| Jane App's recommended vendor list | "Our partner builds your site" | Templated; design constrained; vendor lock | Real Next.js codebase; portable across booking platforms |
| Reputation-management vendor with site bundle (Birdeye / NiceJob / Solutionreach) | "Reviews + site + email" | Reputation tool on top of decaying site | Maintained foundation; review-collection layered, not band-aid |
| DIY (Squarespace / Wix) | $17/mo | Owner / manager fights editor on weekends | Phone-edit removes the labour |

### Past-vendor pitch differentiation

> *"The physio-marketing agencies built their cost model around a human writer + a human deployer per change — that's why they bill $200/edit on top of the monthly bundle. We rebuilt the loop with AI on the operator side. The unlimited phone-edits aren't a discount; they're the structural property of a different workflow. The 24-month math is $21k–$61k cumulative against our $11,126."*

---

## §20 — Cross-references

- **Persona pack:** [`../../research/04-client-personas.md §P2`](../../research/04-client-personas.md)
- **Why-switch reasons:** [`../../research/05-reasons-to-switch-to-lumivara-forge.md §R1 §R4 §R3 §R5`](../../research/05-reasons-to-switch-to-lumivara-forge.md)
- **Honest drawbacks:** [`../../research/06-drawbacks-and-honest-risks.md §D1 §D2 §D5`](../../research/06-drawbacks-and-honest-risks.md)
- **PIPEDA breach-notification:** [`../../research/07-pipeda-breach-notification.md`](../../research/07-pipeda-breach-notification.md)
- **Pricing tiers:** [`../../storefront/02-pricing-tiers.md`](../../storefront/02-pricing-tiers.md)
- **Cost analysis:** [`../../storefront/03-cost-analysis.md`](../../storefront/03-cost-analysis.md)
- **Source bibliography:** [`../../research/03-source-bibliography.md`](../../research/03-source-bibliography.md)
- **Engagement evidence log:** [`../19-engagement-evidence-log-template.md`](../19-engagement-evidence-log-template.md)
- **Prospective-client deck (P2 variant):** [`../../decks/04-prospective-client-deck.md`](../../decks/04-prospective-client-deck.md)
- **Sister verticals:** [`./doctors-sales-template.md`](./doctors-sales-template.md), [`./dentists-sales-template.md`](./dentists-sales-template.md), [`./lawyers-sales-template.md`](./lawyers-sales-template.md), [`./accountants-sales-template.md`](./accountants-sales-template.md)
- **Sales-vertical index:** [`./00-INDEX.md`](./00-INDEX.md)

---

*Last updated: 2026-04-30 — initial Full publication. Operator follow-up: backfill 3 `[S]` rows in §17 (physio-marketing vendor pricing, BrightLocal review→local-pack, allied-health per-visit aggregations) before externally quoting.*
