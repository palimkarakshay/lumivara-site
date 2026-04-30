# 03 — Pipeline-lane DESIGN.md (decks scope)

> _Lane: 🛠 Pipeline — operator artefact. This file is uploaded directly to the `lumivara-forge-decks` Claude Design project. Brand: `Lumivara Forge` (D2 reconsideration noted; see [`../mothership/15c-brand-and-domain-decision.md`](../mothership/15c-brand-and-domain-decision.md))._
>
> **What this is.** A repo-resident `DESIGN.md` for the **Pipeline lane**, narrowly scoped to **stakeholder decks**. Mirrors the Marp deck CSS in [`../decks/01-investor-deck.md`](../decks/01-investor-deck.md) frontmatter so Claude Design can generate visually-consistent slide variants and one-pagers without parsing seven separate Marp files.
>
> **Scope discipline.** This DESIGN.md covers decks only. It does **not** cover the operator dashboard, the Storefront docs, or any operator-internal surface. Per [`01 §1`](./01-decision-and-frame.md), those don't have a Claude Design need today.
>
> **No operator-IP upload.** The Claude Design project this file ingests is also given the rendered [`../decks/06-master-deck.html`](../decks/06-master-deck.html) as a brand reference. **Nothing else from `docs/`** — no research files, no mothership pack, no sales-vertical playbooks, no pricing tier files. Operator IP stays in the repo.

---

# DESIGN.md — Lumivara Forge stakeholder decks

## 1. Visual Theme & Atmosphere

The deck pack runs **"Editorial Restraint"** — a deliberately quiet, type-led slide aesthetic that signals seriousness without ornamentation. The reference points are *The Economist* charts, the McKinsey two-column slide template, and the Stripe Atlas guide PDFs — none of the bullet-heavy, icon-stuffed pitch-deck templates from Y Combinator or pitch.com.

- **Restrained**: a single accent (amber-gold), no decorative shapes, no icons unless they convey data.
- **Type-led**: serif display headings (Fraunces), generous body type (Inter at 0.78em scaled), long line-lengths comfortable for 16:9 reading.
- **Cited**: every claim slide carries a `[V]` source ID inline. The visual system makes citations look intentional, not apologetic.
- **Operator-honest**: the colour palette is warm and grown-up, not the over-saturated blues and gradients of generic SaaS pitches. The decks are pitched to people who have read Andy Grove and Charlie Munger; the visual language matches.

The decks share visual DNA with the Site lane (warm cream + amber-gold) but are **deliberately distinct** in exact hex values so a reader who has seen both can subconsciously distinguish "operator deck content" from "client-facing site content."

**What it is not:** a venture-pitch template, a Canva slide deck, a Keynote business-template look, a Power-Point corporate template, or anything with a coloured "title-bar" running across the slide top.

---

## 2. Color Palette & Roles

The deck palette is deliberately small (six effective tokens) so it can be applied consistently across 50+ slides per deck. All values match the Marp `style:` block in [`../decks/01-investor-deck.md`](../decks/01-investor-deck.md) and its siblings.

```css
/* Deck brand tokens */
--deck-canvas:    #fafaf7;  /* slide background — warm cream, slightly lighter than Site canvas */
--deck-ink:       #1f1f1f;  /* headings, body text */
--deck-muted:     #555555;  /* blockquote attribution, secondary text */
--deck-faint:     #666666;  /* small-class metadata */
--deck-footnote:  #888888;  /* footnote-class microtype */
--deck-accent:    #b48a3c;  /* h3 colour, strong text, blockquote left-border */
--deck-code-bg:   #f0ece2;  /* inline code background */
```

### Role rules

- **Canvas** is the slide background. Always `#fafaf7`. No coloured title-bars, no gradient backgrounds, no full-bleed photos behind text.
- **Ink** is the default text color — used for h1, h2, body, table cells.
- **Accent** (`#b48a3c`) is reserved for: h3 headings, `<strong>` emphasis, blockquote left-border (4px solid). **Never used for body text or large fills.**
- **Muted / Faint / Footnote** form a three-step de-emphasis ladder for source attributions, slide-level metadata, and citation microtype respectively.
- **Code-bg** is the only colour besides accent that touches body content — used for inline `[V]` source IDs and tool-name spans.

### What's NOT in the palette

No success/error semantic colors. The decks don't carry operational status signals. If a slide needs to mark a "win" or "risk," it uses the accent + a `<strong>` tag, not a green/red.

---

## 3. Typography Rules

### Font families

```
Display (h1, h2):  Fraunces, Georgia, serif
Body, h3, code:    Inter, system-ui, sans-serif
Code:              monospace (system fallback acceptable; deck artefacts rarely show code)
```

