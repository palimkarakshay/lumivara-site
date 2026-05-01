<!-- OPERATOR-ONLY. Pivot plan + archive list — the prescriptive companion
     to docs/research/08-self-maintaining-website-negative-study.md. -->

# 09 — Pivot Plan and Archive List

> _Lane: 🛠 Pipeline — operator-scope prescriptive plan. Companion to
> [`08-self-maintaining-website-negative-study.md`](./08-self-maintaining-website-negative-study.md)
> (the diagnosis). This file is the **prescription**: which pivot, how to
> sequence it, and which specific files / folders / workflows to archive
> vs. keep on the way through. Read 08 first._
>
> _Audience: the operator, on a Monday morning, after deciding to pivot.
> Read once. Do not share. Do not paraphrase outside this repo._

---

## How to read this document

`08` settled the question *"is the offer as positioned a business?"*
negatively. This file picks up the next question: *"given that, what
exactly do we do this week, this month, and this quarter?"*

Structure:

1. **Why this exists** — the one-paragraph framing.
2. **Pivot evaluation matrix** — nine candidate pivots scored on
   effort, 12-month revenue band, ergonomics fit, defensibility, and
   compatibility with the existing portfolio site.
3. **The recommended pivot** — the chosen path, defended.
4. **90-day plan** — week-by-week execution.
5. **Archive list** — file-by-file, folder-by-folder. What to delete,
   freeze, or move to `_deprecated/`.
6. **Keep list** — what survives unmodified into the pivot.
7. **Risks of the pivot itself** — what would make this plan wrong.
8. **Un-archive criteria** — under what specific conditions does the
   archived work become live again.
9. **§7 / §8.4 enhancements back to `08`** — the additional alternatives
   and stress-tests this work surfaces, fed back into the diagnosis.
10. **Bibliography and methodology** — the three parallel agent passes
    that informed this plan.

Each pivot in §2 ends with a **fit score** (1–10 where 10 = best fit
for the operator and the moment).

---

## §1 — Why this document exists

The diagnosis in `08` lands a 7.5–9.5 / 10 liability score across six
sections. The salvage path in `08 §7` is real but narrow: *"sell
one-time custom Next.js builds at CAD $4,500–$6,000 + optional
$79–$149/mo improvement-run."* That is **one** salvage path among
several plausible ones, and the 90-day cost of choosing the wrong
salvage path is roughly equivalent to the 90-day cost of running the
original thesis another quarter. So before the operator commits to
the §7 path, this document evaluates **eight more** that the original
critique under-considered, picks the highest-fit pivot, sequences it
across 12 weeks, and itemises which of the ~23,000 lines of operator
docs and 31 GitHub Actions workflows survive the pivot — and which do
not.

Three independent agents informed the work below: a comparable-pivot
case-study pass (productized-service operators who pivoted off similar
over-engineered theses), a repo-inventory pass (file-by-file archive
classification), and a §7 / §8.4 stress-test pass (alternative salvage
paths and black-swan reversal levers). Their findings are integrated
section-by-section and listed in §10.

---

## §2 — Pivot evaluation matrix

Nine candidate pivot directions. Scored on five axes, then a single
**fit score** (1–10 where 10 = best fit for this specific operator at
this specific moment). Operator profile assumed in the scoring: one
senior engineer in Toronto, 10+ yr enterprise software background,
strong Next.js + AI integration + GitHub Actions + DevOps depth, async
preference, dislikes meetings, has a real portfolio site already
shipping, does not yet have arms-length paying clients, has a Claude
Max 20x quota and the platform built around it.

### Axis definitions

- **Effort-to-start** (E): how much work to first dollar. Lower is
  better. Reported as weeks.
- **12-month revenue band** (R): defensible 12-month CAD revenue range
  if executed competently.
- **Ergonomics** (G): how well the offer maps to async, low-meeting,
  low-customer-management work.
- **Defensibility** (D): how well the offer survives the same 2026
  commoditisation wave that killed the original thesis.
