import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/lib/entrystore/provider";
import { getEntryscapeEnv } from "@/lib/entrystore/route-helpers";
import { MQACategoryPage } from "./mqa-category-page";

interface PageProps {
  params: Promise<{ locale: string; catalog: string[] }>;
}

export default async function MqaCategoryPage({ params }: PageProps) {
  const { locale, catalog } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  // Link shape (see `config.ts` / `entrystore.service.ts`):
  //   /metadatakvalitet/katalog/<entryId>/<contextId>  e.g. .../katalog/_quality/275
  // `getEntry(contextId, entryId)`, so entryId is the segment after "katalog".
  // Older links omit the "katalog" segment, so support both shapes.
  const segments = catalog[0] === "katalog" ? catalog.slice(1) : catalog;
  const eid = segments[0];
  const cid = segments[1];

  if (!cid || !eid) notFound();

  const { env } = await getEntryscapeEnv();

  return (
    <EntrystoreProvider env={env} cid={cid} eid={eid} pageType="mqa">
      <MQACategoryPage />
    </EntrystoreProvider>
  );
}
