import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/**
 * Run an axe-core accessibility scan against the current page and fail the test
 * on any violation.
 *
 * Scoped to WCAG 2.1 A/AA, matching the Testing Strategy's standards target
 * (PRD launch gate: zero critical issues). On failure the assertion message
 * lists each rule id and the nodes it flagged, so the report is actionable
 * without opening a trace.
 *
 * @param page    The Playwright page, already navigated to the view under test.
 * @param options `include`/`exclude` CSS selectors to scope the scan.
 */
export async function checkA11y(
  page: Page,
  options: { include?: string; exclude?: string } = {},
): Promise<void> {
  let builder = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
  ]);

  if (options.include) builder = builder.include(options.include);
  if (options.exclude) builder = builder.exclude(options.exclude);

  const results = await builder.analyze();

  const summary = results.violations
    .map(
      (v) =>
        `  • [${v.id}] ${v.help} (${v.nodes.length} node${
          v.nodes.length === 1 ? "" : "s"
        })\n    ${v.helpUrl}`,
    )
    .join("\n");

  expect(
    results.violations,
    results.violations.length ? `axe found accessibility violations:\n${summary}` : undefined,
  ).toEqual([]);
}
