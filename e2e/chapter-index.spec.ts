import { expect, test } from "@playwright/test";

import { checkA11y } from "./helpers/axe";
import { waitForFonts } from "./helpers/fonts";

/**
 * Visual-regression + accessibility coverage for the ChapterIndex nav shell
 * (Testing Strategy → Visual Regression: component states; PORT-12 acceptance:
 * current-in-Sienna, keyboard focus, 360px, nav landmark + aria-current).
 *
 * Renders the component gallery (/dev/components/chapter-index), asserts zero
 * axe violations (which covers the nav landmark and link/ground contrast), then
 * captures the shell at rest (per viewport) and its first link's keyboard-focus
 * state. Runs under the config's `reducedMotion: 'reduce'`, so the hover/focus
 * easing is a straight cut and captures are stable. Baselines live in
 * e2e/__screenshots__/, keyed by project (1440 / 360) — the 360 project proves
 * the acceptance-gate narrow width.
 */
test.describe("chapter-index gallery", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dev/components/chapter-index");
    await waitForFonts(page);
  });

  test("has no accessibility violations", async ({ page }) => {
    await checkA11y(page);
  });

  test("matches the shell baseline at rest", async ({ page }) => {
    await expect(page).toHaveScreenshot("chapter-index-rest.png", {
      fullPage: true,
    });
  });

  test("captures the first link's keyboard-focus state", async ({ page }) => {
    // A single Tab lands on the first focusable control — the first chapter
    // link — which triggers :focus-visible (scripted .focus() would not).
    await page.keyboard.press("Tab");
    const firstLink = page.getByRole("link", { name: "About" });
    await expect(firstLink).toBeFocused();
    await expect(page).toHaveScreenshot("chapter-index-focus.png", {
      fullPage: true,
    });
  });
});
