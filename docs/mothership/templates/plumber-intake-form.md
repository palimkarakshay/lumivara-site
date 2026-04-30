<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY INTAKE FORM

  This is the operator's *internal* cribsheet for plumbing / trades clients.
  Do NOT send this filled form to the client. The client-facing intake
  is the trimmed dummy in `../07-client-handover-pack.md §3`.

  Workflow:
    1. Copy this file to the operator's mothership repo at
       `docs/clients/<slug>/intake.md`.
    2. Walk the client through the questions in a single intake call.
    3. Replace each `[CLIENT ANSWER]` placeholder with their answer.
    4. Feed the filled form into the prompts in `plumber-prompts.md`.

  Anything bracketed in CAPS (e.g. `[BUSINESS_NAME]`) is a token the
  prompts reference — keep the brackets so find-replace stays safe.
================================================================================
-->

# Plumbing / trades client — operator intake form

**Client slug (kebab-case):** `[CLIENT_SLUG]`
**Date of intake call:** `[YYYY-MM-DD]`
**Operator on call:** `[OPERATOR_NAME]`

> Fill answers inline below. If the client doesn't have an answer, write `[unknown — follow up]` rather than guessing — the prompts read these answers verbatim.

---

## §1. Business identity

- **Business name** (`[BUSINESS_NAME]`): [CLIENT ANSWER]
- **Owner first name** (`[OWNER_NAME]`): [CLIENT ANSWER]
- **Trade focus** (`[TRADE_FOCUS]`, e.g. "residential plumbing", "drain & sewer specialist", "boiler & hydronics"): [CLIENT ANSWER]
- **Years in the trade** (`[YEARS_IN_TRADE]`, integer): [CLIENT ANSWER]
- **Crew size** (`[CREW_SIZE]`, e.g. "owner-operator", "2 vans + apprentice"): [CLIENT ANSWER]
- **Anything they want to highlight that competitors don't have** (free text): [CLIENT ANSWER]

## §2. Service area

- **Primary city / municipality** (`[PRIMARY_CITY]`): [CLIENT ANSWER]
- **Service area — list of postal-code prefixes (FSAs) or municipalities served** (`[SERVICE_AREA]`, e.g. "M4A–M9N, Etobicoke, Mississauga east of Hwy 427"): [CLIENT ANSWER]
- **Hard limits — areas they will NOT travel to** (free text): [CLIENT ANSWER]
- **Travel-fee policy** (`[TRAVEL_FEE_POLICY]`, e.g. "no fee inside core; $40 outside"): [CLIENT ANSWER]
- **Shop / dispatch address — for JSON-LD `address`** (`[SHOP_ADDRESS]`, full street address; mark `[home-based, do not publish]` if the owner works out of their residence): [CLIENT ANSWER]

## §3. Hours & response time

- **Standard business hours — day-by-day** (`[HOURS_TABLE]`, fill the table below):

  | Day | Open | Close |
  |---|---|---|
  | Mon | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Tue | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Wed | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Thu | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Fri | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Sat | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Sun | [CLIENT ANSWER] | [CLIENT ANSWER] |

  > Use 24h time (e.g. `08:00`) so the JSON-LD prompt can pass it through to `openingHoursSpecification` without conversion. Mark `closed` for closed days.

- **Emergency / after-hours service?** (`[EMERGENCY_SERVICE]`, one of: `none`, `business-hours-only`, `extended-evenings`, `24/7`): [CLIENT ANSWER]
- **Emergency call-out fee** (`[EMERGENCY_FEE]`, e.g. "$120 flat call-out outside hours"): [CLIENT ANSWER]
- **Typical response window for non-emergency calls** (`[RESPONSE_WINDOW]`, e.g. "same-day weekdays, next-day weekends"): [CLIENT ANSWER]
- **Typical response window for emergency calls** (`[EMERGENCY_RESPONSE_WINDOW]`, e.g. "under 90 minutes inside core area"): [CLIENT ANSWER]

## §4. Licensing, insurance, and warranty

