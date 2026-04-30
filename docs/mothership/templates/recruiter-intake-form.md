<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY INTAKE FORM

  This is the operator's *internal* cribsheet for recruitment / staffing
  clients. Do NOT send this filled form to the client. The client-facing
  intake is the trimmed dummy in `../07-client-handover-pack.md §3`.

  Workflow:
    1. Copy this file to the operator's mothership repo at
       `docs/clients/<slug>/intake.md`.
    2. Walk the client through the questions in a single intake call.
    3. Replace each `[CLIENT ANSWER]` placeholder with their answer.
    4. Feed the filled form into the prompts in `recruiter-prompts.md`.

  Anything bracketed in CAPS (e.g. `[BUSINESS_NAME]`) is a token the
  prompts reference — keep the brackets so find-replace stays safe.

  Recruitment vertical specifics: this form intentionally avoids any
  HR-advisory framing. Recruitment / staffing sits adjacent to HR
  advisory, but this template is for placement firms — agencies that
  source candidates and earn fees on placements — not for advisory
  practices. Keep prompts and copy generic to the placement model;
  Client #1 brand identifiers are forbidden in any output (see
  `../15-terminology-and-brand.md §6`).
================================================================================
-->

# Recruitment / staffing client — operator intake form

**Client slug (kebab-case):** `[CLIENT_SLUG]`
**Date of intake call:** `[YYYY-MM-DD]`
**Operator on call:** `[OPERATOR_NAME]`

> Fill answers inline below. If the client doesn't have an answer, write `[unknown — follow up]` rather than guessing — the prompts read these answers verbatim. Recruitment claims (placement counts, time-to-fill, guarantee terms, fee schedules) are contractually material; do not let Opus invent them.

---

## §1. Firm identity

- **Firm name** (`[BUSINESS_NAME]`): [CLIENT ANSWER]
- **Founder / principal recruiter first name** (`[OWNER_NAME]`): [CLIENT ANSWER]
- **Year founded** (`[YEAR_FOUNDED]`, integer): [CLIENT ANSWER]
- **Recruiter headcount** (`[RECRUITER_COUNT]`, e.g. "solo", "2 recruiters + 1 sourcer", "boutique team of 6"): [CLIENT ANSWER]
- **Firm vibe — 1 to 3 adjectives in the founder's own words** (`[VIBE_ADJECTIVES]`, e.g. "candid, technical, low-volume"): [CLIENT ANSWER]
- **Anything they want to highlight that competitors don't have** (free text — e.g. niche network, sourcing methodology, founder's prior operating role): [CLIENT ANSWER]

## §2. Vertical & ICP

- **Industries served — primary** (`[INDUSTRIES_PRIMARY]`, e.g. "B2B SaaS", "fintech", "industrial / manufacturing", "life sciences"): [CLIENT ANSWER]
- **Industries served — secondary, if any** (`[INDUSTRIES_SECONDARY]`): [CLIENT ANSWER]
- **Function focus** (`[FUNCTION_FOCUS]`, e.g. "Engineering & Product", "Go-to-Market", "Finance & Operations", "Clinical & Regulatory"): [CLIENT ANSWER]
- **Role bands typically placed** (`[ROLE_BANDS]`, e.g. "ICs $80k–$150k base", "Director / VP $180k–$280k", "C-suite retained only"): [CLIENT ANSWER]
- **Geographic coverage** (`[GEOGRAPHIC_COVERAGE]`, e.g. "GTA + remote-Canada", "North America cross-border", "Ontario only"): [CLIENT ANSWER]
- **Cross-border placements?** (yes / no — if yes, name the lanes, e.g. "US ↔ Canada on TN visas only"): [CLIENT ANSWER]
- **Hard-stop industries** (`[INDUSTRIES_DO_NOT_SERVE]`, free text — e.g. "no gambling, no MLM, no defence primes"): [CLIENT ANSWER]

## §3. Placement model & fees

