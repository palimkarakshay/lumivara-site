# Dashboard build — session state

Resumption note for future Claude sessions / new operators picking up
work on the AI Ops dashboard. Read this first; it points at the
canonical files instead of duplicating their content.

## Where the work lives

- **Branch:** `claude/ai-ops-dashboard-kL9yJ`
- **Pushed to:** `origin` (no PR open by design — operator merges)
- **Code:** `dashboard/` (separate npm tree, Vite + React 18 + TS + Tailwind 3)
- **Server-side:** `.github/workflows/{deploy-dashboard,auto-resume,report-failure}.yml`
  + revisions to `triage.yml` / `execute.yml`
- **Operator setup:** `dashboard/README.md`
- **Architecture:** `docs/dashboard/multi-client-architecture.md`
- **Roadmap of overviews to add:** `docs/dashboard/automation-overview-ideas.md`

## What's done (commit by commit)

| Commit prefix | Scope                                                              |
| ------------- | ------------------------------------------------------------------ |
| `feat(dashboard): mobile-first AI Ops SPA (Phase 2)` | Initial SPA — auth, brain, workflows, runs, logs, merge |
| `feat(ops): wire workflows to dashboard variables (Phase 1)` | `execute.yml` + `triage.yml` read the dashboard's repo vars; deploy workflow added |
| `feat(dashboard): UX revision …` | Filtering, cron next-run, pause-for-duration UI, error boundary, pull-to-refresh, lg+ 2-col layout, throttled queries, sequential log fetch, scoped-403 error messages |
| `feat(ci): auto-resume + report-failure workflows` | Server-side pause expiry + auto-issue on workflow failure |
| (this commit) | Multi-client tier scaffold, vitest smoke tests, README revamp, automation-overview research |

## Outstanding / next session

These are scoped, not scoped *out*. Pick whichever the operator's most
fed up with on a given day.

### Highest expected ROI
1. **Run success rate tile** — single percentage at the top of the runs
   list, computed from existing `listWorkflowRuns` data. P1 in
   `automation-overview-ideas.md`. ~50 LOC.
2. **Stuck-issue queue** — `gh issue list --label status/needs-triage`
   sorted by age, top 5 surfaced. Most operator-actionable single
   widget. ~80 LOC.
3. **Auto-resume PAT** — operator action: add `OPS_VARIABLES_TOKEN`
   secret. Until then, pause-for-duration is effectively
   pause-indefinitely. Documented in `dashboard/README.md` §5.

### Multi-client wiring (when CLIENTS grows beyond Lumivara)
- The data layer in `dashboard/src/lib/clients.ts` is complete.
- Still TODO: wire `OWNER` / `REPO` consumers in `lib/github.ts` and
  `lib/config.ts` to read from `resolveActiveClient()` instead of the
  hardcoded constants. Single-pass refactor (~30 min).
- Add a header `<ClientPicker>` that's hidden when `CLIENTS.length === 1`.
- Prefix every React Query key with the active client id so cache
  isolation is automatic.
- Per-client `RELEVANT_WORKFLOW_PATHS`: move it onto `ClientDescriptor`
  with the current Lumivara list as the default.
- Lite client build: `npm run build:client -- --client=acme` produces
  a bundle with the picker stripped and the client baked in. Hosting
  doc TBD.

### Cost tracking (P1 #4 in the ideas doc)
Needs a `scripts/log-spend.py` that the existing workflows call at
exit, appending a JSONL row to a `data/spend/<YYYY-MM>.jsonl` file
in-repo. The dashboard reads the latest row via the Contents API and
shows a chip. Skip this until #1-#3 land.

### Cron expressivity
`lib/cron.ts` deliberately handles only four shapes (every-N-minutes,
every-N-hours, daily-HH:MM, every-N-days). If a future workflow uses a
weekly or DOM-specific cron, `nextRun` returns `null` and the row
falls back to showing the raw cron expression. Add shapes only when
needed; don't import a full cron lib.

### Open architecture decisions
- Should the lite client build live in `dashboard-client/` or use a
  Vite multi-entry config? Multi-entry has half the dependency
  duplication; the dirs are easier to reason about. **Lean
  multi-entry**, decide when implementing.
- Should `WORKFLOW_PAUSE_SCHEDULE` move to a JSON file in the repo
  instead of a Variable? File-based gives free git history. Variable
  gives atomic writes. **Stay with Variable** until 100 entries make
  parsing painful.

## Constraints to respect (re-stated for new sessions)

- **AGENTS.md self-pacing:** at ~50% of `--max-turns`, finish current
  unit + stop. At ~80%, hard stop. The fact that this dashboard exists
  is *because* the operator's quota is precious — do not spend it
  ironically.
- **Vercel parity:** dashboard changes don't touch Vercel. The
  `vercel.json` `ignoreCommand` already excludes `dashboard/**`. Don't
  add `needs-vercel-mirror` for dashboard-only PRs.
- **Branch discipline:** continue committing to
  `claude/ai-ops-dashboard-kL9yJ`. Don't push to `main` without
  explicit operator instruction in the active session.
- **Token hygiene:** no PAT touches the codebase. The dashboard's PAT
  lives in user `localStorage`; CI reads PATs from secrets.
  `OPS_VARIABLES_TOKEN` is the only required new secret.

## Validation

| Check         | How                                          |
| ------------- | -------------------------------------------- |
| Type checks   | `cd dashboard && npx tsc --noEmit`           |
| Unit tests    | `cd dashboard && npm test` (27 tests, ~700ms) |
| Build         | `cd dashboard && npm run build`              |
| Workflow YAML | `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/<file>'))"` |

A future session that breaks any of the above should fix it before
moving on.
