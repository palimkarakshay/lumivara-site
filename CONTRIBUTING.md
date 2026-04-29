# Contributing to Lumivara Site

This repo is operated primarily by an AI automation loop (Claude via GitHub Actions). Human contributions are welcome but follow a specific flow.

## The normal path: create an Issue

Most changes start as a GitHub Issue, not a pull request:

1. Open an issue describing what you want changed.
2. The triage bot classifies and labels it within ~24 h.
3. The execute bot implements it on a branch and opens a PR.
4. The operator reviews and merges from their phone.

This works for copy edits, new insight articles, design tweaks, and new pages.

## When to open a PR directly

Open a PR directly only if:

- You are fixing a **production incident** and need an immediate deploy.
- The issue is labeled `human-only` (the bot won't touch it).
- You are working on bot infrastructure (`.github/workflows/`, `scripts/`).

## Local setup

Requires Node.js 20 or later.

```bash
git clone https://github.com/palimkarakshay/lumivara-site.git
cd lumivara-site
npm install
npm run dev
```

Open http://localhost:3000. No environment variables are required for local dev.

## Code standards

| Check | Command |
|---|---|
| TypeScript | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Unit tests | `npm test` |
| E2E tests | `npx playwright test` |

Both TypeScript and lint **must pass** before merging. Fix new errors you introduce; pre-existing errors on `main` are noted in the PR body.

## Commit message format

```
feedback(#<issue>): <short summary>
```

Example: `feedback(#42): add dark-mode toggle to nav`

One logical change per commit. If an implementation spans multiple steps, use multiple commits on the same branch.

## Content locations

| What | Where |
|---|---|
| Page copy | `src/content/` |
| Services | `src/content/services.ts` |
| Insight articles (MDX) | `src/content/insights/` |
| Site-wide settings | `src/lib/site-config.ts` |
| Design tokens | `src/app/globals.css` |

## Hard exclusions (bot and humans alike)

- `.github/workflows/*` — workflow changes need explicit `infra-allowed` label
- `.env*` files — secrets via Vercel dashboard only
- `src/app/api/contact/*` — high-stakes; human review required
- Deleting existing pages — requires human sign-off

## Design system

See the **Design system** table in `README.md` for tokens. Use the existing Tailwind utilities (`bg-canvas`, `text-accent`, etc.) rather than raw hex values.

## Need help?

Open an issue with the `status/needs-clarification` label, or email hello@lumivara.ca.
