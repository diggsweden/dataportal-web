"use client";

import { ubuntu } from "@/lib/fonts/ubuntu";

/**
 * Global error boundary — only triggers if something throws inside
 * `app/layout.tsx` itself (i.e. before `[locale]/error.tsx` can catch it).
 * Must declare its own `<html>` / `<body>` because when this renders,
 * the root layout's `<html>`/`<body>` is unavailable by definition
 * (that's the layout that crashed).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sv" className={ubuntu.variable}>
      <body className={`${ubuntu.className} font-ubuntu text-md`}>
        <div style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
          <h1>Något gick fel</h1>
          <p>{error.message}</p>
          <button type="button" onClick={() => reset()}>
            Försök igen
          </button>
        </div>
      </body>
    </html>
  );
}
