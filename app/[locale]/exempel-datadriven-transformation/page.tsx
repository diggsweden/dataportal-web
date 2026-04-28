import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PageWithHero } from "@/components/layout/page-with-hero";
import { ListPage } from "@/features/pages/list-page";
import { isAppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/utilities/page-metadata";
import { getGoodExamplesList } from "@/utilities/query-helpers";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};

  return buildPageMetadata({
    locale,
    path: "/exempel-datadriven-transformation",
    title: "Goda exempel",
    description: "Goda exempel på datadriven innovation i samhället.",
  });
}

export default async function ExempelDatadrivenTransformationPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getGoodExamplesList(locale, {
    reuse: false,
    heading: "Goda exempel från offentliga aktörer",
    breadcrumb: "Goda exempel",
    preamble:
      "Läs om goda exempel på hur offentliga aktörer arbetar med datadriven transformation.",
    basePath: "/exempel-datadriven-transformation",
  });

  return (
    <PageWithHero
      heading={data.heading}
      preamble={data.preamble}
      imageUrl="/images/goodExamplesHero.jpg"
    >
      <ListPage
        listItems={data.listItems}
        heading={data.heading ?? ""}
        type={data.type}
        breadcrumb={data.breadcrumb}
        searchParams={{ page: sp.page as string, filter: sp.filter as string }}
      />
    </PageWithHero>
  );
}
