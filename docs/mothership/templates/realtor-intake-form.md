<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY INTAKE FORM

  This is the operator's *internal* cribsheet for single-agent realtor
  clients. Do NOT send this filled form to the client. The client-facing
  intake is the trimmed dummy in `../07-client-handover-pack.md §3`.

  Workflow:
    1. Copy this file to the operator's mothership repo at
       `docs/clients/<slug>/intake.md`.
    2. Walk the client through the questions in a single intake call.
    3. Replace each `[CLIENT ANSWER]` placeholder with their answer.
    4. Feed the filled form into the prompts in `realtor-prompts.md`.

  Anything bracketed in CAPS (e.g. `[AGENT_NAME]`) is a token the
  prompts reference — keep the brackets so find-replace stays safe.

  Realtor-specific compliance note:
    Canadian provincial regulators (RECO in Ontario, OACIQ in Quebec,
    BCFSA in BC, RECA in Alberta, CREA at the national level for the
    REALTOR® mark) all require advertising disclosures. The intake
    captures the regulator licence number, brokerage name, and trade
    region so Prompt 1 / Prompt 8 / Prompt 9 can render them
    consistently. If a question is unanswered, write
    `[unknown — follow up]` rather than guessing — a missing brokerage
    name on a live realtor site can trigger a regulator complaint.
================================================================================
-->

# Realtor (single agent) client — operator intake form

**Client slug (kebab-case):** `[CLIENT_SLUG]`
**Date of intake call:** `[YYYY-MM-DD]`
**Operator on call:** `[OPERATOR_NAME]`

> Fill answers inline below. If the client doesn't have an answer, write `[unknown — follow up]` rather than guessing — the prompts read these answers verbatim, and missing regulator/brokerage fields can trigger a compliance complaint after launch.

---

## §1. Agent identity & licensing

- **Agent display name** (`[AGENT_NAME]`, the name they want at the top of the homepage — usually `First Last`): [CLIENT ANSWER]
- **Agent first name** (`[AGENT_FIRST_NAME]`, used in narrative copy): [CLIENT ANSWER]
- **Years licensed** (`[YEARS_LICENSED]`, integer): [CLIENT ANSWER]
- **Designations / credentials** (`[DESIGNATIONS]`, e.g. "ABR, SRES" — leave blank if none): [CLIENT ANSWER]
- **Languages spoken with clients** (`[LANGUAGES]`, comma-sep, e.g. "English, Punjabi, Hindi"): [CLIENT ANSWER]

## §2. Brokerage & regulator

> Every public-facing page must name the brokerage and the regulator licence per provincial advertising rules. Capture both.

