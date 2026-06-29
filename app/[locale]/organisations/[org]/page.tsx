import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Settings_Prod } from "@/env/settings.prod";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { OrganisationPage } from "@/features/entryscape/organisation-page";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/providers/entrystore-provider";

interface PageProps {
  params: Promise<{ locale: string; org: string }>;
}

export default async function Organisation({ params }: PageProps) {
  const { locale, org } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const host = (await headers()).get("host") ?? "";
  const isSandbox = host.includes("sandbox");
  const env = { ...(isSandbox ? new Settings_Sandbox() : new Settings_Prod()) };

  const ids = (typeof org === "string" && org.split("_")) || [];
  const eid = ids.pop() || "";
  const cid = ids.join("_");

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
      pageType="organisation"
    >
      <OrganisationPage />
    </EntrystoreProvider>
  );
}
