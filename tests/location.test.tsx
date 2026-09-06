import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationProvider } from "@/context/LocationContext";
import LocationGate from "@/components/location/LocationGate";

function renderGate() {
  return render(
    <LocationProvider>
      <LocationGate />
    </LocationProvider>
  );
}

describe("LocationGate", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the location rationale and a call to action initially", () => {
    renderGate();
    expect(screen.getByRole("button", { name: "Use my location" })).toBeInTheDocument();
    expect(screen.getByText(/never stored on our servers/)).toBeInTheDocument();
  });

  it("falls back to manual entry immediately when permission is denied", async () => {
    const getCurrentPosition = vi.fn(
      (_success: PositionCallback, error: PositionErrorCallback) => {
        error({ code: 1, PERMISSION_DENIED: 1 } as GeolocationPositionError);
      }
    );
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition } });

    const user = userEvent.setup();
    renderGate();

    await user.click(screen.getByRole("button", { name: "Use my location" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Location access was denied");
    expect(screen.getByLabelText("Enter an address or zip code")).toBeInTheDocument();
  });

  it("offers manual entry up front without waiting for a denial", async () => {
    const user = userEvent.setup();
    renderGate();

    await user.click(screen.getByRole("button", { name: "Enter a location instead" }));

    expect(screen.getByLabelText("Enter an address or zip code")).toBeInTheDocument();
  });
});
