import type { ReactNode } from "react";

/**
 * Root App Router layout. Intentionally a passthrough — `app/[locale]/layout.tsx`
 * owns the `<html lang>` + `<body>` + `<head>` so we can render
 * `<html lang={locale}>` dynamically per request. This file exists only to
 * satisfy Next.js's requirement of a root layout.
 *
 * `pages/_document.tsx` continues to define `<html>` / `<body>` for the
 * Pages Router; the two routers never collide on a single request.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
