import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

import { copy } from "@/content/copy";
import { toRoman } from "@/lib/numerals";

/**
 * Caption — the Caption register (docs/BRAND_GUIDE.md → Typography, "Caption"):
 * 13px, 400, Sepia. Figure captions and metadata, in the deadpan narrator's
 * voice.
 *
 * With `figure`, it prints the museum-plate convention the Brand Guide fixes —
 * `Fig. 3 — The repricing engine. 200,000 SKUs. Daily.` — composed from the
 * central copy constants (`Fig.` prefix + em-dash separator) so the format is
 * single-sourced. `numeral="roman"` renders the index as a Roman numeral
 * (`Fig. III — …`) for the Brand Guide's film-adjacent secondary indexing.
 *
 * Typography is the global `.register-caption` utility (which fixes the Sepia
 * color); this component never restates size or color. Like Plate it is a
 * non-interactive leaf and stays a Server Component — `ref` forwards as a plain
 * prop and the element is chosen with `as` (default `"p"`; use `"figcaption"`
 * inside a real `<figure>`).
 */

/** The text elements a Caption may render as. */
export type CaptionElement = "p" | "figcaption" | "span" | "div";

/** How the figure index is formatted. */
export type CaptionNumeral = "arabic" | "roman";

interface CaptionOwnProps<E extends CaptionElement> {
  /** Which element to render. Defaults to `"p"`. */
  as?: E;
  /** Figure index; when set, prefixes the `Fig. N —` museum-plate label. */
  figure?: number;
  /** Figure index style. Defaults to `"arabic"`. */
  numeral?: CaptionNumeral;
  children?: ReactNode;
}

/** Own props plus the native props of the chosen element (own props win). */
export type CaptionProps<E extends CaptionElement = "p"> = CaptionOwnProps<E> &
  Omit<ComponentPropsWithRef<E>, keyof CaptionOwnProps<E>>;

export function Caption<E extends CaptionElement = "p">({
  as,
  figure,
  numeral = "arabic",
  className,
  children,
  ...rest
}: CaptionProps<E>) {
  const Tag = (as ?? "p") as ElementType;

  const classes = ["register-caption", className].filter(Boolean).join(" ");

  const hasFigure = figure !== undefined;
  // "Fig. 3 — " — index in the chosen numeral, then the em-dash, then the body.
  const prefix = hasFigure
    ? `${copy.figure.prefix} ${
        numeral === "roman" ? toRoman(figure) : figure
      } ${copy.figure.separator} `
    : null;

  return (
    <Tag {...rest} className={classes} data-figure={hasFigure ? figure : undefined}>
      {prefix}
      {children}
    </Tag>
  );
}
