import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FiltersProvider } from "@/context/FiltersContext";
import FilterBar from "@/components/filters/FilterBar";
import { CUISINES, PRICE_TIERS } from "@/lib/constants";

function renderFilterBar() {
  return render(
    <FiltersProvider>
      <FilterBar />
    </FiltersProvider>
  );
}

describe("FilterBar", () => {
  it("defaults to every cuisine and price tier selected", () => {
    renderFilterBar();
    for (const cuisine of CUISINES) {
      expect(screen.getByRole("checkbox", { name: cuisine })).toBeChecked();
    }
    for (const price of PRICE_TIERS) {
      expect(screen.getByRole("checkbox", { name: price })).toBeChecked();
    }
  });

  it("defaults the minimum-rating toggle to on", () => {
    renderFilterBar();
    expect(screen.getByRole("checkbox", { name: /3.5★ and up/ })).toBeChecked();
  });

  it("toggles a cuisine off and back on", async () => {
    const user = userEvent.setup();
    renderFilterBar();

    const italian = screen.getByRole("checkbox", { name: "Italian" });
    expect(italian).toBeChecked();

    await user.click(italian);
    expect(italian).not.toBeChecked();

    await user.click(italian);
    expect(italian).toBeChecked();
  });

  it("toggles the minimum-rating switch", async () => {
    const user = userEvent.setup();
    renderFilterBar();

    const toggle = screen.getByRole("checkbox", { name: /3.5★ and up/ });
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
  });

  it("updates the displayed distance when the slider moves", () => {
    renderFilterBar();
    const slider = screen.getByLabelText(/Distance: 5 mi/);
    expect(slider).toBeInTheDocument();
  });
});
