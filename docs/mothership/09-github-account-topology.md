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
| `palimkarakshay` (existing) | Personal user | Owner of the mothership org and of every client repo (until handover). The "Akshay" signing identity. | Free |
| `{{BRAND_SLUG}}-bot` (new — e.g. `lumivara-forge-bot`) | Machine user | Holds the vendor PAT used by n8n + auto-PR commits. Clearly marked as a bot in profile bio. | Free |
| `{{BRAND_SLUG}}` (new — e.g. `lumivara-forge`) | Organisation | Houses org-level Action secrets, branch-protection rulesets, the mothership repo, dashboards. Adds client repos as members for secret scoping. | Free |

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
5. **Create the bot account** — sign out, go to github.com/signup, register `{{BRAND_SLUG}}-bot` against a new email (use the operator's `+bot@` alias, e.g. `akshay+lumivara-forge-bot@gmail.com`). Profile bio: "🤖 Automation account for {{BRAND}}. Operator: @palimkarakshay." This identification is what keeps GitHub from flagging it.
6. **Generate the bot's fine-grained PAT** — Issues:RW, Pull requests:R, Contents:R, Metadata:R, 90-day expiry. Store in operator vault as `VENDOR_GITHUB_PAT`.
7. **Sign back in as `palimkarakshay`** → org Settings → People → Invite → invite `{{BRAND_SLUG}}-bot` as Member.
8. **Org Settings → Secrets and variables → Actions → New organization secret** for each of:
   - `CLAUDE_CODE_OAUTH_TOKEN` (from `claude setup-token`)
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY` (optional)
   - `VENDOR_GITHUB_PAT` (the bot's PAT from step 6)
   For each: **Repository access = "Selected repositories"** — leave empty for now; add per client during provision.
9. **Create the mothership repo inside the org** — `gh repo create {{BRAND_SLUG}}/{{BRAND_SLUG}}-mothership --private`. Move all the docs from `palimkarakshay/lumivara-site` into here per `05-mothership-repo-buildout-plan.md §P5.1`.

That's it. Free tier, one weekend, done.

---

## 3. Where client repos live

**Two valid patterns; pick one and stick with it:**

| Pattern | Pros | Cons | Recommendation |
|---|---|---|---|
| **A. Client repos in the operator's `{{BRAND_SLUG}}` org** during engagement, transferred to client at handover | Org-level secrets attach cleanly; one place to see all clients; branch protection rulesets centralised | Counts against the org's Actions minutes; slight extra step at handover (transfer to client account or new client org) | ✅ **Recommended** |
| **B. Client repos under `palimkarakshay` personal account** | Simpler attribution ("Akshay's repos"); no org admin overhead | Org-level secrets don't reach personal-account repos — you'd have to add the secrets to each repo individually, which is a security regression | ❌ Avoid; this is what the v2 template did and it's why org-level secret scoping is the v3 hardening |

**Use Pattern A.** During provision, `forge provision` creates the repo as `{{BRAND_SLUG}}/<client-slug>-site`. At handover, it transfers to the client's GitHub account (or the client creates their own org and the repo transfers there).

---

## 4. The "Akshay as employee" question, answered

If you're asking *legally*, the answer lives in the Ontario business registration (sole prop today; consider federal incorporation when MRR > CAD $3k, talk to an accountant — covered in `08-future-work §2`). GitHub doesn't care; GitHub sees identities and permissions.

If you're asking *operationally*, the topology in §1 IS the answer:
- `palimkarakshay` = "Akshay, the operator/employee, signing commits and reviewing PRs"
- `{{BRAND_SLUG}}` org = "the company that owns the mothership and houses the secrets"
- `{{BRAND_SLUG}}-bot` = "the automation account that runs unattended"

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
□ Bot account `{{BRAND_SLUG}}-bot` exists, identified as automation in bio.
□ Bot is a Member of the org (write access on selected repos only).
□ Org-level secrets exist: CLAUDE_CODE_OAUTH_TOKEN, GEMINI_API_KEY,
  OPENAI_API_KEY, VENDOR_GITHUB_PAT — all set to "Selected repositories"
  scope, currently scoping to {{CLIENT_SLUG}}-site.
□ Mothership repo `{{BRAND_SLUG}}/{{BRAND_SLUG}}-mothership` exists,
  private, contains the artefacts from P5.1.
```

The provision CLI in P5.4 will check these automatically before each client provision; failing any check = abort with a clear message.

*Last updated: 2026-04-28.*
