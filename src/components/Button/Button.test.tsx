import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { palette } from "@/styles/tokens";

import { Button, type ButtonVariant } from "./Button";

/**
 * Button behaves as a polymorphic, prop-transparent control (renders <button>
 * or <a>), carries the Label register, and every fill/label pair clears WCAG AA.
 * Rendered chrome (exact colors, focus ring, hover timing) is a visual-regression
 * subject — captured in e2e/buttons.spec.ts, not asserted here.
 */

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "tertiary",
  "destructive",
];

describe("Button — element & props", () => {
  it("renders a <button> by default with type='button'", () => {
    render(<Button>Save</Button>);
    const el = screen.getByRole("button", { name: "Save" });
    expect(el.tagName).toBe("BUTTON");
    expect(el).toHaveAttribute("type", "button");
  });

  it("does not override an explicit type", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("renders an <a> when given href", () => {
    render(<Button href="/resume.pdf">Résumé</Button>);
    const el = screen.getByRole("link", { name: "Résumé" });
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "/resume.pdf");
    // No stray button type leaks onto the anchor.
    expect(el).not.toHaveAttribute("type");
  });

  it("defaults to the primary variant", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "primary");
  });

  it.each(VARIANTS)("marks the %s variant on the element", (variant) => {
    render(<Button variant={variant}>{variant}</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", variant);
  });

  it("carries the Label register class", () => {
    render(<Button>Label</Button>);
    expect(screen.getByRole("button")).toHaveClass("register-label");
  });

  it("merges a caller-supplied className without dropping its own", () => {
    render(<Button className="extra">X</Button>);
    const el = screen.getByRole("button");
    expect(el).toHaveClass("extra");
    expect(el).toHaveClass("register-label");
  });

  it("passes native props through (disabled)", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Tap</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Tap" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("forwards a ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("forwards a ref to the anchor element", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Button ref={ref} href="/x">
        Ref
      </Button>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});

// --- Contrast guard ---------------------------------------------------------
//
// Recompute WCAG ratios from the *real* palette tokens (never copied hex), the
// same approach as palette.contrast.test.ts. Each variant's label-on-fill pair
// must clear AA (4.5:1), so a future token tweak that drops one below the line
// fails here rather than shipping an unreadable button.

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) throw new Error(`not a #rrggbb hex: ${hex}`);
  const [r, g, b] = [1, 2, 3].map((i) => parseInt(m[i], 16));
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const AA_TEXT = 4.5;

describe("Button — label/fill contrast clears AA", () => {
  // [variant, label color, the surface it sits on]
  const pairs: ReadonlyArray<[ButtonVariant, string, string]> = [
    ["primary", palette.paper, palette.sienna],
    ["secondary", palette.teal, palette.paper], // outline variant sits on Paper
    ["tertiary", palette.umber, palette.paper],
    ["destructive", palette.paper, palette.error],
  ];

  it.each(pairs)("%s label on its surface is ≥ 4.5:1", (_variant, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});
