/**
 * Admin allow-list — primary source of truth.
 *
 * Edits to this file require operator review (see CODEOWNERS).
 * For ad-hoc additions without a code change, set `ADMIN_ALLOWLIST_EMAILS`
 * in Vercel as a comma-separated fallback.
 */

const HARDCODED_EMAILS: readonly string[] = [
  "hello@lumivara.ca",
];

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

function fromEnv(): string[] {
  const raw = process.env.ADMIN_ALLOWLIST_EMAILS;
  if (!raw) return [];
  return raw
    .split(",")
    .map(normalize)
    .filter((value) => value.length > 0);
}

export function getAdminAllowlist(): Set<string> {
  return new Set([...HARDCODED_EMAILS.map(normalize), ...fromEnv()]);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminAllowlist().has(normalize(email));
}
