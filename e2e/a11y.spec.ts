import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility — homepage", () => {
  test("has no critical or serious axe violations", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const criticalOrSerious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? "")
    );

    if (criticalOrSerious.length > 0) {
      const summary = criticalOrSerious
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.map((n) => n.target.join(", ")).join(" | ")}`
        )
        .join("\n");
      throw new Error(`Axe found ${criticalOrSerious.length} critical/serious violation(s):\n${summary}`);
    }

    expect(criticalOrSerious).toHaveLength(0);
  });
});

test.describe("Accessibility — contact page", () => {
  test("form inputs are labelled and no critical violations", async ({ page }) => {
    await page.goto("/contact");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const criticalOrSerious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? "")
    );

    if (criticalOrSerious.length > 0) {
      const summary = criticalOrSerious
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.map((n) => n.target.join(", ")).join(" | ")}`
        )
        .join("\n");
      throw new Error(`Axe found ${criticalOrSerious.length} critical/serious violation(s):\n${summary}`);
    }

    expect(criticalOrSerious).toHaveLength(0);
  });
});
