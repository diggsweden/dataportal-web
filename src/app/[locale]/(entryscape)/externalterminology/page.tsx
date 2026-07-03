import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { isAppLocale } from "@/i18n/routing";
import { resolveEntryStoreRoute } from "@/lib/entrystore/resolve-entry-store-route";
import { getEntryscapeEnv } from "@/lib/entrystore/route-helpers";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ resource?: string }>;
}

export default async function ExternalTerminology({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { resource } = await searchParams;
  if (!resource) notFound();

  const { isSandbox } = await getEntryscapeEnv();

  const result = await resolveEntryStoreRoute(
    {
      pathPrefix: "/concepts",
      redirectPath: "/terminology",
      entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
    },
    locale,
    isSandbox,
    resource,
  );

  if (result.type === "redirect") redirect(result.url);
  notFound();
}
