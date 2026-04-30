import { describe, expect, it } from "vitest";

import { CLIENT_NAV_BASE, clientNav } from "@/components/admin/nav-config";

describe("CLIENT_NAV_BASE", () => {
  it("declares the four state-aligned tabs first, in lifecycle order", () => {
    const stateTabs = CLIENT_NAV_BASE.filter((it) => !it.desktopOnly).map(
      (it) => it.label,
    );
    expect(stateTabs).toEqual(["Existing", "Draft", "Preview", "Deployed"]);
  });

  it("retains Requests and New as desktop-only entries (mobile bar stays at four)", () => {
    const desktopOnly = CLIENT_NAV_BASE.filter((it) => it.desktopOnly).map(
      (it) => it.label,
    );
    expect(desktopOnly).toEqual(["Requests", "New"]);
  });

  it("uses {base} placeholders so clientNav can resolve them per slug", () => {
    for (const item of CLIENT_NAV_BASE) {
      expect(item.href.startsWith("{base}")).toBe(true);
    }
  });
});

describe("clientNav", () => {
  const nav = clientNav("lumivara");

  it("resolves every {base} to /admin/client/<slug>", () => {
    for (const item of nav) {
      expect(item.href.startsWith("/admin/client/lumivara")).toBe(true);
      expect(item.href.includes("{base}")).toBe(false);
    }
  });

  it("maps each label to its expected route", () => {
    const byLabel = Object.fromEntries(nav.map((it) => [it.label, it.href]));
    expect(byLabel.Existing).toBe("/admin/client/lumivara/existing");
    expect(byLabel.Draft).toBe("/admin/client/lumivara/draft");
    expect(byLabel.Preview).toBe("/admin/client/lumivara/preview");
    expect(byLabel.Deployed).toBe("/admin/client/lumivara/deployed");
    expect(byLabel.Requests).toBe("/admin/client/lumivara");
    expect(byLabel.New).toBe("/admin/client/lumivara/new");
  });
});
