<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY PROMPT PACK

  Recruitment / staffing content prompts for Claude Opus.

  Hard rules:
    1. Do NOT paste these prompts into a client-shared chat.
    2. The *outputs* (hero copy, MDX, JSON-LD) ship into the client repo.
       The *prompts* never leave this folder.
    3. Run prompts sequentially — later ones depend on earlier outputs
       (the JSON-LD prompt reads back the hours table, the dual-CTA
       prompt reads the client-side and candidate-side copy from
       earlier prompts, etc.).

  See `00-templates-index.md` for the workflow and
  `recruiter-intake-form.md` for the field definitions.

  This template is for placement firms — agencies that source candidates
  and earn fees on placements. It is NOT for HR-advisory practices, and
  Client #1 brand identifiers (`Lumivara People Advisory`, <!-- dual-lane-audit:allow — forbid-list, not a use of the strings -->
  `Lumivara People Solutions`, `people advisory`, `lumivara.ca`, <!-- dual-lane-audit:allow — forbid-list -->
  `Beas Banerjee`) MUST NOT appear in any output. Keep generated copy
  vertical-generic.
================================================================================
-->

# Recruitment / staffing — content prompts (Claude Opus)

This file is a sequence of 12 prompts (10 required + 2 conditional) that turn a filled `recruiter-intake-form.md` into a complete recruitment / staffing site. Each prompt is self-contained, fenced, and labelled with the destination filepath in the client repo.

## Before you start

1. **Fill the intake form first.** Every `[BRACKET_FIELD]` below comes from `recruiter-intake-form.md`. If a field is empty, stop and follow up with the client — do not let Opus invent it. Recruitment claims (placement counts, time-to-fill, guarantee terms, fee schedules, EE / AA statements) are contractually material and a wrong number printed on the homepage is a problem.
2. **One prompt = one fresh Opus chat.** Pasting them all at once dilutes the per-section context. Open a new chat per prompt.
3. **Substitute brackets with find-replace.** Open the prompt in your editor, do `[BUSINESS_NAME]` → real value (etc.), then paste the result into Claude.
4. **Review every output before pasting into the client repo.** The voice is the operator's reputation; treat outputs like junior-writer drafts, not finished copy. For a recruitment client, also verify any factual claim about fees, guarantees, jurisdiction, EE / AA posture, and candidate-confidentiality posture against the intake answers.
5. **House style:** candid, unhyped, slightly drier than restaurant or trade copy — recruitment buyers are sceptical and have heard every cliché. No emoji, no exclamation marks, no "AI-isms" ("delve", "tapestry", "talent journey"). No staffing-industry clichés ("we don't just place people, we build careers"; "the right fit"; "talent solutions"; "people-first"; "we know your industry"). Voice is first-person plural ("we") for any firm with more than one recruiter; first-person singular ("I") for solo recruiters — check `[RECRUITER_COUNT]`.
6. **Component primitives** referenced below are real and live in the client repo at `src/components/primitives/`:
   - `GlassCard` — `{ children, className?, as?: 'div' | 'article' | 'li', interactive?: boolean }`
   - `SectionShell` — wraps a section with consistent padding and a `variant: 'ink' | 'canvas' | 'parchment'` background.
   - `CTABlock` — `{ headline, subhead?, ctaLabel, ctaHref, variant?: 'ink' | 'canvas' | 'parchment' }`
   - `JsonLd` — `{ data: WithContext<Thing> }` from `schema-dts`. Pass a fully-typed schema object; do not stringify upstream.

If those primitives are missing, the structural rebuild prompt (`../06-operator-rebuild-prompt-v3.md`) hasn't run yet — fix that before running these.

7. **Brand-string check.** Before pasting any output into a client repo, search the output for the strings `Lumivara People Advisory`, `Lumivara People Solutions`, `people advisory`, `lumivara.ca`, `Beas Banerjee`. If any match: reject the output and regenerate with a tightened prompt — those identifiers belong only to Client #1 and must never appear in another firm's site copy. <!-- dual-lane-audit:allow — forbid-list, not a use of the strings -->

---

## Prompt 1 — Hero section copy

**Destination:** `src/app/page.tsx` (the `<HomeHero>` props, or whatever `src/content/home.ts` exports for the hero).

