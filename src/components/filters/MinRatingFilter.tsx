"use client";

import { useFilters } from "@/context/FiltersContext";
import { MIN_RATING_THRESHOLD } from "@/lib/constants";

export default function MinRatingFilter() {
  const { minRatingEnabled, setMinRatingEnabled } = useFilters();

  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Only show {MIN_RATING_THRESHOLD}★ and up
      </span>
      <input
        type="checkbox"
        checked={minRatingEnabled}
        onChange={(event) => setMinRatingEnabled(event.target.checked)}
        className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-neutral-300 transition-colors checked:bg-neutral-900 dark:bg-neutral-700 dark:checked:bg-neutral-100"
      />
    </label>
  );
}
