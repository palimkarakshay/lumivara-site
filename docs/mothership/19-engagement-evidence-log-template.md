<!-- OPERATOR-ONLY. Per-engagement template. Pair with 18 (matrix) and 06 (runbook). -->

# 19 — Engagement Evidence-Log Template

Per-client provisioning evidence log. The operator copies this file to `docs/clients/<slug>/evidence-log.md` at engagement start, fills the engagement-metadata header once, and appends one entry per provisioning step as the work happens.

The schema below is what the gate-checks in `06` read literally. A step is "✅" when its entry has both a non-empty `proof_link` (or `screenshot_path`) and a `validation_output` matching the validation column for that Step ID in `18-provisioning-automation-matrix.md`.

---

## §0 — How this template relates to the engagement-log

Each engagement has **two** logs in `docs/clients/<slug>/`:

| File | Owns | Schema | Lifetime |
|---|---|---|---|
| `evidence-log.md` (this template) | Per-step provisioning evidence: PRE-01 through D30-05 only. | `19` (this file). Append-only Markdown entries keyed by Step ID. | Engagement onboarding only. After D30-05 closes, the file is read-only; subsequent monthly check-ins log to `engagement-log.md`. |
| `engagement-log.md` | Long-running engagement journal: milestones, tier changes, incidents, comms, invoices. | `14 §6` schema (`docs/operator/ENGAGEMENT_LOG_SCHEMA.md`). | Entire engagement, from intake through teardown. |

They are siblings, not replacements. `evidence-log.md` is the audit trail of "did the system get provisioned correctly?"; `engagement-log.md` is the audit trail of "what happened during the engagement?"

---

## §1 — Header (frozen at engagement start)

Copy the block below verbatim into the new `evidence-log.md` and fill every value once. The header is **frozen** — never edit a header field after PRE-03 lands. If a frozen value changes (e.g., tier upgrade), append an `engagement-log.md` entry of `type: tier-change` and reference the new tier from there; do **not** rewrite the evidence-log header.

```yaml
---
client_slug: {{CLIENT_SLUG}}
client_name: "{{CLIENT_NAME}}"
tier: {{TIER}}                          # T0 / T1 / T2 / T3
engagement_started: {{YYYY-MM-DD}}      # date PRE-01 was completed
contract_ref: docs/clients/{{CLIENT_SLUG}}/contract.md.age
intake_ref: docs/clients/{{CLIENT_SLUG}}/intake.md
domain: {{DOMAIN}}
brand_voice_doc: {{LINK_OR_PATH}}       # path or URL to the voice/tone reference (often a section of intake.md)
auth_providers:                         # from cadence.json
  - magic_link
  - google                              # omit if client doesn't use GSuite/Gmail
  - microsoft                           # omit if client doesn't use Microsoft 365
operator_initials: {{INITIALS}}         # primary operator running this engagement
matrix_version: "18-2026-04-29"         # the version of 18-provisioning-automation-matrix.md used
---
```

---

## §2 — Per-step entries (appended chronologically)

Append one entry per Step ID as the work happens. Never edit a prior entry. If a step has to be redone, append a second entry with the same `step_id` and a `redo_of: <timestamp>` field pointing at the original.

### Schema

```yaml
- step_id: {{STEP_ID}}                         # e.g. PRE-01, A-03, B2-06
  timestamp: {{YYYY-MM-DDTHH:MM:SSZ}}          # UTC, ISO 8601
  operator_initials: {{INITIALS}}
  automation_used: {{AUTOMATION}}              # full / semi / manual / future-CLI — must match 18's column for this Step ID at the time of writing
  proof_link: {{LINK}}                         # one of: pr-url, run-url, n8n-execution-url, deployment-url. Use this OR screenshot_path, not both.
  screenshot_path: {{PATH}}                    # relative path under evidence/ — use when no URL exists (UI-only steps)
  validation_output: |                         # paste the actual command output (or describe the visible field). Must satisfy the 18 validation column.
    {{the literal stdout, JSON snippet, or "screen X shows field Y = Z"}}
  rollback_executed: false                     # set true if the row's rollback path (in 06 §2-§7) had to run; in that case add rollback_notes
  rollback_notes: |                            # only present when rollback_executed is true
    {{what was rolled back, what was retried, references to incident issues}}
  redo_of: {{prior_timestamp}}                 # only present when this entry redoes an earlier one
  notes: |                                     # optional free text — gotchas, deviations, follow-ups
    {{anything the next operator should know}}
```

