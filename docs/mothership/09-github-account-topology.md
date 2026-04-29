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

## 2. Setup order (do this once, before any client #2 work)

1. **Create the organisation** at github.com/organizations/new → Free plan → owner email = your existing operator email. Name: `{{BRAND_SLUG}}`. Display name: `{{BRAND}}`. Pick the slug carefully — it's permanent without a paid migration.
2. **Add `palimkarakshay` as Owner** (you'll be auto-added since you created the org from that account).
3. **Settings → Member privileges → Base permissions = No permission.** Forces explicit per-repo grants.
4. **Settings → Actions → Workflow permissions = Read and write** (so workflows can comment on PRs, manage labels).
5. **Create the GitHub App `{{BRAND_SLUG}}-pipeline-bot`** — Org Settings → Developer settings → GitHub Apps → New GitHub App. Permissions per `02b §3`: Issues:RW, Pull requests:RW, Contents:RW, Metadata:R, Workflows:R on each installed repo. Owned by the `{{BRAND_SLUG}}` org. Generate a private key and store it.
6. **Add the App's credentials as org secrets** — `APP_ID` (the public ID; safe to log) and `APP_PRIVATE_KEY` (the PEM). Both scoped to **selected repositories** (the pipeline repos only, never the site repos — the App is invoked from pipeline workflows).
7. **Org Settings → Secrets and variables → Actions → New organization secret** for each of:
   - `CLAUDE_CODE_OAUTH_TOKEN` (from `claude setup-token`)
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY` (optional)
   - `APP_ID` (from step 6)
   - `APP_PRIVATE_KEY` (from step 6)
   For each: **Repository access = "Selected repositories"** — leave empty for now; add each pipeline repo during provision.
8. **Create the mothership repo inside the org** — `gh repo create {{BRAND_SLUG}}/{{BRAND_SLUG}}-mothership --private`. Move all the docs from `palimkarakshay/lumivara-site` into here per `05-mothership-repo-buildout-plan.md §P5.1`.

> **Pattern C migration note:** earlier drafts of this checklist created a machine-user account `{{BRAND_SLUG}}-bot` and a fine-grained PAT (`VENDOR_GITHUB_PAT`) as the vendor identity. That has been deprecated as of 2026-04-28. The GitHub App in step 5 replaces both. If you previously bootstrapped the practice with a PAT-based bot, follow the migration in `12 §4` (security critique) and the App spec in `03b` (created by Run B).

That's it. Free tier, one weekend, done.

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
□ Mothership org `{{BRAND_SLUG}}` exists on GitHub Free, with palimkarakshay as Owner.
□ GitHub App `{{BRAND_SLUG}}-pipeline-bot` exists at the org level with the
  permissions in 02b §3.
□ Both per-engagement repos exist:
   {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site      (client-readable; site code)
   {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline  (operator-only; workflows + scripts)
□ The App is installed on {{CLIENT_SLUG}}-site (and only that repo).
□ Org-level secrets exist: CLAUDE_CODE_OAUTH_TOKEN, GEMINI_API_KEY,
  OPENAI_API_KEY, APP_ID, APP_PRIVATE_KEY — all set to "Selected
  repositories" scope, currently scoping to the {{CLIENT_SLUG}}-pipeline repo
  only (the site repo runs no workflows and needs no secrets).
□ Mothership repo `{{BRAND_SLUG}}/{{BRAND_SLUG}}-mothership` exists,
  private, contains the artefacts from P5.1.
```

The provision CLI in P5.4 will check these automatically before each client provision; failing any check = abort with a clear message.

*Last updated: 2026-04-28.*
