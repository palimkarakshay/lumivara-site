<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY PROMPT PACK

  Plumbing / trades content prompts for Claude Opus.

  Hard rules:
    1. Do NOT paste these prompts into a client-shared chat.
    2. The *outputs* (hero copy, MDX, JSON-LD) ship into the client repo.
       The *prompts* never leave this folder.
    3. Run prompts sequentially — later ones depend on earlier outputs
       (the JSON-LD prompt reads back the hours table, etc.).

  See `00-templates-index.md` for the workflow and
  `plumber-intake-form.md` for the field definitions.
================================================================================
-->

# Plumbing / trades — content prompts (Claude Opus)

This file is a sequence of 12 prompts (10 required + 2 conditional) that turn a filled `plumber-intake-form.md` into a complete plumbing / trades site. Each prompt is self-contained, fenced, and labelled with the destination filepath in the client repo.

## Before you start

1. **Fill the intake form first.** Every `[BRACKET_FIELD]` below comes from `plumber-intake-form.md`. If a field is empty, stop and follow up with the client — do not let Opus invent it (especially licence numbers, insurance limits, or response-time claims, which are legal liabilities if wrong).
2. **One prompt = one fresh Opus chat.** Pasting them all at once dilutes the per-section context. Open a new chat per prompt.
3. **Substitute brackets with find-replace.** Open the prompt in your editor, do `[BUSINESS_NAME]` → real value (etc.), then paste the result into Claude.
4. **Review every output before pasting into the client repo.** The voice is the operator's reputation; treat outputs like junior-writer drafts, not finished copy. For a trades client, also verify any factual claim about licensing, insurance, response time, or warranty against the intake answers — those are the claims that get a contractor in trouble.
5. **House style:** plain-spoken, blue-collar-respectful, no hype, no emoji, no exclamation marks, no "AI-isms" ("delve", "tapestry", "best-in-class"). Owner's voice is first-person plural ("we") for crews and first-person singular ("I") for owner-operators — check `[CREW_SIZE]`.
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
You are writing the hero section of a plumbing / trades business homepage. The
voice is plain-spoken, calm, and reassuring — the kind of voice a homeowner
wants to hear when their basement is filling with water. No emoji, no
exclamation marks, no hype words ("best", "premier", "leading"), no clichés
("your trusted partner", "rooted in quality").

Inputs:
- Business name: [BUSINESS_NAME]
- Trade focus: [TRADE_FOCUS]
- Primary city: [PRIMARY_CITY]
- Years in the trade: [YEARS_IN_TRADE]
- Top 3 most-booked services: [TOP_SERVICES]
- Emergency service level (none / business-hours-only / extended-evenings / 24/7): [EMERGENCY_SERVICE]
- Typical emergency response window: [EMERGENCY_RESPONSE_WINDOW]

Produce exactly three things:

1. Headline — at most 9 words. Concrete, names the trade and the city.
   Avoid slogans. It should read like the owner could say it on the phone
   without flinching.
2. Subheadline — one sentence, max 24 words. Names the trade focus, the
   service area, and either the emergency response time (if [EMERGENCY_SERVICE]
   is `24/7` or `extended-evenings`) or the years in the trade.
3. Primary CTA button text — at most 3 words. Action verb. Prefer
   "Call now", "Book a visit", "Get a quote". Avoid "Learn more" and
   "Get started".

Return as a fenced TypeScript object literal so I can paste it directly:

```ts
export const hero = {
  headline: "...",
  subheadline: "...",
  ctaLabel: "...",
  ctaHref: "...",  // "tel:[PHONE_E164]" if emergency is 24/7, else "/contact"
};
```
```

---

## Prompt 2 — About / Our Story section

**Destination:** `src/content/about.mdx`.

```
<!-- Paste into Claude Opus -->
You are writing the "Our Story" section of a plumbing / trades business About
page. The output is 120–180 words of MDX prose. Voice: first-person plural
("we") for a crew of 2 or more; first-person singular ("I") if [CREW_SIZE]
indicates owner-operator. Plain-spoken, no hype, no emoji, no exclamation
marks.

Inputs:
- Owner name: [OWNER_NAME]
- Business name: [BUSINESS_NAME]
- Trade focus: [TRADE_FOCUS]
- Years in the trade: [YEARS_IN_TRADE]
- Crew size: [CREW_SIZE]
- Primary city: [PRIMARY_CITY]
- How the owner got into the trade (verbatim from intake): [OWNER_BACKSTORY]
- Anything that makes them different: [DIFFERENTIATOR]