- **Brokerage legal name** (`[BROKERAGE_NAME]`, e.g. "Royal LePage Signature Realty, Brokerage"): [CLIENT ANSWER]
- **Brokerage address** (`[BROKERAGE_ADDRESS]`, full street address): [CLIENT ANSWER]
- **Brokerage phone** (`[BROKERAGE_PHONE]`, display form): [CLIENT ANSWER]
- **Province of practice** (`[PROVINCE]`, e.g. "Ontario"): [CLIENT ANSWER]
- **Regulator** (`[REGULATOR_NAME]`, one of: RECO / OACIQ / BCFSA / RECA / SRC / NSREC / FCNB / NLREA / PEIREA — derive from province if known): [CLIENT ANSWER]
- **Agent regulator licence / registration number** (`[REGULATOR_LICENCE_NUMBER]`, e.g. RECO #): [CLIENT ANSWER]
- **REALTOR® member of CREA / local board?** (`[CREA_MEMBER]`, yes / no — drives the trademark disclaimer in the footer): [CLIENT ANSWER]
- **Local real-estate board** (`[LOCAL_BOARD]`, e.g. "Toronto Regional Real Estate Board (TRREB)"): [CLIENT ANSWER]

## §3. Trade region & specialty

- **Primary trade region** (`[TRADE_REGION]`, e.g. "central Mississauga"): [CLIENT ANSWER]
- **Neighbourhoods / municipalities served — up to 6** (`[NEIGHBOURHOODS_SERVED]`, comma-sep — these become the "Neighbourhoods" section cards):

  | # | Neighbourhood / city | One-line texture (≤ 14 words, owner's voice — what makes the area distinctive) |
  |---|---|---|
  | 1 | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 2 | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 3 | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 4 | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 5 | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 6 | [CLIENT ANSWER] | [CLIENT ANSWER] |

- **Listing-mix** (`[LISTING_MIX]`, rough % split — values must sum to 100):
  - Resale residential: [CLIENT ANSWER]%
  - Pre-construction / assignments: [CLIENT ANSWER]%
  - Commercial / investment: [CLIENT ANSWER]%
  - Leasing / rentals: [CLIENT ANSWER]%
- **Average price band the agent typically transacts in** (`[PRICE_BAND]`, e.g. "$700K–$1.4M"): [CLIENT ANSWER]
- **Buyer-vs-seller representation split** (`[REP_SPLIT]`, rough % buyer / % seller): [CLIENT ANSWER]
- **Anything they want to highlight that competitors in the same region don't have** (free text, used by Prompt 1 and Prompt 2): [CLIENT ANSWER]

## §4. MLS / IDX integration

> "Featured listings" can either pull live from the local board's IDX feed or be hand-curated. Most single-agent sites should ship hand-curated first, IDX second; capture the choice up front because Prompt 3 branches on it.

- **IDX integration available?** (`[IDX_AVAILABLE]`, one of):
  - [ ] No IDX — featured listings are hand-curated MDX (Prompt 3 variant 3a)
  - [ ] IDX via brokerage (Realtor.ca / DDF / RETS) — `[IDX_VENDOR]`: [CLIENT ANSWER]
  - [ ] IDX via third-party CRM (Follow Up Boss, Chime, kvCORE, Sierra) — `[IDX_VENDOR]`: [CLIENT ANSWER]
- **If IDX: feed credentials / vendor contact** (operator-side note; **do NOT commit credentials to the repo** — store in vault per `docs/mothership/21-vault-strategy-adr.md`): [OPERATOR NOTES]
- **Featured listings to seed at launch — up to 4** (`[FEATURED_LISTINGS]`, only if hand-curated):

  | # | Address (or "Listing #MLS123") | Price | Bed / bath | One-line hook (≤ 14 words, owner's voice) | Photo path in shared drive |
  |---|---|---|---|---|---|
  | 1 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 2 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 3 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 4 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |

## §5. Sold-stats policy

> Provincial regulators are increasingly strict about how sold prices are advertised (e.g. RECO 2024 rule changes around "sold over asking" claims). Capture the agent's stance before generating any "track record" copy.

- **Are sold-prices permitted to be displayed on the public site?** (`[SOLD_PRICE_POLICY]`, one of):
  - [ ] No — show only "sold" status, no price (default; safest)
  - [ ] Yes, with seller written consent on each property (operator must confirm consent file in `docs/clients/<slug>/sold-consent/`)
  - [ ] Yes, aggregated only (e.g. "average sale-to-list ratio: 102%")
- **Aggregated stats the agent wants featured** (`[AGGREGATE_STATS]`, e.g. "47 homes sold in 2025; average 12 days on market" — leave blank if no aggregate):
  - Homes sold last 12 months: [CLIENT ANSWER]
  - Average days on market: [CLIENT ANSWER]
  - Average sale-to-list ratio: [CLIENT ANSWER]
  - Other (free text): [CLIENT ANSWER]
- **Disclaimer line the agent wants on aggregate stats** (`[STATS_DISCLAIMER]`, e.g. "Stats based on personal transactions, [PROVINCE], Jan–Dec 2025"): [CLIENT ANSWER]

## §6. Lead magnets & CTAs

- **Primary CTA** (`[PRIMARY_CTA]`, one of):
  - [ ] Book a discovery call (Calendly / Cal.com — capture URL in §8)
  - [ ] Home-valuation form (Prompt 11 fires)
  - [ ] Buyer-guide download (Prompt 12 fires)
  - [ ] General contact form
- **Secondary lead magnet** (`[SECONDARY_LEAD_MAGNET]`, optional — what the agent wants to offer in exchange for an email):
  - [ ] Neighbourhood report (PDF)
  - [ ] First-time buyer guide (PDF)
  - [ ] Investor / pre-construction watchlist
  - [ ] None
- **If neighbourhood report:** which neighbourhoods, and what does the report contain in 1 sentence: [CLIENT ANSWER]

## §7. Open houses & cadence

- **Does the agent want a public open-house schedule on the site?** (`[OPEN_HOUSE_PUBLIC]`, yes / no): [CLIENT ANSWER]
- **Typical cadence** (`[OPEN_HOUSE_CADENCE]`, e.g. "Most Saturdays 2–4pm during active listings; none in winter break"): [CLIENT ANSWER]
- **Where the schedule lives today** (Eventbrite / Realtor.ca / "I post on Instagram only" — drives whether Prompt 7 renders an embed or a plain MDX list): [CLIENT ANSWER]

## §8. Contact, booking & web presence

- **Phone number** (`[PHONE_E164]`, in `+1XXXXXXXXXX` format for JSON-LD): [CLIENT ANSWER]
- **Phone number, display form** (`[PHONE_DISPLAY]`, e.g. "(905) 555-0188"): [CLIENT ANSWER]
- **Email — public-facing** (`[EMAIL_PUBLIC]`): [CLIENT ANSWER]
- **Booking link** (`[BOOKING_URL]`, Calendly / Cal.com / SavvyCal — leave blank if booking is phone-only): [CLIENT ANSWER]
- **Existing domain** (`[DOMAIN]`, leave blank if "need one"): [CLIENT ANSWER]
- **Existing site to migrate from** (URL, or "none"): [CLIENT ANSWER]
- **Instagram handle** (`[INSTAGRAM]`, with `@`): [CLIENT ANSWER]
- **Other social links** (Facebook, LinkedIn, YouTube, TikTok — full URLs): [CLIENT ANSWER]
- **CRM in use today** (`[CRM_VENDOR]`, e.g. Follow Up Boss / Chime / kvCORE / "spreadsheet"): [CLIENT ANSWER]

## §9. Brand & visuals

- **Colour preferences or existing brand colours** (`[BRAND_COLOURS]`, hex if known — note that brokerage brand-guidelines may constrain this): [CLIENT ANSWER]
- **Brokerage brand-guideline lock** (`[BROKERAGE_BRAND_LOCK]`, free text — e.g. "must use Royal LePage red and yellow per brokerage manual"): [CLIENT ANSWER]
- **Headshot file provided?** (yes / no — if yes, path in shared drive): [CLIENT ANSWER]
- **Logo file provided?** (yes / no — if yes, path in shared drive; mark whether it's the agent's personal logo or the brokerage's): [CLIENT ANSWER]
- **Photos — owner-provided count** (`[PHOTO_COUNT]`, integer; 0 means "use stock"): [CLIENT ANSWER]
- **Photo themes the agent wants represented** (e.g. "the trade-region skyline, an open-house at golden hour, the agent at the closing table"): [CLIENT ANSWER]

## §10. Social proof

- **Testimonials to feature — up to 3** (`[REVIEWS]`, **must have written consent on file** — confirm before publishing names):

  | # | Quote | Customer first name | Buyer / Seller / Tenant | Neighbourhood / context | Rating (1–5) |
  |---|---|---|---|---|---|
  | 1 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 2 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 3 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |

- **Where the testimonial originated** (`[REVIEW_SOURCE]`, e.g. "Google Business Profile", "RankMyAgent", "client thank-you card") — needed for the JSON-LD `Review.publisher` field: [CLIENT ANSWER]

## §11. Compliance & house notes

- **Required regulator advertising disclaimer** (`[REGULATOR_DISCLAIMER]`, free text — operator pre-fills the boilerplate from the province; e.g. RECO Code of Ethics §38 "Not intended to solicit clients currently under contract with another brokerage"): [CLIENT ANSWER]
- **REALTOR® / MLS® trademark disclaimer required?** (`[CREA_DISCLAIMER]`, yes if §2 CREA member = yes — usually rendered in footer): [CLIENT ANSWER]
- **Personal-information / privacy contact** (`[PRIVACY_CONTACT_EMAIL]`, the email under PIPEDA where buyers/sellers send privacy requests — usually `privacy@<brokerage>` or the agent's email): [CLIENT ANSWER]
- **Anything operator should NOT mention on the site** (departed teammates, prior brokerage, sealed transactions, lawsuits): [CLIENT ANSWER]
- **Operator's own notes from the call** (vibe, energy, things to revisit on review): [OPERATOR NOTES]

---

## Prompts run (operator log)

Update this checklist as you run each prompt from `realtor-prompts.md`. Append the destination filepath in the client repo so the next operator can find the generated section quickly.

- [ ] Prompt 1 — Hero copy → `src/app/page.tsx` (or `src/content/home.ts`)
- [ ] Prompt 2 — About / agent bio → `src/content/about.mdx`
- [ ] Prompt 3 — Featured listings → `src/content/listings.mdx` (variant 3a — hand-curated) or `src/components/sections/IDXListings.tsx` (variant 3b — IDX)
- [ ] Prompt 4 — Neighbourhoods served → `src/content/neighbourhoods.mdx`
- [ ] Prompt 5 — Booking / discovery-call → `src/components/sections/BookCall.tsx`
- [ ] Prompt 6 — Testimonials → `src/components/sections/Testimonials.tsx`
- [ ] Prompt 7 — Open-house schedule / past-listings carousel → `src/components/sections/OpenHouses.tsx` (or `Gallery.tsx`)
- [ ] Prompt 8 — SEO metadata → `src/app/page.tsx` (`metadata` export)
- [ ] Prompt 9 — JSON-LD structured data → `src/app/page.tsx` (`<JsonLd>` block)
- [ ] Prompt 10 — Contact / lead-capture → `src/components/sections/Contact.tsx`
- [ ] Prompt 11 — Home-valuation lead magnet *(only if §6 PRIMARY_CTA = valuation OR SECONDARY_LEAD_MAGNET = neighbourhood report)* → `src/components/sections/HomeValuation.tsx`
- [ ] Prompt 12 — Buyer-guide download CTA *(only if §6 SECONDARY_LEAD_MAGNET = first-time buyer guide)* → `src/components/sections/BuyerGuideCTA.tsx`
