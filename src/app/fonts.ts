/**
 * Typefaces — "the title cards", self-hosted.
 *
 * The Brand Guide (docs/BRAND_GUIDE.md → Typography) names exactly two
 * typefaces, both SIL OFL, both self-hosted so the site makes zero external
 * font requests:
 *
 *   - Jost (variable) — one geometric sans for the whole site, a
 *     screen-optimized Futura descendant. Every register (H1–H3, body, labels,
 *     intertitles) is this one voice differentiated by weight/tracking/case.
 *   - JetBrains Mono (variable) — strictly functional: code snippets and stat
 *     readouts. Never headings or prose (enforced by typography.test.ts).
 *
 * `next/font/local` inlines and serves both from `_next/static` and emits a
 * metrics-matched fallback (size-adjust) so the swap from fallback to web font
 * causes no layout shift — satisfying the "no FOUT-driven layout shift"
 * acceptance criterion. The `.woff2` binaries and their OFL licenses live in
 * `./fonts`.
 *
 * The CSS variables exposed here (`--font-jost`, `--font-mono`) are the only
 * handles the stylesheet uses; the family map in `src/styles/typography.ts`
 * references them by name.
 */

import localFont from "next/font/local";

/**
 * Jost variable, weight axis. The Brand Guide uses 400 (body), 500 (H3, labels,
 * kicker) and 600 (H1/H2, intertitle title); the declared range covers them.
 *
 * The `fallback` stack (the system-ui chain mirrored from globals.css) must be
 * an inline literal — next/font evaluates these options statically at build.
 */
export const jost = localFont({
  src: "./fonts/Jost[wght].woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-jost",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
});

/**
 * JetBrains Mono variable. Not preloaded — it never renders above-the-fold
 * prose, only code/stat readouts, so it must not compete for the critical path.
 */
export const mono = localFont({
  src: "./fonts/JetBrainsMono[wght].woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
  adjustFontFallback: false,
});
