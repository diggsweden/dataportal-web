import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { isAppLocale } from "@/i18n/routing";
import {
  type PageType,
  type ResolverPageType,
  ROUTE_CONFIG,
} from "@/lib/entrystore/entrystore-core";
import { EntrystoreProvider } from "@/lib/entrystore/provider";
import { resolveEntryStoreRoute } from "@/lib/entrystore/resolve-entry-store-route";
import { getEntryscapeEnv } from "@/lib/entrystore/route-helpers";

interface RenderEntryStoreResourcePageArgs {
  locale: string;
  pageType: ResolverPageType;
  param?: string | string[];
  secondParam?: string;
  body: ReactNode;
  /** Resource URI for `external*` entry points that resolve via `?resource=`. */
  resourceUri?: string;
  /** Appended to vanity redirects, e.g. `/ap`. */
  pathSuffix?: string;
  /** Overrides `pageType` on the provider when the view differs from the resolver. */
  providerPageType?: PageType;
}

/**
 * Shared server flow for EntryStore "resource" pages (concepts, terminology,
 * specifications). Guards the locale, resolves the route, honours
 * redirect/notFound outcomes, and renders the given body inside an
 * `EntrystoreProvider` for both the `resourceUri` and `entry` (cid/eid) cases.
 */
export async function renderEntryStoreResourcePage({
  locale,
  pageType,
  param,
  secondParam,
  body,
  resourceUri,
  pathSuffix,
  providerPageType,
}: RenderEntryStoreResourcePageArgs) {
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { env, isSandbox } = await getEntryscapeEnv();
  const result = await resolveEntryStoreRoute(
    { ...ROUTE_CONFIG[pageType], param, secondParam },
    locale,
    isSandbox,
    resourceUri,
  );

  if (result.type === "redirect")
    redirect(pathSuffix ? `${result.url}${pathSuffix}` : result.url);
  if (result.type === "notFound") notFound();

  const idProps =
    result.type === "resourceUri"
      ? { rUri: result.resourceUri }
      : { cid: result.cid, eid: result.eid };

  return (
    <EntrystoreProvider
      env={env}
      pageType={providerPageType ?? pageType}
      {...idProps}
    >
      {body}
    </EntrystoreProvider>
  );
}
