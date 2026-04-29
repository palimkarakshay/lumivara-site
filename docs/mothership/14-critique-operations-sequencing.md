<!-- OPERATOR-ONLY. Pair with 04, 05, 06, 07, 08. -->

# 14 — Critique: Operations, Sequencing & Coherency

The pack is internally cross-referenced but has several sequencing gaps where the order of operations matters and isn't enforced. This doc names them and tells you when each item must be sequenced relative to the others.

---

## §1 — 🟡 Tier 0 economics are a loss-leader, not a tier

`freelance/02` describes Tier 0 as "$1,200 setup, no monthly, future changes billed at $90 per change (1-day turnaround)." `07 Dummy F` (Jimmy Barber) follows this.

The honest accounting:

- A "single change" with 1-day turnaround takes ~30 min of operator time (read request, edit, push, verify). At ~$200/h target rate that's $100 of operator time for $90 revenue.
- There's no per-change tracking system; the operator has to remember and invoice manually each month.
- T0 clients have no automation; they're 100% operator overhead at no recurring revenue.
- The Stripe / Lemon Squeezy fees on $90 chip ~3% off the top.

**Verdict:** T0 is a portfolio-builder and a referral net, not a profitable tier. Document this honestly:

```
freelance/02 Tier 0 — Strategic role:
  This is a portfolio-builder and a referral net, NOT a profit center.
  Treat each T0 as a paid case study. Cap T0 at 5 active engagements;
  beyond that, decline or upsell to T1.
```

The current "deliberately priced cheap enough to clear quickly, but not so cheap it attracts problem clients" language is fine for the gig profile (`freelance/01`), but the pricing tiers doc should be honest about the margin.

---

## §2 — 🟡 Authoritative source for templates is ambiguous mid-migration

Until P5.6 completes, `lumivara-site` and `mothership/client-template/` both contain "the Next.js scaffold." Two issues:

1. **Which one is canonical?** Both will get updates (the live site receives PRs from the autopilot; the template might receive operator edits in mothership). Drift is inevitable.
2. **The Lumivara People Advisory site is a *client* engagement that the operator is also using as the *template lab*.** That dual-purpose is an experiment, not a sustainable pattern. Future clients shouldn't see their own site treated as the operator's R&D environment.

**Fix sequence:**

1. **Day 0:** declare `mothership/client-template/` canonical the moment P5.1 starts. Any change to scaffold goes there first, then propagates to live clients via `forge upgrade-templates`.
2. **Until P5.6 ships:** freeze scaffold changes on `lumivara-site/main`. New ideas → mothership template → next provision picks them up.
3. **At P5.6:** rename `lumivara-site` → `lumivara-people-advisory-site` *and* simultaneously branch a `forge-smoke-test-co` repo as the new template lab. Beas gets the same provisioning pipeline as everyone else; the experiment gets a sandbox.

This decouples R&D from a real client engagement.

---

## §3 — 🟡 Per-client OAuth provisioning is mostly manual

`06 §4 Prompt B2 step 3-4` says:

> 3. Google OAuth client provisioning: In Google Cloud Console: create a new OAuth 2.0 client...
> 4. Microsoft Entra App Registration: Same as Google but for Entra...

The Google Cloud OAuth-client API is not first-class. You can use `gcloud iap oauth-clients create` only on internal-IAP audiences; for "Web application" OAuth clients (which is what the magic-link flow needs), the only supported path is the Console UI. Microsoft Entra has Graph API support, but tenant consent prompts can't be automated.

**Reality:** the `forge provision` CLI claim "automates Vercel + n8n + Twilio + Google OAuth + Entra" is half-true. Roughly 70% can be automated; the OAuth provider apps will remain manual for the foreseeable future.

**Fix:**

1. **Honest framing:** the provision CLI does Vercel + n8n + Twilio fully. The two OAuth apps are guided manual steps with copy-paste prompts and screen-captures.
2. **Reduce per-client OAuth count:** consider whether T1 truly needs both Google and Entra OAuth. T1 clients are usually solo operators on Gmail; Entra is for staff with corporate identity. If a client doesn't use Microsoft, skip the Entra app entirely. Default `cadence.json`:
   ```yaml
   auth_providers:
     - magic_link  # always
     - google      # if client uses GSuite or personal Gmail
     - microsoft   # only if client uses Microsoft 365
   ```
