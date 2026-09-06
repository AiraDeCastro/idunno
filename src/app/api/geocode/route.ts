import { NextRequest, NextResponse } from "next/server";

interface GoogleGeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GoogleGeocodeResponse {
  status: string;
  results: GoogleGeocodeResult[];
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address")?.trim();

  if (!address) {
    return NextResponse.json(
      { error: "Missing required 'address' query parameter." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is not configured with a Google Maps API key." },
      { status: 500 }
    );
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", apiKey);

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    return NextResponse.json(
      { error: "Could not reach the geocoding service. Try again." },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "The geocoding service returned an unexpected error." },
      { status: 502 }
    );
  }

  const data = (await response.json()) as GoogleGeocodeResponse;

  if (data.status === "ZERO_RESULTS") {
    return NextResponse.json(
      { error: "No location found for that address." },
      { status: 404 }
    );
  }

  if (data.status !== "OK" || !data.results[0]) {
    return NextResponse.json(
      { error: "The geocoding service could not process this request." },
      { status: 502 }
    );
  }

  const result = data.results[0];
  return NextResponse.json({
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
  });
}
