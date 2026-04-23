"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sv">
      <body className="font-ubuntu px-md py-xl text-md text-textPrimary">
        <h1 className="mb-md text-2xl font-semibold">Något gick fel</h1>
        <p className="mb-lg">{error.message}</p>
        <button
          type="button"
          className="rounded border border-borderPrimary px-md py-sm"
          onClick={() => reset()}
        >
          Försök igen
        </button>
      </body>
    </html>
  );
}
