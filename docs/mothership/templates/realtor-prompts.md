<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY PROMPT PACK

  Real-estate (single-agent) content prompts for Claude Opus.

  Hard rules:
    1. Do NOT paste these prompts into a client-shared chat.
    2. The *outputs* (hero copy, MDX, JSON-LD) ship into the client repo.
       The *prompts* never leave this folder.
    3. Run prompts sequentially — later ones depend on earlier outputs
       (the JSON-LD prompt reads back the hours, brokerage, and
       neighbourhoods, etc.).

  Compliance gate:
    Realtor advertising is regulated province-by-province (RECO,
    OACIQ, BCFSA, RECA, …). Every prompt below threads through the
    intake form's §2 brokerage / §5 sold-stats / §11 disclaimer
    fields so generated copy is compliant by construction. If an
    intake field is empty, the prompt says so explicitly — never let
    Opus invent a brokerage name or a regulator licence number.

  See `00-templates-index.md` for the workflow and
  `realtor-intake-form.md` for the field definitions.
================================================================================
-->

# Real-estate (single agent) — content prompts (Claude Opus)

This file is a sequence of 12 prompts (10 required + 2 conditional) that turn a filled `realtor-intake-form.md` into a complete single-agent realtor site. Each prompt is self-contained, fenced, and labelled with the destination filepath in the client repo.

## Before you start

1. **Fill the intake form first.** Every `[BRACKET_FIELD]` below comes from `realtor-intake-form.md`. If a field is empty, stop and follow up with the client — do not let Opus invent it. Brokerage name, regulator licence number, and sold-stats policy are non-negotiable; missing them on a live site can trigger a regulator complaint.
2. **One prompt = one fresh Opus chat.** Pasting them all at once dilutes the per-section context. Open a new chat per prompt.
3. **Substitute brackets with find-replace.** Open the prompt in your editor, do `[AGENT_NAME]` → real value (etc.), then paste the result into Claude.
4. **Review every output before pasting into the client repo.** The voice is the operator's reputation; treat outputs like junior-writer drafts, not finished copy.
5. **House style:** plainspoken, specific, locally rooted, no emoji, no exclamation marks, no "AI-isms" ("delve", "tapestry", "ever-evolving"), no real-estate clichés ("dream home", "luxury lifestyle", "world-class", "passionate about", "your trusted advisor"). Agent's voice is first-person singular ("I") unless §3 says otherwise.
6. **Compliance defaults:** the footer must always show the brokerage legal name + agent licence number; the REALTOR® / MLS® disclaimer renders if §2 CREA member = yes. Prompts 8–10 reference these so the operator does not have to remember them per-section.
7. **Component primitives** referenced below are real and live in the client repo at `src/components/primitives/`:
   - `GlassCard` — `{ children, className?, as?: 'div' | 'article' | 'li', interactive?: boolean }`
   - `SectionShell` — wraps a section with consistent padding and a `variant: 'ink' | 'canvas' | 'parchment'` background.
   - `CTABlock` — `{ headline, subhead?, ctaLabel, ctaHref, variant?: 'ink' | 'canvas' | 'parchment' }`
   - `JsonLd` — `{ data: WithContext<Thing> }` from `schema-dts`. Pass a fully-typed schema object; do not stringify upstream.

If those primitives are missing, the structural rebuild prompt (`../06-operator-rebuild-prompt-v3.md`) hasn't run yet — fix that before running these.

---

## Prompt 1 — Hero section copy

**Destination:** `src/app/page.tsx` (the `<HomeHero>` props, or whatever `src/content/home.ts` exports for the hero).

```
<!-- Paste into Claude Opus -->
You are writing the hero section of a single-agent realtor's homepage.
Voice: plainspoken, locally rooted, first-person singular. The agent should
sound like someone a neighbour would call, not a billboard. No emoji, no
exclamation marks, no real-estate clichés ("dream home", "luxury lifestyle",
"world-class", "passionate about", "your trusted advisor", "concierge service").

Inputs:
- Agent display name: [AGENT_NAME]
- Years licensed: [YEARS_LICENSED]
- Trade region: [TRADE_REGION]
- Up to six neighbourhoods served: [NEIGHBOURHOODS_SERVED]
- Listing mix (% resale / pre-con / commercial / leasing): [LISTING_MIX]
- Buyer-vs-seller split: [REP_SPLIT]
- Differentiator (what they do that local competitors don't): [DIFFERENTIATOR]
- Primary CTA chosen in §6: [PRIMARY_CTA]

Produce exactly three things:

1. Headline — at most 9 words. Concrete, locally rooted, names the trade
   region or one neighbourhood by name. Reads like the agent could say it
   out loud without flinching.
2. Subheadline — one sentence, max 24 words. Names the mix (resale /
   pre-con / commercial — whichever dominates) and roots it in the region.
   Do not list every neighbourhood; the Neighbourhoods section does that.
3. Primary CTA button text — at most 3 words. Action verb. Map to the
   chosen primary CTA: "Book a call" / "Get a valuation" / "Browse listings"
   / "Send a note". Avoid "Learn more" and "Get started".

Return as a fenced TypeScript object literal so the operator can paste it
directly:

```ts
export const hero = {
  headline: "...",
  subheadline: "...",
  ctaLabel: "...",
  ctaHref: "...",  // map to: /book, /valuation, /listings, or /contact
};
```
```

