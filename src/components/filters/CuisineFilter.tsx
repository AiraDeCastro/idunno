"use client";

import { useFilters } from "@/context/FiltersContext";
import { CUISINES } from "@/lib/constants";
import ChipGroup from "./ChipGroup";

export default function CuisineFilter() {
  const { cuisines, toggleCuisine } = useFilters();
  return <ChipGroup legend="Cuisine" options={CUISINES} selected={cuisines} onToggle={toggleCuisine} />;
}
