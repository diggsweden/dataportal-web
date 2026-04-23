import { loadResourceLabels } from "./load-messages";
import type { ResourceLabel } from "./types";

/**
 * Server-side equivalent of `useResourceLabel` for use inside
 * `getServerSideProps`, `getStaticProps`, and other Node contexts.
 */
export async function getResourceLabel(locale: string): Promise<ResourceLabel> {
  const resources = await loadResourceLabels(locale);
  return (uri) => resources[uri] ?? uri;
}
