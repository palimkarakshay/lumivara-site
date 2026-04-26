import { test, expect } from "@playwright/test";
import { siteConfig } from "../src/lib/site-config";

test.describe("Smoke: homepage", () => {
  test("loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page).toHaveTitle(/Lumivara/i);
    expect(errors).toHaveLength(0);
  });
});

test.describe("Smoke: navigation", () => {
  test("all nav links resolve to non-error pages", async ({ page }) => {
    await page.goto("/");

    for (const { href } of siteConfig.nav) {
      const response = await page.goto(href);
      expect(
        response?.status(),
        `Expected ${href} to return 200`
      ).toBeLessThan(400);
    }
  });
});

test.describe("Smoke: diagnostic", () => {
  test("completes end-to-end and shows a result", async ({ page }) => {
    await page.goto("/what-we-do");

    // Answer all diagnostic questions by clicking the first option each time
    const totalQuestions = 4;
    for (let i = 0; i < totalQuestions; i++) {
      const option = page.getByRole("button").filter({ hasText: /\w/ }).first();
      await option.waitFor({ state: "visible" });
      await option.click();
    }

    // After completing all questions, a result / recommendation should appear
    await expect(
      page.getByRole("heading").filter({ hasText: /recommend|your fit|focus|consider/i })
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Smoke: contact page", () => {
  test("contact form renders with name and email fields", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /send|submit/i })
    ).toBeVisible();
  });
});

test.describe("Smoke: insights article", () => {
  test("first insights article renders MDX content", async ({ page }) => {
    await page.goto("/insights");

    // Find the first article card link and navigate to it
    const firstLink = page.getByRole("link").filter({ hasText: /read|view|→|\w{10}/i }).first();
    const href = await firstLink.getAttribute("href");
    expect(href).toMatch(/\/insights\//);

    await page.goto(href!);

    // The article page should have a heading and body text
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("article, main")).toBeVisible();
  });
});
