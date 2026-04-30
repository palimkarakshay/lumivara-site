<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SALES PLAYBOOK

  Per-vertical sales positioning for **dentistry** — single-location and
  small-multi-location private practice (general dentistry, with paths into
  ortho / perio / endo / cosmetic / implant specialty). Persona P2; default
  tier T2 with T3 upsell for multi-op or specialty-focused practices.

  Hard rules (inherited from `00-INDEX.md`):
    1. Never ships in a client repo.
    2. Never forwarded verbatim to a prospect.
    3. Numbers driving a pitch trace back to `../../research/03-source-bibliography.md`
       or are flagged inline `[OE]` / `[S]`.
================================================================================
-->

# Dentists — single-op + small-multi-op sales template

> _Lane: 🛠 Pipeline — operator-only sales positioning. Persona alignment: P2 ("trust-driven local health practice", `../../research/04-client-personas.md §P2`). Default tier: T2; T3 for multi-op / multi-language / specialty._

---

## §1 — Snapshot

**Vertical.** Private dental practice — single-location general dentistry, 2–4 location group dentistry, single-specialty practices (orthodontics, periodontics, endodontics, oral surgery, cosmetic / implant centres). Independent ownership; not pitching DSO-owned practices (their procurement runs through a corporate vendor list).

**Persona alignment.** P2 — "the trust-driven local health practice." Owner-dentist is the buyer; office manager is the operational lead. Distinct from primary-care physicians: dental revenue is fee-for-service, so the website is more directly a revenue instrument.

**Default tier.** Tier 2 (CAD $4,500 setup + $249/mo). Tier 3 for multi-op (3+ locations), multi-language sites, or specialty practices that need a dedicated funnel (Invisalign, implants, sedation dentistry).

**Headline pain in one sentence.** "Our recall list is leaking patients, our Invisalign landing page hasn't been updated since 2021, and our office manager just spent four hours fixing a typo because the developer who built the site needs a five-business-day lead time for any change."

---

## §2 — Who they are

**Practice shape.**
- Single-location general dentistry: 1 owner-dentist + 1–2 associates + 2–4 hygienists + 2–4 dental assistants + 1 office manager + 2–3 admin / treatment coordinators. Total staff 8–15.
- Multi-op (2–4 locations): 4–8 dentists, 30–60 staff total. Operations partner + office manager-per-location.
- Specialty (perio, endo, ortho, OS, cosmetic): smaller staff (5–10) but higher-LTV procedures. Often operates referral-driven.

**Geography (Lumivara Forge prospecting priority).**
1. **Southern Ontario primary** — GTA, Hamilton, Kitchener-Waterloo, London, Niagara, Ottawa. Dense practice population; RCDSO advertising-standards leverage; warm-network sourcing.
2. **Canadian metro secondary** — Vancouver, Calgary, Edmonton, Halifax. Provincial dental-college rule variants per `§9`.
3. **US tertiary** — same Northeast / California / Florida ADA-litigation concentration as the doctors template; plus Texas, Arizona, Nevada (high cosmetic-dentistry concentration).

**Practice age.** 10–30 years in business. Owner-dentist is 35–60 years old. Site was last touched in 2018–2022 — frequently as part of a bundle with an old reputation-management contract.

**Owner archetype.** Clinically excellent, business-pragmatic, marketing-skeptical-but-spending. Reads JCDA / JADA / DOCS Education content; subscribes to the "Dental Town" / "Dental Hacks" / "ACE Dental Marketing" media circuit. Will not respond to "growth-hack your patient acquisition" cold copy. Will respond to: *"your existing dental-marketing vendor is selling you a templated site at $399/mo plus per-edit invoicing; let me show you the math against a flat retainer."*

**Decision-maker(s).**
- The owner-dentist is the budget holder.
- The **office manager** is the operational gate; if she dislikes the new workflow, the build will not stick.
- A second associate (in larger group practices) often has informal veto on visual / brand decisions — surface them by Call 2.

---

## §3 — Core issues / pain points

In approximately the order they surface on a discovery call:

1. **"Our Invisalign / implants / cosmetic landing page is stale."** The high-LTV procedures (Invisalign $5–8k, implants $4–6k per tooth, cosmetic veneers $1.5–3k per tooth, sedation packages) drive 30–50% of profit but 5% of the website word-count. Owner has not been able to refresh the procedure pages because each change requires a vendor invoice.

2. **"New-patient booking is broken or one-step-too-deep."** A patient lands on the home page, taps "Book", and is sent to a generic vendor calendar that doesn't filter by service type. Conversion drops 40–60% at every redirect ([S] booking-flow conversion aggregations; verify against NexHealth / LocalMed published case-study ranges).

3. **"Reviews are 4 years old and the office hasn't asked any patient since 2022."** The reputation-management subscription was cancelled when the office manager noticed it was $239/mo for "post-visit review-request emails" that were going to spam. The office hasn't replaced it. New-patient inquiries from Google decline ~10% each year as the local-pack rank slips.

4. **"Our hygienist recall is being eaten by competitors."** A patient who hasn't booked in 9–14 months gets a postcard or an email from the practice; meanwhile, two competing practices have automated recall + online booking and the patient has migrated. Lost-LTV per recalled-but-lost patient: $400–$1,200/yr in hygiene revenue alone.