Fraunces is loaded from Google Fonts in the Marp HTML render. If Claude Design lacks Fraunces, fall back to Source Serif 4 or Charter — never to Times New Roman or Cambria.

### Heading rules

- **h1**: `font-family: Fraunces`, `font-size: 2.4em`, `color: #1f1f1f`. Used for slide titles (one per slide max).
- **h2**: `font-family: Fraunces`, `color: #1f1f1f`. Used for section titles within a slide (rare — most slides have only an h1 or no heading at all).
- **h3**: `color: #b48a3c` (accent). Used for sub-section emphasis. Body font (Inter), not display.
- **strong**: inline emphasis, color `#b48a3c`. Sparingly.

### Body type

- Default body: Inter, 1em (the Marp section padding sets the effective size; tables drop to 0.78em).
- Tables: `font-size: 0.78em`. Used heavily — most claim slides are 3-column tables (Stat / Source / Implication).
- Small-class (`<span class="small">`): 0.78em, color `#666`. Slide-level metadata.
- Footnote-class (`<span class="footnote">`): 0.72em, color `#888`. Inline citations rendered alongside body text.
- Center-class (`<div class="center">`): centered alignment for pull-quotes only. Never for body or hero text.

### Blockquote

```css
blockquote {
  border-left: 4px solid #b48a3c;
  color: #555;
  font-style: italic;
  /* used for the operator's voice as quoted by the deck — sparingly */
}
```

### Inline code

```css
code {
  background: #f0ece2;
  padding: 2px 6px;
  border-radius: 3px;
  /* used for [V] source IDs, file paths, tool names */
}
```

---

## 4. Component Stylings

The deck "components" are the recurring slide patterns, not React widgets. Each slide is built from these primitives:

### Title slide

- Marp `<!-- _class: lead -->` directive.
- h1 (Fraunces, 2.4em) + h3 (accent, e.g. "Investor briefing — refreshed YYYY-MM-DD") + lead paragraph + confidentiality footer (small-class, italic).
- One per deck.

### Claim slide (most common)

- h1 question or assertion.
- Body lead paragraph framing the claim.
- 3-column table: **Stat | Source | Implication**.
- Source column always carries a backtick `[V] §B-XXX` reference.

### Comparison table slide

- h1 with "vs", "Compared to", or numbered options.
- 4–6-row table, single-row-per-option.
- Bold `<strong>` highlights the recommended option.

### Pull-quote slide

- Large blockquote, accent left-border.
- Attribution below in muted text.
- Used sparingly — at most 1–2 per 50-slide deck.

### Section divider

- Single h1 in display font, centered (use `.center` class explicitly).
- No subheading. Provides visual breathing room between major arcs.

### Closing slide

- h1 ("Next steps", "What we ask of you", "Pre-share checklist", etc.).
- Bulleted list, 4–7 items max.
- Footer: confidentiality + `Last updated: YYYY-MM-DD`.

---

## 5. Layout Principles

### Slide geometry

- Aspect: 16:9.
- Padding: 60px top/bottom, 80px left/right. Set in the Marp `style:` block.
- One headline + one supporting structure per slide. Never two distinct ideas on the same slide.

### Vertical rhythm

- ~24px gap between heading and body.
- ~32px gap between body and table.
- Tables are dense by design — accept small body font (0.78em) to fit 5–6 rows of evidence on a single slide.

### Content density

- Investor / advisor decks: 12–16 slides total. Each slide says one thing with one piece of evidence.
- Master deck: 50+ slides, organised by the nine product-positioning questions. Higher density per slide acceptable here because the audience is operator-self-review.

### Grid

- No multi-column body text within a slide.
- Side-by-side layout achieved via tables, not flex/grid CSS.
- This keeps the deck portable to PDF print without layout breakage.

---

## 6. Depth & Elevation

Decks are **flat by design**. No shadows, no elevation effects, no z-axis depth.

- Tables: 1px hairline borders only (Marp default).
- Blockquotes: left-border only.
- Code spans: subtle background fill (`#f0ece2`), no shadow.
- Slide background: solid colour, no gradient, no texture, no parallax.

If Claude Design suggests adding card shadows, hero overlays, or elevation to slides — reject. The deck visual language is print-derived.

---

## 7. Do's and Don'ts

### Do

- Lead each slide with a one-sentence headline (h1) that states the slide's claim.
- Cite every number, %, dollar figure with a backtick `[V] §B-XXX` source reference.
- Use tables for any structured comparison — not bullet lists with bolded prefixes.
- Apply accent (`#b48a3c`) sparingly: h3, strong, blockquote border. Three places, no more.
- Keep slide count tight (12–16 for stakeholder decks; 50+ only for the master deck).
- Use the closing slide to itemise the **ask** of the audience.

