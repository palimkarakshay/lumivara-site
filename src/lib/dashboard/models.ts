// Models the operator can pick as the "default for the next execute" — kept in
// sync with `scripts/lib/routing.py`. If you add a new Claude tier there, add
// it here so the dashboard dropdown reflects it.

export type ModelChoice = {
  id: string;
  label: string;
  description: string;
};

export const MODEL_CHOICES: ModelChoice[] = [
  {
    id: "claude-haiku-4-5-20251001",
    label: "Claude Haiku 4.5",
    description: "Fastest + cheapest. Triage and trivial edits.",
  },
  {
    id: "claude-sonnet-4-6",
    label: "Claude Sonnet 4.6",
    description: "Default code implementation tier.",
  },
  {
    id: "claude-opus-4-7",
    label: "Claude Opus 4.7",
    description: "Reserved for complex planning. Highest cost.",
  },
];

export const DEFAULT_MODEL_ID = "claude-sonnet-4-6";
export const DEFAULT_EXECUTE_MODEL_VAR = "DEFAULT_EXECUTE_MODEL";

export function isValidModelId(id: string): boolean {
  return MODEL_CHOICES.some((m) => m.id === id);
}

export function modelLabel(id: string | null): string {
  if (!id) return "Sonnet (built-in default)";
  const match = MODEL_CHOICES.find((m) => m.id === id);
  return match ? match.label : id;
}