Constraints:
- Open with a concrete moment from the trade — a job, a callback, a lesson.
  Not a date, not a mission statement, not "Welcome to ...".
- Reference the city or service area once.
- If the licence number is publicly displayable, mention "licensed and
  insured" in plain language (not "fully licensed and bonded" — that reads
  as filler).
- End with a sentence that invites a call without sounding like a sales close.
- Do NOT use the words: "passion", "journey", "trusted", "premier",
  "best-in-class", "expert" (as a self-label), "no job too small".

Return as MDX, with a single H2 heading "Our story" at the top. No
frontmatter — the page wrapper handles that.
```

---

## Prompt 3 — Services list section

**Destination:** `src/content/services.mdx`.

```
<!-- Paste into Claude Opus -->
You are turning a plumbing / trades business's service catalogue into
structured MDX, organised into four buckets: Emergency, Repair, Install,
Maintenance. Use the existing `SectionShell` and `GlassCard` primitives —
assume they are imported at the top of the MDX file.

Inputs:
- Business name: [BUSINESS_NAME]
- Trade focus: [TRADE_FOCUS]
- Pasted services list from the intake form: [PASTE_SERVICES_HERE]
- Top 3 most-booked services to feature: [TOP_SERVICES]
- Services they explicitly do NOT do: [SERVICES_DO_NOT_DO]
- Pricing model (flat-rate / hourly / hybrid): [PRICING_MODEL]
- Diagnostic / call-out fee: [DIAGNOSTIC_FEE]

Output requirements:
- One `<SectionShell variant="canvas" width="content">` per non-empty bucket
  (Emergency / Repair / Install / Maintenance). Skip a bucket entirely if no
  service maps to it.
- Inside each shell: a bucket H2 (e.g. "Emergency"), then a `<ul>` of
  `<GlassCard as="li">` cards, one per service.
- Each card: service name (h3), 1-line description (≤ 18 words, plain
  language — "we clear blocked drains" not "drain remediation services").
  Do NOT print prices on individual cards (pricing varies by job and
  printing single numbers creates dispute risk).
- Featured / top-3 services appear first within their bucket and have
  `interactive` on their `<GlassCard>`.
- Below all four buckets, render a single short paragraph (≤ 40 words)
  naming the pricing model in plain language and the diagnostic fee. Example:
  "Flat-rate quotes on every job. $95 diagnostic, waived if we proceed with
  the work." Do NOT invent a fee — use [DIAGNOSTIC_FEE] verbatim or omit
  the line.
- Do NOT invent services. If the input is empty for a bucket, skip the
  bucket entirely (do not write "coming soon" or similar).
- If [SERVICES_DO_NOT_DO] is non-empty, render a final muted-text line:
  "We don't take on: [list]." This sets expectations and reduces
  unqualified leads.

Return valid MDX. Do not include frontmatter — the page wrapper handles it.
```

---

## Prompt 4 — Service area & response time section

**Destination:** `src/content/service-area.mdx` (or a `<ServiceArea>` section component in `src/components/sections/ServiceArea.tsx`).

```
<!-- Paste into Claude Opus -->
You are writing the "Service area & response time" section. Output MDX with
a service-area description, a response-time table, and (if a shop address is
publishable) a Google Maps embed.

Inputs:
- Business name: [BUSINESS_NAME]
- Primary city: [PRIMARY_CITY]
- Service area description: [SERVICE_AREA]
- Hard limits — areas they will NOT travel to: [SERVICE_AREA_LIMITS]
- Travel-fee policy: [TRAVEL_FEE_POLICY]
- Standard hours table (24h time, "closed" for closed days): [HOURS_TABLE]
- Emergency service level: [EMERGENCY_SERVICE]
- Typical non-emergency response window: [RESPONSE_WINDOW]
- Typical emergency response window: [EMERGENCY_RESPONSE_WINDOW]
- Shop / dispatch address (or `[home-based, do not publish]`): [SHOP_ADDRESS]

