# Best Practices ⚪

> **Lane:** ⚪ Both — except where stamped 🛠. See [[_partials/lane-key]] for the badge legend. These conventions apply on the mothership repo *and* on every per-client (`<client-repo>`) repo unless a section is explicitly stamped operator-only.

## Code quality

### TypeScript
- Strict mode is on (`"strict": true` in `tsconfig.json`). No `any` without a comment explaining why.
- Run `npx tsc --noEmit` before pushing. New type errors on your branch are a regression — fix them.

### Linting
- ESLint with Next.js rules. Run `npm run lint`. Fix new lint errors; pre-existing errors on `main` must be documented in the PR body.

### Testing
- Unit tests: `npm test` (Vitest)
- E2E tests: `npx playwright test`
- Tests are not a substitute for visual review: always check the Vercel preview URL before merging.

## Git workflow

### Branch naming
- Bot branches: `auto/issue-<n>` (managed automatically)
- Human branches: `fix/<short-description>` or `feat/<short-description>`

### Commit messages
```
feedback(#<issue>): <imperative short summary>
```
One logical change per commit. Don't bundle unrelated changes.

### Never do these
- Push directly to `main`
- Merge a PR without reviewing the Vercel preview
- Enable auto-merge on any PR
- Commit `.env.local` or any file containing secrets

## Content editing

| What | Where | Format |
|---|---|---|
| Page copy | `src/content/` | TypeScript objects |
| Services | `src/content/services.ts` | TypeScript |
| Insight articles | `src/content/insights/` | MDX with YAML frontmatter |
| Site-wide settings | `src/lib/site-config.ts` | TypeScript |

### Insight article frontmatter
```yaml
---
title: "Article Title"
excerpt: "One-sentence summary shown in the insights list."
category: "Organizational Design"
date: "2026-04-26"
readingTime: "5 min read"
---
```

## Design system

Use existing Tailwind tokens — never raw hex values:

| Token | Usage |
|---|---|
| `bg-canvas` | Page backgrounds |
| `bg-parchment` | Card / section backgrounds |
| `text-ink` | Primary text |
| `text-ink-soft` | Secondary / muted text |
| `text-accent` | Amber highlight |
| `border-border-subtle` | Dividers and card borders |

Typography: `text-display-xl` through `text-caption`, plus `text-label` for mono micro-labels.

## Performance

- Lighthouse target: ≥90 on all four categories
- Use `next/image` for all images (automatic optimization)
- Use `next/font` for font loading (self-hosted, zero layout shift)
- Respect `prefers-reduced-motion` in all animations

## Accessibility

- Every interactive element must be keyboard-accessible with a visible focus ring
- Images need descriptive `alt` text
- Use semantic HTML — `<nav>`, `<main>`, `<article>`, `<section>` as appropriate
- Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text

## Bot exclusions (hard limits for all contributors) 🛠

> <!-- do-not-copy:v1 -->
> **🛠 Do not copy to client repos.** This section describes operator-side machinery that
> lives on the mothership repo or on the `operator/main` overlay branch of a client
> repo. A client cloning their `main` will never see this content. If you are the
> operator scaffolding a new client repo, **omit this section from the per-client wiki**.

These require human review and must not be changed by the bot or by contributors without explicit sign-off:

1. `.github/workflows/*`
2. `.env*` files
3. `package.json` dependency version changes
4. `scripts/*`
5. `src/app/api/contact/*`
6. Deleting existing pages or components

> **On a client repo `main`, items 1 and 4 are not present** (they live on `operator/main`); items 2, 3, 5, 6 still apply. The lane split is enforced by the Pattern C two-branch model — see `docs/mothership/02-architecture.md §1`.
