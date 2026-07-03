import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { DatasetSeriesPage } from "@/app/[locale]/(entryscape)/components/dataset-series-page";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/lib/entrystore/provider";
import { getEntryscapeEnv, splitEntryId } from "@/lib/entrystore/route-helpers";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function DataSeries({ params }: PageProps) {
  const { locale, id } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { env } = await getEntryscapeEnv();
  const { cid, eid } = splitEntryId(id);

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
      pageType="dataset-series"
    >
      <DatasetSeriesPage />
    </EntrystoreProvider>
  );
}
