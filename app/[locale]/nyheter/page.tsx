import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PageWithHero } from "@/components/layout/page-with-hero";
import { ListPage } from "@/features/pages/list-page";
import { isAppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/utilities/page-metadata";
import { getNewsList } from "@/utilities/query-helpers";

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
    path: "/nyheter",
    title: "Nyheter",
    description: "Nyheter för Sveriges Dataportal",
  });
}

export default async function NyheterPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getNewsList(locale, {
    heading: "Nyheter",
    preamble: "Nyheter för Sveriges Dataportal",
    basePath: "/nyheter",
  });

  return (
    <PageWithHero
      heading={data.heading}
      preamble={data.preamble}
      imageUrl="/images/newsHero.png"
    >
      <ListPage
        listItems={data.listItems}
        heading={data.heading ?? "Nyheter"}
        type={data.type}
        searchParams={{ page: sp.page as string, filter: sp.filter as string }}
      />
    </PageWithHero>
  );
}