5. **"Insurance information is wrong or missing."** Practice accepts Sun Life, Manulife, GreenShield, Canada Life, Pacific Blue Cross; the site lists only "most major insurers." Patients call to clarify; each call costs the front desk ~3 minutes; the unclear ones bounce.

6. **"Our website was built by our reputation-management vendor and we don't own the domain."** Frequent. The vendor charges $200–$400/mo as a bundle, holds the domain registration in their name, and migration off them costs an arbitrarily-priced "release fee" of $500–$3,000.

7. **"The site doesn't show off our team."** Old headshots from 2018; no associate added since 2022 has a bio page; no video of the office. Trust signal is weak.

8. **"We have an associate / hygienist hire we can't recruit because our careers page is a 4-year-old PDF."** Career page is the hidden second-funnel — dental practices compete intensely for hygienists in the post-2022 hiring crunch (`[S]` ADA / CDA workforce surveys; verify before quoting).

9. **"Compliance officer flagged AODA / ADA — we don't know what that means."** Same as the doctors vertical. Add: dental practices in Ontario are explicitly named in RCDSO communications about AODA-aligned websites.

10. **"Our patient-portal / forms link goes to a 404."** Open Dental / ClearDent / Dentrix patient portals are common; the site links to a portal URL that the practice migrated 18 months ago. New-patient intake fails silently.

---

## §4 — Basic requirements (table-stakes)

| # | Basic requirement | What "good" looks like |
|---|---|---|
| B1 | Mobile-first / accessible / fast | Lighthouse ≥ 90 mobile; axe-core 0 critical; AODA + ADA AA. |
| B2 | Hours / address / phone clearly visible | One-tap call/map; structured `OpeningHoursSpecification` + `Dentist` / `DentalClinic` JSON-LD. |
| B3 | Services list with separate landing for each high-LTV procedure | Invisalign, implants, cosmetic, sedation each get their own page with structured `MedicalProcedure` schema. |
| B4 | New-patient booking that filters by service type | Deep-link to NexHealth / LocalMed / Dentrix Online Booking with service pre-selected. |
| B5 | Insurance accepted list (specific named insurers, not "most insurers") | The 8–12 carriers the practice actually files for. |
| B6 | Team page with current bios + headshots | DDS / DMD credentials, RCDSO / state-board number, video clip optional. |
| B7 | Reviews aggregated and visible above the fold | Google / Yelp / Healthgrades / RateMDs aggregate; review-collection workflow ongoing. |
| B8 | Working contact form | PIPEDA / PHIPA / HIPAA-aware; no PHI capture by default. |
| B9 | Editable by office manager from her phone | Phone-edit pipeline — the differentiator. |
| B10 | Careers / hire-us page that recruits | Active hygienist / associate listings, application form, "why work here" page. |

---

## §5 — Aspirational requirements

| # | Aspirational | Why it lands | Tier-fit |
|---|---|---|---|
| A1 | Dedicated Invisalign / implants / cosmetic / sedation funnel pages | Each $1k of paid-search ad spend on these terms requires a high-conversion landing page; flat website pages convert at 1/3 the rate of a dedicated funnel ([S] dental-marketing funnel data; verify before quoting) | T2 |
| A2 | Recall + reactivation email automation linked to the website | A patient who clicks "I need a check-up" → routed to recall calendar with pre-selected hygienist | T2 add-on (CAD $400 setup) |
| A3 | Multi-language site (English + relevant: Mandarin/Cantonese/Punjabi/Spanish/French) | GTA dental patients expect bilingual front-of-house; site lagging is a trust gap | T3 |
| A4 | Treatment-tour videos (1–2 minute "your first visit," "what implant treatment looks like") | Massive trust lift; reduces same-day cancellation; differentiates against big-box and corporate ortho | T2 add-on |
| A5 | Online financing pre-qualification (PayBright, Affirm, CareCredit, Sunbit) integration | Reduces "I need to think about it" friction on $5k–$50k procedures | T3 add-on |
| A6 | New-patient welcome video personalised to the case (hygiene visit, ortho consult, implant consult) | Practice can record one of each; we wire the routing | T3 |
| A7 | Compliance dashboard (AODA / ADA / privacy review log) | T3 differentiator; compelling for owner-dentist with a litigation-conscious lawyer | T3 |
| A8 | Multi-op shared CMS — one source of truth for Brampton + Mississauga + Etobicoke locations | Avoids "the Brampton site says we accept GreenShield, the Mississauga site says we don't" | T3 |
| A9 | Hygiene recall SMS workflow tied to the site | A patient-side "click here to schedule recall" flow that doesn't dump them into the wrong vendor calendar | T2/T3 add-on |
| A10 | Career-page automation (open roles, application form, "what's it like to work here" page) | Recruiting hygienists is the #2 operational problem in 2026 dentistry | T2 |

---

## §6 — How Lumivara Forge covers basic + aspirational

