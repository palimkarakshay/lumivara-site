import { describe, expect, it } from "vitest";

import {
  DEFAULT_TIER,
  getTier,
  isTierId,
  quotaLabel,
  tierFromEnv,
} from "@/lib/admin/tiers";

describe("tier registry", () => {
  it("starter cannot use SMS or deploy approval", () => {
    const t = getTier("starter");
    expect(t.features.intakeSms).toBe(false);
    expect(t.features.deployApproval).toBe(false);
  });

  it("growth opens up email + SMS + deploy approval", () => {
    const t = getTier("growth");
    expect(t.features.intakeEmail).toBe(true);
    expect(t.features.intakeSms).toBe(true);
    expect(t.features.deployApproval).toBe(true);
    expect(t.features.thinkingSummary).toBe(false);
  });

  it("scale unlocks the AI thinking summary and unlimited quota", () => {
    const t = getTier("scale");
    expect(t.features.thinkingSummary).toBe(true);
    expect(t.features.monthlyIdeaQuota).toBe(-1);
  });

  it("price ladder is monotonic", () => {
    expect(getTier("starter").priceMonthlyUsd).toBeLessThan(
      getTier("growth").priceMonthlyUsd,
    );
    expect(getTier("growth").priceMonthlyUsd).toBeLessThan(
      getTier("scale").priceMonthlyUsd,
    );
  });

  it("isTierId narrows correctly", () => {
    expect(isTierId("growth")).toBe(true);
    expect(isTierId("enterprise")).toBe(false);
    expect(isTierId(null)).toBe(false);
  });

  it("tierFromEnv falls back to the default for unknown values", () => {
    expect(tierFromEnv("nope")).toBe(DEFAULT_TIER);
    expect(tierFromEnv("growth")).toBe("growth");
    expect(tierFromEnv(undefined)).toBe(DEFAULT_TIER);
  });

  it("quotaLabel renders unlimited explicitly", () => {
    expect(quotaLabel(-1)).toBe("unlimited");
    expect(quotaLabel(25)).toBe("25/month");
  });
});
