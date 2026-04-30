<!-- OPERATOR-ONLY. Re-usable partial; embedded by every spinout runbook in this folder. -->
<!-- artifact-allow-deny:v1 -->

# Artifact allow / deny / required-new tables

These three tables govern what may, must not, and must newly land on a per-client repo's `main` during a spinout from `palimkarakshay/lumivara-site` (today's de-facto Client #1 repo) to a clean per-client repo. They mirror, in a single embeddable surface, the four "never" rules in [`docs/mothership/03-secure-architecture.md §1`](../mothership/03-secure-architecture.md) and the MUST / MUST-NOT rows in [`docs/mothership/dual-lane-enforcement-checklist.md`](../mothership/dual-lane-enforcement-checklist.md).

> **Drift is a bug.** If §1 of `03-secure-architecture.md` or §3 of `dual-lane-enforcement-checklist.md` changes, update Table B in the same PR. The marker comment `<!-- artifact-allow-deny:v1 -->` exists to make future bulk-edits searchable.

---

## Table A — Allowed to copy (source `main` → client repo `main`)

These paths are safe to copy verbatim from `palimkarakshay/lumivara-site` (the source) onto the new per-client repo's `main`. The "Why allowed" column explains the trust call.

| Path / file | Why allowed |
|---|---|
| `src/` (entire tree) | The Next.js app — copy, MDX articles, components, design tokens, the admin portal scaffold. This *is* the client's product. |
| `public/` | Static assets (images, fonts, icons) the site renders. |
| `mdx-components.tsx` | Top-level MDX wiring. Required for `src/content/insights/**`. |
| `next.config.ts` | Next.js 16 config — no operator-specific values. |
| `tsconfig.json` | TypeScript config. |
| `package.json` + `package-lock.json` | Dependency manifest. **Copy verbatim — do not "freshen" versions** (the executor is excluded from `package.json` upgrades by `scripts/execute-prompt.md` step 4). |
| `postcss.config.mjs` | Tailwind v4 / PostCSS pipeline. |
| `eslint.config.mjs` | Lint config. |
| `playwright.config.ts` | E2E config. |
| `vitest.config.ts` | Unit test config. |
| `components.json` | shadcn/Base UI registry pointer. |
| `vercel.json` | Vercel rewrites/headers (no env values). |
| `.gitignore` | Standard Next.js gitignore. |
| `.prettierrc` | Format config. |
| `.editorconfig` | Editor config (if present; otherwise add new). |
| `.env.local.example` | Variable shape only — no values. Confirm by `grep -E '=[^[:space:]]' .env.local.example` returns only commented examples. |
| `README.md` | Public README. The current text is mostly Next.js boilerplate plus a "Design system" pointer; verify no mothership references survive (see Acceptance, §9 A2 of the spinout runbook). |
| `CONTRIBUTING.md` | Contribution conventions. Verify it does not reference operator runbooks. |
| `CHANGELOG.md` | Site-history ledger — keep, it's part of the engagement narrative. |
| `CODE_OF_CONDUCT.md` | Contributor Covenant + Dual-Lane Repo addendum. Both repos carry the same text per `.dual-lane.yml` (`both` lane, no transform). |
| `404.html`, `index.html` | Default Next.js pages — neutral. |
| `assets/` | Repo-level design refs (e.g. brand swatches). Verify nothing operator-internal. |
| `e2e/` | Playwright test specs. |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR template (if present). Verify no autopilot-only language. |
| `.github/ISSUE_TEMPLATE/` | Issue templates (if present). |
| `.github/SECURITY.md` | Public security disclosure policy (if present). |

**Hard rule for the executor:** copying these is *file-by-file*, never `cp -r .` of the whole repo. The opposite default (allow-everything-except-deny-list) failed the four "never" rules historically — keep allow-list-first.

---

## Table B — Forbidden (must NOT exist on client repo's `main`)

Mirrors `03-secure-architecture.md §1` (the four "never" rules) and `dual-lane-enforcement-checklist.md §3` C-MUST-NOT-1..6 byte-for-byte. Drift is a bug.

