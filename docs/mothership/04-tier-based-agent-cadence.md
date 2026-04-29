<!-- OPERATOR-ONLY. -->

# 04 — Tier-Based AI Agent Cadence

How often the autopilot runs, which models it uses, and how aggressive its review is — set per client by tier. The rule of thumb: **higher tier = more cron, fancier model, lighter human review**. Lower tier = sparser cron, cheaper model, heavier human review.

This is implemented as **per-client labels** read by the workflows in each `<slug>-pipeline` repo (Pattern C — see `02b`), plus a single per-client config file `docs/operator/clients/<slug>/cadence.json` in the mothership repo.

> **Numbers in this doc are owned by `18-capacity-and-unit-economics.md`** (the single source of truth for capacity / cost / cliffs). Cells in §1 that quote a minute count, dollar figure, or upgrade threshold reference an anchor in `18`; this doc does not redefine them. If a number here disagrees with `18`, `18` wins — open a fix in `18 §7` (change log) and propagate.

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
| **Action minutes budget / month** | See `18 §2` row T0 | See `18 §2` row T1 | See `18 §2` row T2 | See `18 §2` row T3 |
| **Claude turn budget / day** | See `18 §3` formula | See `18 §3` formula | See `18 §3` formula | See `18 §3` formula |

> The two rows above used to hard-code per-tier ceilings (`0 / 100 / 250 / 600` minutes; `0 / 200 / 500 / 1500` turns). Those numbers now live exclusively in [`18-capacity-and-unit-economics.md §2`](18-capacity-and-unit-economics.md#2--per-tier-action-minute-envelopes) and [`18 §3`](18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes) so they reconcile with the practice-level totals and the GitHub Free-tier cliff. Operator allocations (the budget ceilings) and observed-typical run cost are both there.

These values are starting points. Tune per client based on observed activity; document the change in `docs/clients/<slug>/cadence-changes.md` **and** add a §7 row in `18` so the assumption-change log captures the new ceiling.

---

## 2. How the per-client cadence is enforced

Each `<slug>-pipeline` repo's `main` has, at the top of every cron'd workflow:

```yaml
on:
  schedule:
    - cron: ${{ vars.TRIAGE_CRON || '*/30 * * * *' }}
  workflow_dispatch: {}
```

Cron fires from the pipeline repo's default branch (`main`) — the canonical GitHub Actions path. Each workflow reads its tier-specific config from a repo Variable:

```yaml
env:
  CLIENT_TIER: ${{ vars.CLIENT_TIER }}        # "0" | "1" | "2" | "3"
  CLIENT_SLUG: ${{ vars.CLIENT_SLUG }}
  SITE_REPO_OWNER: ${{ vars.SITE_REPO_OWNER }}
  SITE_REPO_NAME: ${{ vars.SITE_REPO_NAME }}
  DEFAULT_AI_MODEL: ${{ vars.DEFAULT_AI_MODEL }}
  CONCURRENCY_CAP: ${{ vars.CONCURRENCY_CAP }}
```

`SITE_REPO_OWNER` / `SITE_REPO_NAME` tell the workflow which site repo to mint a GitHub-App installation token against (see `02b §3`). The `provision` CLI sets these per-client variables when the engagement starts. Changing tier is a single CLI call: `npx forge set-tier --client johns-plumbing --tier 2` (which updates the variables and reschedules the cron expressions accordingly).

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

If the operator approaches saturation, they walk the cliffs in [`18 §6`](18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points):

1. Cliff 1 — Claude Pro → Max 5x. Plan-cost numbers in [`18 §1`](18-capacity-and-unit-economics.md#1--assumptions-table) (`claude_pro_cost`, `claude_max5x_cost`).
2. Cliff 4 — Max 5x → Max 20x. Plan-cost number in `18 §1` (`claude_max20x_cost`).
3. Cliff 5 — beyond Max 20x, hire a second operator with their own Anthropic seat (`docs/storefront/03-cost-analysis.md §E` and `18 §6` Cliff 5).

The dashboard's "Quota usage" panel charts this in real time (P5 deliverable; not yet built — track in `docs/mothership/05-mothership-repo-buildout-plan.md §P5.4`).

---

## 6. The "noisy client" rule

If one client's activity threatens to starve the others (e.g. a T2 client opens 30 issues in one day), the per-client `CONCURRENCY_CAP` Variable kicks in:

- The `triage.yml` workflow runs `gh pr list --repo "$SITE_REPO_OWNER/$SITE_REPO_NAME" --label client/<slug> --state open` first (using an App installation token).
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
1. Updates `vars.CLIENT_TIER`, `vars.TRIAGE_CRON`, `vars.EXECUTE_CRON`, `vars.DEFAULT_AI_MODEL`, `vars.CONCURRENCY_CAP` on the pipeline repo.
2. Updates the cron expressions inside the workflow files on the pipeline repo's `main` (commit + push as the operator).
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

Update `docs/storefront/01-gig-profile.md §6` and `docs/storefront/04-slide-deck.md` slide 5 to reflect the cadence ladder once the brand is locked.

*Last updated: 2026-04-28.*
