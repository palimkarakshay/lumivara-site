# Vercel Production Integrity — master plan

This document is the operator's single source of truth for **how code gets to
production on Vercel** and **why production can never be silently overwritten
by older code**. It is referenced by the admin UI (`/admin/deployments`) and
by the `deploy-drift-watcher` workflow.

If you are dropping into this repo cold (operator is offline, agent crashed,
context was reset) read this first.

---

## 1. The four states a change can be in

Every change ("idea") flows through a fixed pipeline. Each state has exactly
one canonical artifact and one canonical owner.

| Stage         | Artifact                          | Who advances it          |
|---------------|-----------------------------------|--------------------------|
| `idea`        | A user message in n8n / web form  | Client                   |
| `triaged`     | Open GitHub issue with labels     | Triage workflow (Claude) |
| `executed`    | Branch + commits on the issue     | Execute workflow         |
| `pr-open`     | Open pull request linked to issue | Execute workflow         |
| `merged`      | Commit on `main`                  | Auto-merge or operator   |
| `previewed`   | Vercel **preview** deployment     | Vercel auto-build        |
| `prod-pending`| Promote attempt has been recorded | Production-guard         |
| `live`        | Vercel **production** deployment  | Vercel deploy hook       |

A change is **drift** if it is on `main` (`merged`) but not yet on production
(`live`). Drift is the bug the rest of this doc fixes.

---

## 2. Why production has been getting overwritten

Three independent failure modes have been observed:

1. **Out-of-order promotes.** Two PRs merge close together; the operator's
   n8n flow fires the deploy hook for the older PR's preview last, replacing
   newer code with older code in production. (See issue #51 — partially
   mitigated by `autoJobCancelation: true`, but `autoJobCancelation` only
   cancels concurrent **builds**; it does not order promotes.)
2. **Skipped promotes.** Several merged PRs (#23 cal.com link, #54 anchor
   links, #55 Crisp, #58 diagnostic completion, #61 padding, #76 Toronto
   time, #77 alt text, #79 llms.txt, #80 carbon-lean, #81 palette switcher,
   #97 admin Phase 1, #132 admin lib, #133 footer attribution, #146 KV
   adapter — see §6) shipped to **preview only** because the operator never
   fired the production deploy hook for them. The `vercel.json` `ignoreCommand`
   means the only path to production is an explicit deploy hook trigger; on
   `main` push, Vercel does **not** auto-promote.
3. **Stale preview re-promote.** The Vercel deploy hook redeploys the
   project's `main` branch. If the operator triggered it intending to ship
   a specific PR but `main` had already moved on, the hook deploys the
   newer `main` (a feature, not a bug, but easy to misread). The reverse —
   triggering it via the n8n flow that resolves a *specific old SHA* — has
   in fact pushed older code over newer.

Failure mode 3 is the dangerous one: production ends up older than `main`
and the dashboard says "Live", giving the operator false confidence.

---

## 3. The integrity contract

Production is governed by **one invariant**:

> The SHA running on Vercel production must always be a descendant of (or
> equal to) the previous production SHA, on the `main` branch's first-parent
> chronology.

In plain English: production only moves *forward*, never backward.

The contract is enforced at three layers:

| Layer                     | Where                                  | Mechanism                                  |
|---------------------------|----------------------------------------|--------------------------------------------|
| **Pre-flight (UI)**       | `/admin/deployments`                   | Hide / grey out "Promote" if guard fails   |
| **Pre-flight (server)**   | `confirmDeploy()` server action        | `assertSafePromotion()` from prod guard    |
| **Post-deploy (watcher)** | `deploy-drift-watcher.yml` cron        | Open `priority/P1` issue if drift detected |

A new SHA passes the guard iff:

1. It is reachable from `origin/main` (no off-tree deploys).
2. `git merge-base --is-ancestor <currentProdSha> <candidateSha>` returns true
   (the current prod SHA is an ancestor of the candidate — i.e., we are
   moving forward, not backward).
3. Its idempotency key has not been dispatched within the last 60s
   (existing protection — see `src/lib/admin/vercel.ts`).

If condition 2 fails, the UI shows:

> This change is *older* than what is currently live. Promoting it would
> overwrite newer work. Pick a more recent change, or contact the operator.

…and the server action returns `{ ok: false, error: "would_overwrite_newer" }`.

---

## 4. The "Promote to production" mechanism (non-technical view)

What the client sees is two buttons per request:

