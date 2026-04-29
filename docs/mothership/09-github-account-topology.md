<!-- OPERATOR-ONLY. Answers: "Should I create a new GitHub org?" -->

# 09 — GitHub Account Topology (free-tier-first)

A standalone answer to the question "should I create a new GitHub account/org for the mothership, with Akshay as employee?" Baked here so the mothership setup prompt and the security doc stay aligned.

## TL;DR

- ✅ **Yes — create a GitHub Organisation** for the mothership. Free tier covers everything you need to start.
- ❌ **No — do NOT create a second personal GitHub user account for Akshay.** GitHub's ToS allows one personal account per human. Your existing `palimkarakshay` account becomes Owner of the new org, which IS the "Akshay-the-employee-of-Lumivara-Forge" identity.
- ✅ **Yes — create one separate machine/bot account** (`{{BRAND_SLUG}}-bot`). Machine accounts are GitHub-permitted as long as they're clearly identified.

So the topology is: **2 GitHub identities + 1 organisation**, all on free tier.

---

## 1. The three identities

| Identity | Type | Role | Cost |
|---|---|---|---|
| `palimkarakshay` (existing) | Personal user | Owner of the mothership org and of every per-client site + pipeline repo (until handover). The "Akshay" signing identity. | Free |
| `{{BRAND_SLUG}}-pipeline-bot` (new — e.g. `lumivara-forge-pipeline-bot`) | **GitHub App** (org-owned) | Canonical vendor identity under Pattern C. Installed per engagement on each `<slug>-site` repo; the pipeline repo's workflows mint short-lived installation tokens to push branches and open PRs against the site repo. Replaces the legacy machine-user PAT. See `02b §3` and `03b-github-app-spec.md` (Run B). | Free |
| `{{BRAND_SLUG}}` (new — e.g. `lumivara-forge`) | Organisation | Houses org-level Action secrets, branch-protection rulesets, the mothership repo, dashboards, and **two repos per engagement** (`<slug>-site` and `<slug>-pipeline`). | Free |

GitHub Free tier includes — for organisations on private repos — everything the autopilot needs:
- Unlimited private repos
- 2,000 Actions minutes/month per org (free Linux runners)
- 500 MB Packages storage
- Org-level Actions secrets with "Selected repositories" scoping
- Branch protection rulesets on private repos
- GitHub Pages for the dashboard
- Code review, issues, projects, discussions — all included

**You only need to upgrade if/when:**
- You cross ~2,000 Actions minutes/month (≈ 25 active T2 clients with current cron) → **Team at $4/user/month**, gives 3,000 min + extra paid.
- You want SAML SSO, audit-log API, IP allow-lists → **Team or Enterprise**.
- You want "Internal" repo visibility (a 3rd visibility between public and private, scoped to org members) → **Team**.

None of those apply for months 1–6 of paid operations. Stay free.

---

## 1.5 Break-glass topology (single-Owner is not survivable)

`§1` lists `palimkarakshay` as the only Owner of the org. That is the bootstrap shape; it is not the steady-state shape. A single Owner means a single point of failure: phishing, lost MFA recovery codes, hospitalisation, or a stolen laptop without a vault recovery path each end the entire business in one incident. The break-glass topology fixes this without forcing a paid plan tier and without giving up the "keep the operator's posture small" property `12 §1` flagged.

### Required components

| Requirement | What it is | Implementation today | Implementation post-Pattern-C / multi-client |
|---|---|---|---|
| **Second Owner** | A second identity with org-Owner permission | One human (trusted co-founder, sibling, accountant) **or** one machine identity `{{BRAND_SLUG}}-recovery` whose recovery codes live in the off-platform envelope (see below). Pick one path; document the choice in `docs/operator/RECOVERY_DRILL_LOG.md`. | Same. The choice can change, but the doc must reflect what is true today. |
| **2-of-2 rule on org settings changes** | A norm-and-process rule, not a GitHub feature on Free tier | Document in this file + `03b §1` monthly checklist; the operator self-enforces by waiting for the second Owner's ack before changing branch protections, repo collaborators, or org secrets. | Enforce via Enterprise's `Require admin approval` ruleset (post-month-6, when Team or Enterprise lands). Until then, the rule is procedural and the audit log is the evidence trail. |
| **Off-platform recovery envelope** | The "if your laptop and phone are both gone" backup | Print recovery codes from `https://github.com/settings/security` and `1Password Settings → Account recovery`. Seal in a tamper-evident envelope. Deposit with the trusted second party (lawyer, sibling, safe-deposit box). One envelope, both sets of codes. | Same. Re-seal on every quarterly drill if the envelope is opened to verify codes. |
| **Quarterly recovery drill** | Proof the break-glass actually opens | First Friday of every quarter: log in as the second Owner (or as the recovery machine identity), confirm Owner-level access, log out. Append a one-line entry to `docs/operator/RECOVERY_DRILL_LOG.md` with date, who, "pass/fail", action items. | Same. Drill failures are P0 issues. |

