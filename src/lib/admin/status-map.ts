// Translates GitHub issue labels into the plain-English status the client
// and operator see in the admin UI. Single source of truth — referenced by
// both the mothership monitor and the client subset view so the language
// never diverges.

export type StatusTone =
  | "info"
  | "progress"
  | "review"
  | "live"
  | "blocked"
  | "neutral";

export type StatusDescriptor = {
  /** Short pill label, ≤ 24 chars. */
  label: string;
  /** Long-form line shown in detail views. */
  copy: string;
  tone: StatusTone;
  /** Operator-only labels we hide from clients. */
  internal?: boolean;
};

const ENTRIES: Array<[string, StatusDescriptor]> = [
  [
    "status/triage",
    {
      label: "Reviewing your request",
      copy: "We have it. The next triage pass will pick it up.",
      tone: "info",
    },
  ],
  [
    "status/needs-triage",
    {
      label: "Reviewing your request",
      copy: "Queued for the next triage pass.",
      tone: "info",
    },
  ],
  [
    "status/planned",
    {
      label: "Planned",
      copy: "Scoped and waiting in the build queue.",
      tone: "info",
    },
  ],
  [
    "status/in-progress",
    {
      label: "Building this",
      copy: "An execute run is working on it right now.",
      tone: "progress",
    },
  ],
  [
    "status/awaiting-review",
    {
      label: "Ready for your test",
      copy: "Live in preview — open it, click around, then approve to deploy.",
      tone: "review",
    },
  ],
  [
    "status/needs-clarification",
    {
      label: "We have a question",
      copy: "Tap to answer — we’re paused until you reply.",
      tone: "blocked",
    },
  ],
  [
    "needs-client-input",
    {
      label: "We have a question",
      copy: "Tap to answer — we’re paused until you reply.",
      tone: "blocked",
    },
  ],
  [
    "status/on-hold",
    {
      label: "On hold",
      copy: "Paused for a dependency.",
      tone: "neutral",
      internal: true,
    },
  ],
  [
    "status/needs-continuation",
    {
      label: "Continuing next run",
      copy: "Hit a soft budget — picks up automatically on the next cron.",
      tone: "progress",
      internal: true,
    },
  ],
  [
    "status/done",
    {
      label: "Live",
      copy: "Deployed. You should see it on your site.",
      tone: "live",
    },
  ],
];

const MAP = new Map(ENTRIES);

/** Pick the best status descriptor for a label set. Order in ENTRIES wins ties. */
export function statusFromLabels(
  labels: readonly string[],
): StatusDescriptor | null {
  for (const [key, value] of ENTRIES) {
    if (labels.includes(key)) return value;
  }
  return null;
}

export function getStatus(label: string): StatusDescriptor | null {
  return MAP.get(label) ?? null;
}

/** Tone → CSS class on Lumivara palette. Used by <StatusPill>. */
export const TONE_CLASSES: Record<StatusTone, string> = {
  info: "bg-parchment text-ink",
  progress: "bg-accent-soft/30 text-accent-deep",
  review: "bg-canvas-elevated text-accent-deep ring-1 ring-accent",
  live: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  blocked: "bg-[color:var(--error)]/12 text-[color:var(--error)]",
  neutral: "bg-parchment text-muted-strong",
};

const CLIENT_LABEL_PREFIX = "client/";

/** Extract the client slug out of `client/<slug>` labels (first wins). */
export function clientSlugFromLabels(labels: readonly string[]): string | null {
  for (const l of labels) {
    if (l.startsWith(CLIENT_LABEL_PREFIX)) {
      const slug = l.slice(CLIENT_LABEL_PREFIX.length).trim();
      if (slug) return slug;
    }
  }
  return null;
}