3. **One shared "operator OAuth client" for magic-link only:** if you can live with all magic-link emails coming from one OAuth app's `noreply@<auth-domain>`, you skip per-client OAuth entirely for the Resend lane. Worth piloting on T0/T1.

Update `06 §4` to reflect the honest manual scope.

---

## §4 — 🟡 The "first 30 days post-handover" lacks a rollback path

`06 §7` describes Days 1, 3, 7, 14, 30 — all happy-path. There's no documented rollback if Day 1's "client signed in to /admin" fails, or if Day 14's first improvement run produces a regression.

**Fix:** add a small Day-by-Day failure protocol:

```
Day 1 fail (client can't sign in)
  → check magic-link delivery in Resend dashboard
  → check admin-allowlist.ts has client's email
  → if both green, Auth.js issue → escalate to Run-A backlog issue.

Day 7 fail (deep-research produces bad issues)
  → close all auto-generated issues with `wontfix`
  → run with operator-edited prompt instead, dispatched manually
  → log in engagement-log.md.

Day 14 fail (improvement run breaks something)
  → revert via `gh pr revert <PR>`
  → re-deploy via Vercel UI
  → open `incident/<date>-<client>` issue in mothership
  → 14-day cool-off before next improvement run on that client.

Day 30 charge fails
  → already covered in 08 §3.
```

Costs nothing; saves a panicked Sunday afternoon at client #4.

> **Closed by `06 §7`:** the rollback paths above now live in `06 §7`'s Day-table "Rollback if step fails" column, and the matrix Step IDs `D30-01`..`D30-05` (in `18 §7`) carry the validation commands. This `§4` remains the source-of-record for *why* the rollbacks exist; `06` is where the operator reads them on the day.

---

## §5 — 🟡 Doc-to-doc cross-references will rot

The pack has ~80 internal cross-references (e.g., "see `02 §5`", "per `04 §1`"). Today they're all correct. After the next rename or section-renumber, half will be wrong.

**Fix:** add `mothership/.github/workflows/docs-link-check.yml`:

```
- on: pull_request paths: ['docs/mothership/**', 'docs/**']
- runs lychee or a small Python script
- fails the PR if any internal link or section anchor is broken
```

Costs 10 minutes once. Saves the next operator (or Future-You at 2am) from chasing dead references.

---

## §6 — 🟡 Engagement-log.md is undefined

`05 §P5.5` and `06 §8` both reference `docs/clients/<slug>/engagement-log.md` but neither defines its schema. Without a schema, every client's log will look different and aggregation (e.g., "what's the average time-to-first-deploy across all clients?") is a manual diff exercise.

**Fix:** define the schema in `docs/operator/ENGAGEMENT_LOG_SCHEMA.md`:

```yaml
# Each entry is appended; never edit prior entries.
- date: 2026-04-28
  type: milestone | tier-change | incident | improvement-run | invoice | comms
  summary: "Engagement opened, Tier 2"
  details: |
    Multi-line free text.
  ref:
    issues: [42, 43]
    prs: [#101]
    n8n_executions: ["abc123"]
```

A 30-line `forge log --client <slug> append --type milestone --summary "..."` makes the schema self-enforcing. Run a daily cron that generates `mothership/docs/operator/PRACTICE_LOG.md` aggregating all clients.

This is what makes the practice review-able year-over-year.

> **Sibling doc:** `19-engagement-evidence-log-template.md` adds a per-engagement *evidence* log (`docs/clients/<slug>/evidence-log.md`) covering the gated provisioning + first-30-days steps named in `18-provisioning-automation-matrix.md`. The engagement-log schema named here is unchanged; the evidence log is a sibling, not a replacement. See `19 §0` for the side-by-side.

---

## §7 — 🟡 The contract → engagement → site sequence has implicit ordering