| Path / pattern | Rule violated |
|---|---|
| `docs/mothership/` | C-MUST-NOT-2 — operator-only IP. |
| `docs/storefront/` | C-MUST-NOT-2 — outward-facing pitch / pricing / cost analysis is operator material, not the client's. |
| `docs/operator/` | C-MUST-NOT-2 — operator runbooks (incidents, audits) by definition. |
| `docs/migrations/` | C-MUST-NOT-2 — this very folder. The runbooks reveal autopilot internals. |
| `docs/ops/` | C-MUST-NOT-2 — operations procedures (audits, rotations) including the variable registry (#142). |
| `docs/wiki/` 🛠 pages and `docs/wiki/_partials/` | C-MUST-NOT-2 — only the 🌐 and ⚪ pages of the dual-lane wiki ship to client repos (see `docs/wiki/_partials/lane-key.md` and `docs/wiki/_partials/do-not-copy.md`). |
| `docs/AI_ROUTING.md` | C-MUST-NOT-2 — discloses the multi-AI router policy and fallback chains. |
| `docs/ADMIN_PORTAL_PLAN.md` | C-MUST-NOT-2 — operator-only architecture pack (the *plan*; the *implementation* under `src/app/admin/` is fine). |
| `docs/N8N_SETUP.md`, `docs/n8n-workflows/` | C-MUST-NOT-2 — operator's automation lane. |
| `docs/MONITORING.md`, `docs/GEMINI_TASKS.md`, `docs/BACKLOG.md` ✱, `docs/OPERATOR_SETUP.md`, `docs/TEMPLATE_REBUILD_PROMPT.md`, `docs/deploy/` ✱ | C-MUST-NOT-2 — operator-side notes. |
| `docs/AI_CONSISTENCY.md` | C-MUST-NOT-2 — model-rubric reasoning (operator side, sibling to `docs/AI_ROUTING.md`). |
| `docs/_deprecated/` | C-MUST-NOT-2 — historical operator docs (deprecated runbooks). |
| `docs/decks/` | C-MUST-NOT-2 — operator pitch decks (investor / partner / employee / prospective-client / advisor / master). |
| `docs/research/` | C-MUST-NOT-2 — operator-side market & viability research, persona work, source bibliography. |
| `n8n/**` (any JSON workflow exports) | C-MUST-NOT-2 — exposes endpoints, HMAC-signed routes, n8n credential names. |
| `dashboard/` | C-MUST-NOT-4 — operator dashboard reveals per-client costs and other clients' metadata. |
| `AGENTS.md`, `CLAUDE.md` | C-MUST-NOT-2 — operator AI-agent runtime charters. The site repo doesn't host an agent runtime post-handover (`.dual-lane.yml` transform `pipeline-only-after-spinout`). |
| `.claude/` | C-MUST-NOT-2 — operator-only Claude Code settings (model defaults, hooks, subagent config). |
| `.dual-lane.yml` | C-MUST-NOT-2 — the spinout manifest itself; meaningful only inside the operator repo. |
| `scripts/triage-*` | C-MUST-NOT-2 — autopilot triage prompts and rubric. |
| `scripts/execute-*` | C-MUST-NOT-2 — autopilot execution prompts. |
| `scripts/gemini-*`, `scripts/codex-*` | C-MUST-NOT-2 — fallback router scripts. |
| `scripts/plan-issue*` | C-MUST-NOT-2 — plan-generation rubric. |
| `scripts/test-routing*`, `scripts/test-forge-routing*` | C-MUST-NOT-2 — model-routing tests. |
| `scripts/bootstrap-kanban.sh`, `scripts/bootstrap-forge-project.sh`, `scripts/create-mothership-seed-issues.sh`, `scripts/seed-codex-review-backlog.py` | C-MUST-NOT-2 — operator-only project / backlog setup. |
| `scripts/forge-*`, `scripts/dual-lane-audit.sh`, `scripts/recheck-missed-reviews.py`, `scripts/bot-usage-report.py`, `scripts/issues/` | C-MUST-NOT-2 — Forge / Dual-Lane Repo / autopilot tooling. |
| `scripts/lib/` (entire dir) | C-MUST-NOT-2 — model-selection and inventory helpers (`routing.py`, `inventory_backfill.py`, `__init__.py`). |
| `scripts/**` (catch-all) | C-MUST-NOT-2 — by `.dual-lane.yml`, all of `scripts/` is pipeline-lane. The rows above enumerate today's filenames; the directory itself is the contract — new pipeline scripts inherit forbidden status by default. |
| `.github/workflows/triage.yml`, `plan-issues.yml`, `execute*.yml`, `codex-review.yml`, `codex-review-backlog.yml`, `codex-review-recheck.yml`, `codex-pr-fix.yml`, `deep-research.yml`, `auto-merge.yml`, `project-sync.yml`, `setup-cli.yml`, `ai-smoke-test.yml`, `deploy-dashboard.yml`, `deploy-drift-watcher.yml`, `forge-execute.yml`, `forge-triage.yml`, `forge-smoke-test.yml`, `dual-lane-watcher.yml`, `bot-usage-monitor.yml` | C-MUST-2 — autopilot workflows live on `operator/main` only, never on `main`. |
| `.github/workflows/**` (catch-all) | C-MUST-2 — every workflow under this directory is operator-side by default. New workflow files inherit forbidden status until an explicit Table A row is added. |
| Any committed string matching `[A-Za-z0-9+/=]{32,}` outside `package-lock.json` and image binaries | C-MUST-NOT-1 — no committed secrets. |
| Any string matching `palimkarakshay\.github\.io/.*-mothership` | C-MUST-NOT-4 — dashboard URL never on a client surface. |
| Any string matching `(ghp_|github_pat_|Personal Access Token)` in handover material | C-MUST-NOT-5 — no PAT to the client. |
| Any third-party brand name (`Anthropic`, `Google`, `OpenAI`, `Twilio`, `Resend`, `Vercel`, `n8n`, `Railway`) on an invoice or handover | C-MUST-NOT-3 — bill at tier price; cost stack is the operator's. |
| Direct push to `main` from operator's personal GitHub account | C-MUST-NOT-6 — only `{{BRAND_SLUG}}-bot` writes to `main`. |

**Verify (composite):**

```bash
# Path-based forbids
git -C <client-repo> ls-tree main -r --name-only \
  | grep -E '(^docs/(mothership|freelance|operator|migrations|ops)/|^n8n/|^dashboard/|^scripts/(triage|execute|gemini|codex|plan-issue|test-routing|bootstrap-kanban)|^scripts/lib/|^\.github/workflows/(triage|plan-issues|execute|codex-review|deep-research|auto-merge|project-sync|setup-cli|ai-smoke-test|deploy-dashboard)\.yml$)'
# Must return empty.

# Content forbids
git -C <client-repo> grep -E 'palimkarakshay\.github\.io/.*-mothership' main
git -C <client-repo> grep -E '(ghp_|github_pat_)' main
# Both must return empty.
```

---

## Table C — Required new on the client repo's `main`

Files that must be present on the new client repo's `main` and that did *not* exist verbatim in the source (or whose contents differ enough that they're effectively new).

