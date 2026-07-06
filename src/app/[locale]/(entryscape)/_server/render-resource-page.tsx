import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { isAppLocale } from "@/i18n/routing";
import type { PageType } from "@/lib/entrystore/entrystore-core";
import { EntrystoreProvider } from "@/lib/entrystore/provider";
import { resolveEntryStoreRoute } from "@/lib/entrystore/resolve-entry-store-route";
import { getEntryscapeEnv } from "@/lib/entrystore/route-helpers";
import type { RedirectConfig } from "@/types/global";

interface RenderEntryStoreResourcePageArgs {
  locale: string;
  config: RedirectConfig;
  pageType: PageType;
  body: ReactNode;
  /** Resource URI for `external*` entry points that resolve via `?resource=`. */
  resourceUri?: string;
}

/**
 * Shared server flow for EntryStore "resource" pages (concepts, terminology,
 * specifications). Guards the locale, resolves the route, honours
 * redirect/notFound outcomes, and renders the given body inside an
 * `EntrystoreProvider` for both the `resourceUri` and `entry` (cid/eid) cases.
 */
export async function renderEntryStoreResourcePage({
  locale,
  config,
  pageType,
  body,
  resourceUri,
}: RenderEntryStoreResourcePageArgs) {
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { env, isSandbox } = await getEntryscapeEnv();
  const result = await resolveEntryStoreRoute(
    config,
    locale,
    isSandbox,
    resourceUri,
  );

  if (result.type === "redirect") redirect(result.url);
  if (result.type === "notFound") notFound();

  const idProps =
    result.type === "resourceUri"
      ? { rUri: result.resourceUri }
      : { cid: result.cid, eid: result.eid };

  return (
    <EntrystoreProvider
      env={env}
      entrystoreUrl={env[config.entrystorePathKey]}
      pageType={pageType}
      {...idProps}
    >
      {body}
    </EntrystoreProvider>
  );
}
