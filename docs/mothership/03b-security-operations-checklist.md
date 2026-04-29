<!-- OPERATOR-ONLY. Pair with 03-secure-architecture.md. The cadence side of the security posture. -->

# 03b — Security Operations Checklist

`03-secure-architecture.md` owns the *principles* (the four "never" rules, the secret topology, the GitHub App identity model, the two-phase HMAC rotation). This file owns the *cadence*: the calendar entries, the drill template, the rotation-schedule matrix, and the anti-pattern list a future doc-lint pass will enforce.

If `03` answers "what is true about secrets in this practice?", `03b` answers "what does the operator do, and how often?"

> **When to read this file.** First Monday of each month (§1). First Friday of each quarter (§2). At every recovery drill (§3). When picking a secret category to rotate (§4). When reviewing canonical-doc edits before merge (§5).

---

## §1 — Monthly checklist (first Monday of the month)

A 30-minute pass. Block it on the calendar; do not skip it. If anything fails, open an issue with `priority/P1` and `area/security` immediately — the next month's pass is too late.

| # | Check | Command / location | Pass criterion |
|---|---|---|---|
| 1 | Rotation due dates | `npx forge audit-secrets` (P5.4 deliverable; until shipped, eyeball the §4 matrix) | Zero rows past their rotation date. Any row within 14 days of its rotation date opens a `priority/P1` issue. |
| 2 | Resend API key inventory | `https://resend.com/api-keys` → key list | One key per **active** client. Orphaned keys (client churned but key still alive) get revoked. Key naming follows `client-<slug>-magic-link` from `12 §2`. |
| 3 | n8n credential count | `n8n.{{BRAND_SLUG}}.com → Credentials` | One credential set per active client. Stale credentials for paused or terminated engagements get archived. Counts must match the active-client roster ±0. |
| 4 | Vercel env spot-check | `vercel env ls --token <operator>` against three random clients | Each spot-check confirms `AUTH_RESEND_KEY`, `AUTH_SECRET`, `N8N_HMAC_SECRET` exist and are within rotation policy. |
| 5 | GitHub App installations | `https://github.com/organizations/{{BRAND_SLUG}}/settings/installations/<APP_ID>` | Installation list ≡ active-client roster + the mothership repo. Any unexpected repo is an incident. |
| 6 | Org-secret scoping | Org Settings → Secrets and variables → Actions | Each secret's "Selected repositories" list = the pipeline repos for active clients. No orphans. |
| 7 | Deprecated PAT exception | `03 §3` row + n8n credential | The PAT row in `03 §3` still names the n8n exception; the PAT itself is within its 90-day expiry. Track the retirement issue from `16 §7`. |
| 8 | Vault audit (operator IP / business secrets) | 1Password admin → Vaults (`Operator`, `Lumivara-Infotech-IP`, `Vendors`, `Per-client/<slug>` × active clients, `Break-glass`); membership and time-box columns per `21-vault-strategy-adr.md §3` + `§4` | No orphan `Per-client/<slug>` vaults (count = active clients ±0); no contractor membership past its time-box; no entry in the vault duplicates a row in the `03 §3` per-client runtime table; `Break-glass` Recovery Kit envelope state matches §2 row 7. Skip rows 8a–8c if the vault has not yet been provisioned (per `21 §10` open question 5) — but log the deferral in `SECURITY_OPS_LOG.md` so the gap is visible. |

After the pass: append a one-line entry to `docs/operator/SECURITY_OPS_LOG.md` — date, who, "pass / N issues opened".

---

## §2 — Quarterly checklist (first Friday of the quarter)

A 90-minute pass. Heavier than the monthly. Block the calendar block now; the calendar entry survives an operator who forgets the quarter started.

| # | Check | Pattern | Output |
|---|---|---|---|
| 1 | Full secret rotation pass | For every row in §4 due this quarter: rotate per the row's pattern (instant / two-phase) and validate. | One git-tracked entry per rotation in `docs/clients/<slug>/secrets-log.md` (per-client) or `docs/operator/SECURITY_OPS_LOG.md` (org-wide). |
| 2 | Recovery drill | Per §3 below. | Entry in `docs/operator/RECOVERY_DRILL_LOG.md`. |
| 3 | `gitleaks` scan summary | Review the most recent `gitleaks` workflow runs across mothership + every active pipeline repo. | Zero findings; any finding opens a `priority/P0` issue. |
| 4 | GitHub secret-scanning alerts | Org → Security → Secret scanning alerts | Triage every alert. Resolve "false positive" with a documented reason. Open issues for true positives. |
| 5 | Audit-trail comment sanitisation review | Walk the most recent 20 PR comments posted by the App or the bot. | No leaked operator prompts, no leaked cost-bucket labels, no leaked model-routing decisions. If any leak: open a `priority/P0` issue and patch the workflow that emitted it (per `12 §6`). |
| 6 | Active-client roster audit | `docs/clients/*` directories vs. the cadence dashboard | Each active client has: a `cadence.json`, a `secrets-log.md`, and exactly one App installation, one Resend key, one n8n credential set. |
| 7 | Off-platform envelope check | Verify the recovery envelope (per `09 §1.5`) is still where it should be. Do **not** open it unless §3's drill requires it. | Envelope present + tamper-seal intact. If broken, re-seal during this quarter's drill and log the event. |

