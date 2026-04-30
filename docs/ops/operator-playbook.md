<!-- OPERATOR-ONLY. The single front-door doc the operator opens every working session. -->

# Operator Daily Playbook — Lumivara Forge

> **Open this file every morning. It is the contract between past-you and present-you.**
>
> The plan docs are deep ([`01-poc-perfection-plan.md`](../migrations/01-poc-perfection-plan.md), [`00-automation-readiness-plan.md`](../migrations/00-automation-readiness-plan.md)). This file is *thin* — it tells you the **one thing** to do today, the **two parallel options** if you stall, and what **breaks if you skip**.
>
> Stale-stamp: this playbook is rewritten **weekly** (Monday morning) and **after every gate flip**. If `Last refreshed` is more than 9 days old, do not trust the "Today" section — re-read [`progress-tracker.md`](./progress-tracker.md) instead.
>
> **Last refreshed:** 2026-04-30 (D-1 of POC plan; close-merged sub-pass landed — see §3 D-1 row)
> **Refreshed by:** PM session (Claude)
> **Next refresh due:** 2026-05-04 (Monday)

---

## §0 — How to use this file (read once, then skip)

1. **Open this file** before any other tab.
2. Read **§1 (Today)** — that is your hero task.
3. If §1 is blocked or you genuinely cannot start, drop to **§2 (Parallel pool)** and pick one. Do **not** skip to email, Slack, or new ideas.
4. When the hero task lands, tick it in **§5 (Streak)** and either pick the next §1 from §3 (the calendar) or stop for the day. Stopping after one win is **a success**, not a failure.
5. End-of-day: write **one line** in §6 (Log). One sentence. Not a journal.

The playbook lies to you on purpose: it pretends there is only one thing to do today, because the alternative — reading 600 lines of plan and choosing — is what kills the project.

---

## §1 — Today's hero task (D-0, Wed 2026-04-29)

