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
    path: "/exempel-pa-ateranvandning",
    title: "Exempel på återanvändning av data",
    description:
      "Läs om hur olika dataanvändare har skapat nytta och innovation från data som har delats av offentliga aktörer.",
  });
}

export default async function ExempelPaAteranvandningPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getGoodExamplesList(locale, {
    reuse: true,
    heading: "Exempel på återanvändning av data",
    breadcrumb: "Exempel på återanvändning",
    preamble:
      "Läs om hur olika dataanvändare har skapat nytta och innovation från data som har delats av offentliga aktörer.",
    basePath: "/exempel-pa-ateranvandning",
  });

  return (
    <PageWithHero
      heading={data.heading}
      preamble={data.preamble}
      imageUrl="/images/exampleReuseHero.jpg"
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
