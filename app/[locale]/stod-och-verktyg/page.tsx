import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PageWithHero } from "@/components/layout/page-with-hero";
import { ListPage } from "@/features/pages/list-page";
import { isAppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/utilities/page-metadata";
import { getToolsList } from "@/utilities/query-helpers";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};

  return buildPageMetadata({
    locale,
    path: "/stod-och-verktyg",
    title: "Stöd och verktyg",
    description:
      "Här kan du som dataproducent eller dataanvändare hitta olika fomer av verktyg och stöd för ditt arbete. Målet är att data ska kunna nyttjas som en strategisk resurs för samhället och att det ska vara så enkelt som möjligt att nå dit.",
  });
}

export default async function StodOchVerktygPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getToolsList({
    heading: "Stöd och verktyg",
    preamble:
      "Här kan du som dataproducent eller dataanvändare hitta olika fomer av verktyg och stöd för ditt arbete. Målet är att data ska kunna nyttjas som en strategisk resurs för samhället och att det ska vara så enkelt som möjligt att nå dit.",
    basePath: "/stod-och-verktyg",
  });

  return (
    <PageWithHero
      heading={data.heading}
      preamble={data.preamble}
      imageUrl="/images/stodOchVerktygHero.png"
    >
      <ListPage
        listItems={data.listItems}
        heading={data.heading ?? "Stöd och verktyg"}
        type={data.type}
      />
    </PageWithHero>
  );
}
