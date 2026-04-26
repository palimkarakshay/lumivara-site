# Development Setup

## Prerequisites

- Node.js 20 or later (`node --version`)
- npm 10 or later (comes with Node 20)
- Git

## Clone and install

```bash
git clone https://github.com/palimkarakshay/lumivara-site.git
cd lumivara-site
npm install
```

## Run locally

```bash
npm run dev
```

Open http://localhost:3000. Hot reload is on by default.

No environment variables are required — the defaults in `.env.local` are safe for local dev. See `.env.local.example` for what each variable does.

## Common commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | TypeScript check (no emit) |
| `npm test` | Unit tests (Vitest) |
| `npx playwright test` | End-to-end tests |

## Project structure

```
src/
  app/           # Next.js App Router — pages and layouts
  components/    # React components
  content/       # All editable copy and MDX articles
  lib/           # Utilities and site config
public/          # Static assets (SVGs, images, fonts)
docs/            # Project documentation
scripts/         # Bot playbooks (human-only)
.github/
  workflows/     # GitHub Actions (human-only)
  ISSUE_TEMPLATE/
  SECURITY.md
  PULL_REQUEST_TEMPLATE.md
CONTRIBUTING.md
```

## Making changes

See [[Best-Practices]] for conventions.

The fastest path for content changes:
1. Edit a file in `src/content/`
2. Save — the dev server hot-reloads
3. Verify in the browser
4. Commit and push your branch
5. Open a PR

## Troubleshooting

**`npm install` fails on Node < 20**
Upgrade Node: `nvm install 20 && nvm use 20`

**TypeScript errors on startup**
Run `npx tsc --noEmit` to see the full list. Check if errors exist on `main` before assuming you introduced them.

**Port 3000 already in use**
`PORT=3001 npm run dev`

**Playwright tests fail locally**
Install browsers once: `npx playwright install --with-deps`
