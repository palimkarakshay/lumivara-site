<!-- BEGIN:lane-banner -->
> _Lane: ⚪ Both — this charter governs every AI agent working in either lane (Site / Pipeline) of this Pattern C-readying repo._

# AI agent charter — `palimkarakshay/lumivara-site`

This file is the runtime charter for every AI agent (Claude Code, Codex, Gemini) working in this repo. Read top-to-bottom before any tool call. The four sections below are independent (Pattern C lane awareness, Next.js gotchas, session-budget gates, Vercel parity) and all four bind every run.
<!-- END:lane-banner -->

<!-- BEGIN:pattern-c-orientation -->
# Pattern C lane awareness (highest priority)

This repo is the **Phase 1 proof-of-concept** for the Pattern C two-repo trust model (per [`docs/migrations/00-automation-readiness-plan.md §1`](docs/migrations/00-automation-readiness-plan.md)). Two logically separate entities are co-housed in this tree until the P5.6 spinout splits them into their final repos:

| Lane | Entity | What lives in it (high level) | Becomes (post-P5.6) |
|---|---|---|---|
| 🌐 **Site** | Client #1 marketing site (Lumivara People Advisory) | `src/`, `public/`, `assets/`, `e2e/`, `mdx-components.tsx`, `next.config.ts`, `404.html`, `index.html`, `vercel.json` | `palimkarakshay/lumivara-people-advisory-site` |
| 🛠 **Pipeline** | Operator framework (Lumivara Forge) | `.github/workflows/`, `scripts/`, `dashboard/`, `docs/mothership/`, `docs/storefront/`, `docs/decks/`, `docs/research/`, `docs/migrations/`, `docs/n8n-workflows/`, `docs/_deprecated/`, plus the operator-scoped top-level docs (`docs/AI_*.md`, `docs/MONITORING.md`, `docs/N8N_SETUP.md`, `docs/OPERATOR_SETUP.md`, `docs/TEMPLATE_REBUILD_PROMPT.md`, `docs/GEMINI_TASKS.md`) | `palimkarakshay/lumivara-forge-pipeline` (operator-private) |
| ⚪ **Both** | Cross-cutting hygiene | `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `AGENTS.md`, `CLAUDE.md`, `package.json`, `tsconfig.json`, `.gitignore`, `.env.local.example` | Updated in both repos by the spinout runbook |

Hard rules for every agent run:

1. **Operator IP never lands on a Site-only file.** When implementing a Site issue, do not edit anything under `docs/mothership/`, `docs/storefront/`, `docs/decks/`, `docs/research/`, `docs/migrations/`, `docs/n8n-workflows/`, `dashboard/`, `scripts/triage-*`, `scripts/execute-*`, `scripts/gemini-*`, `scripts/codex-*`, `scripts/plan-issue*`, `scripts/test-routing*`, `scripts/lib/`, or `.github/workflows/` unless the issue carries the `infra-allowed` label. The `pattern-c-audit.sh §2` enforces this.
2. **Client #1 brand identifiers stay out of operator-scope files.** Per [`docs/mothership/15-terminology-and-brand.md §6`](docs/mothership/15-terminology-and-brand.md), the strings `Lumivara People Advisory`, `Lumivara People Solutions`, `people advisory`, `lumivara.ca`, `Beas Banerjee` are forbidden in operator-scope docs except inside the `15 §7` client-example appendix or a labelled `> _Client example — see 15 §7._` callout.
3. **Run [`scripts/pattern-c-audit.sh`](scripts/pattern-c-audit.sh) after any structural change** (rename, new top-level file, new doc folder). Five-check sweep: stale brand, operator-pitch contamination, forbidden Client #1 strings, high-entropy committed secrets, duplicate doc numbers. Add a `<!-- pattern-c-audit:allow -->` per-line marker (or a doc-level allow-list entry in the script) only when the hit is genuinely legitimate and explain the carve-out in the same PR.
4. **Cross-link with relative paths within a lane.** Inside `docs/mothership/` link to other `docs/mothership/...` siblings via `./` or to other lanes via `../<lane>/...`. The relative-path discipline lets the spinout filter trees without rewriting links.
5. **The canonical lane map is [`docs/00-INDEX.md`](docs/00-INDEX.md).** When adding a new doc or top-level file, update that index (and `docs/<lane>/00-INDEX.md` if the lane has one) in the same PR.

The architecture this charter enforces is locked in [`docs/mothership/02b-pattern-c-architecture.md`](docs/mothership/02b-pattern-c-architecture.md). The MUST / MUST-NOT enforcement rows are in [`docs/mothership/pattern-c-enforcement-checklist.md`](docs/mothership/pattern-c-enforcement-checklist.md).
<!-- END:pattern-c-orientation -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. Applies to Site-lane work (`src/`, `next.config.ts`, etc.) only — Pipeline lane has no Next.js surface.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:session-budget-charter -->
# Session charter — quality first (highest priority)

This project is in a **critical planning stage**. The operator runs on a **Claude Max 20x subscription** (shared 5-hour rolling quota, ~20× the Pro tier). Day-to-day automation is billed against that quota, **but cost optimisation is explicitly NOT a priority right now** — best-possible outcome is. Pick the strongest available model for every step, take the turns you need, and prefer Opus + extended thinking over cutting corners.

A future "client onboarding" milestone will revisit cost/throughput trade-offs. Until then, treat every workflow as if quality is the only metric.

## Self-pacing within a single CI run

Use `--max-turns` as a soft watermark, not a budget cap. Estimate `used_pct = turns_taken / max_turns`.

- **At ~80% used**: finish the current concrete unit (one issue for `execute`, one issue's classification for `triage`). Commit, push, comment as the playbook requires. Then stop — don't start a new unit. Print `BUDGET: 80%, exiting cleanly after current unit`.
- **At ~95% used**: stop immediately. Commit any in-progress code to a branch (push if safe), label the affected issue `status/needs-continuation` with a comment listing (a) what's done, (b) what remains, (c) the branch name if any. Print `BUDGET: 95%, hard exit; resume next run`.
- A run that exits at 80% or 95% is a **success**, not a failure. The next scheduled run resumes.

## Across runs

- **Triage**: cap of ~25 issues per run (also enforced in `scripts/triage-prompt.md`). Default model is **Claude Opus** — best classification quality. Haiku/Sonnet remain available but are not the default in this phase.
- **Execute**: up to **3 issues per cron run**, processed sequentially. Stop after the first if it consumed >70% of max-turns. If a single issue exceeds 85% of max-turns, leave a draft PR with what works and a comment listing the rest.
- **Plan**: Opus on the planning pass, Opus on the implementation pass. The plan/implement split is for clarity, not for tier downgrade.

## Model selection defaults (this phase)

| Stage                | Default                           | Notes |
|----------------------|-----------------------------------|-------|
| Triage classification| `claude-opus-4-7`                 | Strongest label decisions; queue is small. |
| Plan generation      | `claude-opus-4-7`                 | Plans are read by every executor downstream — quality compounds. |
| Code implementation  | `claude-opus-4-7`                 | Trivial through complex all use Opus until cost optimisation phase. |
| Subagent calls       | `claude-opus-4-7`                 | Set in `.claude/settings.json`. |
| OpenAI / Codex       | `gpt-5.5`                         | ChatGPT Plus tier — second-opinion review, plan fallback, triage fallback. |
| Gemini deep research | `gemini-2.5-pro`                  | 1M-token context; free tier covers our volume. |
| Gemini triage backup | `gemini-2.5-flash`                | Free tier 500 req/day — keeps the fallback loop unconstrained. |

When cost optimisation later returns to the agenda, this table is the single place to bias the routing back down.

## For interactive Claude sessions on the laptop

- If the user signals "approaching usage limits" or "stop / wrap up": phase remaining work into Inbox issues (`status/needs-triage`), commit current state to a branch (or main if appropriate and stable), stop. Do NOT push through.
- Default to **incremental commits** (one logical change per commit). This makes partial work recoverable on any wakeup.
- With Max 20x quota, interactive sessions can be longer and more exploratory. The bot is still the right place for bulk implementation; interactive time is for direction, architecture, and review.

## Tracking

After each run, the action emits `total_cost_usd` and `num_turns` in its JSON output. Surface these in the run summary so the operator can spot quota drift — useful for the future cost-optimisation pass even though it is not gating now.
<!-- END:session-budget-charter -->

<!-- BEGIN:vercel-parity -->
# Vercel production parity (Site lane only)

Vercel deploys from this repo's `main` and only sees Site-lane files. Any change that influences **Site production behaviour** — environment variables, build commands, Next.js rewrites/redirects, or output configuration — must also be applied manually in the Vercel dashboard by the operator. GitHub Actions can update code and open PRs, but it cannot write Vercel project settings. When an agent implements such a change, it must: (1) append a `**Vercel mirror required:**` section to the PR description listing the exact steps the operator must take in the Vercel dashboard, and (2) add the `needs-vercel-mirror` label to the issue. The operator confirms the mirror is done by removing that label. Track all pending mirrors via the `needs-vercel-mirror` label view on the Issues tab.

Pipeline-lane changes (`.github/workflows/`, `scripts/`, `dashboard/`, `docs/**` outside `src/content/insights/`) **do not influence Vercel** and never need a mirror entry. The dashboard SPA is hosted separately on GitHub Pages of the platform repo (post-spinout); pre-spinout it lives under `dashboard/` and is built/deployed by its own workflow.
<!-- END:vercel-parity -->
