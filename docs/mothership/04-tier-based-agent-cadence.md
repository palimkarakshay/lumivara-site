<!-- OPERATOR-ONLY. -->

# 04 — Tier-Based AI Agent Cadence

How often the autopilot runs, which models it uses, and how aggressive its review is — set per client by tier. The rule of thumb: **higher tier = more cron, fancier model, lighter human review**. Lower tier = sparser cron, cheaper model, heavier human review.

This is implemented as **per-client labels** read by the workflows on `operator/main`, plus a single per-client config file `docs/operator/clients/<slug>/cadence.json` in the mothership repo.

---

## 1. Cadence matrix

| Knob | T0 Launch | T1 Lite | T2 Pro | T3 Business |
|---|---|---|---|---|
| **Triage cron** | None — issues hand-classified by operator weekly | Every 2 h | Every 30 min | Every 15 min |
| **Plan cron** | None | Every 4 h | Every 2 h + on triage `workflow_run` | Every 1 h + on triage |
| **Execute cron** | None | Daily 09:00 ET | Every 2 h | Every 1 h |
| **Auto-merge** | Off | Trivial only, after operator manual review | Trivial + Easy non-design | Trivial + Easy + Medium non-design |
| **Multi-AI fallback** | Off | Triage ladder only (Claude→Gemini) | Full ladder (triage + plan + execute) | Full ladder + Codex second-opinion review on every PR |
| **Deep-research workflow** | Off | Off | Quarterly (manual dispatch) | Monthly (manual dispatch) |
| **Codex-review workflow** | Off | Off | Optional (operator dispatches per PR) | On every PR (auto-dispatch via PR-opened trigger) |
| **`needs-client-input` SLA** | 5 business days | 3 business days | 1 business day | 4 hours |
| **Operator review cadence** | Per request, hand-built | Daily 30-min review of bot PRs | Daily 30-min review + monthly improvement run | Twice-daily review + monthly improvement run + quarterly strategy call |
| **Default model (`DEFAULT_AI_MODEL`)** | n/a | `haiku` | `sonnet` | `sonnet`, with `opus` for `area/architecture` |
| **Model override discipline** | n/a | Operator-only via dashboard | Operator-only via dashboard | Operator-only via dashboard, plus per-client variable `<SLUG>_NEXT_RUN_MODEL_OVERRIDE` |
| **Concurrency cap (per client per hour)** | 0 bot runs | 1 plan + 1 execute | 2 plan + 2 execute | 4 plan + 4 execute |
| **Action minutes budget / month** | 0 | 100 | 250 | 600 |
| **Claude turn budget / day** | 0 | 200 | 500 | 1,500 |

These values are starting points. Tune per client based on observed activity; document the change in `docs/clients/<slug>/cadence-changes.md`.

---

## 2. How the per-client cadence is enforced

Each client repo's `operator/main` has, at the top of every cron'd workflow:

```yaml
on:
  schedule:
    - cron: ${{ vars.TRIAGE_CRON || '*/30 * * * *' }}
  workflow_dispatch: {}
```

And each workflow reads its tier-specific config from a repo Variable:

```yaml
env:
  CLIENT_TIER: ${{ vars.CLIENT_TIER }}        # "0" | "1" | "2" | "3"
  CLIENT_SLUG: ${{ vars.CLIENT_SLUG }}
  DEFAULT_AI_MODEL: ${{ vars.DEFAULT_AI_MODEL }}
  CONCURRENCY_CAP: ${{ vars.CONCURRENCY_CAP }}
```

The `provision` CLI sets these per-client variables when the engagement starts. Changing tier is a single CLI call: `npx forge set-tier --client johns-plumbing --tier 2` (which updates the variables and reschedules the cron expressions accordingly).

---

## 3. Auto-merge gate per tier

`auto-merge.yml` already supports a label-based gate. Tier extends it:

```
Tier 0: never auto-merges (workflow disabled).
Tier 1: auto-merges PRs labelled  auto-routine + complexity/trivial          + NOT type/design-cosmetic
Tier 2: auto-merges PRs labelled  auto-routine + complexity/trivial|easy     + NOT type/design-cosmetic
Tier 3: auto-merges PRs labelled  auto-routine + complexity/trivial|easy|medium + NOT type/design-cosmetic + Codex review approved
```

The "Codex review approved" requirement on T3 means `codex-review.yml` posts a `codex/approved` label on the PR, and the auto-merge workflow checks for it. This is the second-pair-of-eyes the higher tier is paying for.

---

