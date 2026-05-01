// Suggestion categories surfaced on the Draft tab. The Draft view consumes
// GitHub issues labelled `suggestion` + `category/<slug>`; the actual AI
// loop that creates those issues lives in a separate Pipeline-lane
// workstream. Centralising the vocabulary here keeps the UI free of magic
// strings — adding a new category is a one-file change.

export const SUGGESTION_LABEL = "suggestion";

export const SUGGESTION_CATEGORIES = [
  "vulnerability",
  "copy",
  "image",
  "other",
] as const;

export type SuggestionCategory = (typeof SUGGESTION_CATEGORIES)[number];

type CategoryMeta = {
  label: string;
  description: string;
};

export const CATEGORY_META: Record<SuggestionCategory, CategoryMeta> = {
  vulnerability: {
    label: "Vulnerability",
    description: "Security or compliance fix worth your attention.",
  },
  copy: {
    label: "Copy",
    description: "Wording tweaks to sharpen the message.",
  },
  image: {
    label: "Image",
    description: "Imagery, alt text, or accessibility nudges.",
  },
  other: {
    label: "Other",
    description: "Doesn't fit the named buckets — still worth a look.",
  },
};

const CATEGORY_LABEL_PREFIX = "category/";

/**
 * Map a label list to the suggestion category it announces. Returns
 * `"other"` when no `category/*` label is present or the value isn't one
 * of the known categories. Matches lower-case to forgive label-naming
 * drift.
 */
export function categoryFromLabels(labels: readonly string[]): SuggestionCategory {
  for (const raw of labels) {
    const lower = raw.toLowerCase();
    if (!lower.startsWith(CATEGORY_LABEL_PREFIX)) continue;
    const slug = lower.slice(CATEGORY_LABEL_PREFIX.length);
    if ((SUGGESTION_CATEGORIES as readonly string[]).includes(slug)) {
      return slug as SuggestionCategory;
    }
  }
  return "other";
}

/** True if the label list marks the issue as a suggestion source. */
export function isSuggestion(labels: readonly string[]): boolean {
  return labels.some((l) => l.toLowerCase() === SUGGESTION_LABEL);
}
