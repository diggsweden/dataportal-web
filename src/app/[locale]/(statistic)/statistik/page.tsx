import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StatisticPage } from "@/app/[locale]/(statistic)/components/statistic-page";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { SettingsUtil } from "@/env";
import { isAppLocale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
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
  const canonicalPath = `${includeLangInPath(locale)}/statistik`;
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

export default async function StatistikRSCPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const breadcrumb = buildBreadcrumb(
    t("pages.statistic.statistic-page-header"),
    [],
  );

  return (
    <>
      <BreadcrumbSetter {...breadcrumb} />
      <StatisticPage />
    </>
  );
}
