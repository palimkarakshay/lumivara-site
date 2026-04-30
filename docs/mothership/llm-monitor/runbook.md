# `llm-monitor` operator runbook

> _Lane: 🛠 Pipeline. Operator-private framework doc — never touched
> by Site issues. See [`AGENTS.md`](../../../AGENTS.md) lane rules._

The day-to-day "what do I do when…" for the
[`llm-monitor` pipeline](../../../scripts/llm-monitor/README.md). Read
the README first for architecture; this file is the runbook.

## TL;DR — what happens, and how often

The pipeline runs in **two cadence tiers** (since 2026-04-30 — operator
asked for "super aggressive" coverage):

### Watch tier — every 15 min
[`.github/workflows/llm-monitor-watch.yml`](../../../.github/workflows/llm-monitor-watch.yml)
fires at `:04`, `:19`, `:34`, `:49` past every hour. It runs ONLY the
`statuspages` collector against six provider status pages
(Anthropic / OpenAI / Vercel / GitHub / Cloudflare / Hugging Face).
On a hit:

1. Classified by Claude Opus (severity / kind / impact).
2. Auto-section of [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) rewritten with
   the new entry.
3. Severity-≥4 outage gets an auto-discovered GitHub issue (labels:
   `auto-discovered` + `infra-allowed` + `status/needs-triage`).
4. Digest + newsletters are **NOT** rewritten — those are committed
   by the sweep tier on a 2-hour cadence so the git tree doesn't churn
   every 15 min.

### Sweep tier — every 2 h
[`.github/workflows/llm-monitor.yml`](../../../.github/workflows/llm-monitor.yml)
fires at `13 */2 * * *` (`:13` every other hour: 00:13, 02:13, … 22:13
UTC). It runs the full collector set:

1. HN / RSS / Reddit / GitHub / statuspages all fan out, drop noise via
   per-source thresholds, and emit JSONL to the orchestrator.
2. New (deduped) records are batched into Claude Opus.
3. Digest written at `digests/YYYY-MM-DD.md` (overwritten on each sweep
   in the same UTC day; the date stamp gives a single file per day).
4. Operator + client newsletters written at
   `newsletters/operator-YYYY-MM-DD.md` and `newsletters/client-…`.
5. `KNOWN_ISSUES.md` and `RECOMMENDATIONS.md` auto-sections rewritten.
6. Severity-≥4 bugs with `action_hint` get auto-discovered issues.

Watch and sweep share the dedupe set (via `actions/cache`) so a watch
hit at 11:04 won't re-emit on the 12:13 sweep. They share the
`llm-monitor` concurrency group so writes to `KNOWN_ISSUES.md` are
serialised — no two-writer race.

## Required secrets

| Secret | Required? | What for | Where to set |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | preferred (else fallback ladder) | analyzer.py — Claude Opus | Repo Settings → Secrets → Actions |
| `GEMINI_API_KEY` | optional (fallback) | analyzer.py — Gemini 2.5 Pro fallback | Repo Settings → Secrets → Actions |
| `OPENAI_API_KEY` (or `_BACKUP`) | optional (last fallback) | analyzer.py — gpt-5.5 last-resort | Repo Settings → Secrets → Actions |
| `GITHUB_TOKEN` | yes (auto-provisioned) | gh CLI in collectors + feedback | Auto |
| `REDDIT_CLIENT_ID` + `_SECRET` | optional | Reddit OAuth (avoids 429s on shared CI IPs) | https://www.reddit.com/prefs/apps |
| `STACKEXCHANGE_API_KEY` | optional | Stack Overflow higher quota (10k req/day vs 300) | https://stackapps.com/apps/oauth/register |

Without `ANTHROPIC_API_KEY` the analyzer falls back to a heuristic
classifier — the digest still renders, but `kind` / `severity`
assignments are coarse. Add the key as soon as practical.

## Manual triggers

```bash
# Sweep — full pipeline, dry-run + no GH issues (safest first try).
gh workflow run llm-monitor.yml -f mode=sweep -f dry_run=true -f no_issues=true

# Watch — outage detection only, dry-run.
gh workflow run llm-monitor-watch.yml -f dry_run=true -f no_issues=true

# Real sweep, but no auto-issues (safe-mode for the first few days).
gh workflow run llm-monitor.yml -f no_issues=true

# Just the GitHub collector (cheap test of the SDK pipeline).
gh workflow run llm-monitor.yml -f collectors=github -f no_issues=true

# Just the statuspages collector (verifies the watch tier).
gh workflow run llm-monitor.yml -f collectors=statuspages -f no_issues=true
```

## Off-switches

The bot has three "off" levels, in order of impact:

1. **Pause auto-issue filing only** — set the workflow input
   `no_issues=true` and force-run, OR add `auto-discovered` to a
   blocklist in `feedback.py`. The digest still updates. Use this
   when the bot is filing duplicates or noise and you need a day to
   tune thresholds. **Apply to BOTH workflows** — `llm-monitor.yml`
   and `llm-monitor-watch.yml`.
