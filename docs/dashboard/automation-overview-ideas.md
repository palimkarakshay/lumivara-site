# Dashboard ideas — automation overviews to add next

Synthesised from a 2026 sweep of AI-agent-ops dashboards (GitHub's
"Mission Control" + Agent HQ, AgentOps, Braintrust, Langfuse,
UptimeRobot, Dash0). Sources at the bottom.

The current AI Ops dashboard is strong on **control surface** (start /
stop / route / merge) and weak on **observability**. This is the
prioritized backlog of overviews to add, scored by signal-per-pixel for
a phone-first dashboard. P1 = ship next; P3 = nice-to-have.

## P1 — high signal, cheap to build

### 1. Cost tile
A small chip in the header showing **today's Claude + Gemini + OpenAI
spend** and the % of the daily budget consumed. A tap expands to a
weekly trend sparkline. Today the operator has zero visibility into
whether cron drift is burning quota until the bill arrives.

- Source: GitHub Actions step summaries already log token counts.
  Aggregate by parsing run logs (we already fetch them) or by writing
  a `scripts/log-spend.py` in the existing CI that appends to a
  daily JSONL file in the repo.
- Implementation note: Don't put the dollar figure in the header on
  free-tier client builds — leak risk.

### 2. Run success rate (last 7 days)
A single percentage with a 7-day trendline. Computed from the existing
`listWorkflowRuns` data — no new endpoint needed. Threshold colors:
green ≥ 95 %, amber 80-95, rose < 80. Replaces the operator's habit of
scrolling through cards to gauge health.

### 3. Stuck-issue queue
"Inbox items older than 48 h that haven't been triaged." This is the
single most actionable list — stuck issues mean the bot can't pick
them up. One API call (`gh issue list --label status/needs-triage`),
sort by age. Tappable rows open the issue.

### 4. Failure cluster panel
Top 3 failing (workflow, step) pairs over the last 24 h, with run
count and a "View triage issue" link (the auto-filed issue from
`report-failure.yml`). Surfaces which fixes the executor should
prioritize.

## P2 — medium signal, medium build

### 5. Agent reliability scorecard
Per-model success rate over the rolling 7 days. Shows which Claude
tier or fallback engine is actually pulling its weight, so the
operator knows whether to set `DEFAULT_AI_MODEL=opus` vs leaving it
on `sonnet`. Pulls from the routing audit lines our workflows
already emit to step summaries.

### 6. Cron drift detection
For each scheduled workflow, "expected fires this week" vs "actual
fires." A delta > 2 means the workflow is silently disabled or
hitting its concurrency lock. Today the operator only notices drift
when something breaks downstream.

### 7. Run latency / time-to-merge
P50 + P95 of "issue marked auto-routine" → "PR merged." Surfaces
whether the executor is keeping up with triage or falling behind.
Single-number indicator with trendline.

### 8. Operator audit log
Every dashboard mutation (`Run now`, `Pause`, `Override`, `Merge`)
appended to a localStorage ring buffer + posted as a comment on the
relevant run / PR for permanent record. Helpful when you wake up and
think "did I press the override button or did I dream it?"

### 9. Token budget guardrail
A visible "you've used X% of the 5-h Claude quota" bar at the top of
the runs list, sourced from the existing `--max-turns` budget
charter. Hard line at 80 % matches the AGENTS.md self-pacing rule.

## P3 — nice-to-haves

### 10. Cost-per-issue
Average $ to take an issue from `auto-routine` → merged. Lets the
operator price client work intelligently.

### 11. Heatmap of failures by hour-of-day
Often "every failure is between 02:00-04:00 UTC" reveals a
rate-limit window the operator can avoid by shifting the cron.

### 12. Dependency-health chip
`npm audit --audit-level=high` output as a color chip. Tapping
opens the failing PRs for the auto-update bot.

### 13. Open PR review-readiness panel
PRs grouped by "all checks green, awaiting merge," "checks failing,
needs human," "merge conflicts." Today this is technically visible in
the runs list but it's noisy.

### 14. Per-client SLA tile (multi-tenant)
For each client repo, "agent uptime", "issues closed this week",
"avg cycle time." Feeds the client-side admin page directly. Read
from the same data the operator dashboard collects.

### 15. Trust score / drift indicator
Agents producing increasingly verbose THINKING blocks, increasing
turn counts, or shifting tone over time may be drifting. A simple
"last 7 days vs 30-day baseline" delta surfaces this. Borrowed
straight from AgentOps and Braintrust observability practices.

### 16. Approval queue (human-in-the-loop)
Agent-proposed actions tagged `requires-human` (e.g., destructive
DB migrations) surfaced as a queue with one-tap approve/reject.
Future feature when we add agent-driven schema changes.

## Cross-cutting infrastructure

- **OpenTelemetry export from CI** (Dash0's pattern): emit OTLP from
  every workflow step. Lets us reuse off-the-shelf observability
  backends without rebuilding the wheel for every panel above.
- **Eval suites on PR** (GitHub's mission-control pattern): every PR
  the executor opens runs a fixed prompt set against the changed
  code; the dashboard surfaces eval delta. Catches quality
  regressions that linting won't.

## Implementation order I'd actually take

If we have one execute-cycle of budget, build P1 #1-4 in this order
because each compounds value:

1. Run success rate (cheapest, biggest morale win)
2. Stuck-issue queue (most operator-actionable)
3. Failure cluster panel (closes the loop with `report-failure.yml`)
4. Cost tile (longest tail; needs a CI script first to log spend)

Skip P2 + P3 until P1 lands and we know which gaps the operator
actually feels.

## Sources

- [GitHub: Agent HQ blog post](https://github.blog/news-insights/company-news/welcome-home-agents/)
- [Braintrust: AI observability tools 2026](https://www.braintrust.dev/articles/best-ai-observability-tools-2026)
- [UptimeRobot: AI agent monitoring best practices, tools & metrics](https://uptimerobot.com/knowledge-hub/monitoring/ai-agent-monitoring-best-practices-tools-and-metrics/)
- [AgentOps Python SDK](https://github.com/AgentOps-AI/agentops)
- [aimultiple: 15 AI agent observability tools 2026](https://research.aimultiple.com/agentic-monitoring/)
- [Dash0: GitHub Actions observability with OpenTelemetry](https://www.dash0.com/guides/github-actions-observability-opentelemetry-tracing)
- [builderz-labs/mission-control (self-hosted prior art)](https://github.com/builderz-labs/mission-control)
