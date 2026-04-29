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
 * Client subset nav. Stays minimal — three tabs the operator's customer
 * needs and nothing else. No "Brain" or "Runs" leaks the autopilot.
 */
export const CLIENT_NAV_BASE: readonly NavItem[] = [
  { href: "{base}", label: "Requests", glyph: "◐" },
  { href: "{base}/new", label: "New", glyph: "+" },
  { href: "{base}/preview", label: "Preview", glyph: "▢" },
];

/** Resolve `{base}` placeholders in CLIENT_NAV_BASE for a slug. */
export function clientNav(slug: string): readonly NavItem[] {
  const base = `/admin/client/${slug}`;
  return CLIENT_NAV_BASE.map((it) => ({
    ...it,
    href: it.href.replace("{base}", base),
  }));
}
