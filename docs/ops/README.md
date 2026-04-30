<!-- OPERATOR-ONLY. Do not copy to a client repo. -->

# `docs/ops/` — Operator operations reference

Cross-cutting operations references for the mothership: things the
operator audits or rotates rather than reads end-to-end. Pair this folder
with `docs/mothership/` (strategy + architecture) and `docs/wiki/`
(working summary).

| File | Purpose |
|---|---|
| [`variable-registry.md`](variable-registry.md) | Canonical inventory of every named key (GitHub Actions secret/var, Vercel env, n8n credential, dashboard var, operator-vault entry). Source of truth for the audit cadence in `docs/mothership/03-secure-architecture.md §3.2`. |
| [`platform-baseline.md`](platform-baseline.md) | Snapshot of the *expected* GitHub + Vercel deployment topology — secrets, vars, branch protection, Pages, webhooks, env-var scopes — that `audit-runbook.md` diffs the live configuration against. |
| [`audit-runbook.md`](audit-runbook.md) | End-to-end procedure for reconciling live GitHub + Vercel configuration against the baseline + registry. Quarterly + on every secret rotation. Files mismatches via the `audit-mismatch` issue template. |
| [`codex-fix-classify-fixtures.md`](codex-fix-classify-fixtures.md) | Spec doc + fixture catalogue pinning `scripts/codex-fix-classify.py`'s public contract (`EXCLUDED_PREFIXES`, `SPECULATIVE_MARKERS`, length cap, parser anchor). Source of truth for the negative-test runner wired into `ai-smoke-test.yml`. |
| [`github-project-layout.md`](github-project-layout.md) | Spec for the single user-level GitHub Project (`Lumivara Forge — operator hub`, free tier) that visualises every workstream — POC, GTM, comms, operator-manual, technical, functional, research, advisory, dummy-client, prospect-client, legal/vault — via custom fields + saved views. Includes web-UI runbook, scripted bootstrap (`scripts/bootstrap-forge-project.sh`), and the Phase 4 transfer playbook. |
| [`gemini-deep-audit.md`](gemini-deep-audit.md) | Operator contract for the weekly `gemini-deep-audit.yml` cron — Gemini 2.5 Pro full-tree read that surfaces cross-tree drift clusters. Pins the cluster output shape, the two-stage hallucination guard (path-existence + cluster-of-one), the 5-issue-per-run cap, the token-budget guard, rate-limit handling, and the first-week smoke test. Workflow + driver land in a follow-up `infra-allowed` issue. |
| [`doc-task-seeder.md`](doc-task-seeder.md) | Operator contract for `doc-task-seeder.yml` (daily 02:00 UTC cron) and the deterministic `<!-- bot-task: ... -->` marker the seeder consumes. Capture layer for doc-driven backlog. Four-tier defence (regex + Gemini steelman + Codex steelman + operator-attested approval label) per OWASP LLM08 / NIST AI RMF Manage. |

Future entries in this folder (planned):

- `incident-response.md` — flesh out the one-pager in `docs/mothership/03-secure-architecture.md §8`.

Conventions for adding a doc here:

- Operator-only. The `<!-- OPERATOR-ONLY -->` banner at the top is a hard rule.
- Names only — no secret *values* anywhere in this folder. Values live in the operator vault.
- Cross-link from `docs/mothership/00-INDEX.md` so the doc is discoverable from the master index.
