# 02 — Site-lane DESIGN.md (template)

> _Lane: 🛠 Pipeline — operator scaffold. The placeholder-substituted version of this file is what gets uploaded to the per-client Claude Design project. Do not upload this template directly — it contains operator scaffolding._
>
> **What this is.** A repo-resident `DESIGN.md` scaffold for the **Site lane** (per-client marketing site). Built to Anthropic's expected 9-section shape so Claude Design ingests it cleanly. Tokens are extracted from [`../../src/app/globals.css`](../../src/app/globals.css) — the live runtime source of truth; this file mirrors them so the design system is visible to Claude Design without that tool needing to parse the full Tailwind 4 + shadcn setup.
>
> **Substitution before upload.** Replace every `<CLIENT_*>` placeholder with the engagement's actual values. The runbook ([`04 §3`](./04-setup-and-sync-runbook.md)) lists every placeholder and where the canonical value comes from.
>
> **Drift contract.** When [`../../src/app/globals.css`](../../src/app/globals.css) changes, this file is updated in the same PR. The Claude Design project is then re-uploaded. Per [`01 §5`](./01-decision-and-frame.md): repo first, Claude Design second, never the reverse.

---

# DESIGN.md — `<CLIENT_BRAND_NAME>` site

## 1. Visual Theme & Atmosphere

`<CLIENT_BRAND_NAME>` runs the **"Warm Editorial with Quiet Intelligence"** system. The aesthetic sits between an editorial print magazine and a thoughtful product site:

- **Warm**, not cold: cream and parchment surfaces, never stark white.
- **Editorial**, not corporate: serif display type, generous line-height, articulated rhythm.
- **Quiet**, not loud: amber-gold accent used as a single voice across CTAs, focus rings, and subtle emphasis — never as flat fills or backgrounds.
- **Intelligent**, not playful: type-led layouts, restraint with motion, no decorative gradients.

The mood references the *Financial Times Weekend*, *The Browser* newsletter, Stripe's documentation pages, and Vercel's marketing site — but warmer than any of them.

**What it is not:** a SaaS dashboard, a Material Design app, a brutalist portfolio, a glassmorphism / neumorphism site, an AI-art-heavy startup landing page.

---

## 2. Color Palette & Roles

The palette is a six-token brand layer plus a derived shadcn semantic layer. Tokens are CSS custom properties exposed to Tailwind via `@theme inline`. Four brand sub-palettes are available (`default`, `earth`, `slate`, `forest`); each has matched dark-mode values.

### Brand tokens — light mode (default sub-palette)

```css
:root {
  --canvas: #f7f4ed;          /* page background — warm cream */
  --canvas-elevated: #fbf9f3; /* card / popover surfaces — slightly lighter */
  --ink: #0e1116;             /* heading text — near-black, slightly cool */
  --ink-soft: #2b2f3a;        /* body text — softer than ink */
  --muted: #6b6f7a;           /* secondary text, captions, metadata */
  --parchment: #efeae0;       /* secondary surfaces, chip backgrounds */
  --accent: #c8912e;          /* amber-gold — CTAs, focus, emphasis */
  --accent-soft: #dfa950;     /* hover state for accent */
  --accent-deep: #a87820;     /* pressed / active state for accent */
  --border: #e5dfd0;          /* subtle dividers, input borders */
  --success: #4a7c59;         /* moss-green — never decorative */
  --error: #a13d3d;           /* terracotta-red — never decorative */
}
```

### Brand tokens — dark mode

Apply via `class="dark"` on `<html>`. Canvas inverts to near-black; ink lifts to cream; accent brightens slightly.

```css
.dark {
  --canvas: #0e1116;
  --canvas-elevated: #161a22;
  --ink: #f7f4ed;
  --ink-soft: #d8d4ca;
  --muted: #8a8e99;
  --parchment: #1f2430;
  --accent: #e0b160;
  --accent-soft: #edc478;
  --accent-deep: #c8912e;
  --border: #2a2f3b;
}
```

### Sub-palette switching

Apply via `data-palette` attribute on `<html>`. `earth` (terracotta accent), `slate` (cool blue accent), `forest` (deep green accent). Each has light + dark pair. The shadcn semantic mappings (`--background`, `--primary`, etc.) inherit through `var()` chains and don't need re-mapping per sub-palette.

### Role rules

- **Canvas** is the page background. Use `--canvas-elevated` for card-like containers, never both at the same depth.
- **Ink** is reserved for headings and the highest-weight body emphasis. Default body text uses `--ink-soft`.
- **Accent** appears at most once per "above-the-fold" view. Single CTA, single focus ring, single inline emphasis. Never as a background fill larger than ~120px.
- **Success / Error** carry semantic meaning only. Never decorative. Never paired with non-status content.

---

## 3. Typography Rules

### Font families

```css
--font-display: <CLIENT_DISPLAY_FONT>;  /* serif, e.g. Fraunces, Source Serif 4 */
--font-body:    <CLIENT_BODY_FONT>;     /* humanist sans, e.g. Inter, Geist */
--font-mono:    <CLIENT_MONO_FONT>;     /* e.g. JetBrains Mono, IBM Plex Mono */
```

