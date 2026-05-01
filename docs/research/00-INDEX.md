<!-- OPERATOR-ONLY. Research artefacts for stakeholder decks. -->

# Research & Validation Pack — Master Index

This folder is the evidentiary layer behind every Lumivara Forge stakeholder deck. Anything claimed in `docs/decks/`, `docs/storefront/04-slide-deck.md`, or `docs/storefront/06-positioning-slide-deck.md` should trace back to a numbered claim in this folder, and every numbered claim has a citation in `03-source-bibliography.md` with one of three verification states.

The pack was assembled on **2026-04-29** from Gemini Deep Research outputs commissioned by the operator. Three share URLs were provided; the operator confirmed the third URL is the share link for one of the same PDFs:

| Share URL | Renders as |
|---|---|
| `https://g.co/gemini/share/b81281a954e2` | `raw/gemini-research-1-deck-validation-through-research.md` (PDF: `019dd784-Deck_Validation_Through_Research.pdf`) |
| `https://g.co/gemini/share/9a91c1948a52` | `raw/gemini-research-2-validated-market-and-technical-viability.md` (PDF: `019dd7b0-Validated_Market_and_Technical_Viability_Report_L....pdf`) |
| `https://g.co/gemini/share/bdc377b61d4e` | Same source as one of the two PDFs above (operator confirmed 2026-04-29). No new content; recorded for traceability. |

The rendered PDFs are the durable artefacts. Gemini share pages return 403 to programmatic fetch, so future sessions should always read the markdown extracts under `raw/` rather than re-trying the share URLs. Two Gemini sessions produced two outputs covering overlapping briefs at different depths — both are preserved verbatim, and the synthesis docs (`04`, `05`, `06`) reconcile them.

> **Status discipline.** Every load-bearing statistic in this pack is tagged `[V]` (independently re-verified at a primary or near-primary source on 2026-04-29), `[S]` (cited from secondary source, not re-verified), or `[C]` (claimed in the research artefact, contested or superseded by newer data — keep but flag). The bibliography records the verification result for each.

---

## Files in read order

| # | File | What it answers | Audience |
|---|---|---|---|
| 00 | `00-INDEX.md` (this file) | Where do I find each piece of evidence? | Operator |
| 01 | `01-validated-market-and-technical-viability.md` | Long-form Gemini output #1, preserved verbatim — every claim, table, and source URL the deck-validation pass produced | Operator (audit), deck authors |
| 02 | `02-deck-validation-through-research.md` | Long-form Gemini output #2 — narrower brief, focused on personas, switch reasons, drawbacks, investor framing | Operator (audit), deck authors |
| 03 | `03-source-bibliography.md` | Every cited URL, the claim it supports, and the verification state ([V] / [S] / [C]) | Operator before any deck publication |
| 04 | `04-client-personas.md` | Three target ICPs and one explicit anti-ICP, with budget bands, pain points, and the deck where each appears | Sales, deck authors |
| 05 | `05-reasons-to-switch-to-lumivara-forge.md` | The seven empirically grounded "why switch" arguments — each with a primary alternative and the dollar/time arbitrage | Sales, all client-facing decks |
| 06 | `06-drawbacks-and-honest-risks.md` | The risks, choke points, and engineering realities — published so the operator can answer them straight | Operator, investor & partner decks |
| 07 | `07-pipeda-breach-notification.md` | PIPEDA breach-notification trigger, "as soon as feasible" window, 24-month record-keeping floor, plus PHIPA (Ontario) + Law 25 (Quebec) overlays — sourced seed for the future compliance checklist | Operator, future PIPEDA-checklist authors |
| 08 | `08-self-maintaining-website-negative-study.md` | Harsh-critic mirror to the rest of this folder. Pressure-tests the **idea itself** — should the "self-maintaining website" product exist? Companion to `decks/CRITICAL-REVIEW.md` (which critiques the deck pack) and `06` (which catalogues in-model risks). External research from two parallel harsh-critic agents (competition + operator-economics passes, May 2026). | Operator, on a bad-faith Tuesday morning |
| 09 | `09-pivot-plan-and-archive-list.md` | **Prescriptive companion** to `08`. Pivot evaluation matrix (eleven candidates ranked), the recommended hedged three-leg stack (senior freelance + AI consulting / AODA audits / corporate-hedge), 90-day week-by-week plan, file-by-file archive list (~70,000 lines), file-by-file keep list (~18,000 lines), un-archive criteria, risks of the pivot itself, and bibliography from three parallel research agents (May 2026). | Operator, on a Monday after the pivot decision |

---

## How research connects to the decks

| Deck | Primary research dependency |
|---|---|
| `docs/decks/01-investor-deck.md` | `01` §5 (solopreneur economics), `06` (operational risk), `03` (verified market size) |
| `docs/decks/02-partner-deck.md` | `01` §5 + §9, `04` (ICP), `06` (drawbacks the partner will share) |
| `docs/decks/03-employee-deck.md` | `02` §1 ("Potential Employees"), `06` (engineering realities the new hire will inherit) |
| `docs/decks/04-prospective-client-deck.md` | `04` (their persona), `05` (the switch case), `01` §1 (validated client benefits) |
| `docs/decks/05-advisor-deck.md` | `06` (what they're being asked to weigh in on), `03` (claims they should pressure-test) |
| `docs/storefront/04-slide-deck.md` (existing) | `05` (refreshed switch case), `01` §3 (consumer voice) |
| `docs/storefront/06-positioning-slide-deck.md` (existing) | All sections — operator-side reconciliation deck |

---

## Provenance & verification policy

1. **The PDFs are the canonical sources.** They live under `raw/` exactly as Gemini produced them. Do not edit them. If a statistic in a PDF is later corrected, the correction lives in `03-source-bibliography.md`, not in the raw file.
2. **Every claim that appears in a stakeholder deck must be one of:**
   - re-verified at the primary source on or after 2026-04-29 (`[V]`),
   - acknowledged as cited-not-re-verified (`[S]`), and only used in operator-internal decks unless the partner / investor explicitly asks,
   - acknowledged as contested or superseded (`[C]`), in which case the deck either uses the corrected number or drops the claim.
3. **Numbers we know are stale or wrong are NOT smuggled into decks.** WP Buffs pricing has moved to $79–$447/mo (`03 §B-WP-Buffs`), and the WebAIM 2024 average error count is 56.8 errors/page, not 51.4 (`03 §B-WebAIM`). Both corrections are reflected in every deck where the topic appears.
4. **No deck quotes the "22.4x EBITDA multiple" claim** without context. Private productized services typically trade 4–10× revenue (`03 §B-SaaS-multiples`), and the investor deck uses the conservative band.

---

## How to maintain this folder

- **Quarterly refresh.** On every quarterly review the operator re-runs the most-load-bearing stats from `03-source-bibliography.md` (the rows tagged `priority/quarterly`) and updates the verification dates.
- **Pre-publication gate.** Before any deck in `docs/decks/` is shared externally, grep its body for any number, percentage, or dollar figure that does not have a `[V]` row in the bibliography. Either re-verify, downgrade to `[S]` and gate the deck to internal use, or remove the claim.
- **Adding a new claim.** Open `03-source-bibliography.md`, append a row, mark its initial state, and link the URL. Only then add it to a deck.

---

*Last updated: 2026-04-29 — initial assembly from Gemini Deep Research outputs + independent re-verification of seven load-bearing statistics.*
