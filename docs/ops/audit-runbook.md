<!-- OPERATOR-ONLY. Do not copy to a client repo. -->

# Audit runbook — GitHub + Vercel reconciliation against ops docs

Operator-run procedure for walking the live GitHub + Vercel
configuration and reconciling it against
[`platform-baseline.md`](platform-baseline.md),
[`variable-registry.md`](variable-registry.md), and the Pattern C
enforcement controls in
[`docs/mothership/pattern-c-enforcement-checklist.md`](../mothership/pattern-c-enforcement-checklist.md).
The audit produces one filed issue per mismatch, plus an updated
`_Last verified_` stamp on each ops doc walked.

> This runbook is **operator-manual**. The autopilot does not run it;
> the autopilot's role is to keep the *expected* side
> (`platform-baseline.md` and `variable-registry.md`) accurate as code
> changes land. The operator runs §2–§6 below and files mismatches.

---

## §1 — Inputs

Before starting:

- **`gh` CLI** authenticated as the operator (not the bot account).
  Verify: `gh auth status` shows the operator's GitHub login with
  scopes `repo`, `admin:org`, `workflow`.
- **Vercel API token** (read-only, in the operator vault — see
  [`variable-registry.md §6`](variable-registry.md#6-operator-vault-entries-names-only)
  row "Vercel API token (operator-CLI)"). Export as `VERCEL_TOKEN` for
  the duration of the audit; do not commit.
- **Latest baseline + registry** — on `main`, no uncommitted edits.
  `git switch main && git pull --ff-only` first.
- A **scratch directory** outside the repo for raw exports
  (`mkdir -p ~/audit-$(date -u +%Y%m%d) && cd $_`). The runbook writes
  raw `gh api` and Vercel API output here; nothing in this directory
  ever gets committed.

The audit ends with you back on a docs-only branch in the repo
(`docs/audit/YYYY-QN`) with the `_Last verified_` stamps bumped — see
§6.

---

## §2 — Export from GitHub

Run each export command and capture the output to a file in the
scratch directory. The "Compare against" column tells you which
baseline row the exported value should match.

### §2.1 Actions secrets — names only

```
gh api repos/palimkarakshay/lumivara-site/actions/secrets \
  --jq '.secrets[].name' \
  | sort -u > github-secrets.txt
```

Compare against [`platform-baseline.md §1.1`](platform-baseline.md#11-actions-secrets-repository-scope).
Diff:

```
diff <(grep -oE '`[A-Z_]+`' ../lumivara-site/docs/ops/platform-baseline.md \
        | tr -d '`' | sort -u) \
     github-secrets.txt
```

Any line prefixed `>` is a live secret not in the baseline → file P0.
Any line prefixed `<` is a baseline name absent from live → file P1.

### §2.2 Actions repository variables — names only

```
gh api repos/palimkarakshay/lumivara-site/actions/variables \
  --jq '.variables[].name' \
  | sort -u > github-vars.txt
```

Compare against [`platform-baseline.md §1.2`](platform-baseline.md#12-actions-repository-variables).
Same diff procedure as §2.1.

### §2.3 Actions permissions

```
gh api repos/palimkarakshay/lumivara-site/actions/permissions/workflow \
  > github-actions-permissions.json
```

Compare each field against [`platform-baseline.md §1.3`](platform-baseline.md#13-actions-permissions).
The `default_workflow_permissions` field must equal `read`;
`can_approve_pull_request_reviews` must equal `false`. Any drift = P0.

### §2.4 Branch protection — `main`

```
gh api repos/palimkarakshay/lumivara-site/branches/main/protection \
  > github-branch-protection-main.json
```

Compare each field against [`platform-baseline.md §1.4`](platform-baseline.md#14-branch-protection--main).
The verify-cell `gh api … --jq` invocations enumerate the exact field
names. Any drift in `allow_force_pushes` / `allow_deletions` /
`required_status_checks.contexts` = P0; numeric drift in
`required_approving_review_count` = P1.

### §2.5 Branch protection — `operator/main` (future)

```
gh api repos/palimkarakshay/lumivara-site/branches/operator/main/protection \
  > github-branch-protection-operator-main.json 2>/dev/null \
  || echo '{"_status":"branch-not-yet-created"}' \
        > github-branch-protection-operator-main.json
```

Today this branch does not exist on the single-tenant repo. Skip the
diff; record the export as `branch-not-yet-created`. After the Client
#1 spinout (issue #141), this row becomes a P0 mismatch if the
protection block does not match the canonical Pattern C C-MUST-4
shape.

### §2.6 Rulesets

```
gh api repos/palimkarakshay/lumivara-site/rulesets \
  --jq '.[]?.name' \
  | sort -u > github-rulesets.txt
```

Expected: empty file. Any non-empty line is a P1 mismatch (potential
duplicate / conflict with §2.4 protection).

### §2.7 Pages

```
gh api repos/palimkarakshay/lumivara-site/pages \
  > github-pages.json 2>/dev/null \
  || echo '{"_status":"pages-disabled"}' > github-pages.json
```

Compare against [`platform-baseline.md §1.6`](platform-baseline.md#16-pages).
A `pages-disabled` response when the baseline expects Pages enabled =
P1 (the `deploy-dashboard.yml` workflow will fail).

### §2.8 Webhooks

```
gh api repos/palimkarakshay/lumivara-site/hooks \
  --jq '.[].config.url' > github-hooks.txt
```

Expected: empty file. Any URL = P0 (the trust model assumes
zero repo→external webhooks; all egress flows via Vercel runtime +
HMAC).

### §2.9 Issue templates

```
ls .github/ISSUE_TEMPLATE/ > github-issue-templates.txt
```

Compare against [`platform-baseline.md §1.8`](platform-baseline.md#18-issue-templates).
A missing `audit-mismatch.md` template = P1 (this runbook depends on
it for §5).

---

## §3 — Export from Vercel

Vercel exposes most settings via the v10 REST API. A few are
`[UI-only]` — record them by screenshot into the scratch directory
(`vercel-ui-<setting>.png`).

### §3.1 Environment variables — names + scopes

```
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env" \
  | jq -r '.envs[] | [.key, (.target | join(","))] | @tsv' \
  | sort -u > vercel-env.tsv
```

Substitute `$VERCEL_PROJECT_ID` from the project URL or
[`variable-registry.md §3`](variable-registry.md#3-vercel-environment-variables)
row `VERCEL_PROJECT_ID`. The output is two columns: env-var name and
its scope set (`production`, `preview`, `development`).

Compare against [`platform-baseline.md §2.1`](platform-baseline.md#21-environment-variables).
Diff procedure (per §4): expected names = first column of the §2.1
table; expected scopes = the `Scope` column. A missing scope (e.g. an
env var present in Production but baseline says Production + Preview)
= P1 (Preview deploys break).

### §3.2 Production branch and deploy posture

`[UI-only]` — capture screenshots of:

- Vercel → Settings → Git (production branch, ignored build step,
  GitHub integration).
- Vercel → Settings → Domains.
- Vercel → Settings → Webhooks.

Record one screenshot per row in
[`platform-baseline.md §2.2`](platform-baseline.md#22-production-branch-and-deploy-posture)
and §2.3, named `vercel-ui-<setting>.png`. Diff visually.

### §3.3 Domains

```
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects/$VERCEL_PROJECT_ID/domains" \
  | jq -r '.domains[] | [.name, .verified, (.redirect // "—")] | @tsv' \
  | sort -u > vercel-domains.tsv
```

Compare against [`platform-baseline.md §2.3`](platform-baseline.md#23-domains).
The canonical domain must appear with `verified=true`; the apex/`www`
must redirect to the canonical.

### §3.4 Deploy hooks

`[UI-only]` (Vercel → Settings → Git → Deploy Hooks). Capture as
`vercel-ui-deploy-hooks.png`. The list must contain exactly one entry
per `VERCEL_DEPLOY_HOOK_<UPPERSLUG>` row in
[`platform-baseline.md §2.1`](platform-baseline.md#21-environment-variables).

---

## §4 — Compare

Walk each baseline section in order. The procedure is identical for
every row:

| Column | Source |
|---|---|
| **Expected** | The row in `platform-baseline.md` (or `variable-registry.md` for the cross-surface inventory). |
| **Actual** | The export from §2 / §3, captured into the scratch directory. |
| **Delta** | One of: `match`, `extra` (live has, baseline doesn't), `missing` (baseline has, live doesn't), `drift` (both have, values differ). |

**Worked example.**

Baseline row from `platform-baseline.md §1.1`:

> `OPENAI_API_KEY_BACKUP` | operator | 6 months | Codex review fallback.

Export from `github-secrets.txt`:

```
CLAUDE_CODE_OAUTH_TOKEN
GEMINI_API_KEY
OPENAI_API_KEY
OPENAI_API_KEY_BACKUP
VERCEL_API_TOKEN
VERCEL_PROJECT_ID
VERCEL_TEAM_ID
```

Delta: `match`. No issue filed.

If `OPENAI_API_KEY_BACKUP` were missing from the export, delta =
`missing`, severity = P1 (Codex review fallback would fail; not
customer-blocking but reduces review robustness).

If a `LEGACY_OPENAI_KEY` appeared in the export but not the baseline,
delta = `extra`, severity = P0 (unaccounted-for credential).

**Recording the comparison.** Append each delta row to a markdown
file in the scratch directory:

```
# Audit YYYY-QN — deltas

| Surface | Control | Expected | Actual | Delta | Severity | Issue # |
|---|---|---|---|---|---|---|
| GitHub.actions-secrets | OPENAI_API_KEY_BACKUP | present | present | match | — | — |
| Vercel.env (Production) | NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID | present | absent | missing | P1 | (filed §5) |
```

Keep this file local — it goes into the audit's PR description in §6,
not into the repo.

---

## §5 — File mismatches

For every delta row that is not `match`, file one issue using
[`.github/ISSUE_TEMPLATE/audit-mismatch.md`](../../.github/ISSUE_TEMPLATE/audit-mismatch.md):

```
gh issue create \
  --repo palimkarakshay/lumivara-site \
  --template audit-mismatch.md \
  --title "audit YYYY-QN: <Surface>.<Control> drift — <one-line>"
```

Fill the template fields:

- **Control** — the section + row in `platform-baseline.md` /
  `variable-registry.md` (e.g. "platform-baseline §1.4 / branch protection on main / allow_force_pushes").
- **Expected** — the cell value from the baseline row.
- **Actual** — the value observed in the live export (paste verbatim
  from the scratch file).
- **Severity** — apply this rubric:
  - **P0** — secret leak; a private control (allow_force_pushes,
    allow_deletions, enforce_admins, required_status_checks) toggled
    in a less-safe direction; a repo webhook appearing where none
    should exist; a credential present without a matching baseline
    row.
  - **P1** — drift in a routing variable; a missing
    `needs-vercel-mirror` mirror; a baseline name absent from live;
    a numeric drift on a protection rule (e.g. review count from 1 →
    0); Pages disabled when baseline expects it on.
  - **P2** — doc-only drift (e.g. baseline names a deprecated alias);
    cosmetic mismatch with no runtime impact.
- **Owner** — `operator` for credentials / repo settings; `client`
  only when the row's `Owner` column says `client` (per-engagement
  Vercel env vars).
- **Pointer to baseline doc** — direct link to the section anchor in
  `platform-baseline.md` / `variable-registry.md`.

Severity rule of thumb: **if a leak or a less-safe protection happens
silently, P0**. If a build or a workflow fails noisily, P1. If
nothing breaks but the docs are wrong, P2.

---

## §6 — Close the loop

Once every delta has either an issue filed or has been resolved
in-place during the audit:

1. **Branch + commit.**

   ```
   git switch -c docs/audit-$(date -u +%Y-Q%q)
   ```

   Update `_Last verified_` lines in three places:

   - [`platform-baseline.md §4`](platform-baseline.md#4-last-verified-stamp)
     — bump the date and operator name.
   - [`variable-registry.md §7`](variable-registry.md#7-last-verified-stamp)
     — bump the date.
   - This runbook's §8 below — append a one-line audit log row.

2. **PR.** Open with the `auto-routine` label removed and `human-only`
   added — audits are operator-attested, not bot-merged.

   ```
   gh pr create \
     --label "human-only" \
     --label "area/forge" \
     --title "audit YYYY-QN: reconcile ops docs against live config" \
     --body-file <(cat <<EOF
   ## Audit summary

   - Run date (UTC): $(date -u +%Y-%m-%d)
   - Surfaces walked: GitHub repo (§2.1–§2.9), Vercel project (§3.1–§3.4)
   - Deltas filed: <N issues, list below>
   - Deltas resolved in-place: <list, with one-line rationale>

   ## Filed mismatches

   - #<n> — <P0/P1/P2> <Surface>.<Control>
   - …

   ## Verification

   - [ ] _Last verified_ stamps bumped in platform-baseline.md, variable-registry.md, audit-runbook.md §8
   - [ ] One issue filed per non-resolved delta
   - [ ] Scratch exports retained outside the repo until next audit
   EOF
   )
   ```

3. **No autopilot follow-up.** The filed mismatch issues route through
   the normal triage / execute pipeline. The audit PR itself is
   docs-only and merged by the operator after review.

---

## §7 — Cadence

| Trigger | Action |
|---|---|
| Default | Quarterly — first business day of the quarter. |
| Secret rotation (any row in `variable-registry.md` rotating) | Audit on the same day; do **not** wait for the next quarterly. |
| Branch-protection change on any client repo | Audit on the same day. |
| New client repo onboarded | Run §5 of `pattern-c-enforcement-checklist.md` *before* declaring the spinout done; that audit pass is the first audit for the new repo. |
| Change to this runbook, `platform-baseline.md`, or `variable-registry.md` | Re-walk the changed sections only; bump only the changed `_Last verified_` stamp. |

---

## §8 — Audit log

One row per audit. Append; never edit historical rows.

| Date (UTC) | Operator | Surfaces walked | Deltas filed | PR |
|---|---|---|---|---|
| 2026-04-29 | (none — runbook initial commit) | — | — | (this PR) |

> When a row says `(none — runbook initial commit)` it is a placeholder
> for the runbook landing, not a real audit pass. The first real
> audit row should follow at the next quarterly cadence and replace
> the dash entries with concrete numbers.

---

## §9 — Deferred wrappers (not authored here)

Two natural enhancements live in the deferred-follow-ups bucket
because the auto-routine playbook excludes the paths they would
touch:

- **`scripts/audit-export.sh`** — wraps the §2 / §3 `gh` and `curl`
  commands and emits a single TSV the operator diffs in §4. Lives in
  `scripts/` (forbidden under auto-routine). File a follow-up issue
  labelled `area/infra`, `auto-routine` *only* once a routing-rubric
  exception is in place.
- **`.github/workflows/audit-drift.yml`** — a low-frequency cron that
  runs §2 (read-only) and posts a summary to the dashboard if any
  `extra` or `drift` deltas appear. Lives in
  `.github/workflows/` (forbidden under auto-routine). File the same
  way as above when ready.

Both are explicitly **out of scope** for the docs-only PR that landed
this runbook (issue #145). If the operator wants either, file the
follow-up by hand with a label that opens the auto-routine path.

---

## See also

- [`platform-baseline.md`](platform-baseline.md) — the **expected** side this runbook diffs against.
- [`variable-registry.md`](variable-registry.md) — the cross-surface inventory of every named key.
- [`docs/mothership/pattern-c-enforcement-checklist.md`](../mothership/pattern-c-enforcement-checklist.md) §6 — Pattern C audit cadence; this runbook's §7 is the GitHub + Vercel concretisation of that cadence.
- [`docs/mothership/03-secure-architecture.md §3.2`](../mothership/03-secure-architecture.md#32-audit-cadence) — the secret-rotation cadence this runbook operationalises.
- [`.github/ISSUE_TEMPLATE/audit-mismatch.md`](../../.github/ISSUE_TEMPLATE/audit-mismatch.md) — the template §5 files mismatches with.
