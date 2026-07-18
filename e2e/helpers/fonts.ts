import { type Page } from "@playwright/test";

/**
 * Wait until web fonts have finished loading before capturing a screenshot.
 *
 * Visual baselines are pixel-strict (maxDiffPixelRatio ≤ 0.01), so a
 * fallback-font flash during load would register as a diff. `document.fonts.ready`
 * resolves once all @font-face resources for the current layout have settled.
 */
export async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready);
}
