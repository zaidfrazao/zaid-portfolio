import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Plate } from "./Plate";

/**
 * Plate is a polymorphic, prop-transparent surface primitive: it renders the
 * chosen element with the Plate fill, carries a border treatment (none / 1px
 * Rule / 1.5px frame line), and swaps to a static empty-plate placeholder while
 * loading. Rendered chrome (exact fills, the frame ink, the placeholder rules)
 * is a visual-regression subject — captured in the dev gallery + e2e, not here.
 */

describe("Plate — element & props", () => {
  it("renders a <div> by default", () => {
    render(<Plate data-testid="p">body</Plate>);
    expect(screen.getByTestId("p").tagName).toBe("DIV");
  });

  it("renders the element named by `as`", () => {
    render(
      <Plate as="section" data-testid="p">
        body
      </Plate>,
    );
    expect(screen.getByTestId("p").tagName).toBe("SECTION");
  });

  it("carries the base plate class", () => {
    render(<Plate data-testid="p">body</Plate>);
    // CSS-module hashed class — assert the local name is present as a substring.
    expect(screen.getByTestId("p").className).toMatch(/plate/);
  });

  it("merges a caller-supplied className without dropping its own", () => {
    render(
      <Plate className="extra" data-testid="p">
        body
      </Plate>,
    );
    const el = screen.getByTestId("p");
    expect(el).toHaveClass("extra");
    expect(el.className).toMatch(/plate/);
  });

  it("passes native props through (id)", () => {
    render(
      <Plate id="masthead" data-testid="p">
        body
      </Plate>,
    );
    expect(screen.getByTestId("p")).toHaveAttribute("id", "masthead");
  });

  it("forwards a ref to the rendered element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Plate ref={ref} data-testid="p">
        body
      </Plate>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders its children when not empty", () => {
    render(<Plate>visible content</Plate>);
    expect(screen.getByText("visible content")).toBeInTheDocument();
  });
});

describe("Plate — border treatment", () => {
  it("defaults to a borderless plate", () => {
    render(<Plate data-testid="p">body</Plate>);
    expect(screen.getByTestId("p")).toHaveAttribute("data-border", "none");
  });

  it("marks the 1px Rule hairline border", () => {
    render(
      <Plate border="rule" data-testid="p">
        body
      </Plate>,
    );
    expect(screen.getByTestId("p")).toHaveAttribute("data-border", "rule");
  });

  it("marks the 1.5px frame-line treatment", () => {
    render(
      <Plate border="frame" data-testid="p">
        body
      </Plate>,
    );
    expect(screen.getByTestId("p")).toHaveAttribute("data-border", "frame");
  });

  it("records the frame ink so the Rule variant is selectable", () => {
    render(
      <Plate border="frame" frameColor="rule" data-testid="p">
        body
      </Plate>,
    );
    expect(screen.getByTestId("p")).toHaveAttribute("data-frame-color", "rule");
  });
});

describe("Plate — empty (loading) state", () => {
  it("marks itself busy for assistive tech", () => {
    render(
      <Plate empty data-testid="p">
        should be hidden
      </Plate>,
    );
    expect(screen.getByTestId("p")).toHaveAttribute("aria-busy", "true");
  });

  it("suppresses children while empty", () => {
    render(
      <Plate empty>
        <span>should be hidden</span>
      </Plate>,
    );
    expect(screen.queryByText("should be hidden")).not.toBeInTheDocument();
  });

  it("does not report busy when populated", () => {
    render(<Plate data-testid="p">body</Plate>);
    expect(screen.getByTestId("p")).not.toHaveAttribute("aria-busy");
  });
});

// --- Flat-by-decree guard ---------------------------------------------------
//
// Brand Guide Hard Rule: NO drop shadows anywhere — planimetric layering is
// expressed by color and hairline rules only. Assert the component's own
// stylesheet declares zero box-shadows, so a future "just a subtle shadow" edit
// fails here rather than shipping simulated depth. Reads the raw source (CSS
// modules resolve to a class-name map at import, not the declarations).

describe("Plate — flat by decree", () => {
  it("declares no box-shadow in its stylesheet", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/components/Plate/Plate.module.css"),
      "utf8",
    );
    // Strip /* … */ comments first — we guard against a real declaration, not a
    // mention of the rule in the file's own documentation.
    const declarations = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(declarations).not.toMatch(/box-shadow/i);
  });
});
