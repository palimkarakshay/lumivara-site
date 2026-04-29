# Bot Workflow 🛠

> <!-- do-not-copy:v1 -->
> **🛠 Do not copy to client repos.** This page describes operator-side machinery that
> lives in the platform repo or in a per-client pipeline repo (`<brand-slug>/<client-slug>-pipeline`).
> Under [Pattern C (locked 2026-04-28)](../mothership/02b-pattern-c-architecture.md), a client cloning
> their `<client-slug>-site` repo cannot reach the pipeline repo at all — they are not added as
> a collaborator. If you are the operator scaffolding a new client repo, **omit this page from
> the per-client wiki**.

> **Pipeline lane.** Workflow YAML lives in the **pipeline repo** (`<slug>-pipeline`), and cron schedules fire from its `main` (the canonical GitHub Actions default-branch path — no overlay tricks). The site repo's `.github/workflows/` directory is empty by design. See [`docs/mothership/02b-pattern-c-architecture.md`](../mothership/02b-pattern-c-architecture.md) for the canonical two-repo model.

The day-to-day operation of the autopilot is automated. Here's how the pipeline works.

## Overview

```
Phone / terminal → GitHub Issue → Triage bot → Execute bot → Vercel preview → Operator merges
                                                       │
                                                       └── reads issues from <slug>-site via the
                                                           GitHub App; pushes auto/issue-N to
                                                           <slug>-site `main`. The workflow YAML
                                                           itself lives in <slug>-pipeline.
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
2. Creates branch `auto/issue-<n>` *on the site repo* via the GitHub App's installation token (the YAML driving this lives in the matched pipeline repo, which the client has no Read access to)
3. Implements the change
4. Runs `tsc` and `lint`
5. Opens a PR: `feedback(#n): <summary>`
6. Labels the issue `status/awaiting-review`

> On *this* repo (Phase 1 POC, pre-spinout), `auto/issue-*` branches sit alongside `main` and the workflow YAML + `scripts/` are co-housed with the site code. After the P5.6 spinout, the workflows + scripts move to the per-client `<slug>-pipeline` repo (operator-private), and the site repo's `.github/workflows/` directory is empty by design — invisible to the client by **permission**, not by branch listing.
>
> _Client example — see `docs/mothership/15-terminology-and-brand.md §7`._ The current Client #1 repo is `palimkarakshay/lumivara-site`; that mapping is one specific engagement, not the operator's default framing.

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
