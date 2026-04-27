// Multi-client tier scaffold.
//
// This dashboard is moving from "Lumivara only" to a centralized control
// plane for many client repos that Lumivara automates. A lighter version
// of the same SPA will eventually ship to each client's own website
// "admin" page; that lite build mounts the dashboard with a single fixed
// client and a tier-gated feature set.
//
// Usage today:
//   - `defaultClientId` is what the AuthGate-authed operator opens by default
//   - `getClient(id)` returns the active descriptor for the visible UI
//   - `tierAllows(tier, feature)` is the gate for any feature switch
//
// Adding a new client = append to CLIENTS below + push. No code changes.
//
// This file is the SINGLE source of truth across the operator dashboard
// and the lite client build. Don't fan it out across components.

export type ClientTier = "free" | "pro" | "enterprise" | "internal";

export type ClientDescriptor = {
  id: string;            // url-safe slug; used in ?client=<id> param
  label: string;         // display name
  owner: string;         // GitHub owner login
  repo: string;          // GitHub repo name
  tier: ClientTier;
  notes?: string;
};

// Internal entry for Lumivara's own monorepo. Always present.
export const LUMIVARA_INTERNAL: ClientDescriptor = {
  id: "lumivara",
  label: "Lumivara (internal)",
  owner: "palimkarakshay",
  repo: "lumivara-site",
  tier: "internal",
};

export const CLIENTS: ClientDescriptor[] = [
  LUMIVARA_INTERNAL,
  // Append client repos here as they onboard. Example:
  // {
  //   id: "acme",
  //   label: "Acme Corp",
  //   owner: "acme-eng",
  //   repo: "acme-platform",
  //   tier: "pro",
  // },
];

export const DEFAULT_CLIENT_ID = LUMIVARA_INTERNAL.id;

export function getClient(id: string): ClientDescriptor | null {
  return CLIENTS.find((c) => c.id === id) ?? null;
}

// Feature flags. Add features here as they're built; map each tier's
// allowed set explicitly so accidental gates fail closed. The lite
// client build reads this same map.
export type Feature =
  // Read-only basics — every tier sees these.
  | "read.runs"
  | "read.workflows"
  | "read.thinking"
  // Mutations
  | "mutate.brain.default"          // change DEFAULT_AI_MODEL
  | "mutate.brain.override"         // arm NEXT_RUN_MODEL_OVERRIDE
  | "mutate.workflow.toggle"        // pause/resume on/off
  | "mutate.workflow.pause-window"  // pause for N hours
  | "mutate.run.dispatch"           // "Run now"
  | "mutate.pr.merge"               // squash-merge a PR
  // Admin
  | "admin.error-log"               // view + clear browser error log
  | "admin.cost"                    // cost panel (when implemented)
  | "admin.audit";                  // audit trail of operator actions

const TIER_FEATURES: Record<ClientTier, Feature[]> = {
  free: [
    "read.runs",
    "read.workflows",
  ],
  pro: [
    "read.runs",
    "read.workflows",
    "read.thinking",
    "mutate.workflow.toggle",
    "mutate.run.dispatch",
  ],
  enterprise: [
    "read.runs",
    "read.workflows",
    "read.thinking",
    "mutate.brain.default",
    "mutate.brain.override",
    "mutate.workflow.toggle",
    "mutate.workflow.pause-window",
    "mutate.run.dispatch",
    "mutate.pr.merge",
    "admin.cost",
  ],
  internal: [
    "read.runs",
    "read.workflows",
    "read.thinking",
    "mutate.brain.default",
    "mutate.brain.override",
    "mutate.workflow.toggle",
    "mutate.workflow.pause-window",
    "mutate.run.dispatch",
    "mutate.pr.merge",
    "admin.error-log",
    "admin.cost",
    "admin.audit",
  ],
};

export function tierAllows(tier: ClientTier, feature: Feature): boolean {
  return TIER_FEATURES[tier].includes(feature);
}

// Resolve the active client from the URL ?client= param, falling back
// to the persisted last-selected client, then to the default. Stable
// across SPA navigations.
const STORAGE_KEY = "lumivara.ops.activeClient";

export function resolveActiveClient(): ClientDescriptor {
  if (typeof window !== "undefined") {
    const fromUrl = new URLSearchParams(window.location.search).get("client");
    if (fromUrl) {
      const c = getClient(fromUrl);
      if (c) {
        try {
          localStorage.setItem(STORAGE_KEY, c.id);
        } catch {
          /* ignore */
        }
        return c;
      }
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const c = getClient(stored);
        if (c) return c;
      }
    } catch {
      /* ignore */
    }
  }
  return getClient(DEFAULT_CLIENT_ID) ?? LUMIVARA_INTERNAL;
}

export function setActiveClient(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}