**Acceptance criteria:**
- Headline ≤ 9 words; subheadline ≤ 24 words; CTA label ≤ 3 words.
- The trade region OR one specific neighbourhood is named in the headline.
- No banned phrase from the house style list above appears in either field.
- `ctaHref` matches the primary CTA chosen in intake §6.

---

## Prompt 2 — About / agent bio section

**Destination:** `src/content/about.mdx`.

```
<!-- Paste into Claude Opus -->
You are writing the "About" section of a single-agent realtor's site.
Output is 140–200 words of MDX prose in the agent's first-person voice ("I").
Specific, locally rooted, plainspoken. No emoji, no exclamation marks.

Inputs:
- Agent first name: [AGENT_FIRST_NAME]
- Years licensed: [YEARS_LICENSED]
- Brokerage legal name: [BROKERAGE_NAME]
- Province: [PROVINCE]
- Designations: [DESIGNATIONS]  (omit if blank)
- Languages spoken with clients: [LANGUAGES]
- Trade region: [TRADE_REGION]
- Buyer-vs-seller split: [REP_SPLIT]
- Personal backstory the agent shared (verbatim): [AGENT_BACKSTORY]
- Differentiator (what they do that local competitors don't): [DIFFERENTIATOR]

Constraints:
- Open with one concrete detail — the street the agent grew up on, the
  first deal they closed, why they moved into the trade region — not a
  mission statement.
- Name the brokerage exactly once, by full legal name (so the regulator
  advertising rule is satisfied without repetition).
- Reference the trade region by name at least once.
- End with a sentence that points to the next step (CTA), but does not
  read like a sales close.
- Banned words: "passionate", "passion", "journey", "luxury", "trusted
  advisor", "dream home", "concierge", "world-class", "elevated",
  "delve", "tapestry".

Return as MDX, with a single H2 heading "About [AGENT_FIRST_NAME]" at the
top. No frontmatter — the page wrapper handles that.
```

**Acceptance criteria:**
- 140–200 words.
- Brokerage legal name appears exactly once.
- Trade region appears at least once.
- No banned word from the list appears.

---

## Prompt 3 — Featured listings section *(replaces the restaurant "Menu" prompt)*

**Destination:** `src/content/listings.mdx` (variant 3a) **or** `src/components/sections/IDXListings.tsx` (variant 3b). Pick the variant from intake §4 — `IDX_AVAILABLE`.

### Variant 3a — Hand-curated featured listings (no IDX)

```
<!-- Paste into Claude Opus -->
You are turning a hand-curated set of featured listings into structured MDX.
Use the existing `SectionShell` and `GlassCard` primitives — assume they are
imported at the top of the MDX file.

Inputs:
- Agent display name: [AGENT_NAME]
- Trade region: [TRADE_REGION]
- Sold-stats policy chosen in §5: [SOLD_PRICE_POLICY]
- Up to four featured listings (one per row in §4 of the intake):
  Listing 1: address=[L1_ADDRESS], price=[L1_PRICE], bedbath=[L1_BEDBATH],
             hook=[L1_HOOK], photo=[L1_PHOTO]
  Listing 2: address=[L2_ADDRESS], price=[L2_PRICE], bedbath=[L2_BEDBATH],
             hook=[L2_HOOK], photo=[L2_PHOTO]
  Listing 3: address=[L3_ADDRESS], price=[L3_PRICE], bedbath=[L3_BEDBATH],
             hook=[L3_HOOK], photo=[L3_PHOTO]
  Listing 4: address=[L4_ADDRESS], price=[L4_PRICE], bedbath=[L4_BEDBATH],
             hook=[L4_HOOK], photo=[L4_PHOTO]

Output requirements:
- Single `<SectionShell variant="canvas" width="content">` with H2
  "Featured listings".
- A `<ul className="grid grid-cols-1 md:grid-cols-2 gap-4">` of
  `<GlassCard as="li" interactive>` cards, one per non-empty listing.
- Each card: an `<Image>` from `next/image` at the top
  (`width={800} height={600}`, `alt` text generated from the address +
  trade region — e.g. "Front elevation, 14 Maple Street, [TRADE_REGION]"),
  then the address (h3), the bed/bath as a single muted line, the hook
  sentence, and the price as plain text.
- If sold-stats policy = "No": for any listing whose status is "sold",
  render the word "Sold" in place of the price — do NOT render a numeric
  price. If policy = "Yes, aggregated only", same treatment.
- If a listing row is fully empty (no address), skip it — render only
  the populated cards.
- Below the grid, a short paragraph (≤ 35 words) inviting the reader to
  ask about off-market and pre-con inventory, with a single internal
  link to `/contact`.

Return valid MDX. No frontmatter.
```

