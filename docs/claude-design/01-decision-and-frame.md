# 01 — Claude Design: decision and frame

> _Lane: 🛠 Pipeline — operator-process doc. Read this before doing anything in `claude.ai/design`._

This is the load-bearing decision document for whether, and how, to use Claude Design in this repo's two-lane setup. The conclusions here are referenced by the [`00-INDEX.md`](./00-INDEX.md) decision matrix and the [`04-setup-and-sync-runbook.md`](./04-setup-and-sync-runbook.md) operator instructions.

---

## §1 — Should we use Claude Design at all?

**Yes — but only with the three rules in §3, §4, §5.**

The operator runs on a Claude Max 20x subscription, which already includes Claude Design's Pro features. The marginal cost is operator time (browser sessions), not money. The marginal value is visual exploration speed: generating five plausible hero-section variants in twenty minutes is faster than hand-coding even one.

The places it adds the most value, ranked:

1. **Site-lane section/landing-page variants.** Generating new marketing-site sections against the existing brand palette before committing to Next.js implementation. The Site already has a working design system in [`../../src/app/globals.css`](../../src/app/globals.css) (Warm Editorial palette, four sub-palettes, dark mode, fluid type scale). Claude Design generates *against* this; it does not replace it.
2. **Client-deliverable mockups.** Producing visual mockups for prospects considering a Tier 2/3 engagement, in their (placeholder-substituted) brand, before any code is written.
3. **Pipeline-lane decks: Layer 3 visual polish.** Per [`../AI_CLAUDE_DESIGN_PLAYBOOK.md §5`](../AI_CLAUDE_DESIGN_PLAYBOOK.md), high-stakes decks (investor, advisor) get a one-pass visual review in Claude Design after Marp auto-renders the baseline.

The places it adds the *least* value:

- Anything that needs to be production-bound CSS (use the repo, not Claude Design).
- Operator dashboard ([`../../dashboard/`](../../dashboard/)) — Pipeline-lane internal tool, no design polish required.
- Internal operator docs (mothership pack, research, runbooks) — text, not visual.

---

## §2 — What Claude Design actually is (vs. its marketing)

The Anthropic Help Center's setup guide implies a smooth GitHub-connected design pipeline. The reality is narrower. Three honest framings to internalise:

**(a) Repo connection is a one-time static upload, not a live integration.** Claude Design ingests a codebase or DESIGN.md once at project setup. There is no webhook, no commit-watching, no auto-refresh on push. Brand-token changes require a manual re-upload. There is no two-way sync.

**(b) The expected primary input is a `DESIGN.md` file.** Anthropic's docs are vague about file naming, but every published example follows the [community 9-section convention](https://getdesign.md): Visual Theme & Atmosphere → Color Palette & Roles → Typography Rules → Component Stylings → Layout Principles → Depth & Elevation → Do's and Don'ts → Responsive Behavior → Agent Prompt Guide. Claude Design generates `colors_and_type.css` *from* DESIGN.md as a downstream artefact. This means **the repo-resident DESIGN.md is the source of truth**, and Claude Design's UI is a consumer.

**(c) The privacy story is openly incomplete.** Per Anthropic's Help Center, Claude Design "doesn't support audit logs or usage tracking yet" and there is no documented data-residency option. For Pipeline-lane operator IP (sales playbooks under [`../mothership/sales-verticals/`](../mothership/sales-verticals/), pricing math, ICP analysis, financial models in [`../mothership/`](../mothership/)) this matters. **Do not upload Pipeline-lane operator IP to Claude Design**, even into a project nominally restricted to "decks."

---

## §3 — Rule 1: per-lane projects, not per-repo

