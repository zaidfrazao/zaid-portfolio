import { expect, test } from "@playwright/test";
import { checkA11y } from "./helpers/axe";
import { waitForFonts } from "./helpers/fonts";

/**
 * Sample E2E spec — proves the harness end to end (navigation → structural
 * assertion → axe scan → visual baseline). It is intentionally minimal; the
 * launch-gate flows (10-second path, chapter navigation, reduced-motion parity,
 * mobile grammar) land in later tasks on top of this foundation.
 *
 * Linked requirement: Testing Strategy — E2E, Accessibility, Visual Regression.
 * Preconditions:       production build (see webServer), reducedMotion: 'reduce'.
 * Runs on:             chromium (desktop 1440) and mobile-chrome (360px width).
 * Expected result:     the landing tableau renders its identity, has zero axe
 *                      violations, and matches its committed baseline.
 */
test.describe("landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForFonts(page);
  });

  test("renders the portfolio identity", async ({ page }) => {
    // Assert on structure, not exact copy (per the Testing Strategy).
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("has no accessibility violations", async ({ page }) => {
    await checkA11y(page);
  });

  test("matches the settled tableau baseline", async ({ page }) => {
    // No ambient motion at rest, so the full-page capture is stable.
    await expect(page).toHaveScreenshot("landing.png", { fullPage: true });
  });
});
