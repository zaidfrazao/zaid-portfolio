import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { palette } from "@/styles/tokens";

import { Label } from "./Label";

/**
 * Label is a polymorphic, prop-transparent leaf carrying the Label register,
 * with an optional bordered chip treatment. Rendered chrome (the chip edge, the
 * exact tracking) is a visual-regression subject — captured in the dev gallery,
 * not asserted here.
 */

describe("Label — element & props", () => {
  it("renders a <span> by default", () => {
    render(<Label data-testid="l">Role</Label>);
    expect(screen.getByTestId("l").tagName).toBe("SPAN");
  });

  it("renders the element named by `as`", () => {
    render(
      <Label as="dt" data-testid="l">
        Role
      </Label>,
    );
    expect(screen.getByTestId("l").tagName).toBe("DT");
  });

  it("carries the Label register class", () => {
    render(<Label data-testid="l">Role</Label>);
    expect(screen.getByTestId("l")).toHaveClass("register-label");
  });

  it("renders its children", () => {
    render(<Label>Founder</Label>);
    expect(screen.getByText("Founder")).toBeInTheDocument();
  });

  it("merges a caller-supplied className without dropping its own", () => {
    render(
      <Label className="extra" data-testid="l">
        Role
      </Label>,
    );
    const el = screen.getByTestId("l");
    expect(el).toHaveClass("extra");
    expect(el).toHaveClass("register-label");
  });

  it("passes native props through (id)", () => {
    render(
      <Label id="role" data-testid="l">
        Role
      </Label>,
    );
    expect(screen.getByTestId("l")).toHaveAttribute("id", "role");
  });

  it("forwards a ref to the rendered element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Label ref={ref} data-testid="l">
        Role
      </Label>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

describe("Label — chip treatment", () => {
  it("is not a chip by default", () => {
    render(<Label data-testid="l">Role</Label>);
    expect(screen.getByTestId("l")).not.toHaveAttribute("data-chip");
  });

  it("marks the chip treatment when requested", () => {
    render(
      <Label chip data-testid="l">
        Role
      </Label>,
    );
    expect(screen.getByTestId("l")).toHaveAttribute("data-chip", "true");
  });
});

// --- Flat-by-decree guard ---------------------------------------------------
//
// Brand Guide Hard Rule: NO drop shadows — layering is color and hairline rules
// only. Assert the stylesheet declares zero box-shadows so a future "subtle
// shadow" edit fails here rather than shipping simulated depth. Comments are
// stripped first so the rule's own documentation is not mistaken for a
// declaration.

describe("Label — flat by decree", () => {
  it("declares no box-shadow in its stylesheet", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/components/Label/Label.module.css"),
      "utf8",
    );
    const declarations = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(declarations).not.toMatch(/box-shadow/i);
  });
});

// --- Contrast guard ---------------------------------------------------------
//
// Recompute WCAG ratios from the real palette tokens (never copied hex), the
// same approach as Button.test.tsx. The label ink on each surface it sits on —
// Paper for a bare label, the Plate fill for a chip — must clear AA, so a token
// tweak that drops it below the line fails here rather than shipping unreadable.

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

describe("Label — ink/surface contrast clears AA", () => {
  // [surface name, label ink, the surface it sits on]
  const pairs: ReadonlyArray<[string, string, string]> = [
    ["bare label on Paper", palette.umber, palette.paper],
    ["chip on Plate fill", palette.umber, palette.plate],
  ];

  it.each(pairs)("%s is ≥ 4.5:1", (_name, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});
