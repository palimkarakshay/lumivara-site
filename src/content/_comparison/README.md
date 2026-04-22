# Content comparison — lumivara.ca (current) → lumivara-site (new)

This folder tracks copy changes made during the rebuild. Each page has a file here documenting what changed, why, and what the new version says.

## Why this exists

Beas requested a "before/after" view so copy changes can be reviewed without running the site side-by-side. Git history shows code diffs; these files show **intent**.

## How it's organized

- One `.md` file per top-level page (e.g. `home.md`, `services.md`, `about.md`).
- Each file has a simple two-column structure:
  - **Current (lumivara.ca):** what's on the live Squarespace site today
  - **New (lumivara-site):** what the rebuilt page says
  - **Rationale:** why the change (if any)

## Editing rules we've committed to

1. **Service body copy stays verbatim.** Sub-service titles, descriptions, and bullet lists from the live site are preserved exactly. The only rewording happens at the intro / framing / wrapper level.
2. **Founder bio stays verbatim.** Beas's five-paragraph bio from the current About page is preserved.
3. **FAQ answers stay verbatim.** The 10 existing FAQs are kept as-is.
4. **Process steps stay verbatim.** The 5-step Client Partnership Process is preserved.

## Where the copy actually lives in the code

- Page-level copy: `src/content/*.ts` (one file per route)
- Structured service data: `src/content/services.ts`
- FAQs: `src/content/faqs.ts`
- Partnership process: `src/content/partnership-process.ts`
- Insights articles: `src/content/insights/*.mdx`

Edit any of those files, save, and the site re-renders. See the project README for more.
