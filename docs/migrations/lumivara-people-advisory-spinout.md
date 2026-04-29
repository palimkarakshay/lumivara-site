<!-- OPERATOR-ONLY. One-shot migration. Pre-flight gates: pattern-c-enforcement-checklist.md §4. -->

# Spinout runbook — Lumivara People Advisory → Client #1 repo

**Goal.** Spin out *Lumivara People Advisory* (Beas Banerjee's HR consulting practice — see `docs/mothership/00-INDEX.md` for context) from the current de-facto Client #1 repo `palimkarakshay/lumivara-site` into a clean per-client repo `palimkarakshay/lumivara-people-advisory-site`, with the autopilot living on the new repo's `operator/main` overlay branch and only client-safe artefacts on `main`. This runbook is the canonical, copy-pasteable procedure; it is run **once**.

**Owner.** Operator. The Claude execute bot does not run this runbook; it ships the *runbook itself* and any attendant doc edits. The actual spinout requires manual GitHub UI clicks, Vercel project creation, n8n credential creation, and Twilio inbound-number wiring — all operator-side.

**Scope hard-exclusions** (mirrors `scripts/execute-prompt.md` step 4): no executor edits to `.github/workflows/*`, `scripts/`, `.env*`, `package.json`, `src/app/api/contact/*`. The operator performs the equivalent steps manually during the spinout. Any `package.json` "freshening" during the copy is forbidden — copy verbatim.

**Sources of truth this runbook leans on:**

- `docs/mothership/02-architecture.md §1, §3, §7` — the two-repo / two-branch model and end-of-engagement teardown.
- `docs/mothership/03-secure-architecture.md §1, §2, §3` — the four "never" rules, branch protection, `.claudeignore`, secret topology.
- `docs/mothership/05-mothership-repo-buildout-plan.md §P5.5, §P5.6, §P5.8` — sketch this distils into a runbook.
- `docs/mothership/07-client-handover-pack.md §A` — Lumivara People Advisory dummy intake (the source of `intake.md`).
- [`docs/mothership/pattern-c-enforcement-checklist.md`](../mothership/pattern-c-enforcement-checklist.md) — the gate this runbook is bound to (§4 pre-flight, §5 post-migration).
- [`_artifact-allow-deny.md`](_artifact-allow-deny.md) — embedded as the source of Tables A, B, C in §3 below.

---

## §0 — Pre-flight

Confirm every row before touching anything. **Do not proceed if any row is unchecked.**

| # | Pre-flight check | Source of truth | Ready? |
|---|---|---|---|
| 0.1 | Mothership repo `palimkarakshay/{{BRAND_SLUG}}-mothership` exists and has run through `05-mothership-repo-buildout-plan.md §P5.1–P5.4` (operator-side docs migrated, workflow templates lifted, dashboard migrated, provisioning CLI bootstrapped at least to `forge --help`). | `05 §P5.1–P5.4` | ☐ |
| 0.2 | The variable registry doc `docs/ops/variable-registry.md` exists in the mothership and lists the `Owner = client` rows for §4 below. | Issue #142 | ☐ |
| 0.3 | The Pattern C enforcement checklist `docs/mothership/pattern-c-enforcement-checklist.md` exists and the §4 pre-migration gate has been walked, with each row of that gate ticked or N/A. | #140 / Pattern C §4 | ☐ |
| 0.4 | The CLI subcommand `forge provision` (P5.4b–d) is available, **or** the operator commits to narrating the equivalent steps manually (see §3, §4 below). The runbook supports both paths. | `05 §P5.4` | ☐ |
| 0.5 | The bot account `{{BRAND_SLUG}}-bot` exists, has org membership in `palimkarakshay`, and has a working SSH key registered. | `09-github-account-topology.md` / Pattern C §3 C-MUST-NOT-6 | ☐ |
| 0.6 | The operator's vault holds: a fresh `N8N_HMAC_SECRET` for this client, a Twilio inbound-number SID/auth-token pair scoped to the per-client number, and the Vercel personal access token. | `03-secure-architecture.md §3` | ☐ |
| 0.7 | The intake YAML for *Lumivara People Advisory* is captured at `docs/clients/lumivara-people-advisory/intake.md` (mothership repo) using §A of `07-client-handover-pack.md` as the template, with at least `client_slug`, `client_legal_name`, `domain`, `tier`, `client_primary_email`, `twilio_inbound_number`, `cal_link`, and the `notes` block filled. | `07 §A` | ☐ |
| 0.8 | The brand pick from `01-business-plan.md §1` is locked. `{{BRAND}}` and `{{BRAND_SLUG}}` are substituted globally before this runbook is rendered. (Provisional today: `Lumivara Forge` / `lumivara-forge`.) | `01 §1` | ☐ |

**If `forge provision` (0.4) is not yet built**, the runbook still works — every phase below has a "manual fallback" line. Replace `forge provision …` invocations with the explicit `gh`, `vercel`, `n8n` REST calls, and `git` commands shown.

**Open question to settle before §1:** *rename the source repo, or create a fresh repo and selective-copy?* `05 §P5.6` historically proposes renaming `palimkarakshay/lumivara-site` to `palimkarakshay/lumivara-people-advisory-site`. This runbook recommends **fresh repo + selective copy (Table A)** because rename leaves prune-able autopilot artefacts in git history (every `auto/issue-*` branch, every PR with operator-internal commit messages, every workflow-edit commit) — and committed history is forever. The trade-off: rename preserves the issue tracker and PR history; fresh-repo loses both. Recommended: capture the issue tracker as a `docs/clients/lumivara-people-advisory/engagement-log.md` export (one-time `gh issue list` snapshot) and accept the loss. **Operator: confirm in writing on this checkbox before proceeding:** ☐ *fresh repo + selective copy chosen; engagement-log export captured.*

---

## §1 — Prepare the Forge mothership baseline

Cross-link `05-mothership-repo-buildout-plan.md §P5.5` (mirror existing client into mothership). The mothership becomes the durable home for everything operator-side about this engagement.

**Steps (run on the operator's machine; commit to mothership `main`):**

1. Create `docs/clients/lumivara-people-advisory/` in the mothership.
2. Add `intake.md` — copy the YAML block from `07-client-handover-pack.md §A` (Dummy A — Lumivara People Advisory). Fill the `notes` block with anything specific from prior conversations with Beas (preferred SLA window, content cadence, design constraints).
3. Add `cadence.json`:
   ```json
   {
     "tier": 2,
     "triage_cron": "*/30 * * * *",
     "execute_cron": "0 */8 * * *",
     "improvement_run_cadence": "monthly",
     "models": {
       "triage": "claude-opus-4-7",
       "plan":   "claude-opus-4-7",
       "execute":"claude-opus-4-7",
       "fallback_chain": ["gemini-2.5-pro", "gpt-5.5"]
     }
   }
   ```
4. Add `secrets.md.age` — operator's PGP-encrypted listing of which org secrets, n8n credential names, and Vercel envs are scoped to this client. Decryptable by the operator's YubiKey-backed PGP subkey only.
5. Add `runbook.md` — Beas's preferences (SMS-first submissions, quarterly content sprints, PIPEDA-explicit privacy clause — mirrors `07 §A` notes), her primary email/phone, monthly call cadence, and any standing requests.
6. Add `engagement-log.md` — start it from `palimkarakshay/lumivara-site`'s `CHANGELOG.md` and append a one-line snapshot of the issue tracker at spinout time:
   ```bash
   gh issue list --repo palimkarakshay/lumivara-site --state all --limit 500 --json number,title,state,createdAt,closedAt \
     > /tmp/lps-issues-snapshot.json
   ```
   Reference the JSON path in `engagement-log.md` so future audits can locate it.

**Dry-run check.** Verify the JSON validates against the cadence schema:

```bash
npx ajv validate -s schema/cadence.schema.json -d docs/clients/lumivara-people-advisory/cadence.json
```

(If the schema doesn't yet exist, create it from `04-tier-based-agent-cadence.md` — out-of-scope for this runbook; track in a separate issue.)

**Rollback.** Delete `docs/clients/lumivara-people-advisory/` from the mothership. No external state was created.

**Acceptance.** All six files exist; `cadence.json` validates; `secrets.md.age` decrypts cleanly with `gpg --decrypt`; `engagement-log.md` references a captured issue snapshot.

---

## §2 — Create the new client repo

**Operator-manual.** The execute bot does not run this; the operator runs `gh` interactively.

```bash
gh repo create palimkarakshay/lumivara-people-advisory-site \
  --private \
  --description "Lumivara People Advisory — marketing site (Pattern C client repo)."
```

Then:

1. **Operator-manual:** add the bot account `{{BRAND_SLUG}}-bot` as a collaborator with `Write` access. (Branch protection in §4 will further constrain it.)
2. **Operator-manual:** add Beas's GitHub account as a `Read` collaborator. (Today she has none — this is the moment to onboard if it ever happens.)
3. **Operator-manual:** disable Issues, Wikis, and Discussions on the new repo until the client's autopilot lane is wired (`§5`); re-enable Issues only after the bot has its filter labels in place.

**Dry-run check.** The repo URL `https://github.com/palimkarakshay/lumivara-people-advisory-site` returns a 200 (private — operator-authenticated) showing an empty repo with a default `README.md`-less main branch.

**Rollback.** `gh repo delete palimkarakshay/lumivara-people-advisory-site --yes`. Because no PRs are merged, no history is lost.

**Acceptance.** Empty private repo exists; bot account is `Write`; Beas (if onboarded) is `Read`; Issues/Wikis/Discussions are off until §5.

---

## §3 — Copy allowed assets only

The point of the spinout: only Table A from [`_artifact-allow-deny.md`](_artifact-allow-deny.md) lands on the new repo's `main`. Everything in Table B is forbidden. Table C lists what's newly required.

**Embedded — see [`_artifact-allow-deny.md`](_artifact-allow-deny.md)** (Tables A, B, C). Re-read before running this phase. Do not duplicate the table contents inline.

### Concrete copy procedure

Operator runs the following on a clean working directory. The procedure is *allow-list-first*: clone the source, then prune to Table A. Never `cp -r .`.

```bash
# 1. Clone the source verbatim (read-only — we do not push back).
git clone --depth 1 git@github.com:palimkarakshay/lumivara-site.git /tmp/source-snapshot

# 2. Clone the new (empty) client repo.
git clone git@github.com:palimkarakshay/lumivara-people-advisory-site.git /tmp/client-repo
cd /tmp/client-repo
git checkout -b main

# 3. Copy Table A paths verbatim. Each cp/rsync invocation is one Table A row.
rsync -a /tmp/source-snapshot/src/                /tmp/client-repo/src/
rsync -a /tmp/source-snapshot/public/             /tmp/client-repo/public/
rsync -a /tmp/source-snapshot/assets/             /tmp/client-repo/assets/
rsync -a /tmp/source-snapshot/e2e/                /tmp/client-repo/e2e/
cp /tmp/source-snapshot/{mdx-components.tsx,next.config.ts,tsconfig.json,package.json,package-lock.json,postcss.config.mjs,eslint.config.mjs,playwright.config.ts,vitest.config.ts,components.json,vercel.json,.gitignore,.prettierrc,.editorconfig,.env.local.example,README.md,CONTRIBUTING.md,CHANGELOG.md,404.html,index.html} /tmp/client-repo/ 2>/dev/null || true
mkdir -p /tmp/client-repo/.github
[ -f /tmp/source-snapshot/.github/PULL_REQUEST_TEMPLATE.md ] && cp /tmp/source-snapshot/.github/PULL_REQUEST_TEMPLATE.md /tmp/client-repo/.github/
[ -d /tmp/source-snapshot/.github/ISSUE_TEMPLATE ] && rsync -a /tmp/source-snapshot/.github/ISSUE_TEMPLATE/ /tmp/client-repo/.github/ISSUE_TEMPLATE/
[ -f /tmp/source-snapshot/.github/SECURITY.md ] && cp /tmp/source-snapshot/.github/SECURITY.md /tmp/client-repo/.github/

# 4. Add Table C newly-required artefacts.
cat > /tmp/client-repo/.claudeignore <<'EOF'
docs/operator/
docs/clients/
docs/mothership/
docs/storefront/
n8n/
workflows-template/
scripts/
.github/workflows/triage.yml
.github/workflows/execute*.yml
.github/workflows/plan-issues.yml
.github/workflows/deep-research.yml
.github/workflows/codex-review.yml
.github/workflows/auto-merge.yml
.github/workflows/project-sync.yml
.github/workflows/setup-cli.yml
.github/workflows/ai-smoke-test.yml
.github/workflows/deploy-dashboard.yml
EOF
# (Mirrors 03-secure-architecture.md §2.3 verbatim. Drift is a bug.)

# Render docs/CLIENT_HANDOVER.md from the mothership template + intake.
mkdir -p /tmp/client-repo/docs
pnpm dlx mustache \
  /path/to/mothership/docs/clients/lumivara-people-advisory/intake.md \
  /path/to/mothership/docs/mothership/07-client-handover-pack.md \
  > /tmp/client-repo/docs/CLIENT_HANDOVER.md

# 5. Forbidden-set sweep. Verify no Table B paths landed.
cd /tmp/client-repo
git add -A
git status --short | grep -E '(docs/(mothership|freelance|operator|migrations|ops)/|n8n/|dashboard/|scripts/(triage|execute|gemini|codex|plan-issue|test-routing|bootstrap-kanban)|scripts/lib/|\.github/workflows/(triage|plan-issues|execute|codex-review|deep-research|auto-merge|project-sync|setup-cli|ai-smoke-test|deploy-dashboard)\.yml)' \
  && echo "FORBIDDEN PATH PRESENT — abort and prune" && exit 1
git grep -E 'palimkarakshay\.github\.io/.*-mothership' main && echo "DASHBOARD URL LEAK" && exit 1
git grep -E '(ghp_|github_pat_)' && echo "PAT LEAK" && exit 1

# 6. Initial commit, signed by the bot account (operator runs this from the bot's auth).
git -c user.name="${BRAND_SLUG}-bot" -c user.email="${BRAND_SLUG}-bot@users.noreply.github.com" \
  commit -m "feat: initial site copy from palimkarakshay/lumivara-site (Table A only)"
git push -u origin main
```

**Forbidden during this phase (bot exclusions):** the executor must not run the rsync/cp loop above (it touches `package.json`, would `cp` files including `.env.local.example`, etc.); only the operator runs this. The runbook is *narrated*, not auto-executed.

**Forbidden tidying:** even though `src/app/api/contact/*` is copied verbatim per Table A, the executor (or operator-as-executor) is forbidden from "tidying" these files during the copy. Copy unchanged or do not copy.

**Dry-run check.**

```bash
git -C /tmp/client-repo ls-tree main -r --name-only \
  | grep -E '(^docs/(mothership|freelance|operator|migrations|ops)/|^n8n/|^dashboard/|^scripts/(triage|execute|gemini|codex|plan-issue|test-routing|bootstrap-kanban)|^scripts/lib/)'
# Must return zero rows.
```

**Rollback.** Delete `/tmp/client-repo/.git`, `git init`, and start over. The remote `palimkarakshay/lumivara-people-advisory-site` is empty until step 6 pushes; if step 6 has run, force-push an empty `main` and continue. If branch protection (§4) has already been applied, disable it temporarily, force-push, re-apply.

**Acceptance.** The path-based forbidden grep above returns empty; the content-based forbidden greps (`palimkarakshay\.github\.io/.*-mothership`, `ghp_`, `github_pat_`) return empty; the rendered `docs/CLIENT_HANDOVER.md` has zero `{{...}}` placeholders left:

```bash
grep -F '{{' /tmp/client-repo/docs/CLIENT_HANDOVER.md && echo "UNRENDERED PLACEHOLDER" && exit 1
```

---

## §4 — Configure client Vercel project + env vars

**Operator-manual.** Vercel CLI / dashboard.

1. **Create project.**
   ```bash
   vercel --cwd /tmp/client-repo link    # interactive: choose "Create new project"
   ```
   Project slug: `lumivara-people-advisory`. Production branch: `main`. Build command: default. Output directory: default.
2. **Set Production domain.** In the Vercel dashboard, point `lumivara.ca` (or whatever `intake.md` lists as `domain`) at the new project. **Bias: create the new Vercel project alongside, point the production domain at it last** — keep the previous Vercel project (today's `lumivara-site`) live until §6 has passed.
3. **Set every env var with `Owner = client`** from `docs/ops/variable-registry.md §3`. Today these include (re-confirm against the registry — registry is the source of truth):
   - `AUTH_SECRET` (per-client, generate fresh: `openssl rand -base64 64`).
   - `AUTH_RESEND_KEY` (shared per-engagement; matches the operator's Resend domain `mail.{{BRAND_SLUG}}.com`).
   - `AUTH_GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_CLIENT_SECRET` (per-client OAuth app — operator creates in Google Cloud Console under a per-client project).
   - `AUTH_MICROSOFT_CLIENT_ID` / `AUTH_MICROSOFT_CLIENT_SECRET` (per-client Entra app, same pattern).
   - `N8N_HMAC_SECRET` (matches the operator vault entry from §0.6; same value lands in n8n credential `…-lumivara-people-advisory` in §5).
   - `CONTACT_EMAIL` = `intake.md client_primary_email` (today: `hello@lumivara.ca`).
   - `NEXT_PUBLIC_CAL_LINK` = `intake.md cal_link` (today: `https://cal.com/lumivara/discovery`).
4. **Vercel mirror confirmation.** Per `AGENTS.md` § "Vercel production parity", every env var change in this runbook is dashboard-only. The runbook itself is doc-only — no PR opened from it has a `Vercel mirror required:` block, but every *operator pass* through this phase must end with a manual mirror.

**Dry-run check.**

```bash
vercel build --cwd /tmp/client-repo
vercel deploy --cwd /tmp/client-repo --prebuilt   # preview only, not --prod
```

The preview URL must:
- return 200 on `/`,
- return 200 on `/admin` (sign-in page),
- return 405 (method-not-allowed) on `GET /api/contact` (the contact endpoint is POST-only and copied verbatim — `src/app/api/contact/*` is hard-excluded from edits).

**Rollback.** Delete the new Vercel project (Settings → General → Delete) and revert the production-domain pointer back to the old `lumivara-site` Vercel project. The old project remained live throughout — no traffic interruption.

**Acceptance.** `vercel inspect <preview-url>` reports `Status: Ready`; the three smoke endpoints above return their expected codes; the production domain still resolves to the *old* Vercel project (we don't switch until §6).

---

## §5 — Hook client repo into operator n8n workflows

Per `docs/N8N_SETUP.md` and `03-secure-architecture.md §3`.

**Operator-manual.** n8n REST API or n8n UI.

1. **Per-client suffix.** For every n8n workflow template (`triage-issue`, `execute-pr`, `deploy-confirmed`, `inbound-sms`, `inbound-email`, `inbound-web`), create a per-client copy named `<template>-lumivara-people-advisory`.
2. **Per-client HMAC.** Set the `N8N_HMAC_SECRET` credential `…-lumivara-people-advisory` to the value from §0.6 (matches Vercel env from §4 step 3).
3. **Twilio inbound number.** In Twilio, set the SMS webhook for `intake.md twilio_inbound_number` (today: `+1 437 555 0102`) to `https://n8n.{{BRAND_SLUG}}.com/webhook/inbound-sms-lumivara-people-advisory`.
4. **GitHub PAT scoping.** Confirm the org-secret `VENDOR_GITHUB_PAT` includes `palimkarakshay/lumivara-people-advisory-site` in `Repository access: Selected`.
5. **Issue label seed.** Once the new repo's Issues tab is enabled (§2 step 3 reverse), seed labels using the bootstrap from the mothership: `client/lumivara-people-advisory`, plus the standard priority/complexity/area/type/status set from `docs/BACKLOG.md` (mothership copy).

**Dry-run check.**

```bash
# Send a test SMS to the inbound number from the operator's phone:
#   "Test issue: spinout smoke at $(date -u +%FT%TZ)"
# Confirm in the n8n UI that inbound-sms-lumivara-people-advisory fired and reached
# the issue-create node. Confirm in GitHub:
gh issue list --repo palimkarakshay/lumivara-people-advisory-site --label client/lumivara-people-advisory --limit 5
# The most recent row matches the SMS body.
```

**Rollback.** Delete each n8n per-client workflow copy; remove the Twilio webhook (set it back to a no-op or to the previous client's URL); remove the new repo from the org-secret allowlists.

**Acceptance.** A test SMS creates a GitHub issue tagged `client/lumivara-people-advisory` within 60 s; n8n logs show the HMAC validated; no issue is created when the HMAC is wrong (test by hand-crafting a curl with a bad signature, see §6).

---

## §6 — Verify webhook signing and issue routing

End-to-end smoke. Maps to `05 §P5.8`'s checklist.

**Steps.**

1. **Good HMAC.** Send a known-valid signed payload:
   ```bash
   payload='{"title":"smoke test (good)","body":"please ignore","client":"lumivara-people-advisory"}'
   sig=$(printf '%s' "$payload" | openssl dgst -sha256 -hmac "$N8N_HMAC_SECRET" -binary | base64)
   curl -X POST https://n8n.{{BRAND_SLUG}}.com/webhook/inbound-web-lumivara-people-advisory \
     -H "X-Signature: $sig" -H "Content-Type: application/json" -d "$payload"
   ```
   Confirm: a new issue lands in `palimkarakshay/lumivara-people-advisory-site` within 30 s.
2. **Bad HMAC.** Same payload, different signature. Confirm n8n returns 401 and no issue is created.
3. **Triage cron pickup.** Wait up to 30 min (or fire `triage.yml` manually from the new repo's `operator/main`). Confirm the issue gets `status/planned`, a priority, a complexity, a model label, and a triage rationale comment.
4. **Pattern C verifications.** Walk every C-MUST and C-MUST-NOT row of [`pattern-c-enforcement-checklist.md §5`](../mothership/pattern-c-enforcement-checklist.md). Each row's *Pass?* box must tick. The checklist is the canonical post-migration audit; this runbook does not duplicate the verify lines.

**Dry-run check.** Steps 1–2 are themselves a dry-run; the test issues created can be closed immediately and the `engagement-log.md` notes the smoke timestamps.

**Rollback.** Disable the per-client webhook URL in Twilio; revert the production-domain pointer (still pointing at the old Vercel project per §4 step 2).

**Acceptance.** Steps 1–3 each pass; `pattern-c-enforcement-checklist.md §5` has every row ticked or marked N/A with a one-line rationale logged in `docs/operator/INCIDENT_LOG.md` (mothership) under `Pattern C audit YYYY-QN`.

---

## §7 — Dry run (full pass before production switchover)

Before pointing `lumivara.ca` (production) at the new Vercel project, do a complete end-to-end dry-run on a `*.vercel.app` preview only.

**Steps.**

1. **CLI dry-run** (when `forge provision` is built — P5.4):
   ```bash
   forge provision --client-slug lumivara-people-advisory --tier 2 --dry-run
   ```
   Expected: prints every step from `02-architecture.md §3` without doing anything. The output should match what the operator already did manually in §1–§6.
2. **Manual dry-run** (when `forge` is not yet built):
   - Walk the SMS → issue → triage → execute → PR → preview-URL chain end-to-end with a deliberately small test issue ("update homepage subtitle to 'X'"). Confirm the PR opens within 2 hours; do **not** merge — close as `wontfix` after preview verification.
3. **Operator approval.** Operator confirms in writing on the engagement log that the dry-run cycle (SMS → published-preview) completed in under 4 hours and matched the runbook's predicted output at every step.

**Dry-run check.** This *is* the dry-run section — its output is the predicate for §8 acceptance.

**Rollback.** Close the dry-run issue + draft PR; no production state was touched.

**Acceptance.** A complete SMS-to-preview cycle in under 4 hours, with each step's output matching the runbook's predicted output. Recorded in `engagement-log.md` with timestamps.

---

## §8 — Rollback (consolidated)

Each phase's rollback is documented inline. This section is the one-page consolidated rollback reference for the operator under stress.

**Revert order:** §6 → §5 → §4 → §3 → §2 → §1.

| Phase | Reversal | Side effects |
|---|---|---|
| §6 | Disable per-client webhook in Twilio. | Inbound SMS to the new number returns to no-op. |
| §5 | Delete each n8n `…-lumivara-people-advisory` workflow + credential. Remove new repo from `VENDOR_GITHUB_PAT` allowlist. | The per-client lane goes dark. |
| §4 | Delete Vercel project `lumivara-people-advisory`. Production-domain pointer is unchanged (we never switched per §4 step 2 bias). | None — old project never stopped serving. |
| §3 | Force-push an empty `main` to the new repo. Or: delete the repo (next step). | Branch protection in §4 may need temporary disable. |
| §2 | `gh repo delete palimkarakshay/lumivara-people-advisory-site --yes`. | Loss is bounded — no merged PRs yet. |
| §1 | Delete `docs/clients/lumivara-people-advisory/` from mothership; commit; push. | The mothership returns to no-Client-#1 state. |

**Production switchover** — only after §1–§7 pass — is the moment of higher risk. The runbook biases toward *create-alongside, switch last*: §4 step 2 keeps the old `lumivara-site` Vercel project live until §6 verifications pass and the operator manually flips the `lumivara.ca` DNS pointer in the Vercel dashboard. Reversal: re-flip the pointer back; old project still answers because we never deleted it (delete only after a 30-day soak).

---

## §9 — Acceptance criteria (overall)

The three criteria from issue #141:

### A1 — No People Advisory business context in Forge core

Run from a fresh clone of the **mothership**:

```bash
git -C /path/to/mothership grep -niE 'lumivara people advisory|hr consulting|people strategy' \
  -- 'docs/mothership/' 'docs/storefront/' 'scripts/' 'workflows-template/' \
  ':!docs/clients/lumivara-people-advisory/' ':!docs/mothership/07-client-handover-pack.md' \
  ':!docs/mothership/10-critique-executive-summary.md' \
  ':!docs/mothership/11-critique-architectural-issues.md' \
  ':!docs/mothership/12-critique-security-secrets.md' \
  ':!docs/mothership/13-critique-ai-and-scaling.md' \
  ':!docs/mothership/14-critique-operations-sequencing.md'
```

Must return zero matches. Per-client material lives only under `docs/clients/lumivara-people-advisory/`. The dummy intake under `07 §A` and the historical critiques are exempt — those reference the dummy as a *worked example*, not as Forge-core business context.

### A2 — Client repo has only client-specific brand/context

Run from a fresh clone of the **new client repo**:

```bash
git -C /path/to/lumivara-people-advisory-site grep -niE 'forge|mothership|operator-only' main
```

Must return zero matches. (Exception: a single `Forged by Lumivara` footer credit is *required* on Tier 0/1/2 sites per `07 §8` and is mandatory for this Tier 2 engagement; the substituted footer renders as "Forged by Lumivara — Sites built for advisors who lead with clarity." in `src/components/Footer.tsx` and is the only allowed match. Because the verb "Forged" contains the case-insensitive token `forge`, narrow the post-spinout grep above to `mothership|operator-only` and exempt the footer line — or run with `-w` to require whole-word matches on `forge`.)

### A3 — Pattern C checks all pass

Every MUST and MUST-NOT row in [`pattern-c-enforcement-checklist.md`](../mothership/pattern-c-enforcement-checklist.md) is verified per §5 of that file. Per `pattern-c-enforcement-checklist.md §5`'s instructions:

- Walk every row in §5's table, run its verify command, tick the *Pass?* box.
- Cross-tick `pattern-c-enforcement-checklist.md §4` rows that became visible only after the spinout (e.g. row 11 — bot account is now writing to `main`).
- The PR template's `Pattern C: verified` checkbox (issue #140) is checked for every spinout-related PR.
- The `needs-vercel-mirror` label is removed from this issue (#141) only after the operator confirms no Vercel-side changes were needed (this runbook is doc-only, so it never set the label in the first place — but downstream PRs that *do* configure the per-client Vercel project must follow the mirror protocol from `AGENTS.md`).
- Log the audit timestamp in `docs/operator/INCIDENT_LOG.md` under `Pattern C audit YYYY-QN — Lumivara People Advisory spinout`.

### Additional acceptance — the runbook's own ground truth

```bash
# Every "see §X" pointer resolves
grep -nE '(see §[0-9]+|see `docs/' docs/migrations/lumivara-people-advisory-spinout.md \
  | wc -l    # > 0 (this runbook is dense in cross-links)

# Every phase has Dry-run, Rollback, Acceptance subsections
for sec in 1 2 3 4 5 6 7; do
  for sub in "Dry-run" "Rollback" "Acceptance"; do
    grep -q "^\*\*$sub" docs/migrations/lumivara-people-advisory-spinout.md \
      || echo "MISSING $sub in §$sec"
  done
done
```

The acceptance commands above are *executable greps*, not opinions.

---

## See also

- [`_artifact-allow-deny.md`](_artifact-allow-deny.md) — Tables A, B, C embedded in §3.
- [`docs/mothership/pattern-c-enforcement-checklist.md`](../mothership/pattern-c-enforcement-checklist.md) — pre-migration gate (§4) and post-migration verifications (§5).
- [`docs/mothership/05-mothership-repo-buildout-plan.md §P5.5–P5.6, §P5.8`](../mothership/05-mothership-repo-buildout-plan.md) — the sketch this runbook distils.
- [`docs/mothership/07-client-handover-pack.md`](../mothership/07-client-handover-pack.md) — pre-handover gate cites this runbook (§ A — Lumivara People Advisory).
- [`docs/N8N_SETUP.md`](../N8N_SETUP.md) — n8n on Railway, used by §5.

*Last updated: 2026-04-28.*
