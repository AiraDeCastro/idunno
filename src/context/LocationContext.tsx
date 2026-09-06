"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { LOCATION_STORAGE_KEY } from "@/lib/constants";
import type { Coordinates, LocationState } from "@/types/filters";

interface LocationContextValue extends LocationState {
  requestGeolocation: () => void;
  setManualLocation: (coords: Coordinates, label: string) => void;
  reset: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

const idleState: LocationState = {
  status: "idle",
  coords: null,
  source: null,
  label: null,
  error: null,
};

// sessionStorage doesn't change within the same tab except through our own
// writes below, so there's nothing external to subscribe to beyond the
// initial read on mount.
function subscribeToStorage() {
  return () => {};
}

function getStorageSnapshot(): string | null {
  return window.sessionStorage.getItem(LOCATION_STORAGE_KEY);
}

function getServerStorageSnapshot(): string | null {
  return null;
}

function parsePersistedLocation(raw: string | null): LocationState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LocationState;
    if (parsed.status === "resolved" && parsed.coords) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const geolocation = useGeolocation();
  const [manual, setManual] = useState<LocationState | null>(null);
  const persistedRaw = useSyncExternalStore(
    subscribeToStorage,
    getStorageSnapshot,
    getServerStorageSnapshot
  );
  const hydrated = useMemo(() => parsePersistedLocation(persistedRaw), [persistedRaw]);

  const state: LocationState = useMemo(() => {
    if (manual) return manual;

    if (geolocation.status === "granted" && geolocation.coords) {
      return {
        status: "resolved",
        coords: geolocation.coords,
        source: "geolocation",
        label: "Current location",
        error: null,
      };
    }

    if (geolocation.status === "idle" && hydrated) {
      return hydrated;
    }

    return {
      status: geolocation.status === "granted" ? "resolved" : geolocation.status,
      coords: null,
      source: null,
      label: null,
      error: geolocation.error,
    };
  }, [manual, geolocation, hydrated]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (state.status === "resolved") {
      window.sessionStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const setManualLocation = useCallback((coords: Coordinates, label: string) => {
    setManual({
      status: "resolved",
      coords,
      source: "manual",
      label,
      error: null,
    });
  }, []);

  const reset = useCallback(() => {
    setManual(null);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(LOCATION_STORAGE_KEY);
    }
  }, []);

  const value: LocationContextValue = {
    ...state,
    requestGeolocation: geolocation.request,
    setManualLocation,
    reset,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return ctx;
}

export { idleState as defaultLocationState };
