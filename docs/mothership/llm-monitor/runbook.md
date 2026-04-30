# `llm-monitor` operator runbook

> _Lane: 🛠 Pipeline. Operator-private framework doc — never touched
> by Site issues. See [`AGENTS.md`](../../../AGENTS.md) lane rules._

The day-to-day "what do I do when…" for the
[`llm-monitor` pipeline](../../../scripts/llm-monitor/README.md). Read
the README first for architecture; this file is the runbook.

## TL;DR — what happens daily

1. **06:13 UTC**: cron triggers
   [`.github/workflows/llm-monitor.yml`](../../../.github/workflows/llm-monitor.yml).
2. Collectors fan out (HN / RSS / Reddit / GitHub), drop noise via
   per-source thresholds, and emit JSONL to the orchestrator.
3. New (deduped) records are batched into Claude Opus, which classifies
   each by `kind` × `subject` × `severity` × `novelty`.
4. A daily digest lands at `digests/YYYY-MM-DD.md`.
5. The auto-section of [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) is
   rewritten with the last-14-days roll-up — this is what the bot
   prompts read at the start of every triage / plan / execute run.
6. Severity-≥4 bugs with a clear `action_hint` get filed as GitHub
   issues labelled `auto-discovered` + `infra-allowed` so the
   triage / plan / execute pipeline picks them up automatically.

## Required secrets

| Secret | Required? | What for | Where to set |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | yes (else stub classifier) | analyzer.py | Repo Settings → Secrets → Actions |
| `GITHUB_TOKEN` | yes (auto-provisioned) | gh CLI in collectors + feedback | Auto |
| `REDDIT_CLIENT_ID` | optional | Reddit OAuth (avoids 429s on shared CI IPs) | Repo Settings → Secrets → Actions |
| `REDDIT_CLIENT_SECRET` | optional | Reddit OAuth | Repo Settings → Secrets → Actions |

Without `ANTHROPIC_API_KEY` the analyzer falls back to a heuristic
classifier — the digest still renders, but `kind` / `severity`
assignments are coarse. Add the key as soon as practical.

## Manual triggers

```bash
# Dry-run: heuristic stub, no GH issues filed, no commits.
gh workflow run llm-monitor.yml -f dry_run=true -f no_issues=true

# Real run, but no auto-issues (safe-mode for the first few days).
gh workflow run llm-monitor.yml -f no_issues=true

# Just the GitHub collector (cheap test of the SDK pipeline).
gh workflow run llm-monitor.yml -f collectors=github -f no_issues=true
```

## Off-switches

The bot has three "off" levels, in order of impact:

1. **Pause auto-issue filing only** — set the workflow input
   `no_issues=true` and force-run, OR add `auto-discovered` to a
   blocklist in `feedback.py`. The digest still updates. Use this
   when the bot is filing duplicates or noise and you need a day to
   tune thresholds.
2. **Pause everything but keep the file** — disable the workflow:
   ```bash
   gh workflow disable llm-monitor.yml
   ```
   Re-enable with `gh workflow enable`. KNOWN_ISSUES.md will start
   ageing out (entries older than 14 days drop on the next run).
3. **Hard kill** — delete `.github/workflows/llm-monitor.yml`. The
   prompts will keep reading KNOWN_ISSUES.md but the file will go
   stale. Don't do this without replacing the file with a
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

Each daily run is approximately:

* ~4 collector subprocesses, ~30s each → 2 min CI
* 1-3 Claude Opus calls (depends on volume) → ~$0.10-0.50 with
  current Anthropic pricing
* 1 commit + push, occasional `gh issue create` → $0

Per AGENTS.md "quality first" charter, this cost is well below the
operator's quota and not the limiting factor. The future
"client-onboarding" milestone may revisit cadence — until then, run
daily with Opus.

## Cross-refs

* [`scripts/llm-monitor/README.md`](../../../scripts/llm-monitor/README.md)
  — architecture, source list, "more bot setup" matrix.
* [`AGENTS.md`](../../../AGENTS.md) — Pattern C lane rules, quality-
  first charter, model defaults.
* [`pattern-c-enforcement-checklist.md`](../pattern-c-enforcement-checklist.md)
  — how the `infra-allowed` label exempts auto-discovered issues
  from the Site-only audit.
