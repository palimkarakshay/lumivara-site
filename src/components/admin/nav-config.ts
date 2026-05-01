import type { NavItem } from "./AdminNav";

/**
 * Mothership nav. Mobile bar shows the first 4 (no desktopOnly). Desktop
 * sidebar shows all entries. The order here is the order the user reads
 * the dashboard left-to-right / top-to-bottom.
 */
export const MOTHERSHIP_NAV: readonly NavItem[] = [
  { href: "/admin", label: "Overview", glyph: "◐" },
  { href: "/admin/runs", label: "Runs", glyph: "▶" },
  { href: "/admin/deployments", label: "Deploys", glyph: "▲" },
  { href: "/admin/tests", label: "Tests", glyph: "✓", desktopOnly: true },
  { href: "/admin/brain", label: "Brain", glyph: "✦", desktopOnly: true },
  { href: "/admin/clients", label: "Clients", glyph: "◇", desktopOnly: true },
];

/**
 * Client subset nav. Four state-aligned tabs (Existing, Draft, Preview,
 * Deployed) match the engagement lifecycle the customer thinks in. The
 * legacy Requests + New tabs stay reachable on desktop so power users
 * keep the listing view; on mobile they collapse out so the bar shows
 * only the four state-aligned tabs.
 */
export const CLIENT_NAV_BASE: readonly NavItem[] = [
  { href: "{base}/existing", label: "Existing", glyph: "◐" },
  { href: "{base}/draft", label: "Draft", glyph: "✎" },
  { href: "{base}/preview", label: "Preview", glyph: "▢" },
  { href: "{base}/deployed", label: "Deployed", glyph: "▲" },
  { href: "{base}", label: "Requests", glyph: "≡", desktopOnly: true },
  { href: "{base}/new", label: "New", glyph: "+", desktopOnly: true },
];

/** Resolve `{base}` placeholders in CLIENT_NAV_BASE for a slug. */
export function clientNav(slug: string): readonly NavItem[] {
  const base = `/admin/client/${slug}`;
  return CLIENT_NAV_BASE.map((it) => ({
    ...it,
    href: it.href.replace("{base}", base),
  }));
}
