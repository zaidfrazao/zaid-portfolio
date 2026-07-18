/**
 * Numeral formatting helpers — "the secondary indexing".
 *
 * The Brand Guide (docs/BRAND_GUIDE.md → Navigation) stages in-chapter controls
 * as "film-adjacent indexing (Roman numerals, 'Fig.' numbering) without film
 * references." This module is the Roman-numeral half: a pure, side-effect-free
 * formatter used by the Caption figure convention and available anywhere a
 * secondary index needs Roman numerals.
 */

/**
 * Subtractive Roman numeral pairs, largest value first. Each includes its
 * subtractive form (CM, CD, XC, XL, IX, IV) so the greedy pass below never has
 * to special-case them.
 */
const ROMAN: ReadonlyArray<readonly [number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** The inclusive range classic Roman numerals can express without a vinculum. */
export const ROMAN_MIN = 1;
export const ROMAN_MAX = 3999;

/**
 * Format a positive integer as a classic (subtractive) Roman numeral.
 *
 * Range is 1–3999 — the span expressible without an overbar. Anything outside
 * that, or a non-integer, throws rather than silently producing nonsense, so a
 * bad figure index fails loudly at the call site.
 *
 * @example toRoman(4)    // "IV"
 * @example toRoman(1994) // "MCMXCIV"
 */
export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < ROMAN_MIN || n > ROMAN_MAX) {
    throw new RangeError(
      `toRoman expects an integer in ${ROMAN_MIN}–${ROMAN_MAX}, received ${n}`,
    );
  }

  let remaining = n;
  let out = "";
  for (const [value, symbol] of ROMAN) {
    while (remaining >= value) {
      out += symbol;
      remaining -= value;
    }
  }
  return out;
}
