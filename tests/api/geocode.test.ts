import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/geocode/route";

function makeRequest(query: string) {
  return new NextRequest(`http://localhost/api/geocode${query}`);
}

describe("GET /api/geocode", () => {
  const originalKey = process.env.GOOGLE_MAPS_API_KEY;

  beforeEach(() => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
  });

  afterEach(() => {
    process.env.GOOGLE_MAPS_API_KEY = originalKey;
    vi.restoreAllMocks();
  });

  it("returns 400 when address is missing", async () => {
    const response = await GET(makeRequest(""));
    expect(response.status).toBe(400);
  });

  it("returns 500 when the server has no API key configured", async () => {
    delete process.env.GOOGLE_MAPS_API_KEY;
    const response = await GET(makeRequest("?address=90210"));
    expect(response.status).toBe(500);
  });

  it("returns 404 when the geocoder finds nothing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "ZERO_RESULTS", results: [] }),
      })
    );

    const response = await GET(makeRequest("?address=nowhere"));
    expect(response.status).toBe(404);
  });

  it("returns coordinates on a successful lookup", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "OK",
          results: [
            {
              formatted_address: "90210, Beverly Hills, CA, USA",
              geometry: { location: { lat: 34.0901, lng: -118.4065 } },
            },
          ],
        }),
      })
    );

    const response = await GET(makeRequest("?address=90210"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      lat: 34.0901,
      lng: -118.4065,
      formattedAddress: "90210, Beverly Hills, CA, USA",
    });
  });

  it("returns 502 when the upstream request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down"))
    );

    const response = await GET(makeRequest("?address=90210"));
    expect(response.status).toBe(502);
  });
});