**Acceptance criteria:**
- Cards render only for populated listing rows.
- Sold listings are price-suppressed when §5 policy ≠ "Yes, with seller written consent".
- Each `<Image>` has a specific, address-rooted `alt` (no "image of").

### Variant 3b — IDX-fed listings

```
<!-- Paste into Claude Opus -->
You are scaffolding an IDX-fed featured-listings section. The actual IDX
data fetch is a server-side call to the brokerage / vendor feed; this
prompt produces the *component shell*, not the data layer.

Inputs:
- Agent display name: [AGENT_NAME]
- IDX vendor: [IDX_VENDOR]
- Trade region: [TRADE_REGION]
- Sold-stats policy chosen in §5: [SOLD_PRICE_POLICY]

Output a single TSX file at `src/components/sections/IDXListings.tsx`
that exports `IDXListings`. Requirements:

1. Use `SectionShell` (variant="canvas") with H2 "Featured listings".
2. Define a `Listing` type with these fields exactly:
   `id: string; mlsNumber: string; addressLine: string; price: number;
    status: "active" | "sold" | "leased"; beds: number; baths: number;
    photoUrl: string;`
3. Component takes `listings: Listing[]` as a prop (no fetch in this
   file — the page wrapper does the fetch).
4. Render a 2-up grid (1-up on mobile) of `<GlassCard as="article"
   interactive>` cards, one per listing.
5. For each card: an `<Image>` from `next/image`
   (`width={800} height={600}`, `alt={\`Listing photo, ${listing.addressLine},
   [TRADE_REGION]\`}`), the address (h3), `${beds} bed · ${baths} bath`
   as a muted line, MLS® number `MLS® #${mlsNumber}` in muted text,
   and the price.
6. Sold-stats gate: if [SOLD_PRICE_POLICY] is "No" or "Yes, aggregated
   only", for any listing whose `status !== "active"`, render the word
   "Sold" (or "Leased") in place of the numeric price.
7. At the top of the file, include a JSDoc comment block documenting:
   (a) which IDX vendor the page wrapper is expected to fetch from,
   (b) the contract for `Listing[]`, (c) the path of the page-level
   server component that should call the feed.
8. Include a TODO comment block at the bottom listing the env vars the
   page wrapper will need (vendor-specific — name them
   `IDX_${VENDOR}_API_KEY` style, do NOT inline an actual key).

The component must compile under `npx tsc --noEmit`. No emoji.
```

**Acceptance criteria:**
- `src/components/sections/IDXListings.tsx` compiles under `npx tsc --noEmit`.
- The `Listing` type matches the spec above exactly.
- Sold-stats gate behaves per intake §5 without operator intervention.
- No real API key or feed credential is committed.

---

## Prompt 4 — Neighbourhoods served section

**Destination:** `src/content/neighbourhoods.mdx`.

```
<!-- Paste into Claude Opus -->
You are writing the "Neighbourhoods" section of a single-agent realtor's
site. Output MDX with a short intro and a card grid — one card per
neighbourhood the agent serves.

Inputs:
- Agent first name: [AGENT_FIRST_NAME]
- Trade region: [TRADE_REGION]
- Up to six neighbourhood rows from intake §3:
  N1: name=[N1_NAME], texture=[N1_TEXTURE]
  N2: name=[N2_NAME], texture=[N2_TEXTURE]
  N3: name=[N3_NAME], texture=[N3_TEXTURE]
  N4: name=[N4_NAME], texture=[N4_TEXTURE]
  N5: name=[N5_NAME], texture=[N5_TEXTURE]
  N6: name=[N6_NAME], texture=[N6_TEXTURE]
- Whether a neighbourhood-report lead magnet is offered: [SECONDARY_LEAD_MAGNET]

Output requirements:
1. Single `<SectionShell variant="parchment" width="content">` with H2
   "Where I work".
2. Intro paragraph — one sentence, ≤ 30 words, naming the trade region
   and noting that the list is the agent's primary working radius
   (without the word "primary").
3. A grid `<ul className="grid grid-cols-1 md:grid-cols-3 gap-4">` of
   `<GlassCard as="li">` cards — one per non-empty neighbourhood row.
4. Each card: H3 with the neighbourhood name, then the texture line
   verbatim (≤ 14 words from the intake).
