import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  BASE_UNIT,
  frameLine,
  layoutCssVars,
  measure,
  radius,
  remOf,
  space,
  spaceCssVars,
  type SpaceStep,
} from "./layout";

/**
 * The Brand Guide fixes the base unit (8px), the sharp/circle corner rule, the
 * 1.5px Sienna/Rule frame line, and the 68ch prose measure (docs/BRAND_GUIDE.md
 * → Spacing & Layout). The Guide does not enumerate the scale *steps* — that
 * curated set is ratified here: this test is where a change to the scale is
 * agreed before the token module and stylesheet may follow.
 */
const RATIFIED_SCALE: Record<SpaceStep, number> = {
  0: 0,
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  6: 48,
  8: 64,
  12: 96,
  16: 128,
};

// Vitest runs from the repo root; resolve globals.css against it. Comments are
// stripped so assertions test the actual declarations, not the prose in
// comments (which mentions "8px", "1.5px", "68ch" as documentation).
const globalsCss = readFileSync(
  resolve(process.cwd(), "src/app/globals.css"),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "");

/** Every `--custom-prop: value;` declaration in the (comment-stripped) stylesheet. */
const declarations = new Map<string, string>();
const declRe = /(--[a-z0-9-]+)\s*:\s*([^;]+);/g;
for (let m = declRe.exec(globalsCss); m !== null; m = declRe.exec(globalsCss)) {
  declarations.set(m[1], m[2].trim());
}

describe("spacing scale", () => {
  it("is the curated set of 8px multiples, ratified here", () => {
    expect(space).toEqual(RATIFIED_SCALE);
  });

  it("keeps every step on the 8px grid (no half-steps)", () => {
    expect(BASE_UNIT).toBe(8);
    for (const [step, px] of Object.entries(space)) {
      // The step key is the multiplier: space[4] === 4 × 8px.
      expect(px, `step ${step}`).toBe(Number(step) * BASE_UNIT);
      expect(px % BASE_UNIT, `step ${step} on grid`).toBe(0);
    }
  });
});

describe("corners", () => {
  it("offers exactly sharp (0) and the medallion circle exception", () => {
    expect(radius).toEqual({ none: "0", medallion: "50%" });
  });
});

describe("frame line & measure", () => {
  it("draws a 1.5px hairline in Sienna, with Rule as the alternate", () => {
    expect(frameLine.width).toBe("1.5px");
    expect(frameLine.color).toBe("sienna");
    expect(frameLine.altColor).toBe("rule");
  });

  it("caps prose at the 68ch reading measure", () => {
    expect(measure.prose).toBe("68ch");
  });
});

describe("remOf", () => {
  it("converts px (base 16) to rem, collapsing zero to unitless", () => {
    expect(remOf(0)).toBe("0");
    expect(remOf(8)).toBe("0.5rem");
    expect(remOf(32)).toBe("2rem");
  });
});

describe("CSS ↔ TS parity (globals.css)", () => {
  it("declares every spacing step as a --space-* custom property in rem", () => {
    for (const step of Object.keys(space) as unknown as SpaceStep[]) {
      const name = spaceCssVars[step];
      expect(declarations.has(name), name).toBe(true);
      expect(declarations.get(name), name).toBe(remOf(space[step]));
    }
  });

  it("declares the radius, frame-line, and measure scalars to match the module", () => {
    expect(declarations.get(layoutCssVars.radiusNone)).toBe(radius.none);
    expect(declarations.get(layoutCssVars.radiusMedallion)).toBe(
      radius.medallion,
    );
    expect(declarations.get(layoutCssVars.frameLineWidth)).toBe(frameLine.width);
    expect(declarations.get(layoutCssVars.measureProse)).toBe(measure.prose);
  });

  it("enforces global radius 0 on the universal reset", () => {
    expect(globalsCss).toMatch(
      /\*::after\s*\{[^}]*border-radius:\s*var\(--radius-none\)/,
    );
  });

  it("builds the frame-line treatment on the tokens (Sienna default, Rule alt)", () => {
    expect(globalsCss).toMatch(/\.frame-line\s*\{[^}]*var\(--frame-line-width\)/);
    expect(globalsCss).toMatch(/\.frame-line\s*\{[^}]*var\(--color-sienna\)/);
    expect(globalsCss).toMatch(
      /\.frame-line--rule\s*\{[^}]*var\(--color-rule\)/,
    );
  });

  it("centers the prose measure helper on the vertical axis", () => {
    expect(globalsCss).toMatch(
      /\.measure-prose\s*\{[^}]*max-width:\s*var\(--measure-prose\)/,
    );
    expect(globalsCss).toMatch(/\.measure-prose\s*\{[^}]*margin-inline:\s*auto/);
  });
});
