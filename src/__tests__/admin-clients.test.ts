import { describe, expect, it } from "vitest";

import {
  CLIENT_REGISTRY,
  canAccessClient,
  clientsForEmail,
  findClient,
} from "@/lib/admin/clients";

describe("CLIENT_REGISTRY", () => {
  it("contains the lumivara flagship on the scale tier", () => {
    const lumivara = findClient("lumivara");
    expect(lumivara).not.toBeNull();
    expect(lumivara?.tier).toBe("scale");
    expect(lumivara?.contactEmails).toContain("hello@lumivara.ca");
  });

  it("returns null for unknown slugs", () => {
    expect(findClient("does-not-exist")).toBeNull();
  });
});

describe("canAccessClient", () => {
  it("operator email passes for any registered slug", () => {
    expect(canAccessClient("hello@lumivara.ca", "lumivara")).toBe(true);
  });

  it("operator bypasses the per-client list (slug existence is checked separately by callers)", () => {
    // The operator can authorise on any slug; the layout calls findClient
    // independently so an unknown slug 404s before reaching this gate.
    expect(canAccessClient("hello@lumivara.ca", "anything-the-operator-types")).toBe(true);
  });

  it("rejects null/empty emails", () => {
    expect(canAccessClient(null, "lumivara")).toBe(false);
    expect(canAccessClient("", "lumivara")).toBe(false);
    expect(canAccessClient(undefined, "lumivara")).toBe(false);
  });

  it("normalises whitespace + case", () => {
    expect(canAccessClient(" Hello@Lumivara.CA ", "lumivara")).toBe(true);
  });

  it("rejects an email not in the client's contact list", () => {
    expect(canAccessClient("someone@elsewhere.test", "lumivara")).toBe(false);
  });
});

describe("clientsForEmail", () => {
  it("operator sees every registered client", () => {
    expect(clientsForEmail("hello@lumivara.ca")).toEqual(CLIENT_REGISTRY);
  });

  it("non-operator sees only their assigned clients", () => {
    expect(clientsForEmail("someone@elsewhere.test")).toEqual([]);
  });

  it("returns empty for null/empty emails", () => {
    expect(clientsForEmail(null)).toEqual([]);
    expect(clientsForEmail("")).toEqual([]);
  });
});
