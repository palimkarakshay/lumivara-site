# Claude Design playbook — deck pipeline

> _Lane: 🛠 Pipeline — operator-only playbook; never copied to a client repo._

This is the operator playbook for the **MD-source → HTML-deck pipeline** in this repo, plus the rules for when to escalate to Anthropic's standalone **Claude Design** web product (`claude.ai/design`) for visual polish.

The pipeline auto-renders. Claude Design does not. Read [§1](#1-honest-frame-what-claude-design-is-and-isnt) first to avoid wasting an hour expecting an API that does not exist.

---

## 1. Honest frame — what Claude Design *is* and *isn't*

| Surface | What it is | Programmatic? | Role in this pipeline |
|---|---|:---:|---|
| **`claude.ai/design`** | Anthropic Labs web product. Visual UI/prototype/slide generator. Reads a codebase to learn brand tokens; exports HTML / PDF / PPTX. | **No** — browser-only, no public API. Confirmed in Anthropic Help Center: "Cannot be invoked from Claude Code CLI directly." | **Layer 3** — manual operator-driven polish for high-stakes decks (investor / advisor). |
| **Claude API (Opus 4.7)** | The Anthropic SDK that Claude Code already uses. Generates text/code/Markdown. | **Yes** — usable from Claude Code, GitHub Actions, scripts. | **Layer 2** — manual (interactive) deck-source generation and copy polish. |
| **Marp CLI** (`@marp-team/marp-cli`) | Deterministic Markdown-to-HTML/PDF deck renderer. Reads our existing `marp: true` frontmatter. | **Yes** — pure CLI, runs in CI. | **Layer 1** — auto-rendered on every push to `docs/decks/**.md` and `docs/storefront/**-deck.md` via [`render-decks.yml`](../.github/workflows/render-decks.yml). |

The naming "Claude Design playbook" is correct because the playbook describes **how Claude Design fits into the deck workflow**. The honest answer is **as a manual third layer on top of the deterministic auto-render**, not as a CI step.

---

## 2. Source of truth — the MD/HTML contract

Every deck in this repo follows the same two-file contract, **regardless of which `docs/` subfolder it lives in**:

```
docs/<any-subfolder>/<NN[a-z]?-slug>.md      ← canonical source (operator edits this)
docs/<any-subfolder>/<NN[a-z]?-slug>.html    ← built artifact (auto-rendered by Marp)
```

The current deck-bearing folders are:

| Folder | Lane | What's in it today | Auto-rendered? |
|---|:---:|---|:---:|
| [`docs/decks/`](./decks/) | 🛠 | 7 stakeholder decks (`01..06a`) | ✅ |
| [`docs/storefront/`](./storefront/) | 🛠 | 3 storefront decks (`04-slide-deck`, `06-positioning-slide-deck`, `06-product-strategy-deck`) | ✅ |
| [`docs/mothership/sales-verticals/`](./mothership/sales-verticals/) | 🛠 | Sales playbooks (reference reading, **not Marp decks today**); auto-renders any future Marp-tagged file dropped in | ✅ on opt-in |
| Any future `docs/**/*.md` with `marp: true` frontmatter | inherits parent folder's lane | — | ✅ |

The render script ([`scripts/render-decks.sh`](../scripts/render-decks.sh)) walks **all of `docs/**.md`** and renders only files that meet **both** conditions:

1. The file's first line is exactly `---` (YAML frontmatter open marker), AND
2. Inside the frontmatter block (before the closing `---`), there is a line matching `^marp:\s*true\s*$`.

This keeps reference docs, indexes, and playbooks (including this one — the `marp: true` example below sits inside a code fence, not in frontmatter) untouched. **No allow-list or skip-list needed.**

The MD frontmatter must declare Marp:

```markdown
---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: '#fafaf7'
color: '#1f1f1f'
style: |
  section { font-family: 'Inter', system-ui, sans-serif; padding: 60px 80px; }
  h1 { color: #1f1f1f; font-family: 'Fraunces', Georgia, serif; font-size: 2.4em; }
  h3 { color: #b48a3c; }
  ...
---
```

The render script ([`scripts/render-decks.sh`](../scripts/render-decks.sh)) **only renders files whose first 10 lines contain `marp: true`**. Index files like `docs/decks/00-INDEX.md` are skipped automatically — no need to exclude them by name.

**Hard rules:**

- **Never hand-edit a `.html` artifact.** Edit the `.md` source, push, and let the workflow regenerate the HTML. A hand-edit will be silently overwritten on the next render.
- **Claims, numbers, sources live in the MD.** The pre-publication gate in [`docs/decks/00-INDEX.md`](./decks/00-INDEX.md) requires every number to cite a `[V]` row in `docs/research/03-source-bibliography.md`. That gate runs against the MD, not the HTML.
- **One audience per deck.** Per the audience-fit rule in [`docs/decks/00-INDEX.md`](./decks/00-INDEX.md), never mix audiences in a single deck — make a new deck instead.

---

## 3. Layer 1 — auto-render (deterministic, no AI)

The render workflow lives at [`.github/workflows/render-decks.yml`](../.github/workflows/render-decks.yml). It calls [`scripts/render-decks.sh`](../scripts/render-decks.sh) under the hood.

### Triggers + cadence

The cadence is **MD-update-driven**: every push to `main` that touches a Marp-tagged `.md` under `docs/**` re-renders that deck and direct-commits the HTML back to `main` with `[skip ci]`. No queueing, no scheduled batch — the HTML is current within one workflow run of the source change.

| Trigger | What runs | What it does |
|---|---|---|
| `push` to `main` touching `docs/**.md` | `incremental`, `target=__all__` | Re-renders only the Marp MDs changed in that push (frontmatter check, not folder match — catches new deck folders automatically). |
| `workflow_dispatch` with `target=<one of the 10 decks>` | `--deck <path>` | Renders **just that one deck**, ignoring `mode`. Use for a one-deck rerun (e.g., after a hand-edit polish in the MD that didn't trigger a push, or to verify a Marp version bump on a single deck before a `force`). |
| `workflow_dispatch` with `target=__all__` + `mode=incremental` | same as push | Manual rerun of the last push's diff. |
| `workflow_dispatch` with `target=__all__` + `mode=retroactive` | `retroactive` | Renders every Marp MD that has **no paired HTML** OR whose HTML is **older** than its MD. Use this after an MD-only PR lands. |
| `workflow_dispatch` with `target=__all__` + `mode=force` | `force` | Renders every Marp MD unconditionally. Use after a brand/style change that affects every deck. |

The `target` dropdown in the workflow UI is a **snapshot of the deck inventory** at workflow-edit time. When a new Marp deck lands:

- If pushed via the normal flow, the push trigger renders it automatically — no need to update the dropdown to make it work.
- The dropdown only needs updating when an operator wants to be able to single-target the new deck from the GitHub UI. Until then, `target=__all__ + mode=retroactive` catches it.

The local-equivalent flag for single-deck rendering is:

```bash
bash scripts/render-decks.sh --deck docs/decks/04-prospective-client-deck.md
```

### What the workflow commits

- Bounded write surface: **only** `.html` files **next to a Marp `.md` source under `docs/**`**. The workflow refuses to commit anything outside that pattern (script's render-surface fence; see §3.3 below).
- Commit message format: `docs(decks): auto-render <N> deck artefact(s) [<tag>] [skip ci]` where `<tag>` is `incremental` / `retroactive` / `force` for batch runs and `single:<deck-slug>` for single-deck runs (e.g., `single:01-investor-deck`). The `[skip ci]` suffix prevents recursive triggers.
- Author is `github-actions[bot]`. The workflow's first step skips itself if the trigger commit author is the bot — belt-and-braces against loop conditions.
- **Default behaviour is direct commit to main when clean** (matches the manual regen pattern from `b2c2b73`). "Clean" is enforced by the brand-string gate (no forbidden Client #1 strings in rendered HTML) and the surface fence (no files outside the expected HTML set). If either fails, **no commit happens** and the workflow exits non-zero.
- Set `open_pr: true` on a `workflow_dispatch` run to get a PR instead — useful when testing a brand-wide style change you want a review surface for.

### Quality gates run before commit

1. **Marp parse.** `npx -y @marp-team/marp-cli --html` exits non-zero on broken frontmatter or invalid theme.
2. **Dual-lane audit.** [`scripts/dual-lane-audit.sh`](../scripts/dual-lane-audit.sh) runs against the rendered HTML. Fails the workflow if any forbidden Client #1 string slipped into an operator-scope deck (per [`mothership/15 §6`](./mothership/15-terminology-and-brand.md)).
3. **Render-surface fence.** `git status --porcelain` is filtered: every changed file must (a) live under `docs/**`, (b) end in `.html`, and (c) sit next to a `.md` sibling that passed the Marp frontmatter check. Any line that survives the filter means the render touched something it shouldn't — workflow aborts with a non-zero exit and no commit. The pre-commit fence is also re-checked post-commit so a manual edit slipping into the same workflow run is caught.

### Local equivalent

```bash
bash scripts/render-decks.sh incremental                        # re-render only changed MDs since HEAD~1
bash scripts/render-decks.sh retroactive                        # re-render any HTML missing or stale
bash scripts/render-decks.sh force                              # re-render everything
bash scripts/render-decks.sh --deck docs/decks/01-investor-deck.md
                                                                # render one specific deck
bash scripts/render-decks.sh --list                             # list every Marp deck the script can see
```

The script is idempotent. Re-running with no MD changes is a no-op. `--deck` validates the path is a real Marp source and prints the known-decks list on bad input — handy when typing a path from memory.

---

## 4. Layer 2 — Claude API content generation (interactive, manual)

When a deck does not yet exist (e.g., a new sales-vertical playbook in [`docs/sales-verticals/`](./sales-verticals/)), the operator drafts the MD source in an **interactive Claude Code session**, not in a workflow. Per the active phase in [`AGENTS.md`](../AGENTS.md) and [`AI_ROUTING.md`](./AI_ROUTING.md), this defaults to **Opus 4.7** with extended thinking.

### Prompt skeleton (paste into Claude Code)

```
Draft a new Marp deck at docs/decks/<NN>-<slug>-deck.md targeting <audience>.

Constraints:
- Marp frontmatter mirrors docs/decks/01-investor-deck.md (theme, padding, brand colors).
- One audience, one voice — see docs/decks/00-INDEX.md "audience-fit rule".
- Every number, %, or $ figure must cite a [V] row in docs/research/03-source-bibliography.md.
  If a needed claim has no [V] row, leave a `> TODO[research]:` callout on the slide
  instead of inventing a number.
- Brand placeholder is `Lumivara Forge` per docs/mothership/15c-brand-and-domain-decision.md
  (D2 open). Do not use Client #1 brand strings.
- ~12–16 slides. Closing slide includes the pre-share checklist.

Source brief: <paste the brief / outline / talking points here>
```

After Claude Code commits the MD, the auto-render workflow produces the HTML on the next push.

### When to use the Claude API for *polish* instead of generation

- A copy review of an existing deck ("tighten slides 4–7, drop hedge phrases"). Run interactively in Claude Code, edit the MD in place, push.
- A slide-by-slide voice consistency pass ("rewrite to match the voice of `02-partner-deck.md`"). Same flow.

The Claude API is **not** wired into the render workflow. Content quality is an operator-driven interactive concern, not a CI concern.

---

## 5. Layer 3 — Claude Design (browser, manual)

Use `claude.ai/design` when a deck needs **visual** rework that Marp's CSS theming cannot reach: bespoke layouts, custom typography, illustrations, slide-level art direction. This is the polish layer for high-stakes decks (investor, advisor, prospective-client at warm-lead conversion).

**For project-level design-system work** (multi-deck visual systems, marketing-site visual exploration), see the dedicated pack at [`./claude-design/`](./claude-design/) — it covers the per-lane project setup, the repo-resident `DESIGN.md` scaffolds for both lanes, and the manual sync protocol. The notes below are the lighter, deck-by-deck handoff loop only.

### Operator handoff (one-time setup)

1. Open `claude.ai/design` (Pro/Max subscription — already covered by the operator's Max 20x).
2. Create a project named `lumivara-decks`.
3. Add the rendered `06-master-deck.html` as the **brand reference**. Claude Design ingests it and learns the color palette, type system, and slide rhythm.
4. Add this repo's [`docs/decks/00-INDEX.md`](./decks/00-INDEX.md) as project context — gives the model the audience-fit rule, the pre-publication gate, and the brand-placeholder constraint.

### Per-deck polish loop

1. Render the latest HTML via `bash scripts/render-decks.sh incremental` (or wait for the push workflow).
2. Upload the rendered `.html` + the source `.md` to the Claude Design project.
3. Ask for the polish you want (`"redesign slide 7's pricing table as a side-by-side comparison with the master deck's color system"`).
4. Iterate inline. Export the result as **standalone HTML**.
5. Bring the export back into the repo as a **new MD source**, not a HTML overwrite. Diff the visual changes against the Marp render and:
   - If the change is achievable via Marp `style:` block edits, fold it into the MD's frontmatter so future auto-renders preserve it.
   - If the change requires hand-authored HTML beyond Marp's reach, save it under `docs/decks/<NN>-<slug>-deck.designed.html` (separate filename) and document the divergence in the MD with a top-of-file note. The auto-renderer leaves `*.designed.html` alone.

### What NOT to do with Claude Design

- **Do not upload Pipeline-lane operator IP** (e.g., `docs/mothership/`, `docs/research/`, `dashboard/`) just to get "context." Upload only the deck's own MD + the master deck as a brand reference. Claude Design retains uploaded content per Anthropic's standard data policy; the smaller the upload, the smaller the surface.
- **Do not paste Client #1 brand strings** into the Claude Design project chat. The forbidden-string list in [`mothership/15 §6`](./mothership/15-terminology-and-brand.md) applies to external surfaces too.
- **Do not skip Layer 1.** Always render via Marp first. The HTML you upload to Claude Design must be the auto-rendered baseline so divergences are diffable.

---

## 6. Pre-publication gate (unchanged from the existing deck pack)

Before any deck — auto-rendered or Claude-Design-polished — is shared externally, walk the gate in [`docs/decks/00-INDEX.md`](./decks/00-INDEX.md) §Pre-publication gate:

- [ ] Every number / % / $ has a `[V]` row in `docs/research/03-source-bibliography.md`.
- [ ] Brand placeholder is locked to `Lumivara Forge` (or the resolved D2 successor per [`mothership/15c`](./mothership/15c-brand-and-domain-decision.md)).
- [ ] Pricing matches `docs/storefront/02-pricing-tiers.md`.
- [ ] If single-recipient, the file frontmatter records the recipient + send date.
- [ ] `bash scripts/dual-lane-audit.sh` is green.

The render workflow runs the audit automatically. The other four are operator gates.

---

## 7. Anti-patterns

- **Hand-editing the rendered HTML.** Always overwritten on the next render. Edit the MD.
- **Calling `claude.ai/design` in CI.** No API exists. Don't write a workflow that pretends to.
- **Generating decks without an MD source.** Every deck is grep-able by source. A render-only deck is invisible to the audit, the pre-publication gate, and the spinout manifest.
- **Mixing audiences.** Make a new deck. The audience-fit rule is load-bearing for the deck pack's positioning.
- **Bypassing the Marp render to "save a step."** The deterministic render is what makes brand changes (e.g., the open D2 brand-name rename) mechanical. Skip it once and you've forked the deck visually.

---

## 8. When this playbook changes

- Brand/domain decision D2 lands → update Layer 2 prompt skeleton + the brand-reference deck used in Claude Design.
- Marp version bump → re-run `force` mode, diff every HTML, commit.
- New deck folder added (e.g., a future `docs/sales-verticals/` or vertical-specific decks under `docs/mothership/sales-verticals/`) → **no workflow change needed** as long as the folder lives under `docs/**` and the deck MD has Marp frontmatter. The script auto-discovers it. Update [`.dual-lane.yml`](../.dual-lane.yml) instead so the spinout knows which lane the new folder belongs to.
- Claude Design ships a public API → collapse Layer 3 into the workflow.

*Last updated: 2026-04-30 — initial version, paired with [`render-decks.yml`](../.github/workflows/render-decks.yml) and [`scripts/render-decks.sh`](../scripts/render-decks.sh).*
