<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY INTAKE FORM

  This is the operator's *internal* cribsheet for restaurant clients.
  Do NOT send this filled form to the client. The client-facing intake
  is the trimmed dummy in `../07-client-handover-pack.md §3`.

  Workflow:
    1. Copy this file to the operator's mothership repo at
       `docs/clients/<slug>/intake.md`.
    2. Walk the client through the questions in a single intake call.
    3. Replace each `[CLIENT ANSWER]` placeholder with their answer.
    4. Feed the filled form into the prompts in `restaurant-prompts.md`.

  Anything bracketed in CAPS (e.g. `[BUSINESS_NAME]`) is a token the
  prompts reference — keep the brackets so find-replace stays safe.
================================================================================
-->

# Restaurant client — operator intake form

**Client slug (kebab-case):** `[CLIENT_SLUG]`
**Date of intake call:** `[YYYY-MM-DD]`
**Operator on call:** `[OPERATOR_NAME]`

> Fill answers inline below. If the client doesn't have an answer, write `[unknown — follow up]` rather than guessing — the prompts read these answers verbatim.

---

## §1. Business identity

- **Business name** (`[BUSINESS_NAME]`): [CLIENT ANSWER]
- **Owner first name** (`[OWNER_NAME]`): [CLIENT ANSWER]
- **Cuisine type** (`[CUISINE_TYPE]`, e.g. "Northern Italian", "Sichuan", "modern Canadian small plates"): [CLIENT ANSWER]
- **Signature dish** (`[SIGNATURE_DISH]`, the one thing they want to be remembered for): [CLIENT ANSWER]
- **Atmosphere / vibe — 1 to 3 adjectives in the owner's own words** (`[VIBE_ADJECTIVES]`, e.g. "warm, candle-lit, neighbourhood"): [CLIENT ANSWER]
- **Anything they want to highlight that competitors don't have** (free text): [CLIENT ANSWER]

## §2. Location & hours

- **Full street address** (`[ADDRESS]`): [CLIENT ANSWER]
- **Neighbourhood name** (`[NEIGHBOURHOOD]`, e.g. "Little Italy", "Kensington Market"): [CLIENT ANSWER]
- **City** (`[CITY]`): [CLIENT ANSWER]
- **Parking notes** (`[PARKING_NOTES]`, e.g. "metered street; free after 6pm"): [CLIENT ANSWER]
- **Opening hours — day-by-day** (`[HOURS_TABLE]`, fill the table below):

  | Day | Open | Close |
  |---|---|---|
  | Mon | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Tue | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Wed | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Thu | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Fri | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Sat | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Sun | [CLIENT ANSWER] | [CLIENT ANSWER] |

  > Use 24h time (e.g. `17:00`) so the JSON-LD prompt can pass it through to `openingHoursSpecification` without conversion. Mark `closed` for closed days.

## §3. Capacity & format

- **Seating capacity** (free text, e.g. "42 inside, 16 patio"): [CLIENT ANSWER]
- **Service mix — dine-in / takeout / delivery split** (rough %): [CLIENT ANSWER]
- **Price range** (`[PRICE_RANGE]`, one of `$`, `$$`, `$$$`, `$$$$` — used by JSON-LD): [CLIENT ANSWER]

## §4. Contact & booking

- **Phone number** (`[PHONE_E164]`, in `+1XXXXXXXXXX` format for JSON-LD): [CLIENT ANSWER]
- **Phone number, display form** (`[PHONE_DISPLAY]`, e.g. "(416) 555-0188"): [CLIENT ANSWER]
- **Preferred contact method for new enquiries** (phone / form / Instagram DM): [CLIENT ANSWER]
- **Booking method**:
  - [ ] Phone-only (walk-ins welcome)
  - [ ] OpenTable — `[OT_RESTAURANT_ID]`: [CLIENT ANSWER]
  - [ ] Other (free text): [CLIENT ANSWER]

## §5. Web presence