- **Portfolio-compat** (P): how well the offer leverages the existing
  `lumivara-forge.com` portfolio site as a calling card.

### The matrix

| # | Pivot | E (wks) | R (CAD/yr) | G | D | P | **Fit / 10** |
|---|---|---:|---|---:|---:|---:|---:|
| **A** | Stage-1 freelance build practice (the `08 §7` baseline — one-time CAD $4,500–$6,000 builds + optional improvement-run subscription) | 2–3 | $40–$90k | 7 | 6 | 9 | **7.0** |
| **B** | Senior full-stack + AI-integration **freelance via Toptal / A.Team / Arc / direct** at day-rate (sell hours, not products) | 1–2 | $120–$240k | 8 | 8 | 5 | **8.5** |
| **C** | **AI-integration / AI-Ops consulting** for digital agencies, mid-market companies, and Canadian government / regulated sectors that want to ship AI features themselves but lack the engineering depth | 3–4 | $90–$220k | 9 | 9 | 6 | **8.5** |
| **D** | **Niche-vertical productized service** (one vertical only — dental OR legal OR real-estate OR accounting) at $1,500–$3,000 setup + $99–$199/mo, narrowed scope, sharp ICP | 6–10 | $30–$80k | 6 | 6 | 7 | **6.0** |
| **E** | **Improvement-as-a-Service for existing sites** — pure remediation work (AODA / WCAG, Core Web Vitals, performance, security headers, contact-form/spam hardening). No new builds. Sold per-engagement at CAD $1,500–$5,000 each. | 2 | $50–$130k | 8 | 7 | 6 | **7.5** |
| **F** | **Developer-targeted Next.js + AI-pipeline boilerplate** (a paid template à la shipfa.st / Makerkit / supastarter) sold for one-time USD $199–$499 to other developers / agencies, plus optional support contracts | 4–6 | $20–$80k | 8 | 5 | 4 | **5.5** |
| **G** | **Micro-SaaS spin-offs** of pieces that already work (admin-portal-as-a-service, llm-monitor as a tiny SaaS, the Marp / claude-design deck pipeline as a service, the doc-task-seeder, etc.) at $9–$49/mo each | 6–12 | $0–$30k yr-1 | 7 | 5 | 3 | **4.5** |
| **H** | **Fractional principal / staff engineer** at 1–2 SMBs or one mid-market company on a 1–2 day/week retainer (CAD $1,200–$2,500/day) | 3–4 | $80–$180k | 9 | 8 | 5 | **8.0** |
| **I** | **Full pause** — take a senior platform / staff engineering role at a Canadian or remote-friendly US company; restart ambition in 12–24 months | 4–8 (job hunt) | $180–$320k base + equity | 10 | 10 | 4 | **9.0** |
| **J** | **HR-services-for-Canadian-SMB partnership** — partner with a complementary services practitioner (HR consulting, employee-handbooks, Canadian-employment-law, payroll-implementation) who has the same SMB persona; operator delivers the digital surface, partner delivers the HR product, jointly retain on a per-client basis | 6–10 | $30–$120k yr-1 | 6 | 7 | 8 | **6.5** |
| **K** | **Hybrid: I + A** — primary income from a senior engineering role; small Stage-1 build practice on the side, deliberately rate-limited to 1 build / quarter | 6–10 (job hunt + tooling) | $200–$370k combined | 9 | 9 | 7 | **9.5** |

### Reading of the matrix

The two-column standouts are **K** (hybrid: day-job + side practice)
at 9.5, and **I** (full pause) at 9.0. Both move the operator off the
single-point-of-failure model in `08 §5.3` and **buy time** to test
whether any of B / C / E / J develops genuine traction without putting
the rent at risk. **B** and **C** at 8.5 are the strongest "pure
pivot" plays if the operator is unwilling to take a day job.

