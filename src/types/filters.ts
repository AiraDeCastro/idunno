export type Cuisine =
  | "Italian"
  | "Chinese"
  | "Filipino"
  | "Mexican"
  | "Canadian"
  | "Japanese"
  | "Thai"
  | "Indian"
  | "Korean"
  | "Vietnamese"
  | "Mediterranean"
  | "American";

export type PriceTier = "$" | "$$" | "$$$" | "$$$$";

export type DistanceUnit = "mi" | "km";

export interface Filters {
  cuisines: Set<Cuisine>;
  prices: Set<PriceTier>;
  radiusMi: number;
  unit: DistanceUnit;
  minRatingEnabled: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type LocationStatus =
  | "idle"
  | "requesting"
  | "resolved"
  | "denied"
  | "unavailable"
  | "unsupported";

export type LocationSource = "geolocation" | "manual";

export interface LocationState {
  status: LocationStatus;
  coords: Coordinates | null;
  source: LocationSource | null;
  label: string | null;
  error: string | null;
}
