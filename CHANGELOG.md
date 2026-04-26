# Changelog

All notable changes to this project are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.3.0] — 2026-04-23

### Added
- Model routing: triage assigns `model/haiku`, `model/sonnet`, or `model/opus` label based on complexity; execute workflows honour that label
- `project-sync.yml` — automatically moves issues between Project v2 Kanban columns on lifecycle events (opened, labeled, PR opened/merged)
- `auto-merge.yml` — enables GitHub's built-in auto-merge for trivial/easy non-design `auto-routine` PRs once Vercel's check passes
- `execute-single.yml` — manual-dispatch workflow to implement a specific issue by number; supports model override
- `execute-complex.yml` — manual-dispatch workflow for complex or `manual-only` issues; accepts issue number and model override inputs
- Session-budget charter in `AGENTS.md` — 50%/80% turn-budget gates to prevent quota overflow across CI and interactive sessions
- `needs-vercel-mirror` label convention for tracking Vercel-side configuration changes that can't be automated

### Changed
- `execute.yml` cadence raised from every 8h to every 4h after AI-routing optimisations reduced per-run cost
- Triage cron changed from daily to hourly; Gemini fallback keeps cost low on quiet days

---

## [0.2.0] — 2026-04-23

### Added
- GitHub Issues + Project v2 Kanban board replace `Feedback.md` as the backlog source of truth
- `triage.yml` — daily GitHub Actions workflow; Claude reads new issues, applies `priority/`, `complexity/`, `area/` labels, comments rationale, gates on `auto-routine` vs `human-only`
- `execute.yml` — every-8h GitHub Actions workflow; Claude picks the top `auto-routine` issue, implements on `auto/issue-<n>` branch, opens a PR (never merges)
- `scripts/triage-prompt.md` — triage rubric and label taxonomy
- `scripts/execute-prompt.md` — execute playbook including hard exclusions, commit format, and failure/ambiguity handling
- `docs/BACKLOG.md` — full backlog map: label taxonomy, Project v2 column layout, issue-writing guide, cost/usage notes
- Phone capture: HTTP Shortcuts → `POST /repos/.../issues` creates issues with `status/needs-triage`
- OIDC handshake via `id-token: write` permission for Claude GitHub App authentication

### Removed
- `Feedback.md` and the dispatch-based `append_feedback.yml` / `triage_feedback.yml` tag system (superseded by Issues pipeline)

---

## [0.1.0] — 2026-04-22

### Added
- Next.js 16 App Router scaffold with TypeScript strict mode
- Tailwind CSS v4 + shadcn/ui on Base UI React
- Design token system: canvas, ink, parchment, accent (amber), muted — light and dark variants
- Pages: home, how-we-work, what-we-do hub + 6 service slugs, MCQ diagnostic, fractional-hr, about, insights index + MDX article routing, contact (Cal.com + PIPEDA form), privacy, career-coaching stub, 404
- MDX pipeline via `@next/mdx` with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`
- Self-hosted fonts: Fraunces (display), Inter (body), JetBrains Mono (labels) via `next/font/google`
- Sitemap, robots.txt, OG image generation, canonical URLs
- Contact form: React Hook Form + Zod validation; Resend for email delivery
- Cal.com booking integration on CTA elements
- Vercel deployment: production from `main`, preview per PR via native GitHub integration

[Unreleased]: https://github.com/palimkarakshay/lumivara-site/compare/HEAD...HEAD
[0.3.0]: https://github.com/palimkarakshay/lumivara-site/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/palimkarakshay/lumivara-site/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/palimkarakshay/lumivara-site/releases/tag/v0.1.0
