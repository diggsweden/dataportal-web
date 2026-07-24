import type { ReactNode } from "react";

import "@/styles/entryscape.css";
import "@/styles/entryscape-mqa.css";

/**
 * Preconnect to the EntryStore / blocks origins so store fetches (search and
 * resource pages) start early. The block-script `preload` lives in
 * EntrystoreProvider so only resource pages request it — search pages don't.
 */
export default function EntryscapeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
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
      {/* No crossOrigin: the engine loads these as classic (no-cors) scripts. */}
      <link rel="preconnect" href="https://static.cdn.entryscape.com" />
      <link rel="preconnect" href="https://static.entryscape.com" />
      <link rel="preconnect" href="https://sandbox.admin.dataportal.se" />
      {children}
    </>
  );
}
