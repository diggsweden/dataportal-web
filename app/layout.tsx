import type { ReactNode } from "react";

import "@/styles/main.css";

/**
 * Root shell for App Router routes only. `pages/_document.tsx` still defines
 * `<html>` / `<body>` for the Pages Router.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className="font-ubuntu text-md text-textPrimary">{children}</body>
    </html>
  );
}
