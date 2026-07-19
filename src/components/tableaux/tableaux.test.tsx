import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InsertStub, PortraitMedallion } from "./art";
import {
  AboutTableau,
  ContactTableau,
  ExperienceTableau,
  ProjectsTableau,
  TABLEAUX,
} from ".";

/**
 * Smoke tests for the rough chapter tableaux (PORT-16). This is spike-quality
 * content — the real test is the walkthrough — so these assert only that each
 * scene renders its draft content and its key affordances, not pixel chrome
 * (that is a later visual-regression concern). They exist so the four scenes
 * carry coverage and the CI function-coverage gate stays green.
 */

describe("AboutTableau", () => {
  it("renders the name, positioning line, and first-person bio", () => {
    render(<AboutTableau />);
    expect(
      screen.getByRole("heading", { name: "Zaid Frazao" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("AI-accelerated product builder"),
    ).toBeInTheDocument();
    expect(screen.getByText(/The builder\./)).toBeInTheDocument();
    expect(
      screen.getByText(/writing code since I was eleven/),
    ).toBeInTheDocument();
  });
});

describe("ExperienceTableau", () => {
  it("renders the career timeline as a list of roles", () => {
    render(<ExperienceTableau />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Lakar" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sportomatic" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2023 – present")).toBeInTheDocument();
  });
});

describe("ProjectsTableau", () => {
  it("leads with the CatalogIQ anchor and the two supporting projects", () => {
    render(<ProjectsTableau />);
    expect(
      screen.getByRole("heading", { name: "CatalogIQ" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Takealot-ready loadsheets/)).toBeInTheDocument();
    expect(screen.getByText(/quarrying logistics operator/)).toBeInTheDocument();
    expect(screen.getByText(/18\+ integrations/)).toBeInTheDocument();
  });

  it("flags the unverified pilot figures and shows stack chips", () => {
    render(<ProjectsTableau />);
    expect(screen.getByText(/figures pending verification/)).toBeInTheDocument();
    expect(screen.getByText("OR-Tools")).toBeInTheDocument();
    expect(screen.getByText("Composio")).toBeInTheDocument();
  });
});

describe("ContactTableau", () => {
  it("exposes availability and the primary contact affordances", () => {
    render(<ContactTableau />);
    expect(screen.getByText(/about 20 hours a week/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email Zaid" })).toHaveAttribute(
      "href",
      "mailto:zaidfrazao@gmail.com",
    );
    expect(screen.getByRole("link", { name: "Résumé (PDF)" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/zaidfrazao",
    );
  });
});

describe("placeholder SVG art", () => {
  it("PortraitMedallion renders an aria-hidden svg", () => {
    const { container } = render(<PortraitMedallion />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("InsertStub renders an aria-hidden svg", () => {
    const { container } = render(<InsertStub />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});

describe("TABLEAUX registry", () => {
  it("maps every canonical chapter id to a renderable scene", () => {
    expect(Object.keys(TABLEAUX).sort()).toEqual([
      "about",
      "contact",
      "experience",
      "projects",
    ]);

    for (const id of Object.keys(TABLEAUX)) {
      const Scene = TABLEAUX[id];
      const { container } = render(<Scene />);
      expect(container.firstChild).toBeTruthy();
    }
  });
});
