const MI_PER_KM = 0.621371;

export function miToKm(mi: number): number {
  return mi / MI_PER_KM;
}

export function kmToMi(km: number): number {
  return km * MI_PER_KM;
}

export function formatDistance(mi: number, unit: "mi" | "km"): string {
  const value = unit === "mi" ? mi : miToKm(mi);
  const rounded = Math.round(value * 10) / 10;
  return `${rounded} ${unit}`;
}
