"use client";

import { useEffect } from "react";

export default function Error({
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
    <div className="min-h-[50vh] flex-col items-center justify-center">
      <h2 className="mb-4 text-xl">Något gick fel</h2>
      <button
        onClick={() => reset()}
        className="rounded bg-brown-600 text-white"
      >
        Försök igen
      </button>
    </div>
  );
}
