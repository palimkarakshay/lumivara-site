# AI Ops Dashboard

Mobile-first single-page app for controlling the AI agents that run via
GitHub Actions in this repo. Hosted on GitHub Pages, runs entirely in the
browser, talks to GitHub directly using a fine-grained Personal Access
Token stored in `localStorage`.

> Live URL (after first deploy): `https://palimkarakshay.github.io/lumivara-site/`

## What it does

| Panel              | Action                                                                          |
| ------------------ | ------------------------------------------------------------------------------- |
| Brain Controller   | Collapsible. Read/write `DEFAULT_AI_MODEL` + arm `NEXT_RUN_MODEL_OVERRIDE`      |
| Workflows          | Filtered by allowlist. Pause/resume **and** pause-for-duration (1h/4h/1d/1w)    |
|                    | Each row shows next scheduled run derived from cron                             |
| Recent runs        | Last 25 cards, filtered to triage/execute by default; "Show all" toggle         |
| Thinking           | Pull THINKING blocks (`>>> THINKING … <<< END THINKING`) out of logs            |
| Merge & deploy     | Squash-merge a PR from a green PR-triggered run                                 |
| Pull to refresh    | Drag down ~80 px from the top to invalidate every query                         |
| Error reporting    | Tree + window-level capture; one-tap "Report to triage" opens an auto-routine issue |
| Responsive layout  | Single column on phones, 2-column workflows + runs grid on `lg+`                |

## Server-side companion workflows

| File                                       | Purpose                                                  |
| ------------------------------------------ | -------------------------------------------------------- |
| `.github/workflows/deploy-dashboard.yml`   | Builds + deploys the SPA to Pages on `dashboard/**` push |
| `.github/workflows/auto-resume.yml`        | Every 15 min, re-enables workflows whose pause expired   |
| `.github/workflows/report-failure.yml`     | Files `auto-routine` issue on any monitored CI failure   |

## Operator setup (one-time)

This is a condensed checklist — see the conversation that introduced the
dashboard for the full "why" on each step.

### 1. Generate a fine-grained PAT

Settings → Developer settings → Personal access tokens → **Fine-grained**.

- **Repo access:** only `palimkarakshay/lumivara-site`
- **Permissions** (all are required — the most common operator footgun
  is forgetting `Variables`, which silently 403s every Brain Controller
  click and most pause-for-duration actions):

  | Permission | Level         | Used by |
  | ---------- | ------------- | ------- |
  | Actions    | Read & write  | runs list, Run now, pause/resume, fetch logs |
  | Contents   | Read & write  | merge PR, fetch workflow YAML for cron parsing |
  | Pull requests | Read & write | merge PR, read PR title |
  | **Variables** | **Read & write** | **Brain Controller, pause-for-duration schedule** |
  | Workflows  | Read & write  | optional — only if you want the dashboard to edit YAML |
  | Metadata   | Read          | mandatory baseline |

- **Expiration:** 90 days. Calendar a rotation reminder.

#### Troubleshooting 403s

The dashboard now names the missing scope inline (e.g.
"Forbidden (403). Your PAT likely needs **Variables: Read & write**.").
Common signatures:

| Symptom                                      | Likely missing scope    |
| -------------------------------------------- | ----------------------- |
| Brain Controller chips stuck at "—"          | Variables: Read         |
| "Apply" / model save toast says 403          | Variables: Write        |
| "Run now" returns 403                        | Actions: Write          |
| "Merge & deploy" returns 403                 | Pull requests / Contents: Write |
| Intermittent 403s on otherwise-working calls | Secondary rate limit. Wait a minute. |

### 2. Configure GitHub Pages

Settings → Pages → **Source = `GitHub Actions`** (not "Deploy from a branch").
The `deploy-dashboard.yml` workflow uses the Pages-native deploy action.

### 3. Workflow permissions

Settings → Actions → General →
**Workflow permissions = Read and write**, so `deploy-dashboard.yml` can
upload the Pages artifact and deploy.

