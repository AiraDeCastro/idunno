"use client";

import type { ReactNode } from "react";
import { FiltersProvider } from "@/context/FiltersContext";
import { LocationProvider } from "@/context/LocationContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LocationProvider>
      <FiltersProvider>{children}</FiltersProvider>
    </LocationProvider>
  );
}