```
<!-- Paste into Claude Opus -->
You are writing the hero section of a recruitment / staffing firm's homepage.
The audience is split: hiring managers (the buyers) and candidates (the
talent). The hero copy speaks primarily to the buyer — candidates land via
the dual-CTA section further down the page. Voice: candid, unhyped, slightly
drier than consumer copy. No emoji, no exclamation marks, no recruitment
clichés ("we don't just place people", "the right fit", "people-first",
"talent journey", "people solutions").

Inputs:
- Firm name: [BUSINESS_NAME]
- Industries served (primary): [INDUSTRIES_PRIMARY]
- Function focus: [FUNCTION_FOCUS]
- Role bands typically placed: [ROLE_BANDS]
- Placement model: [PLACEMENT_MODEL]
- Geographic coverage: [GEOGRAPHIC_COVERAGE]
- Years since founded — derive from [YEAR_FOUNDED]: [YEARS_OPERATING]

Produce exactly three things:

1. Headline — at most 9 words. Concrete; names the function focus and the
   industry vertical. Reads like a sentence the founder could say at a
   networking event without flinching. Avoid abstract nouns ("solutions",
   "growth", "transformation").
2. Subheadline — one sentence, max 24 words. Names the placement model,
   the role bands, and the geographic coverage. No superlatives.
3. Primary CTA button text — at most 3 words. Action verb. Examples:
   "Brief us", "Discuss a search", "Open a search". Avoid "Learn more"
   and "Get in touch" (too vague for a buyer with budget authority).

Return as a fenced TypeScript object literal so I can paste it directly:

```ts
export const hero = {
  headline: "...",
  subheadline: "...",
  ctaLabel: "...",
  ctaHref: "...",  // "#discovery" if the discovery-call section is on the homepage, else "/contact"
};
```
```

---

## Prompt 2 — About / firm story section

**Destination:** `src/content/about.mdx`.

```
<!-- Paste into Claude Opus -->
You are writing the "Our story" section of a recruitment / staffing firm's
About page. The output is 140–200 words of MDX prose. Voice: first-person
plural ("we") for any firm with more than one recruiter; first-person
singular ("I") if [RECRUITER_COUNT] indicates solo. Candid, dry, no hype.
No emoji, no exclamation marks.

Inputs:
- Founder / principal name: [OWNER_NAME]
- Firm name: [BUSINESS_NAME]
- Year founded: [YEAR_FOUNDED]
- Recruiter headcount: [RECRUITER_COUNT]
- Industries served (primary): [INDUSTRIES_PRIMARY]
- Function focus: [FUNCTION_FOCUS]
- Founder's prior background — verbatim from intake (e.g. "10 years as a
  VP Engineering at two B2B SaaS companies before founding the firm"):
  [OWNER_BACKSTORY]
- Anything that makes the firm different: [DIFFERENTIATOR]

Constraints:
- Open with a concrete moment, observation, or thesis from the founder —
  not a date, a mission statement, or "Welcome to ...".
- Reference the function focus and the industry vertical at least once each.
- If the founder has operating experience inside the same vertical, name it
  in plain language ("Before founding the firm, [OWNER_NAME] spent X years
  doing Y") — operator-turned-recruiter is the strongest credibility signal
  in this category.
- End with a sentence that invites a discovery call without sounding like a
  sales close.
- Do NOT use the words: "passion", "journey", "trusted", "partner",
  "people-first", "talent solutions", "we don't just place", "the right
  fit", "premier", "best-in-class", "expert" (as a self-label).

Return as MDX, with a single H2 heading "Our story" at the top. No
frontmatter — the page wrapper handles that.
```

---

## Prompt 3 — Service offering section (verticals + roles placed)

**Destination:** `src/content/services.mdx`.

```
<!-- Paste into Claude Opus -->
You are turning a recruitment firm's service definition into structured
MDX, organised into two parts: (1) the verticals and functions they serve,
(2) the role bands and placement model. Use the existing `SectionShell`
and `GlassCard` primitives — assume they are imported at the top of the
MDX file.

Inputs:
- Firm name: [BUSINESS_NAME]
- Industries served (primary): [INDUSTRIES_PRIMARY]
- Industries served (secondary): [INDUSTRIES_SECONDARY]
- Function focus: [FUNCTION_FOCUS]
- Role bands typically placed: [ROLE_BANDS]
- Geographic coverage: [GEOGRAPHIC_COVERAGE]
- Cross-border lanes (or empty): [CROSS_BORDER_LANES]
- Placement model: [PLACEMENT_MODEL]
- Secondary models offered (or empty): [SECONDARY_MODELS]
- Hard-stop industries: [INDUSTRIES_DO_NOT_SERVE]

Output requirements:
1. One `<SectionShell variant="canvas" width="content">` titled "What we
   work on" containing a `<ul>` of `<GlassCard as="li">` cards — one card
   per primary industry vertical. Each card: vertical name (h3), a 1-line
   description (≤ 18 words) naming the function focus inside that vertical
   and one or two example role titles in plain language ("Series-B
   engineering leaders, principal ICs, founding GTM hires").
2. A second `<SectionShell variant="parchment" width="content">` titled
   "How we work" containing two short paragraphs:
   - Paragraph 1 — placement model in plain language. Example: "We run
     retained searches for VP-level and above; everything below VP is
     contingent." Pull verbatim phrasing from [PLACEMENT_MODEL] and
     [SECONDARY_MODELS] where possible. Do NOT invent the model.
   - Paragraph 2 — geographic coverage and cross-border posture. If
     [CROSS_BORDER_LANES] is non-empty, name the lanes plainly
     ("US ↔ Canada placements on TN visas only"); if empty, omit the
     cross-border sentence entirely.
3. If [INDUSTRIES_DO_NOT_SERVE] is non-empty, render a final muted-text
   line below "How we work": "We don't take on: [list]." This sets buyer
   expectations and reduces unqualified leads.
4. Do NOT print fee numbers anywhere in this section — fees and guarantees
   are introduced in the discovery-call flow (Prompt 5), not on the
   services page. Putting fee numbers on a public page commits the firm
   to a price they may not want to hold for every search.
5. Do NOT invent verticals, role titles, or industries. If [INDUSTRIES_PRIMARY]
   is empty, stop and ask the operator to fill the intake — generic
   industry copy is worse than no copy in this category.

Return valid MDX. Do not include frontmatter — the page wrapper handles it.
```

