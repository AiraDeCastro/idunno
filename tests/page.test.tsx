import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("renders the product name", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "I Dunno" })).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Home />);
    expect(
      screen.getByText("Spin the wheel. Try somewhere new.")
    ).toBeInTheDocument();
  });
});
