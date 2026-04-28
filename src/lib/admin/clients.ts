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
  /**
   * Emails authorised to see this client's slug. Each must already be in
   * the operator allow-list (`src/lib/admin-allowlist.ts`); this is an
   * additional scoping that gates which `client/<slug>` portal a signed-in
   * user can open. The operator alone is implicitly authorised for every
   * client (see `clientsForEmail`).
   */
  contactEmails: readonly string[];
  /** Optional short blurb shown in the index card. */
  blurb?: string;
};

export const CLIENT_REGISTRY: ClientRecord[] = [
  {
    slug: "lumivara",
    name: "Lumivara People Solutions",
    domain: "lumivara.ca",
    tier: "scale",
    contactEmails: ["hello@lumivara.ca"],
    blurb:
      "Internal flagship + advisory pet project — top tier, full feature set.",
  },
];

/** Operator emails that bypass the per-client allow-list. */
const OPERATOR_EMAILS: readonly string[] = ["hello@lumivara.ca"];

function normalise(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

export function findClient(slug: string): ClientRecord | null {
  return CLIENT_REGISTRY.find((c) => c.slug === slug) ?? null;
}

/**
 * True if the email is the operator (sees every client's view) or is in
 * the contactEmails of the given client.
 */
export function canAccessClient(
  email: string | null | undefined,
  slug: string,
): boolean {
  const e = normalise(email);
  if (!e) return false;
  if (OPERATOR_EMAILS.map(normalise).includes(e)) return true;
  const client = findClient(slug);
  if (!client) return false;
  return client.contactEmails.map(normalise).includes(e);
}

/** Clients this email is authorised to see, in registry order. */
export function clientsForEmail(
  email: string | null | undefined,
): ClientRecord[] {
  const e = normalise(email);
  if (!e) return [];
  if (OPERATOR_EMAILS.map(normalise).includes(e)) return CLIENT_REGISTRY;
  return CLIENT_REGISTRY.filter((c) =>
    c.contactEmails.map(normalise).includes(e),
  );
}
