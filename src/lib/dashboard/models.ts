// Models the operator can pick as the "default for the next execute" — kept in
// sync with `scripts/lib/routing.py`. If you add a new tier there, add it
// here so the dashboard dropdown reflects it.

export type ModelChoice = {
  id: string;
  label: string;
  description: string;
  provider: "claude" | "gemini" | "codex";
};

export const MODEL_CHOICES: ModelChoice[] = [
  {
    id: "claude-opus-4-7",
    label: "Claude Opus 4.7",
    description: "Quality-first default. Best plans, best code.",
    provider: "claude",
  },
  {
    id: "claude-sonnet-4-6",
    label: "Claude Sonnet 4.6",
    description: "Cost-optimisation tier. Solid implementation.",
    provider: "claude",
  },
  {
    id: "claude-haiku-4-5-20251001",
    label: "Claude Haiku 4.5",
    description: "Triage and trivial edits. Fastest + cheapest.",
    provider: "claude",
  },
  {
    id: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    description: "Deep research, full-codebase audits. 1M ctx.",
    provider: "gemini",
  },
  {
    id: "gpt-5.5",
    label: "GPT-5.5 (Codex)",
    description: "Second-opinion review on PRs.",
    provider: "codex",
  },
];

export const DEFAULT_MODEL_ID = "claude-opus-4-7";

/**
 * Repo-variable names. The mothership dashboard uses both: a persistent
 * default and a one-shot override that the next CI run consumes and clears.
 */
export const DEFAULT_EXECUTE_MODEL_VAR = "DEFAULT_EXECUTE_MODEL";
export const NEXT_RUN_OVERRIDE_VAR = "NEXT_RUN_MODEL_OVERRIDE";

export function isValidModelId(id: string): boolean {
  return MODEL_CHOICES.some((m) => m.id === id);
}

export function modelLabel(id: string | null): string {
  if (!id) return "Sonnet (built-in default)";
  const match = MODEL_CHOICES.find((m) => m.id === id);
  return match ? match.label : id;
}