The original `08 §7` recommendation (path A) scores 7.0 — *real,
defensible, but **not** the best available option* once B/C/E/H/I/K
are properly scored. The diagnostic doc was right to flag A as
salvageable; this doc is more honest in noting that A is *the
operator's most familiar* option, not the best-fit one.

The pivots that score worst (F at 5.5, G at 4.5) are the ones that
**re-use the most platform code** — and that is the warning: the
desire to keep the platform alive correlates inversely with the
quality of the pivot. The platform investment is mostly sunk cost;
choosing a pivot to justify it is the documentation hobby's last
gambit.

---

## §5 — Archive list (file-by-file)

The repo today is approximately **23,000 lines of operator docs**,
**31 GitHub Actions workflows (~5,900 lines)**, **27 operator scripts**,
a separate **dashboard SPA (~1,500 lines)**, **n8n workflow JSON**, and
the actual **Next.js marketing site (~15,600 lines)**. The independent
inventory agent classified every meaningful path into one of twelve
buckets. The buckets that **archive** are below; the buckets that
**keep** are in §6.

> _Mechanism: archive = move into `docs/_archive/<YYYY-MM-DD>-<bucket>/`
> with the original path preserved underneath, plus a top-level
> `README.md` per archive folder summarising why it was archived.
> "Delete" is reserved for the explicit `D-DELETE-OK` rows. No
> destructive action is irreversible — `git revert` recovers
> everything._

### §5.1 Archive bucket totals

| Bucket | Files (≈) | Lines (≈) | Description |
|---|---:|---:|---|
| **A-DECKS** | 30 | 5,600 | All stakeholder decks (investor, partner, employee, advisor, master, shareable, master companion) plus six per-vertical pitch decks plus `CRITICAL-REVIEW.md` and `CRITICAL-REVIEW-MITIGATIONS.md`. |
| **A-PLATFORM-OVER** | ~60 | 9,000 | Multi-AI fallback ladder, plan-then-execute, codex-review, llm-monitor, recording pipeline, scripts/lib/, scripts/llm-monitor/, scripts/record-ingest/, dashboard SPA helpers. |
| **A-DASHBOARD** | 1 dir | 1,482 | The full operator `dashboard/` SPA. Beautiful engineering; not load-bearing for any §2 pivot. |
| **A-OPS** | 12 | 2,750 | `docs/ops/` — operator playbooks that assume the autopilot product. Rewrite under the §3 pivot. |
| **A-RESEARCH-PRO** | 7 | 2,100 | `docs/research/01–07` — pro-thesis market research, personas, switch reasons. Kept as historical record; **08 (the negative study) is the active reference**. |
| **A-WORKFLOWS** | 31 | 5,900 | All `.github/workflows/*.yml` tied to autopilot architecture (triage, execute, plan, codex-review, deep-research, ai-smoke-test, dual-lane-watcher, forge-*, render-decks, deploy-dashboard, llm-monitor*, record-ingest-smoke). |
| **A-N8N** | 7 | 643 | `docs/n8n-workflows/` — admin-portal automation hub JSONs. |
| **A-MIGRATIONS** | 5 | 2,315 | Phase plans (00-automation-readiness, 01-poc-perfection, lumivara-people-advisory-spinout, _artifact-allow-deny). Gates on the dead thesis. |
| **D-DELETE-OK** | ~5 | ~200 | `docs/_deprecated/`, build artifacts, untracked files. |

**Totals:** approximately **70,000 lines** archived against approximately
**18,000 lines** kept. The salvage ratio (15–20% by volume) matches
`08 §7.2`'s qualitative read.

### §5.2 Top 10 single largest paths archived

1. `docs/mothership/` (33 files, ~7,400 lines)
2. `.github/workflows/` (31 files, ~5,900 lines)
3. `docs/decks/` + `docs/decks/vertical-pitches/` (29 files, ~5,600 lines)
4. `docs/storefront/` (14 files, ~3,585 lines)
5. `scripts/llm-monitor/` (~2,600 lines)
6. `docs/migrations/` (5 files, ~2,300 lines)
7. `docs/research/01-07` + `docs/research/raw/` (~2,100 lines)
8. `docs/ops/` (12 files, ~2,750 lines)
9. `dashboard/` SPA (~1,482 lines)
10. `scripts/record-ingest/` + `scripts/codex-*.py` (~2,300 lines)