- **Trade licence type & number** (`[LICENCE_NUMBER]`, e.g. "Ontario MP plumber 306123"): [CLIENT ANSWER]
- **Master plumber on staff?** (yes / no — and name if relevant): [CLIENT ANSWER]
- **Liability insurance carrier & coverage limit** (`[INSURANCE_CARRIER]` / `[INSURANCE_LIMIT]`): [CLIENT ANSWER]
- **WSIB / workers' comp number** (`[WSIB_NUMBER]`, blank if owner-operator exempt): [CLIENT ANSWER]
- **Workmanship warranty** (`[WARRANTY_TERMS]`, e.g. "1 year on labour, manufacturer terms on parts"): [CLIENT ANSWER]
- **Are credentials OK to display publicly?** (yes / no — some owners prefer "licensed & insured" without printing the number): [CLIENT ANSWER]

## §5. Pricing & quoting

- **Pricing model** (`[PRICING_MODEL]`, one of: `flat-rate`, `hourly`, `hybrid` — explain in 1 sentence): [CLIENT ANSWER]
- **Diagnostic / call-out fee** (`[DIAGNOSTIC_FEE]`, e.g. "$95, waived if work proceeds"): [CLIENT ANSWER]
- **Hourly rate (if applicable)** (`[HOURLY_RATE]`): [CLIENT ANSWER]
- **Minimum service charge** (`[MIN_CHARGE]`, e.g. "1-hour minimum, $185"): [CLIENT ANSWER]
- **Parts markup policy** (`[PARTS_MARKUP_POLICY]`, e.g. "cost-plus 15%, line-itemed on every invoice"): [CLIENT ANSWER]
- **Free quote on larger jobs?** (yes / no — define "larger" if yes, e.g. "any job above $500"): [CLIENT ANSWER]
- **Payment methods accepted** (`[PAYMENT_METHODS]`, e.g. "Interac, Visa, Mastercard, cheque on completion"): [CLIENT ANSWER]
- **Financing offered?** (yes / no — and partner if yes, e.g. "Financeit"): [CLIENT ANSWER]

## §6. Services offered

- **Service catalogue** (`[SERVICES_LIST]`, list each service with a 1-line description; the prompt will normalise into "Emergency / Repair / Install / Maintenance" buckets):

  ```
  [PASTE_SERVICES_HERE]
  ```

  Examples to prompt the client through if they freeze: drain unclog, water-heater swap, sump-pump install, repipe, leak detection, frozen-pipe thaw, backflow prevention, sewer-camera inspection, fixture install, gas line work (note: gas requires separate cert).
- **Top 3 most-booked services to feature** (`[TOP_SERVICES]`, ordered): [CLIENT ANSWER]
- **Services they explicitly do NOT do** (e.g. "no commercial, no septic, no gas"): [CLIENT ANSWER]
- **Brands serviced / preferred** (`[PREFERRED_BRANDS]`, e.g. "Rinnai, Navien, Moen, Delta"): [CLIENT ANSWER]

## §7. Contact & dispatch

- **Phone number** (`[PHONE_E164]`, in `+1XXXXXXXXXX` format for JSON-LD): [CLIENT ANSWER]
- **Phone number, display form** (`[PHONE_DISPLAY]`, e.g. "(416) 555-0188"): [CLIENT ANSWER]
- **Emergency / after-hours number — if different from main** (`[EMERGENCY_PHONE_DISPLAY]` / `[EMERGENCY_PHONE_E164]`): [CLIENT ANSWER]
- **Preferred contact method for new enquiries** (phone / form / SMS / email): [CLIENT ANSWER]
- **Dispatch software in use** (`[DISPATCH_SOFTWARE]`, e.g. "Jobber, ServiceTitan, none"): [CLIENT ANSWER]
- **Form-submission destination** (where contact-form leads should land — email / Jobber inbox / CRM webhook): [CLIENT ANSWER]

## §8. Web presence

- **Existing domain** (`[DOMAIN]`, leave blank if "need one"): [CLIENT ANSWER]
- **Google Business Profile URL** (`[GBP_URL]`, the customer-facing link): [CLIENT ANSWER]
- **Instagram handle** (`[INSTAGRAM]`, with `@`): [CLIENT ANSWER]
- **Other social / directory links** (Facebook, HomeStars, Yelp, BBB — full URLs): [CLIENT ANSWER]
- **Existing site to migrate from** (URL, or "none"): [CLIENT ANSWER]

## §9. Brand & visuals

