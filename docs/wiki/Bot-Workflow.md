# Bot Workflow

The day-to-day operation of this repo is automated. Here's how the pipeline works.

## Overview

```
Phone / terminal → GitHub Issue → Triage bot → Execute bot → Vercel preview → You merge
```

## Step by step

### 1. Capture (you)
Create a GitHub Issue describing what you want. Use the **Site change request** issue template.

The issue gets label `status/needs-triage`.

### 2. Triage (daily, 06:00 UTC)
The triage bot (Claude Haiku via GitHub Actions) reads new issues and applies:
- `priority/P0`–`P3` — urgency
- `complexity/XS`–`XL` — estimated effort  
- `area/copy`, `area/design`, etc. — affected area
- `auto-routine` — safe for bot to implement autonomously
- `human-only` — requires a human (ambiguous, sensitive, or flagged)
- `status/needs-clarification` — bot has questions; check the issue comment

### 3. Execute (every 8 h at 00:00, 08:00, 16:00 UTC)
The execute bot (Claude Sonnet via GitHub Actions):
1. Picks the top-ranked `auto-routine` issue
2. Creates branch `auto/issue-<n>`
3. Implements the change
4. Runs `tsc` and `lint`
5. Opens a PR: `feedback(#n): <summary>`
6. Labels the issue `status/awaiting-review`

### 4. Preview (automatic)
Vercel's GitHub integration deploys a preview URL within ~60 s of the PR push and posts it as a comment on the PR.

### 5. Review (you)
Open the PR in GitHub Mobile:
- Read the diff
- Tap the Vercel preview link — check it on your phone
- If happy: tap **Merge pull request**
- If not: add a comment with feedback and close the PR (the issue stays open for a future run)

### 6. Deploy (automatic)
Merging to `main` triggers Vercel's production build (~60 s). The live site updates.

## Labels reference

| Label | Meaning |
|---|---|
| `status/needs-triage` | New, not yet classified |
| `status/planned` | Classified, queued for the bot |
| `status/in-progress` | Bot is currently working on it |
| `status/awaiting-review` | PR open, waiting for operator to merge |
| `status/needs-clarification` | Bot needs more info before it can proceed |
| `status/needs-continuation` | Bot hit the session budget limit mid-task |
| `auto-routine` | Safe for automated execution |
| `human-only` | Bot will not touch this |
| `priority/P0` | Drop everything |
| `priority/P1` | Work next auto-run |
| `priority/P2` | Soon |
| `priority/P3` | Backlog |
| `needs-vercel-mirror` | Operator must update Vercel dashboard settings |

## Session budget

The bot shares the operator's Claude Pro 5-hour rolling quota. To keep interactive Claude sessions fast:
- The triage bot processes 5–10 issues per run
- The execute bot handles ONE issue per run
- At ~50% of its turn budget, the bot finishes the current issue and stops
- At ~80%, the bot hard-exits and labels the issue `status/needs-continuation`

## Bypassing the bot

To prevent the bot from touching an issue:
- Label it `human-only`

To force the bot to attempt a specific issue immediately (regardless of priority order):
- Use the **Manual Single-Issue** workflow: Actions → execute-single → Run workflow → enter issue number.
