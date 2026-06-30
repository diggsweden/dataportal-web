import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { isAppLocale } from "@/i18n/routing";
import { resolveEntryStoreRoute } from "@/lib/entrystore/resolve-entry-store-route";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ resource?: string }>;
}

export default async function ExternalSpecification({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { resource } = await searchParams;
  if (!resource) notFound();

  const host = (await headers()).get("host") ?? "";
  const isSandbox = host.includes("sandbox");

  const result = await resolveEntryStoreRoute(
    {
      pathPrefix: "/specifications",
      redirectPath: "/specifications",
      entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
    },
    locale,
    isSandbox,
    resource,
  );

  if (result.type === "redirect") redirect(result.url);
  notFound();
}