`06 §1` (pre-flight checklist) lists "Engagement contract signed" first, then "Intake form received," then "Tier locked." But the *signed contract* and the *tier* are circular: the contract names the tier; the tier shapes the contract; you can't sign one without the other.

In practice, the operator's flow is:

```
1. Discovery call (free, 30min)
   ↓
2. Operator writes a one-page proposal with a recommended tier
   ↓
3. Client returns the proposal signed + intake form completed
   ↓
4. Operator signs proposal, kicks off provision
```

Document this as the canonical sequence in `06 §1`:

```
Pre-flight, expanded:
  Step 0 — Discovery call (free, 30 min)
  Step 1 — Operator writes one-page proposal (template:
           docs/operator/PROPOSAL_TEMPLATE.md) naming tier + scope.
  Step 2 — Client signs proposal (DocuSign / PandaDoc free tier).
  Step 3 — Client returns intake form (Google Form → Apps Script writes
           docs/clients/<slug>/intake.md to the mothership repo via PR).
  Step 4 — Operator countersigns proposal.
  Step 5 — Operator runs `forge provision`.
  Step 6 — Smoke test → handover pack → walkthrough call.
```

Six steps, one diagram. Today the pack assumes the operator carries the order in their head.

---

## §8 — 🟡 Backups are unspecified

The pack stores all of this in GitHub + Railway + Vercel + 1Password (future). What if any one of those vendors goes hostile, gets breached, or simply locks the operator out for a billing dispute?

**Fix:** document a backup-of-record:

```
Daily (forge backup):
  - mothership repo → encrypted tarball → operator's external SSD
  - Each client repo → encrypted tarball → same
  - Vercel env vars → encrypted JSON → same
  - n8n workflows → JSON export → same
  - Twilio number list → CSV → same

Weekly:
  - Sync external SSD → cloud backup (Backblaze B2 ~$1/mo for 100GB).

Monthly:
  - Restore drill: pick a random client, restore from backup to a
    forge-restore-test repo, confirm Vercel preview boots, confirm
    /admin sign-in works. Log to docs/operator/RESTORE_DRILL_LOG.md.
```

Cost: $1–$5/mo. Avoids the "Vercel locked our account" nightmare.

---

## §9 — 🟢 Lesser: dummy clients should be visibly fictional

`07` lists six dummy intake forms with realistic Toronto phone numbers. If the operator pastes one of these YAML blocks into a real Stripe webhook or Resend dashboard test, real numbers get associated with fake names. Risk is low but easy to mitigate:

- Use 555-prefix area codes that are reserved for fictional use (`+1 416 555 0142` is fine — already 555 in the third octet).
- Use `*.test` TLDs in domains rather than real ones (`lumivara.test`, `johnsplumbing.test`).
- Add a banner at top of `07`: "Every value below is fictional. Do not paste into a third-party UI."

`07` already uses 555 numbers but uses real-looking TLDs. Add the `.test` swap and the banner.

---

## §10 — Summary action list (cross-cutting Run D, optional)

These are smaller and can land alongside any of Run A / B / C:

```
[ ] Update freelance/02 Tier 0 with the loss-leader honesty.
[ ] Freeze scaffold changes on lumivara-site; declare client-template
    canonical (§2).
[ ] Rewrite 06 §4 Prompt B2 to acknowledge OAuth manual scope (§3).
[ ] Add cadence.json `auth_providers` flag.
[ ] Add Day-1/7/14 rollback protocols to 06 §7 (§4).  ← scheduled by issue #137 (provisioning matrix PR series); `06 §7` now carries the rollback column.
[ ] Add docs-link-check.yml to mothership repo (§5).
[ ] Define ENGAGEMENT_LOG_SCHEMA.md (§6).
[ ] Document the discovery → proposal → intake → provision sequence
    in 06 §1 (§7).
[ ] Document daily/weekly/monthly backup runbook (§8).
[ ] Sweep dummy intakes for .test TLDs (§9).
```

Estimated turns: 80–100 in one Sonnet session. No prompt-pack entry; this is a composite cleanup that can ride along with any of Runs A–C.

*Last updated: 2026-04-28.*
