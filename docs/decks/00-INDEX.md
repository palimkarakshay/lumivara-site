<!-- Stakeholder deck index. Read order: index -> deck -> research/ for sources. -->

# Stakeholder Deck Pack — Master Index

> _Lane: 🛠 Pipeline — operator-only stakeholder decks; never copied to a client repo._
>
> **Brand domain banner.** Operator-brand domain `lumivara-forge.com` is **pending registration** (see [`docs/mothership/15-terminology-and-brand.md §5`](../mothership/15-terminology-and-brand.md)). Decks reference it as the locked operator domain; until registration completes the URL will not resolve. The interim demo URL lives under [`palimkarakshays-projects` on Vercel](https://vercel.com/palimkarakshays-projects).

Five stakeholder decks, one master deck (with a shareable companion), plus this index. Every deck cites `docs/research/03-source-bibliography.md` for its load-bearing claims and follows the verification posture set in `docs/research/00-INDEX.md`.

> **Audience-fit rule.** Every stakeholder deck is written *to* one audience and *from* one voice. Never mix audiences in a single deck — make a new deck instead. The master deck (`06-master-deck.md`) is the one exception: it is operator-scope and explicitly multi-audience, intended as the canonical synthesis the stakeholder decks read out from. Its shareable companion (`06a-master-deck-shareable.md`) is the same nine-question structure, generalised so it can be handed to a serious external reader without exposing operator-internal specifics.

---

## The five decks

| # | File | Audience | Voice | Confidentiality | Length |
|---|---|---|---|---|---|
| 01 | `01-investor-deck.md` | Angel / family-office / strategic LP looking at the model | Numbers-first, conservative, footnoted | External, NDA-gated | ~14 slides |
| 02 | `02-partner-deck.md` | A future co-operator (hands-on partner who will share operations and benefit-share in the upside) | Plain, candid, partnership-shaped | External, single recipient | ~16 slides |
| 03 | `03-employee-deck.md` | A first hire (contract engineer or VA) considering joining | Honest about the work + the culture | External, single recipient | ~12 slides |
| 04 | `04-prospective-client-deck.md` | A solo professional / health practice / boutique firm comparing options | Persona-aware, plain, no jargon | External, persona-tailored | ~14 slides |
| 05 | `05-advisor-deck.md` | A senior advisor / mentor the operator is asking to pressure-test the plan | Operator-honest, drawbacks first | External, single recipient | ~12 slides |
| 06 | `06-master-deck.md` | **Master synthesis** — the nine product-positioning questions answered in one deck for operator self-review and as the canonical source the stakeholder decks read out from | Operator-honest, exhaustive | **Operator-scope; do not share without selecting a stakeholder deck first** | ~50 slides |
| 06a | `06a-master-deck-shareable.md` | **Shareable companion to the master deck** — same nine questions, generalised for external readers (advisor / prospective partner / sophisticated investor / serious prospect doing diligence) | Externally-presentable, range-based | External, NDA-friendly; reader's pre-share checklist on the closing slide | ~50 slides |

**Pre-rendered HTML.** Every deck in this folder ships with a self-contained HTML build sitting next to its source — drop-in shareable, no Markdown viewer required, arrow keys / space advance slides:

- [`01-investor-deck.html`](01-investor-deck.html)
- [`02-partner-deck.html`](02-partner-deck.html)
- [`03-employee-deck.html`](03-employee-deck.html)
- [`04-prospective-client-deck.html`](04-prospective-client-deck.html)
- [`05-advisor-deck.html`](05-advisor-deck.html)
- [`06-master-deck.html`](06-master-deck.html)
- [`06a-master-deck-shareable.html`](06a-master-deck-shareable.html)

The freelance / positioning / product-strategy decks under `docs/storefront/` are rendered the same way (`04-slide-deck.html`, `06-positioning-slide-deck.html`, `06-product-strategy-deck.html`). Regenerate any HTML after edits with `npx -y @marp-team/marp-cli --html <source.md> -o <output.html>`. To produce a PDF, open the HTML in a browser and use **Print → Save as PDF** (PDF rendering through marp-cli requires a Chrome / Edge / Firefox binary on the build machine).

---

## How the decks relate to existing material

Two decks already exist in `docs/storefront/`:

- `04-slide-deck.md` is the **outward-facing prospect deck used at top-of-funnel**. The new `04-prospective-client-deck.md` is **persona-tailored** and meant for second-touch / discovery-call conversion. Use the freelance deck for cold outreach; use the new deck for warm-lead conversion.
- `06-positioning-slide-deck.md` is the **operator-internal nine-questions deck**. The stakeholder decks here are **audience-specific** and read out from that operator-internal version. Update the freelance deck first; the stakeholder decks inherit.

The master deck (`06-master-deck.md` in this folder) is the deck-pack-side counterpart of the storefront positioning deck: same nine questions, but written across all audiences in one place so a single read of it gives an operator (or a sufficiently trusted reviewer) the whole picture. The five stakeholder decks are voice-tuned subsets; the master deck is the union. The shareable companion (`06a-master-deck-shareable.md`) is the same union, generalised so it can be forwarded to a vetted external reader without operator-internal point forecasts, internal phase IDs, or specific tooling reveals.

Reading order for a new operator session that needs to understand the deck pack:

1. `docs/storefront/06-positioning-slide-deck.md` — operator's own internal answer
2. `docs/research/00-INDEX.md` → `01` → `04` → `05` → `06` — the evidentiary layer
3. This file
4. `06-master-deck.md` if you want the whole picture in one read; otherwise the specific stakeholder deck the audience needs

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

*Last updated: 2026-04-30 — added `06a-master-deck-shareable.md`, the externally-presentable companion to the operator-scope master deck.*
