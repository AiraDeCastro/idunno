import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import Providers from "@/components/Providers";

function renderHome() {
  return render(
    <Providers>
      <Home />
    </Providers>
  );
}

describe("Home", () => {
  it("renders the product name and tagline", () => {
    renderHome();
    expect(screen.getByRole("heading", { name: "I Dunno" })).toBeInTheDocument();
    expect(screen.getByText("Spin the wheel. Try somewhere new.")).toBeInTheDocument();
  });

  it("prompts for location before showing filters", () => {
    renderHome();
    expect(screen.getByRole("button", { name: "Use my location" })).toBeInTheDocument();
    expect(screen.queryByText("Cuisine")).not.toBeInTheDocument();
  });
});
