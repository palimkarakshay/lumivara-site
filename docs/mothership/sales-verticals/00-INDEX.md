<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SALES PLAYBOOK

  Everything under `docs/mothership/sales-verticals/` is **per-vertical sales
  positioning** for Lumivara Forge: how to identify, qualify, pitch, price,
  de-risk, and close clients in a specific high-LTV professional-services
  vertical.

  Hard rules:
    1. Nothing in this folder ships in a client's repo (Pipeline lane).
    2. Nothing in this folder is forwarded verbatim to a prospect. The
       client-facing distillation is `../../decks/04-prospective-client-deck.md`
       (persona-tailored), not these source files.
    3. Numbers in these templates that drive a pitch MUST trace back to a
       row in `../../research/03-source-bibliography.md`. Where a number is
       directional (operator estimate, vertical aggregation), it is flagged
       inline as `[OE]` (operator estimate) or `[S]` (soft / aggregated) so
       the reader can pressure-test it before quoting.

  See `../00-INDEX.md` for the surrounding doc set and Dual-Lane Repo
  architecture (`../02b-dual-lane-architecture.md`).
================================================================================
-->

# Vertical sales templates — master index

> _Lane: 🛠 Pipeline — operator-only sales positioning; never copied to a client repo._

This folder holds **per-vertical sales playbooks** for the high-LTV professional-services verticals Lumivara Forge actively pitches. It complements — and does not replace — three existing scaffolds:

- [`../../research/04-client-personas.md`](../../research/04-client-personas.md) — the three target personas (P1 / P2 / P3) and the anti-persona (A1). Every vertical here maps to one of those personas.
- [`../../research/05-reasons-to-switch-to-lumivara-forge.md`](../../research/05-reasons-to-switch-to-lumivara-forge.md) — the seven empirically-grounded "why switch" reasons (R1–R7). Each vertical template selects 2–3 of them.
- [`../templates/`](../templates/) — the **content-prompt scaffolding** the operator pastes into Claude Opus while building a new client site. Different purpose: those generate hero copy, MDX, JSON-LD; **these** decide whether the prospect is a fit and how to close them.

The persona pack tells you *who* to sell to. The reasons-to-switch pack tells you *what* to say. The vertical templates here tell you *how that conversation runs in practice for this specific kind of business* — including the dollar arbitrage, the regulator everyone in that vertical fears, and the objections you should expect.

---

## Status

| # | Vertical | Persona | Default tier | File | Status |
|---|---|---|---|---|---|
| 1 | Family medicine / GP clinic | P2 | T2 | [`doctors-sales-template.md`](./doctors-sales-template.md) | ✅ Full |
| 2 | Dentistry (single + multi-op) | P2 | T2 / T3 | [`dentists-sales-template.md`](./dentists-sales-template.md) | ✅ Full |
| 3 | Law (solo + small firm) | P1 | T2 | [`lawyers-sales-template.md`](./lawyers-sales-template.md) | ✅ Full |
| 4 | Accounting / bookkeeping | P1 | T1 / T2 | [`accountants-sales-template.md`](./accountants-sales-template.md) | ✅ Full |
| 5 | Physiotherapy / chiropractic / wellness | P2 | T2 | [`physiotherapy-sales-template.md`](./physiotherapy-sales-template.md) | ✅ Full |
| 6 | Optometry | P2 | T2 | [`optometry-sales-template.md`](./optometry-sales-template.md) | ✅ Full |

**Legend:** ✅ Full = persona, pain map, ROI math, objection handlers, sources all complete. 🔲 Stub = file exists with section headings only. ⏳ Planned = not yet stubbed.

**Cross-vertical reference (operator-only).** [`00a-negative-list-rationale.md`](./00a-negative-list-rationale.md) — the source-of-truth reasoning behind every "Why we won't sell you SEO" + "What this is *not*" slide in the per-vertical pitch decks (`../../decks/vertical-pitches/`) and the master decks (`../../decks/06-master-deck.md`, `06a-master-deck-shareable.md`). Read this before any objection-handling reply that touches rankings, AI chatbots, lead-gen guarantees, content marketing, review-gating, paid ads, social media, EMR replacement, white-labelling, or equity-only deals. Every entry carries the regulator citation, the platform-TOS citation, and the structural alternative we charge for instead.

