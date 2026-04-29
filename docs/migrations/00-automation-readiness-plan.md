<!-- OPERATOR-ONLY. Sequenced plan for proving the automation in this repo BEFORE migrating to Pattern C. -->

# Automation Readiness & Bot-Driven Migration Plan

> **Goal.** Use this repo (`palimkarakshay/lumivara-site`) as the
> **proof-of-concept** for the autopilot, then have the bot drive the
> Pattern C migration into the new platform repo + per-client repos.
>
> **Status:** Drafted 2026-04-29 (this PR). Pre-Run S1, pre-P5 bootstrap.
> Operator-blocking rows are flagged ☐ **OPERATOR**; bot-runnable rows
> are flagged ▶ **BOT** with the exact Claude Code prompt to paste.
>
> **Why this file exists.** `05-mothership-repo-buildout-plan.md` lays
> out the *what* (P5.1 → P5.9). `06-operator-rebuild-prompt-v3.md` is
> the per-engagement playbook. Neither file sequences the **proof-first
> → migrate-second** approach you actually want. This file does.

---

## §0 — Reading order

1. This file (sequencing).
2. `docs/mothership/15b-naming-conventions.md` (terminology + folder
   shapes the steps below assume).
3. `docs/mothership/02b-pattern-c-architecture.md` (the canonical
   end-state).
4. `docs/mothership/05-mothership-repo-buildout-plan.md` (the phase
   detail this file calls into).
5. `docs/migrations/lumivara-people-advisory-spinout.md` (the Client #1
   one-shot, run after this file's Phase 4).

If you only have 5 minutes: read §1 (the bird's-eye sequence) and §6
(the prompt index), then come back.

---

## §1 — Sequence at a glance

```
PHASE 0 — Operator account + identity bootstrap     (operator only, ~1 day)
   └─ Create the Lumivara Forge org, the GitHub App, the vault, domains.

PHASE 1 — Prove the automation in THIS repo         (bot, ~2 weeks)
   └─ Close every open critique, finish the kanban, exercise every
      cron path on real issues, until 10 consecutive auto-routine
      issues land green without operator intervention.

PHASE 2 — Land Run S1 (mechanical rename)           (bot, 1 session)
   └─ {{BRAND}}/{{BRAND_SLUG}} → Lumivara Forge / lumivara-forge,
      mothership/ → platform/, freelance/ → storefront/,
      n8n-workflows/ → n8n/.

PHASE 3 — Bootstrap the platform repo               (bot + operator, ~1 week)
   └─ Run P5.1 (docs migrate) → P5.2 (workflow templates) →
      P5.3 (dashboard) → P5.4a-f (forge CLI).

PHASE 4 — Spin Client #1 out                         (bot + operator, ~3 days)
   └─ Run docs/migrations/lumivara-people-advisory-spinout.md, then
      validate via pattern-c-enforcement-checklist §5.

PHASE 5 — Onboard Client #2 from a clean slate      (bot, ~1 day)
   └─ Run `forge provision` end-to-end against a smoke-test client.
      First fully bot-driven onboarding.

PHASE 6 — Hardening + handover                      (bot + operator, ongoing)
   └─ Walk freelance/05 + 21-vault-strategy + 22-engagement-risk
      protection items into issues; tag legal review.
```

Each phase has a hard exit criterion — the next phase **does not start**
until the previous one's exit criterion is green. The operator's role
shrinks every phase.

*Last updated: 2026-04-29.*
