import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { OrganisationPage } from "@/app/[locale]/(entryscape)/_components/organisation-page";
import { isAppLocale } from "@/i18n/routing";
import { EntrystoreProvider } from "@/lib/entrystore/provider";
import { getEntryscapeEnv, splitEntryId } from "@/lib/entrystore/route-helpers";

interface PageProps {
  params: Promise<{ locale: string; org: string }>;
}

export default async function Organisation({ params }: PageProps) {
  const { locale, org } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { env } = await getEntryscapeEnv();
  const { cid, eid } = splitEntryId(org);

  return (
    <EntrystoreProvider env={env} cid={cid} eid={eid} pageType="organisation">
      <OrganisationPage />
    </EntrystoreProvider>
  );
}