2. **Pause everything but keep the file** — disable the workflows:
   ```bash
   gh workflow disable llm-monitor.yml
   gh workflow disable llm-monitor-watch.yml
   ```
   Re-enable with `gh workflow enable`. KNOWN_ISSUES.md will start
   ageing out (entries older than 14 days drop on the next run).
3. **Hard kill** — delete both workflow files
   (`.github/workflows/llm-monitor.yml` and `.github/workflows/llm-monitor-watch.yml`).
   The prompts will keep reading KNOWN_ISSUES.md but the file will
   go stale. Don't do this without replacing the file with a
   "deprecated" notice.

## Tuning thresholds

All thresholds live in
[`scripts/llm-monitor/sources.json`](../../../scripts/llm-monitor/sources.json).
Common adjustments:

* **Too noisy** → raise `min_points` (HN), `min_score` /
  `min_comments` (Reddit), `issue_min_reactions` (GitHub).
* **Missing things** → lower the same; add subreddits or feeds.
* **Wrong subject tagging** → edit `_keywords` and `_models_we_track`
  at the top of `sources.json` so the analyzer prompt sees the new
  vocabulary (the prompt builds from those lists).

After any change, run with `dry_run=true no_issues=true` once to
verify the digest still looks reasonable before letting the cron
file issues.

## When the auto-issue pipeline files a bad ticket

Bad tickets happen — the analyzer is calibrated, not omniscient.
Workflow:

1. Close the issue with a comment explaining why (one sentence is
   enough). The slug encoded in the title prevents re-filing within
   the 14-day window.
2. If the same root cause keeps re-firing, add the slug to a
   suppression list. Track this as a follow-up TODO — the v1 doesn't
   ship with one yet because we want to see what bad tickets actually
   look like before designing the suppression mechanism.
3. If the analyzer is systematically wrong on a `subject` (e.g.
   tagging "agent SDK" stories as `claude-code` when they're
   `anthropic-sdk`), refine the prompt rubric in
   `scripts/llm-monitor/analyzer.py`.

## Self-awareness loop — how prompts consume KNOWN_ISSUES.md

Three executor prompts ingest this file at the start of every run:

| Prompt | File | Section that pastes KNOWN_ISSUES |
|---|---|---|
| Triage | [`scripts/triage-prompt.md`](../../../scripts/triage-prompt.md) | "Operating context — known LLM issues" |
| Plan | [`scripts/execute-prompt.md`](../../../scripts/execute-prompt.md) | same |
| Execute | [`scripts/forge-execute-prompt.md`](../../../scripts/forge-execute-prompt.md) | same |

Each prompt copies the contents between the AUTO-START and AUTO-END
markers verbatim — that's the only ingest path. Anything outside
those markers (the hand-curated section) is operator notes, also
copied. So:

* Add a permanent gotcha to the hand-curated section if you want
  every run to see it long-term.
* Trust the auto-section to refresh daily for transient field
  reports.

## Adding a new bot or LLM to the watchlist

When you adopt a new model or SDK and want llm-monitor to track it:

1. Add to `_models_we_track` and `_keywords` in `sources.json` so
   the analyzer prompt knows it as a valid `subject`.
2. Add the SDK repo to `github.repos` if it's an open-source SDK.
3. (If announcing) consider adding a relevant subreddit or RSS feed
   to the lists in `sources.json`.
4. Run `dry_run=true no_issues=true` to validate.

No code changes are needed — the analyzer prompt is built from
`sources.json` at runtime.

## Cost ledger

The tiered cadence has two cost profiles. Per-run costs:

| Tier | Frequency | Per-run CI | Per-run analyzer | Per-run total |
|---|---|---|---|---|
| Watch | every 15 min (96/day) | ~30s (1 collector, 6 HTTP calls) | $0 most runs (no new records → analyzer skipped) — $0.05 on incident days | ≤ $0.05 |
| Sweep | every 2 h (12/day) | ~2 min (5 collectors) | $0.10–0.50 (1–3 Opus calls) | ~$0.30 |

Daily total at steady state: ~96 × $0 + ~12 × $0.30 = **~$3.60/day**
(~$110/month) on Anthropic API. On an outage day add maybe $0.50.

Per AGENTS.md "quality first" charter, this cost is well below the
Max 20x quota and not the limiting factor. The watch tier in
particular is dirt-cheap because the `analyzer.classify(...)` call
is skipped on no-op runs (record dedupe catches everything).

The future "client-onboarding" milestone may revisit cadence
trade-offs — until then, run aggressively with Opus.

## Cross-refs

* [`scripts/llm-monitor/README.md`](../../../scripts/llm-monitor/README.md)
  — architecture, source list, "more bot setup" matrix.
* [`AGENTS.md`](../../../AGENTS.md) — Pattern C lane rules, quality-
  first charter, model defaults.
* [`pattern-c-enforcement-checklist.md`](../pattern-c-enforcement-checklist.md)
  — how the `infra-allowed` label exempts auto-discovered issues
  from the Site-only audit.