```
┌─────────────────────────────────────────────────────────┐
│  Ready for your test                                    │
│  This change is live in preview but not on your site.   │
│                                                         │
│   [ View test build ↗ ]    [ Confirm deploy → live ]    │
│                                                         │
│  ● Idea  ● Triaged  ● Built  ● Preview  ○ Live         │
└─────────────────────────────────────────────────────────┘
```

The 5-dot timeline gives a non-technical client a complete picture without
exposing branches, SHAs, or workflows.

What happens when they tap **Confirm deploy**:

1. Browser → server action `confirmDeploy(slug, issueNumber, prHeadSha)`.
2. Server action calls `assertSafePromotion(prHeadSha)` — the guard.
3. If safe, an idempotency key is reserved and a signed payload is POSTed
   to the n8n deploy webhook (`N8N_DEPLOY_WEBHOOK_URL`).
4. n8n verifies the HMAC, records the attempt, and fires the per-client
   Vercel Deploy Hook (`VERCEL_DEPLOY_HOOK_<CLIENT>`).
5. Vercel builds and promotes the latest `main` to production.
6. Vercel's `deployment.succeeded` webhook → n8n → marks the issue
   `status/done`, sends "your change is live" email/SMS to the client.

The client sees the badge flip from amber **Deploying now…** to green
**Live**, with no exposure to any of steps 2–6.

---

### 4a. Per-commit promote (operator-only)

`/admin/deployments` exposes two distinct affordances on a client's drift
card:

1. **Promote tip of main → production** (existing). Bundles every pending
   change into one production deploy. Use when shipping a batch.
2. **Promote `#NN` → production** (per drift row). Promotes one specific
   squash-merge SHA so a single completed issue can ship on its own.

Both go through the same `assertSafePromotion()` guard, so the integrity
contract holds either way:

- Picking an *older* drift commit than tip of main promotes up to that
  commit and leaves later drift pending. Run another promote to flush the
  rest.
- Picking a SHA that is older than current production is **refused** with
  the standard `would_overwrite_newer` message — true cherry-pick of a
  commit that sits behind production is not supported here.
- Picking a SHA that already serves production no-ops cleanly.

Per-commit promote is operator-only (admin allow-list gated). The
client-facing `confirmDeploy` path on `/admin/client/[slug]/request/[number]`
is unchanged and still gated on the tier's `deployApproval` feature.

---

## 5. The drift watcher (mothership self-healing)

Even with all the pre-flight checks above, drift is still possible if the
operator merges a PR but never opens the admin (passive failure mode 2). To
catch this:

`.github/workflows/deploy-drift-watcher.yml` runs every 30 minutes and:

1. Calls Vercel API → latest `READY` production deployment → `prodSha`.
2. Computes `git log <prodSha>..origin/main --first-parent`.
3. For each commit in the range:
   - Resolves the merge-PR via `gh pr list --search SHA`.
   - Tests whether the PR's file list matches the `vercel.json` `ignoreCommand`
     regex (`^(src/|public/|package\.json|next\.config|tailwind\.config|postcss\.config)`).
4. If any deployable PR is in the range, the watcher opens (or comments on)
   a `status/needs-triage`, `priority/P1`, `area/infra`, `auto-routine`
   GitHub issue titled **"Production drift: N changes pending"**, listing
   the PRs and offering one-click promote URLs.

The mothership Triage and Execute workflows pick this issue up exactly like
any other and Claude either:

- **Auto-promotes** if every PR is `complexity/trivial` or `complexity/easy`
  and not labelled `area/design`/`type/design-cosmetic`.
- **Asks the operator to promote** via the standard `needs-client-input`
  ask-flow if any PR is more complex than that.

This is the "automatic small GitHub issues for Claude to pick up" loop the
operator asked for — it converts production-drift incidents into structured
issues the existing Triage/Execute pipeline already knows how to resolve.

---

## 6. Backfill — issues currently in drift (best-effort inventory)

Generated from `git log` against `main` plus PR file inspection. The
authoritative list is the live output of `/admin/deployments`; this static
list is for the first-time backfill burndown of issue #50.

> ⚠️ Promotion order matters — promote in the order shown so the integrity
> contract holds. Each row is **deployable** (touches src/public/config).

