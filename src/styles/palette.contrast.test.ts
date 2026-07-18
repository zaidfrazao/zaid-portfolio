import { describe, expect, it } from "vitest";

import { palette, type PaletteColor } from "./tokens";

/**
 * Contrast-ratio guard for the palette.
 *
 * The Brand Guide (docs/BRAND_GUIDE.md → Color Palette / Accessibility) documents
 * a WCAG contrast ratio for every text-bearing color on Paper. This test recomputes
 * those ratios from the *real* palette tokens — never copied hex — so a palette
 * tweak that quietly drops a combination below AA (4.5:1) fails CI here.
 *
 * This is the automated half of the accessibility check; axe verifies rendered
 * output later (Phase 5).
 */

// --- Minimal WCAG 2.1 math (no dependency needed) ---------------------------

/** Parse `#rrggbb` into 0–255 channels. */
function channels(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) throw new Error(`not a #rrggbb hex: ${hex}`);
  return [
    parseInt(m[1], 16),
    parseInt(m[2], 16),
    parseInt(m[3], 16),
  ];
}

/** sRGB → linear light for one channel. */
function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of a `#rrggbb` color. */
function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG contrast ratio between two `#rrggbb` colors (order-independent). */
function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Round to the 2 decimals the Brand Guide publishes its ratios at. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Minimum contrast for normal-size text under WCAG 2.1 AA. */
const AA_TEXT = 4.5;

/**
 * The tokens the Brand Guide *verifies* as text (foreground) on Paper — every
 * one carries a documented AA ratio in the palette table. Two tokens are
 * deliberately absent:
 *  - `mustard` — decorative-only by rule (1.78:1); never text on Paper.
 *  - `warning` — the guide qualifies it "if ever needed" and publishes no ratio;
 *    it computes to 4.03:1, below AA for normal text. See the guard below.
 */
const TEXT_TOKENS = [
  "umber", // body text
  "sepia", // captions, metadata, secondary text
  "sienna", // links, primary action labels
  "teal", // secondary action labels, focus
  "success", // form success text
  "error", // validation / destructive text
] satisfies PaletteColor[];

// --- Sanity-check the math against a known WCAG pair -------------------------

describe("contrastRatio helper", () => {
  it("returns 21:1 for pure black on white", () => {
    expect(round2(contrastRatio("#000000", "#ffffff"))).toBe(21);
  });

  it("returns 1:1 for a color against itself", () => {
    expect(contrastRatio(palette.paper, palette.paper)).toBe(1);
  });

  it("is order-independent (foreground/background swap)", () => {
    expect(contrastRatio(palette.umber, palette.paper)).toBe(
      contrastRatio(palette.paper, palette.umber),
    );
  });
});

// --- The Brand Guide contrast table, computed from real tokens --------------

describe("Brand Guide contrast ratios", () => {
  const documented: ReadonlyArray<[PaletteColor, PaletteColor, number]> = [
    ["umber", "paper", 12.58],
    ["sienna", "paper", 4.69],
    ["teal", "paper", 5.9],
    ["sepia", "paper", 5.19],
    ["success", "paper", 4.66],
    ["error", "paper", 5.48],
    ["umber", "mustard", 7.08],
  ];

  it.each(documented)(
    "%s on %s computes to the documented %f:1",
    (fg, bg, ratio) => {
      expect(round2(contrastRatio(palette[fg], palette[bg]))).toBe(ratio);
    },
  );
});

// --- Mustard is decorative-only ---------------------------------------------

describe("Mustard is decorative-only", () => {
  it("fails AA on Paper (documented 1.78:1)", () => {
    expect(round2(contrastRatio(palette.mustard, palette.paper))).toBe(1.78);
    expect(contrastRatio(palette.mustard, palette.paper)).toBeLessThan(AA_TEXT);
  });

  it("is never listed as a text token (no Mustard-on-Paper text)", () => {
    expect(TEXT_TOKENS).not.toContain("mustard");
  });
});

// --- Warning is not an AA body-text color on Paper --------------------------

describe("Warning is not verified body text on Paper", () => {
  // The Brand Guide publishes no ratio for Warning and qualifies it "if ever
  // needed". It computes to 4.03:1 — below AA for normal text — so it is kept
  // out of the verified text set. This assertion pins that real value so a
  // future palette tweak that pushes it across 4.5:1 (making it a legitimate
  // text color) is a deliberate, visible change rather than a silent drift.
  it("computes below AA on Paper (4.03:1)", () => {
    expect(round2(contrastRatio(palette.warning, palette.paper))).toBe(4.03);
    expect(contrastRatio(palette.warning, palette.paper)).toBeLessThan(AA_TEXT);
  });

  it("is not listed among the verified text tokens", () => {
    expect(TEXT_TOKENS).not.toContain("warning");
  });
});

// --- Every text combination clears AA ---------------------------------------

describe("all text tokens clear AA on Paper", () => {
  it.each(TEXT_TOKENS)("%s on Paper is ≥ 4.5:1", (token) => {
    expect(contrastRatio(palette[token], palette.paper)).toBeGreaterThanOrEqual(
      AA_TEXT,
    );
  });
});