### §5.3 Archive table — A-DECKS (30 files, ~5,600 lines)

| Path | Lines | Risk if archived | Note |
|---|---:|---|---|
| `docs/decks/01-investor-deck.md` | 230 | High | Frozen narrative; reuses dead unit econ. Keep as historical. |
| `docs/decks/02-partner-deck.md` | 216 | High | No partner exists. Speculative artefact. |
| `docs/decks/03-employee-deck.md` | 202 | High | No employee will be hired in 12 months. |
| `docs/decks/04-prospective-client-deck.md` | 287 | High | The product the deck describes has been killed by `08`. |
| `docs/decks/05-advisor-deck.md` | 219 | High | Advisor's "won't sell" verdict has now been formally accepted. |
| `docs/decks/06-master-deck.md` | 980 | High | Synthesis deck. Superseded. |
| `docs/decks/06a-master-deck-shareable.md` | 934 | High | Public-safe variant of 06. Superseded. |
| `docs/decks/vertical-pitches/{accountants,dentists,doctors,lawyers,optometry,physiotherapy}.md` (×6) | ~2,000 | High | Six near-duplicate vertical pitches. |
| `docs/decks/vertical-pitches/*.html` (×6) | (rendered) | Low | Marp renders; archived with their .md sources. |
| `docs/decks/CRITICAL-REVIEW.md` | 340 | **Keep as historical** | Self-critique that motivates the pivot. Not deleted; moved with the rest of the deck pack. |
| `docs/decks/CRITICAL-REVIEW-MITIGATIONS.md` | 602 | **Keep as historical** | Counter-plan to the critique. Some §13 swap recommendations remain useful — re-read before archiving the file outright. |
| `docs/decks/00-INDEX.md` | 94 | Medium | Replace with a 1-line redirect to the archive folder. |
| `docs/decks/*.html` (rendered top-level decks) | — | Low | Move with .md sources. |

### §5.4 Archive table — A-PLATFORM-OVER (~60 files, ~9,000 lines)

| Path | Lines | Note |
|---|---:|---|
| `scripts/llm-monitor/` (full subdir + collectors) | ~2,600 | Continuous LLM market monitoring. Defer. |
| `scripts/record-ingest/` (full subdir) | ~1,100 | Operator recording pipeline. Defer. |
| `scripts/codex-{triage,plan-review,review-fallback,fix-classify}.py` | ~1,200 | Multi-AI fallback ladder. Single Anthropic API is sufficient post-pivot. |
| `scripts/gemini-triage.py` | ~150 | Same. |
| `scripts/plan-issue.py` | 400 | Plan-then-Execute discipline. Internal only. Defer. |
| `scripts/bot-usage-report.py` | 150 | API-spend tracking. Defer. |
| `scripts/backlog-digest.py` | ~200 | Operator backlog summariser. Defer. |
| `scripts/doc-task-seeder.py` + `scripts/test-doc-task-seeder.py` | ~300 | Issue-from-doc seeder. Defer. |
| `scripts/recheck-missed-reviews.py` | 150 | Defer. |
| `scripts/seed-codex-review-backlog.py` | 150 | Defer. |
| `scripts/test-{routing,forge-routing}.py` | ~250 | Multi-AI routing tests. Defer. |
| `scripts/issues/` (issue templates) | ~200 | Operator issue templates. Defer. |
| `scripts/lib/` (routing.py + helpers) | ~400 | Multi-AI routing library. Defer. |
| `scripts/{triage-prompt,execute-prompt,forge-triage-prompt,forge-execute-prompt}.md` | ~1,400 | All triage/execute system prompts. Archive verbatim — they are the operator's prompt-engineering record. |
| `src/lib/admin/` (excl. vercel.ts and basic auth) | ~300 | Auth.js portal RBAC, GitHub webhooks, n8n bridge. Over-engineered for a one-client offer. |
| `src/lib/dashboard/` | ~150 | Helpers for the dashboard SPA. Defer with dashboard. |
| `src/components/admin/` | ~400 | Admin-portal-only components. Survive only if §3 keeps the admin portal — see §6. |

