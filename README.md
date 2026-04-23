# Lumivara Site — Local Working Demo - git update check

A rebuilt Lumivara People Advisory site, running locally. Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + MDX.

> **Status:** In active build. Local-only; not yet deployed.

---

## Run it

Requires Node.js 20 or later.

```bash
git clone https://github.com/<owner>/lumivara-site.git
cd lumivara-site
npm install
npm run dev
```

Open http://localhost:3000.

No environment variables are required to run locally — the `.env.local` committed to your working tree has safe defaults. See [.env.local.example](./.env.local.example) for what each variable does.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | TypeScript check (no output) |

---

## Where to edit things

### Text / copy
All page-level copy lives in [`src/content/`](./src/content/). Each page has one file. Open, edit the strings, save, see it reflected. See [`src/content/README.md`](./src/content/README.md) for the index.

### Services
The six core services and their sub-services are defined in [`src/content/services.ts`](./src/content/services.ts). Service body copy is preserved verbatim from the current Squarespace site — edit with care.

### Insights articles
Articles are MDX files in [`src/content/insights/`](./src/content/insights/). Each has YAML frontmatter (title, excerpt, category, date, reading time). Add a new file to publish a new article — no further wiring needed.

### Site-wide settings
Tagline, contact email, phone, navigation labels, Cal.com link: [`src/lib/site-config.ts`](./src/lib/site-config.ts).

### Logo and images
- Typographic SVG wordmark (current logo): `public/logo-wordmark.svg`
- Previous logo (lighthouse JPEG): `public/logo-original.jpg` — kept for reference
- Favicon: `public/favicon.svg`

To swap the wordmark, replace `public/logo-wordmark.svg`. To swap the favicon, replace `public/favicon.svg` and/or add `.ico` / PNG variants.

### Before / after comparison
Copy changes vs. lumivara.ca are tracked in [`src/content/_comparison/`](./src/content/_comparison/).

---

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, RSC)
- **Language:** TypeScript (strict)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **UI primitives:** [shadcn/ui](https://ui.shadcn.com) on Base UI React
- **Content:** MDX via `@next/mdx` with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`
- **Forms:** React Hook Form + Zod
- **Fonts:** Fraunces (display), Inter (body), JetBrains Mono (labels) — self-hosted via `next/font/google`
- **Icons:** `lucide-react`

---

## Design system

| Token | Light | Dark |
|---|---|---|
| Canvas | `#F7F4ED` | `#0E1116` |
| Ink | `#0E1116` | `#F7F4ED` |
| Parchment | `#EFEAE0` | `#1F2430` |
| Accent (amber) | `#C8912E` | `#E0B160` |

Tailwind utilities follow these tokens: `bg-canvas`, `bg-ink`, `bg-parchment`, `text-ink`, `text-ink-soft`, `text-accent`, `text-accent-deep`, `border-border-subtle`.

Type utilities: `text-display-xl` → `text-caption`, plus `text-label` for mono uppercase micro-labels.

See `src/app/globals.css` for the full token set.

---

## Accessibility & performance commitments

- All interactive elements keyboard-accessible with visible focus rings
- Respects `prefers-reduced-motion`
- Fluid type via `clamp()` — scales across 375px → 1920px without layout shift
- Lighthouse target: ≥90 on Performance / Accessibility / Best Practices / SEO

---

## Deployment

Not yet deployed. When ready, the project is Vercel-ready — zero config change required.

---

## Project status

Built in phases. See git history for per-phase commits.

---

## Backlog

Change requests live in **GitHub Issues**, organised on a **Project v2** Kanban board, and worked by two scheduled GitHub Actions running Claude Code. See [docs/BACKLOG.md](./docs/BACKLOG.md) for the full map.

- **Capture from phone**: [PHONE_SETUP.md](./PHONE_SETUP.md) — HTTP Shortcuts → `POST /repos/.../issues`.
- **Triage**: [`.github/workflows/triage.yml`](.github/workflows/triage.yml) runs daily. Claude reads new issues, applies `priority/`, `complexity/`, `area/` labels using the rubric in [`scripts/triage-prompt.md`](./scripts/triage-prompt.md), and comments the rationale.
- **Execute**: [`.github/workflows/execute.yml`](.github/workflows/execute.yml) runs every 8h. Claude picks the top `auto-routine` issue, implements on a branch `auto/issue-<n>`, opens a PR that never auto-merges. Playbook: [`scripts/execute-prompt.md`](./scripts/execute-prompt.md).
- **Review**: you merge (or not) on phone via the GitHub Mobile app.

### Reverting a change

Each PR is one commit (or a tight contiguous range). To undo after merge:

```bash
git log --grep '^feedback(#' --oneline           # list auto-commits
git revert <sha>                                 # reverse one
git push
```

For multi-commit ranges:

```bash
git revert <first-sha>^..<last-sha>
git push
```

---

## Revision log

High-level log of release-sized change bundles. Per-commit detail lives in `git log`.

| Date | Revision | Summary |
|------|----------|---------|
| 2026-04-23 | r2 — Issues + Projects + Claude auto-routine | Retired `Feedback.md` and the dispatch-based tag system. Moved backlog to GitHub Issues + Project v2. Added `triage.yml` (daily) and `execute.yml` (every 8h) GitHub Actions running Claude Code via Pro subscription OAuth token (no API billing). Phone shortcut now creates issues directly. Playbooks in `scripts/triage-prompt.md` / `execute-prompt.md`; bootstrap in `scripts/bootstrap-kanban.sh`. |
| 2026-04-23 | r1 — Feedback automation *(superseded by r2)* | UTF-8 Feedback.md with phased schema; `append_feedback.yml` via `repository_dispatch`; `triage_feedback.yml` tag-based phasing; Android HTTP Shortcuts setup. |
| 2026-04-22 | r0 — Site build | Next.js 16 + Tailwind v4 scaffold; home, how-we-work, what-we-do hub + 6 service pages, MCQ diagnostic, fractional-hr, about, insights, contact (Cal.com + PIPEDA form); sitemap, robots, OG image, 404, privacy, career-coaching stub. |
