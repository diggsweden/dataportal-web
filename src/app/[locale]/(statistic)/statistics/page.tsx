import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { Statistic } from "@/components/statistic";
import { StatisticGraphNumbers } from "@/components/statistic/statistic-graph-numbers";
import { StatisticNumbersDatasets } from "@/components/statistic/statistic-numbers-datasets";
import { Heading } from "@/components/typography/heading";
import { SettingsUtil } from "@/env";
import { getPathname } from "@/i18n/navigation";
import { isAppLocale } from "@/i18n/routing";
import {
  getStatisticHistory,
  getStatisticNumbers,
  getTopCategories,
  getTopOrganisations,
} from "@/lib/statistic";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

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
  const canonicalPath = getPathname({ locale, href: "/statistics" });
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

export default async function StatisticsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const env = SettingsUtil.create();

  const [history, numbers, organisations, categories] = await Promise.all([
    getStatisticHistory(env),
    getStatisticNumbers(env),
    getTopOrganisations(env),
    getTopCategories(env, locale),
  ]);

  const breadcrumb = buildBreadcrumb(
    t("pages.statistic.statistic-page-header"),
    [],
  );

  return (
    <>
      <BreadcrumbSetter {...breadcrumb} />
      <Container>
        <Heading level={1} size="lg" className="mb-lg md:mb-xl">
          {t("pages.statistic.statistic-page-header")}
        </Heading>
        <div className="max-w-md">
          <p className="mb-xl text-lg text-brown-600">
            {t("pages.statistic.statistic-page-text")}
          </p>
          <StatisticGraphNumbers history={history} />
          <p className="mb-xl mt-md">
            {t("pages.statistic.statistic-page-numberofdatasets")}{" "}
            <StatisticNumbersDatasets count={numbers.datasetCount} />
          </p>
          <div className="flex flex-col gap-xl">
            <Statistic organisations={organisations} categories={categories} />
          </div>
        </div>
      </Container>
    </>
  );
}
