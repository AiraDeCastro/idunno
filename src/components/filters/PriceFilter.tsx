"use client";

import { useFilters } from "@/context/FiltersContext";
import { PRICE_TIERS } from "@/lib/constants";
import ChipGroup from "./ChipGroup";

export default function PriceFilter() {
  const { prices, togglePrice } = useFilters();
  return <ChipGroup legend="Price" options={PRICE_TIERS} selected={prices} onToggle={togglePrice} />;
}
