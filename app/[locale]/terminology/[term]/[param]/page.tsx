import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Settings_Prod } from "@/env/settings.prod";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { ConceptPage } from "@/features/entryscape/concept-page";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { resolveEntryStoreRoute } from "@/utilities/entrystore/resolve-entry-store-route";

interface PageProps {
  params: Promise<{ locale: string; term: string; param: string }>;
}

export default async function TerminologyParam({ params }: PageProps) {
  const { locale, term, param } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const host = (await headers()).get("host") ?? "";
  const isSandbox = host.includes("sandbox");
  const env = { ...(isSandbox ? new Settings_Sandbox() : new Settings_Prod()) };

  const result = await resolveEntryStoreRoute(
    {
      pathPrefix: "/concepts",
      redirectPath: "/terminology",
      entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
      param: term,
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
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="terminology"
    >
      <ConceptPage />
    </EntrystoreProvider>
  );
}