5. If [SECONDARY_LEAD_MAGNET] = "Neighbourhood report (PDF)": at the
   bottom, render a single `<CTABlock variant="ink" headline="..."
   subhead="..." ctaLabel="Get the report" ctaHref="/neighbourhood-report" />`
   — generate the headline (≤ 8 words) and subhead (≤ 22 words)
   referencing whichever neighbourhood the agent named the report
   after, falling back to [TRADE_REGION] if unspecified.
   Otherwise omit the CTA entirely.

Return valid MDX. No frontmatter.
```

**Acceptance criteria:**
- One card per populated neighbourhood row; empty rows are skipped.
- Trade region appears exactly once in the intro.
- The `<CTABlock />` block renders only when §6 secondary lead magnet = neighbourhood report.

---

## Prompt 5 — Booking / discovery-call section

**Destination:** `src/components/sections/BookCall.tsx`.

Pick one variant based on intake §8 — whether `BOOKING_URL` is populated.

### Variant 5a — Booking link present (Calendly / Cal.com / SavvyCal)

```
<!-- Paste into Claude Opus -->
Generate a "Book a discovery call" section that embeds a booking widget.
The widget script must be added to `src/app/layout.tsx` <head>
separately (note at end).

Inputs:
- Agent first name: [AGENT_FIRST_NAME]
- Booking URL: [BOOKING_URL]
- Booking vendor (one of: calendly / cal.com / savvycal — derive from
  the host of [BOOKING_URL]): [BOOKING_VENDOR]
- Phone display form (fallback): [PHONE_DISPLAY]
- Phone E.164 form: [PHONE_E164]

Output a single TSX file at `src/components/sections/BookCall.tsx` that
exports `BookCall`. Use `SectionShell` (variant="parchment") and:
1. H2 — "Book a 20-minute call with [AGENT_FIRST_NAME]".
2. Prose block (≤ 50 words) — what the call covers, no pressure language.
   Banned: "no obligation", "absolutely free", "exclusive".
3. The booking embed — leave it as a placeholder JSX comment EXACTLY:
   `{/* <BookingEmbed vendor="[BOOKING_VENDOR]" url="[BOOKING_URL]" /> —
    add the vendor's script tag in src/app/layout.tsx <head> per their
    instructions */}`
4. A "Or call me directly" fallback line with a `tel:` link using the
   E.164 form for href and the display form as visible text.
5. At the very end of the file, include a TODO comment block with the
   exact script-tag the operator must paste into `src/app/layout.tsx`
   for the chosen vendor.

No emoji.
```

**Acceptance criteria:**
- Booking embed is a JSX comment placeholder (not a real script-tag inline).
- `tel:` fallback uses E.164 for the href.
- Vendor-specific TODO comment block is at file end.

### Variant 5b — Phone-only booking

```
<!-- Paste into Claude Opus -->
Generate a "Book a call" section for a single-agent realtor who takes
discovery calls by phone only (no scheduling tool wired up yet).

Inputs:
- Agent first name: [AGENT_FIRST_NAME]
- Phone display form: [PHONE_DISPLAY]
- Phone E.164 form: [PHONE_E164]

Output a single TSX file at `src/components/sections/BookCall.tsx` that
exports `BookCall`. Use `SectionShell` (variant="parchment") and:
1. H2 — "Call [AGENT_FIRST_NAME] directly".
2. Prose block (≤ 45 words) — what to expect on the call. Honest, no
   pressure language.
3. A `tel:` link, E.164 for href, display form as visible text.
4. A 1-line muted note: "Texts welcome too — same number."

No emoji. No exclamation marks.
```

**Acceptance criteria:**
- File compiles under `npx tsc --noEmit`.
- `tel:` link uses E.164.
- No banned phrase ("no obligation", "absolutely free", "exclusive") appears.

---

## Prompt 6 — Testimonials / Reviews section

**Destination:** `src/components/sections/Testimonials.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a "Testimonials" section that renders three review cards plus
matching JSON-LD `Review` schema scoped to a `RealEstateAgent`. Voice:
lift quotes verbatim — do NOT rewrite them. Names are first-name only;
do not invent surnames.

Inputs (from intake §10 — three review rows; each must have written
consent on file before publish):
- Agent display name: [AGENT_NAME]
- Brokerage legal name: [BROKERAGE_NAME]
- Review source publisher (e.g. "Google", "RankMyAgent"): [REVIEW_SOURCE]
- Review 1: quote=[R1_QUOTE], name=[R1_NAME], side=[R1_SIDE],
            context=[R1_CONTEXT], rating=[R1_RATING]
- Review 2: quote=[R2_QUOTE], name=[R2_NAME], side=[R2_SIDE],
            context=[R2_CONTEXT], rating=[R2_RATING]
- Review 3: quote=[R3_QUOTE], name=[R3_NAME], side=[R3_SIDE],
            context=[R3_CONTEXT], rating=[R3_RATING]

Output a single TSX file at `src/components/sections/Testimonials.tsx`
that exports `Testimonials`. Requirements:

1. Use `SectionShell` (variant="canvas") with H2 "What clients say".
2. A 3-up grid (1-up on mobile) of `<GlassCard as="article">` cards.
3. Each card: blockquote with the quote verbatim, attribution line
   "— [name], [side] in [context]" (e.g. "— Priya, buyer in Cooksville"),
   and a star-rating row rendered as filled / empty stars matching
   `rating` (use the `lucide-react` `Star` icon, filled =
   `fill="currentColor"` on the accent colour, empty = stroke only).
4. Below the grid, render a `<JsonLd>` block with `data` typed as
   `WithContext<RealEstateAgent>` and a populated `aggregateRating`
   plus a `review` array containing each of the three reviews as
   `Review` schema objects (`@type: "Review"`, `reviewRating`, `author`,
   `reviewBody`, `publisher: { "@type": "Organization", name:
   "[REVIEW_SOURCE]" }`).
5. The component must compile under `npx tsc --noEmit` — import `Star`
   from `lucide-react` and `WithContext`, `RealEstateAgent`, `Review`
   types from `schema-dts`.
6. If any review row has an empty `quote`, skip that card AND that
   `Review` schema entry — never render a placeholder.

No emoji.
```

**Acceptance criteria:**
- Empty review rows are skipped from both the UI and the schema.
- `RealEstateAgent.aggregateRating` only counts populated reviews.
- Each `Review` carries a `publisher` field set to [REVIEW_SOURCE].
- File compiles under `npx tsc --noEmit`.

---

## Prompt 7 — Open-house schedule / past-listings carousel

**Destination:** `src/components/sections/OpenHouses.tsx` if §7 OPEN_HOUSE_PUBLIC = yes; otherwise repurpose as `src/components/sections/Gallery.tsx` (past-listing photo carousel).

### Variant 7a — Public open-house schedule

```
<!-- Paste into Claude Opus -->
Generate a public open-house schedule section. Only run this variant if
intake §7 OPEN_HOUSE_PUBLIC = yes.

Inputs:
- Agent first name: [AGENT_FIRST_NAME]
- Trade region: [TRADE_REGION]
- Cadence summary: [OPEN_HOUSE_CADENCE]
- Where the schedule lives today: [OPEN_HOUSE_SOURCE]  (one of:
  "Eventbrite" / "Realtor.ca" / "Instagram only")

Output a single TSX file at `src/components/sections/OpenHouses.tsx`
that exports `OpenHouses`. Requirements:

1. Use `SectionShell` (variant="parchment") with H2 "Open houses
   this week".
2. A short paragraph (≤ 35 words) summarising the cadence verbatim
   from [OPEN_HOUSE_CADENCE] and naming [TRADE_REGION] once.
3. Define a `OpenHouse` type with fields:
   `id: string; addressLine: string; date: string; // ISO 8601
    timeWindow: string; // e.g. "2:00–4:00pm"
    notes?: string;`
4. Component accepts `events: OpenHouse[]` as a prop. Render a list
   of `<GlassCard as="li">` cards, one per event, sorted ascending
   by `date`.
5. Each card: address (h3), human-formatted date
   (`new Date(event.date).toLocaleDateString("en-CA", { weekday: "long",
    month: "long", day: "numeric" })`), the time window, then any
   notes.
6. If `events.length === 0`, render a fallback paragraph:
   "No open houses scheduled this week. Check back Friday — I post
   the next round of times then." (Keep this string editable as a
   constant at the top of the file.)
7. If [OPEN_HOUSE_SOURCE] is "Instagram only", render a final muted
   line linking to the agent's Instagram for the most current list.
   Use `[INSTAGRAM_URL]` from intake §8.

The component must compile under `npx tsc --noEmit`. No emoji.
```

### Variant 7b — Past-listings photo carousel (when public schedule is "no")

```
<!-- Paste into Claude Opus -->
Generate a responsive past-listings photo gallery. The operator will
replace placeholder paths with real images after running this prompt.

Inputs:
- Agent display name: [AGENT_NAME]
- Trade region: [TRADE_REGION]
- Photo themes the agent wants represented: [PHOTO_THEMES]
- Number of photos to render: [PHOTO_COUNT] (between 4 and 9; pick 6 if
  unspecified)

Output a single TSX file at `src/components/sections/Gallery.tsx` that
exports `Gallery`. Requirements:

1. Use `SectionShell` (variant="ink") with H2 "Recent work,
   [TRADE_REGION]".
2. A CSS-grid `<ul>` (Tailwind: `grid-cols-1 md:grid-cols-3 gap-4`) with
   `<li>` items.
3. Each `<li>` contains a `next/image` `<Image>` with:
   - `src={'/images/gallery-' + (i + 1) + '.jpg'}` (placeholder path the
     operator replaces).
   - `width={800}`, `height={600}`.
   - `alt` text generated from the photo theme — be specific (e.g.
     "Open-house at golden hour, [TRADE_REGION]"). No "image of" or
     "photo of" prefixes.
   - `className="rounded-md object-cover w-full h-auto"`.