| Requirement | Lumivara Forge mechanism |
|---|---|
| B1 mobile/a11y | axe + Lighthouse CI. |
| B2 hours / NAP | `Dentist` / `DentalClinic` JSON-LD; phone-edit hours updates. |
| B3 service pages | Each high-LTV procedure as its own MDX page with `MedicalProcedure` schema; phone-edit-able. |
| B4 booking filter | Deep-link with `?service=invisalign` style URL params into NexHealth / LocalMed / vendor calendar. |
| B5 insurance list | MDX content section, phone-edit-able. |
| B6 team page | MDX template; new associate bio added in 30 seconds via phone-edit. |
| B7 reviews | Google Reviews aggregate widget (privacy-respecting), monthly improvement-run keeps the badge fresh. |
| B8 contact form | Resend; PHIPA / HIPAA disclaimer; routing rules per service type. |
| B9 phone-edit | Core mechanic — unlimited at T2. |
| B10 careers page | MDX template + application form (Resend or Workable / Greenhouse webhook depending on practice scale). |
| A1 funnel pages | Procedure-specific landing pages with conversion-optimised structure; each one phone-edit-able. |
| A2 recall automation | Resend workflow tied to a "schedule recall" CTA; integrates with practice's PMS export. |
| A3 multi-language | T3 default. |
| A4 treatment-tour videos | Native `<video>` hosting on Vercel; captions auto-generated; no third-party tracker. |
| A5 financing pre-qualification | Embed PayBright / Sunbit / CareCredit widget; T3 add-on. |
| A6 personalised welcome video | Dynamic-route MDX with conditional video; T3. |
| A7 compliance dashboard | T3 admin-only `/compliance` page with axe + Lighthouse + content-change audit log. |
| A8 multi-op shared CMS | T3 — one source-of-truth content tree, locality-specific overrides. |
| A9 hygiene recall SMS | Resend-backed; T2 add-on. |
| A10 careers page | T2 default (already in B10); add Indeed Job Posting JSON-LD for SEO. |

---

## §7 — Current problems and risks

| # | Failure mode | Concrete example |
|---|---|---|
| P1 | Stale procedure / pricing pages | Invisalign page says "from $4,500" but the practice raised pricing to $5,800 18 months ago. Patient calls expecting the old price; conversation is awkward; conversion drops. |
| P2 | RCDSO / state-dental-board advertising-policy violation | Site claims "best dentist in Burlington" or shows before/after photos without consent + proper context. RCDSO complaint risk; `§9`. |
| P3 | AODA / ADA non-compliance | Same as doctors P2. Dentistry is *also* a top-3 ADA-Title-III sector ([S] UsableNet 2025 — backfill row before quoting externally). |
| P4 | PHIPA / HIPAA exposure on contact / new-patient form | Patient pastes full medical history into a "contact us" form; emailed in plain text. Same risk profile as doctors P3. |
| P5 | Booking link rot | Same as doctors P4. Dental practices are *worse* offenders here because the booking system is more often vendor-bundled. |
| P6 | Reputation-vendor lock-in | Practice signed a $400/mo "site + reviews + SEO" bundle in 2019. Domain is in vendor's name; cancelling forfeits 4 years of SEO equity. |
| P7 | Untransformed before-after photos | Photos uploaded directly from the camera; EXIF data attached; no consent log. Privacy + advertising-standards risk. |
| P8 | New-patient form goes nowhere | Lead from the form lands in the practice's general inbox; office manager misses it for 3 days; patient has booked elsewhere. |
| P9 | No careers page → can't recruit hygienists | 2026 hygienist shortage in Ontario / Quebec / many US states. Practice can't fill chair-time; revenue compresses. |
| P10 | Insurance list outdated → trust signal broken | "We accept Sun Life" but Sun Life cancelled the practice's preferred-provider status. Patient arrives, gets a surprise bill, leaves bad review. |
| P11 | Multi-op fragmentation | Three locations have three slightly different sites; phone numbers cross-listed; SEO competes against itself. |

---

## §8 — How Lumivara Forge mitigates each risk

| # | Mitigation |
|---|---|
| P1 → M1 | Phone-edit + monthly improvement run = procedure pages stay current within 24 hours. Content-cadence retention move at month 6+. |
| P2 → M2 | RCDSO / state-dental-board advertising-policy lint as a content-review step in the operator playbook. We pre-flag superlatives, comparative claims, before/after without consent log, and unsupported outcome claims. |
| P3 → M3 | axe + Lighthouse CI. Dashboard at T3. Same mitigation as doctors. |
| P4 → M4 | Form architecture rejects PHI capture by default. PHIPA/HIPAA-aware copy; clinical questions auto-redirect to booking system. |
| P5 → M5 | Nightly link-health workflow; broken booking link = automatic operator-alert + same-business-day fix. |
| P6 → M6 | Dual-Lane Repo. Domain is transferred to client at engagement start; we negotiate the transfer + DNS migration as part of setup (CAD $400–$800 add-on if needed). |
| P7 → M7 | Photo-asset workflow strips EXIF; consent-log template included; per-photo consent checkbox in the operator's intake form (operator-only artefact). |
| P8 → M8 | Resend-driven form routes to multiple inboxes + SMS notification to office manager. T2 includes 4-hour-business-hour priority response. |
| P9 → M9 | Careers page is in B10 default for dentistry T2. Indeed JSON-LD for SEO discoverability. |
| P10 → M10 | Insurance list as a phone-edit-able section; office manager updates after every policy change. |
| P11 → M11 | T3 multi-op shared-content tree with location-specific overrides. One change to the insurance list propagates to all locations. |