---

## Prompt 4 — Process / engagement-model section

**Destination:** `src/content/process.mdx`.

```
<!-- Paste into Claude Opus -->
You are writing the "How an engagement runs" section of a recruitment
firm's site. This is the page hiring managers read when they want to know
what they're buying. Voice: candid, specific, dry. The goal is to make a
buyer comfortable enough to book a discovery call — not to sell.

Inputs:
- Firm name: [BUSINESS_NAME]
- Placement model: [PLACEMENT_MODEL]
- Typical time-to-shortlist: [TIME_TO_SHORTLIST]
- Typical time-to-fill: [TIME_TO_FILL]
- Shortlist size: [SHORTLIST_SIZE]
- Screening depth: [SCREENING_DEPTH]
- Interview-loop coordination provided?: [INTERVIEW_COORDINATION]
- Offer-stage coaching / negotiation support?: [OFFER_COACHING]
- Onboarding follow-up cadence: [ONBOARDING_CHECKINS]
- Replacement / guarantee policy: [GUARANTEE_TERMS]
- Candidate confidentiality posture: [CANDIDATE_CONFIDENTIALITY]
- Client confidentiality posture: [CLIENT_CONFIDENTIALITY]

Output requirements:
1. H2 "How an engagement runs".
2. A 4-step process rendered as an ordered list (`<ol>`), one `<li>` per
   step. Each `<li>` has:
   - A bold step name as the lead phrase (e.g. "1. Brief & calibrate.")
   - A 2–3 sentence body. Use the intake fields verbatim where possible:
     name [TIME_TO_SHORTLIST] in step 2, [SCREENING_DEPTH] in step 2,
     [SHORTLIST_SIZE] in step 3, [INTERVIEW_COORDINATION] and
     [OFFER_COACHING] in step 3, [ONBOARDING_CHECKINS] and
     [TIME_TO_FILL] in step 4.
   Suggested step names (use these unless the intake names different
   stages): "Brief & calibrate", "Source & screen", "Shortlist & interview",
   "Offer, close, onboard".
3. Below the list, a "Guarantee" sub-block (≤ 60 words) naming the
   guarantee policy verbatim from [GUARANTEE_TERMS]. Do NOT round, soften,
   or paraphrase the terms — the wording is contractual.
4. A "Confidentiality" sub-block (≤ 60 words) summarising the firm's
   posture in plain language. Use [CANDIDATE_CONFIDENTIALITY] and
   [CLIENT_CONFIDENTIALITY] verbatim where possible.
5. Do NOT mention fees, percentages, or dollar amounts in this section —
   fee structure belongs to the discovery-call flow (Prompt 5).

Return valid MDX. No frontmatter.
```

---

## Prompt 5 — Booking / discovery-call section

**Destination:** `src/components/sections/Discovery.tsx`.

Pick one variant based on the intake form's §8 preferred contact method for client enquiries.

### Variant 5a — Form-first discovery call (default for most firms)

```
<!-- Paste into Claude Opus -->
Generate a "Book a discovery call" section for a recruitment firm whose
preferred channel for new client enquiries is the form. The discovery
call is short (15–30 min) and gated to a job-spec discussion — that
gating is what protects the firm's time and makes the buyer take the call
seriously.

Inputs:
- Firm name: [BUSINESS_NAME]
- Phone display form: [PHONE_DISPLAY]
- Phone E.164 form: [PHONE_E164]
- Free intake call before signing? (yes / no + length): [FREE_INTAKE_TERMS]
- Placement model: [PLACEMENT_MODEL]

Output a single TSX component file at `src/components/sections/Discovery.tsx`
that exports `Discovery`. Use `SectionShell` (variant="parchment") with:
1. H2 "Book a discovery call".
2. A short prose block (≤ 60 words) naming what the call covers (a
   real role, not a sales pitch), the call length from
   [FREE_INTAKE_TERMS], and what the buyer should bring (job spec or
   the rough shape of the role + budget band). Plain-spoken; no
   "absolutely free, no obligation" language.
3. A primary `<CTABlock />` (import from
   `@/components/primitives/CTABlock`) with `headline="Book the call"`,
   `ctaLabel="Open the form"`, `ctaHref="#contact"`, `variant="ink"`.
4. A "Or call directly" fallback line below the CTA with a `tel:` link,
   using [PHONE_E164] for href and [PHONE_DISPLAY] as visible text. If
   the firm has no public phone (some remote-first firms don't), omit
   this line entirely.

No emoji. Do NOT touch the contact-form component itself — that's
Prompt 10.
```

