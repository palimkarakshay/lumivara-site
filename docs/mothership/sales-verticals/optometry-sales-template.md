<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SALES PLAYBOOK

  Per-vertical sales positioning for **independent optometry** —
  single-OD and small group OD practices (2-5 doctors). Persona P2;
  default tier T2 with T3 upsell for multi-location / specialty / online
  optical retail.

  Hard rules (inherited from `00-INDEX.md`):
    1. Never ships in a client repo.
    2. Never forwarded verbatim to a prospect.
    3. Numbers driving a pitch trace back to `../../research/03-source-bibliography.md`
       or are flagged inline `[OE]` / `[S]`.
================================================================================
-->

# Optometry — independent OD practice sales template

> _Lane: 🛠 Pipeline — operator-only sales positioning. Persona alignment: P2 ("trust-driven local health practice", `../../research/04-client-personas.md §P2`). Default tier: T2; T3 for multi-location / specialty (vision therapy, low vision, sports vision) / multi-language._

---

## §1 — Snapshot

**Vertical.** Independent optometry — single-OD, 2–5 OD group practices, with attached optical dispensary. Specialty practices in scope: vision therapy, low vision, sports / performance vision, contact-lens specialty, paediatric optometry. **Out of scope:** corporate-retail-owned practices (LensCrafters / Pearle Vision / Costco Optical / Walmart Vision / Hakim / IRIS franchisees with corporate-vendor obligations) — their site strategy is dictated by parent.

**Persona alignment.** P2 — "the trust-driven local health practice." OD-owner is buyer; office manager / lead optician is the operational gate. Distinct mechanic from doctors/dentists: **optical retail revenue is a parallel funnel** — the website is a trust signal *and* a partial substitute for a window display.

**Default tier.** Tier 2 (CAD $4,500 setup + $249/mo). Tier 3 for 2+ locations, specialty practice, multi-language, or online optical retail (Stripe / Shopify-Lite frame previews).

**Headline pain in one sentence.** "Costco Optical opened up the road, our online frame display hasn't been updated since 2021, and we still can't tell a parent on our website that paediatric eye exams are OHIP-covered through age 19."

---

## §2 — Who they are

**Practice shape.**
- **Solo OD** — 1 OD + 1 optician + 1–2 admin. Small dispensary with 80–200 frames.
- **2–3 OD group** — 2–3 ODs + 2–4 opticians + 2–3 admin. Larger dispensary 200–500 frames.
- **4–5 OD group** — typical premium / specialty practice. Often a vision-therapy room, low-vision specialist, paediatric specialist.

**Geography.**
1. **Southern Ontario primary** — GTA, Hamilton, Niagara, Kitchener-Waterloo, London. Corporate-retail saturation is high in suburban Ontario; differentiation pressure on independents is acute.
2. **Canadian metro secondary** — Vancouver, Calgary, Edmonton, Halifax. Corporate competition similar.
3. **US tertiary** — NY, NJ, MA, PA, FL, TX, CA. VSP / EyeMed / Davis Vision insurance scope; ADA pressure same as other healthcare verticals.

**Practice age.** 12–35 years. OD-owner is 40–60. Site built 2017–2022, often through an optometry-vertical builder (Eyefinity, LocalEyeSite, MyEyeWeb, Studio2110-class).

**Owner archetype.** Clinically credentialed, retail-savvy (manages an inventory), competitive-against-corporate. Reads Optometry Times / Review of Optometry / CAO updates. Will not respond to "double your eye exams" copy. Will respond to: *"Costco Optical's online presence is materially better than yours, and the parent comparing you to them on her phone Saturday morning at 9am is making a 30-second decision. Let me show you the gap."*

**Decision-maker(s).**
- OD-owner is budget-holder.
- Lead optician (often a partner-equivalent in revenue contribution) has informal veto on optical-retail page direction.
- Office manager is the operational gate.

---

## §3 — Core issues / pain points

1. **"Our optical retail / frame display online is stale."** Practice carries 200–500 frames; the website shows ~30 from 2021. Patients shopping by frame brand (Maui Jim, Ray-Ban, Tom Ford, Oakley, Lindberg, BCBG) bounce when the catalogue is incomplete.

