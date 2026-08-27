import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { ApplicationProfilePage } from "@/app/[locale]/(entryscape)/_components/application-profile-page";
import type { EnvSettings } from "@/env";
import { getResourceLabel } from "@/i18n/get-resource-label";
import { getTranslations } from "@/i18n/get-translations";
import { type AppLocale, isAppLocale } from "@/i18n/routing";
import { EntrystoreService } from "@/lib/entrystore/entrystore.service";
import { getLocalizedValue } from "@/lib/entrystore/entrystore-helpers";
import { EntrystoreProvider } from "@/lib/entrystore/provider";
import { getEntryscapeEnv, splitEntryId } from "@/lib/entrystore/route-helpers";

interface PageProps {
  params: Promise<{ locale: string; spec: string; id: string }>;
}

export default async function ApplicationProfile({ params }: PageProps) {
  const { locale, spec, id } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const { env } = await getEntryscapeEnv();
  const { cid, eid } = splitEntryId(id);
  const specTitle = await getSpecTitle(spec, locale, env);

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      pageType="application-profile"
    >
      <ApplicationProfilePage spec={spec} specTitle={specTitle} />
    </EntrystoreProvider>
  );
}

async function getSpecTitle(spec: string, locale: AppLocale, env: EnvSettings) {
  const { cid, eid } = splitEntryId(spec);
  if (!cid || !eid) return spec;

  try {
    const [t, resourceLabel] = await Promise.all([
      getTranslations(locale),
      getResourceLabel(locale),
    ]);
    const specEntry = await EntrystoreService.getInstance({
      env,
      lang: locale,
      t,
      resourceLabel,
    }).getEntry(cid, eid);

    return (
      getLocalizedValue(specEntry.getAllMetadata(), "dcterms:title") || spec
    );
  } catch {
    return spec;
  }
}