### Don't

- Don't use icons. The deck system is text-and-table-only.
- Don't use coloured title-bars, hero photos, or full-bleed gradients.
- Don't use bullet lists where a table would work better.
- Don't introduce a second accent colour. Amber-gold is the only voice.
- Don't quote a number without a `[V]` row in [`../research/03-source-bibliography.md`](../research/03-source-bibliography.md). The pre-publication gate in [`../decks/00-INDEX.md`](../decks/00-INDEX.md) enforces this.
- Don't mix audiences in a single deck. Per [`../decks/00-INDEX.md`](../decks/00-INDEX.md) audience-fit rule, make a new deck instead.
- Don't add slide animations or transitions. Marp's default fade is the only motion.

---

## 8. Responsive Behavior

Decks are 16:9 fixed-aspect — there is no "responsive" in the web sense. But three rendering targets matter:

### Browser presentation (primary)

- Marp renders to a single self-contained HTML file. Arrow keys / space advance slides. Tested in Chrome / Edge / Firefox.
- Generated by the [`render-decks.yml`](../../.github/workflows/render-decks.yml) workflow on push.

### PDF (secondary)

- Open the rendered HTML in a browser, use **Print → Save as PDF**.
- All content must remain legible at PDF page size (typically 11" × 8.5" landscape).
- Tables must not overflow — the 0.78em table type and ≤6-row rule keep this safe.

### Email forwarding (tertiary)

- Single-recipient decks (per `02-partner-deck.md`, `03-employee-deck.md`, `05-advisor-deck.md`) get forwarded as PDF, never as standalone HTML attachment (security policy).
- The `06a-master-deck-shareable.md` HTML is the only one that can be link-shared (e.g., via signed-URL Drive share).

---

## 9. Agent Prompt Guide

When asking Claude Design to generate new slides, slide variants, or one-pagers in the deck visual language, lead the prompt with:

```
Brand: Lumivara Forge stakeholder decks ("Editorial Restraint" system).
Slide aspect: 16:9, padding 60px / 80px.
Palette: --canvas (#fafaf7), --ink (#1f1f1f), --accent (#b48a3c),
         --code-bg (#f0ece2), --muted (#555).
Display font: Fraunces serif, h1 at 2.4em.
Body font: Inter, default 1em (tables drop to 0.78em).
No icons, no gradients, no shadows, no coloured title-bars.
Accent appears at most three places per slide: h3 / strong / blockquote-border.
Every numeric claim carries a backtick [V] §B-XXX citation.
```

### Common asks

- **"Convert this MD slide into a polished one-pager."** Expected output: a single self-contained HTML file styled as one continuous landscape page (not paginated), preserving the deck typography and palette.
- **"Generate a comparison-table slide for these five competitors."** Expected output: a Marp-compatible MD slide with a 6-row table (header + 5 options), bold on the recommended row, source column populated.
- **"Visualise this 24-month financial projection as a chart slide."** Expected output: an inline SVG or HTML/CSS chart (no external chart library), monochrome on `--canvas` with `--accent` for the projection line. No 3D, no gradient fills.

### Round-trip back to the repo

For polish that should land in a deck source MD:

- Output target: a Marp MD slide block (delimited by `---` per Marp convention) that can be inserted into the existing `docs/decks/<NN>-<slug>-deck.md` file.
- Must preserve the deck's frontmatter `style:` block — do not introduce new CSS classes that aren't already defined there.
- After insertion, the [`render-decks.yml`](../../.github/workflows/render-decks.yml) workflow regenerates the HTML on push.

For polish that needs hand-authored HTML beyond Marp's reach (per [`../AI_CLAUDE_DESIGN_PLAYBOOK.md §5`](../AI_CLAUDE_DESIGN_PLAYBOOK.md)):

- Save under `docs/decks/<NN>-<slug>-deck.designed.html` (separate filename suffix).
- Document the divergence in the deck MD with a top-of-file note.
- The auto-renderer leaves `*.designed.html` alone.

---

*Source-of-truth contract:* this file mirrors the Marp `style:` block shared by every deck under [`../decks/`](../decks/). When the deck visual system changes (e.g., D2 brand-name resolution prompts a palette refresh), this file updates first, the deck Marp frontmatter updates next, then the Claude Design project is re-uploaded.

*Last updated: 2026-04-30 — initial scaffold; tokens current as of [`../decks/01-investor-deck.md`](../decks/01-investor-deck.md) frontmatter `@2026-04-30`. Brand placeholder `Lumivara Forge` per D2 reconsideration noted in [`../mothership/15c-brand-and-domain-decision.md`](../mothership/15c-brand-and-domain-decision.md).*
