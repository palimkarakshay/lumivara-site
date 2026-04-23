# Backlog — Issues + Projects

The backlog lives in GitHub Issues, grouped in a Project v2 board called **Lumivara Backlog**. This file is the map.

## Source of truth

- **Capture**: new items → `gh issue create` (from desk) or HTTP Shortcuts → `POST /repos/.../issues` (from phone). See [PHONE_SETUP.md](../PHONE_SETUP.md).
- **Triage**: `.github/workflows/triage.yml` runs daily at 06:00 UTC. It classifies new issues (priority, complexity, area) using the rubric in [`scripts/triage-prompt.md`](../scripts/triage-prompt.md), adds labels, comments with rationale, moves the issue into the right Project column.
- **Execute**: `.github/workflows/execute.yml` runs every 8 hours. It picks the top-ranked `auto-routine` open issue, implements it on a branch `auto/issue-<n>`, opens a PR. Never merges. See [`scripts/execute-prompt.md`](../scripts/execute-prompt.md).
- **Ship**: you review the PR on phone via GitHub Mobile, merge when happy. Merge closes the referenced issue.

## Labels

| Group | Labels | Meaning |
|-------|--------|---------|
| Priority | `priority/P1` `priority/P2` `priority/P3` | P1 = urgent / blocking; P2 = within a week; P3 = whenever |
| Complexity | `complexity/trivial` `easy` `medium` `complex` | Rough effort estimate — bot refuses to auto-work `complex` |
| Area | `area/site` `content` `infra` `copy` `design` `seo` `a11y` `perf` | Lets you filter the board |
| Status | `status/needs-triage` `planned` `in-progress` `blocked` `needs-clarification` | Lifecycle state |
| Gating | `auto-routine` / `human-only` | Whether `execute.yml` is allowed to pick it up |

New issues start with `status/needs-triage`. Triage removes that and adds `status/planned` + priority/complexity/area + one of `auto-routine`/`human-only`.

## Project v2 columns

Suggested board layout (you'll create this manually — v2 API is fiddly):

| Column | What's here |
|--------|-------------|
| Inbox | `status/needs-triage` — newly captured, not yet classified |
| Triaged | `status/planned` — classified, awaiting pickup |
| In Progress | `status/in-progress` — bot or human actively working |
| Review | Has an open linked PR (`auto-routine` label on PR) |
| Done | Closed |

Enable the built-in workflow **Auto-add to project** in the Project settings so every new issue in the repo lands in Inbox automatically.

## Writing a good issue

The auto-routine works best on self-contained issues. Good example:

> **Title:** Add article "The diagnostic-first HR advisor" to insights
> **Body:** Create `src/content/insights/diagnostic-first-advisor.mdx`. Category: `perspective`. Reading time: 5 min. Date: today. The body is pasted below. No links to external docs, no image assets.
> ```
> [full article markdown here]
> ```

Bad example (bot will flag `needs-clarification`):

> **Title:** Make the hero better

For phone capture, prefix the title with `[P1]` / `[P2]` / `[P3]` if you already know the urgency — triage respects hints from the title. Otherwise the bot picks.

## Reverting a change

Each auto-routine PR is one commit or a tight range. To undo after merging:

```bash
git log --grep '^feedback(#' --oneline              # list auto-commits
git revert <sha>                                    # reverse one
git push
```

If you want to abandon an issue mid-flight, close it (or add `human-only`) — the bot checks status labels on every run and won't re-pick a closed one.

## Manual triggers (from your desk or phone)

Any of these can be fired via the Actions tab, `gh workflow run`, or an HTTP Shortcuts request to `POST /repos/.../actions/workflows/<name>.yml/dispatches`:

| Workflow | When you'd manually run it |
|----------|-----------------------------|
| `triage.yml` | Just captured a batch of items from phone, don't want to wait for the daily run |
| `execute.yml` | You cleared the P1 queue and want the bot to start on P2 |

## When to bypass the bot

Fast-track anything by labeling `human-only` — it drops out of auto-selection and you work it manually. Good reasons:
- Needs a screen-share or design review
- Touches something on the exclusion list (workflows, env vars, contact API endpoint, dependency upgrades)
- You want to do it yourself to keep your hands in the code

## Cost / usage

Both workflows use your Claude Pro/Max subscription via `CLAUDE_CODE_OAUTH_TOKEN`, not an API key. Usage counts against the same 5-hour rolling window as your interactive Claude Code sessions. If the bot starts eating too much of your budget:

- Reduce `execute.yml` cron from `0 0,8,16` to `0 8` (once a day)
- Raise the bar for what gets `auto-routine` during triage (only `priority/P1` + `complexity/trivial|easy`)
- Pause entirely: edit the schedule line to `- cron: '0 0 1 1 *'` (January 1st only), or comment the `schedule:` block out and rely on `workflow_dispatch` only.