### 4. Seed the repo variables

Settings → Secrets and variables → Actions → Variables tab.

| Name                       | Initial value | Notes                                                                 |
| -------------------------- | ------------- | --------------------------------------------------------------------- |
| `DEFAULT_AI_MODEL`         | `sonnet`      | Read by `execute.yml`                                                 |
| `NEXT_RUN_MODEL_OVERRIDE`  | *(empty)*     | One-shot, no auto-clear (yet)                                         |
| `WORKFLOW_PAUSE_SCHEDULE`  | *(empty)*     | Pipe-separated `until=<iso>;path=<workflow>` entries; auto-managed by the dashboard + `auto-resume.yml` |

Optional:

- `DASHBOARD_BASE_PATH` — set to `/` if you move to a custom domain.

### 5. Operator-only secret for auto-resume (optional but recommended)

The `auto-resume.yml` workflow needs to write back to repo Variables to
clear expired pauses. Add a fine-grained PAT as a secret named
`OPS_VARIABLES_TOKEN` with these scopes:

- Variables: Read & write
- Actions: Read & write
- Metadata: Read

Without it, pause-for-duration becomes "pause indefinitely" — the
dashboard still pauses workflows correctly, but expiry stops being
enforced and you have to clear pauses by hand.

### 5. First deploy

Push these files to `main` (or merge the PR). Then go to
**Actions → Deploy AI Ops dashboard → Run workflow** to trigger the first
build manually. After it goes green, refresh the Pages settings panel —
you'll see the live URL.

### 6. First load on your phone

1. Open the Pages URL.
2. Paste your PAT into the AuthGate modal. The token is verified against
   `GET /user` before being saved.
3. Add to home screen for a standalone, thumb-friendly experience.

## How the variables flow into CI

```
Operator → Dashboard → Repo Variables → Workflow runs

  DEFAULT_AI_MODEL          read by execute.yml only.
                            Picks the Claude tier (haiku|sonnet|opus)
                            for code-implementation runs.

  NEXT_RUN_MODEL_OVERRIDE   read by triage.yml AND execute.yml.
                            Wins over DEFAULT_AI_MODEL on the next run.
                            For triage, also engine-maps to
                            claude/gemini/codex.
```

### Important: the override does NOT auto-clear

The next CI run *consumes* `NEXT_RUN_MODEL_OVERRIDE` (reads it, prints
the source in the run summary), but it **does not clear it** — that
would require giving CI a PAT with `Variables: write`, which we've
deferred.

The dashboard surfaces an "armed" indicator and a Clear button. Discipline:

> Set the override → wait for the next run to start → clear it manually.

If you forget, every subsequent run will use the override until cleared.

## Local development

```sh
cd dashboard
npm install
npm run dev    # http://localhost:5173/lumivara-site/
npm test       # vitest — cron parser, log extractor, codecs, error mapping
```

Set a PAT via the AuthGate modal once. The dev server proxies nothing —
all calls go directly to `api.github.com`, so CORS is handled by GitHub.

## Architecture notes

- **No backend.** Every API call is browser → `api.github.com`.
- **No router.** Single view; `useState` toggles the log modal.
- **`@octokit/rest`** for typed API calls.
- **`@tanstack/react-query`** for caching, optimistic updates, and the
  30-second background refresh on the runs list.
- **Tailwind 3** (project-local; doesn't conflict with the parent
  Next.js app's Tailwind 4 — separate `npm` tree, separate build).
- **PAT scope:** localStorage. Rotate every 90 days. If your phone is
  lost, revoke the token in GitHub Settings — that's the kill switch.

## Why not deploy to Vercel?

The parent site lives on Vercel. This SPA lives on GitHub Pages so it
ships from the same repo without an extra deploy target, and so its
deploys don't count against the Vercel build minutes that the marketing
site uses. The parent's `vercel.json` `ignoreCommand` already excludes
`dashboard/**` from triggering Vercel builds.
