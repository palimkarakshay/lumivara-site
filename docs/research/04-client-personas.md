<!-- Client persona pack used to target stakeholder decks. -->

# 04 — Client Personas

Three target personas (the "say yes to" list), one anti-persona (the "say no to" list), and one boundary-edge persona (case-by-case). Every budget figure cites a row in `03-source-bibliography.md`. Personas are a refinement of `docs/storefront/01-gig-profile.md` Part 8 — read that first for the longer-form filter.

> **Use of this doc.** When drafting any client-facing deck, pick the single persona it targets and write the deck *for that one* — never a generic "small business owner." When two personas apply, write two decks; do not blend them.

---

## P1 — *"The Premium Solo / Small-Boutique Professional"* — Tier 2 (headline)

**Who they are.** Solo lawyer, executive coach, organisational-design consultant, HR consultant, specialised accountant, boutique therapist. Practice age 3–15 years. Either solo or 2–8 staff. Toronto / GTA / Canadian-metro for warm-network sourcing; later USD-priced for U.S. expansion.

**Their pain.**
- The site looks dated. They know it. Refreshing it has been a "next quarter" item for 18 months.
- Updates require calling the developer who built it (often a friend-of-a-friend), then waiting two weeks for a one-line change.
- They've watched competitors with 2× the polish win pitches that should have been theirs.

**Their budget.**
- Law firms: ~$120k–$150k/yr on SEO marketing alone (`[V] §B-Law-Firm-Spend`); the website is the foundation of that spend.
- Boutique consultants: 5–10% of revenue on marketing is typical (referenced in `[S] §B-Dental-Spend`-class aggregations); CAD $5k–$15k/yr on web is small but visible.

**What sells.**
- "One missed inquiry costs more than the entire 24-month subscription." For a corporate lawyer, a single client = tens of thousands in fees; the math is trivial.
- ADA compliance is a *legal* concern, not a brand concern. 3,117 federal accessibility lawsuits in 2025, +27% YoY (`[V] §B-ADA-Lawsuits`) lands hard with this audience.
- "Phone-edit" is reframed as "you stop being a bottleneck for your own marketing."

**Tier mapping.** Tier 2 (CAD $4,500 setup + $249/mo). Some upgrade to Tier 3 if they have a careers page or multiple practice lines.

**Deck used.** `docs/decks/04-prospective-client-deck.md` — Persona P1 variant.

---

## P2 — *"The Trust-Driven Local Health Practice"* — Tier 2 (volume)

**Who they are.** Dental practice, optometrist, physio, chiropractor, specialist medical clinic, multi-doctor family practice. Owner-operator or 1–3 partner principals. 5–25 staff including hygienists, nurses, admin. Single location; some with 2–3 locations.

**Their pain.**
- Their site was built in 2019 by a vendor who has stopped returning calls.
- Updates ("new staff bio," "new insurance accepted," "holiday hours") never get done because the workflow is "email Karen the office manager → Karen emails the developer → developer emails back about pricing → nobody responds."
- Their compliance officer has flagged ADA risk twice and they don't know what to do.
- Patients are increasingly booking from phones; the existing site is not mobile-first.

**Their budget.**
- Practices grossing $1M+/yr typically allocate 5–10% to marketing — $50k–$100k/yr (`[S] §B-Dental-Spend`); ~30–40% of that goes to web + SEO ($15k–$40k/yr).
- Tier 2 (CAD $4,500 + $249/mo) is well below their existing line item.

**What sells.**
- The compliance gate. ADA + provincial accessibility laws (e.g. AODA in Ontario) are a real legal liability, and an automated CI gate that catches regressions before publish is a clean answer to that.
- "Dr. Smith updates from her phone between patients." Owner-time savings is the headline.
- Reviews + booking integrations (Cal.com / Calendly) at Tier 3 if they want online booking flow.

**Tier mapping.** Tier 2 default; Tier 3 if multi-location or booking-flow integrated.

**Deck used.** `docs/decks/04-prospective-client-deck.md` — Persona P2 variant.

