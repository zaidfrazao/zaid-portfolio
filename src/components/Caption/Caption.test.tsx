import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { copy } from "@/content/copy";

import { Caption } from "./Caption";

/**
 * Caption is a polymorphic, prop-transparent leaf carrying the Caption register
 * (Sepia is fixed by the register class, verified in palette.contrast.test.ts).
 * Its own concern is the museum-plate figure convention: the `Fig. N —` prefix,
 * in Arabic or Roman numerals, composed from the central copy constants.
 */

describe("Caption — element & props", () => {
  it("renders a <p> by default", () => {
    render(<Caption data-testid="c">Metadata</Caption>);
    expect(screen.getByTestId("c").tagName).toBe("P");
  });

  it("renders the element named by `as` (figcaption inside a figure)", () => {
    render(
      <Caption as="figcaption" data-testid="c">
        Metadata
      </Caption>,
    );
    expect(screen.getByTestId("c").tagName).toBe("FIGCAPTION");
  });

  it("carries the Caption register class", () => {
    render(<Caption data-testid="c">Metadata</Caption>);
    expect(screen.getByTestId("c")).toHaveClass("register-caption");
  });

  it("merges a caller-supplied className without dropping its own", () => {
    render(
      <Caption className="extra" data-testid="c">
        Metadata
      </Caption>,
    );
    const el = screen.getByTestId("c");
    expect(el).toHaveClass("extra");
    expect(el).toHaveClass("register-caption");
  });

  it("passes native props through (id)", () => {
    render(
      <Caption id="cap" data-testid="c">
        Metadata
      </Caption>,
    );
    expect(screen.getByTestId("c")).toHaveAttribute("id", "cap");
  });

  it("forwards a ref to the rendered element", () => {
    const ref = createRef<HTMLParagraphElement>();
    render(
      <Caption ref={ref} data-testid="c">
        Metadata
      </Caption>,
    );
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe("Caption — plain (no figure)", () => {
  it("renders only its body, with no figure prefix or marker", () => {
    render(<Caption data-testid="c">Just metadata</Caption>);
    const el = screen.getByTestId("c");
    expect(el).toHaveTextContent("Just metadata");
    expect(el.textContent).not.toContain(copy.figure.prefix);
    expect(el).not.toHaveAttribute("data-figure");
  });
});

describe("Caption — figure convention", () => {
  it("prefixes the museum-plate Fig. label in Arabic by default", () => {
    render(
      <Caption figure={3} data-testid="c">
        The repricing engine. 200,000 SKUs. Daily.
      </Caption>,
    );
    const el = screen.getByTestId("c");
    expect(el).toHaveTextContent(
      "Fig. 3 — The repricing engine. 200,000 SKUs. Daily.",
    );
    expect(el).toHaveAttribute("data-figure", "3");
  });

  it("renders the index as a Roman numeral when asked", () => {
    render(
      <Caption figure={3} numeral="roman" data-testid="c">
        The repricing engine.
      </Caption>,
    );
    expect(screen.getByTestId("c")).toHaveTextContent(
      "Fig. III — The repricing engine.",
    );
  });

  it("composes the prefix from the central copy constants", () => {
    render(
      <Caption figure={1} data-testid="c">
        Body
      </Caption>,
    );
    const text = screen.getByTestId("c").textContent ?? "";
    expect(text.startsWith(copy.figure.prefix)).toBe(true);
    expect(text).toContain(copy.figure.separator);
  });
});
