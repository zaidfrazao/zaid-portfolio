/**
 * Spacing & layout primitives — "the stage blocking".
 *
 * The single source of truth for spacing, corners, the proscenium frame line,
 * and the prose measure. The Brand Guide (docs/BRAND_GUIDE.md → Spacing &
 * Layout) is the spec; this module is its machine-readable encoding. The
 * matching CSS custom properties in `src/app/globals.css` are kept in lockstep
 * by a parity test (layout.test.ts) — never change a value in one home without
 * the other.
 *
 * Discipline over convention: the scale is a curated set of 8px multiples, not
 * an exhaustive ramp; corners are sharp (radius 0) everywhere save the rare
 * circular medallion; frames are a deliberate treatment, not a default.
 */

/** The base spacing unit in px. Every step on the scale is a multiple of it. */
export const BASE_UNIT = 8;

/**
 * The 8px spacing scale. Keys are the multiplier (`space[4] === 32` → 4 × 8px),
 * so the name states the grammar. Curated, not exhaustive — the gaps (5, 7, 9…)
 * are deliberate: reach for a documented step, don't invent one. There is no
 * 4px half-step; the grammar stays on the whole 8px grid.
 */
export const space = {
  0: 0,
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  6: 48,
  8: 64,
  12: 96,
  16: 128,
} as const;

/** A spacing step key (e.g. `1`, `4`, `16`). */
export type SpaceStep = keyof typeof space;

/**
 * Corner radius. Two legal values and no third: sharp everywhere (film frames,
 * book plates), a perfect circle for the rare medallion/ornament exception.
 * Consumers reach for `--radius-medallion`, never a bare `50%`.
 */
export const radius = {
  /** Sharp — the global default. Frames, plates, buttons, fields. */
  none: "0",
  /** The one exception: perfect circles for rare medallions/ornaments. */
  medallion: "50%",
} as const;

/**
 * The proscenium frame line: an inset 1.5px hairline drawn Sienna (default) or
 * Rule (the quieter variant), reusing the palette tokens from `tokens.ts`. A
 * deliberate treatment for key tableaux — not applied to every container.
 */
export const frameLine = {
  /** Hairline weight. */
  width: "1.5px",
  /** Default ink — the `sienna` palette token. */
  color: "sienna",
  /** Quieter alternative — the `rule` palette token. */
  altColor: "rule",
} as const;

/** Max content measures. Prose caps at 68ch; tableaux may use full stage width. */
export const measure = {
  /** Reading measure for prose columns. */
  prose: "68ch",
} as const;

/**
 * Convert a px size (base 16) to the rem string used in the stylesheet, so the
 * spacing grid scales with the root font. Zero collapses to unitless `0`.
 */
export const remOf = (px: number): string => (px === 0 ? "0" : `${px / 16}rem`);

/**
 * The CSS custom-property name for each spacing step, e.g. `1 → "--space-1"`.
 * The parity test asserts these declarations in globals.css resolve to the same
 * values (as rem) as `space`.
 */
export const spaceCssVars = Object.fromEntries(
  (Object.keys(space) as unknown as SpaceStep[]).map((step) => [
    step,
    `--space-${step}`,
  ]),
) as Record<SpaceStep, `--space-${SpaceStep}`>;

/**
 * The CSS custom-property name for each scalar layout token. Asserted against
 * globals.css by the parity test alongside the spacing scale.
 */
export const layoutCssVars = {
  radiusNone: "--radius-none",
  radiusMedallion: "--radius-medallion",
  frameLineWidth: "--frame-line-width",
  measureProse: "--measure-prose",
} as const;
