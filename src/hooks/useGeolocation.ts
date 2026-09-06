"use client";

import { useCallback, useState } from "react";
import type { Coordinates } from "@/types/filters";

type GeolocationHookStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable" | "unsupported";

interface GeolocationHookState {
  status: GeolocationHookStatus;
  coords: Coordinates | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationHookState>({
    status: "idle",
    coords: null,
    error: null,
  });

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "unsupported", coords: null, error: "Geolocation is not supported by this browser." });
      return;
    }

    setState((prev) => ({ ...prev, status: "requesting", error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: "granted",
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setState({ status: "denied", coords: null, error: "Location permission was denied." });
        } else {
          setState({ status: "unavailable", coords: null, error: "Your location could not be determined." });
        }
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 }
    );
  }, []);

  return { ...state, request };
}
