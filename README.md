# Lumivara

**Lumivara People Advisory** — Beas Banerjee's HR & people-strategy consulting practice in Toronto. **Live site:** [lumivara-site.vercel.app](https://lumivara-site.vercel.app)

---

## Operator vs client framing

This repo is currently **Client #1's site** (Lumivara People Advisory) and is *also* the laboratory in which the operator framework — **Lumivara Forge** — is being built. After the P5.6 spinout (see `docs/migrations/lumivara-people-advisory-spinout.md`), this repo's `main` becomes purely client-facing and the autopilot relocates to a separate operator-only repo. Until then, the README intentionally names the client because the repo is operationally the client's own; the formal terminology policy that keeps operator docs neutral is in [`docs/mothership/15-terminology-and-brand.md §6`](./docs/mothership/15-terminology-and-brand.md), with the appendix of legitimate client examples in §7.

---

## 1. What this is

A marketing and advisory site for Lumivara People Advisory, built with:

- **Next.js 16** (App Router, React Server Components)
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **shadcn/ui** on Base UI React
- **MDX** for insights articles

Day-to-day changes are driven by a Claude-powered GitHub Actions bot. You describe what you want in a GitHub Issue (from your phone or desktop); the bot implements it, opens a PR with a Vercel preview, and you merge from your phone.

---

## 2. Quick start

Requires **Node.js 20+**.

```bash
git clone https://github.com/palimkarakshay/lumivara-site.git
cd lumivara-site
npm install
cp .env.local.example .env.local   # safe defaults — works offline
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | TypeScript check |

---

## 3. Architecture

### App Router structure

```
src/
  app/
    page.tsx                  # Home
    about/page.tsx
    how-we-work/page.tsx
    what-we-do/
      page.tsx                # Services hub
      [slug]/page.tsx         # Individual service pages
    insights/
      page.tsx                # Article index
      [slug]/page.tsx         # Individual MDX articles
    fractional-hr/page.tsx
    career-coaching/page.tsx
    contact/page.tsx
    privacy/page.tsx
    api/contact/              # Contact form endpoint (human-only)
    globals.css
    layout.tsx
  components/                 # Shared UI components
  content/                    # All editable copy (see below)
  lib/
    site-config.ts            # Site-wide settings (tagline, email, Cal.com link)
```

### Content files

All page copy lives in `src/content/` — one file per page. Edit the strings there; no component changes needed.

| File | Page |
|---|---|
| `src/content/home.ts` | Homepage |
| `src/content/about.ts` | About |
| `src/content/how-we-work.ts` | How We Work |
| `src/content/services.ts` | What We Do + all 6 service slugs |
| `src/content/contact.ts` | Contact |
| `src/content/faqs.ts` | FAQ data |
| `src/content/diagnostic.ts` | MCQ diagnostic |

### MDX insights articles

Articles are MDX files in `src/content/insights/`. Add a new `.mdx` file to publish — no further wiring needed.

Required frontmatter:

```yaml
---
title: "Article title"
excerpt: "One-sentence summary"
category: "perspective"   # or: practice, qa
date: "2026-04-26"
readingTime: "5 min"
---
```

### Site-wide settings

Tagline, contact email, phone, navigation labels, Cal.com link: `src/lib/site-config.ts`.

---

## 4. Design system

### Colour tokens

| Token | Light | Dark |
|---|---|---|
| `canvas` | `#F7F4ED` | `#0E1116` |
| `ink` | `#0E1116` | `#F7F4ED` |
| `parchment` | `#EFEAE0` | `#1F2430` |
| `accent` (amber) | `#C8912E` | `#E0B160` |
| `muted` | `#6B7280` | `#9CA3AF` |

Full token set: `src/app/globals.css`.

### Tailwind utilities

`bg-canvas`, `bg-ink`, `bg-parchment`, `text-ink`, `text-ink-soft`, `text-accent`, `text-accent-deep`, `border-border-subtle`.

Type scale: `text-display-xl` → `text-caption`, `text-label` (mono uppercase micro-labels).

### Component library

Components live in `src/components/`. shadcn/ui components were generated via `npx shadcn@latest add <component>` — see `components.json` for the current registry.

---

## 5. Backlog

Change requests live in **GitHub Issues**, organised on a **Project v2 Kanban board**, and implemented by scheduled GitHub Actions.

Full map: [`docs/BACKLOG.md`](./docs/BACKLOG.md).

### How to create an issue

From your desk:
```bash
gh issue create --title "Short description" --body "Full details"
```

From your phone: sign in to `/admin` (Auth.js v5 magic link / Google / Entra) and use the capture form. Email and SMS lanes route through n8n. See [`docs/ADMIN_PORTAL_PLAN.md`](./docs/ADMIN_PORTAL_PLAN.md) and [`docs/N8N_SETUP.md`](./docs/N8N_SETUP.md). The previous HTTP Shortcuts / phone-PAT path is **deprecated** — see [PHONE_SETUP.md](./PHONE_SETUP.md) for the deprecation notice.

### Lifecycle

