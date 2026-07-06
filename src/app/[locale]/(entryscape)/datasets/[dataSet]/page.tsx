import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { DatasetPage } from "@/app/[locale]/(entryscape)/_components/dataset-page";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/lib/entrystore/provider";
import { getEntryscapeEnv, splitEntryId } from "@/lib/entrystore/route-helpers";
import { ApiIndexProvider } from "@/providers/api-index-context";

interface PageProps {
  params: Promise<{ locale: string; dataSet: string }>;
}

export default async function DataSet({ params }: PageProps) {
  const { locale, dataSet } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { env } = await getEntryscapeEnv();
  const { cid, eid } = splitEntryId(dataSet);

  return (
    <ApiIndexProvider apiIndexFileUrl={env.API_DETECTION_PATH}>
      <EntrystoreProvider
        env={env}
        cid={cid}
        eid={eid}
        entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
        pageType="dataset"
      >
        <DatasetPage />
      </EntrystoreProvider>
    </ApiIndexProvider>
  );
}
