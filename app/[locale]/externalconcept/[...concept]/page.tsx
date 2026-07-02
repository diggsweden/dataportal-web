import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { isAppLocale } from "@/i18n/routing";
import { resolveEntryStoreRoute } from "@/lib/entrystore/resolve-entry-store-route";

interface PageProps {
  params: Promise<{ locale: string; concept: string[] }>;
}

export default async function ExternalConceptCatchAll({ params }: PageProps) {
  const { locale, concept } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const host = (await headers()).get("host") ?? "";
  const isSandbox = host.includes("sandbox");

  const result = await resolveEntryStoreRoute(
    {
      pathPrefix: "/concepts",
      redirectPath: "/concepts",
      entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
      param: concept,
    },
    locale,
    isSandbox,
  );

  if (result.type === "redirect") redirect(result.url);
  notFound();
}
