# Resume protocol — production-integrity work

If a Claude session, GitHub Action, or operator step in the
production-deployment automation gets interrupted, this is the doc that
tells the next agent / operator where to pick up.

This doc is intentionally short. Detail lives in
`docs/deploy/production-integrity.md`; this is the **runbook**.

---

## 0. Immediate triage (read first)

```
 a) Is production currently broken?
    → Open Vercel dashboard. If the most recent prod deploy state is
      "ERROR", roll back via Vercel UI ("Promote" on the previous
      READY deploy). Then file a P0 issue. Stop reading this doc.

 b) Is /admin/deployments showing red banners?
    → Follow the on-screen text. The page is the source of truth.

 c) Otherwise:
    → Continue with §1 below.
```

---

## 1. Where this PR left off

Inspect the branch commit list:

```bash
git fetch origin claude/fix-production-deployment-BuaWE
git log --oneline origin/main..origin/claude/fix-production-deployment-BuaWE
```

The expected commit ladder, in order:

| #   | Subject                                                          |
|-----|------------------------------------------------------------------|
| 01  | `docs(deploy): add Vercel production-integrity master plan`     |
| 02  | `feat(admin): add main-history walker for promote-tracking`     |
| 03  | `feat(admin): add latestProductionDeployment to vercel lib`     |
| 04  | `feat(admin): add production-guard with forward-only invariant` |
| 05  | `feat(admin): wire confirmDeploy through production-guard + KV` |
| 06  | `feat(admin): add /admin/deployments dashboard`                 |
| 07  | `ci: add deploy-drift-watcher cron`                             |
| 08  | `docs(deploy): add resume protocol + backfill script`           |

If you don't see all 8 on origin, the next commit to add is the next one
in the table. Each commit is independently small, so just rebuild it
from the matching source-of-truth file:

| Commit | Source of truth                                                 |
|--------|------------------------------------------------------------------|
| 01     | `docs/deploy/production-integrity.md`                           |
| 02     | `src/lib/admin/main-history.ts`                                 |
| 03     | `src/lib/admin/vercel.ts` (`latestProductionDeployment` export) |
| 04     | `src/lib/admin/production-guard.ts`                             |
| 05     | `src/lib/admin/deploy-log.ts` + `actions.ts` edit               |
| 06     | `src/app/admin/deployments/{page,actions}.tsx` + components     |
| 07     | `.github/workflows/deploy-drift-watcher.yml`                    |
| 08     | `docs/deploy/RESUME.md` + `scripts/lib/inventory_backfill.py`   |

---

## 2. After the PR merges — first-time backfill

> The operator must do this once.

1. Confirm Vercel env vars are set per `production-integrity.md` §9.
2. Add the same vars to GitHub repository secrets (`VERCEL_API_TOKEN`,
   `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`).
3. Open `/admin/deployments`. Confirm the **Drift card** lists the PRs
   from `production-integrity.md` §6 (or fewer — auto-merge may have
   shipped some by then).
4. Click **Promote tip of main → production**. The production-guard
   should accept (no current production SHA, or current SHA is an
   ancestor of `main`). Confirm in the popup.
5. Wait 60–120 s for Vercel to build. The card flips to **No drift**.
6. Verify on the public site: the merged features are now live.
7. Close issue #50 with a comment linking back to this PR.
8. The drift watcher cron will now keep things honest going forward.

If step 4 returns `would_overwrite_newer`, **stop**. Read the message;
production is currently *ahead* of `main`, which can only happen if a
commit was reverted or the `main` ref was rewound. Investigate before
doing anything else.

---

## 3. If the drift watcher itself errors

1. Check Actions → Deploy drift watcher → latest run.
2. The most common failure: `VERCEL_API_TOKEN` not set in repo secrets.
   Set it; re-run.
3. If the Vercel API returned 401: token expired. Generate a new
   project-scoped read-only token, replace the secret.
4. If the watcher opens duplicate issues, close the older ones; the
   issue search is matched on the `deploy-drift` label so the watcher
   only ever maintains one open issue at a time.

---

## 4. If `/admin/deployments` shows "configuration not complete"

Set, in **Vercel → Settings → Environment Variables**, in **all**
environments (Production, Preview, Development):

| Variable                | Why                                            |
|-------------------------|------------------------------------------------|
| `VERCEL_API_TOKEN`      | Read prod state + preview lookup               |
| `VERCEL_PROJECT_ID`     | Scope the API calls                            |
| `VERCEL_TEAM_ID`        | If the project is on a team plan               |
| `GITHUB_TOKEN`          | Walk main, fetch PR titles                     |
| `GITHUB_REPO`           | `palimkarakshay/lumivara-site`                 |
| `KV_REST_API_URL`       | Persist deploy-attempt audit log               |
| `KV_REST_API_TOKEN`     | Persist deploy-attempt audit log               |
| `N8N_DEPLOY_WEBHOOK_URL`| Where the dispatched promote actually goes     |
| `N8N_HMAC_SECRET`       | Sign promote payloads                          |

Then redeploy (an env-var change requires a fresh build).

---

## 5. Resume budget guidance (Claude sessions)

- The `production-integrity.md` plan is split into 8 independent
  commits. If a session hits the 80% turn watermark mid-commit, finish
  the in-flight one and stop — the next run picks up at the next item
  in §1's table.
- The drift watcher fires every 30 min; even if a session never resumes,
  the watcher will continue surfacing drift via issues so the operator
  is never blind.
- Store progress in commit messages, not in chat. Anyone can resume by
  reading `git log --oneline`.

---

## 6. Escalation

If §1–5 don't resolve the situation:

1. Disable the drift watcher temporarily (`gh workflow disable
   deploy-drift-watcher.yml`).
2. Roll back to the last known good prod deploy via Vercel UI.
3. Open a `priority/P0` issue with the title prefix
   `[deploy-incident]` describing what you saw and what you did.
4. Page the operator if they're not already on it.
