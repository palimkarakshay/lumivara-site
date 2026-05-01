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

## §3 — The recommended pivot — a hedged three-leg stack

The matrix in §2 names **K** (hybrid: day-job + side practice, 9.5)
and **I** (full pause, 9.0) as the highest-fit single rows, but a
hybrid is, by definition, two or more rows run in parallel. The
comparable-pivots agent (`§10.1`) and the §7/§8.4 stress-test agent
(`§10.3`) converged independently on the same recommendation: stop
selling SMB retainers, sell senior expertise on multiple complementary
surfaces. The recommended pivot is therefore a **three-leg hedged
stack** that takes the strongest pieces of B / C / E / H from §2 and
adds a corporate-job hedge (I) running in parallel.

### §3.1 The stack

| Leg | What | Source pivot in §2 | % of revenue (target) | 12-mo CAD band |
|---|---|---|---:|---|
| **A. Senior freelance + AI-integration consulting**, anchored to a free Claude Partner Network credential and the operator's existing live multi-LLM pipeline as the portfolio piece | Sell hours at CAD $175–$250/hr to mid-market companies that want to ship AI features themselves but lack the engineering. Direct outreach + selective Toptal / A.Team inbound. | **B + C** | **50%** | $130–$220k |
| **B. AODA / WCAG 2.1 AA audits-and-remediation** as a productized service against the **December 31 2026 statutory deadline** for Ontario businesses with 20+ employees | CAD $3,000–$6,000 per audit × 15–25 audits/year + CAD $200–$400/mo monitoring retainers. The operator's existing axe-core + Lighthouse CI pipeline is the prebuilt delivery surface. **Wix and Squarespace builds fail WCAG out of the box** — that gap is the wedge. | **E** | **30%** | $50–$130k |
| **C. Corporate-job interview loop run in parallel** as price discovery on the operator's own market value, **not because they want the job** | Two or three loops at remote-friendly US-headquartered or Canadian companies (Shopify L7/L8, Cohere, AI-agent firms). Floor: a Toronto staff-IC offer at CAD $200–$320k TC. The offer-in-hand is the only honest way to know whether legs A+B are paying market-or-better. | **I** | **0%** unless A+B fail | (hedge only — close on whichever lands first) |

**Combined target:** CAD $200–$370k base case, async-dominant,
regulatory-hedged against the §6 commoditization wave, and structurally
buffered against operator illness via Leg C as a clean exit. The
platform investment is utilised across A and B (~70% of code paths)
rather than sunk on a §7.1-style single freelance build practice
(~15%).

### §3.2 Why this beats `08 §7.4`'s single-sentence recommendation

The original `08 §7.4` repositioning sentence — *"I'm a senior engineer
who builds modern, fast, accessible marketing sites for Canadian small
businesses. CAD $4,500–$6,000, three weeks, you own everything"* —
is defensible but **caps the operator at CAD $40–$90k/yr** (Pivot A in
the §2 matrix, fit score 7.0). The comparable-pivots agent flagged this
explicitly: *"Senior freelance saturation income for the operator's
profile: $230k–$290k CAD/yr gross at $150–$200/hr — meaningfully above
the deck pack's $118k–$128k headline."* The §7/§8.4 stress-test agent
arrived at the same conclusion via a different path: *"the right answer
is almost certainly a 3-leg stack, not a single offer; the platform's
overhead is only justified if it powers more than one revenue line."*

The Stage-1 freelance build practice in `08 §7` is **a defensible
fallback**, not the chosen path. Rolled into Leg A as occasional
build-engagements when an AI-integration prospect happens to want a
marketing site too.

### §3.3 The two pivots ranked next-best, and why they aren't the recommendation

