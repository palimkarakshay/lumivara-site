// Single source of truth for the repo this dashboard controls.
// Hardcoded by design: PATs in localStorage are scoped to one repo,
// so multi-repo support would only invite footguns.
export const OWNER = "palimkarakshay";
export const REPO = "lumivara-site";

// Allowed values for the DEFAULT_AI_MODEL repo variable.
// Keep this list in sync with scripts/lib/routing.py and the
// `engine` choices in .github/workflows/triage.yml.
export const MODEL_OPTIONS = [
  "opus",
  "sonnet",
  "haiku",
  "gpt4",
  "codex",
] as const;
export type ModelOption = (typeof MODEL_OPTIONS)[number];

export const VARIABLE_NAMES = {
  defaultModel: "DEFAULT_AI_MODEL",
  nextRunOverride: "NEXT_RUN_MODEL_OVERRIDE",
  // Auto-resume control set by the dashboard when the operator picks
  // "Pause for N hours" or "Pause until N runs". Format:
  //   "until=<ISO-8601>;path=<workflow-path>"      (time-based)
  //   "runs=<N>;path=<workflow-path>"              (count-based)
  // Multiple workflows are encoded with ` | ` separator. A scheduled
  // GitHub Action (auto-resume.yml) reads this every 15 min and
  // re-enables expired workflows.
  pauseSchedule: "WORKFLOW_PAUSE_SCHEDULE",
} as const;

// Markers the agent CI prints around its internal monologue. Anything
// between these two lines (inclusive of nested newlines) is surfaced in
// the LogViewer; everything else is hidden as system noise.
export const THINKING_START = ">>> THINKING";
export const THINKING_END = "<<< END THINKING";

// Workflows the operator actively monitors. Background workflows
// (deploy-dashboard, project-sync, setup-cli, ai-smoke-test, plan-issues,
// auto-merge) are excluded from the default view so the runs list isn't
// drowning in irrelevant cron noise. Toggle "Show all" in the UI to
// override.
export const RELEVANT_WORKFLOW_PATHS = new Set<string>([
  ".github/workflows/triage.yml",
  ".github/workflows/execute.yml",
  ".github/workflows/execute-complex.yml",
  ".github/workflows/execute-fallback.yml",
  ".github/workflows/execute-single.yml",
  ".github/workflows/deep-research.yml",
  ".github/workflows/codex-review.yml",
]);

export function isRelevantWorkflow(path: string): boolean {
  return RELEVANT_WORKFLOW_PATHS.has(path);
}