| Path / file | Source / spec | Why required |
|---|---|---|
| `.claudeignore` | Verbatim from `03-secure-architecture.md §2.3` | C-MUST-5 — defence-in-depth against future cherry-picks from `operator/main` into `main`. |
| `docs/CLIENT_HANDOVER.md` | Rendered from `docs/mothership/07-client-handover-pack.md` per the per-client intake YAML in the mothership's `docs/clients/lumivara-people-advisory/intake.md` | The single mothership-derived artefact that ever leaves the operator's hands. |
| `README.md` overlay (optional) | Client-branded overlay if the source `README.md` carries Forge-branded language | The source README is mostly neutral; a per-client overlay only ships if branding diverges. Confirm by re-reading after copy. |
| `docs/wiki/` (per-client subset only) | The 🌐 and ⚪ pages from `palimkarakshay/lumivara-site/docs/wiki/` (see `docs/wiki/_partials/lane-key.md` and `docs/wiki/_partials/do-not-copy.md`) | Operator-side pages (🛠) are excluded by Table B; the client-safe pages may ship. |
| Branch `operator/main` (overlay; not on `main`) | Workflows, scripts, and per-engagement notes copied from `palimkarakshay/lumivara-site/.github/workflows/` and `palimkarakshay/lumivara-site/scripts/` to a sibling overlay branch | Dual-Lane Repo C-MUST-2 — the autopilot lives here, never on `main`. The overlay branch is created during the spinout but its contents are explicitly *not* on `main`. |
| `LICENSE` (per-client overlay) | New per-engagement `Proprietary — <Client Name>` license assigned at handover, per [`docs/mothership/21-ip-protection-strategy.md §3.3`](../mothership/21-ip-protection-strategy.md) and the `.dual-lane.yml` `LICENSE` row's `site-strips-pipeline-section` transform | The source `LICENSE` is the operator's All-Rights-Reserved interim notice. The pipeline repo retains it forever; the client repo gets a per-client license, not a copy of the source. |
| `docs/00-INDEX.md` (transformed) | Source `docs/00-INDEX.md` reduced via `.dual-lane.yml` transform `site-strips-pipeline-rows` | The site repo's index lists only Site + Both rows; pipeline-lane rows (`docs/mothership/`, `docs/storefront/`, etc.) are stripped because the targets they link to are forbidden by Table B. The pipeline copy keeps everything verbatim. |