### Variant 5b — Phone-first discovery call (for firms whose buyers are senior and prefer voice)

```
<!-- Paste into Claude Opus -->
Generate a "Book a discovery call" section for a recruitment firm whose
preferred channel for new client enquiries is the phone. Common for firms
placing VP+ where the buyers are operators who pick up the phone.

Inputs:
- Firm name: [BUSINESS_NAME]
- Phone display form: [PHONE_DISPLAY]
- Phone E.164 form: [PHONE_E164]
- Free intake call before signing? (yes / no + length): [FREE_INTAKE_TERMS]

Output a single TSX component file at `src/components/sections/Discovery.tsx`
that exports `Discovery`. Use `SectionShell` (variant="parchment") with:
1. H2 "Book a discovery call".
2. A short prose block (≤ 50 words) naming what the call covers and the
   length from [FREE_INTAKE_TERMS].
3. The phone number as a large, bold `tel:` link — using [PHONE_E164] for
   href and [PHONE_DISPLAY] as visible text. This is the primary CTA.
4. A "Prefer to write?" subnote linking to `#contact` (the contact form
   section).

No emoji.
```

---

## Prompt 6 — Testimonials / placed-candidate quotes section

**Destination:** `src/components/sections/Testimonials.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a "Testimonials" section that renders three review cards plus
matching JSON-LD `Review` schema. Voice: lift quotes verbatim — do not
rewrite them. In recruitment, the testimonials carry both sides — hiring
managers ("they delivered the shortlist on time") and placed candidates
("they were honest about the role"). Render both kinds with equal
weight.

Inputs (from intake form §9 — three testimonial rows):
- Firm name: [BUSINESS_NAME]
- Testimonial 1: quote=[T1_QUOTE], name=[T1_NAME], context=[T1_CONTEXT], side=[T1_SIDE]  // side ∈ "hiring-manager" | "placed-candidate"
- Testimonial 2: quote=[T2_QUOTE], name=[T2_NAME], context=[T2_CONTEXT], side=[T2_SIDE]
- Testimonial 3: quote=[T3_QUOTE], name=[T3_NAME], context=[T3_CONTEXT], side=[T3_SIDE]

Output a single TSX file at `src/components/sections/Testimonials.tsx` that
exports `Testimonials`. Requirements:

1. Use `SectionShell` (variant="canvas") with an H2 "What clients and
   placed candidates say".
2. Render a 3-up grid (1-up on mobile) of `<GlassCard as="article">`
   cards. Order the cards so hiring-manager and placed-candidate sides
   alternate visually where possible.
3. Each card: blockquote with the quote, attribution line "— [name],
   [context]" (context is the role + company, or anonymised role + sector
   if the testimonial is anonymised), and a small muted-text label
   below the attribution — "Hiring manager" or "Placed candidate" —
   based on `[side]`. No star ratings — recruitment testimonials don't
   carry a 1–5 numeric, and inventing one would be a search-spam risk.
4. Below the grid, render a `<JsonLd>` block (import from
   `@/components/primitives/JsonLd`) with `data` typed as
   `WithContext<EmploymentAgency>`. Include a `review` array with each of
   the three testimonials as `Review` schema objects (`@type: "Review"`,
   `author`, `reviewBody`). Do NOT populate `reviewRating` or
   `aggregateRating` unless the intake gave a verifiable number — for
   recruitment, an unverified rating is worse than no rating.
5. The component must compile under `npx tsc --noEmit` — import
   `WithContext`, `EmploymentAgency`, `Review` types from `schema-dts`.

If any testimonial is missing a verbatim attribution permission per the
intake form notes, leave a TODO comment naming the row and STOP — do not
publish a testimonial without explicit written permission, even if the
quote and name look harmless.

No emoji.
```

---

## Prompt 7 — Logo wall / client trust section

**Destination:** `src/components/sections/LogoWall.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a "Companies we've placed talent into" logo-wall section. The
logo wall is the single highest-leverage social-proof element for a
recruitment firm — but every logo requires written permission. The
component must be permission-aware: only render logos where the intake
explicitly captured "permission granted in writing".

Inputs:
- Firm name: [BUSINESS_NAME]
- Logos with permission status (one row per logo): [CLIENT_LOGOS]
  // Row format from the intake form §9, e.g.
  //   "Acme Corp — permission granted in writing — /images/logos/acme.svg"
  //   "BetaCo — logo only, no name in copy — /images/logos/beta.svg"
  //   "Gamma Inc — do not display"