---

## §9 — Regulator-of-record

This vertical's regulatory pressure is *higher* than primary care because dental advertising is more aggressively regulated and dental insurance billing is more heavily contractually constrained.

**Ontario (primary territory).**
- **RCDSO — Royal College of Dental Surgeons of Ontario.** Standard of practice on advertising (verify current revision before quoting): prohibits comparative superiority, restricts before/after photo use without informed-consent record, restricts claims about treatment outcomes, requires identification of the regulated provider. RCDSO is *active* in advertising-policy enforcement — quarterly disciplinary digest is publicly published.
- **AODA + IASR (O. Reg. 191/11)** — same WCAG 2.0 AA requirement for new sites at organisations of 50+ employees; multi-op practices crossing 50 staff are squarely in scope. Penalties up to $100k/day corporate, $50k/day director.
- **PHIPA** — patient information protection. PHIPA's "circle of care" doctrine is narrower than HIPAA equivalents; patient-facing forms that capture even general health information must be designed with consent + retention rules.

**Other Canadian provinces.**
- Provincial dental colleges with similar advertising standards: ADA&C (Alberta), CDSBC (BC, now CDC), CDSS (Saskatchewan), MDA (Manitoba), ODQ (Quebec).
- Multilingual jurisdiction note: Quebec's Bill 96 expands French-language requirements for commercial communications; site must serve French content with equal prominence to English.

**United States.**
- **State dental boards** — dental advertising rules vary widely. New York's State Education Department, California Dental Board, Texas Dental Board are among the strictest. ADA's *Principles of Ethics and Code of Professional Conduct* §5 (Veracity) is widely adopted into state rules.
- **HIPAA** — Office for Civil Rights at HHS. Dental practices are covered entities. Breach notification thresholds same as doctors template.
- **ADA Title III** — Same 3,117-filings + 27% YoY (`[V] §B-ADA-Lawsuits`); healthcare top-3.
- **FTC consumer-protection** — false advertising claims around dental procedures (e.g. "permanent" whitening, "painless" implants) attract FTC attention.

The pitch sentence: *"RCDSO / your state board are publishing quarterly disciplinary updates that include website-based advertising violations. Right now, your compliance is your office manager remembering. After we ship, it's a property of the build pipeline — every published change is reviewed against the policy lint, and the audit trail is dated."*

---

## §10 — Why now

| # | Number | Source | Pitch use |
|---|---|---|---|
| W1 | **3,117 federal-court ADA-website lawsuits in 2025, +27% YoY** | `[V] §B-ADA-Lawsuits` | Same as doctors. Dentistry is in the top-3 sector cluster. |
| W2 | **75% of consumers abandoned an inquiry due to outdated site** | `[V] §B-Outdated-75` | "Three-quarters of patients clicking through from your Google ad and bouncing — they didn't bounce because of clinical reasons. Your site read 'closed.'" |
| W3 | **Dental practices spend 5–10% of gross revenue on marketing; ~30–40% on web + SEO ($15k–$45k/yr at $1M-rev practice)** | `[S] §B-Dental-Spend` | "Tier 2 ($249/mo + $4,500 setup) is 1/4 to 1/2 of what you already spend on web + SEO and you'd retire 2–3 line items." |

---

## §11 — Why they should switch

From `../../research/05-reasons-to-switch-to-lumivara-forge.md`. **Lead with R4, R1, R2.** Footnote R5.

- **R4 — Cap the legal-liability surface.** AODA / ADA / PHIPA / HIPAA / RCDSO advertising-policy compliance becomes a property of the pipeline. Highest-leverage angle for the owner-dentist.
- **R1 — Stop the silent decay.** Procedure pages stale 18 months are an active revenue leak. Phone-edit closes that gap.
- **R2 — Stop paying $200 per typo.** Reputation-management vendor bundles charge for every change after the build. The flat retainer math is ~$10,476 over 24 months versus $20k–$45k cumulative on the bundled-vendor model.
- **R5 (footnote) — Own everything you paid for.** Removes the domain-lock fear from the existing reputation-vendor relationship.

**Do NOT lead with R3** here — owner-dentists rarely identify as their own webmasters; the office manager does that work. R3 lands in the office-manager conversation on Call 3, not Call 1.

---

## §12 — Benefits

1. **The Invisalign / implants / cosmetic funnel actually converts.** Procedure-specific landing pages with current pricing, current consent-disclosed before/afters, working financing pre-qualification, and one-tap booking. The high-LTV procedures stop being a "site that mentions us" and become a proper funnel.
2. **Recall stops leaking.** A patient overdue 9–14 months gets one click to schedule recall on their phone — without arguing with a generic vendor calendar that doesn't filter by hygiene appointment type.
3. **The compliance officer stops asking.** RCDSO / state-board advertising-policy lint, AODA / ADA CI gates, PHIPA / HIPAA-aware form architecture, dated audit log. The owner-dentist can show their lawyer a record, not a vendor brochure.

