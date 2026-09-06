"use client";

import { useFilters } from "@/context/FiltersContext";
import { MAX_RADIUS_MI, MIN_RADIUS_MI } from "@/lib/constants";
import { formatDistance } from "@/lib/units";
import type { DistanceUnit } from "@/types/filters";

export default function RadiusFilter() {
  const { radiusMi, unit, setRadiusMi, setUnit } = useFilters();

  const units: DistanceUnit[] = ["mi", "km"];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="radius-slider" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Distance: {formatDistance(radiusMi, unit)}
        </label>
        <div role="radiogroup" aria-label="Distance unit" className="flex overflow-hidden rounded-lg border border-neutral-300 text-xs dark:border-neutral-700">
          {units.map((u) => (
            <label
              key={u}
              className={`cursor-pointer px-2 py-1 ${
                unit === u
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "bg-white text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400"
              }`}
            >
              <input
                type="radio"
                name="distance-unit"
                value={u}
                checked={unit === u}
                onChange={() => setUnit(u)}
                className="sr-only"
              />
              {u}
            </label>
          ))}
        </div>
      </div>
      <input
        id="radius-slider"
        type="range"
        min={MIN_RADIUS_MI}
        max={MAX_RADIUS_MI}
        step={0.5}
        value={radiusMi}
        onChange={(event) => setRadiusMi(Number(event.target.value))}
        className="w-full accent-neutral-900 dark:accent-neutral-100"
      />
    </div>
  );
}
