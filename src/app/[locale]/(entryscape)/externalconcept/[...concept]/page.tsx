import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { isAppLocale } from "@/i18n/routing";
import { ROUTE_CONFIG } from "@/lib/entrystore/entrystore-core";
import { resolveEntryStoreRoute } from "@/lib/entrystore/resolve-entry-store-route";
import { getEntryscapeEnv } from "@/lib/entrystore/route-helpers";

interface PageProps {
  params: Promise<{ locale: string; concept: string[] }>;
}

export default async function ExternalConceptCatchAll({ params }: PageProps) {
  const { locale, concept } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { isSandbox } = await getEntryscapeEnv();

  const result = await resolveEntryStoreRoute(
    { ...ROUTE_CONFIG.concept, param: concept },
    locale,
    isSandbox,
  );

  if (result.type === "redirect") redirect(result.url);
  notFound();
}
