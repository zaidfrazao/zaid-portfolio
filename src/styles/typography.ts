/**
 * Typography design tokens — "the title cards".
 *
 * The single source of truth for every type register on the site. The Brand
 * Guide (docs/BRAND_GUIDE.md → Typography → Registers & Scale) is the spec;
 * this module is its machine-readable encoding. The matching utility classes in
 * `src/app/globals.css` are kept in lockstep by a parity test
 * (typography.test.ts) — never change a size or weight in one home without the
 * other.
 *
 * One geometric sans (Jost) across the whole site, differentiated only by
 * weight, tracking, and case — one voice, many registers. JetBrains Mono is
 * NOT a register here: it is a functional exception (code / stat readouts),
 * exposed via `fontFamily.mono` and the `.register-stat` utility, never used
 * for headings or prose. `registers.*.family` is asserted to stay `"sans"` for
 * exactly this reason.
 *
 * Sizes are px at the 16px base, given per breakpoint (desktop / mobile). The
 * stylesheet is authored mobile-first: the `mobile` size is the base rule and
 * the `desktop` size lives in a `@media (min-width: 768px)` block — the 768px
 * line cleanly separates the Playwright 360px (mobile) and 1440px (desktop)
 * visual-regression viewports.
 */

/** The two font families, referenced by the CSS variables from `app/fonts.ts`. */
export const fontFamily = {
  /** Jost — display and body; the whole site's voice. */
  sans: "var(--font-jost)",
  /** JetBrains Mono — code and stat readouts only. Never headings or prose. */
  mono: "var(--font-mono)",
} as const;

/** A single type register, transcribed from the Brand Guide table. */
export interface Register {
  /** Font size in px (base 16) at the desktop breakpoint (≥768px). */
  desktop: number;
  /** Font size in px (base 16) at the mobile breakpoint (<768px). */
  mobile: number;
  /** Font weight — the site uses only 400 / 500 / 600. */
  weight: 400 | 500 | 600;
  /** Letter-spacing in em, or null when default (0). */
  tracking: number | null;
  /** Letter case treatment. */
  transform: "uppercase" | "none";
  /** Line height (unitless), or null to inherit the sensible default. */
  lineHeight: number | null;
  /** Text alignment for staged elements, or null for the reading default. */
  align: "center" | null;
  /** Max measure (e.g. "68ch") for prose, or null. */
  maxWidth: string | null;
  /** Palette color token when the register fixes one (captions), else null. */
  color: "sepia" | null;
  /** Family — every register is the sans; mono is never a register (see above). */
  family: keyof typeof fontFamily;
}

/**
 * The eight registers. Keys are the machine names; the CSS class for each is in
 * `registerClass` below (e.g. `intertitleKicker → .register-kicker`).
 */
export const registers = {
  /** "CHAPTER TWO" kicker line on chapter cards. */
  intertitleKicker: {
    desktop: 12,
    mobile: 12,
    weight: 500,
    tracking: 0.35,
    transform: "uppercase",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: null,
    family: "sans",
  },
  /** Chapter names on intertitle plates — centered, all caps. */
  intertitleTitle: {
    desktop: 40,
    mobile: 28,
    weight: 600,
    tracking: 0.12,
    transform: "uppercase",
    lineHeight: null,
    align: "center",
    maxWidth: null,
    color: null,
    family: "sans",
  },
  /** Page / chapter titles in content. */
  h1: {
    desktop: 44,
    mobile: 32,
    weight: 600,
    tracking: -0.01,
    transform: "none",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: null,
    family: "sans",
  },
  /** Section headers. */
  h2: {
    desktop: 28,
    mobile: 24,
    weight: 600,
    tracking: null,
    transform: "none",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: null,
    family: "sans",
  },
  /** Subsections, card titles. */
  h3: {
    desktop: 20,
    mobile: 18,
    weight: 500,
    tracking: null,
    transform: "none",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: null,
    family: "sans",
  },
  /** Prose — bio, case studies. The reading register. */
  body: {
    desktop: 17,
    mobile: 16,
    weight: 400,
    tracking: null,
    transform: "none",
    lineHeight: 1.65,
    align: null,
    maxWidth: "68ch",
    color: null,
    family: "sans",
  },
  /** Buttons, nav, figure labels, chips — all caps, letterspaced. */
  label: {
    desktop: 11,
    mobile: 11,
    weight: 500,
    tracking: 0.22,
    transform: "uppercase",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: null,
    family: "sans",
  },
  /** Figure captions, metadata — Sepia. */
  caption: {
    desktop: 13,
    mobile: 13,
    weight: 400,
    tracking: null,
    transform: "none",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: "sepia",
    family: "sans",
  },
} as const satisfies Record<string, Register>;

/** A register name (e.g. `"h1"`, `"intertitleKicker"`). */
export type RegisterName = keyof typeof registers;

/**
 * The CSS utility class for each register. The parity test asserts the matching
 * rule exists in globals.css and carries the spec's sizes and weight.
 */
export const registerClass = {
  intertitleKicker: "register-kicker",
  intertitleTitle: "register-intertitle",
  h1: "register-h1",
  h2: "register-h2",
  h3: "register-h3",
  body: "register-body",
  label: "register-label",
  caption: "register-caption",
} as const satisfies Record<RegisterName, string>;

/** Convert a px size (base 16) to the rem string used in the stylesheet. */
export const remOf = (px: number): string => `${px / 16}rem`;
