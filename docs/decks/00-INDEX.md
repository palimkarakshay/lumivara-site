<!-- Stakeholder deck index. Read order: index -> deck -> research/ for sources. -->

# Stakeholder Deck Pack — Master Index

> _Lane: 🛠 Pipeline — operator-only stakeholder decks; never copied to a client repo._
>
> **Brand domain banner.** Operator-brand domain `lumivara-forge.com` is **pending registration** (see [`docs/mothership/15-terminology-and-brand.md §5`](../mothership/15-terminology-and-brand.md)). Decks reference it as the locked operator domain; until registration completes the URL will not resolve. The interim demo URL lives under [`palimkarakshays-projects` on Vercel](https://vercel.com/palimkarakshays-projects).

Five decks, one per audience, plus this index. Every deck cites `docs/research/03-source-bibliography.md` for its load-bearing claims and follows the verification posture set in `docs/research/00-INDEX.md`.

> **Audience-fit rule.** Every deck is written *to* one audience and *from* one voice. Never mix audiences in a single deck — make a new deck instead.

---

## The five decks

| # | File | Audience | Voice | Confidentiality | Length |
|---|---|---|---|---|---|
| 01 | `01-investor-deck.md` | Angel / family-office / strategic LP looking at the model | Numbers-first, conservative, footnoted | External, NDA-gated | ~14 slides |
| 02 | `02-partner-deck.md` | A future co-operator (hands-on partner who will share operations and benefit-share in the upside) | Plain, candid, partnership-shaped | External, single recipient | ~16 slides |
| 03 | `03-employee-deck.md` | A first hire (contract engineer or VA) considering joining | Honest about the work + the culture | External, single recipient | ~12 slides |
| 04 | `04-prospective-client-deck.md` | A solo professional / health practice / boutique firm comparing options | Persona-aware, plain, no jargon | External, persona-tailored | ~14 slides |
| 05 | `05-advisor-deck.md` | A senior advisor / mentor the operator is asking to pressure-test the plan | Operator-honest, drawbacks first | External, single recipient | ~12 slides |

---

## How the decks relate to existing material

Two decks already exist in `docs/storefront/`:

- `04-slide-deck.md` is the **outward-facing prospect deck used at top-of-funnel**. The new `04-prospective-client-deck.md` is **persona-tailored** and meant for second-touch / discovery-call conversion. Use the freelance deck for cold outreach; use the new deck for warm-lead conversion.
- `06-positioning-slide-deck.md` is the **operator-internal nine-questions deck**. The new decks here are **stakeholder-specific** and read out from that operator-internal version. Update the freelance deck first; the stakeholder decks inherit.

Reading order for a new operator session that needs to understand the deck pack:

1. `docs/storefront/06-positioning-slide-deck.md` — operator's own internal answer
2. `docs/research/00-INDEX.md` → `01` → `04` → `05` → `06` — the evidentiary layer
3. This file
4. The specific deck the audience needs

---

## Brand and pricing variables

All decks use the brand `Lumivara Forge` and CAD pricing from `docs/storefront/02-pricing-tiers.md`. If either changes — for example, the brand rename from `01-business-plan §1` ships, or pricing is bumped after the 5-review threshold — update each deck's title slide + pricing slide. The slugs in `docs/research/03-source-bibliography.md` are stable; deck content doesn't need to change beyond brand + tier prices.

---

## Pre-publication gate

Before any deck in this folder is shared externally, walk these checks:

- [ ] Every number, percentage, or dollar figure in the deck has a `[V]` row in `docs/research/03-source-bibliography.md`. Numbers without a `[V]` row are removed or downgraded with an explicit footnote.
- [ ] No deck quotes the "22.4× EBITDA / 22.3% AI-premium" framing without explicit context (`docs/research/01 §5`).
- [ ] Brand placeholder is locked to `Lumivara Forge` (or whatever rename has shipped per `docs/mothership/01 §1`).
- [ ] Pricing matches the current `docs/storefront/02-pricing-tiers.md` table.
- [ ] If the deck is for a single named recipient, the file's frontmatter records the recipient and the date sent (so we don't accidentally re-send a stale version).

---

*Last updated: 2026-04-29 — initial five-deck stakeholder pack.*
