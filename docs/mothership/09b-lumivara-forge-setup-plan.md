<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SOURCE OF TRUTH

  Everything under `docs/mothership/` is the **mothership business pack**.
  Hard rules: nothing in this folder ever ships in a client's repo.
================================================================================
-->

<!-- phase: P4.10 -->

> _Lane: 🛠 Pipeline — operator-only setup plan; never ships in a client repo._

# 09b — Lumivara Forge Setup Plan

_Concrete, action-oriented setup plan for **Lumivara Forge** (the operator's tech practice). Replaces `{{BRAND}}` placeholders with real slugs throughout. All sections annotated with `# change if different brand` where the slug appears._

> **Renamed (2026-04-29):** previously `10-lumivara-infotech-setup-plan.md`; numbered `10` collided with `10-critique-executive-summary.md`, and the "Infotech" working name was retired by `15-terminology-and-brand.md §4` in favour of the locked **Lumivara Forge** brand. The companion-to-09 relationship is now expressed by the `09b` prefix.
>
> **Brand gate:** This document uses `lumivara-forge` as the concrete slug. If a future rebrand happens, do a global find-replace of `lumivara-forge` → chosen-slug before executing. All steps below are written for `lumivara-forge`.

---

## §1 Brand decision (lock before proceeding)

### Options summary

| # | Name | Slug | Recommendation |
|---|---|---|---|
| 1 | **Lumivara Forge** ★ | `lumivara-forge` | **Recommended** — keeps brand-family halo, "forge" connotes building |
| 2 | Lumivara Loom | `lumivara-loom` | Distinct, premium feel, less obviously tech |
| 3 | Lumivara Stack | `lumivara-stack` | Explicitly tech; generic |
| 4 | Lumivara Atelier | `lumivara-atelier` | Premium studio feel; may scare T0/T1 clients |
| 5 | Plumbline Studio | `plumbline-studio` | Full separation from HR brand; loses halo |

**Recommendation: Lumivara Forge** (`lumivara-forge`). See `01-business-plan.md §1` for full trade-offs.

Once the operator confirms, perform this one-time rename:

```
# In docs/mothership/ — run on a dedicated branch, not main
grep -rl '{{BRAND}}' docs/mothership/ | xargs sed -i 's/{{BRAND}}/Lumivara Forge/g'
grep -rl '{{BRAND_SLUG}}' docs/mothership/ | xargs sed -i 's/{{BRAND_SLUG}}/lumivara-forge/g'
```

All remaining sections in this document use `lumivara-forge` as the concrete example. # change if different brand

---

## §2 GitHub org + identity setup (one-time)

### The three identities

| Identity | Type | Role |
|---|---|---|
| `palimkarakshay` (existing personal) | Personal user | Owner of `lumivara-forge` org and every client repo until handover |
| `lumivara-forge-bot` (new machine account) | Machine user | Holds vendor PAT used by n8n + auto-PR commits |
| `lumivara-forge` (new org) | Organisation | Houses org-level Action secrets, branch protection, mothership repo, client repos |

### Nine setup steps

The following steps come from `09-github-account-topology.md §2` with `lumivara-forge` substituted for `{{BRAND_SLUG}}`. Steps marked **[OPERATOR]** require manual browser/CLI action; steps marked **[SCRIPTABLE]** can later be automated by the provisioning CLI.

1. **[OPERATOR]** Create the organisation at github.com/organizations/new → Free plan → owner email = operator email. Name: `lumivara-forge`. Display name: "Lumivara Forge". # change if different brand
2. **[OPERATOR]** `palimkarakshay` is auto-added as Owner when you create the org from that account — confirm Owner status in org Settings → People.
3. **[OPERATOR]** Settings → Member privileges → Base permissions = **No permission**. Forces explicit per-repo grants.
4. **[OPERATOR]** Settings → Actions → Workflow permissions = **Read and write** (so workflows can comment on PRs, manage labels).
5. **[OPERATOR]** Create the bot account — sign out, go to github.com/signup, register `lumivara-forge-bot` against a new `+bot` alias email (e.g. `akshay+lumivara-forge-bot@gmail.com`). Set profile bio: "🤖 Automation account for Lumivara Forge. Operator: @palimkarakshay." # change if different brand
6. **[OPERATOR]** Generate the bot's fine-grained PAT — scopes: Issues:RW, Pull requests:R, Contents:R, Metadata:R, 90-day expiry. Store in operator vault as `VENDOR_GITHUB_PAT`.
7. **[OPERATOR]** Sign back in as `palimkarakshay` → org Settings → People → Invite `lumivara-forge-bot` as Member.
8. **[OPERATOR]** Org Settings → Secrets and variables → Actions → create org-level secrets: `CLAUDE_CODE_OAUTH_TOKEN`, `GEMINI_API_KEY`, `OPENAI_API_KEY` (optional), `VENDOR_GITHUB_PAT`. For each: **Repository access = "Selected repositories"** — leave empty now; add repos during client provision.
9. **[SCRIPTABLE]** Create the mothership repo: `gh repo create lumivara-forge/lumivara-forge-mothership --private`. Migrate docs per §3 below. # change if different brand

Steps 1–8 are one-time operator manual actions. Step 9 can be scripted once steps 1–8 are complete.

---

## §3 Mothership repo

**Repo name:** `lumivara-forge/lumivara-forge-mothership` (private) # change if different brand

### Contents to migrate from `palimkarakshay/lumivara-site`

| Directory / File | Description |
|---|---|
| `docs/mothership/` | All operator runbooks (this folder) |
| `docs/storefront/` | Outward-facing pitch, pricing, cost analysis |
| `n8n/` | n8n workflow JSON exports |
| `scripts/` | Triage / execute / plan automation scripts |
| `workflows-template/` | Reusable GitHub Actions workflow templates |
| `dashboard/` | Operator dashboard SPA source |
| `cli/` | `forge` provisioning CLI (to be built in P5) |

### Migration path

Follow `05-mothership-repo-buildout-plan.md §P5` for the phase-by-phase checklist. High-level:

1. Create the private repo in the org (step 9 above).
2. Add `lumivara-forge/lumivara-forge-mothership` as a remote in this repo: `git remote add mothership git@github.com:lumivara-forge/lumivara-forge-mothership.git`.
3. Push a subtree of the operator-only directories: use `git subtree push` or a dedicated migration script.
4. After confirming the mothership repo is complete, remove the operator-side directories from `palimkarakshay/lumivara-site` and retain only the client-site source (Next.js app, `src/`, public marketing assets).

---

## §4 Developer access

### Role matrix

| GitHub identity | Org role | Repo access |
|---|---|---|
| `palimkarakshay` | Owner | All repos (full admin) |
| `lumivara-forge-bot` | Member | Only repos explicitly added to "Selected repositories" org secrets scope — no admin |
| Future contractor | Outside Collaborator | Triage/write on specific client repo only; no org membership; no access to mothership repo |

**Note:** Do NOT create a second personal GitHub account for Akshay — GitHub's ToS permits one personal account per human. The `palimkarakshay` account IS "Akshay the operator/employee" within the org.

### Developer onboarding checklist (for a contractor joining a client engagement)

- [ ] `gh` CLI installed and authenticated as `palimkarakshay` (operator) — contractor gets write access to the client repo only as Outside Collaborator.
- [ ] `claude setup-token` — obtain the OAuth token from the operator; store as `CLAUDE_CODE_OAUTH_TOKEN` in the relevant repo's secret scope.
- [ ] n8n dashboard URL (Railway) — shared by operator on a need-to-know basis; no contractor access to mothership n8n instance.
- [ ] No direct access to mothership repo, `docs/mothership/`, or org-level secrets.

---

## §5 Client site repos (pattern)

### Naming convention

```
lumivara-forge/<client-slug>-site
```

Example: `lumivara-forge/lumivara-people-advisory-site` # change if different brand

### Lifecycle

1. **Provision** — operator (or `forge provision`) creates `lumivara-forge/<client-slug>-site` as a private repo inside the org. Org-level secrets are scoped to include this repo.
2. **Operator / main overlay** — operator branch (`operator/main`) holds workflows, prompts, scripts. Client's `main` holds the Next.js site.
3. **Client edits** — client edits content via the mobile admin portal; the autopilot implements changes on `main`.
4. **Handover** — at engagement end, transfer the repo to the client's GitHub account (or a new client org). Vercel project is re-pointed by the operator. Org-level secret scoping is updated to remove the transferred repo.

### First client migration: `palimkarakshay/lumivara-site` → `lumivara-forge/lumivara-people-advisory-site`

> **⚠️ Vercel mirror required** — see `**Vercel mirror required:**` note at the end of this section.

Steps:
a. Create the new private repo in the org: `gh repo create lumivara-forge/lumivara-people-advisory-site --private`.
b. Push the current `main` branch to the new remote: `git remote add lpa git@github.com:lumivara-forge/lumivara-people-advisory-site.git && git push lpa main`.
c. **[OPERATOR — Vercel dashboard]** Transfer or update the Vercel project to point at `lumivara-forge/lumivara-people-advisory-site` (Settings → Git → Disconnect → reconnect to new repo).
d. Update org-level secrets "Selected repositories" to include `lumivara-people-advisory-site` and remove `lumivara-site` (once Vercel is confirmed working).
e. Archive or delete `palimkarakshay/lumivara-site` only after confirming Vercel is serving from the new repo.

**Vercel mirror required (operator must do manually in the Vercel dashboard):**
1. Open the Vercel project for this site → Settings → Git.
2. Disconnect the existing GitHub connection (`palimkarakshay/lumivara-site`).
3. Reconnect to `lumivara-forge/lumivara-people-advisory-site`.
4. Trigger a redeployment and confirm the production URL is still live.

---

## §6 Demo repos

### Purpose

Showcase live sites for prospect pitches. Not tied to any paying client. These are operator-maintained demos that show what the autopilot can produce for a given business vertical.

### Naming convention

```
lumivara-forge/demo-<vertical>-site
```

Examples: `demo-restaurant-site`, `demo-plumber-site` # change org slug if different brand

### Hosting

- Each demo repo gets its own Vercel project.
- Deploy as a **Vercel preview URL** — no custom domain required at launch.
- If Vercel Pro plan is available, enable **password protection** on the preview deployment (Vercel → Settings → Password Protection). This keeps demo content off search indexes.
- Alternative (without Pro): rely on the obscurity of the preview URL. Vercel preview URLs are not indexed by default.
- Future: deploy under a subdomain such as `demo-restaurant.lumivara-forge.com` when the operator has a domain pointed at Vercel. # change if different brand

### Content source

Use the vertical prompt templates from `docs/mothership/templates/` (populated in issue #106 and follow-on issues) to generate plausible demo content with dummy business names. Each demo repo is seeded once and updated manually when the base template changes.

### Visibility and IP protection

- Demo repos: **private**. Prospects see only the Vercel preview URL — no source code exposure.
- Maintenance cadence: **Tier 0** (no autopilot; operator updates manually when the base template changes).

### Planned demo verticals

| # | Vertical | Repo slug | Status |
|---|---|---|---|
| 1 | Restaurant | `demo-restaurant-site` | ⏳ Not yet created |
| 2 | Plumbing | `demo-plumber-site` | ⏳ Not yet created |
| 3 | Real estate | `demo-real-estate-site` | ⏳ Not yet created |
| 4 | Recruitment | `demo-recruitment-site` | ⏳ Not yet created |
| 5 | Law | `demo-law-site` | ⏳ Not yet created |
| 6 | Barber / salon | `demo-barber-site` | ⏳ Not yet created |
| 7 | Accounting | `demo-accounting-site` | ⏳ Not yet created |
| 8 | Physiotherapy | `demo-physio-site` | ⏳ Not yet created |
| 9 | Electrical | `demo-electrical-site` | ⏳ Not yet created |
| 10 | Dental | `demo-dental-site` | ⏳ Not yet created |

Demo repos are created on-demand, not in bulk — provision a vertical when a prospect in that space enters the pipeline.

---

## §7 IP separation summary (for new developers)

### Three-layer model

From `03-secure-architecture.md`:

| Layer | What it is | Who can see it |
|---|---|---|
| **Client Trust Zone** | The client's `main` branch: Next.js site code, public marketing assets, admin portal UI | Client (repo access), operator, any Outside Collaborator with explicit grant |
| **Operator Trust Zone** | The `operator/main` branch: GitHub Actions workflows, n8n webhook URLs, triage/execute prompts, `docs/mothership/` | Operator only (`palimkarakshay`) |
| **Shared Infra** | Railway (n8n), Resend, Vercel, org-level GitHub secrets | Operator only; clients never have credentials |

### What a developer on a client repo CAN see

- `main` branch: the Next.js marketing site, admin portal UI, `src/`, `public/`, Tailwind config, `package.json`.
- Issues and PRs opened by the autopilot bot (read-only visibility into what's being automated).
- The `07-client-handover-pack.md` rendered copy placed in the client repo's `docs/client/` at handover time.

### What a developer on a client repo CANNOT see

- `operator/main` branch — branch protection rules deny push and read for Outside Collaborators.
- `docs/mothership/` — never committed to a client repo.
- Org-level secrets (`CLAUDE_CODE_OAUTH_TOKEN`, `VENDOR_GITHUB_PAT`, etc.) — scoped to "Selected repositories" and never readable via any public API.
- The mothership repo (`lumivara-forge/lumivara-forge-mothership`) — no org membership means no visibility. # change if different brand
- n8n workflow details, Railway credentials, Resend API keys.

### Secrets scoping rules

- **Org-level secrets only** — no repo-level secrets in client repos (avoids secret sprawl).
- **"Selected repositories" scope** — each secret is manually added to each new client repo during provision; removed at handover.
- **No PATs in client-visible files** — webhook URLs in GitHub Actions use `${{ secrets.* }}` references only.
- **Secret rotation** — 90-day expiry on `VENDOR_GITHUB_PAT`; see `03-secure-architecture.md` for the rotation checklist.

---

## Risks and open questions

| # | Risk | Mitigation |
|---|---|---|
| 1 | **Brand name not yet confirmed.** This doc uses `lumivara-forge`; if the operator chooses differently, all slugs must be updated before executing. | Human gate: operator confirms brand before any GitHub org creation step. |
| 2 | **Vercel project migration** (§5 first-client migration) cannot be automated — requires operator dashboard action. | PR description must include `**Vercel mirror required:**` section (already done above in §5). |
| 3 | **Demo repo Vercel password protection** requires Vercel Pro plan. | Without Pro, rely on obscure preview URLs. Operator confirms plan level before setting up demo repos. |
| 4 | **Actions minutes quota** — 2,000 min/month free. Current single-client load is well under; monitor at month 3 of paid ops. | See `09-github-account-topology.md §5` for upgrade triggers. |
| 5 | **GitHub ToS — one personal account.** Contractor-as-"employee" must be Outside Collaborator, not a second personal account. | Role matrix in §4 enforces this. |

---

*Last updated: 2026-04-28.*