**Verify:**

```bash
git -C <client-repo> cat-file -p main:.claudeignore | diff - <(awk '/^```$/{flag=!flag;next} flag' \
  ../mothership/03-secure-architecture.md | sed -n '/docs\/operator\//,/deploy-dashboard\.yml/p')
# Must show no functional diff (whitespace tolerated).

git -C <client-repo> ls-tree main -- docs/CLIENT_HANDOVER.md
# Must list the rendered handover.
```

---

## Known mismatches with `.dual-lane.yml`

[`.dual-lane.yml`](../../.dual-lane.yml) is the machine-readable manifest that the spinout dry-run (`scripts/forge-spinout-dry-run.sh`) and audit (`scripts/dual-lane-audit.sh §6`) read at runtime. The rows below disagree with this human-readable doc; the operator must reconcile each before P5.6. Rows in Tables A/B/C are flagged ✱ where the disagreement applies.

| Path | This doc says | `.dual-lane.yml` says | Resolution direction (operator decides) |
|---|---|---|---|
| `.claudeignore` | Table C: required-new on client repo, verbatim from `03-secure-architecture.md §2.3` | `both` lane with transform `pipeline-only-after-spinout` (NOT copied to site) | Pick one model. Either the site repo gets a §2.3-rendered `.claudeignore` (then `.dual-lane.yml` row needs `site` lane and a render transform), or it doesn't (then Table C row drops to "optional / future"). |
| `docs/BACKLOG.md` ✱ | Table B: forbidden (operator notes) | `both` lane with transform `site-strips-pipeline-rows` | If a stripped site-relevant backlog is intended, Table B should move this to Table C (transformed). Otherwise `.dual-lane.yml` should switch this row to `pipeline`. |
| `docs/ADMIN_PORTAL_PLAN.md` | Table B: forbidden ("operator-only architecture pack") | `both` lane, no transform ("Admin portal lives on Site, but the implementation playbook is operator-authored. Both copies appropriate.") | If the playbook ships to the client, Table B row should be removed and a Table A row added. Otherwise `.dual-lane.yml` should switch to `pipeline`. |
| `docs/deploy/` ✱ | Table B: forbidden ("operator-side notes") | `both` lane, no transform ("Production-integrity notes touch the site repo's deploy; relevant to both sides at spinout.") | Same shape as `ADMIN_PORTAL_PLAN.md`. |

This doc does not modify `.dual-lane.yml`; reconciliation is filed as separate Dual-Lane Repo audit follow-ups.

---

## See also

- [`.dual-lane.yml`](../../.dual-lane.yml) — the machine-readable lane manifest read by `forge-spinout-dry-run.sh` and `dual-lane-audit.sh §6`. Tables A/B/C above are the human-readable, narrative-shaped projection of the same lane assignments.
- [`dual-lane-enforcement-checklist.md §3`](../mothership/dual-lane-enforcement-checklist.md) — the canonical MUST-NOT controls (Table B mirrors the path/content rows).
- [`dual-lane-enforcement-checklist.md §4`](../mothership/dual-lane-enforcement-checklist.md) — the pre-migration gate that gates any spinout against this checklist.
- [`03-secure-architecture.md §1`](../mothership/03-secure-architecture.md) — the four "never" rules; Table B rows 1–4 mirror them byte-for-byte.
- [`03-secure-architecture.md §2.3`](../mothership/03-secure-architecture.md) — the `.claudeignore` block referenced by Table C.

*Last updated: 2026-04-30.*
