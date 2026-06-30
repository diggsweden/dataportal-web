import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Settings_Prod } from "@/env/settings.prod";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { MQACategoryPage } from "@/features/entryscape/mqa-category-page";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/lib/entrystore/provider";

interface PageProps {
  params: Promise<{ locale: string; catalog: string[] }>;
}

export default async function MqaCategoryPage({ params }: PageProps) {
  const { locale, catalog } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const eid = catalog[0];
  const cid = catalog[1];

  if (!cid || !eid) notFound();

  const host = (await headers()).get("host") ?? "";
  const isSandbox = host.includes("sandbox");
  const env = { ...(isSandbox ? new Settings_Sandbox() : new Settings_Prod()) };

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_MQA_PATH}
      pageType="mqa"
    >
      <MQACategoryPage />
    </EntrystoreProvider>
  );
}