- **Vertical workflow tool for one Canadian regulated profession**
  (Pivot D, fit 6.0; comparable-pivot agent's #2). Strong economics if
  it lands (Auxpanel's $30–$50k MRR / 85% margin / no-marketing-budget
  comparable in dental compliance), but **8–12 weeks to MVP with
  8–15-week sales cycle = 6+ months to first dollar**. The operator
  cannot afford 6 months of zero revenue. Demoted to a **§7.4-style
  optionality** under the un-archive criteria in §8 — re-open if Leg A
  of the recommended stack is producing >CAD $150k by month 9 and the
  operator has bandwidth.
- **HR-services-for-Canadian-SMBs partnership** (Pivot J, fit 6.5).
  The §7/§8.4 stress-test agent steel-manned this as a CAD $180–$350k
  ceiling pivot driven by the **2026 Canadian regulatory tailwinds**
  (pay-transparency mandates, psychological-harassment policy mandates,
  AI-disclosure mandates on job postings, AODA, expected federal
  privacy statute) — *each of which has a website-or-portal artefact
  attached to it*. Structurally valid; the operator builds the digital
  surface, an HR-services partner brings the regulatory product and
  the relationship into the SMB. But the path requires either (a)
  partnership development with an external HR practitioner the
  operator does not currently have a working relationship with, or (b)
  the operator double-counting an existing personal-graph asset that
  this document deliberately does not invoke. Demoted to **§8 un-archive
  criteria** for the same reason.

### §3.4 The boilerplate-as-product trap, named

The comparable-pivots agent's most useful warning was **Tailwind
Labs**: a structurally analogous business (Adam Wathan / Steve
Schoger's component-pack productized business) that **lost ~80% of
revenue in 2025 and laid off 75% of engineering in January 2026
because Claude / ChatGPT / Cursor began generating Tailwind CSS
directly**. Any pivot in §2's F (developer-targeted boilerplate) or G
(micro-SaaS spin-offs of platform pieces) sits on the same labour-
replacement curve that killed the original thesis (`08 §6.4`). They
score 5.5 and 4.5 in the matrix for exactly this reason. Avoid.

The single sentence the comparable-pivots agent suggested be pinned
alongside `08 §9`: *"Pieter Levels killed Avatar AI 60 days after
Lensa shipped; the speed of the kill is the asset."*

---

## §4 — The 90-day pivot plan

Ninety days from the day this doc commits, the operator should have:
**(1)** the platform overhead archived per §5; **(2)** Leg A producing
CAD $10k+/month in invoiced freelance revenue; **(3)** Leg B's first
two AODA-audit engagements signed against the December 31 2026 deadline;
**(4)** Leg C's first three corporate interview loops in flight. Each
of these has a hard 30 / 60 / 90-day milestone.

### §4.1 Week-by-week

| Wk | Leg A — freelance + AI consulting | Leg B — AODA / WCAG audits | Leg C — corporate hedge | Archive / cleanup |
|---|---|---|---|---|
| **1** | Apply to **Anthropic Claude Partner Network** (free, public directory). Set up a 1-page positioning site at a personal domain. Strip "Lumivara Forge" and all autopilot framing. | Draft a CAD $4,000 AODA-audit deliverable template. The deliverable: a PDF audit report + 1 PR fixing the top-10 violations. | Update LinkedIn + résumé. Tag the live `lumivara-forge.com` codebase as the portfolio artefact. | **Resolve §5.9 contamination** (delete or move `src/app/lumivara-infotech/`). Strip `schedule:` blocks from cron-driven workflows so they stop firing. |
| **2** | Pass **Claude Certified Architect, Foundations** assessment. Get the directory listing live. Begin direct outreach: 30 LinkedIn DMs to mid-market AI-feature buyers (CTOs / heads of engineering at 50–500-person SaaS companies). | Build the `aoda-audit/` storefront page on the personal site. List on 3 Ontario business-services directories. | Apply to 5 senior IC roles (Shopify, Cohere, AI-agent shops, 2 remote-US). | Archive `docs/decks/`, `docs/research/01-07`, `docs/research/raw/` to `docs/_archive/2026-05-XX-decks/` and `_archive/.../research-pro/`. |
| **3** | First 2 discovery calls. Quote Toptal-comparable rates ($175–$200/hr CAD). | Cold-email 50 Ontario businesses with 20+ employees and obviously-broken sites (filterable by Lighthouse + axe scans of public directories). | First 1–2 phone screens. | Archive `docs/storefront/` to `_archive/.../storefront/`. Stand up `docs/storefront-stage1/` (3 pages, ~300 lines). |
| **4** | Send first proposal. Aim for one signed engagement by EoW. | First 3 audit replies. Book first audit call. | First technical interview. | Archive `docs/mothership/` to `_archive/.../mothership/`, except `15-terminology-and-brand` (trim) and `15c-brand-and-domain-decision`. |
| **5** | First freelance engagement begins. | First audit signed; deliver in week 6. | Continue interview loops. | Archive `docs/migrations/` to `_archive/.../migrations/`. Delete `dual-lane-watcher.yml`, `forge-spinout-dry-run.sh`, `dual-lane-audit.sh`. |
| **6** | First invoice (CAD $5–10k). Second engagement in flight. | First audit delivered. Begin second. | Continue. | Archive `dashboard/` to a separate repo or to `_archive/`. Disable + archive `.github/workflows/{triage,execute*,plan-issues,codex-review*,deep-research,ai-smoke-test,llm-monitor*,record-ingest-smoke,deploy-dashboard,render-decks}.yml`. |
| **7** | 2–3 active engagements. | 3rd / 4th audit booked. | Possibly first offer-in-hand. | Archive `scripts/llm-monitor/`, `scripts/record-ingest/`, `scripts/codex-*.py`, `scripts/gemini-triage.py`, `scripts/plan-issue.py`, `scripts/lib/`, all triage/execute prompts. |
| **8** | Steady-state hourly capacity reached (25–30 billable hrs/wk). | Audits at 1 / week pace; first monitoring retainer signed. | Final-round interviews. | Archive `docs/n8n-workflows/` and `docs/ops/`. Rewrite `operator-playbook.md` to a 1-page Stage-1 daily flow. |
| **9** | First referral inbound (this is the leading indicator that Leg A is sticky). | First repeat customer (recall fixes from earlier audit). | Decide on offer if landed; otherwise continue. | All `docs/wiki/`, `docs/claude-design/`, `docs/_deprecated/` reviewed and either archived or deleted. |
| **10** | Run a Loom-screen-recording case study from the first engagement (with permission). Publish on personal site. | Publish a case study on `aoda-audit/` page from the first delivered audit. | If no offer: pause Leg C and reinvest the time in Leg A. | Final sweep: confirm `tsconfig.json` + `package.json` no longer list any platform paths; lint clean; tests green. |
| **11** | Steady-state: $10–$15k/mo invoiced. | Steady-state: 2–3 audits/mo + 4–6 monitoring retainers. | If offer-in-hand: decide whether to take it; the offer is **price discovery**, not destiny. | Confirm `docs/_archive/2026-05-XX-*/` folders each carry a top-level `README.md` summarising why archived. |
| **12** | **30 / 60 / 90 review.** Honest accounting: which leg paid? Which leg paid less than expected? Which got more attention than it should have? | Same. | Same. | Final commit: `docs/research/09 §7-§9` final-review. |

### §4.2 The forbidden activities for 90 days

From the §7/§8.4 stress-test agent and `08 §7.3` combined: during the
90-day pivot, the operator does **none** of the following:

1. **Write a new deck.** Including a "rebuilt-for-the-pivot" deck.
   Especially that.
2. **Refactor the platform.** The platform is in archive. No new
   features, no rewrites, no "while I'm here" cleanups.
3. **Re-open `Lumivara Forge` brand discussion.** The `15c` ADR
   stays as-is. If the recommended pivot lands, the brand work is
   trivially redone in week 13.
4. **Pursue a vertical-niche workflow tool.** §3.3 demoted this to
   month 9+. Honour the demotion.
5. **Open Pipeline-lane infrastructure work.** No new workflows, no
   n8n re-imports, no GitHub-App scaffolding. The infrastructure is
   archived; do not un-archive it for any reason short of a paying
   client requiring it.

### §4.3 The single 30-day reading

If by day 30 (end of week 4 above) the operator has **not** sent at
least one freelance proposal and **not** booked at least one AODA
audit call, the pivot is failing not because the offer is wrong but
because the operator has reverted to the documentation hobby.
Behaviour, not strategy. Re-read `08 §3` ("the documentation hobby
diagnosis"). The corrective action is to send the next 5 outreach
messages **within the hour the failure is noticed**, no further
deliberation.

---

## §7 — Risks of the pivot itself

Pivots fail in known ways. The recommended stack in §3 has six named
risks; each has a single named indicator and a corrective action.

| Risk | Indicator (visible by day) | Correction |
|---|---|---|
| **R1.** Leg A produces no inbound; outreach reply rate <2% | day 30 | Re-anchor positioning to a single named vertical (FinTech, AI-startups, regulated industries). Stop selling "AI integration" generically. |
| **R2.** Leg B fails because Ontario AODA buyers don't perceive the deadline as binding | day 45 | Pivot from "audit + remediation" to "AODA *attestation* package" (the regulator-required filing); price at CAD $1,500 flat. Lower revenue, faster sales cycle. |
| **R3.** Leg C produces offers but none above the operator's freelance rate | day 60 | The information itself is the win — Leg C closes; reinvest fully into Legs A + B. |
| **R4.** Operator discovers AI-consulting buyers want a *team*, not a solo (named comparable: every Anthropic Partner Network entry except Tribe AI is multi-person) | day 60–75 | Sub-contract a second engineer for capacity overflow on a 50/50 revenue split per engagement. Do not hire. |
| **R5.** Anthropic enforces the §5.6 ToS landmine **mid-pivot** by suspending the operator's Pro/Max account | any day | Cut over to API-key billing on every active engagement (already structured in `08 §5.6` mitigation). Pass the cost through as a line item in every SoW. The §5.6 risk does not block the pivot if the operator is on API billing from day 1. |
| **R6.** The operator, having archived the platform, cannot resist re-opening it | week 6+ | The archive is a one-way commit unless §8 criteria below are met. Visible signals: opening `_archive/...` paths in git, drafting a new deck, "while I'm here" platform refactors. **The corrective is to re-read `08 §3` and re-commit to the archive.** |

---

## §8 — Un-archive criteria

The archive is reversible, but only against named conditions. Each
archived bucket has a single rule for re-opening; if the rule does not
fire, the archive holds.

| Archived bucket | Un-archive trigger |
|---|---|
| **A-DECKS** | Never. Stakeholder decks for a 30-client cap product the operator is no longer selling. If a future product needs decks, write new ones. |
| **A-PLATFORM-OVER** (multi-AI ladder, plan-then-execute, llm-monitor, recording pipeline) | Two conditions, both required: (a) the operator is at capacity in the pivot stack (>30 hrs/wk billable for 90+ consecutive days), AND (b) a paying client of Leg A or Leg B has explicitly requested a feature the archived platform code provides. Single-leg signal not enough. |
| **A-DASHBOARD** | A second operator has joined the practice OR client count exceeds 5. Until then, GitHub Issues + Vercel UI are the dashboard. |
| **A-OPS** (operator playbooks) | Never as-is. The pivot has its own daily flow; rewrite, don't un-archive. |
| **A-RESEARCH-PRO** (research/01-07) | Never. They were superseded by `08`. |
| **A-WORKFLOWS** (the 31 cron-driven workflows) | Never as-is. Archive includes deletion of `schedule:` blocks; even if a single workflow becomes useful again, write a fresh one. |
| **A-N8N** | If the practice grows into a per-client automation tier (post-month-12, post-paying-client-#5) AND the operator chooses to ship automation as a paid feature. Until then, n8n stays archived. |
| **A-MIGRATIONS** (00-automation-readiness, 01-poc-perfection, lumivara-people-advisory-spinout) | If the operator chooses to spin a Site repo out for a client, the spinout runbook is the only archived file worth re-reading. The phase plans (00, 01) stay archived. |
| **K-PLATFORM-MINIMAL** items currently kept | Audit at month 6. If `auto-merge.yml` has produced one accidental merge that broke production, archive it then. |

The **explicit non-trigger:** *"I miss the platform"* is not an
un-archive condition. *"It would be cool to ship X"* is not an
un-archive condition. *"A prospect mentioned Y on a call"* is not an
un-archive condition. The trigger is **a paying customer requiring the
exact code path** — and that is a deliberately high bar.

---

## §9 — `08 §7` and `§8.4` enhancements (cross-fed)

The §7/§8.4 stress-test agent's findings expand both sections of the
diagnostic doc. The enhancements have been folded back into `08` as
**`08 §10`** (a new sub-section appended in the same commit batch). The
specific additions:

### §9.1 To `08 §7` (salvage paths) — additions to the original `§7.4`

- **`§7.5` (new): the three-leg hedged stack** as the recommended
  pivot, citing this doc's §3.
- **`§7.6` (new): the boilerplate-as-product trap, named** — Tailwind
  Labs' 80%-revenue-loss precedent (comparable-pivots agent §1).
  Pivots F and G in §2 explicitly forbidden.
- **`§7.7` (new): the corporate-hedge clause** — running interview
  loops in parallel as price discovery (Leg C / Pivot I in §2).

### §9.2 To `08 §8.4` (limits and what would change the read) — additions to the original four levers

- **`§8.4.5`: Anthropic enterprise repricing (April 2026)** moved
  *against* the §5.6 ToS softening rather than toward it. Any future
  read should re-check Anthropic's pricing page on every quarterly
  refresh, not just the legal-and-compliance page.
- **`§8.4.6`: Google AIO regulatory pressure** is real but slow. UK
  CMA opt-out announcement (January 28 2026), EU Commission
  investigation (December 2025) raise plausibility of a partial
  voluntary mitigation by Q4 2026 that *slows* but does not *reverse*
  the §6.3 asset-depreciation read.
- **`§8.4.7`: AODA December 31 2026 deadline** is the single most
  actionable read-changer surfaced by the stress-test pass. The
  operator's existing axe-core + Lighthouse CI pipeline is the
  prebuilt delivery surface. Pivot E in §2 is anchored on this lever.
- **`§8.4.8`: OPC enforcement against an AI website builder** (12–24
  month possibility per the agent) would convert the §2.4 PIPEDA
  framing from "rhetorical" to "commercial." Not actionable today;
  worth tracking quarterly.
- **`§8.4.9`: a major Wix or Squarespace outage during retail peak**
  is statistically near-certain over a 12-month window (Wix had 4
  major outages in the last 90 days at median 49-min duration); would
  meaningfully soften §3.1's "horizontal builders own the wedge"
  read **for the duration of the outage news cycle, not structurally**.
- **`§8.4.10`: an Anthropic / OpenAI / Google price war on inference**
  (40–60% probability of 30–50% Sonnet/Haiku token-price drop in
  2026) would convert §5.6's "forced API billing wipes out margin"
  from a kill-shot to a manageable line item.

The enhancements are recorded both here in §9 and in `08 §10` so that
neither document goes stale relative to the other.

---

## §10 — Bibliography and methodology

Three independent agents informed the work in this document. Their
findings converged on three independent points: **stop selling
retainer-priced productized service to SMBs; sell senior expertise on
multiple complementary surfaces instead; archive the platform overhead
without re-opening it absent a paying-customer requirement**.

### §10.1 Agent A — Comparable pivots case studies

Investigated productized-service pivots, AI-implementation consulting,
vertical-niche SaaS, developer-targeted templates, senior freelance
day-rates, build-in-public + content + course models, and corporate-
job pivots in the 2025–2026 window.

Top three findings ranked: senior freelance with AI-integration
positioning anchored to the Anthropic Claude Partner Network credential
(launched March 12 2026, free, $100M fund); vertical workflow tool for
one Canadian regulated profession (dental compliance comparable:
Auxpanel at $30–$50k MRR / 85% margin / no marketing); hedged
corporate bridge run *concurrently* with freelance.

Key citations:
- [Anthropic Claude Partner Network](https://www.anthropic.com/news/claude-partner-network)
- [Brett Williams / DesignJoy $1.14M ARR solo](https://www.news.aakashg.com/p/brett-designjoy-podcast)
- [Pieter Levels Photo AI $132K MRR / 60-day kill of Avatar AI](https://www.indiehackers.com/post/photo-ai-by-pieter-levels-complete-deep-dive-case-study-0-to-132k-mrr-in-18-months-3a9a2b1579)
- [Tailwind Labs 75% layoff / 80% revenue loss to AI codegen](https://devclass.com/2026/01/08/tailwind-labs-lays-off-75-percent-of-its-engineers-thanks-to-brutal-impact-of-ai/)
- [Marc Lou ShipFa.st $8.8K MRR — boilerplate decay](https://x.com/marc_louvion/status/1984327198774616533)
- [Toptal pricing model — fatcatremote](https://fatcatremote.com/blog/toptal-pricing-model)
- [A.Team senior engineer rates](https://www.a.team/join)
- [Auxpanel dental compliance vertical SaaS — Extruct](https://www.extruct.ai/data-room/dental-clinic-vertical-saas-companies/)
- [Senior software engineer salary Canada — whatisthesalary.com](https://whatisthesalary.com/it-salaries/senior-swe-salary-canada/)
- [Shopify L8 compensation — Levels.fyi](https://www.levels.fyi/companies/shopify/salaries/software-engineer/levels/l8)
- [Canadian tech "bloodbath" — Yahoo Finance Canada](https://ca.finance.yahoo.com/news/bloodbath-tech-workers-forced-survival-171342732.html)
- [Vercel Solution Partners](https://vercel.com/partners/solution-partners)
- [Indie Hackers — pivot from product to productized service](https://www.indiehackers.com/post/services/pivoting-from-product-to-tech-enabled-productized-service-and-growing-to-50k-mo-CNrdPsCe6FC0ikuDAK1g)

### §10.2 Agent B — Repo inventory for archive vs keep

Read-only enumeration of `/home/user/lumivara-site` against the
twelve-bucket classifier. Output drove §5 (archive list) and §6 (keep
list) verbatim. ~70,000 lines archived; ~18,000 lines kept; 15–20%
salvage ratio. Single contamination row surfaced (`src/app/lumivara-infotech/`)
that requires immediate operator action regardless of pivot direction.

### §10.3 Agent C — `08 §7` / `§8.4` stress-test

Investigated eight additional salvage paths beyond `08 §7.4`'s single
sentence; eight additional read-changing levers beyond `08 §8.4`'s
original four; and a "grow the offer" pivot (HR-services-for-Canadian-
SMBs partnership) that the deck pack never seriously considered.

Top three highest-value enhancements: replace `§7.4` with a three-leg
hybrid stack; close the `§5.6` ToS landmine *before* shipping any leg;
run a staff-engineer interview loop in parallel as price discovery.

Key citations:
- [Toptal Pricing 2026 — South](https://www.hireinsouth.com/post/how-much-does-toptal-cost)
- [Full Stack Developer Hourly Rate 2026 — Arc.dev](https://arc.dev/freelance-developer-rates/full-stack)
- [Fractional CTO Cost Canada 2026 — reyem.tech](https://www.reyem.tech/article/fractional-cto-cost-in-canada-2026-the-complete-pricing-guide)
- [White Label AI Marketing for Agencies 2026 — ALM Corp](https://almcorp.com/blog/white-label-ai-marketing-services-agencies-2026-guide/)
- [AODA Compliance Checklist 2026 — SmartSMSSolutions](https://smartsmssolutions.com/resources/blog/ca/aoda-compliance-checklist-2026)
- [Accessibility Audit Costs in Canada — accessibilitypartners.ca](https://accessibilitypartners.ca/accessibility-audit-cost-in-canada/)
- [AODA Ontario 2026 deadlines — zwebra.com](https://zwebra.com/aoda-ontario.html)
- [Vertical SaaS 2026 — qubit.capital](https://qubit.capital/blog/rise-vertical-saas-sector-specific-opportunities)
- [Anthropic ejects bundled tokens from enterprise seat deal — The Register, Apr 16 2026](https://www.theregister.com/2026/04/16/anthropic_ejects_bundled_tokens_enterprise/)
- [UK CMA Google AI Overview ruling — Adweek Jan 28 2026](https://www.adweek.com/media/uk-regulator-google-publishers-ai-control/)
- [EU Commission Google AI investigation — Dec 2025](https://ec.europa.eu/commission/presscorner/detail/da/ip_25_2964)
- [Canada 2026 privacy priorities — Osler](https://www.osler.com/en/insights/reports/2025-legal-outlook/canadas-2026-privacy-priorities-data-sovereignty-open-banking-and-ai/)
- [HR Compliance Checklist Canada 2026 — RisePeople](https://risepeople.com/blog/hr-compliance-checklist/)
- [HR Compliance Canada 2026 — Citation Canada](https://www.citationcanada.com/guide/the-ultimate-guide-to-hr-compliance-in-canada/)
- [Squarespace outage history — StatusGator](https://statusgator.com/services/squarespace/outage-history)
- [Wix incident history](https://status.wix.com/history)

### §10.4 Limits

The recommendation in §3 assumes:

- **Anthropic does not enforce the §5.6 ToS landmine inside the pivot
  window.** Mitigated by moving Leg A to API-key billing on day 1 of
  every engagement.
- **AODA enforcement holds its trajectory toward December 31 2026.**
  An accelerated regulatory rollback is unlikely; a deadline extension
  is the most plausible negative move and would soften but not kill
  Leg B.
- **Canadian tech labour market does not collapse further.** The
  current contraction (Vancouver postings -43%, Toronto -10%) is
  hostile but the Leg C interview loop is **price discovery**, not
  the primary path; a six-month closed window on Canadian roles still
  permits remote-friendly US loops.
- **The operator does not revert to the documentation hobby.** This
  is the single largest residual risk. The §4.3 30-day reading is the
  earliest point at which reversion becomes detectable.

A future review of this plan would be most useful at **day 90**, with
real numbers from each leg attached. The conversation moves from "is
the pivot right" (settled here) to "which leg is performing and
where to reinvest" (the question worth asking with data).

---

## §11 — The single sentence the operator should pin to the wall (alongside `08 §9`)

> **"Pieter Levels killed Avatar AI 60 days after Lensa shipped; the
> speed of the kill is the asset. The platform is archived; the
> pivot is the work; the customer the operator wants is named in
> §3, not in the deck pack."**

---

*Last updated: 2026-05-01. Author: operator-instance Claude Code agent
on branch `claude/review-self-maintaining-website-28Fvp`. Three
parallel research agents informed the work; convergence between them
on the recommended pivot is taken as signal, not noise.*
