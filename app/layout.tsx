import type { ReactNode } from "react";

import "@/styles/main.css";

/**
 * Root App Router layout. Intentionally a passthrough — `app/[locale]/layout.tsx`
 * owns the `<html lang>` + `<body>` + `<head>` so we can render
 * `<html lang={locale}>` dynamically per request. This file exists only to
 * satisfy Next.js's requirement of a root layout.
 *
 * The global stylesheet is imported here (not in the locale layout) so
 * that sibling files which render outside `[locale]` — `app/not-found.tsx`
 * and `app/global-error.tsx`, both of which ship their own `<html>`/`<body>`
 * — still receive the stylesheet.
 *
 * `pages/_document.tsx` continues to define `<html>` / `<body>` for the
 * Pages Router; the two routers never collide on a single request.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
