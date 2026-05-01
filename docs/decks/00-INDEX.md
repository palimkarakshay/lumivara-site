<!-- Stakeholder deck index. Read order: index -> deck -> research/ for sources. -->

# Stakeholder Deck Pack — Master Index

> _Lane: 🛠 Pipeline — operator-only stakeholder decks; never copied to a client repo._
>
> **Brand & domain banner.** Two decisions, both dated 2026-04-30, recorded in [`docs/mothership/15c-brand-and-domain-decision.md`](../mothership/15c-brand-and-domain-decision.md):
>
> - **D1 (committed).** The operator umbrella domain is a **separate registered domain**, not a subdomain or path on `lumivara.ca` (which follows Client #1 at the Phase 4 spinout). The exact apex is blocked on D2.
> - **D2 (open).** The brand `Lumivara Forge` (locked 2026-04-28 in [`15 §4`](../mothership/15-terminology-and-brand.md)) is **under reconsideration**. Operator wants a non-hyphenated, single-word slug from the [`15 §2`](../mothership/15-terminology-and-brand.md) shortlist (Cadence / Continuum / Loom / Helm · Lighthouse — both with collision caveats / Compass / Plumbline). Until D2 lands, every deck still uses `Lumivara Forge` and `lumivara-forge.com` as placeholders. A second mechanical drift sweep (mirror of PR #200) will rename across the pack once the new name is locked; nothing else in the deck pack changes.
>
> Pre-share check: if D2 has resolved by send time, run [`scripts/dual-lane-audit.sh`](../../scripts/dual-lane-audit.sh) before forwarding any deck to confirm the brand has been mechanically updated.

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

**Per-vertical sales playbooks (operator-only).** When the conversation moves from "is this a real business?" (the deck pack) to "how do we actually close a specific prospect in vertical X?", the operator reads the matching template under [`docs/mothership/sales-verticals/`](../mothership/sales-verticals/). The pack covers six high-LTV verticals (doctors, dentists, lawyers, accountants, physiotherapy, optometry); each carries 24-month ROI math against published competitor pricing in that vertical, the regulator-of-record cross-walk (CPSO / RCDSO / LSO / CPA Ontario / COO / FTC Contact Lens Rule etc.), the three-call sales flow, and the prospecting heuristics. The deck pack does not duplicate this content; the per-vertical *client-facing* pitch decks (next paragraph) distil a client-safe subset for prospect-facing use, while the operator-only sales-verticals folder stays internal. When advisor / partner / investor reading raises the "won't ever sell" pushback (`05-advisor-deck.md` Contested claim 6), forward them the matching vertical template — that is the structured response.

**Per-vertical client-facing pitch decks (external).** Six 14-slide pitch decks under [`docs/decks/vertical-pitches/`](./vertical-pitches/) — `doctors.md`, `dentists.md`, `lawyers.md`, `accountants.md`, `physiotherapy.md`, `optometry.md`. Each is the client-safe distillation of the matching operator-only sales template at `docs/mothership/sales-verticals/`. Operator-internal sections stripped: persona codes (P1/P2), owner-archetype prose, three-call sales flow, objection handlers, source backfill flags, operator notes (never-say / watch-for / upsell), prospecting heuristics, and vendor-pattern displacement table. Status-quo-cost-vs-retainer ROI math preserved (math the prospect can verify against their own line items); per-engagement payback ratios stripped (those imply operator margin calculus on the prospect's revenue). Each deck includes **two boundary slides** — a focused "Why we won't sell you SEO (and what we *do* instead)" slide that names the vertical regulator (CPSO / RCDSO / LSO / CPA Ontario / COO / College of Physiotherapists) and Google's *Search Essentials* explicitly, and an expanded "What this is *not* — other things vendors sell that we deliberately don't" slide covering AI chatbots, ghost-written content, lead-volume guarantees, review-gating, ads-in-retainer, EMR/PMS replacement, and the rest. Both slides distil the operator-only source-of-truth at [`docs/mothership/sales-verticals/00a-negative-list-rationale.md`](../mothership/sales-verticals/00a-negative-list-rationale.md). Layer 1 auto-renders these on push; Layer 3 polish for warm-lead conversion via Claude Design (see [`docs/AI_CLAUDE_DESIGN_PLAYBOOK.md §5`](../AI_CLAUDE_DESIGN_PLAYBOOK.md)). **These supersede the persona-swap workflow inside `04-prospective-client-deck.md`** for vertical-fit prospects: send the vertical-specific deck, not the generic persona-tailored one.

---

## Counter-read (operator-scope only)

A deliberately unflattering harsh-critic review of this entire deck pack lives at [`CRITICAL-REVIEW.md`](./CRITICAL-REVIEW.md) (added 2026-04-30). It is the mirror, not the brochure: read it once, then act on the parts that sting. **Do not share externally, do not cite, do not mistake it for the kind read.** It exists to keep the deck pack honest as the practice moves toward client #2.

The prescriptive counter-plan — mitigations mapped to each problem, the Sales Sprint S0 design, the number-replacement plan, and the resequenced project plan — lives at [`CRITICAL-REVIEW-MITIGATIONS.md`](./CRITICAL-REVIEW-MITIGATIONS.md) (added 2026-05-01). Read it after the review. The single most important verdict it lands: **the PoC does not need further perfection — the bottleneck is sales, not engineering.** Stakeholder decks `01`/`02`/`03`/`05`/`06`/`06a` are formally **frozen** until client #5 closes; only the prospective-client deck and the dentist vertical pitch remain editable during Sales Sprint S0.

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

*Last updated: 2026-04-30 — refreshed every deck after today's pipeline-lane work landed (brand + domain ADR `15c`, extended five-leg `codex-review` fallback ladder, `llm-monitor` bot self-awareness pipeline, `record-ingest` operator recording pipeline, doc-task seeder per OWASP LLM08, plumber + recruiter vertical content templates promoted Stub → Full, PIPEDA breach-notification research seed, **the new per-vertical sales playbook pack at [`docs/mothership/sales-verticals/`](../mothership/sales-verticals/)** — six full operator-only templates that serve as the structured response to the advisor pushback that the operator-side stack is "over-engineered crap that won't ever sell" (reflected in `05-advisor-deck.md` Contested claim 6), **and the matching client-facing pitch deck pack at [`docs/decks/vertical-pitches/`](./vertical-pitches/)** — six 14-slide externally-shareable pitch decks (doctors, dentists, lawyers, accountants, physiotherapy, optometry) auto-rendered by Layer 1 and ready for Layer 3 Claude Design polish per [`docs/AI_CLAUDE_DESIGN_PLAYBOOK.md`](../AI_CLAUDE_DESIGN_PLAYBOOK.md)). Brand-name reconsideration (D2) is open; decks continue to use `Lumivara Forge` as a placeholder until D2 lands.*
