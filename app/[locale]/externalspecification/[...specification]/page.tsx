import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { isAppLocale } from "@/i18n/routing";
import { resolveEntryStoreRoute } from "@/utilities/entrystore/resolve-entry-store-route";

interface PageProps {
  params: Promise<{ locale: string; specification: string[] }>;
}

export default async function ExternalSpecificationCatchAll({
  params,
}: PageProps) {
  const { locale, specification } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const host = (await headers()).get("host") ?? "";
  const isSandbox = host.includes("sandbox");

  const result = await resolveEntryStoreRoute(
    {
      pathPrefix: "/concepts",
      redirectPath: "/concepts",
      entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
      param: specification,
    },
    locale,
    isSandbox,
  );

  if (result.type === "redirect") redirect(result.url);
  notFound();
}
