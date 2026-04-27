import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StatisticPage } from "@/features/statistic/statistic-page";
import { isAppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/utilities/page-metadata";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};

  const t = await getTranslations({ locale });

  return buildPageMetadata({
    locale,
    path: "/statistik",
    title: t("pages.statistic.statistic-page-header"),
  });
}

export default async function StatistikRSCPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  return <StatisticPage />;
}
