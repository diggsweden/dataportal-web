import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { DataServicePage } from "@/app/[locale]/(entryscape)/_components/data-service-page";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/lib/entrystore/provider";
import { getEntryscapeEnv, splitEntryId } from "@/lib/entrystore/route-helpers";

interface PageProps {
  params: Promise<{ locale: string; dataSet: string }>;
}

export default async function DataServiceDetail({ params }: PageProps) {
  const { locale, dataSet } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { env } = await getEntryscapeEnv();
  const { cid, eid } = splitEntryId(dataSet);

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
      pageType="dataservice"
    >
      <DataServicePage dataSet={dataSet} name={undefined} />
    </EntrystoreProvider>
  );
}