- **Existing domain** (`[DOMAIN]`, leave blank if "need one"): [CLIENT ANSWER]
- **Instagram handle** (`[INSTAGRAM]`, with `@`): [CLIENT ANSWER]
- **Other social links** (Facebook, TikTok, X — full URLs): [CLIENT ANSWER]
- **Existing site to migrate from** (URL, or "none"): [CLIENT ANSWER]

## §6. Menu

- **Menu input format** (one of: pasted text below / PDF attached / photos in shared drive): [CLIENT ANSWER]
- **Menu text** (paste here if not attaching — keep the headings the client uses; the prompts will normalise into Starters / Mains / Desserts / Drinks):

  ```
  [PASTE_MENU_HERE]
  ```

- **Items the owner specifically wants featured at the top** (the "must-order" shortlist): [CLIENT ANSWER]

## §7. Brand & visuals

- **Colour preferences or existing brand colours** (`[BRAND_COLOURS]`, hex if known): [CLIENT ANSWER]
- **Logo file provided?** (yes / no — if yes, path in shared drive): [CLIENT ANSWER]
- **Photos — owner-provided count** (`[PHOTO_COUNT]`, integer; 0 means "use stock"): [CLIENT ANSWER]
- **Photo themes the owner wants represented** (e.g. "the wood oven, the patio at dusk, the pasta-rolling table"): [CLIENT ANSWER]

## §8. Social proof

- **Testimonials or Google reviews to feature — up to 3** (`[REVIEWS]`):

  | # | Quote | Customer first name | Neighbourhood / context | Rating (1–5) |
  |---|---|---|---|---|
  | 1 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 2 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 3 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |

## §9. Optional features

- **Newsletter / specials sign-up?** (yes / no — if yes, Prompt 11 fires): [CLIENT ANSWER]
- **Rotating promotion to highlight?** (e.g. Happy Hour, Sunday Brunch — if yes, Prompt 12 fires; capture name + offer + when): [CLIENT ANSWER]
- **Online ordering needed?** (yes / no — **if yes, do NOT generate it from this prompt set**: file a separate issue tagged `complexity/complex` because it needs Stripe/Square wiring): [CLIENT ANSWER]
- **Private events / catering page?** (yes / no — currently out of scope; Prompt 10's hidden `vertical=restaurant` field tags the form, but a dedicated page is a follow-up): [CLIENT ANSWER]

## §10. Compliance & house notes

- **Allergen / dietary callouts the owner wants visible** (e.g. "we are nut-free", "celiac-friendly menu available"): [CLIENT ANSWER]
- **Anything operator should NOT mention on the site** (closed locations, lawsuits, prior partners): [CLIENT ANSWER]
- **Operator's own notes from the call** (vibe, energy, things to revisit on review): [OPERATOR NOTES]

---

## Prompts run (operator log)

Update this checklist as you run each prompt from `restaurant-prompts.md`. Append the destination filepath in the client repo so the next operator can find the generated section quickly.

- [ ] Prompt 1 — Hero copy → `src/app/page.tsx` (or `src/content/home.ts`)
- [ ] Prompt 2 — About / Our Story → `src/content/about.mdx`
- [ ] Prompt 3 — Menu MDX → `src/content/menu.mdx`
- [ ] Prompt 4 — Hours, Location, Directions → `src/content/visit.mdx`
- [ ] Prompt 5 — Reservations / Booking → `src/components/sections/Reservations.tsx`
- [ ] Prompt 6 — Testimonials → `src/components/sections/Testimonials.tsx`
- [ ] Prompt 7 — Photo Gallery → `src/components/sections/Gallery.tsx`
- [ ] Prompt 8 — SEO metadata → `src/app/page.tsx` (`metadata` export)
- [ ] Prompt 9 — JSON-LD structured data → `src/app/page.tsx` (`<JsonLd>` block)
- [ ] Prompt 10 — Contact / intake form wrapper → `src/components/sections/Contact.tsx`
- [ ] Prompt 11 — Newsletter sign-up *(only if §9 = yes)* → `src/components/sections/Newsletter.tsx`
- [ ] Prompt 12 — Specials / Promotions CTA *(only if §9 = yes)* → `src/components/sections/Promo.tsx`
