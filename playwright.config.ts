import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";

/**
 * Playwright E2E configuration for zaid-portfolio.
 *
 * Design decisions trace to docs/TESTING_STRATEGY.md (End-to-End, Visual
 * Regression, Accessibility):
 *
 * - CI (and this config by default) runs against a *production* build, not the
 *   dev server — animations and static generation must be tested as shipped.
 * - Every run defaults to `reducedMotion: 'reduce'`. On a site whose brand rule
 *   is "resting states are fully static", this eliminates animation flake and
 *   lets `toHaveScreenshot()` be trusted.
 * - Visual baselines are committed under `e2e/__screenshots__/` and diffed with
 *   a strict `maxDiffPixelRatio` — an unexplained diff is a bug by definition.
 */

const isCI = !!process.env.CI;

/**
 * Firefox and WebKit are scaffolded but out of the default run: their binaries
 * need extra system libraries under WSL, and the launch-gate ACs only require
 * Chromium + a 360px mobile project. Enable the full matrix (as the Testing
 * Strategy prescribes on merge to main) with:
 *   npx playwright install firefox webkit
 *   PW_ALL_BROWSERS=1 npm run test:e2e
 */
const allBrowsers = !!process.env.PW_ALL_BROWSERS;

const projects: NonNullable<PlaywrightTestConfig["projects"]> = [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
  },
  {
    // Mobile grammar (Feature 5). 360px is the narrow launch-gate width.
    name: "mobile-chrome",
    use: { ...devices["Pixel 5"], viewport: { width: 360, height: 800 } },
  },
];

if (allBrowsers) {
  projects.push(
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  );
}

export default defineConfig({
  testDir: "e2e",
  // Baselines live in one committed tree, keyed by spec / project / platform so
  // desktop and mobile-360 captures never collide.
  snapshotPathTemplate:
    "e2e/__screenshots__/{testFileName}/{arg}-{projectName}-{platform}{ext}",

  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: "http://localhost:3000",
    // Straight cuts, no ambient motion — matches the brand's hard rule and kills
    // flake. `reducedMotion` is a browser-context option, so it lives here.
    contextOptions: { reducedMotion: "reduce" },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  expect: {
    // This site has no ambient motion, so drift has no excuse. Keep it strict.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },

  projects,

  // Test as shipped: build once, serve the production output on :3000.
  // Locally we reuse an already-running server if you started one yourself.
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !isCI,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
