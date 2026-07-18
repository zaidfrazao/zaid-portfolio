import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { palette, paletteCssVars, type PaletteColor } from "./tokens";

/**
 * The Brand Guide is the spec (docs/BRAND_GUIDE.md → Color Palette). These
 * expectations are transcribed straight from it; if the guide changes, this
 * test is where the change is ratified.
 */
const BRAND_GUIDE_HEX: Record<PaletteColor, string> = {
  sienna: "#a64826",
  teal: "#1f5f5b",
  mustard: "#d9a62e",
  success: "#456f41",
  warning: "#8a6a1c",
  error: "#9c3b22",
  info: "#1f5f5b", // reuses Teal
  paper: "#efe5cf",
  plate: "#f7f0de",
  rule: "#d6c7a4",
  umber: "#2b2118",
  sepia: "#6a5c47",
};

// Vitest runs from the repo root; resolve globals.css against it.
const globalsCss = readFileSync(
  resolve(process.cwd(), "src/app/globals.css"),
  "utf8",
);

describe("palette tokens", () => {
  it("exposes exactly the 11 documented named colors (info aliases teal)", () => {
    expect(Object.keys(palette).sort()).toEqual(
      Object.keys(BRAND_GUIDE_HEX).sort(),
    );
  });

  it("every value is a normalized lowercase #rrggbb hex", () => {
    for (const [name, value] of Object.entries(palette)) {
      expect(value, name).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("matches the Brand Guide hex for every color", () => {
    expect(palette).toEqual(BRAND_GUIDE_HEX);
  });

  it("aliases Info to Teal rather than duplicating the hex", () => {
    expect(palette.info).toBe(palette.teal);
  });
});

describe("CSS ↔ TS parity (globals.css)", () => {
  /** Extract every `--color-<name>: <value>;` declaration from globals.css. */
  const declarations = new Map<string, string>();
  const declRe = /(--color-[a-z]+)\s*:\s*([^;]+);/g;
  for (let m = declRe.exec(globalsCss); m !== null; m = declRe.exec(globalsCss)) {
    declarations.set(m[1], m[2].trim());
  }

  it("declares every palette token as a --color-* custom property", () => {
    for (const name of Object.keys(palette) as PaletteColor[]) {
      expect(declarations.has(paletteCssVars[name]), name).toBe(true);
    }
  });

  it("keeps hex custom properties equal to the palette (no drift)", () => {
    for (const name of Object.keys(palette) as PaletteColor[]) {
      // Info is expressed as a var() alias in CSS, asserted separately.
      if (name === "info") continue;
      expect(declarations.get(paletteCssVars[name]), name).toBe(palette[name]);
    }
  });

  it("expresses --color-info as a var() alias of teal, not a copied hex", () => {
    expect(declarations.get("--color-info")).toBe("var(--color-teal)");
  });
});