`<CLIENT_BRAND_NAME>` default: Fraunces (display) + Inter (body) + JetBrains Mono (mono). Fonts are loaded via Next.js `next/font` so this DESIGN.md doesn't need to embed them; Claude Design can render against system fallbacks.

### Heading rules

All headings: `font-family: var(--font-display)`, `color: var(--ink)`, `font-weight: 400` (display), `letter-spacing: -0.02em`. h4–h6 fall back to body font + weight 600 (utility role only — never used as visual hierarchy).

### Type scale (fluid, `clamp()`-based)

| Class | Size range | Line-height | Use |
|---|---|---|---|
| `text-display-xl` | clamp(2.75rem, 5vw + 1rem, 4.5rem) | 1.05 | Hero h1 only |
| `text-display-lg` | clamp(2.25rem, 4vw + 0.5rem, 3.5rem) | 1.10 | Page h1 |
| `text-display-md` | clamp(1.75rem, 2.5vw + 0.75rem, 2.5rem) | 1.15 | Section h2 |
| `text-display-sm` | clamp(1.375rem, 1.25vw + 0.875rem, 1.75rem) | 1.25 | Subsection h3 |
| `text-body-lg` | clamp(1.0625rem, 0.25vw + 1rem, 1.25rem) | 1.55 | Lead paragraph, intro |
| `text-body` | 1.0625rem (17px) | 1.65 | **Default body** |
| `text-body-sm` | 0.9375rem (15px) | 1.55 | Compact body, footnotes |
| `text-label` | 0.75rem (12px) | 1.4 | UPPERCASE eyebrow / metadata, font-mono, letter-spacing 0.12em |
| `text-caption` | 0.8125rem (13px) | 1.5 | Image captions, microcopy |

Default body line-height is `1.65` — generous, editorial. Don't tighten below `1.5` outside `text-label`.

### Selection + focus

```css
::selection { background: var(--accent); color: var(--canvas); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

The amber selection + focus ring is part of the brand voice. Don't replace with browser defaults.

---

## 4. Component Stylings

### Buttons

- **Primary:** background `--ink`, text `--canvas`, radius `--radius-md` (8px), padding `0.625rem 1.25rem`, font-weight 500. Hover: background `--ink-soft`. Focus: amber 2px ring (inherits from `:focus-visible`).
- **Secondary:** background `--parchment`, text `--ink`, same dimensions. Hover: background `--border`.
- **Accent (rare):** background `--accent`, text `--canvas`, used at most once per view, reserved for the primary conversion CTA.
- **Ghost:** background transparent, text `--ink-soft`, underline on hover.

### Cards

- Background: `--canvas-elevated`. Border: 1px solid `--border`. Radius: `--radius-lg` (16px). Padding: 1.5rem (24px) minimum, 2rem (32px) preferred.
- Shadow: `--shadow-sm` resting, `--shadow-lg` on hover for interactive cards.
- No glassmorphism. No backdrop blur except for sticky headers (≤8px blur).

### Inputs

- Background: `--canvas-elevated`. Border: 1px solid `--border`. Focus border: `--accent`. Radius: `--radius-md`.
- Placeholder: `--muted`. Label: `text-label` class above input.

### Links

- Body links: color `--accent-deep`, underline `from-font` decoration. Hover: color `--accent`.
- Nav links: color `--ink-soft`, no underline. Active page: color `--ink`.

### Dividers

- 1px solid `--border` for default. 2px `--accent` for emphasis dividers (rare — under section headers in long-form content only).

---

## 5. Layout Principles

### Grid

- Max content width: 1200px (Tailwind `max-w-screen-xl`).
- Reading column for prose: 65–75ch (Tailwind `max-w-prose` + adjustments).
- Section vertical rhythm: 96px (`py-24`) on desktop, 64px (`py-16`) on tablet, 48px (`py-12`) on mobile.

### Whitespace

- **Generous** is the default. If a section feels balanced when designed, double the whitespace.
- Components within a section: 32px (`gap-8`) minimum spacing.
- Around section headings: 48–64px below, 96px+ above.

### Asymmetry

- Hero sections favor 60/40 or 65/35 splits over 50/50.
- Long-form articles use a left-aligned reading column with a right-aligned floating sidebar (sources, related links).
- Avoid centered hero text + centered subhead + centered CTA — it reads generic.

### Density

- "Quiet intelligence" means **fewer elements per view**, not more. Aim for ≤7 distinct interactive targets above the fold.

---

## 6. Depth & Elevation

The system uses **subtle, low-contrast shadows** — never the hard drop-shadows of mid-2010s Material Design.

```css
--shadow-xs: 0 1px 2px 0 rgb(14 17 22 / 0.04);   /* dividers, nested cards */
--shadow-sm: 0 2px 8px -1px rgb(14 17 22 / 0.04); /* resting cards */
--shadow-lg: 0 8px 32px -4px rgb(14 17 22 / 0.08); /* elevated / hover */
```

### Elevation rules

- **Page surface (canvas):** no shadow.
- **Card resting:** `--shadow-sm`. Border still 1px — shadow is supplementary, not load-bearing.
- **Card hover (interactive):** `--shadow-lg`, transition over 200ms.
- **Modal / popover:** `--shadow-lg` plus border. Rare in this system — prefer inline disclosure.
- **No double-shadowing.** A shadowed card on a shadowed canvas reads muddy.

### Border-radius scale

```css
--radius-xs:  2px;  /* chips, badges */
--radius-sm:  4px;  /* small inputs */
--radius-md:  8px;  /* buttons, default inputs, small cards */
--radius-lg:  16px; /* cards */
--radius-2xl: 24px; /* hero cards, feature panels */
--radius-3xl: 32px; /* full-width feature blocks */
--radius-4xl: 40px; /* rare — pill CTAs, hero badges */
```

---

## 7. Do's and Don'ts

### Do

- Lead with type. The first thing a visitor reads should be a headline in `--font-display`, set in `--ink`, with negative letter-spacing.
- Use the accent **once** per fold. A CTA is the accent moment.
- Pair `--canvas-elevated` cards on a `--canvas` page (one level of contrast).
- Honour `prefers-reduced-motion`. The base `globals.css` already disables `drift` and `reveal-up` animations — preserve that.
- Treat `--success` (moss-green) and `--error` (terracotta) as semantic only.
- Use `text-label` (uppercase mono microtype) for eyebrow text above section headings.

### Don't

- Don't use pure white (`#fff`) for surfaces. Use `--canvas` or `--canvas-elevated`.
- Don't introduce a second accent color. The system has one accent per palette by design.
- Don't use gradients as backgrounds. The optional `drift` animation provides the only ambient motion.
- Don't use Material Design elevation, glassmorphism, neumorphism, or 2010s-era drop shadows.
- Don't switch fonts mid-page. The display + body + mono trio is fixed; introducing a fourth family is a brand violation.
- Don't reduce body line-height below `1.5`. The system reads editorial because of vertical rhythm.
- Don't use the accent color for body text or large fills.

