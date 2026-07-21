import type { ReactNode } from "react";

import { getEntryscapeEnv } from "@/lib/entrystore/route-helpers";
import "@/styles/entryscape.css";
import "@/styles/entryscape-mqa.css";

/**
 * Preconnect/preload the EntryStore origins and blocks scripts here (not the
 * locale layout) so CMS-only pages don't pay for it, and so the block scripts
 * start downloading during the initial HTML stream rather than after mount.
 * Entryscape/MQA CSS is imported here for the same reason.
 */
export default async function EntryscapeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { env } = await getEntryscapeEnv();

  // Same list as ensureLib() in use-blocks.ts (tmp bundle host hardcoded there).
  const blockScripts = [
    "https://sandbox.admin.dataportal.se/tmp/blocks.js",
    env.ENTRYSCAPE_OPENDATA_URL,
    env.ENTRYSCAPE_MQA_URL,
    env.ENTRYSCAPE_BLOCKS_URL,
  ];

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
      {blockScripts.map((href) => (
        <link key={href} rel="preload" as="script" href={href} />
      ))}
      {children}
    </>
  );
}