- **Placement model** (`[PLACEMENT_MODEL]`, one of: `contingent`, `retained`, `engaged-search`, `hybrid`, `RPO` — pick the dominant model and note any secondary in the next field): [CLIENT ANSWER]
- **Secondary models offered, if any** (e.g. "retained for VP+ only; contingent below"): [CLIENT ANSWER]
- **Fee structure** (`[FEE_STRUCTURE]`, e.g. "20% of first-year base; $25k minimum", "third-third-third on retained at 30%", "RPO: $12k/month per req"): [CLIENT ANSWER]
- **Fee floor / minimum placement fee** (`[FEE_MINIMUM]`, e.g. "$18,000"): [CLIENT ANSWER]
- **Replacement / guarantee policy** (`[GUARANTEE_TERMS]`, e.g. "90-day prorated replacement; full re-search if candidate departs in first 30 days"): [CLIENT ANSWER]
- **Free intake call before signing?** (yes / no — define call length and whether it's gated to a job-spec discussion): [CLIENT ANSWER]
- **Engagement letter / MSA template the firm uses** (free text — name the template; the prompts reference but do NOT publish contract terms): [CLIENT ANSWER]
- **Payment terms after invoice** (`[PAYMENT_TERMS]`, e.g. "Net 30", "Net 15 with 2% early-pay"): [CLIENT ANSWER]

## §4. Process & timelines

- **Typical time-to-shortlist** (`[TIME_TO_SHORTLIST]`, e.g. "5 business days for ICs; 10 for VP+"): [CLIENT ANSWER]
- **Typical time-to-fill** (`[TIME_TO_FILL]`, e.g. "3–5 weeks contingent; 6–10 weeks retained"): [CLIENT ANSWER]
- **Shortlist size** (`[SHORTLIST_SIZE]`, e.g. "3–5 vetted candidates per role"): [CLIENT ANSWER]
- **Screening depth** (`[SCREENING_DEPTH]`, e.g. "30-min recruiter screen + technical pre-screen + reference check before shortlist"): [CLIENT ANSWER]
- **Interview-loop coordination provided?** (yes / no — and what the firm does vs hands back to the client): [CLIENT ANSWER]
- **Offer-stage coaching / negotiation support?** (yes / no — describe in 1 sentence): [CLIENT ANSWER]
- **Onboarding follow-up after start date** (`[ONBOARDING_CHECKINS]`, e.g. "30/60/90-day check-ins with both sides"): [CLIENT ANSWER]
- **Recent placement counts — last 12 months** (`[PLACEMENTS_LAST_12MO]`, integer; only print on the site if the founder confirms it's accurate): [CLIENT ANSWER]
- **OK to display placement counts publicly?** (yes / no — some firms prefer "selected placements" framing without numbers): [CLIENT ANSWER]

## §5. Sourcing & tooling

- **Primary sourcing channels** (`[SOURCING_CHANNELS]`, e.g. "passive LinkedIn outreach, GitHub for engineering, founder's personal network, alumni Slack groups"): [CLIENT ANSWER]
- **ATS in use** (`[ATS_NAME]`, one of: "Greenhouse", "Lever", "Ashby", "Workable", "Bullhorn", "JobAdder", "none — spreadsheets"): [CLIENT ANSWER]
- **CRM / sourcing tools** (`[SOURCING_TOOLS]`, e.g. "LinkedIn Recruiter, Gem, hireEZ, Loxo"): [CLIENT ANSWER]
- **Reference-check tooling** (`[REFERENCE_TOOL]`, e.g. "Crosschq, Xref, manual"): [CLIENT ANSWER]
- **Background-check provider** (`[BACKGROUND_CHECK]`, e.g. "Certn, Sterling, none — handled by client"): [CLIENT ANSWER]
- **Assessment tools used** (`[ASSESSMENT_TOOLS]`, e.g. "CodeSignal, HackerRank, custom take-homes, none"): [CLIENT ANSWER]

## §6. Candidate experience & confidentiality

- **How candidates first hear about the firm** (`[CANDIDATE_INTAKE_PATH]`, e.g. "outbound only", "applications through site", "referrals from placed candidates"): [CLIENT ANSWER]
- **Confidentiality posture for candidates** (`[CANDIDATE_CONFIDENTIALITY]`, e.g. "we never share a candidate's name or current employer with a client without explicit consent"): [CLIENT ANSWER]
- **Confidentiality posture for client searches** (`[CLIENT_CONFIDENTIALITY]`, e.g. "named confidential searches available; firm name disclosed only post-NDA"): [CLIENT ANSWER]
- **Candidate-side fees?** (yes / no — **must be `no` for any reputable placement firm in Canada; flag explicitly if `yes`**): [CLIENT ANSWER]
- **Candidate communication SLA** (`[CANDIDATE_SLA]`, e.g. "response within 1 business day, status update at every stage transition"): [CLIENT ANSWER]

## §7. Compliance & jurisdiction

- **Primary jurisdiction** (`[JURISDICTION]`, one of: "Ontario / ESA", "BC / ESA", "Quebec / Act respecting labour standards", "federal / Canada Labour Code", "cross-border — name lanes"): [CLIENT ANSWER]
- **Employment-standards posture for placed candidates** (`[ESA_POSTURE]`, e.g. "all placements W2 / T4 with the client; firm does not act as employer-of-record"): [CLIENT ANSWER]
- **Employer-of-record / staffing-agency licence** (`[STAFFING_LICENCE]`, e.g. "Ontario Temporary Help Agency licence #THA-XXXX" — required if the firm places contingent / temp workers under Ontario Bill 79; mark `not applicable — search-only firm` if permanent placements only): [CLIENT ANSWER]
- **Employment-equity / accessibility commitment** (`[EE_AA_STATEMENT]`, e.g. "AODA-compliant interview accommodations; gender / racialised representation tracked on every shortlist"): [CLIENT ANSWER]
- **OK to display the EE / AA statement publicly?** (yes / no — recommended yes for B2B credibility, but capture the founder's actual wording): [CLIENT ANSWER]
- **Privacy / PIPEDA posture for candidate data** (`[PRIVACY_POSTURE]`, e.g. "candidate consent captured at intake; data retained 24 months post-search; deletion on request"): [CLIENT ANSWER]
- **Compliance callouts the founder wants visible on the site** (e.g. "AODA-compliant", "PIPEDA-aligned data handling", "Ontario THA licence #..."): [CLIENT ANSWER]

## §8. Contact & dual audience

The recruitment site has two distinct CTAs: clients with open roles, and candidates exploring opportunities. Capture both clearly.

- **Phone number** (`[PHONE_E164]`, in `+1XXXXXXXXXX` format for JSON-LD): [CLIENT ANSWER]
- **Phone number, display form** (`[PHONE_DISPLAY]`, e.g. "(416) 555-0188"): [CLIENT ANSWER]
- **Preferred contact method for new client enquiries** (phone / form / LinkedIn DM / email): [CLIENT ANSWER]
- **Preferred contact method for candidate enquiries** (form / direct email to a recruiter / LinkedIn): [CLIENT ANSWER]
- **Client-side enquiry email** (`[CLIENT_INQUIRY_EMAIL]`, e.g. "hiring@firm.com"): [CLIENT ANSWER]
- **Candidate-side enquiry email** (`[CANDIDATE_INQUIRY_EMAIL]`, e.g. "candidates@firm.com" — may be the same as client-side for solo firms): [CLIENT ANSWER]
- **Office address — for JSON-LD `address`** (`[OFFICE_ADDRESS]`, full street address; mark `[remote-first, no published office]` if the firm operates without a public office): [CLIENT ANSWER]
- **Operating hours — day-by-day** (`[HOURS_TABLE]`, fill the table below):

  | Day | Open | Close |
  |---|---|---|
  | Mon | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Tue | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Wed | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Thu | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Fri | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Sat | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | Sun | [CLIENT ANSWER] | [CLIENT ANSWER] |

  > Use 24h time (e.g. `09:00`) so the JSON-LD prompt can pass it through to `openingHoursSpecification` without conversion. Mark `closed` for closed days.

## §9. Web presence & social proof

- **Existing domain** (`[DOMAIN]`, leave blank if "need one"): [CLIENT ANSWER]
- **LinkedIn company page URL** (`[LINKEDIN_COMPANY_URL]`): [CLIENT ANSWER]
- **Founder's LinkedIn profile URL** (`[FOUNDER_LINKEDIN_URL]`): [CLIENT ANSWER]
- **Other social / directory links** (Twitter/X, Substack, podcast, Glassdoor — full URLs): [CLIENT ANSWER]
- **Existing site to migrate from** (URL, or "none"): [CLIENT ANSWER]
- **Logos of past client companies that may be displayed** (`[CLIENT_LOGOS]`, list each logo + permission status — "permission granted in writing" / "logo only, no name in copy" / "do not display"): [CLIENT ANSWER]
- **Testimonials / placed-candidate or hiring-manager quotes — up to 3** (`[TESTIMONIALS]`):

  | # | Quote | Attribution name | Role + company (or anonymised role + sector) | Side (hiring-manager / placed-candidate) |
  |---|---|---|---|---|
  | 1 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 2 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |
  | 3 | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] | [CLIENT ANSWER] |

  > Each testimonial requires written permission to publish. If the attribution is anonymised, store the real attribution privately in `docs/clients/<slug>/testimonials.md` (mothership repo only) so the operator can verify on review.

## §10. Brand & visuals

- **Colour preferences or existing brand colours** (`[BRAND_COLOURS]`, hex if known): [CLIENT ANSWER]
- **Logo file provided?** (yes / no — if yes, path in shared drive): [CLIENT ANSWER]
- **Headshots — founder + recruiters** (`[HEADSHOT_COUNT]`, integer; recruitment sites lean heavily on faces, so 0 means "stop and book a shoot"): [CLIENT ANSWER]
- **Photo themes the founder wants represented** (e.g. "founder portrait, team in office, candidate intake call setup"): [CLIENT ANSWER]

## §11. Open roles feed (optional)

- **Open-roles board on the site?** (yes / no — if yes, Prompt 11 fires): [CLIENT ANSWER]
- **Source of role data** (`[ROLES_FEED_SOURCE]`, e.g. "ATS export — Greenhouse JSON board API", "manual MDX list updated weekly", "Notion database via API"): [CLIENT ANSWER]
- **How often roles change** (`[ROLES_FEED_CADENCE]`, e.g. "weekly", "ad-hoc — only when retained"): [CLIENT ANSWER]
- **Confidentiality posture for client names on roles** (e.g. "client name shown only post-application", "industry + size disclosed, name withheld"): [CLIENT ANSWER]

## §12. Optional features & house notes

- **Dual-audience CTA pattern desired?** (yes / no — if yes, Prompt 12 fires; default is yes for any firm that takes both client and candidate enquiries through the same site): [CLIENT ANSWER]
- **Newsletter / market-pulse list?** (yes / no — out of scope for this prompt set; flag a follow-up issue if yes): [CLIENT ANSWER]
- **Candidate-application form needed?** (yes / no — **if yes, do NOT generate it from this prompt set**: file a separate issue tagged `complexity/complex` because it needs ATS API wiring, file uploads, and PIPEDA-compliant consent capture): [CLIENT ANSWER]
- **Anything operator should NOT mention on the site** (lapsed certifications, prior firm names, lawsuits, dropped clients, departed recruiters): [CLIENT ANSWER]
- **Operator's own notes from the call** (vibe, energy, claims that need verification before publishing): [OPERATOR NOTES]

---

## Prompts run (operator log)

Update this checklist as you run each prompt from `recruiter-prompts.md`. Append the destination filepath in the client repo so the next operator can find the generated section quickly.

- [ ] Prompt 1 — Hero copy → `src/app/page.tsx` (or `src/content/home.ts`)
- [ ] Prompt 2 — About / firm story → `src/content/about.mdx`
- [ ] Prompt 3 — Service offering (verticals + roles placed) → `src/content/services.mdx`
- [ ] Prompt 4 — Process / engagement-model section → `src/content/process.mdx`
- [ ] Prompt 5 — Booking / discovery-call section → `src/components/sections/Discovery.tsx`
- [ ] Prompt 6 — Testimonials / placed-candidate quotes → `src/components/sections/Testimonials.tsx`
- [ ] Prompt 7 — Logo wall / client trust section → `src/components/sections/LogoWall.tsx`
- [ ] Prompt 8 — SEO metadata → `src/app/page.tsx` (`metadata` export)
- [ ] Prompt 9 — JSON-LD structured data (`EmploymentAgency` schema) → `src/app/page.tsx` (`<JsonLd>` block)
- [ ] Prompt 10 — Contact / dual-audience form wrapper → `src/components/sections/Contact.tsx`
- [ ] Prompt 11 — Open roles board *(only if §11 = yes)* → `src/components/sections/OpenRoles.tsx`
- [ ] Prompt 12 — "Looking to hire" vs "Looking for a role" dual CTA *(only if §12 = yes)* → `src/components/sections/DualCTA.tsx`
