import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

import styles from "./Label.module.css";

/**
 * Label — the Label register as a component (docs/BRAND_GUIDE.md → Typography,
 * "Label"): 11px, 500, ALL CAPS, 0.22em tracking. The deadpan staging voice for
 * figure labels, nav, metadata keys, and register chips.
 *
 * Typography is single-sourced through the global `.register-label` utility
 * (src/styles/typography.ts) — this component never restates the size or
 * tracking, it only applies the class and, optionally, chip chrome.
 *
 * Like Plate, Label is a structural leaf with no interactivity, so it stays a
 * Server Component: under React 19 `ref` is a plain prop and forwards without
 * `forwardRef`, and the element is chosen with `as`.
 *
 * `chip` wraps the label in a bordered chip — a 1px Rule hairline on the Plate
 * fill, flat and sharp-cornered (Brand Guide Hard Rules) — for the register
 * chips the Label row calls out. Bare (default) it is inline text.
 */

/** The inline/label elements a Label may render as. */
export type LabelElement = "span" | "p" | "div" | "dt" | "figcaption";

interface LabelOwnProps<E extends LabelElement> {
  /** Which element to render. Defaults to `"span"`. */
  as?: E;
  /** Render as a bordered register chip rather than bare label text. */
  chip?: boolean;
  children?: ReactNode;
}

/** Own props plus the native props of the chosen element (own props win). */
export type LabelProps<E extends LabelElement = "span"> = LabelOwnProps<E> &
  Omit<ComponentPropsWithRef<E>, keyof LabelOwnProps<E>>;

export function Label<E extends LabelElement = "span">({
  as,
  chip = false,
  className,
  children,
  ...rest
}: LabelProps<E>) {
  const Tag = (as ?? "span") as ElementType;

  const classes = [
    "register-label",
    styles.label,
    chip && styles.chip,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag {...rest} className={classes} data-chip={chip ? true : undefined}>
      {children}
    </Tag>
  );
}
