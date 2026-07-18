"use client";

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type Ref,
} from "react";

import styles from "./Button.module.css";

/**
 * Button — the four Brand Guide variants (docs/BRAND_GUIDE.md → Component
 * Patterns → Buttons).
 *
 * Polymorphic by intent: pass `href` and it renders a real `<a>` (for the
 * link-like tertiary/ghost action and nav); omit it and it renders a `<button>`
 * that defaults `type` to `"button"` (so it never accidentally submits a form).
 * All other native props — `onClick`, `disabled`, `aria-*`, `data-*` — pass
 * straight through, and `ref` forwards to whichever element is rendered.
 *
 * Typography comes from the global `.register-label` utility (single-sourced in
 * src/styles/typography.ts); chrome and states live in Button.module.css.
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive";

interface ButtonOwnProps {
  /** Which Brand Guide variant to render. Defaults to `"primary"`. */
  variant?: ButtonVariant;
}

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type NativeAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Discriminated on `href`: with it, the anchor props apply and `href` is
 * required; without it, the button props apply.
 */
export type ButtonProps =
  | (ButtonOwnProps & NativeButtonProps & { href?: undefined })
  | (ButtonOwnProps & NativeAnchorProps & { href: string });

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const { variant = "primary", className, ...rest } = props;
  const classes = [styles.button, styles[variant], "register-label", className]
    .filter(Boolean)
    .join(" ");

  // `href` present → anchor. The cast drops the discriminant from the spread's
  // view; className/ref/data-variant are set after the spread so they win.
  if (props.href !== undefined) {
    const anchorProps = rest as NativeAnchorProps;
    return (
      <a
        {...anchorProps}
        ref={ref as Ref<HTMLAnchorElement>}
        className={classes}
        data-variant={variant}
      />
    );
  }

  const buttonProps = rest as NativeButtonProps;
  return (
    <button
      {...buttonProps}
      ref={ref as Ref<HTMLButtonElement>}
      type={buttonProps.type ?? "button"}
      className={classes}
      data-variant={variant}
    />
  );
});

Button.displayName = "Button";