- **Colour preferences or existing brand colours** (`[BRAND_COLOURS]`, hex if known): [CLIENT ANSWER]
- **Logo file provided?** (yes / no — if yes, path in shared drive): [CLIENT ANSWER]
- **Truck / van wrap photos available?** (yes / no — fleet photos are gold for the gallery): [CLIENT ANSWER]
- **Photos — owner-provided count** (`[PHOTO_COUNT]`, integer; 0 means "use stock"): [CLIENT ANSWER]
- **Photo themes the owner wants represented** (`[PHOTO_THEMES]`, e.g. "wrapped van, before/after drain clear, water-heater install, crew on a job site"): [CLIENT ANSWER]
- **Before/after pairs available?** (`[BEFORE_AFTER_PAIRS]`, integer; the gallery prompt will pair them if ≥ 2): [CLIENT ANSWER]

## §10. Social proof

- **Testimonials or Google reviews to feature — up to 3** (`[REVIEWS]`):

  | # | Quote | Customer first name | Job type / context | Rating (1–5) |
  |---|---|---|---|---|
  | 1 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 2 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 3 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |

- **Aggregate rating to display** (`[AGGREGATE_RATING]`, e.g. "4.9 across 87 Google reviews" — only if verifiable from GBP / HomeStars): [CLIENT ANSWER]

## §11. FAQ source material

The trade-FAQ prompt (Prompt 12) reads from this section. Capture the questions the owner is sick of answering on the phone — those become the FAQ verbatim.

- **Top recurring customer questions** (`[FAQ_QUESTIONS]`, list 5–8 with the owner's actual answer; the prompt formats them, but the words are the owner's):

  ```
  Q: [CLIENT ANSWER]
  A: [CLIENT ANSWER]

  Q: [CLIENT ANSWER]
  A: [CLIENT ANSWER]

  ...
  ```

- **Topics the owner explicitly wants AVOIDED in the FAQ** (e.g. competitor pricing, regulatory grey areas): [CLIENT ANSWER]

## §12. Optional features & compliance

- **24/7 emergency banner desired?** (yes / no — if yes, Prompt 11 fires; only enable if §3 emergency = `24/7` or `extended-evenings`): [CLIENT ANSWER]
- **Newsletter / maintenance-reminder list?** (yes / no — out of scope for this prompt set; flag a follow-up issue if yes): [CLIENT ANSWER]
- **Online booking / scheduling needed?** (yes / no — **if yes, do NOT generate it from this prompt set**: file a separate issue tagged `complexity/complex` because it needs Jobber/ServiceTitan API wiring): [CLIENT ANSWER]
- **Compliance callouts the owner wants visible** (e.g. "TSSA-certified for gas", "backflow tester licensed", "lead-safe certified renovator"): [CLIENT ANSWER]
- **Anything operator should NOT mention on the site** (lapsed certifications, dropped trade names, lawsuits, prior partners): [CLIENT ANSWER]
- **Operator's own notes from the call** (vibe, energy, things to revisit on review): [OPERATOR NOTES]

---

## Prompts run (operator log)

Update this checklist as you run each prompt from `plumber-prompts.md`. Append the destination filepath in the client repo so the next operator can find the generated section quickly.

- [ ] Prompt 1 — Hero copy → `src/app/page.tsx` (or `src/content/home.ts`)
- [ ] Prompt 2 — About / Our Story → `src/content/about.mdx`
- [ ] Prompt 3 — Services list → `src/content/services.mdx`
- [ ] Prompt 4 — Service area & response time → `src/content/service-area.mdx`
- [ ] Prompt 5 — Booking / dispatch → `src/components/sections/Booking.tsx`
- [ ] Prompt 6 — Testimonials → `src/components/sections/Testimonials.tsx`
- [ ] Prompt 7 — Photo Gallery (job-site / before-after) → `src/components/sections/Gallery.tsx`
- [ ] Prompt 8 — SEO metadata → `src/app/page.tsx` (`metadata` export)
- [ ] Prompt 9 — JSON-LD structured data → `src/app/page.tsx` (`<JsonLd>` block)
- [ ] Prompt 10 — Contact / dispatch form wrapper → `src/components/sections/Contact.tsx`
- [ ] Prompt 11 — Emergency-call CTA banner *(only if §12 = yes)* → `src/components/sections/EmergencyBanner.tsx`
- [ ] Prompt 12 — Trade FAQ → `src/components/sections/FAQ.tsx`
