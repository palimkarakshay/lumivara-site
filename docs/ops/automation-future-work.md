<!-- OPERATOR-ONLY. The "what to add next" addendum to docs/ops/automation-map.md. -->

> _Lane: 🛠 Pipeline._

# Automation — future work

Deferred / proposed workflows, scripts, crons, and jobs that the existing pipeline does NOT yet implement, ranked for the **aggressive deploy-push phase** (quality + performance + 24/7 utilisation > cost). Each row names the industry standard or established practice it follows so the operator can audit the rationale, not just the suggestion.

The companion file is [`automation-map.md`](./automation-map.md) (what's already running). This file is the queue of what comes next.

## §0 — The headline gap

**There is no PR-gating CI workflow today.** `package.json` defines `lint`, `test`, `build`, and `e2e` (Playwright) scripts, but nothing runs them on `pull_request`:

```json
"build": "next build",
"lint": "eslint .",
"test": "vitest run",
"test:e2e": "playwright test"
```

Vercel's preview build runs `next build` (which includes typecheck) implicitly, so type errors are caught. Everything else — ESLint, Vitest unit tests, the existing `e2e/a11y.spec.ts` axe-core spec, the `e2e/smoke.spec.ts` smoke spec — is **not enforced**. Any PR can land code that breaks lint, fails tests, or introduces critical/serious axe violations.

Closing this gap is the single highest-leverage automation change available; everything below assumes it lands first.

## §1 — Quality + performance gates (block bad code before it lands)

### 1.1 Core CI workflow (lint + unit tests + a11y e2e)
**Standard:** Industry baseline — every production repo runs lint + tests on PR. The repo already has the scripts; the workflow is what's missing.

**Sketch.** New `.github/workflows/ci.yml` triggered on `pull_request` and `push` to `main`. Steps:

1. `npm ci`
2. `npm run lint`  → fail PR on violations
3. `npx tsc --noEmit` → fail PR on type errors (Vercel does this implicitly; the explicit gate produces a clear PR check)
4. `npm test` (Vitest unit tests)
5. `npx playwright install --with-deps chromium`
6. `npm run test:e2e` (runs both `e2e/smoke.spec.ts` and `e2e/a11y.spec.ts` — the existing axe-core spec is the a11y enforcement)

**Cost.** Free; runs on the GitHub-hosted runner. ~3-5 minutes per PR.

**Why now.** Demo-readiness gate (POC §6.3) requires passing a11y gate; that requirement is met by `e2e/a11y.spec.ts` *only if it actually runs*. Today it does not.

---

### 1.2 Lighthouse CI on every Vercel preview
**Standard:** Google [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) — the canonical web-perf gate. Already a load-bearing claim in the prospective-client deck (`docs/decks/04-prospective-client-deck.md` slide 9 — "90+ Lighthouse").

**Why now.** POC §6.3 row 6.11 (demo-readiness) requires Lighthouse 90+ on every page. Today there is no CI enforcement; a regression slips through silently.

**Sketch.** New `.github/workflows/lighthouse-ci.yml` triggered on `pull_request`. After Vercel's preview is `READY`, run `treosh/lighthouse-ci-action@v12` against the preview URL with a `lighthouserc.json` that asserts: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90. Post results as a PR comment; fail the check on regression.

**Cost.** Free; runs on the GitHub-hosted runner.

---

### 1.3 Bundle-size budget gate
**Standard:** [`@next/bundle-analyzer`](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer) + [`size-limit`](https://github.com/ai/size-limit) for explicit per-route budgets.

**Why now.** Bundle bloat is the single biggest cause of LCP regressions on Next.js apps. Without a budget gate it surfaces only in the next Lighthouse run (after merge).

**Sketch.** Add `.size-limit.json` (per-route budgets, e.g. ≤ 200 KB JS for `/`). New workflow `.github/workflows/size-limit.yml` runs on `pull_request` and posts the diff vs. base.

**Cost.** Free.

---

## §2 — 24/7 utilisation (operator's stated goal: maximise Max 20x value)

The operator pays Max 20x regardless of usage; the goal is to keep the bots productive round the clock. The cadence bumps in PR #223 are the first half of this; the rows below are the rest.

### 2.1 Cron-trigger `execute-complex.yml`
**Why now.** `execute-complex.yml` is dispatch-only today, so `complexity/complex` issues sit idle until the operator manually fires it. With Max 20x quota the bot can chew through one of these every 4-6 hours overnight.

**Sketch.** Add `cron: '47 */4 * * *'` (offset :47, every 4h). Keep `manual-only` skip behaviour so explicitly-parked items are still respected. Run audit summary lists what was attempted vs. completed.

**Risk.** Complex bot work landing without operator review — mitigated by `codex-review.yml` running on every PR opened (so the maker-checker pair holds), and by the operator's auto-merge gate which still requires the review to pass.

### 2.2 Lower the `manual-only` bar in triage
**Why now.** Today `complexity/complex` automatically gets `manual-only`, keeping cron off. With the new `execute-complex.yml` cron + Max 20x posture, the operator wants the bot to attempt these too.

**Sketch.** Edit `scripts/triage-prompt.md` to remove the automatic `manual-only` for `complexity/complex` issues that ALSO have `auto-routine`. Keep the operator's ability to apply `manual-only` explicitly (still respected). Combined with §2.1, this turns `complex` into "bot tries, operator reviews" instead of "operator must manually trigger."

**Risk.** Bot fans out across more concurrent items — mitigated by the existing `claude-runtime` concurrency group which still single-flights the general lane.

### 2.3 Doc-task seeder daily (in flight on PR #226)
Already in flight. Surfaces backlog stuck in planning docs into the work queue.

### 2.4 Bump `pattern-c-watcher.yml` to twice-daily
**Why now.** Catches Pattern C drift twice as fast for the deploy push.

**Sketch.** `0 14 * * *` → `0 2,14 * * *`. Single-line cron change.

### 2.5 Bump `deploy-drift-watcher.yml` to `*/15`
**Why now.** Vercel ↔ main drift caught within 15 min instead of 30. Vercel API has plenty of headroom for this cadence.

### 2.6 Backlog-harvest cron — revive planless items
**Standard:** SRE practice — periodic queue scrub.

**Why now.** Items that arrived before `plan-issues.yml` existed, or whose plan failed silently, sit forever without `plan/detailed`. With Max 20x quota the operator can afford to sweep them up nightly.

**Sketch.** New `.github/workflows/backlog-harvest.yml`, daily 03:00 UTC. Lists open `auto-routine` + `status/planned` issues with no `plan/detailed` label, dispatches `plan-issues.yml` for up to 5 of them.

---

## §3 — Pipeline health (operator visibility into the automation itself)

### 3.1 Pipeline health watchdog
**Standard:** SRE practice — every recurring job needs a heartbeat / dead-man's-switch. Today, if `triage.yml` silently breaks, the operator finds out only when the queue stops draining.

**Sketch.** New `.github/workflows/pipeline-health.yml`, daily 06:00 UTC. Walks every cron from `automation-map.md`, asserts each ran in the last `cadence × 3` window. Files (or updates) a single rolling P1 issue for any miss. Reads its catalog from `automation-map.md` so it can't drift from the source of truth.

**Cost.** Free; one Python run/day.

**Partial coverage today.** `backlog-digest.yml` (every 2h, offset :37) gives the operator an always-fresh narrative brief — what shipped, what's stuck, what's queued — readable from any device including Steam Deck/Android (the operator's actual surfaces). It does NOT replace the heartbeat watchdog: the digest *summarises* motion but cannot detect "cron silently stopped firing" the way §3.1 will.

---

### 3.2 Pipeline canary (synthetic end-to-end probe)
**Standard:** Industry-standard "synthetic transaction" pattern (Datadog / Pingdom / SaltStack canaries). Proves the issue → triage → plan → execute → review → close loop is alive even when no real backlog exists.

**Sketch.** Weekly Mon 03:00 UTC. New `.github/workflows/pipeline-canary.yml` files a doc-only synthetic issue (`canary YYYY-WW: insert one space in docs/ops/canary-target.md`), waits 24h, asserts the issue is closed and a PR landed. If not, opens a P1.

**Cost.** ~$0.20 of Opus tokens per week; trivial vs. the value of a known-alive loop.

---

### 3.3 Stale-PR / stuck-issue alerter
**Standard:** [`actions/stale`](https://github.com/actions/stale) — used by Kubernetes, React, Vue, etc.

**Sketch.** Daily 04:00 UTC. Soft-rules:
* Issue `status/awaiting-review` > 7 days → comment + add `status/stuck`.
* PR `auto-routine` open > 5 days without merge → comment + add `pr-stuck`.
* Issue `status/needs-clarification` > 14 days → comment + close.

No hard-close on issues that the operator might still want — only on PRs with the bot-author and no human commits.

**Cost.** Free.

---

### 3.4 Quarterly audit reminder
**Standard:** Compliance practice — anything labelled "quarterly" needs a tickler.

**Sketch.** New `.github/workflows/quarterly-audit-reminder.yml`, monthly cron `0 15 1 */3 *`. Files an issue with the `audit-runbook.md` checklist body, label `meta/audit`, P2.

---

## §4 — Security & dependency hygiene

### 4.1 Dependabot or Renovate
**Standard:** GitHub-native [Dependabot](https://docs.github.com/en/code-security/dependabot) — every production repo runs one.

**Why now.** This repo ships to production via Vercel. Stale deps = unpatched CVEs in the live site.

**Sketch.** Add `.github/dependabot.yml`: weekly `npm`, monthly `github-actions`, weekly `pip` for `scripts/`. Group minor + patch updates so the operator gets one PR/week instead of dozens.

**Cost.** Free.

### 4.2 CodeQL static analysis
**Standard:** GitHub's native [CodeQL](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors).

**Why now.** The contact form, admin portal, and any future API endpoint are SQL/XSS/SSRF surfaces.

**Sketch.** Add `.github/workflows/codeql.yml` from the GitHub-published template. PR + push to main + weekly cron.

**Cost.** Free for public repos. This repo is private today; defer until budget allocated OR enable post-spinout (Phase 4) when the public client-site repo gets it for free.

### 4.3 Action SHA pinning
**Standard:** [Pin GitHub Actions to a commit SHA, not a tag](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions). The Tj-actions/changed-files compromise (March 2025) is the canonical example.

**Why defer.** Large mechanical change with no immediate value. Schedule for Phase 6 hardening alongside operator handoff. Current stack uses official actions where supply-chain risk is comparatively low.

---

## §5 — Operator handoff & release engineering

### 5.1 release-please / Conventional Commits
**Standard:** [release-please](https://github.com/googleapis/release-please) generates `CHANGELOG.md` and tags releases from [Conventional Commits](https://www.conventionalcommits.org/).

**Why now.** The repo already uses Conventional Commits in practice (`feat:`, `fix:`, `docs:`). Wiring `release-please` gives the operator an auto-PR with a generated CHANGELOG and a release tag on every push to main. Reduces handoff friction.

**Cost.** Free.

### 5.2 PR-title linter (commitlint)
**Standard:** [`commitlint`](https://commitlint.js.org/) — the canonical Conventional Commits enforcer.

**Why now.** Without it, `release-please` (5.1) silently misses commits with malformed messages.

**Sketch.** Add `commitlint.config.js` and `.github/workflows/commitlint.yml` running on `pull_request` types `[opened, edited, synchronize]`.

**Cost.** Free.

---

## §6 — Operator UX

### 6.1 ChatOps commands on issues / PRs
**Standard:** GitHub-native `issue_comment` triggers — already used by `codex-pr-fix.yml`.

**Sketch.** New `.github/workflows/chatops.yml` listening for `issue_comment.created` with body matching `^/(replan|recheck|skip-review|requeue|veto)\b`:
* `/replan` — re-run `plan-issues.yml` for this issue.
* `/recheck` — re-run `codex-review.yml` for this PR.
* `/skip-review` — apply `codex-reviewed` label and remove `codex-blockers` (operator-attested skip; logged).
* `/requeue` — clear `status/in-progress` and `status/awaiting-review`.
* `/veto` — close issue, label `status/post-migration`.

**Cost.** Free; only fires on operator comments.

### 6.2 `AUTOMATION_TIER` repo variable
**Standard:** Single configuration knob to flip posture in one place.

**Why now.** When the cost-optimisation phase opens, the operator will want a single switch to slow everything down. Threading `if: vars.AUTOMATION_TIER != 'paused'` through every cron lets posture change without editing 11 workflow files.

**Sketch.** Add a repo variable `AUTOMATION_TIER` with values `aggressive | normal | paused`. Each cron-driven workflow gates its `schedule:` job on this variable. Default `aggressive` for the deploy push.

**Cost.** Free.

---

## §7 — Concrete next-PR shopping list

If you want one PR that ships the highest-leverage items, the order is:

1. **§1.1 core CI workflow** — closes the headline gap. ~30 min to implement.
2. **§4.1 dependabot.yml** — security baseline, 5 min.
3. **§3.1 pipeline-health watchdog** — operational visibility, ~30 min.
4. **§2.1 cron-trigger `execute-complex.yml`** — round-the-clock utilisation, single-line change + audit summary.
5. **§5.2 commitlint** — prerequisite for §5.1, 10 min.
6. **§5.1 release-please** — generates CHANGELOG, ~20 min.
7. **§1.2 lighthouse-ci** — required by demo-readiness, ~30 min.

Total: one focused half-day for the operator + ~3 hours of bot work. None of these conflict with the items already in flight (PR #223 audit fixes, PR #226 doc-task seeder, this PR's automation-map).

## §8 — Defer until cost-optimisation phase

| Item | Why defer | Trigger to revisit |
|---|---|---|
| Slack/Discord notifications from `bot-usage-monitor` | Operator already reads dashboard | Once cost matters |
| Backup of issues/Project state to a separate storage | Low value pre-handoff (GitHub IS the source of truth) | Before client #1 spinout |
| Matrix builds across Node versions | Single deploy target | Never (Vercel pins Node) |
| OWASP ZAP DAST scan | Heavier than CodeQL; needs running site | Phase 6 hardening |
| Performance regression detection (Vercel Speed Insights) | Already partly via Vercel UI | When LCP starts drifting |
| `actions/first-interaction` welcome | No external contributors yet | Post Phase 4 (client #1 onboards via admin portal) |

*Last updated: 2026-04-30. Ranking reflects the aggressive deploy-push phase + the operator's "round-the-clock utilisation" directive.*