---

## P3 — *"The Small Boutique Services Firm"* — Tier 3

**Who they are.** Recruiting boutique, design studio, ESG consultancy, mid-market financial-advisory firm, architecture studio. 5–25 staff. One marketing site + a careers / insights subsite + a contact form that needs to route to a CRM. Sometimes two languages.

**Their pain.**
- They have a marketing manager, but the marketing manager is not a developer and is constantly gated by an external agency.
- They want long-form content (case studies, insights articles) on a real cadence, not "when the agency gets to it."
- They have integration needs (Stripe, HubSpot, Cal.com) that put them above the DIY-builder ceiling and into agency territory — which they don't want.

**Their budget.** CAD $20k–$60k/yr on web + marketing tooling is typical. Tier 3 (CAD $7,500 + $599/mo) lands in the bottom of that range.

**What sells.**
- "One named accountable person, not a PM-plus-dev-plus-designer trio."
- The 4-hour SLA on production-down issues.
- Multi-language support and CRM webhook integration as included scope, not a "phase 2 upsell."

**Tier mapping.** Tier 3.

**Deck used.** `docs/decks/04-prospective-client-deck.md` — Persona P3 variant.

---

## A1 — Anti-persona — *"The High-Volume Local Trades / Restaurant"* — say no

**Who they are.** Single-location restaurant, nail salon, barber shop, plumber, electrician, lawn care. Margins are thin; they update menus or specials weekly.

**Why we say no.**
- Their CAC tolerance is wrong: they need updates *often* (Tier 3 / T4 cadence) but cannot pay Tier 3 prices. Their actual budget is $1,500–$3,500 *total* upfront for a site, not $7,500 + $599/mo.
- The Phone-as-CMS pipeline value (long-form content, accessibility compliance, integrations) is wasted on them; they are better served by Google Business Profile + Yelp + a $25/mo Squarespace.
- The relationship math is brutal: one frustrated trades client costs more in operator hours than ten happy P2 clients earn.

**What we recommend instead.**
- Squarespace + Google Business Profile (DIY).
- Or refer to a local agency that genuinely specialises in the trade vertical.

**Deck used.** None. We do not pitch this segment.

---

## E1 — Edge case — *"The Indie SaaS Founder"* — case-by-case

**Who they are.** Indie hacker / micro-SaaS founder. Marketing site + docs + a thin auth / billing surface. Wants to "hack on it later." Reads Hacker News.

**Why this is borderline.**
- They genuinely understand the engineering value and pay readily. *But* they are likely to want to fork the code and walk after 6 months, which compresses retainer LTV.
- Their definition of "edit from a phone" is "I'll edit the MDX in my own editor"; the Phone-as-CMS pitch lands less hard.

**Pitch.** Tier 2 with a discount on the setup fee in exchange for a public case-study post and one inbound referral. Treat retainer as month-to-month, not annual.

**Tier mapping.** Tier 2; case-by-case discount on setup.

**Deck used.** `docs/decks/04-prospective-client-deck.md` — Persona E1 variant (lighter, technical voice).

---

## Cross-reference matrix

| Persona | Headline pain | Headline stat | Tier | Source row |
|---|---|---|---|---|
| P1 — Premium solo professional | "Updates take 2 weeks; competitors look better than us" | $120k–$150k/yr SEO; 96% start at search | T2 | `[V] §B-Law-Firm-Spend` |
| P2 — Local health practice | "ADA compliance + mobile-first + owner can't update" | 3,117 ADA lawsuits / 27% YoY | T2 / T3 | `[V] §B-ADA-Lawsuits`, `[S] §B-Dental-Spend` |
| P3 — Small boutique firm | "We need one accountable person, not a 3-person agency layer" | CAD $20k–$60k/yr current marketing spend | T3 | derived |
| A1 — Trades / restaurant | "Need updates often, cannot pay" | — | none | — |
| E1 — Indie SaaS founder | "I'd hack on this myself; pipeline is the value" | — | T2 month-to-month | — |

---

*Last updated: 2026-04-29.*