Output requirements:
1. H2 "Service area".
2. A 2–3 sentence paragraph naming the cities or postal-code prefixes
   served. Mention the travel-fee policy in plain language only if it is
   non-empty and not "no fee". If [SERVICE_AREA_LIMITS] is non-empty, add
   a one-sentence note about the limit (e.g. "We don't travel west of
   Hamilton.").
3. H2 "Hours & response time".
4. A markdown table with three columns: Day, Open, Close. One row per day
   Mon through Sun. Render closed days as a single cell spanning Open+Close
   with the word "Closed".
5. A "What to expect" sub-block with two short lines:
   - "Standard calls: [RESPONSE_WINDOW]."
   - If [EMERGENCY_SERVICE] is `24/7` or `extended-evenings`:
     "Emergency calls: [EMERGENCY_RESPONSE_WINDOW]."
   - If [EMERGENCY_SERVICE] is `none` or `business-hours-only`: skip the
     emergency line entirely.
6. If [SHOP_ADDRESS] is a real street address (NOT `[home-based, do not
   publish]`), render a Google Maps iframe:
   `<iframe src="https://maps.google.com/maps?q=[ENCODED_ADDRESS]&output=embed"
    width="100%" height="320" loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Map showing [BUSINESS_NAME] dispatch in [PRIMARY_CITY]"></iframe>`
   Replace `[ENCODED_ADDRESS]` with the URL-encoded form of [SHOP_ADDRESS].
   If the shop is home-based, OMIT the iframe entirely — never publish a
   home address.

Return valid MDX. No frontmatter.
```

---

## Prompt 5 — Booking / dispatch section

**Destination:** `src/components/sections/Booking.tsx`.

Pick one variant based on the intake form's §7 preferred contact method.

### Variant 5a — Call-now primary (default for emergency-capable shops)

```
<!-- Paste into Claude Opus -->
Generate a "Booking" section for a plumbing / trades business whose preferred
contact method is phone. The CTA is to call; a form is the secondary path.

Inputs:
- Business name: [BUSINESS_NAME]
- Phone display form: [PHONE_DISPLAY]
- Phone E.164 form: [PHONE_E164]
- Emergency phone display (or empty if same as main): [EMERGENCY_PHONE_DISPLAY]
- Emergency phone E.164 (or empty if same as main): [EMERGENCY_PHONE_E164]
- Emergency service level: [EMERGENCY_SERVICE]
- Diagnostic fee policy: [DIAGNOSTIC_FEE]

Output a single TSX component file at `src/components/sections/Booking.tsx`
that exports `Booking`. Use `SectionShell` (variant="parchment") and a short
prose block (≤ 60 words) inviting the reader to call. Render the phone number
as a `tel:` link using the E.164 form for the href and the display form as
the visible text. Make the phone link visually prominent (large, bold).

Conditional:
- If [EMERGENCY_SERVICE] is `24/7` and [EMERGENCY_PHONE_E164] is non-empty
  AND different from [PHONE_E164], render a second `tel:` link below the
  main one labelled "After-hours emergency" using the emergency numbers.
- If [DIAGNOSTIC_FEE] is non-empty, add a 1-line muted note: "Diagnostic
  fee: [DIAGNOSTIC_FEE]." (verbatim).

Add a "Prefer to write?" subnote linking to `#contact` (the contact form
section). No emoji.
```

### Variant 5b — Form-first (low-volume / scheduled-work shops)

```
<!-- Paste into Claude Opus -->
Generate a "Booking" section for a plumbing / trades business whose preferred
contact method is the contact form. The form is the primary CTA; the phone
is the fallback.

Inputs:
- Business name: [BUSINESS_NAME]
- Phone display form: [PHONE_DISPLAY]
- Phone E.164 form: [PHONE_E164]
- Free-quote threshold (or empty): [FREE_QUOTE_THRESHOLD]

Output a single TSX component file at `src/components/sections/Booking.tsx`
that exports `Booking`. Use `SectionShell` (variant="parchment") with:
1. A short prose block (≤ 50 words) introducing the booking flow. Mention
   the free-quote threshold if [FREE_QUOTE_THRESHOLD] is non-empty (e.g.
   "Free quotes on jobs over $500.").
2. A primary `<CTABlock />` (import from `@/components/primitives/CTABlock`)
   with `headline="Request a visit"`, `ctaLabel="Open the form"`,
   `ctaHref="#contact"`, `variant="ink"`.
3. A "Or call us" fallback line below with a `tel:` link, using the E.164
   form for href and the display form as visible text.

No emoji. Do NOT touch the contact-form component itself — that's Prompt 10.
```

---

## Prompt 6 — Testimonials / Reviews section

**Destination:** `src/components/sections/Testimonials.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a "Testimonials" section that renders three review cards plus matching
JSON-LD `Review` schema. Voice: lift quotes verbatim — do not rewrite them.

Inputs (from intake form §10 — three review rows):
- Business name: [BUSINESS_NAME]
- Aggregate rating (or empty): [AGGREGATE_RATING]
- Review 1: quote=[R1_QUOTE], name=[R1_NAME], context=[R1_CONTEXT], rating=[R1_RATING]
- Review 2: quote=[R2_QUOTE], name=[R2_NAME], context=[R2_CONTEXT], rating=[R2_RATING]
- Review 3: quote=[R3_QUOTE], name=[R3_NAME], context=[R3_CONTEXT], rating=[R3_RATING]

Output a single TSX file at `src/components/sections/Testimonials.tsx` that
exports `Testimonials`. Requirements:

1. Use `SectionShell` (variant="canvas").
2. If [AGGREGATE_RATING] is non-empty, render it as a single muted line above
   the grid (e.g. "4.9 across 87 Google reviews"). Do NOT invent or round
   the number — print verbatim.
3. Render a 3-up grid (1-up on mobile) of `<GlassCard as="article">` cards.
4. Each card: blockquote with the quote, attribution line "— [name],
   [context]" (context is the job type, e.g. "burst pipe in Etobicoke"),
   and a star-rating row rendered as filled / empty stars matching `rating`
   (use the `lucide-react` `Star` icon, filled = `fill="currentColor"` on
   the accent colour, empty = stroke only).
5. Below the grid, render a `<JsonLd>` block (import from
   `@/components/primitives/JsonLd`) with `data` typed as
   `WithContext<Plumber>` (or `LocalBusiness` if Plumber subtype is not
   appropriate for the trade). Populate `aggregateRating` only if
   [AGGREGATE_RATING] gave a verifiable number; otherwise omit that field
   entirely (an unverified `aggregateRating` is a search-spam risk).
   Include a `review` array with each of the three reviews as `Review`
   schema objects (`@type: "Review"`, `reviewRating`, `author`,
   `reviewBody`).
6. The component must compile under `npx tsc --noEmit` — import `Star` from
   `lucide-react` and `WithContext`, `Plumber` (or `LocalBusiness`),
   `Review` types from `schema-dts`.

No emoji.
```

---

## Prompt 7 — Photo Gallery section (job-site / before-after)

**Destination:** `src/components/sections/Gallery.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a responsive photo gallery section that uses Next.js `next/image`.
Layout: 3-up grid on desktop (`md:` breakpoint), 1-up on mobile. The operator
will replace the placeholder paths with real images after running this prompt.

Inputs:
- Business name: [BUSINESS_NAME]
- Trade focus: [TRADE_FOCUS]
- Photo themes the owner wants represented: [PHOTO_THEMES]
- Number of photos to render: [PHOTO_COUNT] (between 3 and 9; pick 6 if
  unspecified)
- Number of before/after pairs available: [BEFORE_AFTER_PAIRS]

Output a single TSX file at `src/components/sections/Gallery.tsx` that exports
`Gallery`. Requirements:

1. Use `SectionShell` (variant="ink") with an H2 "On the job".
2. A CSS-grid `<ul>` (Tailwind: `grid-cols-1 md:grid-cols-3 gap-4`) with
   `<li>` items.
3. Each `<li>` contains a `next/image` `<Image>` with:
   - `src={'/images/gallery-' + (i + 1) + '.jpg'}` (placeholder path the
     operator replaces).
   - `width={800}`, `height={600}`.
   - `alt` text generated from [PHOTO_THEMES] — be specific, name the job
     type (e.g. "Sump pump install in [PRIMARY_CITY] basement"). No "image
     of" or "photo of" prefixes.
   - `className="rounded-md object-cover w-full h-auto"`.
4. If [BEFORE_AFTER_PAIRS] ≥ 2, group the first 2 × [BEFORE_AFTER_PAIRS]
   slots into pairs: each pair renders as two side-by-side images inside a
   single `<li>` with a small "Before" / "After" caption beneath each.
   Use Tailwind `grid grid-cols-2 gap-2` inside the `<li>`. The remaining
   slots render as single-image `<li>` items per (3).
5. Lazy-load by default (Next.js handles this automatically; do not pass
   `priority`).
6. At the top of the file, include a JSDoc comment block listing the
   expected photo paths and which theme each path should depict, so the
   operator knows what to drop into `public/images/`.

The component must compile under `npx tsc --noEmit`. No emoji.
```

---

## Prompt 8 — SEO metadata

**Destination:** the `metadata` export at the top of the page file (`src/app/page.tsx` for a single-page client; `src/app/[client-slug]/page.tsx` if mounted under a slug).

```
<!-- Paste into Claude Opus -->
Generate the Next.js `metadata` export for a plumbing / trades business
homepage.

Inputs:
- Business name: [BUSINESS_NAME]
- Trade focus: [TRADE_FOCUS]
- Primary city: [PRIMARY_CITY]
- Service area summary (≤ 6 words, e.g. "Toronto & west GTA"): [SERVICE_AREA_SHORT]
- Emergency service level: [EMERGENCY_SERVICE]
- Domain (or "https://example.com" placeholder): [DOMAIN]

Output a typed `Metadata` export from Next.js, exactly in this shape:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "[≤ 60 chars — must include business name, trade focus, and city]",
  description: "[≤ 155 chars — names trade focus, service area, and one specific differentiator (emergency response / years / licensing)]",
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
        alt: "[BUSINESS_NAME] — [TRADE_FOCUS] in [PRIMARY_CITY]",
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
- Do NOT use the words "best", "premier", "leading", "trusted", or any
  superlative or self-label ("expert", "specialist" used as a noun).
- Title pattern: prefer `[BUSINESS_NAME] — [TRADE_FOCUS] | [PRIMARY_CITY]`.
  Drop the city if it pushes past 60 chars.
- If [EMERGENCY_SERVICE] is `24/7`, you may include "24/7" in the
  description — but only if there's room without dropping
  service-area-short.
```

---

## Prompt 9 — JSON-LD structured data (LocalBusiness + Plumber)

**Destination:** the page file (`src/app/page.tsx`), rendered alongside the page content as a `<JsonLd>` block.

```
<!-- Paste into Claude Opus -->
Generate a typed JSON-LD `Plumber` (or `LocalBusiness` if the trade is not
plumbing — e.g. electrical, HVAC) schema using the `JsonLd` component at
`src/components/primitives/JsonLd.tsx`. Type imports come from `schema-dts`.

Inputs (from the intake form):
- Business name: [BUSINESS_NAME]
- Trade focus: [TRADE_FOCUS]
- Shop address (or `[home-based, do not publish]`): [SHOP_ADDRESS]
- Primary city: [PRIMARY_CITY]
- Service area description: [SERVICE_AREA]
- Phone (E.164): [PHONE_E164]
- Hours table (24h, closed-aware): [HOURS_TABLE]
- Emergency service level: [EMERGENCY_SERVICE]
- Domain: [DOMAIN]
- Google Business Profile URL: [GBP_URL]
- Instagram URL: [INSTAGRAM_URL]
- Other social / directory links: [OTHER_SOCIALS]
- Trade licence number (if publicly displayable; empty otherwise): [LICENCE_NUMBER]

Output a TSX snippet that:

1. Imports:
   ```ts
   import { JsonLd } from "@/components/primitives/JsonLd";
   import type { WithContext, Plumber, LocalBusiness } from "schema-dts";
   ```
   Use `Plumber` if [TRADE_FOCUS] involves plumbing; otherwise use
   `LocalBusiness`.

2. Defines a `businessSchema: WithContext<Plumber>` (or `LocalBusiness`)
   constant with these fields:
   - `@context: "https://schema.org"`
   - `@type: "Plumber"` (or `"LocalBusiness"`)
   - `name`, `url`, `telephone`
   - `address`: only if [SHOP_ADDRESS] is a real street address. Render as
     a nested `PostalAddress` object (parse [SHOP_ADDRESS] into
     streetAddress, addressLocality, addressRegion, postalCode,
     addressCountry). If [SHOP_ADDRESS] is `[home-based, do not publish]`,
     OMIT the `address` field entirely and instead populate `areaServed`
     with a string from [SERVICE_AREA].
   - `areaServed` — always populated, derived from [SERVICE_AREA].
   - `openingHoursSpecification` — one entry per open day, using
     `dayOfWeek: "https://schema.org/Monday"` (etc.) full URLs and 24h
     `opens` / `closes` strings. Skip closed days.
   - `sameAs` — array of social / directory URLs (GBP_URL, Instagram, others).
   - If [LICENCE_NUMBER] is non-empty AND the intake said it is publicly
     displayable, include `identifier: { @type: "PropertyValue", propertyID:
     "tradeLicence", value: "[LICENCE_NUMBER]" }`. Do NOT include if the
     intake said keep it private.

3. Renders `<JsonLd data={businessSchema} />`.

Constraints:
- Do not stringify upstream — the `JsonLd` component handles serialization.
- All hours must come verbatim from the intake form. Do not invent days.
- NEVER publish a home-based street address in the schema. The
  `[home-based, do not publish]` sentinel is a hard signal — falling back
  to `areaServed` only is correct here.
- Output must compile under `npx tsc --noEmit` against `schema-dts`.
```

---

## Prompt 10 — Contact / dispatch form section

**Destination:** `src/components/sections/Contact.tsx`. **Important:** this prompt only modifies the *visible form wrapper*. The contact API endpoint (`src/app/api/contact/`) is out of scope and is NEVER touched by these prompts.

```
<!-- Paste into Claude Opus -->
Generate a "Contact" section that wraps the existing `ContactForm` component
(`src/components/sections/ContactForm.tsx`) with plumbing-vertical copy.

Inputs:
- Business name: [BUSINESS_NAME]
- Trade focus: [TRADE_FOCUS]
- Preferred contact method (from intake §7): [PREFERRED_CONTACT_METHOD]
- Phone display: [PHONE_DISPLAY]
- Phone E.164: [PHONE_E164]
- Emergency service level: [EMERGENCY_SERVICE]

Output a single TSX file at `src/components/sections/Contact.tsx` that exports
`Contact`. Requirements:

1. Use `SectionShell` (variant="canvas").
2. H2 — pick one based on the preferred contact method:
   - Phone-first → "Call or write"
   - Form-first → "Request a visit"
   - SMS-first → "Text us the details"
3. Subheading — one sentence, ≤ 22 words. Name [TRADE_FOCUS] once. If
   [EMERGENCY_SERVICE] is `24/7`, mention that the phone line is staffed
   after hours; otherwise mention the typical response window in plain
   language ("We get back inside the same business day.").
4. A 2-column layout on desktop (`md:grid-cols-2 gap-8`), 1-column on
   mobile:
   - Left column: a `tel:` link styled as a primary CTA, using
     [PHONE_E164] for href and [PHONE_DISPLAY] as visible text. Below it,
     a 2-line "When to call vs write" guide:
     - "Call: emergencies, same-day work."
     - "Write: quotes, scheduled jobs, photos of the issue."
   - Right column: render `<ContactForm />` (import from
     `@/components/sections/ContactForm`).
5. Inside the form rendering — DO NOT modify ContactForm itself — render an
   adjacent `<input type="hidden" name="vertical" value="plumber" />` so
   submissions are tagged on the operator's inbox side. If `ContactForm`
   doesn't accept extra slots, leave a TODO comment noting the operator
   should add a `vertical` prop to ContactForm in a separate issue rather
   than editing the API route here.

DO NOT touch `src/app/api/contact/route.ts` or any file under
`src/app/api/contact/`. The API route is high-stakes and out of scope.
No emoji.
```

---

## Prompt 11 — Emergency-call CTA banner *(only if intake §3 emergency = `24/7` or `extended-evenings` AND §12 banner = yes)*

**Destination:** `src/components/sections/EmergencyBanner.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a sticky / high-contrast emergency-call banner. Only run this prompt
if intake §3 emergency_service is `24/7` or `extended-evenings` AND §12
emergency-banner = yes.

Inputs:
- Business name: [BUSINESS_NAME]
- Phone display form: [PHONE_DISPLAY]
- Phone E.164 form: [PHONE_E164]
- Emergency phone display (or empty if same as main): [EMERGENCY_PHONE_DISPLAY]
- Emergency phone E.164 (or empty if same as main): [EMERGENCY_PHONE_E164]
- Emergency service level: [EMERGENCY_SERVICE]
- Emergency response window: [EMERGENCY_RESPONSE_WINDOW]

Output a single TSX file at `src/components/sections/EmergencyBanner.tsx`
that exports `EmergencyBanner`. Requirements:

1. Use `SectionShell` (variant="ink") for high contrast. The banner sits
   near the top of the homepage — above the fold but below the hero.
2. Render `<CTABlock />` (import from `@/components/primitives/CTABlock`)
   with:
   - `headline` — at most 7 words, names the emergency capability (e.g.
     "Burst pipe? We answer 24/7" if `EMERGENCY_SERVICE = 24/7`, or
     "Late-night calls covered" if `extended-evenings`). No
     exclamation mark.
   - `subhead` — one sentence, ≤ 20 words, names the response window
     verbatim from [EMERGENCY_RESPONSE_WINDOW].
   - `ctaLabel` — at most 3 words: "Call now" or
     "Call [PHONE_DISPLAY]" (use the second only if the layout has room).
   - `ctaHref` — `tel:[EMERGENCY_PHONE_E164]` if non-empty AND different
     from [PHONE_E164]; otherwise `tel:[PHONE_E164]`.
   - `variant="ink"`.
3. The banner should NOT auto-dismiss. It should remain visible on the
   homepage as long as the emergency service is offered.
4. Add `aria-label="Emergency contact"` on the wrapper for screen-reader
   clarity.

No emoji. No exclamation marks.
```

---

## Prompt 12 — Trade FAQ section

**Destination:** `src/components/sections/FAQ.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a frequently-asked-questions section for a plumbing / trades
business. The questions and answers come straight from intake §11 — the
operator captured the questions the owner is sick of answering on the phone.
Lift the answers verbatim where possible; only tighten for length.

Inputs:
- Business name: [BUSINESS_NAME]
- Trade focus: [TRADE_FOCUS]
- FAQ source (5–8 Q&A pairs from intake §11): [FAQ_QUESTIONS]
- Topics to AVOID in the FAQ (per intake §11): [FAQ_AVOID_TOPICS]

Output a single TSX file at `src/components/sections/FAQ.tsx` that exports
`FAQ`. Requirements:

1. Use `SectionShell` (variant="parchment") with an H2 "Common questions".
2. Render the Q&A pairs as a `<dl>` (description list): each `<dt>` is the
   question (semibold), each `<dd>` is the answer (regular weight,
   ≤ 60 words). Use `<details>` / `<summary>` semantics as a progressive
   enhancement if the design system supports it; otherwise plain `<dl>` is
   fine.
3. Lift the owner's answers verbatim. Tighten only for length, never for
   tone — the FAQ reads as "things the owner has actually said on the
   phone", and that authenticity is the whole point.
4. Skip any question whose topic appears in [FAQ_AVOID_TOPICS].
5. Below the `<dl>`, render a `<JsonLd>` block with `data` typed as
   `WithContext<FAQPage>` from `schema-dts`. Each Q&A becomes a
   `Question` / `Answer` pair in the `mainEntity` array. The `<JsonLd>`
   import path is `@/components/primitives/JsonLd`.
6. The component must compile under `npx tsc --noEmit` — import
   `WithContext`, `FAQPage`, `Question`, `Answer` types from `schema-dts`.

No emoji. Do NOT invent questions. If [FAQ_QUESTIONS] has fewer than 4
pairs after filtering [FAQ_AVOID_TOPICS], leave a TODO comment naming the
gap and stop — a 2-question FAQ reads worse than no FAQ.
```

---

## Operator notes after running all 12

1. Type-check & lint:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```
2. Open the dev server and walk every section in `npm run dev`.
3. Verify the JSON-LD with Google's [Rich Results Test](https://search.google.com/test/rich-results) before pushing — the `Plumber` schema has stricter validation than generic `LocalBusiness`.
4. **Verify factual claims** against the intake form one more time before pushing: licence number, insurance language, response window, warranty terms, diagnostic fee. These are the claims that get a contractor in trouble; the prompts won't catch a mis-typed licence number.
5. Update the "Prompts run" checklist in `docs/clients/<slug>/intake.md`.
6. Open a PR titled `feat(<slug>): plumber content scaffold`.

If any prompt's output looks generic (the "AI smell" — "delve", "tapestry",
"trusted partner", "no job too small"), reject it and re-run with a
tightened input. Quality beats throughput here; the prompts are cheap, the
operator's reputation is not — and trade clients hire on referrals, so a
generic-sounding site is worse than no site.
