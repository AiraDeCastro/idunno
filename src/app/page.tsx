"use client";

import FilterBar from "@/components/filters/FilterBar";
import LocationGate from "@/components/location/LocationGate";
import { useLocation } from "@/context/LocationContext";

export default function Home() {
  const { status } = useLocation();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6">
      <header className="flex flex-col items-center gap-1 pt-8 text-center">
        <h1 className="text-4xl font-semibold">I Dunno</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Spin the wheel. Try somewhere new.</p>
      </header>

      <LocationGate />
      {status === "resolved" && <FilterBar />}
    </main>
  );
}