1. New issue lands with `status/needs-triage`.
2. **Triage bot** reads it, applies `priority/`, `complexity/`, `area/`, `model/` labels, and marks it `auto-routine` (bot-safe) or `human-only`. Runs every hour.
3. **Execute bot** picks the top-ranked `auto-routine` issue, implements on a branch `auto/issue-<n>`, opens a PR. Never merges. Runs every 4 hours.
4. Vercel posts a preview URL on the PR within ~60s.
5. You review on **GitHub Mobile** — merge if happy. Merge triggers a production deploy.

### Reverting a change

```bash
git log --grep '^feedback(#' --oneline   # list auto-commits
git revert <sha>                          # reverse one commit
git push
```

---

## 6. Automated workflows

| Workflow | File | Trigger | What it does |
|---|---|---|---|
| Triage | `triage.yml` | Hourly cron + issue opened | Classifies new issues with priority/complexity/area/model labels; marks `auto-routine` or `human-only` |
| Execute | `execute.yml` | Every 4h cron + manual | Picks top `auto-routine` issue, implements on branch, opens PR |
| Execute (complex) | `execute-complex.yml` | Manual dispatch | Same as execute but for `manual-only` / complex issues; accepts optional model override |
| Execute (single) | `execute-single.yml` | Manual dispatch | Implements a specific issue by number; useful for re-runs or targeted fixes |
| Auto-merge | `auto-merge.yml` | PR opened/labeled | Enables GitHub's auto-merge for trivial/easy non-design PRs once Vercel check passes |
| Project sync | `project-sync.yml` | Issue/PR events | Moves issues between Project v2 Kanban columns (Inbox → Triaged → In Progress → Review → Done) |
| AI smoke test | `ai-smoke-test.yml` | Weekly (Mon 12:00 UTC) + manual | Verifies each AI backend responds end-to-end; posts results to issue #39 |

> **Hard rule:** Never edit `.github/workflows/` files via a bot-executed PR unless the issue carries the `infra-allowed` label.

---

## 7. Mobile capture

> ⚠️ **Deprecated-doc policy.** The previous phone-PAT + HTTP Shortcuts /
> Apple Shortcuts mechanism in [`PHONE_SETUP.md`](./PHONE_SETUP.md) is
> retained as a deprecation notice only — **do not follow its setup
> steps**. Canonical replacements:
>
> - [`docs/N8N_SETUP.md`](./docs/N8N_SETUP.md) — n8n on Railway, webhook + AI structuring workflows.
> - [`docs/ADMIN_PORTAL_PLAN.md`](./docs/ADMIN_PORTAL_PLAN.md) — `/admin` portal, Auth.js v5, three-channel intake, env vars.
> - [`docs/TEMPLATE_REBUILD_PROMPT.md`](./docs/TEMPLATE_REBUILD_PROMPT.md) §1.4 — full v1→v2 migration matrix (security impact + operator actions).
> - [`docs/wiki/Bot-Workflow.md`](./docs/wiki/Bot-Workflow.md) — end-to-end pipeline view.

The current capture surface is the `/admin` portal (web form, magic-link
sign-in via Resend / Google / Microsoft Entra), with email and SMS
fallbacks routed through n8n. No client device — and no operator phone
— holds a GitHub PAT. See [`docs/ADMIN_PORTAL_PLAN.md`](./docs/ADMIN_PORTAL_PLAN.md)
Phase 2 for the implementation plan.

---

## 8. Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_CAL_LINK` | No | `https://cal.com/lumivara/discovery` | Cal.com booking URL shown on CTAs and contact page |
| `NEXT_PUBLIC_SITE_URL` | No | `http://localhost:3000` | Canonical base URL — used for OG images, sitemap, canonical tags |
| `RESEND_API_KEY` | No (local) | *(empty)* | Resend API key for contact form email delivery — required in production |
| `CONTACT_EMAIL` | No | `hello@lumivara.ca` | Destination address for contact form submissions |

**Local dev:** copy `.env.local.example` to `.env.local`. All defaults work offline.

**Production (Vercel):** set each variable under *Project → Settings → Environment Variables*. `RESEND_API_KEY` and `CONTACT_EMAIL` must be set for the contact form to deliver mail in production.

---

## Deployment

Hosted on **Vercel**, auto-deployed from `main`:

- **Production**: every push to `main` triggers a production build (merging a bot PR = push to `main`).
- **Preview**: every open PR gets a unique preview URL posted as a PR comment within ~60s.
- **Build settings**: zero config — Vercel autodetects Next.js 16.

If a Vercel build fails on a bot PR, leave it unmerged and re-comment on the issue with additional context.

---

## Cost

Bot runs use the operator's **Claude Max 20x subscription** via `CLAUDE_CODE_OAUTH_TOKEN` — no API billing. Usage shares the same 5-hour rolling window as interactive Claude sessions, with ~20× the headroom of the Pro tier. The current phase prioritises quality (Opus everywhere) over throughput; cost optimisation is a later milestone. See [`docs/BACKLOG.md`](./docs/BACKLOG.md) for tuning levers and [`AGENTS.md`](./AGENTS.md) for the active session charter.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