## 4. Model assignment per tier (recap, with the routing labels)

The triage rubric (`scripts/triage-prompt.md`) already attaches `model/haiku|sonnet|opus`. The tier overrides:

```python
# scripts/lib/routing.py — pseudocode of the tier-aware override
def decide(issue_labels, tier):
    base = decide_base(issue_labels)            # current router
    if tier == 0: return Decision.skip("manual-only")
    if tier == 1:
        # Force every implementation onto Haiku unless explicitly upgraded
        if base.model == "opus":   base.model = "sonnet"  # downgrade
        if base.model == "sonnet": base.model = "haiku"   # downgrade
    if tier == 3 and "area/architecture" in issue_labels:
        base.model = "opus"
    return base
```

So a T1 client gets Haiku on most edits and Sonnet only when triage explicitly tagged `model/sonnet`; a T3 client routinely gets Sonnet, with Opus available for architecture work. The downgrade is a tier-cost feature, not a quality compromise — Haiku is fine for typo / link / copy edits, which are 80% of T1 traffic.

---

## 5. Quota allocation across the practice

The operator runs on **one** Claude Pro/Max subscription. The 5-hour rolling quota is shared. Allocation policy:

| Tier | % of weekly quota cap |
|---|---|
| T0 | 0% (no autopilot) |
| T1 | 5% per client (max 4 T1 clients on this lane before Claude saturates) |
| T2 | 10% per client (max ~6 active T2 clients before saturation) |
| T3 | 20% per client (max ~3 T3 clients before saturation) |

If the operator approaches saturation, they:
1. Bump Claude Pro → Max 5x ($100/mo) — gives ~5x quota.
2. Bump Max 5x → Max 20x ($200/mo) — gives ~4x more.
3. Beyond Max 20x, hire a second operator with their own Anthropic seat (`docs/freelance/03-cost-analysis.md §E`).

The dashboard's "Quota usage" panel charts this in real time (P5 deliverable; not yet built — track in `docs/mothership/05-mothership-repo-buildout-plan.md §P5.4`).

---

## 6. The "noisy client" rule

If one client's activity threatens to starve the others (e.g. a T2 client opens 30 issues in one day), the per-client `CONCURRENCY_CAP` Variable kicks in:

- The `triage.yml` workflow runs `gh pr list --label client/<slug> --state open` first.
- If the count exceeds the cap, the workflow exits early with `BUDGET: per-client cap hit, deferring`.
- The operator gets a notification (n8n `quota-warn` workflow) and decides whether to:
  - Bump the cap manually for the day.
  - Move that client to a dedicated cron (separate workflow file with a more aggressive schedule).
  - Have a "let's slow down" conversation with the client.

This protects all other clients from one client's bursty week.

---

## 7. Tier-change procedure (when a client upgrades or downgrades)

```bash
npx forge set-tier --client viktor-law --tier 2 --effective 2026-05-01
```

What happens:
1. Updates `vars.CLIENT_TIER`, `vars.TRIAGE_CRON`, `vars.EXECUTE_CRON`, `vars.DEFAULT_AI_MODEL`, `vars.CONCURRENCY_CAP` on the client repo.
2. Updates the cron expressions inside the workflow files on `operator/main` (commit + push as `{{BRAND_SLUG}}-bot`).
3. Updates `docs/clients/viktor-law/cadence.json` in the mothership repo.
4. Updates the Stripe / Lemon Squeezy subscription price.
5. Posts a comment on the client's pinned admin-portal welcome issue: *"Tier upgraded to T2 effective 2026-05-01. Faster response times, more frequent improvements."*
6. Re-runs `mothership-smoke.yml` to confirm the new schedule fires.

Downgrade follows the same path. If a client churns, that's a `teardown --mode handover` (see `02-architecture.md §7`).

---

## 8. Why this is a feature, not just an internal toggle

The cadence matrix is **the second-most-marketable feature of the whole offering** (after "edit from your phone"). Talking points for the gig profile / FAQ:

- *"My T2 clients see changes ship within 2 hours of submitting them. T3 within an hour. T1 by the next morning. Whatever your operating cadence, the site keeps up."*
- *"Higher tiers also get a second AI reviewer on every change — a different model than the one that wrote the code. Two opinions before anything goes live."*
- *"And if any provider has an outage, your changes don't pause — they fall through to the next provider in line."*

Update `docs/freelance/01-gig-profile.md §6` and `docs/freelance/04-slide-deck.md` slide 5 to reflect the cadence ladder once the brand is locked.

*Last updated: 2026-04-28.*
