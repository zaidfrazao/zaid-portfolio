import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { palette } from "@/styles/tokens";

import { CHAPTERS, ChapterIndex } from "./ChapterIndex";

/**
 * ChapterIndex is the static nav shell: a `<nav>` landmark of four chapter
 * anchors, the current one marked in Sienna with `aria-current`. Rendered chrome
 * (the Sienna ink, the 2px Teal focus ring, the 360px wrap) is a visual-
 * regression subject — captured in the dev gallery, not asserted here.
 */

describe("ChapterIndex — landmark & chapters", () => {
  it("renders a nav landmark named 'Chapters'", () => {
    render(<ChapterIndex />);
    expect(
      screen.getByRole("navigation", { name: "Chapters" }),
    ).toBeInTheDocument();
  });

  it("renders all four canonical chapters as links, in order", () => {
    render(<ChapterIndex />);
    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual([
      "About",
      "Experience",
      "Projects",
      "Contact",
    ]);
  });

  it("points each chapter link at its route", () => {
    render(<ChapterIndex />);
    for (const chapter of CHAPTERS) {
      expect(screen.getByRole("link", { name: chapter.label })).toHaveAttribute(
        "href",
        chapter.href,
      );
    }
  });

  it("carries the Label register class on every chapter link", () => {
    render(<ChapterIndex />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveClass("register-label");
    }
  });

  it("renders a caller-supplied chapter set instead of the default", () => {
    render(
      <ChapterIndex
        chapters={[{ id: "colophon", label: "Colophon", href: "/colophon" }]}
      />,
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent("Colophon");
  });
});

describe("ChapterIndex — current chapter", () => {
  it("marks the current chapter with aria-current='page'", () => {
    render(<ChapterIndex current="projects" />);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("marks no other chapter as current", () => {
    render(<ChapterIndex current="projects" />);
    const others = screen
      .getAllByRole("link")
      .filter((a) => a.textContent !== "Projects");
    for (const link of others) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("marks nothing when current is absent", () => {
    render(<ChapterIndex />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });
});

describe("ChapterIndex — props transparency", () => {
  it("merges a caller-supplied className without dropping its own", () => {
    render(<ChapterIndex className="extra" />);
    const nav = screen.getByRole("navigation", { name: "Chapters" });
    expect(nav).toHaveClass("extra");
  });

  it("passes native nav props through (id)", () => {
    render(<ChapterIndex id="chapter-index" />);
    expect(screen.getByRole("navigation", { name: "Chapters" })).toHaveAttribute(
      "id",
      "chapter-index",
    );
  });

  it("keeps every chapter link keyboard-focusable (no negative tabindex)", () => {
    render(<ChapterIndex current="about" />);
    const nav = screen.getByRole("navigation", { name: "Chapters" });
    for (const link of within(nav).getAllByRole("link")) {
      expect(link).not.toHaveAttribute("tabindex", "-1");
    }
  });
});

// --- Flat-by-decree guard ---------------------------------------------------
//
// Brand Guide Hard Rule: NO drop shadows — layering is color and hairline rules
// only. Assert the stylesheet declares zero box-shadows so a future "subtle
// shadow" edit fails here rather than shipping simulated depth. Comments are
// stripped first so the rule's own documentation is not mistaken for a
// declaration.

describe("ChapterIndex — flat by decree", () => {
  it("declares no box-shadow in its stylesheet", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/components/ChapterIndex/ChapterIndex.module.css"),
      "utf8",
    );
    const declarations = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(declarations).not.toMatch(/box-shadow/i);
  });
});

// --- Contrast guard ---------------------------------------------------------
//
// Recompute WCAG ratios from the real palette tokens (never copied hex), the
// same approach as Label.test.tsx / Button.test.tsx. Both link inks the nav can
// show on the Paper ground — Umber for a resting chapter, Sienna for the current
// one — must clear AA, so a token tweak that drops either below the line fails
// here rather than shipping an unreadable chapter index.

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

describe("ChapterIndex — link/ground contrast clears AA", () => {
  // [chapter state, link ink, the ground it sits on]
  const pairs: ReadonlyArray<[string, string, string]> = [
    ["resting chapter (Umber on Paper)", palette.umber, palette.paper],
    ["current chapter (Sienna on Paper)", palette.sienna, palette.paper],
  ];

  it.each(pairs)("%s is ≥ 4.5:1", (_name, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});
