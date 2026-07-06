import type { ReactNode } from "react";

import "@/styles/entryscape.css";
import "@/styles/entryscape-mqa.css";

/**
 * Entryscape routes load data from admin/editera EntryStore origins in the
 * browser. Preconnect here (not in the locale layout) so CMS-only pages
 * don't open unused connections. Entryscape/MQA styles are imported here
 * rather than in `main.css` so CMS pages skip that CSS weight.
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
      {children}
    </>
  );
}