### §5.5 Archive table — A-WORKFLOWS (31 files, ~5,900 lines)

All workflows under `.github/workflows/` archive as a folder. Specific
actions on selected files:

| Workflow | Action | Note |
|---|---|---|
| `triage.yml`, `forge-triage.yml` | **Disable + archive** | Schedule-driven. Delete the cron block immediately or it will keep running on the autopilot's old cadence. |
| `execute.yml`, `execute-{single,multi,complex,fallback}.yml`, `forge-execute.yml` | **Disable + archive** | Same. The execute legs are the loudest part of the autopilot pipeline. |
| `plan-issues.yml` | **Disable + archive** | Plan-then-Execute. Internal. |
| `codex-review.yml`, `codex-review-{backlog,recheck}.yml`, `codex-pr-fix.yml` | **Disable + archive** | Multi-AI second-opinion gate. Single Anthropic API is sufficient. |
| `deep-research.yml` | **Disable + archive** | Gemini async research agent. |
| `ai-smoke-test.yml`, `forge-smoke-test.yml`, `seeder-smoke-test.yml` | **Disable + archive** | Smoke tests for the pipeline's existence. Pipeline is leaving. |
| `dual-lane-watcher.yml` | **Delete** | Daily audit of dual-lane contamination. Architecture being abandoned per §3. |
| `auto-merge.yml` | **Keep with caveats** — see §6 | Useful for trivial PRs on the kept Site lane; review the rules before keeping. |
| `backlog-{harvest,digest}.yml`, `bot-usage-monitor.yml`, `doc-task-seeder.yml`, `project-sync.yml`, `setup-cli.yml`, `deploy-drift-watcher.yml` | **Disable + archive** | Operator infrastructure. Defer. |
| `llm-monitor.yml`, `llm-monitor-watch.yml` | **Disable + archive** | Continuous LLM-news monitor. Useful again only if a future pivot needs it. |
| `record-ingest-smoke.yml` | **Disable + archive** | Recording pipeline test. |
| `render-decks.yml` | **Disable + archive** | Marp deck-render automation. Decks are archived. |
| `deploy-dashboard.yml` | **Disable + archive** | Dashboard SPA deploy. Dashboard is archived. |

### §5.6 Archive table — A-OPS, A-RESEARCH-PRO, A-N8N, A-MIGRATIONS

