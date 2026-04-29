<!-- OPERATOR-ONLY. External review of 00–09. Historical / decision-record context. -->

# 10 — Critique: Executive Summary

> **Historical context (read order: this file is part of the critique series).** This file enumerates problems identified before Pattern C was chosen on 2026-04-28. The `operator/main` references below describe the *deprecated* pattern that the critique rejected. The canonical architecture is `02b-pattern-c-architecture.md`; the full architectural decision history is in `11 §1`.

A senior-architect + business-partner review of the pack in `00-INDEX` through `09-github-account-topology`. Read this once, then dive into the topical critiques (`11`–`14`), the naming review (`15`), and the automation prompt-pack (`16`).

---

## 1. The verdict in one paragraph

The business idea is **viable and differentiated**, the four-tier ladder is sane, the cost firewall is the right concept, and the two-repo split (mothership ↔ client) is the right shape. **But the pack as written has one architectural error that blocks production (cron schedules don't fire from non-default branches), three security gaps that compromise the cost firewall, and several maths/sequencing inconsistencies between docs.** None of these are fatal — all are fixable inside one P5 sprint — but they must be fixed *before* client #2.

> Status: **revise before sign-off.** Do not run P5.6 (migrate `lumivara-site`) until the items in `11 §1` are resolved.

---

## 2. Top-10 issues, ranked by impact × likelihood

| # | Issue | Severity | Where it bites | Fix lives in |
|---|---|:---:|---|---|
| 1 | **Scheduled workflows on `operator/main` will not fire** — GitHub Actions only runs `schedule:` triggers from the repo's *default* branch. The "two-branch trick" as described silently breaks every cron. | 🔴 Critical | `02 §1`, `02 §6`, `03 §2.1` | `11 §1` |
| 2 | **Single-Owner topology with no break-glass** — `palimkarakshay` is the only Org Owner; no recovery path if account is locked. | 🔴 Critical | `09 §1`, `09 §4` | `12 §1` |
| 3 | **`AUTH_RESEND_KEY` shared across all clients** — leak from one client's Vercel env exposes every client's email pipeline. | 🟠 High | `03 §3` | `12 §2` |
| 4 | **n8n on Railway free tier is single-point-of-failure** — sleeps after 30 days idle, no replicas, no backup of running state. Every intake channel dies if it's down. | 🟠 High | `N8N_SETUP.md`, `02 §1` | `13 §4` |
| 5 | **Action-minutes maths doesn't reconcile** — `04` budgets 250 min/T2 client/mo; `09` claims 25 T2 clients fit in the 2,000-min Free tier (= 6,250 min, 3× over). | 🟠 High | `04 §1`, `09 §1` | `18 §2` (was `13 §1`) — closed |
| 6 | **AI cost numbers don't reconcile** — `cost-analysis 03` Part D shows $280 USD/mo at 25 clients, but the only listed plan above $200 is "hire a second seat." | 🟠 High | `freelance/03` | `18 §3` (was `13 §2`) — closed |
| 7 | **`operator/main` is visible to client-as-Read-collaborator** — branch-listing is a Read permission; the "client never sees the autopilot" claim relies on incuriosity, not a permission boundary. | 🟠 High | `03 §2.1`, `02 §4` | `11 §2` |
| 8 | **Per-client OAuth app provisioning (Google + Entra) is mostly manual** — Google Cloud Console doesn't have a clean OAuth-client API; Entra needs Graph API + tenant consent. The `forge provision` step glosses over this. | 🟡 Medium | `06 §4 step 3-4` | `14 §3` |
| 9 | **Tier 0 economics are loss-leading and undocumented as such** — $90/change with no tracking system, no autopilot, manual operator time. Honest as portfolio play; broken as a tier. | 🟡 Medium | `freelance/02 Tier 0`, `07 Dummy F` | `14 §1` |
| 10 | **`workflows-template/` is canonical only in the mothership but `setup-cli.yml` etc. live in this repo today** — the migration from this repo to mothership has overlap; nothing names which copy is authoritative until P5.2 finishes. | 🟡 Medium | `02 §2`, `05 §P5.2` | `14 §2` |

Lesser issues (terminology drift, brand-name choice, doc duplication) are catalogued in their respective files.

---

## 3. What's working — keep these

| Strength | Why it matters |
|---|---|
| Two-repo separation (mothership vs client) is the right shape. | Most freelancers don't draw this line; doing so is the moat. |
| The four-tier ladder (T0–T3) with a documented Tier-4 white-label "don't promote" stance. | Disciplined positioning; few solo operators are this clear. |
| Multi-AI fallback is real and tested in `ai-smoke-test.yml`. | Provider-outage resilience is a credible Tier 2+ promise. |
| The session-budget charter (`AGENTS.md` 50 %/80 %) is genuinely novel. | Most "AI does the work" plans burn quota and stop; this one survives. |
| The "site = client; system = operator-licensed" contractual line. | Defensible IP without making the client feel locked in. |
| Per-engagement runbook + intake template + dummy clients. | Onboarding is rehearsable, not improv. |
| The cost-firewall principle ("never invoice a third-party line item"). | Right answer; just needs the technical leaks closed (see `12`). |
| Scoping client repos under the operator org with org-level secrets ("Pattern A"). | Correct call; rejecting Pattern B was right. |

---

## 4. Three readings for the operator

1. **If you are about to start P5.5 / P5.6:** stop, read `11 §1`, fix the cron architecture, then resume.
2. **If you are evaluating "is this even the right business?":** read `13 §3` (scaling cliffs) and `14 §1` (Tier 0 honesty). Conclusion stays *yes, with revisions*.
3. **If you are stuck on the brand name:** read `15` and pick. Five new candidates, one recommendation; the rename is mechanical because of `{{BRAND}}`.

---

## 5. Suggested next operator session (Claude Code in the browser, Opus 4.7 Max)

Do not try to fix everything in one run. Sequence the next three runs as:

1. **Run A (2–3 h Opus):** apply fixes from `11 §1` — restructure the two-branch trick to one of the two viable patterns, update `02`, `03`, `05`, `06`. Use the prompt in `16 §1`.
2. **Run B (1–2 h Opus):** apply the security fixes from `12` — break-glass Owner, per-client Resend key, remove shared secrets. Use prompt in `16 §2`.
3. **Run C (1 h Sonnet):** rationalise the maths in `04`, `09`, and `freelance/03`. Reconcile, update tables. Use prompt in `16 §3`.

Each run lands one PR. Three PRs land before any new client work begins.

---

## 6. What this critique does not cover

- Legal review (PIPEDA, Law Society advertising rules, MSA enforceability) — out of scope; covered in `08`.
- Accountancy / corporate structure (sole prop vs. PC vs. federal incorporation) — talk to a CPA in Ontario; not an architect's call.
- Marketing / sales process — `freelance/01` is fine; not the bottleneck.
- The Lumivara People Advisory marketing site itself — that's a client engagement, not an architectural concern.

*Last updated: 2026-04-28.*
