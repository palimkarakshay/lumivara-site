# Bot Workflow 🛠

> <!-- do-not-copy:v1 -->
> **🛠 Do not copy to client repos.** This page describes operator-side machinery that
> lives on the mothership repo or on the `operator/main` overlay branch of a client
> repo. A client cloning their `main` will never see this content. If you are the
> operator scaffolding a new client repo, **omit this page from the per-client wiki**.

> **Operator lane.** This pipeline runs on the **`operator/main`** overlay branch of every client repo (and on the mothership's own `main`). Clients never see the workflow YAML, the bot playbooks, or this page. See `docs/mothership/02-architecture.md §1` for the two-branch model and Pattern C overall.

The day-to-day operation of the autopilot is automated. Here's how the pipeline works.

## Overview

```
Phone / terminal → GitHub Issue → Triage bot → Execute bot → Vercel preview → Operator merges
                                                       │
                                                       └── runs against `<client-repo>` `main`,
                                                           workflow YAML lives on `operator/main`
```

## Step by step

### 1. Capture (operator)
Create a GitHub Issue describing what you want. Use the **Site change request** issue template.

The issue gets label `status/needs-triage`.

### 2. Triage (every 15 min)
The triage bot (Claude Opus via GitHub Actions, with Gemini Flash + gpt-5.5 as fallbacks) reads new issues and applies:
- `priority/P0`–`P3` — urgency
- `complexity/XS`–`XL` — estimated effort
- `area/copy`, `area/design`, etc. — affected area
- `auto-routine` — safe for bot to implement autonomously
- `human-only` — requires a human (ambiguous, sensitive, or flagged)
- `status/needs-clarification` — bot has questions; check the issue comment

### 3. Execute (every hour)
The execute bot (Claude Opus via GitHub Actions in the quality-first phase):
1. Picks the top-ranked `auto-routine` issue
2. Creates branch `auto/issue-<n>` *on the client repo's `main`* (the YAML driving this lives on `operator/main`)
3. Implements the change
4. Runs `tsc` and `lint`
5. Opens a PR: `feedback(#n): <summary>`
6. Labels the issue `status/awaiting-review`

> On the *current* `palimkarakshay/lumivara-site` (Client #1 + mothership-in-progress), `auto/issue-*` branches sit alongside `main` because the two-branch overlay has not landed yet. On a clean per-client repo, the workflow YAML and `scripts/` live on `operator/main` only and are invisible to the client's `main`.

### 4. Preview (automatic)
Vercel's GitHub integration deploys a preview URL within ~60 s of the PR push and posts it as a comment on the PR.

### 5. Review (operator)
Open the PR in GitHub Mobile:
- Read the diff
- Tap the Vercel preview link — check it on the phone
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

## Session charter (quality first)

The bot shares the operator's Claude **Max 20x** 5-hour rolling quota. The current phase optimises for best-possible outcome, not cost:
- The triage bot processes up to ~25 issues per run on Opus
- The execute bot handles up to 3 issues per cron run, sequentially, on Opus
- At ~80% of its turn budget, the bot finishes the current issue and stops
- At ~95%, the bot hard-exits and labels the issue `status/needs-continuation`

## Bypassing the bot

To prevent the bot from touching an issue:
- Label it `human-only`

To force the bot to attempt a specific issue immediately (regardless of priority order):
- Use the **Manual Single-Issue** workflow: Actions → execute-single → Run workflow → enter issue number.

> **Clients cannot bypass the bot — they have no write access on their repo until handover.** A client's interaction surface is the issue template (and, eventually, the admin portal). The autopilot is the only thing that lands code edits, and the operator is the only human merger. See `docs/mothership/07-client-handover-pack.md` for the handover gates that change this posture.