Required fields: `step_id`, `timestamp`, `operator_initials`, `automation_used`, `validation_output`, plus exactly one of `proof_link` or `screenshot_path`. `rollback_executed` defaults to `false` and may be omitted when false.

### Example entries

The three entries below show the typical shapes the schema takes (CLI happy-path, CI run reference, and OAuth manual screen-recording). Replace these with real entries during a real engagement.

```yaml
- step_id: PRE-01
  timestamp: 2026-04-29T14:02:11Z
  operator_initials: AP
  automation_used: manual
  screenshot_path: evidence/pre-01-contract.md
  validation_output: |
    HTTP/2 200
    content-type: application/json; charset=utf-8
    (gh api repos/.../contents/.../contract.md.age — file present, 4,215 bytes)
  notes: |
    Contract countersigned via DocuSign on 2026-04-28; PDF + clause summary
    encrypted to .age and committed in mothership PR #802.

- step_id: A-03
  timestamp: 2026-04-29T16:48:03Z
  operator_initials: AP
  automation_used: full
  proof_link: https://github.com/lumivara-forge/dummy-co-site/actions/runs/14029881127
  validation_output: |
    gh run list --repo lumivara-forge/dummy-co-site --workflow build.yml --limit 1
    --json conclusion --jq '.[0].conclusion'
    success
  notes: |
    First scaffold build; no warnings.

- step_id: B2-06
  timestamp: 2026-04-29T18:12:55Z
  operator_initials: AP
  automation_used: manual
  screenshot_path: evidence/b2-06-twilio.json
  validation_output: |
    twilio api:core:incoming-phone-numbers:list --properties=phoneNumber,smsUrl
    +14165550142  https://n8n.lumivara-forge.com/webhook/intake-sms-dummy-co
  rollback_executed: false
  notes: |
    Bought a Toronto 416 number with SMS-only capability (no voice). Updated
    env.json TWILIO_INBOUND_NUMBER before re-encrypting in B2-11.
```

---

## §3 — Closure (filled when D30-05 lands)

Append the block below as the final entry in `evidence-log.md`. Do **not** edit the per-step entries above when closing — closure is its own appended block.

```yaml
- closure:
    closed_at: {{YYYY-MM-DDTHH:MM:SSZ}}        # when D30-05's evidence was captured
    closed_by: {{INITIALS}}
    handover_pack_ref: docs/clients/{{CLIENT_SLUG}}/handover.md
    archived_at: {{YYYY-MM-DD}}                # when this file is moved to read-only state
    follow_up_engagement_log_entry: {{LINK}}   # link to the engagement-log.md entry that succeeds the evidence log
    open_incidents: []                         # list any unresolved `incident/<date>-<slug>` issues
    notes: |
      {{wrap-up notes — anything the next operator (including future-you)
      should know about how this engagement was provisioned}}
```

Once the closure block is appended, the file is read-only. New work logs to `engagement-log.md` from this point onward.

---

## §4 — Operator etiquette

- **Append-only.** Never edit a prior entry. If a step is redone, append a new entry with `redo_of: <prior_timestamp>`.
- **One entry per Step ID at a time.** If you find yourself opening two entries for the same Step ID without a `redo_of`, stop — you've duplicated the row.
- **No secrets in the log.** Paste the validation command's stdout, not the secret values it emitted. The `evidence-log.md` is plaintext in the mothership repo; any secret in it is a leak.
- **`screenshot_path` files belong under `evidence/`.** Keep them in the same per-client directory. The path is relative; rendered in GitHub it resolves cleanly.
- **`proof_link` URLs should be permalinks.** GitHub run URLs and Vercel deployment URLs are permalinks; n8n execution URLs are stable. PR URLs are stable; PR comment URLs are not.
- **OAuth steps need both a screen-recording and a screenshot.** The recording proves the redirect URI was set correctly; the screenshot is the readable record. See `18 §4` rows B2-09, B2-10.
- **The matrix version field matters.** When `18-provisioning-automation-matrix.md` is updated (e.g., `forge provision` flips a row from `manual` to `full`), the next engagement bumps `matrix_version` in the header. In-flight engagements stay on the older matrix version through closure to keep the evidence audit-able against a stable schema.

---

*Last updated: 2026-04-29.*