---

## §3 — Recovery drill template

Run this exactly once per quarter (per `09 §1.5`). The drill exists to prove that "if your laptop is gone, you can still recover." A drill that the operator skips is a drill that fails.

### Pre-drill (T-24 h)

1. Notify the second Owner (human path) or confirm the recovery account password is still in the vault (machine path).
2. Confirm the recovery envelope's last-known location.
3. Block the drill calendar entry; note the next drill date.

### Drill steps (T-0)

1. **Sign out** of GitHub on the operator's primary device. Close all tabs.
2. **Sign in as the second Owner** (human path) or as `{{BRAND_SLUG}}-recovery` (machine path) on a different device. Use only the printed recovery codes from the envelope if the primary credential path is unavailable; otherwise use the live credentials.
3. **Verify Owner-level access:** open `https://github.com/orgs/{{BRAND_SLUG}}/settings/people` → confirm the badge reads "Owner."
4. **Probe a settings change** (cosmetic only): toggle the org's display name, save, then revert. This confirms the second Owner can write, not just read.
5. **Sign out** of the second Owner. Sign back in as `palimkarakshay`.
6. If recovery codes were used, regenerate fresh codes for both Owners (`https://github.com/settings/security`), reseal the envelope, redeposit with the trusted second party.

### Post-drill (T+1 h)

Append to `docs/operator/RECOVERY_DRILL_LOG.md`:

```markdown
## YYYY-MM-DD — Quarterly recovery drill

- Drill operator: <name>
- Second Owner identity used: <human-handle | {{BRAND_SLUG}}-recovery>
- Envelope state at drill: <intact | broken | re-sealed>
- Login outcome: <pass | fail (reason)>
- Settings-write probe: <pass | fail (reason)>
- Action items: <list, or "none">
- Next drill: YYYY-MM-DD
```

A failed drill is a `priority/P0` incident: the entire break-glass control is non-operational until the drill passes.

---

## §4 — Secret rotation schedule matrix

Source of truth for "what rotates when, who runs it, and where the evidence lives." This matrix mirrors the `03 §3` table but pivots on cadence rather than topology.

