import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Settings_Prod } from "@/env/settings.prod";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { DatasetSeriesPage } from "@/features/entryscape/dataset-series-page";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/lib/entrystore/provider";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function DataSeries({ params }: PageProps) {
  const { locale, id } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const host = (await headers()).get("host") ?? "";
  const isSandbox = host.includes("sandbox");
  const env = { ...(isSandbox ? new Settings_Sandbox() : new Settings_Prod()) };

  const ids = (typeof id === "string" && id.split("_")) || [];
  const eid = ids.pop() || "";
  const cid = ids.join("_");

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
