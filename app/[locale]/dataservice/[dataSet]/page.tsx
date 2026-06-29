import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Settings_Prod } from "@/env/settings.prod";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { DataServicePage } from "@/features/entryscape/data-service-page";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/providers/entrystore-provider";

interface PageProps {
  params: Promise<{ locale: string; dataSet: string }>;
}

export default async function DataServiceDetail({ params }: PageProps) {
  const { locale, dataSet } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const host = (await headers()).get("host") ?? "";
  const isSandbox = host.includes("sandbox");
  const env = isSandbox ? new Settings_Sandbox() : new Settings_Prod();

  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];

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
