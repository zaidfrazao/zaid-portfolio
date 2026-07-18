import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

import styles from "./Plate.module.css";

/**
 * Plate — the "plate" surface primitive (docs/BRAND_GUIDE.md → Cards &
 * Containers). A flat panel of Plate fill sitting on the Paper ground; layering
 * is expressed by color and hairline rules, never by depth. Hard rules honored:
 * flat (NO box-shadow — asserted in Plate.test.tsx), sharp corners (global
 * radius 0), no transform.
 *
 * Unlike the interactive Button leaf, Plate is a structural container and stays
 * a Server Component (no `"use client"`): under React 19 `ref` is a plain prop,
 * so it forwards without `forwardRef`, and the element type is chosen with `as`.
 *
 * Border treatments (Brand Guide: "1px Rule hairline, or the 1.5px frame-line"):
 * - `none`  — a bare plate, layered on Paper by fill alone (default)
 * - `rule`  — a 1px Rule hairline border
 * - `frame` — the featured 1.5px frame line (Sienna, or Rule via `frameColor`)
 *
 * `empty` swaps the body for a static empty-plate placeholder (a few hairline
 * rules) and marks the plate `aria-busy` — the loading state per Brand Guide
 * Feedback Patterns: no skeleton shimmer, no motion.
 */

/** The container elements a Plate may render as. */
export type PlateElement = "div" | "section" | "article" | "aside";

/** Border treatment: bare, 1px Rule hairline, or the 1.5px frame line. */
export type PlateBorder = "none" | "rule" | "frame";

/** Frame-line ink — only meaningful when `border="frame"`. */
export type PlateFrameColor = "sienna" | "rule";

interface PlateOwnProps<E extends PlateElement> {
  /** Which container element to render. Defaults to `"div"`. */
  as?: E;
  /** Border treatment. Defaults to `"none"`. */
  border?: PlateBorder;
  /** Frame-line ink for `border="frame"`. Defaults to `"sienna"`. */
  frameColor?: PlateFrameColor;
  /** When set, render the static empty-plate loading placeholder. */
  empty?: boolean;
  children?: ReactNode;
}

/** Own props plus the native props of the chosen element (own props win). */
export type PlateProps<E extends PlateElement = "div"> = PlateOwnProps<E> &
  Omit<ComponentPropsWithRef<E>, keyof PlateOwnProps<E>>;

export function Plate<E extends PlateElement = "div">({
  as,
  border = "none",
  frameColor = "sienna",
  empty = false,
  className,
  children,
  ...rest
}: PlateProps<E>) {
  const Tag = (as ?? "div") as ElementType;

  const classes = [
    styles.plate,
    border === "rule" && styles.rule,
    border === "frame" && styles.frame,
    border === "frame" && frameColor === "rule" && styles.frameRule,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      {...rest}
      className={classes}
      data-border={border}
      // Recorded so the frame ink is selectable/inspectable; only set on frames.
      data-frame-color={border === "frame" ? frameColor : undefined}
      aria-busy={empty ? true : undefined}
    >
      {empty ? (
        <span className={styles.placeholder} aria-hidden="true">
          <span className={styles.placeholderRule} />
          <span className={styles.placeholderRule} />
          <span className={styles.placeholderRule} />
        </span>
      ) : (
        children
      )}
    </Tag>
  );
}