The repo is co-housed: Site lane (Client #1 marketing site) and Pipeline lane (operator pipeline) sit in the same git tree until the P5.6 spinout. Their visual identities are deliberately related but distinct (warm cream + amber-gold across both, but different exact hex values; serif headings in both, but different weights).

A single Claude Design project that ingests both would:

- Cross-pollute brand tokens (the model would average the two palettes and produce something that matches neither cleanly).
- Surface operator IP into a project nominally meant for client-side design work.
- Violate the operator-IP-doesn't-leak-to-client-side rule from [`../../AGENTS.md`](../../AGENTS.md).

So: **two Claude Design projects.** One per lane. Suggested project names (these are the names you type in Claude Design's project-create UI, not anything that lands in the repo):

| Lane | Project name | Scope | Source DESIGN.md |
|---|---|---|---|
| 🌐 Site | `<client-slug>-site` (per client; e.g. `lumivara-people-advisory-site`) | Marketing-site visual work for one specific client | [`02-site-lane-DESIGN.md`](./02-site-lane-DESIGN.md) (operator substitutes placeholders before upload) |
| 🛠 Pipeline (decks) | `lumivara-forge-decks` | Stakeholder decks visual polish, Layer 3 only | [`03-pipeline-lane-DESIGN.md`](./03-pipeline-lane-DESIGN.md) |

A new client engagement gets its own Site-lane project (specialised from the same template). The Pipeline-decks project stays singular.

---

## §4 — Rule 2: no whole-repo upload pre-spinout

Claude Design's "connect a repository" button looks like the obvious flow. **It is the wrong flow for this repo today.** The reasons are sequenced:

1. **Cross-lane contamination at the file-system level.** Connecting `palimkarakshay/lumivara-site` (this repo) means the model sees `docs/mothership/`, `docs/research/`, `dashboard/`, every script — not just Site-lane files.
2. **Privacy gap (§2c).** Pipeline-lane operator IP would land in a Claude Design project whose data-residency story is undefined.
3. **Token noise.** The marketing site uses one palette; the decks use a related-but-different palette; the operator dashboard uses [`../../dashboard/tailwind.config.js`](../../dashboard/tailwind.config.js) which is yet another. A repo-wide ingest produces a confused composite.

**Use selective uploads instead.** What to upload per project:

| Project | Upload | Do NOT upload |
|---|---|---|
| Site project | The DESIGN.md ([`02-site-lane-DESIGN.md`](./02-site-lane-DESIGN.md), placeholders substituted), [`../../src/app/globals.css`](../../src/app/globals.css), screenshots of 2–3 already-built pages, [`../../src/components/sections/`](../../src/components/sections/) directory snapshot (zip or selected files only) | Anything under [`../../docs/`](../../docs/), [`../../dashboard/`](../../dashboard/), [`../../scripts/`](../../scripts/), [`../../.github/`](../../.github/), or [`../../e2e/`](../../e2e/). Anything under [`../../src/app/admin/`](../../src/app/admin/) (admin portal — operator-facing) |
| Decks project | The DESIGN.md ([`03-pipeline-lane-DESIGN.md`](./03-pipeline-lane-DESIGN.md)), the rendered [`../decks/06-master-deck.html`](../decks/06-master-deck.html) as brand reference, the rendered HTML of any specific deck being polished | Any other deck source MD (those contain unverified claims, internal phase IDs, recipient names). [`../decks/00-INDEX.md`](../decks/00-INDEX.md) (operator-internal). Anything under [`../mothership/`](../mothership/), [`../research/`](../research/), or [`../storefront/`](../storefront/). |

The runbook in [`04 §3`](./04-setup-and-sync-runbook.md) has the actual click-by-click upload checklist.

---

## §5 — Rule 3: DESIGN.md in the repo is the source of truth

Two reasons this matters:

**(a) Drift containment.** Claude Design has no live sync. If the source of truth lives in Claude Design's UI, every brand change requires a "remember to download and commit the new tokens to the repo" step that will get forgotten. If the source of truth lives in the repo, the Claude Design project becomes a refreshable derivative — drift is detectable as "the project is older than the DESIGN.md."

**(b) Audit and spinout.** The dual-lane audit ([`../../scripts/dual-lane-audit.sh`](../../scripts/dual-lane-audit.sh)) and the spinout dry-run ([`../../scripts/forge-spinout-dry-run.sh`](../../scripts/forge-spinout-dry-run.sh)) operate on the repo, not on external SaaS. A design system that lives only in Claude Design is invisible to both. A repo-resident DESIGN.md is auditable, spinout-able, and version-controlled.

Operator workflow consequence:

```
Brand change                                    Sync DESIGN.md
(e.g. D2 brand-name lands)         →            in repo first        →    Re-upload to Claude Design
(authoritative event)                            (single PR)              (manual, project-by-project)
```

Never the other way around.

---

## §6 — When to set each lane up

| Lane / Project | When | Blocker if any |
|---|---|---|
| Site lane (Client #1) | **Now.** Selective uploads, placeholders substituted in DESIGN.md. | None. |
| Pipeline-decks | **Now.** Decks-only scope, no operator IP. | None. The D2 brand reconsideration ([`../mothership/15c-brand-and-domain-decision.md`](../mothership/15c-brand-and-domain-decision.md)) is *not* a blocker — `Lumivara Forge` is the active placeholder; when D2 lands, a single re-upload covers it. |
| Future Site projects (Clients #2 … #N) | At engagement time, per client. | The operator's 30-client cap means up to 30 Site-lane projects total over the practice's lifetime. |
| Operator dashboard / operator pack | **Defer to post-spinout.** No clear visual-design need today; the dashboard is internal-tool plain-Tailwind. Revisit if/when an operator-facing brand surface emerges. | Spinout (P5.6). |

---

## §7 — What the spinout (P5.6) does to these projects

At P5.6 the repo splits:

- Site-lane content → `palimkarakshay/lumivara-people-advisory-site` (client-owned eventually).
- Pipeline-lane content (including this folder) → `palimkarakshay/lumivara-forge-pipeline` (operator-private).

For Claude Design:

- The Site-lane project re-links to the new spinout repo URL. One-time manual action in the project settings.
- The Pipeline-decks project re-links to the operator-private repo URL. Same.
- This `docs/claude-design/` folder travels with the Pipeline-lane spinout (it's operator process docs).
- The operator-facing copy of [`02-site-lane-DESIGN.md`](./02-site-lane-DESIGN.md) — the **template** — stays in the Pipeline-lane repo (it's the master scaffold for future client engagements). The **specialised** version (with the Client #1 brand strings substituted in) ships to the spun-out client repo as part of normal Site content.

The runbook step-by-step is in [`04 §6`](./04-setup-and-sync-runbook.md).

---

## §8 — Anti-patterns

- Connecting the whole co-housed repo to a single Claude Design project (cross-lane contamination, operator IP leak).
- Using Claude Design's UI as the source of truth instead of the repo-resident DESIGN.md (drift).
- Letting Claude Design overwrite [`../../src/app/globals.css`](../../src/app/globals.css) (loses dark mode, loses sub-palettes, loses shadcn integration).
- Uploading any [`../mothership/`](../mothership/), [`../research/`](../research/), or [`../mothership/sales-verticals/`](../mothership/sales-verticals/) content to any Claude Design project (operator IP).
- Using the same Claude Design project across multiple clients (palette confusion, brand-string contamination).
- Treating Claude Design's generated components as production code without round-tripping them through Claude Code for actual implementation against the live `globals.css` and Next.js components.

---

*Last updated: 2026-04-30 — initial decision document.*
