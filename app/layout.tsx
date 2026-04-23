import { headers } from "next/headers";
import type { ReactNode } from "react";

import "@/styles/main.css";

/**
 * Root shell for App Router. `pages/_document.tsx` still owns the same `<head>`
 * assets for Pages Router HTML; this keeps App HTML aligned (nonce, __ENV,
 * Screen9, preconnects, theme-color).
 */
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <script nonce={nonce} type="text/javascript" src="/__ENV.js" />
        <link
          type="text/css"
          rel="stylesheet"
          href="https://cdn.screen9.com/players/amber-player.css"
        />
        <link
          rel="preconnect"
          href="https://editera.dataportal.se"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://admin.dataportal.se"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#FBF2F0" />
      </head>
      <body className="font-ubuntu text-md text-textPrimary">{children}</body>
    </html>
  );
}
