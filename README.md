# Lumivara

This is the website for **Lumivara People Advisory** — Beas Banerjee's HR & people-strategy consulting practice in Toronto. **Live site:** [lumivara-site.vercel.app](https://lumivara-site.vercel.app)

## In plain English

You don't need to know how to code to change this website. You text the site what you want — from your phone, by creating a GitHub Issue — and an AI assistant (Claude) writes the actual code change a few hours later, opens a draft for you to look at, and shows you a preview link. You tap "merge" on your phone if you like it. Within ~90 seconds the live site updates.

That's it. Five steps, mostly happening while your laptop is closed:

1. **Tell it what you want** — phone shortcut → creates a GitHub Issue.
2. **Daily 06:00 UTC** — bot reads new issues, sorts them by urgency.
3. **Every 8 hours** — bot picks the top one, writes the code, opens a pull request.
4. **You review on phone** — the GitHub mobile app shows the diff and a working preview URL.
5. **Tap merge** — the change goes live.

The technical setup is in the next sections, but you can ignore them unless you're working on the bot itself or doing a manual fix.

---

## For developers

**Tech**: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + MDX. Hosted on Vercel.

> **Status:** Live in production. Day-to-day backlog is operated by a Claude-powered GitHub Actions bot — see [How this project is run](#how-this-project-is-run) below.

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

---

## How this project is run

Most days, **nobody touches this code directly**. The flow is:

1. **You capture an idea** — from your phone via the HTTP Shortcuts app ([PHONE_SETUP.md](./PHONE_SETUP.md)) or from a terminal with `gh issue create`. The capture creates a GitHub Issue with `status/needs-triage`.
2. **The triage bot classifies it** — runs daily at 06:00 UTC. Reads new issues, applies `priority/`, `complexity/`, `area/` labels using the rubric in [`scripts/triage-prompt.md`](./scripts/triage-prompt.md), comments its rationale, marks the issue `auto-routine` if it's well-scoped enough for autonomous work (or `human-only` / `status/needs-clarification` if not).
3. **The execute bot ships it** — runs every 8 hours (00:00, 08:00, 16:00 UTC). Picks the top-ranked open `auto-routine` issue, implements on a branch `auto/issue-<n>`, opens a PR with `Fixes #<n>`. Never auto-merges.
4. **Vercel previews it** — Vercel's GitHub integration deploys a preview URL and posts it as a comment on the PR within ~60s of the bot pushing.
5. **You review on phone** — GitHub Mobile shows the diff and the preview URL. Tap merge if happy. Merge to `main` triggers Vercel's production deploy.
6. **Bot updates the issue** — closes it via `Fixes #N`, archives it on the Project board.

Your laptop can be off the entire time. The cron runs in GitHub's cloud; Vercel deploys in Vercel's cloud; you only need a phone with the GitHub app and HTTP Shortcuts.

### When to bypass the bot

Label any issue `human-only` to keep the bot away. Reasons:
- Touches the [exclusion list](scripts/execute-prompt.md#guardrails) (workflows, env vars, contact API endpoint, dependency upgrades, page deletions)
- Needs a design review or screen-share
- You want to do it yourself

### Cost

Bot runs use **your Claude Pro/Max subscription** via the `CLAUDE_CODE_OAUTH_TOKEN` secret — no API billing. Usage shares the same 5-hour rolling window as your interactive Claude Code sessions, so heavy automation can squeeze your interactive budget. Tuning levers in [`docs/BACKLOG.md`](./docs/BACKLOG.md#cost--usage).

For setup details, label taxonomy, and triage/execute rubrics, read [`docs/BACKLOG.md`](./docs/BACKLOG.md).

---

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

Live on **Vercel**, auto-deployed from `main` via Vercel's native GitHub integration:

- **Production**: every push to `main` triggers a production build. (Merging an auto-PR is a push to `main`.)
- **Preview**: every open PR gets a unique preview URL, posted by the Vercel bot as a comment on the PR within ~60s of the push. The bot's auto-PRs get one too — that's how you visually verify the change from your phone before merging.
- **Build settings**: zero config — Vercel autodetects Next.js 16, runs `npm install` then `next build`. No `vercel.json` needed.
- **Environment variables**: keep `.env.local` for local dev only. Anything Vercel needs lives in *Vercel project → Settings → Environment Variables* (per-environment: Production / Preview / Development).

If a Vercel build fails on an auto-PR (typecheck, lint, runtime), the PR comment will reflect that — leave the PR unmerged and either re-comment on the issue with hints or close + recreate with more context.

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
| 2026-04-23 | r3 — End-to-end pipeline live | Vercel GitHub integration enabled (production from `main`, previews per PR). README reframed around the auto-pilot loop ("How this project is run"). Workflows updated with `id-token: write` for the Claude GitHub App OIDC handshake. Initial migrated meta-issues replaced with concrete codable issues so the next scheduled triage/execute produces real PRs + Vercel previews. |
| 2026-04-23 | r2 — Issues + Projects + Claude auto-routine | Retired `Feedback.md` and the dispatch-based tag system. Moved backlog to GitHub Issues + Project v2. Added `triage.yml` (daily) and `execute.yml` (every 8h) GitHub Actions running Claude Code via Pro subscription OAuth token (no API billing). Phone shortcut now creates issues directly. Playbooks in `scripts/triage-prompt.md` / `execute-prompt.md`; bootstrap in `scripts/bootstrap-kanban.sh`. |
| 2026-04-23 | r1 — Feedback automation *(superseded by r2)* | UTF-8 Feedback.md with phased schema; `append_feedback.yml` via `repository_dispatch`; `triage_feedback.yml` tag-based phasing; Android HTTP Shortcuts setup. |
| 2026-04-22 | r0 — Site build | Next.js 16 + Tailwind v4 scaffold; home, how-we-work, what-we-do hub + 6 service pages, MCQ diagnostic, fractional-hr, about, insights, contact (Cal.com + PIPEDA form); sitemap, robots, OG image, 404, privacy, career-coaching stub. |