4. Lazy-load by default (Next.js handles this; do not pass `priority`).
5. JSDoc at the top listing the expected paths so the operator knows
   what to drop into `public/images/`.
6. If sold-stats policy = "No": include a one-line muted disclaimer
   below the grid: "Sold prices not displayed in keeping with seller
   privacy." — read [SOLD_PRICE_POLICY] from intake §5.

The component must compile under `npx tsc --noEmit`. No emoji.
```

**Acceptance criteria (both variants):**
- Compiles under `npx tsc --noEmit`.
- No real listing photos committed to the repo at this stage; only placeholder paths.
- Sold-stats disclaimer renders when §5 policy = "No".

---

## Prompt 8 — SEO metadata

**Destination:** the `metadata` export at the top of the page file (`src/app/page.tsx` for a single-page client; `src/app/[client-slug]/page.tsx` if mounted under a slug).

```
<!-- Paste into Claude Opus -->
Generate the Next.js `metadata` export for a single-agent realtor
homepage.

Inputs:
- Agent display name: [AGENT_NAME]
- Brokerage legal name: [BROKERAGE_NAME]
- Trade region: [TRADE_REGION]
- Province: [PROVINCE]
- Listing-mix dominant category (derive from [LISTING_MIX] — the
  category with the highest %): [LISTING_DOMINANT]
- Domain (or "https://example.com" placeholder): [DOMAIN]

Output a typed `Metadata` export from Next.js, exactly in this shape:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "[≤ 60 chars — agent name + trade region; brokerage if it fits]",
  description: "[≤ 155 chars — names trade region, dominant listing category, and one specific reason a reader would call this agent over a generic search]",
  openGraph: {
    title: "[same as title]",
    description: "[same as description]",
    url: "[DOMAIN]",
    siteName: "[AGENT_NAME]",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "[AGENT_NAME], [BROKERAGE_NAME], [TRADE_REGION]",
      },
    ],
    locale: "en_CA",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "[same as title]",
    description: "[same as description]",
    images: ["/og-image.jpg"],
  },
};
```

Constraints:
- Description must read naturally — not a keyword salad — and must NOT
  use any of: "best", "premier", "leading", "top-rated", "luxury",
  "world-class", "concierge", "your trusted advisor", "passionate".
- Title ends with `| [TRADE_REGION]` if it fits inside 60 chars; drop
  trade region if it would push past.
- The brokerage name is allowed to wrap into the description if it
  fits inside 155 chars after the trade region; otherwise drop it.
- `type: "profile"` is intentional — the homepage represents a person,
  not a website-wide brand.
```

**Acceptance criteria:**
- Title ≤ 60 chars; description ≤ 155 chars.
- No banned superlative appears.
- The `og.alt` field names the agent + brokerage + trade region.

---

## Prompt 9 — JSON-LD structured data (`RealEstateAgent` + `Person`)

**Destination:** the page file (`src/app/page.tsx`), rendered alongside the page content as a `<JsonLd>` block.

```
<!-- Paste into Claude Opus -->
Generate a typed JSON-LD `RealEstateAgent` schema (with embedded
`Person` for the individual agent and `RealEstateAgency` for the
brokerage) using the `JsonLd` component at
`src/components/primitives/JsonLd.tsx`. Type imports come from
`schema-dts`.

Inputs (from the intake form):
- Agent display name: [AGENT_NAME]
- Agent first name: [AGENT_FIRST_NAME]
- Agent regulator licence number: [REGULATOR_LICENCE_NUMBER]
- Regulator name: [REGULATOR_NAME]
- Brokerage legal name: [BROKERAGE_NAME]
- Brokerage address (full): [BROKERAGE_ADDRESS]  (parse into
  streetAddress, addressLocality, addressRegion, postalCode,
  addressCountry — addressCountry is "CA" unless province says
  otherwise)
- Brokerage phone (display form): [BROKERAGE_PHONE]
- Province: [PROVINCE]
- Trade region: [TRADE_REGION]
- Languages spoken: [LANGUAGES]
- Phone (E.164): [PHONE_E164]
- Email: [EMAIL_PUBLIC]
- Domain: [DOMAIN]
- Instagram URL: [INSTAGRAM_URL]
- Other social links: [OTHER_SOCIALS]
- Up to six neighbourhoods served: [NEIGHBOURHOODS_SERVED]

Output a TSX snippet that:

1. Imports:
   ```ts
   import { JsonLd } from "@/components/primitives/JsonLd";
   import type { WithContext, RealEstateAgent } from "schema-dts";
   ```
2. Defines an `agentSchema: WithContext<RealEstateAgent>` constant with
   these fields:
   - `@context: "https://schema.org"`
   - `@type: "RealEstateAgent"`
   - `name: "[AGENT_NAME]"`
   - `url: "[DOMAIN]"`
   - `telephone: "[PHONE_E164]"`
   - `email: "[EMAIL_PUBLIC]"`
   - `knowsLanguage` — array of language strings parsed from [LANGUAGES]
   - `areaServed` — array of `Place` objects, one per neighbourhood in
     [NEIGHBOURHOODS_SERVED] (each with `@type: "Place"` + `name`).
   - `worksFor` — embedded `RealEstateAgency` object with the
     brokerage's name, full nested `PostalAddress`, and `telephone`.
   - `identifier` — single object with
     `{ "@type": "PropertyValue", propertyID: "[REGULATOR_NAME] licence",
        value: "[REGULATOR_LICENCE_NUMBER]" }`.
   - `sameAs` — array containing the Instagram URL plus any other
     social URLs from [OTHER_SOCIALS].
3. Renders `<JsonLd data={agentSchema} />`.

Constraints:
- Do not stringify upstream — the `JsonLd` component handles
  serialization.
- All fields must come verbatim from the intake form. Never invent a
  regulator licence number, brokerage name, or address.
- If `[REGULATOR_LICENCE_NUMBER]` or `[BROKERAGE_NAME]` is the literal
  string "[unknown — follow up]", STOP — emit a comment at the top of
  the file: `// TODO(operator): regulator licence / brokerage name
  missing from intake — do not deploy until §2 is filled.` and leave
  the offending field blank. Do NOT guess.
- Output must compile under `npx tsc --noEmit` against `schema-dts`.
```

