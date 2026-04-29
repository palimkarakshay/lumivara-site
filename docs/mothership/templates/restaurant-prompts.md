<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY PROMPT PACK

  Restaurant content prompts for Claude Opus.

  Hard rules:
    1. Do NOT paste these prompts into a client-shared chat.
    2. The *outputs* (hero copy, MDX, JSON-LD) ship into the client repo.
       The *prompts* never leave this folder.
    3. Run prompts sequentially — later ones depend on earlier outputs
       (the JSON-LD prompt reads back the hours table, etc.).

  See `00-templates-index.md` for the workflow and
  `restaurant-intake-form.md` for the field definitions.
================================================================================
-->

# Restaurant — content prompts (Claude Opus)

This file is a sequence of 12 prompts (10 required + 2 conditional) that turn a filled `restaurant-intake-form.md` into a complete restaurant site. Each prompt is self-contained, fenced, and labelled with the destination filepath in the client repo.

## Before you start

1. **Fill the intake form first.** Every `[BRACKET_FIELD]` below comes from `restaurant-intake-form.md`. If a field is empty, stop and follow up with the client — do not let Opus invent it.
2. **One prompt = one fresh Opus chat.** Pasting them all at once dilutes the per-section context. Open a new chat per prompt.
3. **Substitute brackets with find-replace.** Open the prompt in your editor, do `[BUSINESS_NAME]` → real value (etc.), then paste the result into Claude.
4. **Review every output before pasting into the client repo.** The voice is the operator's reputation; treat outputs like junior-writer drafts, not finished copy.
5. **House style:** sensory but restrained, no emoji, no exclamation marks, no "AI-isms" ("delve", "tapestry", "ever-evolving"). Owner's voice is first-person plural ("we") unless the intake says otherwise.
6. **Component primitives** referenced below are real and live in the client repo at `src/components/primitives/`:
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
You are writing the hero section of a restaurant's homepage. The voice is warm,
sensory, and rooted in the neighbourhood. No emoji, no exclamation marks, no
generic restaurant clichés ("a culinary journey", "passion for food").

