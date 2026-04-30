<!-- OPERATOR-ONLY. Reference for Run S1 (16 §5) and every future doc/folder add. -->

# 15b — Naming Conventions: Folders, Files, Glossary

Companion to `15-terminology-and-brand.md`. Where §1 of that file defines *what
words to use*, this file defines *how to spell, case, prefix, and locate* them
on disk. It is the canonical source the Run S1 rename pass (`16 §5`) targets,
and every new doc / folder added after S1 must conform to the rules below or
amend this file in the same PR.

> **Status:** ✅ canonical (drafted 2026-04-29). **Run S1 is partial:**
> `docs/freelance/` → `docs/storefront/` shipped on 2026-04-29 (PR #200);
> the `docs/mothership/` → `docs/platform/` rename is **deferred** per
> the operator decision on 2026-04-29 (folder stays as `mothership/`
> until a later iteration). Prose-terminology drift (`mothership` →
> `platform` in noun usage; the retired `-Infotech` working name →
> `Lumivara Forge`) is being swept incrementally — see PR #200's
> commit log + the `scripts/dual-lane-audit.sh §1` advisory. Drift
> between this file and `15 §1` is a bug.

---

## §1 — Why this file exists

Three problems in the current tree this is fixing:

1. **`mothership` is metaphor, not a role.** Anyone walking in cold has to
   ask. The operator-side glossary (`15 §1`) already retired the word in
   favour of *Platform* / *Control Plane*. The folder name and ~150 in-doc
   references have not been updated.
2. **`freelance` describes the operator, not the artefact.** The folder
   holds the **storefront** (gigs, tiers, slide deck, channel plan,
   marketing strategy) — the outward-facing pack. After the brand lock
   ("Lumivara Forge" — a productised service), "freelance" is also
   slightly off-positioning: the offering is closer to a tiered MSP than
   to a person hired hourly.
3. **Two folders use casing that diverges from the rest.**
   `docs/wiki/` mixes `Title-Case.md` page names with kebab-case partials
   (`docs/wiki/_partials/lane-key.md`). The mothership folder uses
   numeric-prefix-kebab-case (`02b-dual-lane-architecture.md`). New docs
   keep guessing.

---

## §2 — Locked recommendations (apply in Run S1)

| Today | After S1 | Why |
|---|---|---|
| `docs/mothership/` | `docs/platform/` (DEFERRED 2026-04-29) | Matches `15 §1`; "platform" is industry-standard for a fleet-managing control surface. Folder rename deferred to a later iteration per operator decision; prose terminology sweep proceeds independently. |
| `docs/freelance/` → `docs/storefront/` (DONE 2026-04-29 PR #200) | `docs/storefront/` | Matches the folder's own README ("the storefront"). Avoids "freelance" connoting hourly contractor work. |
| `docs/migrations/` | `docs/migrations/` (keep) | Already plain English; one-shot transitions are universally called migrations. |
| `docs/ops/` | `docs/ops/` (keep) | Standard. |
| `docs/research/` | `docs/research/` (keep) | Standard. |
| `docs/decks/` | `docs/decks/` (keep) | Standard. |
| `docs/wiki/` | `docs/wiki/` (keep, but normalise casing — see §4) | Wiki pages keep `Title-Case.md` because GitHub renders the wiki UI from those names; the partials under `_partials/` stay kebab-case. |
| `docs/n8n-workflows/` | `docs/n8n/` | Drops the redundant suffix; pairs with the eventual `n8n/**` runtime folder in the platform repo (`02 §1`). |
| `docs/deploy/` | `docs/deploy/` (keep) | Standard. |
| `dashboard/` | `dashboard/` (keep) | Already short and clear. |
| `workflows-template/` (planned) | `workflows-template/` (keep) | Standard Mustache-template suffix; readable. |
| `client-template/` (planned) | `site-template/` | Matches the post-rename "Site Repo" terminology. |
| `cli/` (planned) | `cli/` (keep) | Standard. |

### Slug rules (post-S1)

```
{{BRAND}}        = "Lumivara Forge"
{{BRAND_SLUG}}   = "lumivara-forge"
Org slug         = "lumivara-forge"
Platform repo    = "lumivara-forge/lumivara-forge-platform"
                   (one repo named after the org for findability)
GitHub App       = "lumivara-forge-pipeline-bot"
Bot account      = (deprecated; App-first per 02b §3 / 09 §1)
Site repo        = "lumivara-forge/<client-slug>-site"
Pipeline repo    = "lumivara-forge/<client-slug>-pipeline"
Client slug      = kebab-case, ASCII only, ≤32 chars
                   (e.g. "lumivara-people-advisory")
n8n workflow     = "forge-<verb>-<client-slug>"
                   (e.g. "forge-intake-lumivara-people-advisory")
n8n credential   = "<integration>-<client-slug>"
                   (e.g. "twilio-lumivara-people-advisory")
HMAC secret name = "N8N_HMAC_SECRET" (Vercel env var, per-client value)
```

---

## §3 — File-naming rules

### Operator-scope docs (`docs/platform/`, `docs/storefront/`, `docs/ops/`, `docs/migrations/`, `docs/research/`, `docs/decks/`)

```
NN[a-z]?-kebab-case-title.md
```

- Two-digit numeric prefix for read-order. Letter suffix (`02b`, `15b`)
  for tightly-coupled companions.
- Kebab-case after the prefix. ASCII only.
- `.md` only — no `.MD`, no `.markdown`.
- Top-level docs in a folder: `00-INDEX.md` (ALL CAPS), `README.md`
  (the human entry point). Pick one per folder; do not duplicate.

### Client-scope mirrors (`docs/clients/<slug>/`)

```
intake.md
cadence.json
secrets.md.age
runbook.md
engagement-log.md
evidence-log.md
evidence/
```

Fixed names — never client-renamed. The slug appears in the folder, not
in the file. This makes the spinout runbook's `cp -R` step trivial.

### Workflow files (`workflows-template/` and shipped `<slug>-pipeline/.github/workflows/`)

```
<verb>[-<qualifier>].yml
```

- `<verb>` is one of: `triage`, `plan`, `execute`, `review`, `auto-merge`,
  `smoke`, `provision`, `teardown`, `audit`, `deploy`.
- `<qualifier>` is optional — used when one verb has multiple cadences
  (`execute.yml`, `execute-complex.yml`, `execute-fallback.yml`,
  `execute-single.yml`). Keep ≤2 segments; prefer fewer files with
  inputs over many qualifier suffixes.
- No date prefix. No version suffix. The git history is the version.

### Scripts (`scripts/`)

```
<verb>-<noun>.<lang>
```

- Verb-noun: `plan-issue.py`, `bootstrap-kanban.sh`, `gemini-triage.py`.
- Co-located library code under `scripts/lib/` with snake_case Python
  module names (`routing.py`, `inventory_backfill.py`).
- Prompts that drive Claude Code go under `scripts/<flow>-prompt.md`
  (`triage-prompt.md`, `execute-prompt.md`).

### Wiki pages (`docs/wiki/`)

GitHub renders the wiki UI from the file name, so keep `Title-Case.md`
for pages: `Home.md`, `Bot-Workflow.md`, `Best-Practices.md`. Hyphen-
separated. Partials under `_partials/` stay kebab-case (`lane-key.md`,
`do-not-copy.md`) because they are includes, not pages.

---

## §4 — Folder structure (post-S1, target shape)

```
docs/
├─ platform/                  ← operator-only runbooks (was: mothership/)
│   ├─ 00-INDEX.md
│   ├─ 01-business-plan.md
│   ├─ 02-architecture.md
│   ├─ 02b-dual-lane-architecture.md      ← canonical Dual-Lane Repo
│   ├─ 03-secure-architecture.md
│   ├─ 03b-security-operations-checklist.md
│   ├─ 04-tier-based-agent-cadence.md
│   ├─ 05-platform-repo-buildout-plan.md  ← was: mothership-repo-buildout-plan
│   ├─ 06-engagement-playbook.md          ← was: operator-rebuild-prompt-v3
│   ├─ 07-client-handover-pack.md
│   ├─ 08-future-work.md
│   ├─ 09-github-account-topology.md
│   ├─ 10..14-critique-*.md
│   ├─ 15-terminology-and-brand.md
│   ├─ 15b-naming-conventions.md          ← this file
│   ├─ 16-automation-prompt-pack.md
│   ├─ 17-claude-issue-seeding-pack.md
│   ├─ 18-capacity-and-unit-economics.md
│   ├─ 18-provisioning-automation-matrix.md
│   ├─ 19-engagement-evidence-log-template.md
│   ├─ 20-launch-and-operating-cost-model.md
│   ├─ 21-ip-protection-strategy.md
│   ├─ 21-vault-strategy-adr.md
│   ├─ 22-engagement-risk-protection.md
│   ├─ dual-lane-enforcement-checklist.md
│   └─ templates/
│       └─ 00-templates-index.md
├─ storefront/                ← outward-facing pack (was: freelance/)
│   ├─ 00-quick-start.md
│   ├─ 01-gig-profile.md
│   ├─ 02-pricing-tiers.md
│   ├─ 03-cost-analysis.md
│   ├─ 04-slide-deck.{md,html,pdf}
│   ├─ 05-template-hardening-notes.md
│   ├─ 06-positioning-slide-deck.md
│   ├─ 06-product-strategy-deck.md
│   ├─ 07-client-migration-strategy.md
│   ├─ 07-marketing-strategy.md
│   ├─ 08-client-migration-summary.md
│   ├─ README.md
│   └─ assets/
├─ migrations/                ← one-shot transitions (keep)
├─ ops/                       ← recurring ops procedures (keep)
├─ research/                  ← evidentiary layer (keep)
├─ decks/                     ← stakeholder decks (keep)
├─ wiki/                      ← dual-lane wiki (keep)
├─ n8n/                       ← n8n workflow JSON (was: n8n-workflows/)
├─ deploy/                    ← deploy notes (keep)
├─ ADMIN_PORTAL_PLAN.md       ← top-level docs stay ALL_CAPS by convention
├─ AI_CONSISTENCY.md
├─ AI_ROUTING.md
├─ BACKLOG.md
├─ GEMINI_TASKS.md
├─ MONITORING.md
├─ N8N_SETUP.md
├─ OPERATOR_SETUP.md
└─ TEMPLATE_REBUILD_PROMPT.md
```

The ALL_CAPS top-level docs follow GitHub convention (same as `README`,
`LICENSE`, `CONTRIBUTING`, `CHANGELOG`). Don't normalise these to
lowercase — every contributor reflexively looks for capitalised
top-level docs.

---

## §5 — Industry references this file leans on

- **Diátaxis framework** — *Tutorials / How-to / Reference / Explanation*
  quadrants. Our `00-quick-start.md` is a tutorial; `06-engagement-
  playbook.md` is a how-to; `02b-dual-lane-architecture.md` is reference;
  `01-business-plan.md` is explanation. We don't sub-folder by quadrant
  (too rigid for a small repo) but the read-order numbering keeps
  tutorials low and reference high.
  Source: <https://diataxis.fr>.
- **GitHub repo conventions** — `README.md`, `LICENSE`, `CONTRIBUTING.md`,
  `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` at repo root in
  ALL_CAPS. `.github/` for repo-meta YAML. `docs/` for everything else.
- **Conventional Commits + Semantic Versioning** — already followed by
  the bot (`feedback(#NNN): …`).
- **kebab-case for URLs and file names**, **snake_case for code symbols**
  (Python modules, JSON keys), **PascalCase for React components and
  TypeScript types**, **camelCase for TypeScript variables**. This is
  already the in-code convention; this file makes it explicit for docs.
- **POSIX-portable file names** — ASCII, no spaces, no shell metacharacters,
  ≤255 bytes including extension. Makes `cp -R`, `git mv`, and shell
  globs in runbooks safe.

---

## §6 — When to amend this file

Amend in the same PR that:

- Adds a new folder under `docs/` (add a row in §4).
- Introduces a new file-name pattern (add a rule in §3).
- Changes a glossary term in `15 §1` (mirror it here).
- Lands Run S1 (`16 §5`) — flip §2 from "after S1 / target" to "current".
- Coins a new client-mirror file under `docs/clients/<slug>/` (add to §3).

Drift between this file, `15 §1`, and `00-INDEX.md` is the most common
authoring bug. The audit-grep recipe is

```bash
git grep -niE 'mothership|freelance' \
  -- docs/ README.md AGENTS.md CLAUDE.md
```

Post-S1 this returns zero matches outside `15 §1` (the historical
glossary), `15b §1` (this file's "why"), and the migration-history docs
listed in `15 §6`.

*Last updated: 2026-04-29.*