**Acceptance criteria:**
- Compiles under `npx tsc --noEmit`.
- `identifier` carries the regulator licence verbatim.
- `worksFor` is a fully-typed nested `RealEstateAgency` (no flat string).
- TODO blocker emitted if regulator / brokerage fields are missing.

---

## Prompt 10 — Contact / lead-capture section

**Destination:** `src/components/sections/Contact.tsx`. **Important:** this prompt only modifies the *visible form wrapper*. The contact API endpoint (`src/app/api/contact/`) is out of scope and is NEVER touched by these prompts.

```
<!-- Paste into Claude Opus -->
Generate a "Contact" section that wraps the existing `ContactForm`
component (`src/components/sections/ContactForm.tsx`) with realtor-
specific copy.

Inputs:
- Agent first name: [AGENT_FIRST_NAME]
- Trade region: [TRADE_REGION]
- Brokerage legal name: [BROKERAGE_NAME]
- Primary CTA chosen in §6: [PRIMARY_CTA]
- Privacy contact email (PIPEDA): [PRIVACY_CONTACT_EMAIL]

Output a single TSX file at `src/components/sections/Contact.tsx` that
exports `Contact`. Requirements:

1. Use `SectionShell` (variant="canvas").
2. H2 — pick one based on [PRIMARY_CTA]:
   - Book a call → "Get in touch"
   - Get a valuation → "Tell me about your home"
   - Browse listings → "What are you looking for?"
   - Send a note → "Send a note"
3. Subheading — one sentence, ≤ 22 words, name-checking [TRADE_REGION]
   once and using a working-life detail (not a slogan).
4. Render `<ContactForm />` (import from `@/components/sections/ContactForm`).
5. Inside the form rendering — DO NOT modify ContactForm itself —
   render an adjacent
   `<input type="hidden" name="vertical" value="realtor" />` so
   submissions are tagged on the operator's inbox side. If
   `ContactForm` doesn't accept extra slots, leave a TODO comment
   noting the operator should add a `vertical` prop to ContactForm in
   a separate issue rather than editing the API route here.
6. Below the form, a 1-line muted privacy note:
   "Your details are sent to [BROKERAGE_NAME] and to me. Privacy
    questions: [PRIVACY_CONTACT_EMAIL]." — drop this line entirely if
   either input is the literal string "[unknown — follow up]".

DO NOT touch `src/app/api/contact/route.ts` or any file under
`src/app/api/contact/`. The API route is high-stakes and out of scope.
No emoji.
```

**Acceptance criteria:**
- Hidden `vertical=realtor` input is rendered as a sibling of `<ContactForm />`, never inside it.
- Privacy note appears only when both brokerage and PIPEDA email are populated.
- No file under `src/app/api/contact/` is touched.

---

## Prompt 11 — Home-valuation lead magnet *(only if §6 PRIMARY_CTA = valuation OR SECONDARY_LEAD_MAGNET = neighbourhood report)*