Output a single TSX file at `src/components/sections/LogoWall.tsx` that
exports `LogoWall`. Requirements:

1. Use `SectionShell` (variant="ink") with an H2 — pick one of:
   - "Companies we've placed talent into" (default)
   - "Where our placements work" (if the firm prefers candidate-side framing)
   The H2 string is hard-coded; the prompt does not need to choose between
   them dynamically — pick "Companies we've placed talent into" unless the
   intake says otherwise.
2. A CSS-grid `<ul>` (Tailwind: `grid-cols-2 md:grid-cols-4 lg:grid-cols-6
   gap-6 items-center`) of `<li>` items.
3. Each `<li>` renders a `next/image` `<Image>` with:
   - `src` set to the logo path from [CLIENT_LOGOS].
   - `width={160}`, `height={64}`.
   - `alt` text = the company name from [CLIENT_LOGOS] (e.g. "Acme Corp").
     If a row's permission status is "logo only, no name in copy", set
     `alt=""` (empty alt — decorative) AND add `aria-hidden="true"`. The
     company name still appears in the visible logo image but does not
     leak into the screen-reader text or any visible caption.
   - `className="opacity-80 hover:opacity-100 transition-opacity object-contain"`.
4. Render ONLY logos with permission status "permission granted in writing"
   or "logo only, no name in copy". OMIT any row marked "do not display".
5. If [CLIENT_LOGOS] yields fewer than 4 displayable logos, leave a TODO
   comment naming the gap and STOP — a 2-logo wall reads worse than no
   logo wall. The operator should either secure more permissions or
   replace this section with a "selected placements" prose block.
6. At the top of the file, include a JSDoc comment block listing the
   expected logo paths and noting that every logo requires written
   permission tracked in `docs/clients/<slug>/logo-permissions.md` in
   the mothership repo.

The component must compile under `npx tsc --noEmit`. No emoji.
```

---

## Prompt 8 — SEO metadata

**Destination:** the `metadata` export at the top of the page file (`src/app/page.tsx` for a single-page client; `src/app/[client-slug]/page.tsx` if mounted under a slug).

```
<!-- Paste into Claude Opus -->
Generate the Next.js `metadata` export for a recruitment / staffing firm
homepage.

Inputs:
- Firm name: [BUSINESS_NAME]
- Function focus: [FUNCTION_FOCUS]
- Industries served (primary, ≤ 4 words for SEO, e.g. "B2B SaaS"):
  [INDUSTRIES_PRIMARY_SHORT]
- Geographic coverage summary (≤ 6 words, e.g. "Canada-wide, GTA-based"):
  [GEOGRAPHIC_COVERAGE_SHORT]
- Placement model: [PLACEMENT_MODEL]
- Domain (or "https://example.com" placeholder): [DOMAIN]

Output a typed `Metadata` export from Next.js, exactly in this shape:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "[≤ 60 chars — must include firm name, function focus, and a vertical or geographic anchor]",
  description: "[≤ 155 chars — names function focus, industry vertical, placement model, and geographic coverage. Reads as a sentence, not a keyword salad.]",
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
        alt: "[BUSINESS_NAME] — [FUNCTION_FOCUS] search for [INDUSTRIES_PRIMARY_SHORT]",
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
- Do NOT use the words "best", "premier", "leading", "trusted", "people-
  first", "talent solutions", or any superlative or self-label
  ("expert", "specialist" used as a noun).
- Title pattern: prefer `[BUSINESS_NAME] — [FUNCTION_FOCUS] search for [INDUSTRIES_PRIMARY_SHORT]`.
  Drop the industry vertical if it pushes past 60 chars.
- Do NOT include the strings "Lumivara People Advisory", "Lumivara People <!-- dual-lane-audit:allow — forbid-list inside Opus prompt -->
  Solutions", "people advisory", "lumivara.ca", or "Beas Banerjee" in any <!-- dual-lane-audit:allow — forbid-list inside Opus prompt -->
  field — those identifiers belong only to Client #1.
```

---

## Prompt 9 — JSON-LD structured data (`EmploymentAgency` schema)

**Destination:** the page file (`src/app/page.tsx`), rendered alongside the page content as a `<JsonLd>` block.

```
<!-- Paste into Claude Opus -->
Generate a typed JSON-LD `EmploymentAgency` schema using the `JsonLd`
component at `src/components/primitives/JsonLd.tsx`. Type imports come
from `schema-dts`.

Inputs (from the intake form):
- Firm name: [BUSINESS_NAME]
- Office address (or `[remote-first, no published office]`): [OFFICE_ADDRESS]
- Phone (E.164): [PHONE_E164]
- Hours table (24h, closed-aware): [HOURS_TABLE]
- Industries served (primary): [INDUSTRIES_PRIMARY]
- Function focus: [FUNCTION_FOCUS]
- Geographic coverage: [GEOGRAPHIC_COVERAGE]
- Domain: [DOMAIN]
- LinkedIn company URL: [LINKEDIN_COMPANY_URL]
- Founder LinkedIn URL: [FOUNDER_LINKEDIN_URL]
- Other social / directory links: [OTHER_SOCIALS]
- Ontario THA staffing licence (if applicable; empty otherwise):
  [STAFFING_LICENCE]

