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
} as const;

// Markers the agent CI prints around its internal monologue. Anything
// between these two lines (inclusive of nested newlines) is surfaced in
// the LogViewer; everything else is hidden as system noise.
export const THINKING_START = ">>> THINKING";
export const THINKING_END = "<<< END THINKING";