Subordinate benefits:
- Careers / hygienist-recruiting page does its job.
- Multi-op / multi-language unification (T3).
- Site loads fast in a parking lot on a 4G phone (Core Web Vitals; `[S] §B-WP-CWV` baseline).

---

## §13 — Financial analysis & cost-benefit

### Current spend (typical Canadian single-location general dentistry, 1–2 dentists, ~$1M gross)

| Line item | Annual spend (CAD) | Source |
|---|---|---|
| "Reputation + site + SEO" bundled vendor (e.g. ProSites / DentalQore / Smile-Marketing-class) | $4,800 – $9,600 | [S] dental-marketing vendor pricing pages, verify current |
| Per-edit invoicing on top of bundle ($150–$300 × 6–12/yr) | $1,800 – $3,600 | `[S] §B-Boutique-Agency` |
| Hosting / domain (sometimes separate) | $250 – $700 | `[V] §B-Wix-Squarespace` |
| Booking-tool subscription (NexHealth / LocalMed) | $1,800 – $4,800 | [S] vendor pricing |
| Reputation-management bolt-on (Birdeye / NiceJob / Solutionreach) | $2,400 – $5,400 | [S] vendor pricing |
| Paid-search / Google Ads on Invisalign / implants / cosmetic terms | $6,000 – $24,000 | [S] dental-paid-search benchmarks; verify per-practice |
| AODA / ADA audit + remediation (one-off; recurring once flagged) | $2,000 – $6,000 | [OE] |
| **Total annual (status quo, excluding paid-ads)** | **CAD $11,050 – $30,100/yr** | |

The point of the line above is *not* that Lumivara Forge replaces paid ads; it's that the practice is already paying $11k–$30k/yr in *non-ad* digital marketing. Lumivara T2 is well below the bottom of that range and replaces 4 of the 6 line items above.

### Lumivara Forge T2 spend

Same as doctors: $4,500 setup + $2,988/yr retainer = **$10,476 over 24 months.**

T2 + recall-automation add-on (CAD $400 setup) + review-collection add-on (CAD $250 setup) = **$11,126 over 24 months** — still below the bottom of the status-quo range.

### Headline arbitrage

| Metric | Status quo | Lumivara Forge T2 + recall + reviews | Delta |
|---|---|---|---|
| Year-1 spend | $11,050 – $30,100 | $7,488 + $650 add-ons = $8,138 | **-$2,912 to -$21,962** |
| Year-2 spend | $11,050 – $30,100 | $2,988 | **-$8,062 to -$27,112** |
| 24-month cumulative | $22,100 – $60,200 | $11,126 | **-$10,974 to -$49,074** |

### Single-procedure-acquired payback (the slide that closes dentists)

Dentists understand procedure-LTV math instantly. Use these numbers:

| Procedure | Per-patient revenue | Per-patient profit (approx, [S] practice-management aggregates; verify) |
|---|---|---|
| Hygiene recall (1-year cycle) | $200 – $400 | $80 – $160 |
| Comprehensive new-patient + restorative | $1,500 – $4,500 | $600 – $1,800 |
| Invisalign | $4,500 – $8,000 | $1,800 – $3,200 |
| Single dental implant | $4,000 – $6,000 | $1,500 – $2,400 |
| Full-arch implant restoration | $25,000 – $45,000 | $10,000 – $18,000 |
| Cosmetic veneers (per arch) | $10,000 – $25,000 | $4,000 – $10,000 |

**The pitch sentence:** *"You need approximately **two new comprehensive patients** OR **one Invisalign case** OR **one single-implant case** across 24 months to fully pay for the engagement. The payback is even faster on a single full-arch case or a veneers case. Anything beyond that — including the avoided AODA / ADA legal exposure and the recall reactivations — is upside."*

For US private-pay practices, swap CAD for USD at parity-or-better; the numbers move toward the practice (US dental revenue per procedure is ~15–25% higher; acquisition costs ~similar).

---

## §14 — Risks of switching + how we de-risk

| Switching risk | How we de-risk |
|---|---|
| "What about our domain — our reputation vendor holds it" | Migration setup add-on; we do the registrar transfer + DNS migration + email continuity. We've architected the dual-lane Repo specifically so the client *owns the domain by month 1*, regardless of the prior vendor relationship. |
| "What if our SEO drops?" | 301-redirect map at migration; sitemap submission; 30-day post-launch ranking monitor. If specific procedure-page rankings slip, we patch within 7 days. The site is built on Next.js with explicit Core Web Vitals targets — the structural performance is a SEO *upgrade*, not a downgrade. |
| "Our reputation-management contract has 12 months left" | Two paths: (1) ride out the contract while we build in parallel, switch DNS at the renewal date — clean termination; (2) some vendor contracts have a 60-day-notice termination clause buried in the addendum — we review the contract on Call 1. |
| "What about HIPAA / PHIPA / our patient info" | Same as doctors O2: by design, no PHI on the site. Forms route clinical questions to the practice's existing PMS / booking system. We are not a covered entity; we don't become one. |
| "Our staff is allergic to new tools" | Phone-edit shortcut is one tap + a sentence. Easier than texting a contractor. We do the live install on the office manager's phone during the kickoff call. Multi-channel ingest if she prefers email / web admin. |
| "We have a custom thing the previous vendor built (animated tooth, 3D viewer, etc.)" | We migrate functional features 1:1 where possible. If a feature is hostage to a proprietary vendor framework, we replace with a Next.js-native equivalent (typically faster + accessible). Migration scope is set on Call 2. |
| "What about review-platform integrations?" | We integrate with Google / Yelp / Healthgrades / RateMDs for *display* (privacy-respecting widgets); review-collection workflow is a separate add-on tied to the practice's PMS export. We don't replace the practice's existing review-collection tool unless they ask. |

