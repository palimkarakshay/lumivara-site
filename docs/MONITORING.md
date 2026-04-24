# Claude Usage Monitoring

Track quota consumption across automated CI runs and interactive sessions before hitting the 5-hour rolling window limit.

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

## Monitoring automated vs manual usage

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
2. Reduce execute.yml cron from 3x/day to 1x/day:
   Change `0 0,8,16 * * *` → `0 8 * * *` in `.github/workflows/execute.yml`
3. Raise the auto-routine bar: in triage-prompt.md, only mark `auto-routine` for P1 + trivial/easy
4. Pause entirely: change the cron to `0 0 1 1 *` (fires once a year)

## ccstatusonline (community tool)

Check if the Claude API / Claude Code infrastructure is having issues:
```powershell
# Check Anthropic status page
curl -s https://status.anthropic.com/api/v2/status.json | python3 -c "import json,sys; s=json.load(sys.stdin); print(s['status']['description'])"
```

Or just visit: https://status.anthropic.com

## Recommended monitoring routine

Weekly (Sunday evening, 5 min):
1. `npx ccusage@latest --today` on your laptop after any interactive session
2. Scan GitHub Actions → see which workflow ran most this week
3. Check if any runs are consistently hitting the 80% budget exit (needs-continuation label piling up)
4. If quota is tight: reduce execute cron or raise auto-routine bar

Add this as a GitHub Issue on a recurring basis if you want the bot to generate the report.
