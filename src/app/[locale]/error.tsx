"use client";

import { useEffect } from "react";

/**
 * Locale-scoped error boundary for the App Router. Caught here, errors do
 * not propagate up to `app/global-error.tsx` (which only triggers on
 * crashes inside the root layout).
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-md py-xl">
      <h1 className="mb-md text-2xl font-semibold">Något gick fel</h1>
      <p className="mb-lg text-textPrimary">{error.message}</p>
      <button
        type="button"
        className="rounded border border-borderPrimary px-md py-sm"
        onClick={() => reset()}
      >
        Försök igen
      </button>
    </div>
  );
}
