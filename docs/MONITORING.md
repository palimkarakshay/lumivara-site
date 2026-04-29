# Claude Usage Monitoring

Track quota consumption across automated CI runs and interactive sessions before hitting the 5-hour rolling window limit. The repo is currently on the operator's **Max 20x** subscription (~20× Pro headroom) running quality-first defaults — Opus everywhere on Claude, gpt-5.5 on OpenAI, Gemini's free tier on the fallback ladder.

## ccusage — per-session and aggregate usage

```powershell
npx ccusage@latest
```

Shows token usage, cost estimates, and session breakdowns from Claude Code's local logs (`~/.claude/`). Run after any session to see what it cost.

Useful flags:
```powershell
npx ccusage@latest --today          # today's usage only
npx ccusage@latest --json           # machine-readable output
npx ccusage@latest --model sonnet   # filter by model
```

The CI runs (triage.yml, execute.yml) also emit `total_cost_usd` and `num_turns` in the action's JSON output — visible in the Actions run summary on GitHub.

## Automated rolling-window monitor (`bot-usage-monitor.yml`)

The most direct signal for "are we close to a per-provider quota cap"
is now a scheduled report — `bot-usage-monitor.yml` runs hourly and
posts a markdown snapshot to a single pinned issue
(**Bot usage report (rolling)**, labelled `type/observability` so
triage skips it). The report covers two windows side by side:

- **Rolling 5h** — matches the Claude Max 20x quota window.
- **Weekly 7d** — for the operator's Sunday review cadence.

Because none of Anthropic, OpenAI, or Google publishes a programmatic
"quota remaining" endpoint at the operator's tier, the monitor infers
pressure from **behaviour**:

| Signal | Means |
|--------|-------|
| `execute-fallback.yml` dispatches in last 5h ≥ 3 | Claude is failing often — the 5h rolling cap on Max 20x is likely exhausted. |
| Open PRs labelled `review-deferred` ≥ 1 | Both review engines (OpenAI + Gemini) were unavailable at least once; `codex-review-recheck.yml` will retry. |
| Open PRs labelled `codex-reviewed-by-gemini` ≥ ½ of `codex` runs | OpenAI's gpt-5.5 path is degraded; check ChatGPT Plus quota. |
| Open issues labelled `status/needs-continuation` ≥ 5 | Bots are hitting the 80% budget exit often — work is queueing up. |

Manually run:

```bash
gh workflow run bot-usage-monitor.yml --repo palimkarakshay/lumivara-site
```

Read the report:

```bash
gh issue list --repo palimkarakshay/lumivara-site \
  --label type/observability --state open
```

### Weekly view from the same data

The same workflow emits the **last-7-days** roll-up in the lower half
of every report (per-workflow + per-provider counts, total runtime,
fallback dispatches). Read the same pinned issue any Sunday — no
extra command needed.

## Monitoring automated vs manual usage (manual gh queries)

After each Actions run, check the run summary page in GitHub → Actions → [run name] → Summary. The Claude Code action outputs a usage block. Aggregate manually or via:

```powershell
# List last 10 action runs with their conclusion and timing
gh run list --repo palimkarakshay/lumivara-site --limit 10 --json name,status,conclusion,createdAt,updatedAt
```

To spot which workflow is consuming the most quota:
```powershell
gh run list --repo palimkarakshay/lumivara-site --limit 50 --json workflowName,createdAt,durationMs | `
  ConvertFrom-Json | `
  Group-Object workflowName | `
  Select-Object Name, Count, @{n='TotalMinutes';e={[math]::Round(($_.Group | Measure-Object durationMs -Sum).Sum / 60000, 1)}}
```

## If you hit quota limits

Symptoms: triage/execute runs finish in < 5 turns with "usage limit reached" message.

Immediate relief (in order):
1. Wait — the rolling window resets progressively (5h rolling, not midnight reset)
2. Reduce execute.yml cron from hourly to less frequent:
   Change `0 * * * *` → `0 */4 * * *` in `.github/workflows/execute.yml`
3. Restore the per-tier model mapping in `scripts/lib/routing.py` (trivial/easy → haiku, medium → sonnet, complex → opus) so cheap tasks stop running on Opus
4. Raise the auto-routine bar: in triage-prompt.md, only mark `auto-routine` for P1 + trivial/easy
5. Pause entirely: change the cron to `0 0 1 1 *` (fires once a year)

## ccstatusonline (community tool)

Check if the Claude API / Claude Code infrastructure is having issues:
```powershell
# Check Anthropic status page
curl -s https://status.anthropic.com/api/v2/status.json | python3 -c "import json,sys; s=json.load(sys.stdin); print(s['status']['description'])"
```

Or just visit: https://status.anthropic.com

## Recommended monitoring routine

Weekly (Sunday evening, 5 min):
1. Open the pinned **Bot usage report (rolling)** issue (filter
   `label:type/observability state:open`). Skim the "Pressure
   signals" section — if it says "no quota pressure detected", you're
   done.
2. `npx ccusage@latest --today` on your laptop after any interactive session
3. Check the `review-deferred` and `status/needs-continuation` counts
   in the report. Anything > 0 on `review-deferred` for a full day
   means both OpenAI and Gemini were degraded recently — investigate.
4. If quota is tight: reduce execute cron or raise auto-routine bar.

Daily passive check:

- The hourly monitor run posts to step-summary too. If a workflow run
  catches your eye in GitHub Actions, opening its summary shows the
  same report inline.

## When a bot is unavailable, the system already self-routes

Just for clarity: the operator does not need to manually re-trigger
runs when a provider goes down. The fallback ladders are:

| Stage | Primary | Fallback chain |
|-------|---------|----------------|
| Triage | Claude Opus | Gemini 2.5 Flash → OpenAI gpt-5.5 |
| Plan | Claude Opus | Gemini 2.5 Pro → OpenAI gpt-5.5 |
| Execute (code edits) | Claude Opus | Codex CLI → Gemini CLI (via `execute-fallback.yml`, requires `plan/detailed`) |
| Code review (PR) | OpenAI gpt-5.5 | Gemini 2.5 Pro → defer (`review-deferred` label, retried every 4h by `codex-review-recheck.yml`) |

If every option in a chain is unavailable, the work is queued for the
bot to come back to it later:

- Triage: keeps `status/needs-triage`, picks up next cron.
- Plan: keeps `status/planned`, picks up next cron.
- Execute: leaves `status/needs-continuation` + branch + PR snapshot.
- Code review: applies `review-deferred`; `codex-review-recheck.yml`
  retries every 4h and the deferred PR cannot auto-merge until the
  label clears.