Output a TSX snippet that:

1. Imports:
   ```ts
   import { JsonLd } from "@/components/primitives/JsonLd";
   import type { WithContext, EmploymentAgency } from "schema-dts";
   ```

2. Defines a `agencySchema: WithContext<EmploymentAgency>` constant with
   these fields:
   - `@context: "https://schema.org"`
   - `@type: "EmploymentAgency"`
   - `name`, `url`, `telephone`
   - `address`: only if [OFFICE_ADDRESS] is a real street address. Render
     as a nested `PostalAddress` object (parse [OFFICE_ADDRESS] into
     streetAddress, addressLocality, addressRegion, postalCode,
     addressCountry). If [OFFICE_ADDRESS] is `[remote-first, no published
     office]`, OMIT the `address` field entirely.
   - `areaServed` — always populated, derived from [GEOGRAPHIC_COVERAGE].
     For multi-region firms, render as an array of `Place` or string
     entries.
   - `knowsAbout` — array of strings derived from [INDUSTRIES_PRIMARY] and
     [FUNCTION_FOCUS] (e.g. ["B2B SaaS", "Engineering & Product"]).
   - `openingHoursSpecification` — one entry per open day, using
     `dayOfWeek: "https://schema.org/Monday"` (etc.) full URLs and 24h
     `opens` / `closes` strings. Skip closed days. If the firm operates
     by-appointment-only and has no fixed hours, OMIT the
     `openingHoursSpecification` field entirely rather than inventing
     hours.
   - `sameAs` — array of social / directory URLs (LinkedIn company,
     founder LinkedIn, others).
   - If [STAFFING_LICENCE] is non-empty AND publicly displayable, include
     `identifier: { @type: "PropertyValue", propertyID: "staffingLicence",
     value: "[STAFFING_LICENCE]" }`. For an Ontario Temporary Help Agency
     licence under Bill 79 this is required-by-regulation public
     information; for a search-only firm with no THA licence, OMIT the
     field.

3. Renders `<JsonLd data={agencySchema} />`.

Constraints:
- Do not stringify upstream — the `JsonLd` component handles serialization.
- All hours must come verbatim from the intake form. Do not invent days.
- NEVER publish a residential street address in the schema — if the firm
  works from a home office, treat that as `[remote-first, no published
  office]` for schema purposes.
- Output must compile under `npx tsc --noEmit` against `schema-dts`.
```

---

## Prompt 10 — Contact / dual-audience form section

**Destination:** `src/components/sections/Contact.tsx`. **Important:** this prompt only modifies the *visible form wrapper*. The contact API endpoint (`src/app/api/contact/`) is out of scope and is NEVER touched by these prompts.

```
<!-- Paste into Claude Opus -->
Generate a "Contact" section that wraps the existing `ContactForm`
component (`src/components/sections/ContactForm.tsx`) with recruitment-
vertical, dual-audience copy. The form serves both hiring managers (with
open roles to fill) and candidates (looking for opportunities), with a
single radio toggle that tags the submission accordingly.

Inputs:
- Firm name: [BUSINESS_NAME]
- Function focus: [FUNCTION_FOCUS]
- Preferred contact method for new client enquiries (from intake §8):
  [CLIENT_PREFERRED_CONTACT]
- Preferred contact method for candidate enquiries (from intake §8):
  [CANDIDATE_PREFERRED_CONTACT]
- Phone display: [PHONE_DISPLAY]
- Phone E.164: [PHONE_E164]
- Client-side enquiry email: [CLIENT_INQUIRY_EMAIL]
- Candidate-side enquiry email: [CANDIDATE_INQUIRY_EMAIL]

Output a single TSX file at `src/components/sections/Contact.tsx` that
exports `Contact`. Requirements:

1. Use `SectionShell` (variant="canvas").
2. H2 "Get in touch".
3. Subheading — one sentence, ≤ 22 words. Names [BUSINESS_NAME] once and
   makes clear that the form serves both hiring managers and candidates
   ("Whether you're hiring or exploring opportunities, this is the way
   in.").
4. A radio toggle above the form with two options:
   - "I'm hiring" (value="hiring") — selected by default.
   - "I'm exploring opportunities" (value="candidate").
   The toggle controls a hidden form field — render an
   `<input type="hidden" name="audience" value="..." />` whose `value` is
   driven by the radio state. Use `useState` for the toggle.
5. Below the radio, render `<ContactForm />` (import from
   `@/components/sections/ContactForm`).
6. Inside the form rendering — DO NOT modify ContactForm itself — render
   adjacent hidden inputs:
   - `<input type="hidden" name="vertical" value="recruiter" />` — tags
     submissions as recruitment-vertical on the operator's inbox side.
   - `<input type="hidden" name="audience" value={audience} />` — driven
     by the radio toggle.
   If `ContactForm` doesn't accept extra slots, leave a TODO comment
   noting the operator should add `vertical` and `audience` props to
   ContactForm in a separate issue rather than editing the API route
   here.
7. Below the form, render a "Direct email" fallback block with two lines:
   - "Hiring: <a href='mailto:[CLIENT_INQUIRY_EMAIL]'>[CLIENT_INQUIRY_EMAIL]</a>"
   - "Candidates: <a href='mailto:[CANDIDATE_INQUIRY_EMAIL]'>[CANDIDATE_INQUIRY_EMAIL]</a>"
   If [CLIENT_INQUIRY_EMAIL] equals [CANDIDATE_INQUIRY_EMAIL], collapse
   to a single "Email" line.
8. If [CLIENT_PREFERRED_CONTACT] is "phone", render a `tel:` link below
   the email block using [PHONE_E164] / [PHONE_DISPLAY].

DO NOT touch `src/app/api/contact/route.ts` or any file under
`src/app/api/contact/`. The API route is high-stakes and out of scope.

DO NOT add a candidate file-upload (resume) input in this prompt. File
uploads change the form's payload contract and trigger PIPEDA-compliant
consent capture work; if the firm wants candidate applications, that is
a separate issue tagged `complexity/complex` per the intake form §12.

No emoji.
```

---

## Prompt 11 — Open roles board *(only if intake §11 = yes)*

**Destination:** `src/components/sections/OpenRoles.tsx`.

```
<!-- Paste into Claude Opus -->
Generate an "Open roles" board section. Only run this prompt if the
intake form §11 says open-roles board = yes. The board is read-only —
candidates click through to apply via the firm's ATS or via email; this
prompt does NOT generate an in-page application form (that needs ATS
API wiring and PIPEDA consent capture, both out of scope).

Inputs:
- Firm name: [BUSINESS_NAME]
- Source of role data: [ROLES_FEED_SOURCE]
- How often roles change: [ROLES_FEED_CADENCE]
- Confidentiality posture for client names on roles: [ROLES_CLIENT_CONFIDENTIALITY]
- Candidate-side enquiry email (fallback if no per-role apply link):
  [CANDIDATE_INQUIRY_EMAIL]

Output a single TSX file at `src/components/sections/OpenRoles.tsx` that
exports `OpenRoles`. Requirements:

1. Use `SectionShell` (variant="canvas") with an H2 "Open roles".
2. A short prose block above the list (≤ 40 words) naming the cadence
   from [ROLES_FEED_CADENCE] and the client-confidentiality posture from
   [ROLES_CLIENT_CONFIDENTIALITY] in plain language ("We disclose client
   names only after a candidate signs an NDA").
3. A `<ul>` of `<GlassCard as="li">` cards driven by an `openRoles` array
   of typed objects. Define the type at the top of the file:
   ```ts
   type OpenRole = {
     title: string;
     companyLabel: string;  // company name OR a confidential label like "Series-B fintech"
     location: string;      // "Remote — Canada", "Toronto, hybrid 2 days", etc.
     band: string;          // "IC, $120k–$150k base"; do NOT print exact comp
     applyHref: string;     // ATS link, mailto, or "#" for "Brief us first"
     postedAt: string;      // ISO date
   };
   ```
   Render each role card with: title (h3), companyLabel (muted),
   location, band, posted-at as a relative-date suffix ("posted 3 days
   ago"), and an "Apply" CTA linking to `applyHref`. If `applyHref` is
   `"#"` or empty, render a `mailto:` to [CANDIDATE_INQUIRY_EMAIL] with
   the role title prefilled in the subject.
4. Source the `openRoles` array from a sibling content file
   `src/content/open-roles.ts` (the operator wires the actual data flow:
   ATS API, manual TS export, or a Notion fetch). Import it at the top:
   `import { openRoles } from "@/content/open-roles";`. If the file does
   not exist, leave a TODO comment naming the missing file and a stub
   empty-state ("No live searches right now — drop us a line and we'll
   keep you on file.") with a `mailto:` to [CANDIDATE_INQUIRY_EMAIL].
5. Render a `<JsonLd>` block per role using the `JobPosting` schema from
   `schema-dts`. Each role's JSON-LD must include `title`, `description`
   (plain-text role band line — not the full spec, which usually lives
   only in the ATS), `datePosted`, `hiringOrganization` (use
   `companyLabel`; if confidential, render as
   `{ "@type": "Organization", "name": companyLabel }` without a `url`),
   `jobLocation`, and `employmentType` (default "FULL_TIME" — only
   override if the intake explicitly says contract / temp).
6. The component must compile under `npx tsc --noEmit` — import
   `WithContext`, `JobPosting`, `Organization` types from `schema-dts`.

No emoji. Do NOT publish a confidential client's name in the visible card
or in the JSON-LD `hiringOrganization.name` if the intake says client
names are confidential.
```

---

## Prompt 12 — "Looking to hire" vs "Looking for a role" dual CTA *(only if intake §12 = yes)*

**Destination:** `src/components/sections/DualCTA.tsx`.

```
<!-- Paste into Claude Opus -->
Generate a dual-CTA section that splits the page in two: one path for
hiring managers, one path for candidates. Only run this prompt if the
intake form §12 dual-CTA = yes (default for firms that take both client
and candidate enquiries).

Inputs:
- Firm name: [BUSINESS_NAME]
- Function focus: [FUNCTION_FOCUS]
- Industries served (primary): [INDUSTRIES_PRIMARY]
- Has open-roles board? (yes / no — from intake §11): [HAS_OPEN_ROLES]
- Hiring-manager CTA destination (default "#discovery"):
  [HIRING_MANAGER_CTA_HREF]
- Candidate CTA destination (default "#open-roles" if [HAS_OPEN_ROLES] =
  yes; otherwise "#contact"): [CANDIDATE_CTA_HREF]

Output a single TSX file at `src/components/sections/DualCTA.tsx` that
exports `DualCTA`. Requirements:

1. Use `SectionShell` (variant="ink") with an H2 "Two ways in".
2. A 2-column layout on desktop (`md:grid-cols-2 gap-8`), 1-column on
   mobile.
3. Left column — hiring-manager CTA. Render `<CTABlock />` (import from
   `@/components/primitives/CTABlock`) with:
   - `headline` — at most 8 words, addresses the hiring manager
     directly (e.g. "Hiring for [FUNCTION_FOCUS]?").
   - `subhead` — one sentence, ≤ 22 words, names the function focus and
     industry vertical and one differentiator (time-to-shortlist or
     model). No fee numbers.
   - `ctaLabel` — at most 3 words: "Brief us", "Open a search",
     "Discuss a search".
   - `ctaHref` — set to [HIRING_MANAGER_CTA_HREF].
   - `variant="ink"`.
4. Right column — candidate CTA. Render a second `<CTABlock />` with:
   - `headline` — at most 8 words, addresses the candidate directly
     (e.g. "Exploring your next role?").
   - `subhead` — one sentence, ≤ 22 words, names the kind of roles the
     firm typically works on and the candidate-confidentiality posture
     in plain language ("we never share your name without your
     consent").
   - `ctaLabel` — at most 3 words. If [HAS_OPEN_ROLES] = yes, use
     "See open roles". Otherwise use "Drop us a line".
   - `ctaHref` — set to [CANDIDATE_CTA_HREF].
   - `variant="ink"`.
5. The two CTAs must be visually balanced — neither side dominates. The
   hiring-manager side is the buyer; the candidate side is the supply.
   The site should not feel skewed toward either audience.

No emoji. No exclamation marks.
```

---

## Operator notes after running all 12

1. Type-check & lint:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```
2. Open the dev server and walk every section in `npm run dev`. Pay particular attention to the dual-audience flow — toggle the radio in Prompt 10's contact form, click both sides of Prompt 12's dual-CTA, and confirm each path is intelligible on its own.
3. Verify the JSON-LD with Google's [Rich Results Test](https://search.google.com/test/rich-results) before pushing — `EmploymentAgency` and `JobPosting` both have stricter validation than generic `LocalBusiness`. Pay particular attention to `hiringOrganization` on confidential roles (Prompt 11) — Google penalises postings without a real `hiringOrganization.name` and a confidential-client label is the legitimate way to satisfy this without leaking the client.
4. **Verify factual claims** against the intake form one more time before pushing: fee structure, guarantee terms, jurisdiction, EE / AA statement, candidate-confidentiality posture, Ontario THA licence number. These are the claims that get a recruitment firm in trouble; the prompts won't catch a mis-typed licence number.
5. **Brand-string sweep.** `rg -i 'Lumivara People (Advisory|Solutions)|people advisory|lumivara\.ca|Beas Banerjee'` against the generated client repo must return zero matches — those identifiers belong only to Client #1. <!-- dual-lane-audit:allow — rg pattern, not a use of the strings -->
6. **Permission audit on logos and testimonials.** Cross-check every logo on the wall (Prompt 7) and every testimonial (Prompt 6) against `docs/clients/<slug>/logo-permissions.md` and `docs/clients/<slug>/testimonials.md` in the mothership repo. If any row lacks "permission granted in writing", remove it before push.
7. Update the "Prompts run" checklist in `docs/clients/<slug>/intake.md`.
8. Open a PR titled `feat(<slug>): recruiter content scaffold`.

If any prompt's output looks generic (the "AI smell" — "delve", "tapestry", "people-first", "talent solutions", "we don't just place", "the right fit"), reject it and re-run with a tightened input. Quality beats throughput here; the prompts are cheap, the operator's reputation is not — and recruitment buyers are sceptical readers who will quietly close the tab on a generic site.
