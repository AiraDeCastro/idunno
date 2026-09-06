"use client";

import { useState, type FormEvent } from "react";
import { useLocation } from "@/context/LocationContext";

interface GeocodeSuccess {
  lat: number;
  lng: number;
  formattedAddress: string;
}

interface GeocodeError {
  error: string;
}

export default function ManualLocationForm() {
  const { setManualLocation } = useLocation();
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!address.trim()) return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      const data = (await response.json()) as GeocodeSuccess | GeocodeError;

      if (!response.ok || "error" in data) {
        setStatus("error");
        setErrorMessage("error" in data ? data.error : "Something went wrong finding that address.");
        return;
      }

      setManualLocation({ lat: data.lat, lng: data.lng }, data.formattedAddress);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("Could not reach the server. Check your connection and try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="manual-address" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Enter an address or zip code
      </label>
      <div className="flex gap-2">
        <input
          id="manual-address"
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="123 Main St, or 90210"
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <button
          type="submit"
          disabled={status === "loading" || !address.trim()}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Looking..." : "Find it"}
        </button>
      </div>
      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