**Adjacent vertical content templates** (different folder, different purpose) tracked in [`../templates/00-templates-index.md`](../templates/00-templates-index.md): restaurant, plumbing, realtor, recruiter content prompts.

---

## How to use a vertical template

Run this on a per-prospect basis, before the first discovery call.

1. **Identify the vertical** from the prospect's intake form, gig inquiry, or warm intro. If they don't fit any row above, default to the persona-only pitch in `../../decks/04-prospective-client-deck.md` and file a `area/sales` issue to add a new row here.

2. **Read the matching `<vertical>-sales-template.md` end-to-end** before the call. ~10 minutes. The discovery questions, the dollar arbitrage, and the regulator-of-record are all in the file; do not improvise these on a live call.

3. **Cherry-pick 2–3 reasons to switch** for the discovery call from §11 ("Why they should switch"). Never use all seven R-reasons in one conversation; the deck collapses if it tries to.

4. **Anchor the financial conversation** on the §13 ROI math. Bring the table from §13 into the call as a prepared view; do not improvise dollar figures.

5. **Pre-load the §16 objection handlers.** The objections in each template are the ones we have actually heard from that vertical, not theoretical objections. If you hit a new objection, log it in §16 of the template after the call.

6. **Close on a tier from the §15 close path** (T1 / T2 / T3). If the prospect is below tier-fit, downsell — do not discount the headline tier.

7. **After the call, log the outcome** in `../19-engagement-evidence-log-template.md` so the next operator session can spot patterns.

---

## What each template covers (the section spine)

Every vertical template uses the same 18-section spine so they can be diffed side-by-side. The sections, in order:

1. **Snapshot** — vertical name, persona alignment, default tier, headline pain in one sentence.
2. **Who they are** — practice shape, staff size, age, geography, owner archetype.
3. **Core issues / pain points** — what is actually broken about their current web presence + adjacent ops.
4. **Basic requirements** — the MVP they think they're buying. Table-stakes for any vendor pitching them.
5. **Aspirational requirements** — what they actually want but haven't asked for yet. Where the upsell lives.
6. **How Lumivara covers basic + aspirational** — feature-by-feature mapping from §4–§5 to Lumivara Forge capabilities.
7. **Current problems and risks** — status-quo failure modes (regulatory, operational, financial, reputational).
8. **How Lumivara mitigates each risk** — paired one-to-one with §7.
9. **Regulator-of-record** — the body, statute, or case law that makes §7 non-optional. Vertical-specific.
10. **Why now** — three numbers that justify acting this quarter, not next year.
11. **Why they should switch** — selected reasons from `../../research/05-reasons-to-switch-to-lumivara-forge.md` (R1–R7), tuned to this vertical.
12. **Benefits** — ranked, not exhaustive. Top three carry the pitch.
13. **Financial analysis & cost-benefit** — current spend / new spend / 24-month delta / ROI break-even / single-client-acquired payback.
14. **Risks of switching + how we de-risk** — switching cost, vendor-fail risk, lock-in fears.
15. **Sales conversation flow (discovery → close)** — three-call structure: discovery, proposal, close.
16. **Objection handlers** — the four to six objections this vertical actually raises, with prepared answers.
17. **Sources & citations** — every quoted figure traces back to `../../research/03-source-bibliography.md` or is flagged `[OE]` / `[S]`.
18. **Operator notes** — what to watch for, what to never say, what to upsell after month 6.

A new vertical is **promoted Stub → Full** when all 18 sections have real content (not placeholders) and at least three sources are cited.

---

## The verticals NOT in this folder (and why)

These are explicit skip lists, not oversight. Each is sourced from the `04-client-personas.md` A1 anti-persona criteria:

| Skipped vertical | Why we don't pitch | What we recommend instead |
|---|---|---|
| Restaurants / cafés | High-volume menu changes; thin margin; weekly cadence; <Tier 1 budget. | Squarespace + Google Business Profile. Content prompts under [`../templates/restaurant-prompts.md`](../templates/restaurant-prompts.md) exist for content-only engagements (fixed-fee Tier 0). |
| Trades (plumbing, electrical, HVAC) | Service-area driven; Google Local Service Ads dominate the funnel; a marketing site is secondary. | Local Service Ads + a Tier 0 Lumivara site as the trust layer. Content prompts under [`../templates/plumber-prompts.md`](../templates/plumber-prompts.md). |
| Single-location restaurant / bar | Same as restaurants. | Same. |
| Salon / barber / nail studio | Booking-app-driven funnel; Squarespace covers the trust layer. | DIY builder + Booksy / Vagaro / Square Appointments. |
| E-commerce / Shopify | Outside the moat — Shopify owns the cart, the inventory, the fulfilment integrations. We sell content sites, not stores. | Shopify Plus / a dedicated Shopify partner. |
| Real estate (single agent) | Vertical-specific platforms (Boomtown / Sierra / kvCORE) own the IDX and lead-routing layer. | Brokerage-supplied platform + a Tier 0 personal-brand site. Content prompts under [`../templates/realtor-prompts.md`](../templates/realtor-prompts.md). |
| Recruitment / staffing agency | Not skipped — sometimes a P3 fit. Covered by content prompts under [`../templates/recruiter-prompts.md`](../templates/recruiter-prompts.md); a sales-vertical template will be added in a follow-up. |
| Restaurants chains / multi-location franchises | Enterprise procurement; > 25-staff threshold; agency territory. | Refer out. |

When in doubt, the `01-gig-profile.md` Part 8 ("say-no-to" filter) is the operator-side gate.

---

## Why these six verticals (and not others)

The six picked above share three properties that the skip-list verticals do not:

1. **High client LTV** — a single retained client in any of these six is worth $5,000–$50,000+ in fees. The website conversion rate matters in absolute dollars, not in fractions of a percentage.
2. **Real regulator-of-record** — each one has a statute, college, or case-law body whose accessibility / privacy / professional-conduct rules make a *non-compliant* site a tangible liability, not a brand concern. (R4 lands hard in all six.)
3. **Owner is the bottleneck for content edits, not a marketing department** — solo or small-partnership shape. Phone-as-CMS solves the actual workflow, not a hypothetical one.

These three properties are the underwriting test for *any* future vertical proposed for this folder.

---

## Adding a new vertical

When promoting an idea to a `🔲 Stub` row:

1. Confirm the vertical passes the three-property test above. If not, document the rejection in this index and stop.
2. Copy `doctors-sales-template.md` to `<vertical>-sales-template.md` and replace each section body with `[CONTENT PENDING]`.
3. Update the table at the top of this file (status column → 🔲).
4. Open an issue tagged `area/sales` to fill out the body; reference this index.

When promoting a `🔲 Stub` to `✅ Full`:

1. All 18 sections must have real content — placeholders fail the audit.
2. At least three citations must trace back to `../../research/03-source-bibliography.md` `[V]` or `[S]` rows. `[OE]` operator estimates do not count toward the citation minimum.
3. Update the table (status column → ✅).

---

## Cross-references

- **Operator persona pack:** [`../../research/04-client-personas.md`](../../research/04-client-personas.md)
- **Why-switch reasons:** [`../../research/05-reasons-to-switch-to-lumivara-forge.md`](../../research/05-reasons-to-switch-to-lumivara-forge.md)
- **Honest drawbacks:** [`../../research/06-drawbacks-and-honest-risks.md`](../../research/06-drawbacks-and-honest-risks.md)
- **Pricing tiers (CAD authoritative):** [`../../storefront/02-pricing-tiers.md`](../../storefront/02-pricing-tiers.md)
- **Cost analysis (per-client unit economics):** [`../../storefront/03-cost-analysis.md`](../../storefront/03-cost-analysis.md)
- **Source bibliography (every `[V]` row):** [`../../research/03-source-bibliography.md`](../../research/03-source-bibliography.md)
- **Engagement evidence log (post-call write-up):** [`../19-engagement-evidence-log-template.md`](../19-engagement-evidence-log-template.md)
- **Prospective-client deck (the client-facing distillation):** [`../../decks/04-prospective-client-deck.md`](../../decks/04-prospective-client-deck.md)

---

*Last updated: 2026-04-30 — initial publication of all six full vertical sales templates (doctors, dentists, lawyers, accountants, physiotherapy, optometry). Operator follow-up: backfill the `[S]`-flagged source rows listed in each template's §17 into `../../research/03-source-bibliography.md` before externally quoting.*