| Path | Lines | Bucket | Action |
|---|---:|---|---|
| `docs/ops/{operator-playbook,audit-runbook,automation-future-work,automation-map,codex-fix-classify-fixtures,doc-task-seeder,gemini-deep-audit,github-project-layout,platform-baseline,progress-tracker,variable-registry}.md` + `README.md` | 2,750 | A-OPS | Move to `docs/_archive/2026-05-01-ops/`. |
| `docs/research/01-validated-market-and-technical-viability.md` | 96 | A-RESEARCH-PRO | Keep as historical; archived bucket. |
| `docs/research/02-deck-validation-through-research.md` | 109 | A-RESEARCH-PRO | Same. |
| `docs/research/03-source-bibliography.md` | 120 | A-RESEARCH-PRO | Same. Useful as bibliography template. |
| `docs/research/04-client-personas.md` | 127 | A-RESEARCH-PRO | Same. |
| `docs/research/05-reasons-to-switch-to-lumivara-forge.md` | 108 | A-RESEARCH-PRO | Same. |
| `docs/research/06-drawbacks-and-honest-risks.md` | 151 | A-RESEARCH-PRO | Keep — risk register structure is reusable as a template. Move to `docs/_archive/...` but copy the structure into a new shorter Stage-1 risk doc. |
| `docs/research/07-pipeda-breach-notification.md` | 121 | A-RESEARCH-PRO | Keep — PIPEDA reference still applies regardless of pivot. Move to `docs/legal-reference/` instead of `_archive/`. |
| `docs/research/raw/*.md` | ~1,100 | A-RESEARCH-PRO | Two raw Gemini deep-research outputs. Historical record. |
| `docs/n8n-workflows/admin-portal/*.json` | 643 | A-N8N | n8n JSON exports. Archive verbatim. |
| `docs/migrations/00-automation-readiness-plan.md` | 894 | A-MIGRATIONS | Phase 1–6 plan that gates on autopilot revenue. Dead. |
| `docs/migrations/01-poc-perfection-plan.md` | 808 | A-MIGRATIONS | The "10/10 streak" gate. Already softened in `CRITICAL-REVIEW.md §7`. Archive. |
| `docs/migrations/lumivara-people-advisory-spinout.md` | 412 | A-MIGRATIONS | Spinout runbook. Useful template; keep as historical. |
| `docs/migrations/_artifact-allow-deny.md` | 157 | A-MIGRATIONS | Spinout allow-list. Obsolete. |
| `docs/migrations/README.md` | 44 | A-MIGRATIONS | Index. |

### §5.7 Storefront — A-PLATFORM-OVER mix

The entire `docs/storefront/` folder (14 files, ~3,585 lines) sells the
autopilot product. Under any §2 pivot it must be **rewritten, not
archived in place** — the operator's go-to-market needs different copy
post-pivot. Action:

- **Move all of `docs/storefront/` to `docs/_archive/2026-05-01-storefront/`.**
- **Create a new short `docs/storefront-stage1/` folder** with a
  one-page gig profile, a 1-page pricing card, and a 1-page case study
  template. ~300 lines total. The §3 recommended pivot drives the
  exact copy.
- The `04-slide-deck.md`, `06-positioning-slide-deck.md`,
  `06-product-strategy-deck.md`, `07-marketing-strategy.md` files all
  carry the autopilot framing — none should be reused verbatim.

### §5.8 Top-of-repo — keep with transforms

The dual-lane manifest, the lane banners, and the spinout machinery
become moot the moment the operator picks a §2 pivot that does not
require two repos. Action:

| Path | Action |
|---|---|
| `.dual-lane.yml` | **Keep until §3 pivot decision is final;** then delete from the active repo and copy as historical to `docs/_archive/`. |
| `.github/workflows/dual-lane-watcher.yml` | **Delete** the day the pivot decision is committed. |
| `scripts/dual-lane-audit.sh` | **Delete** with the watcher. |
| `scripts/forge-spinout-dry-run.sh` | **Delete** when the spinout is either completed or formally cancelled. |
| `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md` | **Keep with transforms** — strip the Pipeline-lane references; rewrite the agent-charter to assume a single-purpose repo. |
| `package.json`, `tsconfig.json`, `vercel.json`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.mjs`, `postcss.config.mjs` | **Keep verbatim.** Build configuration. |

### §5.9 The contamination row — `src/app/lumivara-infotech/`

The inventory pass surfaced one row that requires immediate operator
attention regardless of which §2 pivot is picked: **`src/app/lumivara-infotech/`
(~372 lines including content) is the operator's own Fiverr-style pitch
embedded inside the client repo.** Per `AGENTS.md` § Dual-Lane the
operator's promotional content must not live on a Site-lane file
without the `infra-allowed` label. Until resolved, every dual-lane
audit fails.

| Action option | Effort | Recommended |
|---|---|---|
| **Delete** the route + content from this repo | 30 min | ✓ if pivot is A / B / C / E / H / I — the operator's pitch lives elsewhere (LinkedIn, lumivara-forge.com hosted separately) |
| **Move** to a separate `lumivara-forge.com` Vercel project | 2–4 hours | ✓ if pivot is K (hybrid) and the operator wants to keep a public storefront |
| **Rename + relocate** to `/forge` path with the `infra-allowed` carve-out | 1–2 hours | Only if operator is explicit they want this in the client repo (not recommended) |

**Default recommendation: delete.** The operator's calling card is
better served by a dedicated, single-purpose marketing site that does
not pollute the client repo.

---

## §6 — Keep list (file-by-file)

What survives any of the §2 pivots A–K, listed by bucket.

### §6.1 K-SITE-CORE (~15,600 lines) — the actual marketing site

| Path | Why it stays |
|---|---|
| `src/app/{about,contact,fractional-hr,career-coaching,how-we-work,what-we-do,insights,privacy}/page.tsx` plus the dynamic `[slug]/page.tsx` for services and insights | The actual deliverable. Routes, layouts, RSC patterns. |
| `src/app/page.tsx`, `src/app/layout.tsx` | Root layout + home page. |
| `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, `src/app/llms.txt`, `src/app/not-found.tsx`, `src/app/favicon.ico` | SEO + metadata. |
| `src/app/globals.css` | Tailwind v4 layer + design tokens. The design system. |
| `src/components/sections/`, `src/components/ui/`, `src/components/primitives/`, `src/components/layout/` | shadcn/ui + custom sections. The visual craft. |
| `src/content/{home,about,how-we-work,contact,site,services,partnership-process,faqs,fractional-hr,diagnostic}.ts` and `src/content/insights/*.mdx` | Page copy and insights articles. The single source of truth for non-code content. **Keep `lumivara-infotech.ts` only if §5.9 contamination is resolved by relocating, not deleting.** |
| `src/lib/{site-config,mdx,utils,themes,admin-allowlist}.ts` | Infrastructure for site rendering. |
| `src/hooks/` | Custom React hooks. |
| `src/__tests__/` (~950 lines) | Vitest specs. |
| `e2e/` | Playwright smoke tests. Keep. |
| `mdx-components.tsx` | Global MDX component overrides. |
| `public/`, `assets/` | Static assets. |
| `next.config.ts`, `vercel.json`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`, `components.json`, `package.json` | Build + tooling config. |
| `404.html`, `index.html` | Static fallbacks. |

### §6.2 K-PLATFORM-MINIMAL (~1,800 lines) — the platform that survives

| Path | Why it stays |
|---|---|
| `src/app/api/contact/` | Resend-backed contact-form handler. Trust boundary; small; necessary for any pivot. |
| `src/lib/admin/vercel.ts` (only) | Read-deployment-status helper. Useful operator tool; ~150 lines. |
| `src/content/insights/*.mdx` | Operator's content marketing surface. Drives §3 (whichever pivot). |
| `.github/workflows/` site-deploy on `main` (auto via Vercel `ignoreCommand`) | Implicit; Vercel handles it. No file change needed. |
| `.github/workflows/auto-merge.yml` | **Optional keep** — useful for trivial Site-lane PRs (lockfile bumps, prettier). Audit the rules first. If the pivot is I (full pause), delete. |

### §6.3 K-OPERATOR-CRAFT (~450 lines) — operator thinking that survives

| Path | Why it stays |
|---|---|
| `docs/00-INDEX.md` | Repo orientation. **Trim heavily** — strip every reference to dual-lane, Pipeline lane, Mothership, Forge, vertical pitches. ~30 lines after trim. |
| `docs/mothership/15-terminology-and-brand.md` | Operator brand thinking. **Trim** to a brand-positioning page; remove the "what we sell" sections that name the autopilot. |
| `docs/mothership/15c-brand-and-domain-decision.md` | Domain ADR. Reusable across pivots. Keep verbatim. |
| `docs/research/08-self-maintaining-website-negative-study.md` | The pivot decision document. **Active reference.** |
| `docs/research/09-pivot-plan-and-archive-list.md` (this file) | Operational plan. **Active reference until pivot complete, then archived to `_archive/`.** |
| `docs/ops/progress-tracker.md` | Milestone template. Reusable. **Trim** content to a generic template. |
| `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `LICENSE` | Hygiene files. Strip Pipeline-lane sections. |

### §6.4 The "definitely kept" minimum-viable shape

After archive, the active repo contains:

```
.
├── src/                    (~15,600 lines — the marketing site)
├── e2e/                    (~131 lines)
├── public/, assets/        (static)
├── docs/
│   ├── 00-INDEX.md         (~30 lines — trimmed)
│   ├── research/
│   │   ├── 08-self-maintaining-website-negative-study.md
│   │   └── 09-pivot-plan-and-archive-list.md  (this file)
│   ├── _archive/2026-05-01-{decks,ops,research-pro,migrations,storefront,workflows,platform-over,n8n,dashboard,scripts}/
│   ├── legal-reference/
│   │   └── pipeda-breach-notification.md      (moved from research/07)
│   └── storefront-stage1/                     (new; ~300 lines after pivot)
├── README.md, CONTRIBUTING.md, CHANGELOG.md, LICENSE  (trimmed)
├── package.json, tsconfig.json, vercel.json, vitest.config.ts, playwright.config.ts
└── next.config.ts, eslint.config.mjs, postcss.config.mjs, components.json, mdx-components.tsx
```

**Active repo size: ~18,000 lines.** Down from ~88,000. The operator
can reason about all of it in a single afternoon.

### §6.5 Things to double-check before deleting (from the inventory pass)

The agent surfaced ten non-obvious calls. Recapped here for the
operator's pre-archive review:

1. **Read `08 §7` and this doc's `§3` before any deletion.** The
   salvage list is binding; if you disagree, update the doc, not the
   deletions.
2. **Resolve `src/app/lumivara-infotech/` first** (§5.9). The
   contamination blocks every dual-lane audit until handled.
3. **Delete `dual-lane-audit.sh` and `forge-spinout-dry-run.sh`** the
   day the §3 decision is committed — not earlier (they may help
   pre-archive hygiene), not later (they confuse future agent runs).
4. **Rewrite `docs/ops/operator-playbook.md` before archiving** — the
   §3 pivot has its own daily flow that needs its own playbook. Don't
   leave the team without one.
5. **Disable cron-driven workflows immediately on archive day**
   (triage / execute / plan / codex-review / deep-research / ai-smoke-test
   / record-ingest-smoke). Move the YAML files to `_archive/` *and*
   strip the `schedule:` block in any copy that stays under
   `.github/workflows/` until the move is complete. Otherwise they
   keep running on the dead cadence.
6. **Do not reuse any `docs/storefront/` copy for the §3 offer.** The
   word "AI" should not appear in the Stage-1 headline.
7. **Do not use `docs/mothership/{01,04,18}` projections for any
   planning under any §2 pivot.** They model 30-client × $249/mo at
   18-month LTV. The §3 pivot has different shape.
8. **Move `dashboard/` to a separate repo or archive — but do not
   leave it in the post-pivot active repo.** It will confuse readers.
9. **Delete `.dual-lane.yml`, `dual-lane-watcher.yml`,
   `dual-lane-audit.sh`, `forge-spinout-dry-run.sh`** from the active
   repo once the §3 decision is committed. They become meaningless.
10. **Keep `08` as the active reference, archive `01–07`.** The earlier
    research docs were read by the same operator who wrote `08` and
    found insufficient — they are historical, not authoritative.

---

*Sections §3 (recommended pivot), §4 (90-day plan), §7 (risks of the
pivot), §8 (un-archive criteria), §9 (§7 / §8.4 enhancements back to
`08`), and §10 (bibliography) fill in over the next commits as the
remaining two agent passes (comparable-pivots and §7/§8.4 stress-test)
return.*
