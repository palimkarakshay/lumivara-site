# Changelog

All notable changes to this project are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Dual-Lane Repo readiness.** This repo is the proof-of-concept for the Dual-Lane two-repo trust model (Dual-Lane Repo) (locked 2026-04-28; canonical statement in [`docs/mothership/02b-dual-lane-architecture.md`](docs/mothership/02b-dual-lane-architecture.md)). Until the P5.6 spinout, both Site (Client #1: Lumivara People Advisory) and Pipeline (operator: **Lumivara Forge**) artefacts coexist in this tree — see [`docs/00-INDEX.md`](docs/00-INDEX.md) for the lane map.

---

## [Unreleased]

### Added — architecture & planning
- **Visual editor MVP for `/admin` (2026-05-01, ADR-001).** New decision record at [`docs/decks/adr-001-visual-editor.md`](docs/decks/adr-001-visual-editor.md): build a thin in-house editor over integrating Plate / Puck / Builder.io. v1 ships at `/admin/editor` with the four-view shell from #120 (Existing / Draft / Preview / Deployed) for MDX insight articles only — `src/content/insights/*.mdx`. Drafts persist server-side in an in-process buffer; "Publish" routes through the GitHub Contents API to open a `auto/editor-<slug>-<ts>` PR. Direct push to `main` forbidden by design — CI + Vercel preview gate the merge. Page-section editing (home/services/how-we-work) and an MDX runtime preview are explicitly Phase 2. (#120)
- **Dual-Lane Repo architecture (locked 2026-04-28).** Two-repo trust model (Site + Pipeline per engagement, plus the operator's Platform repo) replaces the deprecated `operator/main` overlay-branch design. Canonical statement: [`docs/mothership/02b-dual-lane-architecture.md`](docs/mothership/02b-dual-lane-architecture.md). Enforcement: [`docs/mothership/dual-lane-enforcement-checklist.md`](docs/mothership/dual-lane-enforcement-checklist.md). Decision history in `11 §1`.
- **Brand + domain ADR (2026-04-30).** New decision record at [`docs/mothership/15c-brand-and-domain-decision.md`](docs/mothership/15c-brand-and-domain-decision.md). **D1 (committed):** the operator umbrella runs on a separate registered domain — **not** co-hosted on `lumivara.ca` (which follows Client #1 to her repo at the Phase 4 spinout). SEO topical authority, Dual-Lane Repo ownership separation, sub-product naming composition, and `15 §6` brand-separation policy all argued against co-hosting; cost delta of a separate domain (~$30/yr) was trivial. **D2 (re-opened):** the locked `Lumivara Forge` / `lumivara-forge` brand from `15 §4` is under reconsideration — operator wants cleaner, leaner, non-hyphenated. Pre-vetted shortlist already lives in `15 §2` (Cadence, Continuum, Loom, Helm, Lighthouse, Compass, Plumbline). Phase 0 of the migration plan, the second drift sweep, GitHub org slug creation, trademark search, Resend mail domain, n8n hostname, and the `src/lib/site-config.ts` builder URL are all blocked on D2. Phase 4 DNS cutover scope (`lumivara.ca` → Beas's site) is unchanged. `15 §4`/`§5`, `00-automation-readiness-plan.md §2.1`/`§2.2`, `mothership/00-INDEX.md`, `00-INDEX.md`, and `migrations/README.md` carry forward-pointers to the ADR.
- **Brand locked 2026-04-28: Lumivara Forge.** Decision recorded in [`docs/mothership/15-terminology-and-brand.md §4`](docs/mothership/15-terminology-and-brand.md). Slug `lumivara-forge`; trademark availability check (CIPO Class 42 + USPTO) per `15 §5` was the only remaining pre-launch gate. **Re-opened 2026-04-30** — see the brand + domain ADR row above.
- **POC perfection plan + automation-readiness plan.** Phase 1 (prove the autopilot in this repo) → Phase 2 (Run S1 mechanical rename) → Phase 3 (bootstrap platform repo) → Phase 4 (Client #1 spinout) → Phase 5 (clean-slate Client #2) → Phase 6 (hardening). [`docs/migrations/00-automation-readiness-plan.md`](docs/migrations/00-automation-readiness-plan.md), [`docs/migrations/01-poc-perfection-plan.md`](docs/migrations/01-poc-perfection-plan.md). (#186, #187)
- **Spinout runbook for Client #1.** Phased one-shot at [`docs/migrations/lumivara-people-advisory-spinout.md`](docs/migrations/lumivara-people-advisory-spinout.md) with allow/deny tables and Dual-Lane Repo §4/§5 as gate / acceptance set. (#141, #155)

### Added — operator runbooks & business pack
- **Operator daily playbook + shareable progress tracker.** Front-door doc the operator opens every session ([`docs/ops/operator-playbook.md`](docs/ops/operator-playbook.md)) plus a 60-second status anyone (advisor / partner / Beas / future hire) can scan ([`docs/ops/progress-tracker.md`](docs/ops/progress-tracker.md)). (#194)
- **Mothership business pack** — 30+ docs at [`docs/mothership/`](docs/mothership/) covering business plan (01), architecture (02 + 02b), secure architecture (03 + 03b), tier cadence (04), platform-repo buildout plan (05), per-engagement playbook (06), client handover pack (07), future work (08), GitHub topology (09), Lumivara Forge setup plan (09b — renamed from 10-lumivara-infotech-setup-plan), critique series (10–14), terminology policy + client-example appendix (15 + 15b), automation prompt pack (16), Claude issue seeding pack (17), capacity / unit economics (18), provisioning automation matrix (18-provisioning), engagement evidence log template (19), launch & operating cost model (20), IP protection strategy (21), vault strategy ADR (21-vault), engagement risk protection (22). (#113, #114, #115, #116, #117, #121, #134, #135, #136, #137, #138, #140, #141, #142, #143)
- **Storefront pack** at [`docs/storefront/`](docs/storefront/) (renamed from `docs/freelance/` 2026-04-29) — quick start, gig profile, four-tier pricing, cost analysis, slide deck (md/html/pdf), template-hardening notes, positioning + product-strategy decks, client-migration strategy, marketing strategy + 90-day calendar.
- **Stakeholder deck pack** at [`docs/decks/`](docs/decks/) — investor, partner (co-operator), employee (engineer / VA), prospective-client (persona-tailored), advisor (pressure-test). All claims trace back to the evidentiary layer at [`docs/research/`](docs/research/).
- **Research evidentiary layer** — two raw Gemini Deep Research outputs + three synthesis docs + `[V]/[S]/[C]`-flagged source bibliography + client personas + switch reasons + honest drawbacks. (#172)
- **Operations docs** — audit runbook, platform baseline, variable registry, GitHub Project v2 layout, codex-fix classifier fixtures, Gemini deep audit operator contract. (#142, #145, #178, #179, #189, #190, #192)

### Added — automation & code
- **`/admin` portal Phase 1 + deployments/promote-selected.** Auth.js v5 (magic link / Google / Entra), allowlist gating, per-deployment promote button gated by Codex review. (#66, #91, #97, #156)
- **Codex review workflow** with Gemini 2.5 Pro fallback when OpenAI is unavailable. Auto-run on every PR; gates auto-merge on findings. (#175, #183)
- **Multi-channel intake n8n workflows** — `intake-web.json`, `intake-email.json`, `intake-sms.json`, `client-input-record.json`, `client-input-notify.json`, `deploy-confirmed.json`. ([`docs/n8n-workflows/admin-portal/`](docs/n8n-workflows/admin-portal/))
- **Vercel production-integrity** — anti-overwrite guard, `/admin/deployments`, drift watcher, [`docs/deploy/production-integrity.md`](docs/deploy/production-integrity.md). (#151)
- **Vertical content prompt packs.** Restaurant promoted to Full first (#106); **plumber promoted Stub → Full 2026-04-30** (#225); **recruiter promoted Stub → Full 2026-04-30** (#229). Realtor remains a stub. ([`docs/mothership/templates/`](docs/mothership/templates/))
- **Dual-Lane Repo audit script** at [`scripts/dual-lane-audit.sh`](scripts/dual-lane-audit.sh) — five-check sweep job (stale brand drift, operator pitch on site repo, forbidden Client #1 strings, high-entropy committed secrets, duplicate doc numbers). Runnable with `--fix-brand-drift` for safe auto-rewrites. (PR #200)
- **`docs/00-INDEX.md`** master index — labels every top-level doc + folder by Dual-Lane Repo lane (🛠 Pipeline / 🌐 Site / ⚪ Both). (PR #200)
- **`llm-monitor` bot self-awareness pipeline (2026-04-30).** Watches Anthropic / Gemini / OpenAI status pages, four LLM-bot RSS feeds, and a Stack Overflow collector; runs an aggressive tiered cadence — `llm-monitor-watch` every 15 min + `llm-monitor` sweep every 2h; auto-rewrites [`docs/mothership/llm-monitor/KNOWN_ISSUES.md`](docs/mothership/llm-monitor/KNOWN_ISSUES.md) (last 14 days of field bugs ingested by triage / plan / execute prompts) and [`docs/mothership/llm-monitor/RECOMMENDATIONS.md`](docs/mothership/llm-monitor/RECOMMENDATIONS.md) (running list of bot-fleet enhancement suggestions); ships daily digests under `llm-monitor/digests/` + operator-technical and client-facing newsletters under `llm-monitor/newsletters/`. Operator runbook at [`docs/mothership/llm-monitor/runbook.md`](docs/mothership/llm-monitor/runbook.md). Three production-run defects (LLM fallback ladder + tightened stub + outage issue filing) fixed same day. (#233, #234, #236, #241)
- **`record-ingest` operator recording pipeline (2026-04-30).** Free, drift-guarded, conservative — captures operator decisions / corrections / new policy and feeds them back into the prompt context. Ships with a CI smoke test and drift-guard unit tests. Source: [`scripts/record-ingest/`](scripts/record-ingest/), workflow [`record-ingest-smoke.yml`](.github/workflows/record-ingest-smoke.yml). (#237, #239)
- **Doc-task seeder — four-tier self-automation per OWASP LLM08 (2026-04-30).** Closes the supply-chain-of-instructions risk by gating documentation tasks on a four-tier ladder of evidence freshness. Source: [`scripts/doc-task-seeder.py`](scripts/doc-task-seeder.py), workflow [`doc-task-seeder.yml`](.github/workflows/doc-task-seeder.yml), runbook at [`docs/ops/doc-task-seeder.md`](docs/ops/doc-task-seeder.md). (#226)
- **Rolling backlog digest + 24/7 utilisation cadence bumps (2026-04-30).** Backlog digest workflow now runs continuously; `triage` / `execute` / `plan-issues` cadences moved from "every 30/60/120 min during business hours" to "every 15 min / 1 h / 1 h all day" — see [`AGENTS.md`](AGENTS.md) "Self-pacing within a single CI run" + [`.github/workflows/`](.github/workflows/). (#231)
- **`codex-review` fallback ladder extended (2026-04-30).** New ladder, in order: (1) `OPENAI_API_KEY` (free) → (1b) `OPENAI_API_KEY_BACKUP` (paid) → (2) Gemini 2.5 Pro → (2b) Gemini 2.5 Flash → (3) GitHub Models / `meta/Llama-3.3-70B-Instruct` → (3b) GitHub Models / `openai/gpt-4.1-mini` → (4) OpenRouter / `deepseek/deepseek-r1:free` → (4b) OpenRouter / `qwen/qwen3-coder:free` → defer. `GEMINI_MODEL` deprecated in favour of `GEMINI_PRO_MODEL` / `GEMINI_FLASH_MODEL`. Source: [`scripts/codex-review-fallback.py`](scripts/codex-review-fallback.py). (#240, #244)
- **PIPEDA breach-notification research seed (2026-04-30).** New row in the research pack at [`docs/research/07-pipeda-breach-notification.md`](docs/research/07-pipeda-breach-notification.md) — covers the federal-law breach-notification clock, the OPC reporting form, and the per-client Recoverable-Harm test; closes the gap [`docs/mothership/08-future-work.md §6`](docs/mothership/08-future-work.md) flagged as "before client #3." (#221)
- **Doc-pack feedback closure passes (2026-04-30).** Plumber + recruiter template promotions; storefront / mothership / migrations cross-walks reconciled (#218, #219, #220, #222, #223, #224, #228). Twenty awaiting-review issues closed in the same end-of-day pass — record kept inline in [`docs/ops/progress-tracker.md`](docs/ops/progress-tracker.md), [`docs/ops/operator-playbook.md`](docs/ops/operator-playbook.md), and [`docs/migrations/01-poc-perfection-plan.md`](docs/migrations/01-poc-perfection-plan.md). (#246)

### Renamed
- `docs/freelance/` → `docs/storefront/` (PR #200, 2026-04-29) — per [`docs/mothership/15b-naming-conventions.md §2`](docs/mothership/15b-naming-conventions.md). The new name fits the post-brand-lock positioning (productised tiered MSP, not hourly contractor work).
- `docs/mothership/10-lumivara-infotech-setup-plan.md` → `docs/mothership/09b-lumivara-forge-setup-plan.md` (PR #200) — fixes a numeric collision with `10-critique-executive-summary.md` and replaces the retired "Infotech" working name with the locked Lumivara Forge brand. Companion-to-09 relationship now expressed by the `09b` prefix.
- `PHONE_SETUP.md` → `docs/_deprecated/PHONE_SETUP.md` (PR #200) — the v1 phone-PAT deprecation notice was tidied off the repo root into a dedicated archive folder.

### Changed — quality-first phase
- **Quality-first phase** for the operator's **Claude Max 20x** subscription. Best-possible outcome is now the gating priority; cost optimisation is deferred to a future client-onboarding milestone. See `AGENTS.md` for the active session charter.
- Claude routing: every triage / plan / implement step defaults to `claude-opus-4-7`. Per-tier mapping (`trivial|easy → haiku`, `medium → sonnet`, `complex → opus`) is preserved in comments and reserved for the future cost-optimisation phase.
- OpenAI / Codex paths upgraded to `gpt-5.5` (ChatGPT Plus tier) across `codex-review.yml`, `triage.yml` Codex fallback, `scripts/codex-triage.py`, `scripts/plan-issue.py`, `scripts/lib/routing.py`, and the smoke-test ping.
- Gemini free tier remains the default for the high-frequency fallback ladder (`gemini-2.5-flash` for triage, `gemini-2.5-pro` for deep research / planning).
- Session-budget gates relaxed: `50%/80%` → `80%/95%` watermarks. Triage cap `5–10 → ~25` issues per run. Execute path now allows up to **3 issues per cron run** (was hard-capped at one).
- `--max-turns` lifted across the board: triage `40 → 150`, execute `80 → 400`, execute-single `120 → 500`, execute-complex Opus plan `30 → 150` and Phase 2 `120 → 500` (Phase 2 also promoted from Sonnet to Opus), plan-issues `50 → 200`.
- Cron cadence: triage `30m → 15m`, execute `2h → 1h`, plan-issues `2h → 1h` (offset 30 min).
- `.claude/settings.json`: thinking `budget_tokens 10000 → 32000`, `compactContextThreshold 0.5 → 0.9`, `subagentModel haiku → claude-opus-4-7`.
- AI Ops dashboard: `DEFAULT_AI_MODEL` documented initial value `sonnet → opus` to match the new default.

### Changed — security topology
- **GitHub App** replaces long-lived `VENDOR_GITHUB_PAT` for cross-repo writes; per-client HMAC secret rotation is now two-phase. (#135, #159)
- Per-client Resend keys; org-level secrets scoped per pipeline repo via "Selected repositories." [`docs/mothership/03-secure-architecture.md`](docs/mothership/03-secure-architecture.md), [`docs/mothership/03b-security-operations-checklist.md`](docs/mothership/03b-security-operations-checklist.md).

### Changed — brand drift sweep (PR #200)
- "Lumivara Infotech" → "Lumivara Forge" across 12 files (docs prose, [`src/lib/site-config.ts`](src/lib/site-config.ts) `builder.name` shown in the site footer, the operator-pitch page metadata + content). The retired working name now appears only inside `scripts/dual-lane-audit.sh` (the regex it greps for).
- `lumivara.com` → `lumivara-forge.com` literal across 13 files (decks, storefront pack, research, slide deck `.md`/`.html`). Domain is pending registration per `15 §5`; the storefront and decks indexes carry a "domain pending" banner explaining the gap.
- Vault structure references: `Lumivara-Infotech-IP` vault → `Lumivara-Forge-IP` (across [`21-vault-strategy-adr.md`](docs/mothership/21-vault-strategy-adr.md), [`03b-security-operations-checklist.md`](docs/mothership/03b-security-operations-checklist.md), [`docs/wiki/Security.md`](docs/wiki/Security.md)).

### Deprecated
- **v1 phone-PAT capture path** (HTTP Shortcuts / Apple Shortcuts → GitHub PAT on the operator's phone). Superseded by the `/admin` portal + n8n email/SMS/web pipeline. Historical notice kept at [`docs/_deprecated/PHONE_SETUP.md`](docs/_deprecated/PHONE_SETUP.md). (#139, #150)
- **`operator/main` overlay-branch architecture.** Replaced 2026-04-28 by Dual-Lane two-repo trust model (Dual-Lane Repo). Surviving references appear only in the critique series (`10`, `11`, `12`) and the migration prompt-pack (`16`, `17`) under "Historical / decision record" banners.

### Flagged for follow-up (not addressed in current PRs)
- **Dual-Lane Repo contamination** — `src/app/lumivara-infotech/` + `src/content/lumivara-infotech.ts` ship the operator's pitch on the Client #1 marketing site. Per Dual-Lane Repo `02b §6` / `C-MUST-1`, operator brand should not occupy a site-repo URL tree. Tracked on PR #200 description; needs operator decision (delete / rename to `/forge` / move to a separate operator-brand Vercel project). The `dual-lane-audit.sh §2` keeps the violation visible at every audit run.
- **Sibling-number collisions** in `docs/mothership/`: `18-capacity` + `18-provisioning`, and `21-ip` + `21-vault`. Same fix pattern as the `09b` rename that landed in PR #200; deferred to a focused rename PR.
- **`docs/n8n-workflows/` → `docs/n8n/`** rename per [`15b §2`](docs/mothership/15b-naming-conventions.md). Smaller blast radius than the freelance rename; deferred.
- **Mothership prose terminology sweep** (`mothership` noun → `platform` / `control plane` per `15 §1`) — ~426 hits across 50 files. Folder name retained per the 2026-04-29 operator decision; prose sweep proceeds incrementally and is tracked by `dual-lane-audit.sh`.

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