The cost of the break-glass is one extra free GitHub identity, one envelope, and 15 minutes per quarter. The cost of skipping it is the entire business.

A canonical step-by-step for adding the second Owner lives in §2.5.

---

## 2. Setup order (do this once, before any client #2 work)

1. **Create the organisation** at github.com/organizations/new → Free plan → owner email = your existing operator email. Name: `{{BRAND_SLUG}}`. Display name: `{{BRAND}}`. Pick the slug carefully — it's permanent without a paid migration.
2. **Add `palimkarakshay` as Owner** (you'll be auto-added since you created the org from that account).
3. **Settings → Member privileges → Base permissions = No permission.** Forces explicit per-repo grants.
4. **Settings → Actions → Workflow permissions = Read and write** (so workflows can comment on PRs, manage labels).
5. **Create the GitHub App `{{BRAND_SLUG}}-pipeline-bot` (the canonical vendor identity).** This is App-first; the legacy machine-user PAT is a deprecated fallback (see step 6 and `12 §4`). Sub-steps:
    - **5a. Create the App.** Org Settings → Developer settings → GitHub Apps → New GitHub App. Owner = the `{{BRAND_SLUG}}` org (not your personal account). Permissions per `02b §3` and `03 §3.X`: Issues:RW, Pull requests:RW, Contents:RW, Metadata:R, Workflows:R. **No** `Administration` / `Secrets` / `Members` scopes — those would broaden the blast radius unnecessarily.
    - **5b. Register the private key.** Generate a private key from the App's settings page and download the PEM. The PEM never leaves the operator vault except via the org-secret upload in step 6.
    - **5c. Install the App on the mothership repo.** This is the bootstrapping installation so the mothership-side smoke workflows can read the App's audit signal. Scope to `{{BRAND_SLUG}}/{{BRAND_SLUG}}-mothership` only.
    - **5d. (Per engagement, run by `forge provision`.)** Install the App on each new `<slug>-site` repo at provision time. The App is **never** installed on the pipeline repos — pipeline workflows are the *callers*, not the *targets* (`03 §3.X`). Capture each `installation_id` into `docs/clients/<slug>/cadence.json`.
6. **Add the App's credentials as org secrets** — `APP_ID` (the public ID; safe to log) and `APP_PRIVATE_KEY` (the PEM). Both scoped to **selected repositories** (the pipeline repos only, never the site repos — the App is invoked from pipeline workflows).
7. **Org Settings → Secrets and variables → Actions → New organization secret** for each of:
   - `CLAUDE_CODE_OAUTH_TOKEN` (from `claude setup-token`)
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY` (optional)
   - `APP_ID` (from step 6)
   - `APP_PRIVATE_KEY` (from step 6)
   For each: **Repository access = "Selected repositories"** — leave empty for now; add each pipeline repo during provision.
8. **Create the mothership repo inside the org** — `gh repo create {{BRAND_SLUG}}/{{BRAND_SLUG}}-mothership --private`. Move all the docs from `palimkarakshay/lumivara-site` into here per `05-mothership-repo-buildout-plan.md §P5.1`.

> **Pattern C migration note (deprecated fallback path).** Earlier drafts of this checklist created a machine-user account `{{BRAND_SLUG}}-bot` and a fine-grained PAT (`VENDOR_GITHUB_PAT`, 90-day expiry) as the vendor identity. That has been deprecated as of 2026-04-28. The GitHub App in step 5 is the canonical replacement. The bot-account / PAT path now exists **only** as a named exception:
>
> - The bot account remains as a fallback identity for tasks the App genuinely cannot do today. The App's permissions in step 5a cover every workflow-side action; the only remaining caller is the n8n credential that writes issues/comments on the site repos. n8n core does not natively understand GitHub App installation tokens (they need refreshing every hour), so the PAT survives there until `forge` ships an n8n-token-refresh helper (`05 §P5.4f`).
> - The PAT is tracked as the single named exception row in `03 §3` and is scheduled for retirement in the issue **"Operator: install GitHub App in place of VENDOR_GITHUB_PAT"** (see `16 §7`).
> - Until that issue closes, the PAT remains a deprecated fallback — never the primary identity, never the recommended path. New workflows must always start from the App pattern (`03 §3.X`).
>
> If you previously bootstrapped the practice with a PAT-based bot, follow the migration in `12 §4` (security critique) and the canonical model in `03 §3.X`.

That's it. Free tier, one weekend, done.

---

## 2.5 Adding the second Owner (break-glass setup)

Pair this section with `§1.5`. Run it once, before client #2; the goal is one of two well-documented identities (human or machine) carrying Owner permission, with off-platform recovery codes sealed and a quarterly drill on the calendar.

### Path A — trusted human as second Owner

Use this when there is a real person who is reachable inside an hour and trusted with org-level write access.

1. Open `https://github.com/orgs/{{BRAND_SLUG}}/people` → **Invite member** → enter the trusted human's GitHub handle. Role = **Owner**.
2. Have them accept the invitation. Confirm they appear with the Owner badge in `Org settings → People → Owners`.
3. Both Owners enable hardware MFA (YubiKey or WebAuthn). Software TOTP is acceptable but not preferred.
4. Print recovery codes (`https://github.com/settings/security`). Both Owners do this independently.
5. Seal both sets of recovery codes in **one** tamper-evident envelope. Deposit with the trusted second party from `08 §4`. Do not photograph the codes.
6. Record the choice in `docs/operator/RECOVERY_DRILL_LOG.md`: date, second-Owner identity, envelope location, first drill date.
7. Schedule the first quarterly drill (`§1.5` + `03b §3`) in the operator's calendar.

### Path B — `{{BRAND_SLUG}}-recovery` machine identity

Use this when there is no trusted human, or when the operator prefers a machine-only break-glass.

1. Create a new GitHub user account `{{BRAND_SLUG}}-recovery` with a unique email the operator controls (e.g. `recovery@{{BRAND_SLUG}}.com`). This is permitted by GitHub ToS — machine accounts are explicitly allowed when clearly identified.
2. Enable hardware MFA. Generate fresh recovery codes (`https://github.com/settings/security`).
3. Invite `{{BRAND_SLUG}}-recovery` as **Owner** of `{{BRAND_SLUG}}` org. Accept on the recovery account.
4. Store the recovery account's password in **two** places:
   - The operator's `pass` / 1Password vault.
   - A printed copy in the off-platform envelope (along with the printed recovery codes).
5. Confirm that with the envelope alone, a third party can sign in as `{{BRAND_SLUG}}-recovery` and reach the org's Owner controls. This is the break-glass property.
6. Record the choice in `docs/operator/RECOVERY_DRILL_LOG.md`: date, identity, envelope location, first drill date.
7. Schedule the first quarterly drill.

### Either path — failure modes to avoid

- **Do not** reuse the operator's primary YubiKey for the second Owner. The break-glass is meaningless if both identities depend on the same physical key.
- **Do not** store the recovery envelope in the operator's home or office unless that location is genuinely accessible to someone other than the operator under stress.
- **Do not** skip the first drill. An untested recovery path is wishful thinking, not a control.

---

## 3. Where client repos live (Pattern C — two repos per engagement)

Each engagement gets **two private repos** in the `{{BRAND_SLUG}}` org, both during the engagement:

| Repo | Visibility to client | Lifecycle |
|---|---|---|
| `{{BRAND_SLUG}}/<slug>-site` | Read collaborator from the engagement onwards; transferred to the client at handover | Born on `forge provision`; transferred at `forge teardown --mode handover` |
| `{{BRAND_SLUG}}/<slug>-pipeline` | **No access — ever.** The client is never added as a collaborator. | Born on `forge provision`; archived or deleted at `forge teardown --mode handover` |

The site repo holds the Next.js app and the admin portal. The pipeline repo holds every workflow file, prompt, and operator-side script. The client cannot read the pipeline repo because they are not a collaborator on it; the GitHub App from §1 bridges the two at workflow runtime via short-lived installation tokens.

This is the **canonical model as of 2026-04-28** (Pattern C — see `02b-pattern-c-architecture.md`). The earlier "single repo with `operator/main` overlay" pattern was deprecated when `11 §1` documented that scheduled workflows on non-default branches do not fire.

The alternative of putting client repos under the `palimkarakshay` personal account remains a non-starter for the same reason it always was: org-level secrets don't reach personal-account repos, and the App scope is org-bound.

### 3.1 GitHub App spec

The full App manifest, install instructions, and the `actions/create-github-app-token@v1` recipe live in `03b-github-app-spec.md` (created by Run B in `16 §2`). A summary is in `02b §3`.

---

## 4. The "Akshay as employee" question, answered

If you're asking *legally*, the answer lives in the Ontario business registration (sole prop today; consider federal incorporation when MRR > CAD $3k, talk to an accountant — covered in `08-future-work §2`). GitHub doesn't care; GitHub sees identities and permissions.

If you're asking *operationally*, the topology in §1 IS the answer:
- `palimkarakshay` = "Akshay, the operator/employee, signing commits and reviewing PRs"
- `{{BRAND_SLUG}}` org = "the company that owns the mothership, the per-client site + pipeline repos, and the secrets"
- `{{BRAND_SLUG}}-pipeline-bot` (GitHub App) = "the automation identity that runs unattended; one App, one installation per engagement"

A future-you joining as a real second engineer? You'd add their personal GitHub account to the org as a Member with restricted repo access. No new bot. No new "employee account." That's the whole staffing model on free tier until cross-30-clients.

---

## 5. When (if ever) to upgrade

| Trigger | Upgrade | New cost |
|---|---|---|
| Cross 2,000 Actions minutes/month | Team plan | $4/seat/mo (1–2 seats) |
| Need SAML SSO for client compliance | Team or Enterprise | $4–$21/seat/mo |
| Need 3rd "Internal" visibility for shared component libraries | Team | $4/seat/mo |
| Hire a second operator | Add seat to Team | +$4/mo |
| Cross 30 clients OR FY revenue > CAD $200k | Enterprise (with audit log API + IP allow-lists) | $21/seat/mo |

Set a calendar reminder month-3 of paid ops to check Actions minutes; upgrade reactively, not preemptively.

---

## 6. What to bake into the operator setup prompt (`06`)

Pre-flight §1 of `06-operator-rebuild-prompt-v3.md` already references the org. Update its first checkbox group to:

```
□ Mothership org `{{BRAND_SLUG}}` exists on GitHub Free with TWO Owners:
   • palimkarakshay (operator)
   • <second-Owner-identity>  (human or {{BRAND_SLUG}}-recovery; per §2.5)
□ Recovery codes for both Owners are printed and sealed in the
  off-platform envelope (per §1.5 + §2.5).
□ Quarterly recovery drill is scheduled in the operator calendar; the
  most recent drill log entry exists in
  docs/operator/RECOVERY_DRILL_LOG.md.
□ GitHub App `{{BRAND_SLUG}}-pipeline-bot` exists at the org level with the
  permissions in 02b §3 / 03 §3.X (Issues:RW, Pull requests:RW,
  Contents:RW, Metadata:R, Workflows:R — and nothing else).
□ Both per-engagement repos exist:
   {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site      (client-readable; site code)
   {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline  (operator-only; workflows + scripts)
□ The App is installed on {{CLIENT_SLUG}}-site (and only that repo).
□ Org-level secrets exist: CLAUDE_CODE_OAUTH_TOKEN, GEMINI_API_KEY,
  OPENAI_API_KEY, APP_ID, APP_PRIVATE_KEY — all set to "Selected
  repositories" scope, currently scoping to the {{CLIENT_SLUG}}-pipeline repo
  only (the site repo runs no workflows and needs no secrets).
□ The bot-account / VENDOR_GITHUB_PAT path is treated as the deprecated
  fallback per §2's migration note; if a PAT row still exists in the
  org-secret list, it is named in `03 §3` as the single retained
  exception (n8n credential) and is scheduled for retirement in the
  "Operator: install GitHub App in place of VENDOR_GITHUB_PAT" issue
  (see `16 §7`).
□ Mothership repo `{{BRAND_SLUG}}/{{BRAND_SLUG}}-mothership` exists,
  private, contains the artefacts from P5.1.
```

The provision CLI in P5.4 will check these automatically before each client provision; failing any check = abort with a clear message.

*Last updated: 2026-04-29.*
