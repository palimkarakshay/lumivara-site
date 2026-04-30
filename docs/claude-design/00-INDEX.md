# `docs/claude-design/` — design-system pack for Claude Design

> _Lane: 🛠 Pipeline — operator-process docs governing how the operator uses `claude.ai/design` for both lanes. Never copied to a client repo._

This folder is the operator's playbook for using **`claude.ai/design`** (Anthropic Labs' standalone web design product, hereafter "Claude Design") to do visual design work that backs the marketing site (Site lane) and the deck pack (Pipeline lane).

It pairs with — and extends — [`../AI_CLAUDE_DESIGN_PLAYBOOK.md`](../AI_CLAUDE_DESIGN_PLAYBOOK.md), which covers the deck-rendering pipeline. That playbook treats Claude Design as Layer 3 (manual visual polish) for individual decks. **This folder treats Claude Design as a project-level design-system source for whole-product visual work.**

---

## Read in this order

1. [`01-decision-and-frame.md`](./01-decision-and-frame.md) — **read first.** What Claude Design actually is (vs. its marketing). Why the lanes get separate projects. The three hard rules. Privacy and spinout implications.
2. [`02-site-lane-DESIGN.md`](./02-site-lane-DESIGN.md) — the Site-lane (marketing site) DESIGN.md template. Real tokens extracted from [`../../src/app/globals.css`](../../src/app/globals.css). Brand-name placeholders so it stays operator-safe and reusable across future clients.
3. [`03-pipeline-lane-DESIGN.md`](./03-pipeline-lane-DESIGN.md) — the Pipeline-lane DESIGN.md, narrowly scoped to **decks only**. Brand: `Lumivara Forge` (D2 reconsideration noted). Tokens extracted from the Marp deck CSS in [`../decks/01-investor-deck.md`](../decks/01-investor-deck.md) frontmatter.
4. [`04-setup-and-sync-runbook.md`](./04-setup-and-sync-runbook.md) — step-by-step Anthropic account setup, per-project upload checklist, manual sync protocol, P5.6 spinout migration.

---

## Decision matrix at a glance

| Question | Answer | Reference |
|---|---|---|
| Should we set up Claude Design at all? | **Yes**, scoped per-lane. | [`01 §1`](./01-decision-and-frame.md) |
| One project per repo or per lane? | **Per lane.** Two projects: Site + Pipeline-decks. | [`01 §3`](./01-decision-and-frame.md) |
| Connect the whole co-housed repo today? | **No.** Cross-lane contamination. Use selective folder uploads. | [`01 §4`](./01-decision-and-frame.md) |
| Live GitHub sync? | **Not available.** Claude Design ingests once; you re-upload on change. | [`01 §2`](./01-decision-and-frame.md) |
| Where does the design system live? | In the **repo** as DESIGN.md. Claude Design's project is a *consumer*. | [`01 §5`](./01-decision-and-frame.md) |
| When does each lane's project get set up? | Site lane **now** (selective uploads). Pipeline-decks **now** (decks scope only). Operator dashboard / operator pack: **defer until post-spinout**. | [`01 §6`](./01-decision-and-frame.md) |
| What about subscription cost? | Operator already runs Claude Max 20x — Pro features included. | [`AGENTS.md` Session charter](../../AGENTS.md) |
| Spinout impact? | At P5.6 each lane's project re-links to its own repo. One-time manual action per project, not a blocker. | [`04 §6`](./04-setup-and-sync-runbook.md) |

---

## How this fits the existing deck pipeline

The MD → HTML deck render automated via [`render-decks.yml`](../../.github/workflows/render-decks.yml) is **deterministic Layer 1**. It produces consistent HTML from a stable Marp source. The Pipeline-lane Claude Design project sits on top of that as **Layer 3 visual polish** for high-stakes decks (investor, advisor) — see [`../AI_CLAUDE_DESIGN_PLAYBOOK.md §5`](../AI_CLAUDE_DESIGN_PLAYBOOK.md).

The Site-lane Claude Design project is independent of the deck pipeline. It exists to:

- Generate new section/landing-page variants visually before committing to Next.js implementation
- Produce client-deliverable mockups for prospects considering a Tier 2/3 engagement
- Stress-test brand consistency when a new component is added to the Site

Neither project is wired into CI. Both are operator-driven, browser-resident.

---

## Brand-string discipline

Files in this folder are **🛠 Pipeline-lane**. Per [`../mothership/15-terminology-and-brand.md §6`](../mothership/15-terminology-and-brand.md), they must not contain `Lumivara People Advisory`, `Lumivara People Solutions`, `people advisory`, `lumivara.ca`, or `Beas Banerjee`.

The Site-lane DESIGN.md ([`02-site-lane-DESIGN.md`](./02-site-lane-DESIGN.md)) uses **placeholder tokens** (`<CLIENT_BRAND_NAME>`, `<CLIENT_DOMAIN>`, etc.) precisely so it stays audit-clean and reusable across the operator's 30-client portfolio. The runbook in [`04 §3`](./04-setup-and-sync-runbook.md) covers the just-in-time substitution before upload.

The Pipeline-lane DESIGN.md ([`03-pipeline-lane-DESIGN.md`](./03-pipeline-lane-DESIGN.md)) uses the operator's own brand `Lumivara Forge` directly (allowed everywhere in operator-scope docs).

---

*Last updated: 2026-04-30 — initial pack. Paired with [`../AI_CLAUDE_DESIGN_PLAYBOOK.md`](../AI_CLAUDE_DESIGN_PLAYBOOK.md).*
