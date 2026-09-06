"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  CUISINES,
  DEFAULT_MIN_RATING_ENABLED,
  DEFAULT_RADIUS_MI,
  DEFAULT_UNIT,
  PRICE_TIERS,
} from "@/lib/constants";
import type { Cuisine, DistanceUnit, Filters, PriceTier } from "@/types/filters";

interface FiltersContextValue extends Filters {
  toggleCuisine: (cuisine: Cuisine) => void;
  togglePrice: (price: PriceTier) => void;
  setRadiusMi: (radiusMi: number) => void;
  setUnit: (unit: DistanceUnit) => void;
  setMinRatingEnabled: (enabled: boolean) => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [cuisines, setCuisines] = useState<Set<Cuisine>>(() => new Set(CUISINES));
  const [prices, setPrices] = useState<Set<PriceTier>>(() => new Set(PRICE_TIERS));
  const [radiusMi, setRadiusMi] = useState(DEFAULT_RADIUS_MI);
  const [unit, setUnit] = useState<DistanceUnit>(DEFAULT_UNIT);
  const [minRatingEnabled, setMinRatingEnabled] = useState(DEFAULT_MIN_RATING_ENABLED);

  const value = useMemo<FiltersContextValue>(
    () => ({
      cuisines,
      prices,
      radiusMi,
      unit,
      minRatingEnabled,
      toggleCuisine: (cuisine) => setCuisines((prev) => toggleInSet(prev, cuisine)),
      togglePrice: (price) => setPrices((prev) => toggleInSet(prev, price)),
      setRadiusMi,
      setUnit,
      setMinRatingEnabled,
    }),
    [cuisines, prices, radiusMi, unit, minRatingEnabled]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters(): FiltersContextValue {
  const ctx = useContext(FiltersContext);
  if (!ctx) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return ctx;
}
