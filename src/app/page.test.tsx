import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

// Proves the harness end to end: renders a real Server Component (synchronous)
// through RTL and asserts on the rendered DOM with jest-dom matchers.
describe("Home", () => {
  it("renders the name as the top-level heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Zaid Frazao" }),
    ).toBeInTheDocument();
  });

  it("renders the positioning line", () => {
    render(<Home />);

    expect(
      screen.getByText("AI-accelerated product builder"),
    ).toBeInTheDocument();
  });
});
