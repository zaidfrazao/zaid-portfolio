import { describe, expect, it } from "vitest";

import { ROMAN_MAX, ROMAN_MIN, toRoman } from "./numerals";

/**
 * toRoman is a pure formatter for the Brand Guide's Roman-numeral secondary
 * indexing. It must produce classic subtractive numerals across the 1–3999
 * range and reject anything it cannot honestly express.
 */
describe("toRoman — known conversions", () => {
  // Spot values across every digit position, including all subtractive forms.
  const cases: ReadonlyArray<[number, string]> = [
    [1, "I"],
    [3, "III"],
    [4, "IV"],
    [9, "IX"],
    [14, "XIV"],
    [40, "XL"],
    [49, "XLIX"],
    [90, "XC"],
    [400, "CD"],
    [900, "CM"],
    [1984, "MCMLXXXIV"],
    [1994, "MCMXCIV"],
    [2026, "MMXXVI"],
    [3999, "MMMCMXCIX"],
  ];

  it.each(cases)("formats %i as %s", (n, expected) => {
    expect(toRoman(n)).toBe(expected);
  });

  it("formats the range boundaries", () => {
    expect(toRoman(ROMAN_MIN)).toBe("I");
    expect(toRoman(ROMAN_MAX)).toBe("MMMCMXCIX");
  });
});

describe("toRoman — rejects the inexpressible", () => {
  it.each([0, -1, ROMAN_MAX + 1, 10000])(
    "throws for out-of-range %i",
    (n) => {
      expect(() => toRoman(n)).toThrow(RangeError);
    },
  );

  it.each([1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "throws for the non-integer %d",
    (n) => {
      expect(() => toRoman(n)).toThrow(RangeError);
    },
  );
});