---

## 8. Responsive Behavior

### Breakpoints

Tailwind defaults are honoured: `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`, `2xl: 1536`. Most layout breakpoints land at `md` or `lg`.

### Reading width

- Mobile: full width with 16–24px gutters.
- Tablet+: max-w-prose (~65ch) for long-form, max-w-screen-xl (1200px) for marketing pages.

### Type

- All `text-display-*` classes use `clamp()` so headings reflow without breakpoint-specific overrides. This is the primary responsive type strategy — avoid manually overriding heading size at breakpoints.
- Body text stays at 17px from mobile to ultra-wide; never scale body type per breakpoint.

### Components

- Cards stack vertically below `md`; switch to grid (`grid-cols-2` or `grid-cols-3`) at `md`+.
- Nav: hamburger below `md`, horizontal nav at `md`+.
- Hero: 60/40 split at `lg`+, stacked below.

### Touch targets

- Minimum 44×44px tap target on mobile (Apple HIG / WCAG). Inputs and buttons must meet this; small inline icons can be smaller if not the primary tap target.

---

## 9. Agent Prompt Guide

When asking Claude Design to generate new sections, mockups, or page variants for the Site lane, lead the prompt with this stanza:

```
Brand: <CLIENT_BRAND_NAME> ("Warm Editorial with Quiet Intelligence" system).
Use the brand palette tokens: --canvas (#f7f4ed), --ink (#0e1116),
--accent (#c8912e), --canvas-elevated (#fbf9f3), --parchment (#efeae0).
Display font: Fraunces (serif), 400 weight, -0.02em tracking.
Body font: Inter, 17px / 1.65, color #2b2f3a.
Single accent moment per view. Generous whitespace.
No glassmorphism, no gradient backgrounds, no Material elevation.
```

Then describe what you want generated. Example:

```
Generate a "How we work" three-step section for the homepage. Each step is a
card with: a uppercase mono label ("Step 01" / "Step 02" / "Step 03"), a serif
display heading, and 2-3 lines of body. Cards in a horizontal grid at lg+,
stacked below md. Resting on --canvas-elevated, --shadow-sm. The third card
has an inline accent CTA ("See pricing →") in --accent-deep. No icons unless
specifically asked for.
```

For mockups intended to round-trip into the Next.js codebase, ask Claude Design to:

- Use Tailwind utility classes that map onto the existing tokens (`bg-canvas-elevated`, `text-ink`, `text-accent-deep`, etc. — see [`../../src/app/globals.css`](../../src/app/globals.css) `@theme inline` block).
- Prefer existing components from [`../../src/components/sections/`](../../src/components/sections/) when possible (current set: hero, partnership timeline, service detail, etc.).
- Output as a single React component file with TypeScript, not as raw HTML.

---

*Source-of-truth contract:* this file mirrors [`../../src/app/globals.css`](../../src/app/globals.css). When `globals.css` changes, this file updates in the same PR. The per-client Claude Design project is re-uploaded after the PR merges.

*Last updated: 2026-04-30 — initial scaffold; tokens current as of [`globals.css`](../../src/app/globals.css) `@2026-04-30`.*