| Order | PR    | Issue | Title (short)                              | Notes                              |
|-------|-------|-------|--------------------------------------------|------------------------------------|
| 1     | #23   | #16   | Cal.com link → cal.com/akshaypalimkar      | Earliest content fix.              |
| 2     | #27   | #3    | Diagnostic progress-bar visibility         |                                    |
| 3     | #47   | #1    | Brand voice in authored content            |                                    |
| 4     | #49   | #13   | Nav rename: Our Approach / Services        |                                    |
| 5     | #53   | #10   | Remove numbered section labels             | Per #50, was preview-only.         |
| 6     | #54   | #12   | FAQ in-page anchor links                   |                                    |
| 7     | #55   | #32   | Crisp live chat widget                     |                                    |
| 8     | #58   | #4    | Diagnostic completion flow                 |                                    |
| 9     | #59   | #24   | System theme option                        |                                    |
| 10    | #61   | #11   | Reduce padding on mobile                   |                                    |
| 11    | #62   | #29   | WCAG fixes + axe-core                      |                                    |
| 12    | #63   | #31   | Beehiiv newsletter API route               | New API surface — re-test post-promote. |
| 13    | #69   | #35   | Three demo insight articles                |                                    |
| 14    | #76   | #22   | Toronto time (ET) in footer                |                                    |
| 15    | #77   | #7    | Alt text + initials placeholder            |                                    |
| 16    | #79   | #44   | llms.txt route + JSON-LD                   |                                    |
| 17    | #80   | #45   | Asset delivery + carbon-lean badge         |                                    |
| 18    | #81   | #17   | Color palette switcher                     |                                    |
| 19    | #97   | #91   | Admin portal Phase 1                       | Adds /admin route — auth required. |
| 20    | #132  | —     | Shared admin lib + design primitives       | No-op without the consumers below. |
| 21    | #133  | #107  | "Powered by Lumivara Forge" footer         | Brand updated 2026-04-29 per `15 §4` lock; previously tracked under the retired working name. |
| 22    | #146  | —     | Vercel KV adapter (magic-link verification) | Required env: `KV_REST_API_*`.    |

Promoting `main` once now lands all 22 simultaneously (Vercel always builds
from the tip of `main`). There is no per-PR promote on Vercel — the choice
is binary: promote `main`'s tip or don't promote. The **order matters only
for which features are reviewable in production at a given moment**, not
for the deploy mechanism.

After the first backfill promote, `/admin/deployments` will show **drift = 0**
and every subsequent merge will appear there until the operator (or the
client, on Growth+ tiers) confirms the promote.

---

## 7. Resume protocol — what to do if this run was interrupted

Every change in this branch is committed individually. To resume:

1. `git fetch origin claude/fix-production-deployment-BuaWE`
2. `git log --oneline origin/claude/fix-production-deployment-BuaWE`
   — the last commit on the branch is the resume point.
3. Map the last commit's subject against `docs/deploy/production-integrity.md`
   §8 ("Build sequence") and pick up at the next item.
4. The PR description's checklist (in `docs/deploy/RESUME.md`) tracks
   what's done and what's left.

---

## 8. Build sequence (this PR)

This PR ships in 9 commits. Each is independently reviewable.

1. ✅ docs/deploy/production-integrity.md (this file).
2. `src/lib/admin/main-history.ts` — list main commits since SHA + linked PRs.
3. `src/lib/admin/vercel.ts` — extend with `latestProductionDeployment()`.
4. `src/lib/admin/production-guard.ts` — `assertSafePromotion()`.
5. `src/lib/admin/deploy-log.ts` — Upstash KV append-only log.
6. `src/app/admin/deployments/page.tsx` + `DeploymentTimeline` component.
7. `src/app/admin/client/[slug]/request/[number]/actions.ts` — wire guard.
8. `.github/workflows/deploy-drift-watcher.yml` — 30-min drift cron.
9. `docs/deploy/RESUME.md` + PR description.

---

## 9. Vercel mirror checklist (operator-side)

The PR cannot configure Vercel itself. After merge, the operator must:

- [ ] In Vercel project → Settings → Environment Variables, ensure
      `VERCEL_API_TOKEN` (read-only, project-scoped),
      `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`,
      `KV_REST_API_URL`, `KV_REST_API_TOKEN`,
      `N8N_DEPLOY_WEBHOOK_URL`, `N8N_HMAC_SECRET` are all present in **all
      environments** (Production, Preview, Development).
- [ ] In Vercel → Settings → Webhooks, add a webhook for `deployment.succeeded`
      and `deployment.error` events pointing at `${N8N_BASE_URL}/webhook/vercel-deploy-status`.
- [ ] In GitHub repository secrets, add `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`,
      `VERCEL_TEAM_ID` so the `deploy-drift-watcher` workflow can call the
      Vercel API.
- [ ] Run the "Backfill" promote once (§6) by visiting `/admin/deployments`
      and clicking **Promote tip of main** — confirms drift goes to zero.

Then remove the `needs-vercel-mirror` label on this PR.