Inputs:
- Business name: [BUSINESS_NAME]
- Cuisine type: [CUISINE_TYPE]
- Signature dish: [SIGNATURE_DISH]
- Neighbourhood: [NEIGHBOURHOOD]
- Vibe adjectives (the owner's own words): [VIBE_ADJECTIVES]

Produce exactly three things:

1. Headline — at most 8 words. Concrete, sensory, not a slogan. It should read
   like the owner could say it out loud without flinching.
2. Subheadline — one sentence, max 22 words. Names the cuisine and the
   neighbourhood without listing them mechanically.
3. Primary CTA button text — at most 3 words. Action verb. Avoid "Learn more"
   and "Get started"; prefer "Reserve a table", "See the menu", "Visit us".

Return as a fenced TypeScript object literal so I can paste it directly:

```ts
export const hero = {
  headline: "...",
  subheadline: "...",
  ctaLabel: "...",
  ctaHref: "...",  // leave as "/menu" unless reservations are the primary CTA
};
```
```

---

## Prompt 2 — About / Our Story section

**Destination:** `src/content/about.mdx`.

```
<!-- Paste into Claude Opus -->
You are writing the "Our Story" section of a restaurant's About page. The
output is 120–180 words of MDX prose in the owner's first-person voice ("we").
Sensory and specific. No emoji, no exclamation marks.

Inputs:
- Owner name: [OWNER_NAME]
- Business name: [BUSINESS_NAME]
- Cuisine type: [CUISINE_TYPE]
- Vibe adjectives: [VIBE_ADJECTIVES]
- Personal backstory the owner shared (verbatim): [OWNER_BACKSTORY]
- Anything that makes them different: [DIFFERENTIATOR]

Constraints:
- Open with a concrete sensory hook (a sound, a smell, a texture) — not a
  date or a mission statement.
- Reference the neighbourhood once, by name.
- End with a sentence that reads like an invitation, not a sales close.
- Do NOT use the words: "passion", "journey", "experience" (as a noun),
  "culinary", "elevated", "destination".

Return as MDX, with a single H2 heading "Our story" at the top. No frontmatter
— the page wrapper handles that.
```

---

## Prompt 3 — Menu presentation MDX

**Destination:** `src/content/menu.mdx`.

```
<!-- Paste into Claude Opus -->
You are turning a restaurant's menu text into structured MDX, organised by
category (Starters / Mains / Desserts / Drinks). Use the existing `SectionShell`
and `GlassCard` primitives — assume they are imported at the top of the MDX
file.

Inputs:
- Business name: [BUSINESS_NAME]
- Pasted menu text from the intake form: [PASTE_MENU_HERE]
- "Must-order" items the owner wants featured first within their category:
  [MUST_ORDER_ITEMS]

Output requirements:
- One `<SectionShell variant="canvas" width="content">` per category.
- Inside each shell: a category H2, then a `<ul>` of `<GlassCard as="li">`
  cards, one per dish.
- Each card: dish name (h3), 1-line description (≤ 14 words), price as plain
  text on its own line. If the menu says "market price", render exactly that.
- Featured / must-order items appear first within their category and have
  `interactive` on their `<GlassCard>`.
- Do NOT invent dishes. If a description is missing in the input, output the
  dish name + price only, with no description line.
- Allergens: only render allergen tags if the input explicitly names them.

Return valid MDX. Do not include frontmatter — the page wrapper handles it.
```

---

## Prompt 4 — Hours, Location, and Directions section

**Destination:** `src/content/visit.mdx` (or a `<Visit>` section component in `src/components/sections/Visit.tsx`).

```
<!-- Paste into Claude Opus -->
You are writing the "Hours, Location, and Directions" section. Output MDX with
a structured hours table, a 2-sentence "How to find us" blurb, and a Google
Maps embed.

Inputs:
- Business name: [BUSINESS_NAME]
- Address (full): [ADDRESS]
- Neighbourhood: [NEIGHBOURHOOD]
- Hours table (use verbatim — 24h time, "closed" for closed days):
  [HOURS_TABLE]
- Parking notes: [PARKING_NOTES]

Output requirements:
1. H2 "Visit us".
2. A markdown table with three columns: Day, Open, Close. One row per day Mon
   through Sun. Render closed days as a single cell spanning Open+Close with
   the word "Closed".
3. A 2-sentence "How to find us" paragraph that names the neighbourhood once
   and includes the parking note if non-empty.
4. A Google Maps iframe directly after the paragraph:
   `<iframe src="https://maps.google.com/maps?q=[ENCODED_ADDRESS]&output=embed"
    width="100%" height="320" loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Map showing [BUSINESS_NAME] in [NEIGHBOURHOOD]"></iframe>`
   Replace `[ENCODED_ADDRESS]` with the URL-encoded form of the address.

Return valid MDX. No frontmatter.
```

---

## Prompt 5 — Reservations / Booking section

**Destination:** `src/components/sections/Reservations.tsx`.

Pick one variant based on the intake form's §4 booking method.

### Variant 5a — Phone-only bookings (default)

```
<!-- Paste into Claude Opus -->
Generate a "Reservations" section for a restaurant that takes reservations by
phone only. Walk-ins welcome.

Inputs:
- Business name: [BUSINESS_NAME]
- Phone display form: [PHONE_DISPLAY]
- Phone E.164 form: [PHONE_E164]

Output a single TSX component file at `src/components/sections/Reservations.tsx`
that exports `Reservations`. Use `SectionShell` (variant="parchment") and a
short prose block (≤ 50 words) inviting the reader to call. Render the phone
number as a `tel:` link using the E.164 form for the href and the display form
as the visible text. Add a 1-line "Walk-ins welcome" subnote in muted text.
No emoji.
```

### Variant 5b — OpenTable embed

```
<!-- Paste into Claude Opus -->
Generate a "Reservations" section for a restaurant that takes reservations via
OpenTable. The OpenTable widget script must be added by the operator to
`src/app/layout.tsx` <head> separately (see note at end).

Inputs:
- Business name: [BUSINESS_NAME]
- OpenTable restaurant ID: [OT_RESTAURANT_ID]
- Phone display form (fallback): [PHONE_DISPLAY]
- Phone E.164 form: [PHONE_E164]

Output a single TSX component file at `src/components/sections/Reservations.tsx`
that exports `Reservations`. Use `SectionShell` (variant="parchment") with:
1. A short prose block (≤ 40 words) introducing the reservation flow.
2. A placeholder JSX comment exactly as written:
   `{/* <OpenTableWidget restaurantId="[OT_RESTAURANT_ID]" /> — add the widget
    script in src/app/layout.tsx <head> per OpenTable instructions */}`
3. A "Or call us" fallback line with a `tel:` link, using the E.164 form for
   href and the display form as visible text.

At the very end of the file, include a TODO comment block with the exact
OpenTable script tag the operator must paste into `src/app/layout.tsx`.
No emoji.
```

---

## Prompt 6 — Testimonials / Reviews section

**Destination:** `src/components/sections/Testimonials.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a "Testimonials" section that renders three review cards plus matching
JSON-LD `Review` schema. Voice: lift quotes verbatim — do not rewrite them.

Inputs (from intake form §8 — three review rows):
- Business name: [BUSINESS_NAME]
- Review 1: quote=[R1_QUOTE], name=[R1_NAME], context=[R1_CONTEXT], rating=[R1_RATING]
- Review 2: quote=[R2_QUOTE], name=[R2_NAME], context=[R2_CONTEXT], rating=[R2_RATING]
- Review 3: quote=[R3_QUOTE], name=[R3_NAME], context=[R3_CONTEXT], rating=[R3_RATING]

Output a single TSX file at `src/components/sections/Testimonials.tsx` that
exports `Testimonials`. Requirements:

1. Use `SectionShell` (variant="canvas").
2. Render a 3-up grid (1-up on mobile) of `<GlassCard as="article">` cards.
3. Each card: blockquote with the quote, attribution line "— [name],
   [context]", and a star-rating row rendered as filled / empty stars matching
   `rating` (use the `lucide-react` `Star` icon, filled = `fill="currentColor"`
   on the accent colour, empty = stroke only).
4. Below the grid, render a `<JsonLd>` block (import from
   `@/components/primitives/JsonLd`) with `data` typed as
   `WithContext<Restaurant>` and a populated `aggregateRating` object plus a
   `review` array containing each of the three reviews as `Review` schema
   objects (`@type: "Review"`, `reviewRating`, `author`, `reviewBody`).
5. The component must compile under `npx tsc --noEmit` — import `Star` from
   `lucide-react` and `WithContext`, `Restaurant`, `Review` types from
   `schema-dts`.

No emoji.
```

---

## Prompt 7 — Photo Gallery section

**Destination:** `src/components/sections/Gallery.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a responsive photo gallery section that uses Next.js `next/image`.
Layout: 3-up grid on desktop (`md:` breakpoint), 1-up on mobile. The operator
will replace the placeholder paths with real images after running this prompt.

Inputs:
- Business name: [BUSINESS_NAME]
- Photo themes the owner wants represented: [PHOTO_THEMES]
- Number of photos to render: [PHOTO_COUNT] (between 3 and 9; pick 6 if
  unspecified)

Output a single TSX file at `src/components/sections/Gallery.tsx` that exports
`Gallery`. Requirements:

1. Use `SectionShell` (variant="ink") with an H2 "Inside [BUSINESS_NAME]".
2. A CSS-grid `<ul>` (Tailwind: `grid-cols-1 md:grid-cols-3 gap-4`) with
   `<li>` items.
3. Each `<li>` contains a `next/image` `<Image>` with:
   - `src={'/images/gallery-' + (i + 1) + '.jpg'}` (placeholder path the
     operator replaces).
   - `width={800}`, `height={600}`.
   - `alt` text generated from the photo theme — be specific (e.g. "Wood-fired
     oven mid-bake at [BUSINESS_NAME]"). No "image of" or "photo of" prefixes.
   - `className="rounded-md object-cover w-full h-auto"`.
4. Lazy-load by default (Next.js handles this automatically; do not pass
   `priority`).
5. At the top of the file, include a JSDoc comment block listing the expected
   photo paths so the operator knows what to drop into `public/images/`.

The component must compile under `npx tsc --noEmit`. No emoji.
```

---

## Prompt 8 — SEO metadata

**Destination:** the `metadata` export at the top of the page file (`src/app/page.tsx` for a single-page client; `src/app/[client-slug]/page.tsx` if mounted under a slug).

```
<!-- Paste into Claude Opus -->
Generate the Next.js `metadata` export for a restaurant homepage.

Inputs:
- Business name: [BUSINESS_NAME]
- Cuisine type: [CUISINE_TYPE]
- Neighbourhood: [NEIGHBOURHOOD]
- City: [CITY]
- Domain (or "https://example.com" placeholder): [DOMAIN]

Output a typed `Metadata` export from Next.js, exactly in this shape:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "[≤ 60 chars — must include business name and cuisine]",
  description: "[≤ 155 chars — names cuisine, neighbourhood, and what makes it specific]",
  openGraph: {
    title: "[same as title]",
    description: "[same as description]",
    url: "[DOMAIN]",
    siteName: "[BUSINESS_NAME]",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "[BUSINESS_NAME] in [NEIGHBOURHOOD]",
      },
    ],
    locale: "en_CA",
    type: "website",
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
- Description must read naturally — not a keyword salad.
- Do NOT use the words "best", "premier", "leading", or any superlative.
- Title must end with `| [CITY]` if the title is under 50 chars; drop the
  city if it would push past 60.
```

---

## Prompt 9 — JSON-LD structured data (LocalBusiness + Restaurant)

**Destination:** the page file (`src/app/page.tsx`), rendered alongside the page content as a `<JsonLd>` block.

```
<!-- Paste into Claude Opus -->
Generate a typed JSON-LD `Restaurant` schema using the `JsonLd` component at
`src/components/primitives/JsonLd.tsx`. Type imports come from `schema-dts`.

Inputs (from the intake form):
- Business name: [BUSINESS_NAME]
- Address: [ADDRESS]  (parse into streetAddress, addressLocality, addressRegion, postalCode, addressCountry)
- City: [CITY]
- Phone (E.164): [PHONE_E164]
- Cuisine: [CUISINE_TYPE]
- Price range: [PRICE_RANGE]  (one of `$`, `$$`, `$$$`, `$$$$`)
- Hours table (24h, closed-aware):  [HOURS_TABLE]
- Domain: [DOMAIN]
- Instagram URL: [INSTAGRAM_URL]
- Other social links: [OTHER_SOCIALS]

Output a TSX snippet that:

1. Imports:
   ```ts
   import { JsonLd } from "@/components/primitives/JsonLd";
   import type { WithContext, Restaurant } from "schema-dts";
   ```
2. Defines a `restaurantSchema: WithContext<Restaurant>` constant with these
   fields:
   - `@context: "https://schema.org"`
   - `@type: "Restaurant"`
   - `name`, `url`, `telephone`
   - `address` as a nested `PostalAddress` object
   - `servesCuisine` as a string or array
   - `priceRange`
   - `openingHoursSpecification` — one entry per open day, using
     `dayOfWeek: "https://schema.org/Monday"` (etc.) full URLs and 24h
     `opens` / `closes` strings. Skip closed days.
   - `sameAs` — array of social URLs.
3. Renders `<JsonLd data={restaurantSchema} />`.

Constraints:
- Do not stringify upstream — the `JsonLd` component handles serialization.
- All hours must come verbatim from the intake form. Do not invent days.
- Output must compile under `npx tsc --noEmit` against `schema-dts`.
```

---

## Prompt 10 — Contact / intake form section

**Destination:** `src/components/sections/Contact.tsx`. **Important:** this prompt only modifies the *visible form wrapper*. The contact API endpoint (`src/app/api/contact/`) is out of scope and is NEVER touched by these prompts.

```
<!-- Paste into Claude Opus -->
Generate a "Contact" section that wraps the existing `ContactForm` component
(`src/components/sections/ContactForm.tsx`) with restaurant-specific copy.

Inputs:
- Business name: [BUSINESS_NAME]
- Vibe adjectives: [VIBE_ADJECTIVES]
- Preferred contact method (from intake §4): [PREFERRED_CONTACT_METHOD]

Output a single TSX file at `src/components/sections/Contact.tsx` that exports
`Contact`. Requirements:

1. Use `SectionShell` (variant="canvas").
2. H2 — pick one based on the preferred contact method:
   - Phone-first → "Get in touch"
   - Form-first → "Send us a message"
   - Instagram-first → "Drop us a line"
3. Subheading — one sentence, ≤ 20 words, name-checking [BUSINESS_NAME] once
   and using a sensory word from [VIBE_ADJECTIVES].
4. Render `<ContactForm />` (import from `@/components/sections/ContactForm`).
5. Inside the form rendering — DO NOT modify ContactForm itself — render an
   adjacent `<input type="hidden" name="vertical" value="restaurant" />` so
   submissions are tagged on the operator's inbox side. If `ContactForm`
   doesn't accept extra slots, leave a TODO comment noting the operator should
   add a `vertical` prop to ContactForm in a separate issue rather than
   editing the API route here.

DO NOT touch `src/app/api/contact/route.ts` or any file under
`src/app/api/contact/`. The API route is high-stakes and out of scope.
No emoji.
```

---

## Prompt 11 — Newsletter / Specials sign-up section *(only if intake §9 newsletter = yes)*

**Destination:** `src/components/sections/Newsletter.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a "Join our mailing list" section. Only run this prompt if the intake
form §9 says newsletter = yes.

Inputs:
- Business name: [BUSINESS_NAME]
- Vibe adjectives: [VIBE_ADJECTIVES]

Output a single TSX file at `src/components/sections/Newsletter.tsx` that
exports `Newsletter`. Requirements:

1. Use `SectionShell` (variant="parchment").
2. Headline — ≤ 8 words, action-oriented but not pushy. Examples: "Specials,
   straight to your inbox", "Be first to the seasonal menu".
3. Subheadline — one sentence, ≤ 22 words. References [BUSINESS_NAME] once
   and uses one word from [VIBE_ADJECTIVES].
4. Use the existing `NewsletterSignup` component if it exists at
   `@/components/sections/NewsletterSignup`. If it does not exist, leave a
   TODO comment naming the missing component and stop — DO NOT invent a new
   email-capture flow here (that would touch backend wiring out of scope).

No emoji. No "weekly" or "monthly" cadence claims unless the intake explicitly
specifies one.
```

---

## Prompt 12 — Specials / Promotions CTA section *(only if intake §9 promotion = yes)*

**Destination:** `src/components/sections/Promo.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a promotional CTA section using the existing `CTABlock` primitive.
Only run this prompt if the intake form §9 promotion = yes.

Inputs:
- Business name: [BUSINESS_NAME]
- Promotion name: [PROMO_NAME]  (e.g. "Happy Hour", "Sunday Brunch")
- Promotion details: [PROMO_DETAILS]  (when, what, price)
- Where the CTA should land: [PROMO_CTA_HREF]  (e.g. "#menu", "/reservations")

Output a single TSX file at `src/components/sections/Promo.tsx` that exports
`Promo`. Requirements:

1. Render `<CTABlock />` (import from `@/components/primitives/CTABlock`) with
   props matching its real interface:
   `{ headline, subhead?, ctaLabel, ctaHref, variant?: 'ink' | 'canvas' | 'parchment' }`.
2. `headline` — the promotion name + a 2–4 word hook. Max 10 words total.
3. `subhead` — one sentence, ≤ 22 words, naming the timing and the offer.
4. `ctaLabel` — at most 3 words, action verb. Examples: "See the menu",
   "Reserve a seat".
5. `ctaHref` — set to [PROMO_CTA_HREF].
6. `variant="ink"` for high contrast.

No emoji. No exclamation marks.
```

---

## Operator notes after running all 12

1. Type-check & lint:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```
2. Open the dev server and walk every section in `npm run dev`.
3. Verify the JSON-LD with Google's [Rich Results Test](https://search.google.com/test/rich-results) before pushing.
4. Update the "Prompts run" checklist in `docs/clients/<slug>/intake.md`.
5. Open a PR titled `feat(<slug>): restaurant content scaffold`.

If any prompt's output looks generic (the "AI smell" — "delve", "tapestry",
"culinary journey"), reject it and re-run with a tightened input. Quality
beats throughput here; the prompts are cheap, the operator's reputation is
not.