> **The one thing.** File the **trademark knock-out search** for `Lumivara Forge` (operator task O4a, [`01-poc-perfection-plan.md §7.1`](../migrations/01-poc-perfection-plan.md#71--the-map)).
>
> **Tracking issue:** [#196 — O4a — Trademark knock-out search (DUE Fri 2026-05-01)](https://github.com/palimkarakshay/lumivara-site/issues/196). Open this issue and follow its step-by-step before reading the rest of this section — the issue body is canonical, this section is the motivation.

### Why this and not something else

- **Same-day, free, gates everything.** Until O4a returns "clear," every other operator task downstream (domains O5, GitHub org O6, the Run S1 brand-lock) is locked. Doing one of those *first* and finding out the brand has to pivot is the most expensive form of "let's get started."
- **Single longest-lead external item.** Even on a clean knock-out, the *full* registration (O4b) takes 6–12 weeks at CIPO. You want the search clock started **today** so the registration clock starts **next week**.
- **It is the only thing on this week's calendar that costs you nothing.** No money, no DNS, no irreversible click. Worst case: the search returns "needs counsel" and you discover that *now* instead of in July.

### How to do it (45–60 minutes)

You will produce **one PDF** (`docs/legal/2026-04-29-trademark-knock-out-lumivara-forge.pdf`) containing four sections. Do not over-think the format — screenshots + a one-page verdict is the deliverable.

1. **CIPO search** (Canadian Intellectual Property Office) — 15 min
   - Go to <https://ised-isde.canada.ca/cipo/trademark-search/srch>.
   - Search exact match: `LUMIVARA FORGE`. Filter by Class **35** (advertising/business services) and Class **42** (technology/software services). Screenshot the results page.
   - Search exact match: `LUMIVARA`. Same classes. Screenshot.
   - Search phonetic neighbours: `LUMINARA FORGE`, `LUMIVERA FORGE`, `LUMIVARA FORGES`. Screenshot each results page (even if zero hits — the screenshot **is** the evidence).

2. **USPTO TESS search** (US Patent and Trademark Office) — 15 min
   - Go to <https://tmsearch.uspto.gov/search/search-information>.
   - Same three search variants (`LUMIVARA FORGE`, `LUMIVARA`, the three phonetic neighbours).
   - Same screenshots.

3. **WIPO Global Brand Database** (cross-jurisdiction sanity check) — 10 min
   - Go to <https://branddb.wipo.int/branddb/en/>.
   - Search `LUMIVARA FORGE`. Limit to Origin: CA, US. Screenshot.
   - This catches international filings that haven't reached CIPO/USPTO yet.

4. **One-page verdict memo** — 10 min. Three possible verdicts:
   - **`clear`** — zero exact-match results in any class, zero confusingly-similar phonetic neighbours filed in Class 35 or 42 within the last 5 years. This is the expected outcome and unblocks O5/O6.
   - **`likely-conflict`** — at least one exact match or one closely-similar mark filed in 35/42 in the last 5 years. Brand pivots **before** anything else. Re-pick using [`docs/mothership/15-terminology-and-brand.md §3`](../mothership/15-terminology-and-brand.md).
   - **`needs-counsel`** — ambiguous result (e.g. exact match in unrelated class, or expired mark with same wording). Engage `Trademarkia.com` ($199 flat) or a local agent ($300–500) for a 1-day opinion before proceeding.

### What happens if you skip today

| Slip | Cost |
|---|---|
| **1 day** | Negligible. O4a's L date is Fri 2026-05-01. |
| **3 days** (past L) | O5 (domains) slips to next week → O6 (GitHub org) slips to D-15 → **Run S1 (Phase 2) slips by ≥ 1 week.** Demo window slips with it. |
| **2 weeks** | The first-demo target (early July) slips to mid-July. You will rationalise this as "fine, it's just two weeks" — it is not, because §6.4 row 6.14 (public-demo legal) requires the *full filing* (O4b) submitted, and O4b takes 6–12 weeks. Each week you delay O4a is a week the demo is gated by Canada Post. |

### Done = you have…

- [ ] PDF saved to `docs/legal/2026-04-29-trademark-knock-out-lumivara-forge.pdf` (committed; this dir is operator-only — see [`docs/migrations/_artifact-allow-deny.md`](../migrations/_artifact-allow-deny.md)).
- [ ] Tick the row on the open GitHub issue: **"O4a — trademark knock-out search (Lumivara Forge)"** with the verdict in a comment.
- [ ] If verdict is `clear`: file O4b in the same week (engage Trademarkia or agent). If `likely-conflict` or `needs-counsel`: open a P1 issue **"Brand pivot: Lumivara Forge → ?"** and stop the playbook — that's a different week.

---

## §2 — Parallel pool (when you stall on §1)

> **Rule.** You may pick from this pool **only** if §1 is genuinely blocked (waiting on a third party, browser is down, etc.). "I don't feel like O4a today" is not blocked — that is the resistance the playbook exists to defeat.

Pick exactly one. Each is sized to land in **a single sitting (~30–60 min)**, with no operator-action signal that resets the streak counter.

| Tag | Task | Where it lives | Why it's parallel-safe |
|---|---|---|---|
| **`paper-only`** | Walk the 48 open GitHub issues and bulk-fill `Workstream`, `Phase`, `Gate`, `Repo-Destination-Post-Migration` on the `Lumivara Backlog` project. Aim for **all 48 in one 25-min sitting** — keyboard remembers recent picks. | [Project view: By Workstream](https://github.com/users/palimkarakshay/projects/1/views/14) | Does not touch code or workflows. Cannot reset the streak. Unblocks Phase 4 transfer. |
| **`paper-only`** | Brand-drift sweep on **GitHub Issues** only: find every issue reading the retired working name (search the keyword `Infotech`) and either close-as-`status/post-migration` or rename to `Lumivara Forge`. (Remaining open offenders: #110, #111. #107 closed 2026-04-30 via PR #133; #112 closed via PR #203.) The doc-side sweep landed in PR #200 (2026-04-29); `scripts/dual-lane-audit.sh` keeps it green going forward. | `gh issue list --search "Infotech in:title,body"` | Cleans §6.5 brand-lock audit pre-emptively. |
| **`reading`** | Read [`docs/decks/05-advisor-deck.md`](../decks/05-advisor-deck.md) once, top to bottom, **out loud**, with a 10-minute timer. Stop when the timer fires. Note the slides where you wince. Open one issue per wince titled "Advisor deck slide N rewrite". | `docs/decks/05-advisor-deck.md` | Surfaces deck weaknesses before the §9.2 #1 audience sees them. Does not commit anything. |
| **`reading`** | Read [`docs/storefront/02-pricing-tiers.md`](../freelance/02-pricing-tiers.md) §2 (T0/T1/T2/T3 setup + monthly numbers). Then open `04-prospective-client-deck.md` and confirm the numbers match. If they don't: open a P1 issue. (This is §6.6 — pricing parity — done by hand.) | `docs/storefront/`, `docs/decks/` | Single grep proves §6.6 is green or fails. Either outcome moves the demo gate. |
| **`research`** | Open <https://railway.app/pricing> and <https://www.twilio.com/en-us/sms/pricing/ca>. In one paragraph each, write *"What this costs me at 1 client / 5 clients / 20 clients."* Save to `docs/ops/cost-projection-railway-twilio.md`. | New file | Pre-loads the O9/O10 sittings (Twilio sub-account, n8n on Railway) so when you do them in mid-May, you are not rate-limited by Stripe forms. |

**Anti-pattern:** Picking three of these at once, finishing none. The playbook gives you ONE parallel option per session. Pick, finish, log.

---

## §3 — This week (D-0 → D-7)

The dated plan from [`01-poc-perfection-plan.md §3`](../migrations/01-poc-perfection-plan.md#3--dated-14-day-plan), but **only the operator rows** — the bot rows are the bot's problem, not yours.

| Day | Date | Your task | Time | Status |
|---|---|---|---|---|
| **D-0** | Wed 04-29 | **§1 above (O4a trademark knock-out search) — [issue #196](https://github.com/palimkarakshay/lumivara-site/issues/196)** + decision: streak counts only `auto-routine` issues (this is a 30-second ratification, just say yes). | 60 min | ☐ |
| **D-1** | Thu 04-30 | (a) Streak tracking issue is **already filed: [#195](https://github.com/palimkarakshay/lumivara-site/issues/195)** (pinned). Open it once, confirm the counter is at 0/10. (b) Walk every open issue and apply `priority/` × `complexity/` × `area/` triples or close as `status/post-migration`. **Sub-pass landed 2026-04-30 (PM Claude session):** 20 `status/awaiting-review` items closed against their already-merged feedback PRs (#7, #12, #13, #16, #22, #32, #45, #107, #117, #143, #178, #180, #208, #209, #211, #212, #213, #215, #216, #217). Triple-classification + project-board pass on the residual 40 items still operator-owed. (c) **Same sitting:** fill the `Repo-Destination-Post-Migration` field on every project item ([`github-project-layout.md §6.2`](./github-project-layout.md#62--the-single-most-important-bulk-classification-pass)). | 90 min | ◐ |
| **D-2** | Fri 05-01 | **Vercel mirror sitting — [issue #197](https://github.com/palimkarakshay/lumivara-site/issues/197).** Add env vars in all three Vercel environments, add the `deployment.succeeded`/`error` webhook, add the GitHub repo secrets. Follow #197's step-by-step. **L date for O4a if not done D-0.** | 90 min | ☐ |
| **D-3 AM** | Mon 05-04 | **First-time backfill promote — [issue #198](https://github.com/palimkarakshay/lumivara-site/issues/198).** Click **Promote tip of main** on `/admin/deployments`. Wait 30 min for the watcher's first scheduled run; confirm it does **not** open a P1 issue. **Hard L date for O4a — do this morning if not yet done.** | 30 min + 30 min wait | ☐ |
| **D-3 PM** | Mon 05-04 | (Bot files seven seed issues. **Your job: do nothing.** Operator action mid-streak resets the counter. The hardest day of the playbook is the day you do nothing on purpose.) | 0 min | ☐ |
| **D-4** | Tue 05-05 | (Bot work — your job: open `/admin/deployments` once, confirm drift = 0, close the tab.) | 5 min | ☐ |
| **D-5** | Wed 05-06 | (Bot work — same.) | 5 min | ☐ |
| **D-6** | Thu 05-07 | (Bot work — same.) | 5 min | ☐ |
| **D-7** | Fri 05-08 | Weekly playbook refresh. Open this file, rewrite §1 for the next week based on the streak counter state. **Push the refresh to main as a one-line commit.** This is non-negotiable; a stale playbook is worse than no playbook. | 20 min | ☐ |

> **The boring days are the streak.** Days D-3 PM through D-6 your job is to *not* intervene. Every operator action mid-streak resets the counter. If you cannot resist clicking, drop to §2 (parallel pool) — those are designed to be safe.

---

## §4 — Operator drop-dead calendar (the deadlines you will pretend don't exist)

The full table is [`01-poc-perfection-plan.md §7.1`](../migrations/01-poc-perfection-plan.md#71--the-map). The summary you actually look at:

| ID | Task | Earliest (E) | **Latest (L)** | Cost of slipping past L |
|---|---|---|---|---|
| **O4a** | Trademark knock-out search | Today | **Fri 05-01** | Run S1 + every Phase 0 task slips. Demo slips with it. |
| **O1** | File streak tracking issue | Thu 04-30 | **Mon 05-04** | Streak counter does not start. Demo slips by exactly N days. |
| **O2** | Vercel mirror sitting | Fri 05-01 | **Mon 05-04** | Drift watcher silent. False-green gate. Streak invalid even if it appears to climb. |
| **O3** | First-time backfill promote | Mon 05-04 AM | **Mon 05-04 PM** | Watcher opens P1 drift issues. Streak's "no P1" condition fails. |
| **O4b** | Full trademark filing (post-O4a-clean) | After O4a clear | **Fri 08-15** | Public demo cannot happen. Private demo with one named advisor still possible. |
| **O5** | Buy `lumivara-forge.com` + `.ca` | After O4a clear | **Mon 06-08** | Domain squatted → brand pivots → Run S1 re-runs → every shared deck re-rendered. |
| **O6** | Phase 0: GitHub org + App + secrets | Wed 05-13 | **Fri 05-22** | Phase 2 (Run S1) cannot land. Phase 3 doesn't start. Demo slips. |
| **O7** | Empty target client repos created | Wed 05-13 | **Fri 05-29** | Slug taken on personal account → §6.13 demo cannot point at right URL. |
| **O8** | Vercel team account on Forge business email | Wed 05-13 | **Fri 06-05** | Hosting-transfer story breaks. Catalog claim becomes false. |
| **O9** | Twilio sub-account + per-client number | Wed 05-13 | **Fri 06-12** | Demo loses its single most-load-bearing claim ("text from a phone, tap publish"). |
| **O10** | n8n on Railway, Forge instance | Wed 05-13 | **Fri 06-19** | Demo loses the entire phone-edit narrative. |
| **O11** | 1Password Business + recovery envelope | Wed 05-13 | **Fri 06-26** | Single-Owner break-glass risk goes from "documented" to "silent until it triggers." Catastrophic if laptop is lost. |
| **O12** | DNS cutover for advisory | Mon 06-22 | **Fri 07-10** | Demo audience hits a half-cut-over site. Recoverable but unprofessional. |
| **O13** | Insurance: E&O + cyber liability | Mon 06-15 | **Fri 08-01** | Operator personally liable for IP / data-breach claim from Client #1. |
| **O14** | Lawyer-reviewed MSA + SOW | Mon 06-15 | **Fri 07-31** | First client signs an unenforceable contract. |

### Reading rule for this table

- The **L column** is the only one that matters. Read it on every Monday refresh.
- "Don't act before E" is also in the rule — acting early on O5/O6/O7 during the streak window resets the streak counter ([`POC §5.1 R3`](../migrations/01-poc-perfection-plan.md#51--top-risks-specific-to-this-poc)).

---

## §5 — Streak counter (mirror of the GitHub tracking issue)

Mirror only — the **canonical** counter is [GitHub issue #195 — Phase 1 green streak — counter at 0/10](https://github.com/palimkarakshay/lumivara-site/issues/195) (pinned). This section refreshes Monday.

```
Streak: 0 / 10
Cron path coverage: ☐ triage ☐ execute ☐ execute-complex ☐ execute-single
                    ☐ codex-review ☐ deep-research ☐ auto-merge
P1 stray count (must stay 0): 0
Drift state: unknown (run §4.4 of POC plan to confirm)
```

If `Streak: 0/10` becomes `Streak: 6/10` and then drops back to `0/10`: that is **not failure**, that is the gate doing its job. Don't loosen it. ([`POC §5.3`](../migrations/01-poc-perfection-plan.md#53--when-the-gate-refuses-to-go-green))

---

## §6 — Daily log (one line per day; do not skip; do not narrate)

Format: `YYYY-MM-DD — what landed | what blocked | tomorrow's §1`.

| Date | Log line |
|---|---|
| 2026-04-29 | (today — fill at end of session) |

> Future-you reads this column to spot patterns ("I haven't logged in 4 days" = the project has stalled and you are pretending it hasn't).

---

## §7 — Anti-procrastination rules (read once a month)

### §7.1 — The "I'll do it tomorrow" rule

If you defer the §1 hero task once: fine, log the reason in §6.
If you defer it **twice in a row**: open a P1 issue titled `Hero task blocked — escalate or rescope` and stop the playbook. Two-in-a-row deferral is the single highest-fidelity signal that the project has lost a load-bearing assumption (you no longer believe in the demo target, the brand is wrong, the streak gate is too strict, etc.). The right response is to pause and re-derive — not to keep half-trying.

### §7.2 — The "new idea" rule

A new idea (a new feature, a new client persona, a new pricing tier) does not get worked on the day it arrives. It gets filed as a `status/needs-triage` GitHub issue with a one-line body and the playbook continues. The issue is the commitment. Working on it is not.

### §7.3 — The "Beas suggested X" rule

The single most-likely vector for scope drift is the spouse-aligned co-builder asking for one more thing on the advisory site. The advisory site is **frozen** for non-content edits until Phase 4 cutover. Content edits (copy, MDX) flow through the existing autopilot; non-content edits (new pages, new components) get filed as `status/post-migration` and closed.

### §7.4 — The "I should rebuild the playbook" rule

You will, at some point, want to redesign this file. **Don't.** The weekly refresh in §3 D-7 is the only allowed change. If the design feels wrong, write the rant in §6, leave the design alone, and let the next refresh decide if anything actually needs to move. Most "the design is wrong" feelings are deferral.

### §7.5 — The "but I want to spin out the advisory now" rule

Pre-empted in [`POC §8.4`](../migrations/01-poc-perfection-plan.md#84--the-but-i-want-to-do-it-now-rebuttals). One sentence: spinning out before the POC streak invalidates the audit trail you're paying two weeks for. Re-read §8.4, don't re-litigate it.

---

## §8 — Where to look when this file isn't enough

| You need… | Open this |
|---|---|
| **The deep plan** for the next 14 days | [`docs/migrations/01-poc-perfection-plan.md`](../migrations/01-poc-perfection-plan.md) |
| **The phase map** for the next 6 months | [`docs/migrations/00-automation-readiness-plan.md`](../migrations/00-automation-readiness-plan.md) |
| **The shareable status** to send Beas / advisors | [`docs/ops/progress-tracker.md`](./progress-tracker.md) |
| **The mobile-friendly board** of every workstream | [Lumivara Backlog → Demo-Day Critical view](https://github.com/users/palimkarakshay/projects/1/views/6) |
| **The catalog you're selling** | [`docs/decks/04-prospective-client-deck.md`](../decks/04-prospective-client-deck.md), [`docs/storefront/01-gig-profile.md`](../freelance/01-gig-profile.md) |
| **The brand-lock policy** | [`docs/mothership/15-terminology-and-brand.md`](../mothership/15-terminology-and-brand.md) |
| **The variable registry** (when wiring secrets) | [`docs/ops/variable-registry.md`](./variable-registry.md) |
| **What runs and when** (every cron / workflow / script) | [`docs/ops/automation-map.md`](./automation-map.md) |
| **Gaps in the pipeline** (next-PR shopping list) | [`docs/ops/automation-future-work.md`](./automation-future-work.md) |
| **Doc-driven backlog capture** (`<!-- bot-task -->` markers) | [`docs/ops/doc-task-seeder.md`](./doc-task-seeder.md) |

---

## §9 — Refresh discipline

This file lies if it is stale. Three rules:

1. **Weekly refresh** every Monday morning. Rewrite §1, §3, §5. Bump `Last refreshed`. One commit, push to `main` (this is operator-only doc — direct push is fine).
2. **Gate-flip refresh** every time §1 / §6 / §7 of the POC plan ticks a row green. Update the streak in §5; update the badge in [`progress-tracker.md`](./progress-tracker.md).
3. **Drift-flip refresh** every time §4.4 of POC plan reports `DRIFT > 0`. Push a one-line note to §6 saying "drift detected, investigating" — that becomes the day's hero task instead of §1.

The playbook's whole value is being *current*. A 3-week-old playbook telling you to do O4a after you already did it is worse than no playbook at all.