2. **"OHIP coverage explanations are missing or wrong."** Ontario covers annual eye exams for ages 0–19 and 65+; many sites either don't mention this or have it buried. Parents shopping for paediatric exams frequently don't know exams are free; they pick the practice that surfaces the answer cleanly.

3. **"Insurance directly-billed list is incomplete."** Same pattern as dental: Sun Life, Manulife, GreenShield, Canada Life, Pacific Blue Cross, Equitable, Chambers, Greenshield — the practice direct-bills 8–12; the site lists "most major insurers."

4. **"Booking link is buried or vendor-locked."** Same Jane App / NexHealth / RevolutionEHR / Eye Office deep-link friction as physio.

5. **"Website doesn't differentiate us from LensCrafters."** Corporate retail dominates the home-page-impression game; independent ODs need to surface their differentiators (longer exam appointments, OD's clinical specialties, frame brand depth) on the site.

6. **"Online frame retail — competitors are eating our optical revenue."** Warby Parker / Glasses USA / Zenni offer cheap frames with online prescription upload. Independent OD's optical revenue is under structural pressure; the website is the only digital response.

7. **"Children's eye exam page is missing or outdated."** Major missed opportunity: paediatric exams are the most-OHIP-covered service in Ontario optometry; a strong children's eye-exam landing page is a long-tail SEO + community-trust win.

8. **"Specialty pages (vision therapy, low vision, sports vision) are weak."** Specialty practices have invested in equipment (orthokeratology, vision therapy tools, low-vision aids) but the website doesn't reflect the depth.

9. **"Reviews are fewer than the corporate competitor."** Same dynamic as physio — corporate has more reviews; independent can close the gap with automation.

10. **"Online prescription / contact-lens reorder doesn't exist."** Contact-lens patients reorder; if the practice doesn't offer a digital reorder flow, they migrate to 1-800-Contacts / Hubble / Daysoft.

11. **"AODA / ADA — never reviewed."** Standard.

12. **"Corporate-tier polish — we look small next to the chains."** Independent practice's site reads 2018; competitor's reads 2026.

---

## §4 — Basic requirements

| # | Requirement | What "good" looks like |
|---|---|---|
| B1 | Mobile-first / a11y / fast | Lighthouse ≥ 90; axe 0 critical; AODA + ADA AA. |
| B2 | Hero CTA "Book Eye Exam" with deep-link | Service-type pre-selection (annual / paediatric / contact lens / specialty). |
| B3 | "Eye exams" page with insurance + OHIP coverage explanations | Paediatric ages 0–19, seniors 65+, private pay. |
| B4 | Optical retail / frames showcase | At minimum 60–120 frames with brand metadata; structured `Product` schema for SEO. |
| B5 | Contact-lens services + ordering / reorder flow | Reorder flow for existing patients; new-patient fitting CTA. |
| B6 | Doctor / OD bios with specialties | Each OD's specialties (paediatric, low-vision, vision therapy, contact-lens, sports vision, specialty contact lenses). |
| B7 | Hours / address / phone / parking | Phone-edit-able. |
| B8 | Insurance direct-billing list | Specific carriers named. |
| B9 | Reviews / testimonials (compliant) | Aggregate widget. |
| B10 | Working contact form | PIPEDA / state-privacy. |
| B11 | Editable from a phone | Phone-edit pipeline. |
| B12 | Search-engine basics | `OptometryClinic` / `Optometrist` / `Product` JSON-LD. |

---

## §5 — Aspirational requirements

| # | Aspirational | Why | Tier-fit |
|---|---|---|---|
| A1 | Online frame catalogue with full inventory + photo + brand metadata | Closes the Costco-vs-Warby visibility gap. | T3 |
| A2 | Online contact-lens reorder | Recovers retail revenue from 1-800-Contacts / Hubble. | T3 add-on (CAD $400–$800) |
| A3 | Patient-education / blog cadence (1–2 articles/month) | Long-tail SEO ("astigmatism contact lenses," "children's vision development"). | T2 |
| A4 | Specialty pages (vision therapy / low vision / sports vision) with depth | Differentiates from corporate retail. | T2 |
| A5 | Multi-language (en + fr / es / zh) | Quebec / Hispanic-US / GTA-ethnic. | T3 |
| A6 | Review-collection automation | Closes review gap with corporate competitors. | T2 add-on |
| A7 | Annual recall + reminder automation | Most patients don't book until reminded; LTV captured per recall. | T2 add-on |
| A8 | Compliance dashboard | T3 differentiator. | T3 |
| A9 | Multi-location synchronised content | T3. | T3 |
| A10 | Online frame try-on / virtual try-on tool | Frame.io / OptikamPad / Topcon Maestro 2 Camera integration; differentiates against Warby Parker's online try-on. | T3 add-on |
| A11 | Retail checkout (Stripe + Shopify-Lite for non-prescription products) | Revenue recovery for sunglasses + lens accessories. | T3 add-on |
| A12 | Membership / discount-club page (loyalty programme) | Retention move; common in independent optometry. | T2 |

---

## §6 — How Lumivara Forge covers basic + aspirational

| Requirement | Mechanism |
|---|---|
| B1–B12 | Pattern matches dental/physio template — `OptometryClinic` JSON-LD, `Product` schema for frames, phone-edit-able hours / insurance / fees. |
| A1 frame catalogue | T3 — MDX-driven catalogue with optional Shopify-Lite back-end; phone-edit-able for new arrivals. |
| A2 contact-lens reorder | T3 add-on; we wire to practice's existing CL reorder vendor (CooperVision Active Lifestyle, Vistakon Acuvue, B&L) or build a Stripe Checkout flow. |
| A3 cadence | Monthly improvement run with ghost-write slot from OD dictation. |
| A4 specialty pages | MDX templates per specialty with `MedicalSpecialty` schema. |
| A5 multi-language | T3. |
| A6 review-collection | Resend-driven workflow tied to PMS appointment-completion. |
| A7 recall automation | Resend workflow tied to annual-exam due date export. |
| A8 compliance dashboard | T3 admin-only. |
| A9 multi-location | T3 shared content tree. |
| A10 virtual try-on | T3 add-on; integrates with Frame.io / Topcon hardware. |
| A11 retail checkout | T3 add-on; Stripe + simple inventory. |
| A12 membership page | MDX + `MembershipProgram` schema. |

---

## §7 — Current problems and risks

| # | Failure mode | Concrete example |
|---|---|---|
| P1 | OHIP coverage explanation buried | Parent searches "kids eye exam Hamilton" — Costco-page surfaces clearly, independent-OD page doesn't mention OHIP at all. |
| P2 | COO / state-board advertising-policy violation | "Best optometrist in [city]" / "guaranteed contact lens comfort" / unsupported claims. |
| P3 | AODA / ADA non-compliance | Standard. |
| P4 | PIPEDA / state-privacy on intake form | New-patient form captures vision-history in plain text. |
| P5 | Frame catalogue staleness | 30 frames online, 250 in dispensary; patients see the gap. |
| P6 | Booking-link rot | Same as physio. |
| P7 | Reviews stagnant | 28 vs Costco's 800+. |
| P8 | No children's exam page | Misses parent-search market entirely. |
| P9 | Specialty under-presented | Vision therapy / low-vision room exists; site doesn't mention it. |
| P10 | Online optical retail leakage | Patients buy frames at Warby Parker / glasses online; practice loses retail revenue. |
| P11 | Contact-lens reorder leakage | Patients buy CL refills from 1-800-Contacts / Hubble. |
| P12 | Vendor lock-in (Eyefinity / LocalEyeSite / MyEyeWeb-class) | Site bundled with PMS or vertical-specific builder; domain in vendor's name. |
| P13 | Outcome / scope-of-practice claim violations | "Cure your dry eye" — outside scope unless properly framed. |

---

## §8 — How Lumivara Forge mitigates each risk

| # | Mitigation |
|---|---|
| P1 → M1 | Phone-edit-able OHIP-coverage section in the eye-exam page; dedicated children's eye-exam page. |
| P2 → M2 | COO / state-board advertising-policy lint. |
| P3 → M3 | axe + Lighthouse CI. |
| P4 → M4 | Form architecture rejects vision-history capture; routes clinical questions to PMS. |
| P5 → M5 | T3 frame catalogue with photo + brand metadata; phone-edit-able for new arrivals; lead optician adds frames in 30 seconds via phone shortcut. |
| P6 → M6 | Service-type pre-selected booking deep-link. |
| P7 → M7 | Review-collection automation (T2 add-on). |
| P8 → M8 | Children's eye-exam page in T2 default scope. |
| P9 → M9 | Specialty pages per discipline (T2 default). |
| P10 → M10 | T3 retail checkout for non-prescription products; T3 frame catalogue + virtual try-on as a competitive offering against Warby Parker's online flow. |
| P11 → M11 | T3 add-on contact-lens reorder integration. |
| P12 → M12 | Dual-Lane Repo. Domain transferred at engagement start. |
| P13 → M13 | Outcome / scope-of-practice lint with default rewrite library. |

---

## §9 — Regulator-of-record

**Ontario / Canada.**
- **College of Optometrists of Ontario (COO).** *Standards of Practice* — particularly Standard 14 (Advertising) and Standard 6 (Maintaining the Patient-Optometrist Relationship). Restricts: comparative claims, outcome guarantees, scope-of-practice overreach, "free eye exam" without conditions disclosed. **Verify current revision against the COO website at the time of pitch.**
- **Provincial colleges in other provinces:** BCAO (BC), Alberta College of Optometrists, COQ (Quebec), etc.
- **AODA + IASR** — multi-OD group practices with attached optical retail commonly cross 50 staff.
- **PIPEDA + provincial privacy.**
- **Quebec Bill 96** — French equal-prominence.
- **Ontario Pharmacy Act + Drug & Pharmacies Regulation Act** — interaction where OD prescribes therapeutic agents (TPA-certified ODs); advertising scope-of-practice considerations.

**United States.**
- **State Boards of Optometry** — state-specific advertising rules. California, Texas, New York are stricter.
- **AOA Code of Ethics** — voluntary, but adopted into many state-board rules.
- **FTC Eyeglass Rule + Contact Lens Rule** — federal consumer-protection rules. The Contact Lens Rule (Tinkler-Boozman Act) requires ODs to give patients their CL prescription automatically; advertising or website pages that obscure this duty are FTC-actionable.
- **HIPAA** — covered entity for billing.
- **ADA Title III** — same.

The pitch sentence: *"COO / your state board publishes disciplinary updates that include advertising violations. The FTC Contact Lens Rule has gotten more aggressive in the last 3 years on consumer-protection enforcement. Your compliance is your office manager's memory; ours is the build pipeline."*

---

## §10 — Why now

| # | Number | Source | Pitch use |
|---|---|---|---|
| W1 | **3,117 ADA filings; +27% YoY** | `[V] §B-ADA-Lawsuits` | Same. |
| W2 | **75% of consumers abandoned an inquiry due to outdated site** | `[V] §B-Outdated-75` | "Three-quarters of patients clicking through from Google bounced because your site looked smaller than the chain across the street." |
| W3 | **Online optical retail (Warby Parker, GlassesUSA, Zenni) holds 12-18% of the prescription-eyewear market and rising** | not in `03` — backfill from Vision Council Industry Report; flag `[S]` | "Every percentage point of online optical share is a percentage point of *your* dispensary revenue. The site is your structural defence." |

---

## §11 — Why they should switch

**Lead with R1, R6, R4.** Footnote R5.

- **R1 — Stop the silent decay.** Frame catalogue staleness, missing OHIP information, broken booking — visible decay.
- **R6 — Get DesignJoy-class agility at maintenance-tier prices.** Independent ODs are *competing against corporate retail's polish*; this is the only vertical where R6 lands as hard as in any boutique-firm context. Costco's site is professionally maintained; ours becomes equal-or-better at a fraction of the corporate-retail marketing cost.
- **R4 — Cap the legal-liability surface.** AODA / ADA + COO / state-board + FTC Contact Lens Rule + privacy.
- **R5 (footnote) — Own everything you paid for.** Eyefinity / LocalEyeSite-class domain lock-in fear.

**Do NOT lead with R2** as primary in this vertical; the per-edit fee structure is real but less weighty than the corporate-competition framing.

---

## §12 — Benefits

1. **You stop looking smaller than Costco.** Mobile-first, fast, accessible, deep-frame-catalogue, OHIP-clarity, polished specialty pages. The 30-second-Saturday-morning impression-management game flips.
2. **Optical retail revenue stops leaking online.** T3 frame catalogue + virtual try-on + retail checkout closes the Warby Parker gap on lifestyle frames; contact-lens reorder closes the 1-800-Contacts gap. Recovered retail revenue is direct margin.
3. **Compliance becomes the system.** COO / state-board / FTC Contact Lens Rule / AODA / ADA all baked into the build pipeline.

Subordinate benefits:
- Children's eye-exam page captures parent-search market.
- Specialty pages differentiate practice clinical depth.
- Recall automation captures annual-LTV at scale.

---

## §13 — Financial analysis & cost-benefit

### Current spend (typical Canadian single / 2-OD practice with attached optical, 6–12 staff)

| Line item | Annual spend (CAD) | Source |
|---|---|---|
| Optometry-vertical site builder (Eyefinity / LocalEyeSite / MyEyeWeb / Studio2110-class) | $1,800 – $5,400 | [S] vendor pricing pages, verify |
| Per-edit invoicing on top | $1,200 – $3,600 | `[S] §B-Boutique-Agency` |
| Hosting / domain | $250 – $700 | `[V] §B-Wix-Squarespace` |
| Reputation-management bolt-on | $1,800 – $4,800 | [S] vendor pricing |
| AODA / ADA audit (one-off; recurring once flagged) | $2,000 – $6,000 | [OE] |
| Targeted Google Ads on "eye exam [city]" / brand searches | $4,800 – $24,000 | [S] vertical benchmarks |
| Online frame catalogue / Shopify subscription if separate | $360 – $1,200 | [S] vendor pricing |
| **Total annual (status quo, excluding paid ads)** | **CAD $7,410 – $21,700/yr** | |

### Lumivara Forge

- **T2:** $4,500 setup + $2,988/yr × 12 = **$10,476 over 24 months.**
- **T2 + review-collection ($250) + recall ($400) = $11,126 over 24 months.**
- **T3** (multi-location or full retail catalogue): $7,500 setup + $7,188/yr = **$21,876 over 24 months.**

### Headline arbitrage (T2 base)

| Metric | Status quo | T2 + add-ons | Delta |
|---|---|---|---|
| Year-1 spend | $7,410 – $21,700 | $8,138 | **+$728 to -$13,562** |
| Year-2 spend | $7,410 – $21,700 | $2,988 | **-$4,422 to -$18,712** |
| 24-month cumulative | $14,820 – $43,400 | $11,126 | **-$3,694 to -$32,274** |

### Single-engagement-acquired payback

| Engagement | Per-patient revenue (CAD) | Per-patient profit (approx, [S]; verify) |
|---|---|---|
| Routine annual eye exam (private pay) | $110 – $250 | $50 – $120 |
| Paediatric eye exam (OHIP) | $40 – $80 (OHIP rate) | $15 – $30 |
| Contact-lens fitting + initial supply | $300 – $700 | $130 – $300 |
| Specialty CL fit (scleral / OrthoK) | $1,500 – $3,500 | $700 – $1,500 |
| Frames + lenses bundle (mid-tier) | $400 – $1,200 | $150 – $480 |
| Premium frames + lenses (Maui Jim / Tom Ford / progressive HD) | $800 – $2,500 | $320 – $1,000 |
| Annual lifetime customer retention (exam + frames + CL refills) | $500 – $1,500 | $200 – $600 |

**The pitch sentence:** *"You need approximately **15-25 frames-and-lenses bundles** OR **8-12 specialty CL fittings** OR **30 retained-and-recurring annual exam patients** across 24 months to fully pay for the engagement. The recovered retail revenue from a working frame catalogue and CL reorder typically clears the engagement within a single year for practices with $300k+ optical revenue."*

US numbers move in practice's favour (private-pay exam fees + optical retail margins are typically 30–60% higher).

---

## §14 — Risks of switching + how we de-risk

| Switching risk | How we de-risk |
|---|---|
| "Our PMS / Eyefinity / OfficeMate / Topcon — will it still work?" | We deep-link booking + integrate appointment data via the PMS's API where supported. We never replace the PMS; we wrap it. |
| "What about our frame inventory? Can we sync it automatically?" | T3 frame catalogue: optional sync from PMS/Inventory (where API supported) or manual operator-review-curated catalogue. Most independent ODs prefer curated (better merchandising) — sync is available if practice prefers. |
| "Online frame retail vs Warby Parker — we'll never compete on price." | Right. We compete on *clinical service + frame depth + virtual try-on of a curated lifestyle range*. Practices with curated catalogues + try-on consistently outperform on 30-day return ratios and customer LTV; we don't try to be Zenni. |
| "Our OD has a vision-therapy practice that doesn't fit on a generic site." | Specialty pages are T2 default. Vision-therapy + low-vision + paediatric + sports vision each get their own MDX page with structured `MedicalSpecialty` schema. |
| "Costco / LensCrafters has a national marketing budget — we can't catch up." | We don't out-spend; we out-rank locally. Local-pack ranking + reviews + Core Web Vitals + accurate insurance / OHIP info beats national-brand ads on long-tail patient-search intent. |
| "FTC Contact Lens Rule — does your AI know it?" | Yes. The compliance lint flags pages where CL fitting fees are quoted without the prescription-release disclosure, and where reorder flows could imply tying. The OD reviews flagged copy before publish. |
| "Our reviews are mostly on Google — we don't want to lose them." | Migrated. Aggregate widget displays current Google + Yelp + Healthgrades reviews; review-collection workflow drives more inbound. Nothing is lost. |

---

## §15 — Sales conversation flow

### Call 1 — Discovery (45 min, OD-owner + lead optician + office manager)

1. **(10 min) "Walk me through how a new patient finds you and books."** Map funnel.
2. **(10 min) "How much of your optical retail is leaking online?"** Surface §3 P10 / P11.
3. **(10 min) "Show me how your OHIP-coverage / paediatric-exam page reads."** Surface §3 P1, §7 P8.
4. **(10 min) ROI math from §13.**
5. **(5 min) Close.**

### Call 2 — Proposal (30 min) and Call 3 — Close (20 min)

Standard pattern.

---

## §16 — Objection handlers

**O1. "Will Eyefinity / OfficeMate / RevolutionEHR still work?"**
> "Yes — we deep-link booking and pull appointment confirmations via the PMS's API where supported. We don't replace your PMS; we wrap it. Your patient records, billing, and clinical data stay in the PMS and never touch our pipeline."

**O2. "Online frames — Warby Parker is a different business; we can't catch up."**
> "Agreed on price; disagree on funnel. Independent practices win on frame curation + try-on + clinical service. We're not building a Warby clone — we're displaying your curated lifestyle range with virtual try-on, structured product data for SEO, and a 'book to fit' CTA that bridges digital interest to in-store. Practices with curated catalogues consistently retain higher per-customer LTV than online-only sellers."

**O3. "What about FTC Contact Lens Rule and the prescription-release requirement?"**
> "Encoded in the policy lint — every CL fitting / reorder page is checked for the prescription-release disclosure. The lint flags; you decide. We've also built a default disclosure template so the language is policy-compliant on day one."

**O4. "Will paediatric exam OHIP coverage need explanation every time we update a fee?"**
> "Phone-edit covers it: any fee change updates the page in 30 seconds with the OHIP-disclosure block intact. The disclosure is structurally part of the page template — it can't be accidentally dropped."

**O5. "Can you guarantee a top-3 local pack ranking against Costco?"**
> "No. Costco has a national-brand SEO advantage that we won't fight. What we can do is structurally beat them on local long-tail searches — 'paediatric eye exam [neighbourhood],' 'low-vision specialist near me,' 'orthokeratology [city]' — where intent is specific and corporate retail has weaker copy. That's where independent practices win, and where we focus."

**O6. "Our reviews are mostly Yelp — we want to maintain those."**
> "Migrated and aggregated. Yelp + Google + Healthgrades all surface via the aggregate widget; review-collection automation drives new reviews to your highest-priority platform (typically Google for local-pack ranking)."

**O7. "Multi-location — we have 3 storefronts; previous vendor charged $X per location."**
> "T3 covers 2 locations included; additional are CAD ~$1,200/location setup. The shared content tree is the structural value."

**O8. "Our PMS vendor offers a website as part of their bundle — why not use that?"**
> "Three reasons: (1) PMS-bundled sites die when you migrate PMS — and we've seen that decision happen 3 times in the past 5 years across the field. (2) Design constraints on bundled sites are tight; you can't differentiate from peers using the same bundle. (3) You don't own the code; the vendor does. Dual-Lane Repo means your code and domain are yours from day one regardless of any future vendor change."

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
| COO Standards of Practice §6 + §14 | COO website — verify | `[V]` |
| AOA Code of Ethics | AOA website — verify | `[V]` |
| FTC Contact Lens Rule (Tinkler-Boozman) | FTC website / 16 CFR Part 315 — primary | `[V]` |
| FTC Eyeglass Rule | FTC website / 16 CFR Part 456 — primary | `[V]` |
| Optometry-vertical site builder pricing | not in `03` — backfill before externally quoting | `[S]` |
| Online optical retail share 12-18% and rising | not in `03` — backfill from Vision Council Industry Report | `[S]` |
| Per-engagement optometry fees | not in `03` — backfill from CAO / AOA / Vision Council practice-management benchmarks | `[S]` |

**Operator follow-up:** backfill the three `[S]` rows (optometry-vendor pricing, Vision Council online-retail share, optometry per-engagement fee aggregation) in `03-source-bibliography.md`.

---

## §18 — Operator notes

**Never say.**
- "We can guarantee 20/20 outcomes / contact-lens comfort / dry-eye relief." Outcome claims; COO / state-board territory.
- "Free eye exams." OHIP-covered for ages 0–19 and 65+ in Ontario, but the framing must include the conditions; "free" without context can mislead.
- "Our AI writes your patient-education content." Re-frame: OD dictates → AI structures → OD approves.
- "We do optometry SEO." We do site hygiene; SEO services are a separate vendor's lane.

**Watch for.**
- The practice owned by **a corporate retailer (LensCrafters / Pearle / EyeCare 1 franchisee)**. Often disqualified by parent contract.
- The practice with **>3 locations and a regional manager.** Approaching agency-shaped procurement.
- The practice in **active sale or partner-buyout**. Pause.
- The practice with **a vision-therapy specialty + outcome-claim history.** Particular care needed during compliance scan.
- The practice that wants **only the optical retail piece** (no clinical site). Possible at T3 with explicit Stripe + inventory scope.

**After month 6 — what to upsell.**
1. **Frame catalogue (T3 promotion or add-on).** Practice's optical revenue comparison after 6 months on T2 makes the upsell visible.
2. **Recall automation (T2 add-on).** Annual recall data drives the upsell.
3. **CL reorder integration (T3 add-on).** Recoverable retail-leakage cohort visible by month 9.
4. **Specialty page expansion (no fee, retention move).** New specialty equipment or new specialty hire triggers the page.

**Where the deal dies.**
- OD signs but office manager + lead optician weren't on Call 1. Mitigation: refuse Call 2 without all three confirmed for Call 3.
- Practice in active corporate-acquisition discussion. Pause.
- Practice wants paid-search ad management. Decline; refer.
- Practice expects a Warby-clone retail platform. Out of scope; refer to Shopify Plus + a dedicated dental/vision-retail Shopify partner.

**Upsell cadence after month 12.**
- Month 12: T3 if multi-location or full-retail-catalogue candidate.
- Month 18: refer-a-practice — CAO / OAO / AOA chapter networks are dense.
- Month 24: index-adjusted retainer renew.

---

## §19 — Specific-target search heuristics

> _Operator-only._

### Where to look (Southern Ontario primary)

1. **COO public registry** filtered by city.
2. **OAO (Ontario Association of Optometrists) member directory.**
3. **Google Business Profile local-3-pack** for "eye exam near me" / "optometrist near me" — positions 4–10 highest yield.
4. **"Find an OD" tools at major contact-lens manufacturers** (CooperVision, Vistakon, B&L) — practices listed are typically in-network for vision insurance.
5. **CAO / Vision Council member lists.**

### Where to look (US-Northeast / SE / CA secondary)

1. **State Board of Optometry licensee lookups.**
2. **AOA member directory.**
3. **VSP / EyeMed / Davis Vision provider lookup tools** — in-network ODs.

### Evaluation signals

```
[ ] Built before 2022
[ ] Mobile Lighthouse < 70
[ ] axe DevTools ≥ 5 critical / serious a11y
[ ] OHIP / vision-insurance coverage explanation buried or missing
[ ] Frame catalogue empty or <30 frames online
[ ] No paediatric eye-exam dedicated page
[ ] No specialty pages (vision therapy / low vision / sports vision)
[ ] Booking link buried > 2 clicks deep
[ ] No OptometryClinic / Optometrist / Product JSON-LD
[ ] Reviews <50 across Google + Yelp + Healthgrades combined
[ ] Vendor name in footer (Eyefinity / LocalEyeSite / MyEyeWeb-style)
[ ] No CL reorder flow (or flow goes to a 3rd-party 1-800-Contacts redirect)
[ ] FTC Contact Lens Rule disclosure missing on CL pages (US)
[ ] Outcome claims visible (compliance flag)
```

**12+/14 = priority outreach.**

### Vendor patterns historically dominant

| Pattern | Pitch | Delivery | Why we differentiate |
|---|---|---|---|
| Optometry-vertical site builder (Eyefinity / LocalEyeSite / MyEyeWeb / Studio2110 / EyeEcho-class) | "Industry-specialised templates" | Templated; per-edit fee on top; vendor often holds domain | Phone-edit unlimited; client owns code + domain; COO / FTC Contact Lens Rule lint built in |
| PMS-vendor bundled site (Eyefinity / OfficeMate / RevolutionEHR / Topcon partner ecosystem) | "Bundled with your PMS" | Cookie-cutter; design-constrained | Real Next.js codebase, portable across PMS changes |
| Local agency that "did our friend's optometry site" | Custom | One-shot build, no compliance lint | Retainer + structural lint |
| Reputation-management bundle | "Reviews + site + email" | Reputation tool on decaying site | Maintained foundation |
| DIY (Squarespace / Wix) | $17/mo | Owner / optician fights editor | Phone-edit removes labour |

### Past-vendor pitch differentiation

> *"The optometry-vertical builders priced on the assumption that ODs would pay for industry-specialisation; what they delivered was 1 of 3 templates. The math is the same as in dental: $1.8k–$5.4k/yr base + $1.2k–$3.6k per-edit = $11k–$36k cumulative over 24 months. T2 is $11,126. The unbundling is the disagreement; let me show you the 24-month math against your specific bundled-vendor cost."*

---

## §20 — Cross-references

- **Persona pack:** [`../../research/04-client-personas.md §P2`](../../research/04-client-personas.md)
- **Why-switch reasons:** [`../../research/05-reasons-to-switch-to-lumivara-forge.md §R1 §R6 §R4 §R5`](../../research/05-reasons-to-switch-to-lumivara-forge.md)
- **Honest drawbacks:** [`../../research/06-drawbacks-and-honest-risks.md §D1 §D2 §D5`](../../research/06-drawbacks-and-honest-risks.md)
- **PIPEDA breach-notification:** [`../../research/07-pipeda-breach-notification.md`](../../research/07-pipeda-breach-notification.md)
- **Pricing tiers:** [`../../storefront/02-pricing-tiers.md`](../../storefront/02-pricing-tiers.md)
- **Cost analysis:** [`../../storefront/03-cost-analysis.md`](../../storefront/03-cost-analysis.md)
- **Source bibliography:** [`../../research/03-source-bibliography.md`](../../research/03-source-bibliography.md)
- **Engagement evidence log:** [`../19-engagement-evidence-log-template.md`](../19-engagement-evidence-log-template.md)
- **Prospective-client deck (P2 variant):** [`../../decks/04-prospective-client-deck.md`](../../decks/04-prospective-client-deck.md)
- **Sister verticals:** [`./doctors-sales-template.md`](./doctors-sales-template.md), [`./dentists-sales-template.md`](./dentists-sales-template.md), [`./lawyers-sales-template.md`](./lawyers-sales-template.md), [`./accountants-sales-template.md`](./accountants-sales-template.md), [`./physiotherapy-sales-template.md`](./physiotherapy-sales-template.md)
- **Sales-vertical index:** [`./00-INDEX.md`](./00-INDEX.md)

---

*Last updated: 2026-04-30 — initial Full publication; closes the original sales-verticals folder seed (all six rows now Full). Operator follow-up: backfill 3 `[S]` rows in §17 (optometry-vendor pricing, Vision Council online-retail share, optometry per-engagement fees) before externally quoting.*
