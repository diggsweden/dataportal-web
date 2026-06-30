import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Settings_Prod } from "@/env/settings.prod";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { SpecificationPage } from "@/features/entryscape/specification-page";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/lib/entrystore/provider";
import { resolveEntryStoreRoute } from "@/lib/entrystore/resolve-entry-store-route";

interface PageProps {
  params: Promise<{ locale: string; spec: string; param: string }>;
}

export default async function SpecificationParam({ params }: PageProps) {
  const { locale, spec, param } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const host = (await headers()).get("host") ?? "";
  const isSandbox = host.includes("sandbox");
  const env = { ...(isSandbox ? new Settings_Sandbox() : new Settings_Prod()) };

  const result = await resolveEntryStoreRoute(
    {
      pathPrefix: "/specifications",
      redirectPath: "/specifications",
      entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
      param: spec,
      secondParam: param,
    },
    locale,
    isSandbox,
  );

  if (result.type === "redirect") redirect(result.url);
  if (result.type === "notFound") notFound();
  if (result.type !== "resourceUri") notFound();

  return (
    <EntrystoreProvider
      env={env}
      rUri={result.resourceUri}
      entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
      pageType="specification"
    >
      <SpecificationPage />
    </EntrystoreProvider>
  );
}