---

## §15 — Sales conversation flow

### Call 1 — Discovery (45 min, owner-dentist + office manager)

1. **(10 min) "Walk me through how a new patient finds you and books."** Map the funnel; flag every break.
2. **(10 min) "What does Invisalign / implants / cosmetic conversion look like — month over month?"** This is where the dollars are; surface the funnel-page weakness.
3. **(10 min) "What does your reputation-management vendor cost monthly? What's in the bundle?"** Surface the hidden $400/mo line item.
4. **(10 min) ROI math sketch from §13 with their actual numbers** (the practice's accountant has the line items).
5. **(5 min) Close: tier confirmation; document checklist; Call 2 scheduling.**

### Call 2 — Proposal (30 min, owner-dentist; office manager joining last 10 min)

1. **(5 min) Recap the three pain points.**
2. **(10 min) §13 ROI table with their numbers.**
3. **(10 min) §14 risk-of-switching walkthrough.**
4. **(5 min) Office-manager joins for workflow walkthrough.**
5. **(5 min) Close: SOW + deposit. T2 + recall + reviews add-ons quoted explicitly. No discount; downsell to T1 or T0 if budget objection.**

### Call 3 — Close + kickoff (20 min)

1. SOW signature confirmed; deposit confirmed.
2. Intake call (60 min) scheduled.
3. Phone-shortcut install on office manager's phone — live.

---

## §16 — Objection handlers

**O1. "We just paid $X for a redesign in 2022."**
> "Your '22 redesign was a one-shot snapshot; ours is a maintenance pipeline. The math: T2 over 24 months runs $10,476–$11,126 against your current $22k–$60k cumulative on bundled-vendor + per-edit + reputation-tool stack. The redesign sunk cost is real but not load-bearing — the real question is whether what you're paying *now* makes sense."

**O2. "The vendor that built our site also runs our SEO and reviews — we'd be unbundling something complicated."**
> "Yes. That's the point. The bundle is what's making it expensive and brittle. We replace the site + maintenance + a11y + a portion of SEO. We don't replace your PMS, your booking system, or your patient communication system — those stay yours. Your reputation-management can stay or go; we have an add-on that does the same work for $250 setup + the monthly retainer. Most practices retire it; some keep it for the analytics dashboard."

**O3. "What about all our before-and-afters?"**
> "Migrated, with a consent-log review. RCDSO / state-board advertising-policy requires a documented patient consent for every before-after used. Where you have consents, they ship. Where you don't — we flag and you decide. Most practices find this is the cleanest moment to refresh the gallery anyway."

**O4. "We tried a chatbot in 2023 and the patient response was negative."**
> Same as doctors O3 — we don't ship a public AI chatbot. The AI is operator-side. Your patients see a normal website; the AI helps the operator (us) ship your changes faster.

**O5. "Will our existing booking system / NexHealth / LocalMed / Dentrix online booking still work?"**
> "Yes — we deep-link into it. We don't replace booking systems; we wrap them. If your existing system is the friction point (e.g. it's served via a sub-vendor that's also bundling you), we can quote a replacement, but we won't push it."

**O6. "Can you guarantee a Google ranking?"**
> "No vendor can — and any vendor that does is misrepresenting Google's policies. What we *can* do is structurally fix the things that suppress your ranking: Core Web Vitals scores, schema markup, mobile usability, broken links, AODA / ADA-compliance failures (yes, Google penalises these). The structural fix is the work; the ranking improvement is the consequence."

**O7. "We're shopping a few vendors. Why you?"**
> "Three answers: (1) The retainer math — over 24 months we are 30–60% cheaper than the bundled vendors most practices use. (2) The phone-edit pipeline — you stop being your own webmaster. No other vendor in the dental space ships this in their default scope. (3) Dual-Lane Repo — your domain, your hosting, your code, in your name from day one. If we go away, your site stays. Most dental-marketing vendors structurally cannot offer this."

**O8. "We want to think about it." (the soft no)**
> Same script as doctors O8. Respect the cycle; ask what's the next step on their side; calendar a follow-up at the right horizon.

**O9. "We have multi-op locations — the previous vendor did a single site for all three."**
> "T3 covers multi-op explicitly. One source-of-truth content tree, location-specific overrides for hours / staff / insurance accepted, separate Google Business Profile per location. Most multi-op practices we see have *fragmentation* in their current setup — three slightly different sites, conflicting info — which is itself a SEO problem."

---

## §17 — Sources & citations

| Claim in this template | Anchor | State |
|---|---|---|
| 75% / 71% / 72% / 57% web-decay stats | `§B-Outdated-75` | `[V]` |
| 3,117 / +27% YoY ADA lawsuits | `§B-ADA-Lawsuits` | `[V]` |
| 95.9% / 56.8 errors WebAIM | `§B-WebAIM` | `[V]` |
| Boutique agency $75–$150/hr edits | `§B-Boutique-Agency` | `[S]` |
| Headless 50–70% load advantage | `§B-Headless-Perf` | `[S]` |
| WP 36% mobile CWV pass | `§B-WP-CWV` | `[S]` |
| Dental practices 5–10% revenue on marketing; 30–40% on web | `§B-Dental-Spend` | `[S]` |
| Dental-marketing-vendor pricing $4.8k–$9.6k/yr | not yet a row in `03` — backfill before quoting externally | `[S]` |
| Booking-flow conversion drops 40–60% per redirect | not yet a row in `03` (NexHealth / LocalMed published case studies) | `[S]` |
| Quebec Bill 96 French-language requirement | not in `03` (statute text); cite [Loi sur la langue officielle et commune du Québec, le français] in deck | `[V]` (statute, not a study) |
| AHRQ telehealth show-rate / ADA workforce shortage | not yet rows in `03`; backfill before quoting externally | `[S]` |
| Per-procedure dental revenue ranges | practice-management aggregates (DOCS Education / DSO benchmark reports); not yet a row in `03` | `[S]` |
| RCDSO standard of practice on advertising | RCDSO website, Standards section — verify current revision before quoting | `[V]` (regulator publication) |

**Operator follow-up:** file an `area/research` issue to backfill the four `[S]` rows in `03-source-bibliography.md`: dental-vendor pricing aggregation, booking-funnel conversion, AHRQ telehealth show-rate, ADA workforce-shortage signal.

---

## §18 — Operator notes

**Never say.**
- "We can guarantee #1 on 'dentist [city]'." Same as doctors. Compounds with RCDSO advertising rules.
- "Our AI does your reviews / writes your ad copy." Owner-dentists have a fine-tuned scepticism about AI-generated marketing copy — many have been burnt by a vendor's GPT-3.5-era spam-blog farm. Frame AI as operator-side leverage, not patient-facing automation.
- "We do dental SEO." We don't, in the agency sense; we do *site hygiene* that supports SEO. Lead-gen agencies own that lane and we don't compete.

**Watch for.**
- The practice with **>4 locations** and a regional-VP. They're DSO-shaped or about-to-DSO; their procurement runs through corporate. Disqualify or refer.
- The practice that wants **paid-search ad management.** Out of scope. Refer to a partner; we focus on the site as the conversion surface, not the ad spend.
- The practice with **a Yomi or Pearl AI radiology tool** in operatories. These are progressive practices; T3 fit, premium pricing, and our deal close-rate is high here (early adopter mindset).
- The practice with **a single 1-star review from a credible-sounding patient**. Don't rush — there's frequently a back-story (insurance dispute, outlier outcome). Audit before pitching review-collection automation; if the review is being held up on a board complaint, our work doesn't help.

**After month 6 — what to upsell.**
1. **Multi-op / multi-language (T3).** If the practice has been adding locations, the unification + multi-language pitch is a clean upsell.
2. **Procedure-funnel landing-page set (T2 add-on, $250–$500/page).** The owner-dentist sees the conversion data after 90 days of T2 and asks for a dedicated Invisalign / implants / sedation funnel.
3. **Compliance dashboard (T3).** RCDSO / state-board scrutiny + ADA litigation environment makes the dated audit log a compelling artefact at year-1 renewal.
4. **Recall + reactivation automation (T2 add-on).** First-year hygiene-recall gap is visible; the upsell is straightforward.

**Where the deal dies.**
- Owner-dentist signs but office manager wasn't on Call 1. Same as doctors — refuse to schedule Call 2 without office-manager confirmed for Call 3.
- Practice wants per-edit billing. Drop them per `04-client-personas.md §A1`.
- Practice expects us to also do paid-search / Meta ads. Decline; refer.
- Practice is in active acquisition / DSO transition. Pause; the buyer dictates vendor selection. We are not a fit during a transition.

**Upsell cadence after month 12.**
- Month 12: T3 conversation if multi-op or multi-language candidate.
- Month 18: refer-a-practice program. Owner-dentist's peer network is the highest-value referral source in this vertical.
- Month 24: index-adjusted retainer renew.

---

## §19 — Specific-target search heuristics (operator prospecting)

> _Operator-only research scaffolding. Names of specific practices live in the operator's CRM, not in this doc._

### Where to look (Southern Ontario priority)

1. **RCDSO public register** filtered by city / accepting-new-patients flag.
2. **Google Business Profile local-3-pack** for "dentist near me" — positions 4–10 are highest-yield (visible enough to feel competition, low enough to feel pain).
3. **Ontario Dental Association (ODA) member directory.**
4. **RateMDs / Healthgrades Canada** practices with a `<vendor>.ca/<practice-slug>` template-builder URL pattern.
5. **Google "intext: dentist invisalign Mississauga"** style searches to find practices that lead with high-LTV procedures but have weak procedure pages.

### Where to look (US-Northeast / Sun Belt secondary)

1. **State dental board licensee lists** — pull practices in target metros.
2. **Healthgrades / Vitals / Yelp** dentists with under-reviewed / under-marketed status; sort by review count ascending.
3. **NPI registry** for dentists by city.
4. **Google "intext: <city> implants" / "<city> Invisalign"** — same procedure-page-weakness pattern.

### Evaluation signals — "is this site in the displacement window?"

```
[ ] Built before 2022 (footer copyright; Wayback first-snapshot)
[ ] Mobile Lighthouse < 70
[ ] axe DevTools shows ≥ 5 critical / serious a11y issues
[ ] Booking link absent or broken
[ ] No Dentist / DentalClinic / MedicalProcedure JSON-LD
[ ] Hours visible on site disagree with Google Business Profile
[ ] Reputation-vendor footer ("Powered by <vendor>" / "Site by <vendor>")
[ ] No new content (blog / patient-education) in > 12 months
[ ] No careers / hire-us page (or page is a 4-year-old PDF)
[ ] No procedure-specific landing pages for Invisalign / implants /
    cosmetic / sedation
[ ] Domain WHOIS shows registrar locked to vendor's ownership
[ ] Insurance list outdated or missing (cross-walk on the call)
```

**12+/12 = priority outreach. 8+/12 = strong prospect.**

### Vendor patterns historically dominant in this vertical

| Vendor pattern | Pitch they made (typical) | What they delivered | Why we differentiate |
|---|---|---|---|
| Dental-specialist site-builder (ProSites / Officite-Tebra / DentalQore / Smile-Marketing-class) | "Industry-specialised templates," "all-in monthly fee," "your peers use us" | Templated site indistinguishable from ~50 peer practices; per-edit invoicing on top of monthly fee; SEO promises rarely measured; vendor often holds the domain | Phone-edit unlimited, no per-edit invoicing, client owns the domain + code from day one, RCDSO-policy lint built in |
| Local marketing agency that "also does dental" | Custom design, "we'll be here for you," portfolio of 3 dental sites | One-shot custom build; agency not actually staffed for ongoing dental advertising-policy compliance; per-edit billing high | Retainer by design; advertising-policy lint as a structural feature, not a vendor heroics |
| PMS-vendor bundled site (Dentrix / Eaglesoft / Open Dental / ClearDent partner ecosystems) | "Bundled with your PMS," "discounted" | Cookie-cutter site dies when the practice changes PMS; design constrained to the vendor's templates | We integrate with PMS but never depend on it; the site is portable across PMS changes |
| Reputation-management bundle (Birdeye / NiceJob / Solutionreach with a website included) | "Reviews + site + email — one bundle, $400/mo" | Reputation tool + a barely-maintained WordPress site decaying together; per-edit invoicing on the site | Review-collection as an add-on layered onto a maintained site; not a band-aid on an unmaintained one |
| DIY (Squarespace / Wix) | "Build it yourself, $17/mo" | Owner-dentist or office manager spends weekends fighting the editor; 71% spotted as DIY at first click | Phone-edit removes the labour entirely; the site doesn't read DIY |

### Past-vendor pitch differentiation (call script)

When the prospect names a past vendor, lean on the same template as doctors §19, with this specific add-on for dental:

> *"The dental-specialist vendors built their entire business model on charging $200–$400/edit, because their internal cost model assumed a human writer + a human deployer for every change. We rebuilt that loop with AI in the operator chair. Same human-in-the-loop on the publishing side — your office manager taps approve. The cost difference doesn't come from cutting corners; it comes from cutting cycles."*

---

## §20 — Cross-references

- **Persona pack:** [`../../research/04-client-personas.md §P2`](../../research/04-client-personas.md)
- **Why-switch reasons:** [`../../research/05-reasons-to-switch-to-lumivara-forge.md §R4 §R1 §R2 §R5`](../../research/05-reasons-to-switch-to-lumivara-forge.md)
- **Honest drawbacks:** [`../../research/06-drawbacks-and-honest-risks.md §D1 §D2 §D5`](../../research/06-drawbacks-and-honest-risks.md)
- **PIPEDA breach-notification cross-walk:** [`../../research/07-pipeda-breach-notification.md`](../../research/07-pipeda-breach-notification.md)
- **Pricing tiers:** [`../../storefront/02-pricing-tiers.md`](../../storefront/02-pricing-tiers.md)
- **Cost analysis:** [`../../storefront/03-cost-analysis.md`](../../storefront/03-cost-analysis.md)
- **Source bibliography:** [`../../research/03-source-bibliography.md`](../../research/03-source-bibliography.md)
- **Engagement evidence log:** [`../19-engagement-evidence-log-template.md`](../19-engagement-evidence-log-template.md)
- **Prospective-client deck (P2 variant):** [`../../decks/04-prospective-client-deck.md`](../../decks/04-prospective-client-deck.md)
- **Sister vertical (doctors):** [`./doctors-sales-template.md`](./doctors-sales-template.md)
- **Sales-vertical index:** [`./00-INDEX.md`](./00-INDEX.md)

---

*Last updated: 2026-04-30 — initial Full publication. Operator follow-up: backfill the four `[S]` rows in §17 (dental-vendor pricing, booking-funnel conversion, AHRQ telehealth show-rate, ADA workforce shortage) in `03-source-bibliography.md` before externally quoting.*
