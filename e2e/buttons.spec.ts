import { expect, test } from "@playwright/test";

import { checkA11y } from "./helpers/axe";
import { waitForFonts } from "./helpers/fonts";

/**
 * Visual-regression + accessibility coverage for the four Button variants and
 * their states (Testing Strategy → Visual Regression: component states).
 *
 * Renders the component gallery (/dev/components/buttons), asserts zero axe
 * violations, then captures: the full matrix at rest (per viewport), plus the
 * primary button's hover and keyboard-focus states. Runs under the config's
 * `reducedMotion: 'reduce'`, so state easing is a straight cut and captures are
 * stable. Baselines live in e2e/__screenshots__/, keyed by project (1440 / 360).
 */
test.describe("button gallery", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dev/components/buttons");
    await waitForFonts(page);
  });

  test("has no accessibility violations", async ({ page }) => {
    await checkA11y(page);
  });

  test("matches the variants baseline at rest", async ({ page }) => {
    await expect(page).toHaveScreenshot("buttons-rest.png", { fullPage: true });
  });

  test("captures the primary hover state", async ({ page }) => {
    await page.getByTestId("button-primary-default").hover();
    await expect(page.getByTestId("cell-primary-default")).toHaveScreenshot(
      "button-primary-hover.png",
    );
  });

  test("captures the primary keyboard-focus state", async ({ page }) => {
    // A single Tab lands on the first focusable control — the primary button —
    // which triggers :focus-visible (scripted .focus() would not).
    await page.keyboard.press("Tab");
    const primary = page.getByTestId("button-primary-default");
    await expect(primary).toBeFocused();
    await expect(page.getByTestId("cell-primary-default")).toHaveScreenshot(
      "button-primary-focus.png",
    );
  });
});
