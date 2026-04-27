import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { SettingsUtil } from "@/env";
import { StatisticPage } from "@/features/statistic/statistic-page";
import { isAppLocale } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};

  const t = await getTranslations({ locale });
  const env = SettingsUtil.create();
  const canonicalPath = `${includeLangInPath(locale)}/statistics`;
  const canonicalUrl = `${env.CANONICAL_URL}${canonicalPath}`;
  const title = `${t("pages.statistic.statistic-page-header")} - Sveriges dataportal`;
  const allowSEO = env.envName === "prod";

  return {
    title,
    alternates: { canonical: canonicalUrl },
    robots: { follow: allowSEO, index: allowSEO },
    openGraph: { title, url: canonicalUrl, siteName: "Sveriges Dataportal" },
    twitter: { title },
    other: { language: locale },
  };
}

export default async function StatisticsRSCPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <PageBreadcrumbs />
      <StatisticPage />
    </>
  );
}
