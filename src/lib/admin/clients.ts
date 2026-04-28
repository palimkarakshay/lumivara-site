// Per-client metadata used by the mothership /admin/clients index. We keep
// the source of truth in code (not env) so the build artefact records who
// the operator's customers are at any point in time. A client is added
// here BEFORE its repo is provisioned, never after — that way the
// mothership can show "pending provision" empty states cleanly.

import type { TierId } from "./tiers";

export type ClientRecord = {
  slug: string;
  name: string;
  /** Apex domain the client's site is served from. */
  domain: string;
  tier: TierId;
  /** Optional short blurb shown in the index card. */
  blurb?: string;
};

export const CLIENT_REGISTRY: ClientRecord[] = [
  {
    slug: "lumivara",
    name: "Lumivara People Solutions",
    domain: "lumivara.ca",
    tier: "scale",
    blurb: "Internal flagship. The mothership is hosted from this site too.",
  },
];

export function findClient(slug: string): ClientRecord | null {
  return CLIENT_REGISTRY.find((c) => c.slug === slug) ?? null;
}
