import { describe, it, expect } from "vitest";
import { formatDistance, kmToMi, miToKm } from "@/lib/units";

describe("units", () => {
  it("converts miles to kilometers", () => {
    expect(miToKm(1)).toBeCloseTo(1.60934, 4);
  });

  it("converts kilometers to miles", () => {
    expect(kmToMi(1)).toBeCloseTo(0.621371, 5);
  });

  it("formats a distance in miles", () => {
    expect(formatDistance(5, "mi")).toBe("5 mi");
  });

  it("formats a distance converted to kilometers", () => {
    expect(formatDistance(5, "km")).toBe("8 km");
  });
});
