/**
 * Palette design tokens — "the film stock".
 *
 * The single source of truth for every color in the site. The Brand Guide
 * (docs/BRAND_GUIDE.md → Color Palette) is the spec; this module is its
 * machine-readable encoding. The matching CSS custom properties in
 * `src/app/globals.css` are kept in lockstep by a parity test
 * (tokens.test.ts) — never hand-edit hex in one home without the other.
 *
 * Retro saturated bookish: a beloved 1970s hardcover monograph — aged paper
 * ground, burnt-sienna and deep-teal inks, mustard as the rare flourish.
 *
 * No dark mode. One palette is the brand (Brand Guide Hard Rule 4 / PRD
 * Non-Goals). There is deliberately no `dark` variant or theme toggle here.
 */

// --- Primary inks -----------------------------------------------------------

/** Sienna — primary actions, links, chapter accents, frame lines. AA 4.69:1 on Paper. */
const sienna = "#a64826";

/** Teal — secondary actions, supporting accents, focus rings, intertitle plates. 5.90:1 on Paper. */
const teal = "#1f5f5b";

/**
 * Mustard — decorative ONLY: dividers, ornaments, small fills, gold-foil-on-a-spine accents.
 * NEVER use as text on Paper (1.78:1 — fails contrast). Umber text on Mustard passes (7.08:1).
 * If mustard covers more than ~5% of a view, it's too much.
 */
const mustard = "#d9a62e";

/**
 * The palette. Eleven distinct colors; `info` is an intentional alias of
 * `teal` (no separate info blue — discipline over convention), expressed as a
 * reference so the two can never drift.
 */
export const palette = {
  // Primary inks (not floods — the default ground is always Paper)
  sienna,
  teal,
  mustard,

  // Semantic
  /** Success — form success, confirmation. 4.66:1 on Paper. */
  success: "#456f41",
  /** Warning — caution text if ever needed (darkened mustard family). */
  warning: "#8a6a1c",
  /** Error — validation errors, destructive states. 5.48:1 on Paper. */
  error: "#9c3b22",
  /** Info — reuses Teal; there is no separate info blue. */
  info: teal,

  // Neutrals
  /** Paper — the aged-paper page background of every tableau. */
  paper: "#efe5cf",
  /** Plate — cards ("plates"), elevated panels, form fields. */
  plate: "#f7f0de",
  /** Rule — hairline borders, dividers, frame lines (decorative weight). */
  rule: "#d6c7a4",
  /** Umber — all body text. 12.58:1 on Paper. */
  umber: "#2b2118",
  /** Sepia — captions, metadata, supporting text. 5.19:1 on Paper. */
  sepia: "#6a5c47",
} as const;

/** A palette token name (e.g. `"sienna"`, `"paper"`). */
export type PaletteColor = keyof typeof palette;

/** A `#rrggbb` hex string drawn from the palette. */
export type PaletteHex = (typeof palette)[PaletteColor];

/**
 * The CSS custom-property name for each token, e.g. `sienna → "--color-sienna"`.
 * The parity test asserts these declarations in globals.css resolve to the
 * same values as `palette`.
 */
export const paletteCssVars = Object.fromEntries(
  (Object.keys(palette) as PaletteColor[]).map((name) => [
    name,
    `--color-${name}`,
  ]),
) as Record<PaletteColor, `--color-${PaletteColor}`>;
