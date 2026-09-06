"use client";

import { useState } from "react";
import { useLocation } from "@/context/LocationContext";
import ManualLocationForm from "./ManualLocationForm";

export default function LocationGate() {
  const { status, label, requestGeolocation, reset } = useLocation();
  const [showManualEntry, setShowManualEntry] = useState(false);

  if (status === "resolved") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
        <span className="text-neutral-700 dark:text-neutral-300">
          Searching near <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{label}</strong>
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-neutral-500 underline-offset-2 hover:underline dark:text-neutral-400"
        >
          Change
        </button>
      </div>
    );
  }

  const showManual = showManualEntry || status === "denied" || status === "unavailable" || status === "unsupported";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          We use your location only to find restaurants nearby for this search — it&apos;s never stored on our
          servers.
        </p>
      </div>

      {status === "denied" && (
        <p role="alert" className="text-sm text-amber-700 dark:text-amber-400">
          Location access was denied. Enter a location below instead.
        </p>
      )}
      {status === "unavailable" && (
        <p role="alert" className="text-sm text-amber-700 dark:text-amber-400">
          We couldn&apos;t determine your location. Enter one below instead.
        </p>
      )}
      {status === "unsupported" && (
        <p role="alert" className="text-sm text-amber-700 dark:text-amber-400">
          This browser doesn&apos;t support automatic location. Enter one below instead.
        </p>
      )}

      {status !== "denied" && status !== "unavailable" && status !== "unsupported" && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={requestGeolocation}
            disabled={status === "requesting"}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "requesting" ? "Locating..." : "Use my location"}
          </button>
          {!showManualEntry && (
            <button
              type="button"
              onClick={() => setShowManualEntry(true)}
              className="text-sm text-neutral-600 underline-offset-2 hover:underline dark:text-neutral-400"
            >
              Enter a location instead
            </button>
          )}
        </div>
      )}

      {showManual && <ManualLocationForm />}
    </div>
  );
}