**Destination:** `src/components/sections/HomeValuation.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a "What's my home worth?" lead-magnet section. Only run this
prompt if intake §6 PRIMARY_CTA = "Get a valuation" OR
SECONDARY_LEAD_MAGNET = "Neighbourhood report (PDF)".

Inputs:
- Agent first name: [AGENT_FIRST_NAME]
- Trade region: [TRADE_REGION]
- Brokerage legal name: [BROKERAGE_NAME]
- Privacy contact email: [PRIVACY_CONTACT_EMAIL]

Output a single TSX file at `src/components/sections/HomeValuation.tsx`
that exports `HomeValuation`. Requirements:

1. Use `SectionShell` (variant="parchment").
2. H2 — "What's your home worth in [TRADE_REGION]?"
3. Prose block (≤ 60 words) — what the agent will send back, in what
   timeframe (default: "within two business days"), and a one-line
   honest disclaimer that this is an opinion of value, not an
   appraisal. Banned: "instant valuation", "guaranteed", "no
   obligation", "free" (the price expectation should be obvious from
   context, not pushed).
4. A form with these fields ONLY (no extras):
   - `address` (text, required, label "Property address")
   - `bedrooms` (number, optional, label "Bedrooms")
   - `bathrooms` (number, optional, label "Bathrooms")
   - `email` (email, required, label "Where to send the estimate")
   - `name` (text, optional, label "Your name")
5. The form posts to `/api/contact` with a hidden
   `<input type="hidden" name="form" value="home-valuation" />`. DO
   NOT create or edit `src/app/api/contact/route.ts` — leave a TODO
   comment noting the operator must wire the `form=home-valuation`
   case in the existing handler in a separate issue.
6. Below the form, a 1-line muted privacy line:
   "Your address is sent to [BROKERAGE_NAME] and to me. Privacy
    questions: [PRIVACY_CONTACT_EMAIL]." — drop entirely if either
   input is "[unknown — follow up]".

The component must compile under `npx tsc --noEmit`. No emoji.
```

**Acceptance criteria:**
- File compiles under `npx tsc --noEmit`.
- No edit to `src/app/api/contact/`.
- Honest "opinion of value, not an appraisal" disclaimer is present.
- No banned phrase ("instant valuation", "guaranteed", "no obligation", "free") appears.

---

## Prompt 12 — Buyer-guide download CTA *(only if §6 SECONDARY_LEAD_MAGNET = first-time buyer guide)*

**Destination:** `src/components/sections/BuyerGuideCTA.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a "First-time buyer guide" download CTA using the existing
`CTABlock` primitive. Only run this prompt if intake §6
SECONDARY_LEAD_MAGNET = "First-time buyer guide (PDF)".

Inputs:
- Agent first name: [AGENT_FIRST_NAME]
- Province: [PROVINCE]
- Trade region: [TRADE_REGION]

Output a single TSX file at `src/components/sections/BuyerGuideCTA.tsx`
that exports `BuyerGuideCTA`. Requirements:

1. Render `<CTABlock />` (import from `@/components/primitives/CTABlock`)
   with props matching its real interface:
   `{ headline, subhead?, ctaLabel, ctaHref, variant?: 'ink' | 'canvas' | 'parchment' }`.
2. `headline` — name the audience and the province in ≤ 10 words
   (e.g. "First home in [PROVINCE]? Start here.").
3. `subhead` — one sentence, ≤ 24 words, naming what the guide covers
   (down-payment math, land-transfer tax for the province, closing-day
   timeline) and rooted in [TRADE_REGION].
4. `ctaLabel` — at most 3 words. Action verb. Examples: "Read the
   guide", "Download it".
5. `ctaHref="/buyer-guide.pdf"` (the operator drops the actual PDF
   into `public/buyer-guide.pdf`; this prompt does not generate the
   PDF).
6. `variant="ink"` for high contrast.

No emoji. No exclamation marks.
```

**Acceptance criteria:**
- The CTA targets `/buyer-guide.pdf` (file delivery is operator-side).
- Headline names the province; subhead roots in the trade region.
- File compiles under `npx tsc --noEmit`.

---

## Operator notes after running all 12

1. Type-check & lint:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```
2. Open the dev server and walk every section in `npm run dev`.
3. Verify the JSON-LD with Google's [Rich Results Test](https://search.google.com/test/rich-results) before pushing — `RealEstateAgent` parses cleanly when `worksFor` and `identifier` are present.
4. Compliance walk before launch:
   - Brokerage legal name visible on the homepage (footer counts).
   - Regulator licence number visible (footer counts; usually beside the brokerage line).
   - REALTOR® / MLS® disclaimer present if §2 CREA member = yes.
   - Sold-price treatment matches §5 policy (no numeric prices on sold listings unless §5 policy = "Yes, with seller written consent").
5. Update the "Prompts run" checklist in `docs/clients/<slug>/intake.md`.
6. Open a PR titled `feat(<slug>): realtor content scaffold`.

If any prompt's output looks generic (the "AI smell" — "delve", "tapestry", "your trusted advisor", "luxury lifestyle"), reject it and re-run with a tightened input. Quality beats throughput here; the prompts are cheap, the operator's reputation is not.
