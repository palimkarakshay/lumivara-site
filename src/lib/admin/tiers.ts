// Client tiers — what a given subscription can do from their /admin portal.
// The mothership exposes the union of every tier; client builds inherit a
// single tier at deploy time via `NEXT_PUBLIC_LUMIVARA_TIER`.
//
// Pricing is intentionally captured here (not the marketing site) so the
// gates the code enforces and the price the client paid stay in lockstep.

export type TierId = "starter" | "growth" | "scale";

export type TierDescriptor = {
  id: TierId;
  name: string;
  priceMonthlyUsd: number;
  /** Features the client admin can use. */
  features: {
    /** Submit ideas through the web form. Always true. */
    intakeWeb: boolean;
    /** Email forwarding -> issue. */
    intakeEmail: boolean;
    /** SMS / Twilio intake. */
    intakeSms: boolean;
    /** See preview deploy links. */
    previewLinks: boolean;
    /** Tap to approve preview -> production. */
    deployApproval: boolean;
    /** See the AI's plain-English thinking summary on each request. */
    thinkingSummary: boolean;
    /** Request slots per rolling 30 days. -1 = unlimited. */
    monthlyIdeaQuota: number;
  };
  /** Plain-English copy for the upgrade nudge. */
  upsellCopy: string;
};

export const TIERS: Record<TierId, TierDescriptor> = {
  starter: {
    id: "starter",
    name: "Starter",
    priceMonthlyUsd: 49,
    features: {
      intakeWeb: true,
      intakeEmail: false,
      intakeSms: false,
      previewLinks: true,
      deployApproval: false,
      thinkingSummary: false,
      monthlyIdeaQuota: 5,
    },
    upsellCopy: "Need email or SMS intake? Move up to Growth.",
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceMonthlyUsd: 149,
    features: {
      intakeWeb: true,
      intakeEmail: true,
      intakeSms: true,
      previewLinks: true,
      deployApproval: true,
      thinkingSummary: false,
      monthlyIdeaQuota: 25,
    },
    upsellCopy: "Want the agent's plain-English reasoning? Scale tier shows it.",
  },
  scale: {
    id: "scale",
    name: "Scale",
    priceMonthlyUsd: 449,
    features: {
      intakeWeb: true,
      intakeEmail: true,
      intakeSms: true,
      previewLinks: true,
      deployApproval: true,
      thinkingSummary: true,
      monthlyIdeaQuota: -1,
    },
    upsellCopy: "You're on the top tier — the entire AI loop is at your service.",
  },
};

export const DEFAULT_TIER: TierId = "starter";

export function isTierId(value: unknown): value is TierId {
  return value === "starter" || value === "growth" || value === "scale";
}

export function tierFromEnv(env = process.env.NEXT_PUBLIC_LUMIVARA_TIER): TierId {
  return isTierId(env) ? env : DEFAULT_TIER;
}

export function getTier(id: TierId): TierDescriptor {
  return TIERS[id];
}

export function quotaLabel(quota: number): string {
  if (quota < 0) return "unlimited";
  return `${quota}/month`;
}
