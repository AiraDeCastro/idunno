import type { Cuisine, DistanceUnit, PriceTier } from "@/types/filters";

export const CUISINES: Cuisine[] = [
  "Italian",
  "Chinese",
  "Filipino",
  "Mexican",
  "Canadian",
  "Japanese",
  "Thai",
  "Indian",
  "Korean",
  "Vietnamese",
  "Mediterranean",
  "American",
];

export const PRICE_TIERS: PriceTier[] = ["$", "$$", "$$$", "$$$$"];

export const MIN_RADIUS_MI = 0.5;
export const MAX_RADIUS_MI = 25;
export const DEFAULT_RADIUS_MI = 5;
export const DEFAULT_UNIT: DistanceUnit = "mi";
export const DEFAULT_MIN_RATING_ENABLED = true;
export const MIN_RATING_THRESHOLD = 3.5;

export const LOCATION_STORAGE_KEY = "idunno:location";