| Secret category | Cadence | Owner of the rotation | Pattern | Validation | Evidence destination |
|---|---|---|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | On `claude setup-token` re-run (no expiry) | Operator | Instant (bearer key; revoke old, paste new) | Run `mothership-smoke.yml`; expect green | `docs/operator/SECURITY_OPS_LOG.md` |
| `GEMINI_API_KEY` | 12 months | Operator | Instant | Smoke against the Gemini-fallback path | `docs/operator/SECURITY_OPS_LOG.md` |
| `OPENAI_API_KEY` | 6 months | Operator | Instant | Run `codex-review.yml` against a no-op PR | `docs/operator/SECURITY_OPS_LOG.md` |
| `APP_PRIVATE_KEY` | 12 months | Operator | Instant (regenerate the App's private key in Org settings; the App itself stays; the old PEM stops working immediately) | Mint a token from a workflow; expect green | `docs/operator/SECURITY_OPS_LOG.md` |
| `APP_ID` | Stable | — | n/a — only changes if the App is rebuilt | — | — |
| `INSTALLATION_TOKEN` | ≤ 1 h, automatic | GitHub | Auto (per workflow run) | None — never stored | — |
| `VENDOR_GITHUB_PAT` (deprecated) | 90 days while it survives | Operator | Instant; track retirement issue from `16 §7` | n8n test-event round trip | `docs/operator/SECURITY_OPS_LOG.md` |
| `N8N_HMAC_SECRET` (per-client) | 12 months | Operator (CLI: `forge rotate-hmac --client <slug>` once shipped) | **Two-phase** (`03 §3.Y`) | Round-trip a Server Action submission with the new key; verify n8n receives it | `docs/clients/<slug>/secrets-log.md` |
| `AUTH_SECRET` (per-client) | 12 months | Operator | Instant — note that rotation invalidates active sessions; communicate before rotating | Magic-link sign-in completes for the operator's test account | `docs/clients/<slug>/secrets-log.md` |
| `AUTH_RESEND_KEY` (per-client) | 6 months | Operator (one Resend API key per client) | Instant — old key revoked at Resend, new key written to that client's Vercel env, redeploy | Send a magic-link to the operator's address | `docs/clients/<slug>/secrets-log.md` |
| `AUTH_GOOGLE_*`, `AUTH_MICROSOFT_*` | Until OAuth app is deleted | Operator | Instant (OAuth secret regen at the provider) | Sign-in with Google/Microsoft on the staging env | `docs/clients/<slug>/secrets-log.md` |
| Twilio sub-account creds (per-client) | 12 months | Operator | Instant (regen at Twilio); verify the n8n credential maps **1:1** with the per-client number | Send a test SMS to the operator's number | `docs/clients/<slug>/secrets-log.md` |
| IMAP password / app password | 6 months | Operator | Instant (regen at email provider) | Receive a probe email through the IMAP intake lane | `docs/operator/SECURITY_OPS_LOG.md` |
| Vercel API token | 6 months | Operator | Instant | Run `forge provision --dry-run` against a throwaway slug | `docs/operator/SECURITY_OPS_LOG.md` |
| Stripe / Lemon Squeezy keys | 12 months | Operator | Instant | Test invoice generation on the operator-only sandbox | `docs/operator/SECURITY_OPS_LOG.md` |

When `forge audit-secrets` ships (`05 §P5.4`), it reads the rotation date column from `docs/clients/<slug>/secrets-log.md` and `docs/operator/SECURITY_OPS_LOG.md` and prints the next-due rows. Until then, the operator scans the matrix manually during the §1 monthly pass.

---

## §5 — Anti-pattern detection (doc-side policy)

These strings and patterns must trigger review when seen in canonical docs (`02`, `02b`, `03`, `04`, `05`, `06`, `09`, `00-INDEX`, plus this file's own §4). They are the doc-side policy a future lint pass will enforce; the implementation of the lint script itself is **out of scope** for this issue and is deferred to a follow-up tracked under "infra: doc-lint for security anti-patterns" (open as a fresh issue when the operator is ready to add a CI workflow under `scripts/`).

### Strings that must NOT appear outside an explicit Deprecated callout

| Pattern | Allowed only inside | Reason |
|---|---|---|
| `VENDOR_GITHUB_PAT` | The Deprecated callout in `03 §3`, the migration note in `09 §2`, `12` (historical critique), `11` (decision record), `16` (historical migration prompts), the §4 matrix above, `pattern-c-enforcement-checklist.md` (until updated), this file's anti-pattern list | The canonical vendor identity is the GitHub App (`03 §3.X`). A new PAT reference outside these contexts is a regression. |
| `90 days; calendar reminder` (paired with PAT) | The Deprecated row in `03 §3` and historical critiques (`11`, `12`) | A 90-day silent-fail rotation is the exact anti-pattern the App migration closes. |
| `same key for every client` (paired with `AUTH_RESEND_KEY`) | This file (§5 examples), `12 §2` (historical), `16` (historical migration prompts) | Per-client keys are the canonical pattern (`03 §3`); shared-key language re-introduces the cost-firewall + fan-out break flagged in `12 §2`. |
| `shared key for every client` / `shared across clients` (any secret) | This file (§5 examples), `12` (historical) | Same reason — per-client is the rule unless the secret is explicitly an operator-only credential (e.g. `OPENAI_API_KEY`). |
| `operator/main` as a target branch name | `02 §8` migration note, `02b §6` deprecated-pattern note, `11`, `12`, `16`, `17` (historical) | Pattern C is canonical; `operator/main` is a deprecated branch-overlay term. |

### Patterns that must trigger a manual review (not a hard block)

- Any new secret added to org-level scope without a matching row in `03 §3` and `03b §4`.
- Any `gh api` call inside canonical docs that uses `${{ secrets.VENDOR_GITHUB_PAT }}` without referencing the deprecated-fallback context.
- Any "rotate" runbook that lacks an explicit pattern column ("instant" vs. "two-phase") — every documented rotation must say which.

### How a future doc-lint script encodes this

The lint script (deferred — see above) walks the canonical doc set and:

1. Greps for each banned pattern.
2. For each hit, walks upward in the doc to determine if the hit is inside a `> **... Deprecated ...**`-style callout block or a section explicitly titled `Historical` / `Decision record` / `Anti-pattern`.
3. Reports any hit not inside such a block as a failure.

The set of allowed-callout titles, the canonical doc list, and the banned-pattern table all start from this file's §5. Edits here are the spec edits.

---

## §6 — Cross-references

- Principles: [`03-secure-architecture.md`](03-secure-architecture.md)
- App identity model: [`03-secure-architecture.md §3.X`](03-secure-architecture.md#3x-github-app-identity-model-canonical-vendor-auth)
- Two-phase HMAC rotation: [`03-secure-architecture.md §3.Y`](03-secure-architecture.md#3y-two-phase-rotation-pattern-for-hmac-style-secrets)
- Break-glass topology: [`09-github-account-topology.md §1.5`](09-github-account-topology.md#15-break-glass-topology-single-owner-is-not-survivable)
- Adding the second Owner: [`09-github-account-topology.md §2.5`](09-github-account-topology.md#25-adding-the-second-owner-break-glass-setup)
- Historical critique that motivated this file: [`12-critique-security-secrets.md`](12-critique-security-secrets.md)

*Last updated: 2026-04-29.*
