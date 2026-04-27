import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/layout/hero";
import { LayoutBreadcrumbs } from "@/components/navigation/layout-breadcrumbs";
import { SettingsUtil } from "@/env";
import { ListPage } from "@/features/pages/list-page";
import { isAppLocale } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";
import { getToolsList } from "@/utilities/query-helpers";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

interface PageProps {
  params: Promise<{ locale: string }>;
}

const heroImage = {
  __typename: "dataportal_Digg_Image" as const,
  url: "/images/stodOchVerktygHero.png",
  name: null,
  alt: null,
  description: null,
  mime: "image/png",
  ext: ".png",
  width: 1200,
  height: 300,
  screen9: { id: "" },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};

  const env = SettingsUtil.create();
  const canonicalPath = `${includeLangInPath(locale)}/stod-och-verktyg`;
  const canonicalUrl = `${env.CANONICAL_URL}${canonicalPath}`;
  const title = "Stöd och verktyg - Sveriges Dataportal";
  const description =
    "Här kan du som dataproducent eller dataanvändare hitta olika fomer av verktyg och stöd för ditt arbete. Målet är att data ska kunna nyttjas som en strategisk resurs för samhället och att det ska vara så enkelt som möjligt att nå dit.";
  const allowSEO = env.envName === "prod";

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: { follow: allowSEO, index: allowSEO },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sveriges Dataportal",
      type: "website",
    },
    twitter: { title, description },
    other: { language: locale },
  };
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
    <>
      <Hero heading={data.heading} preamble={data.preamble} image={heroImage} />
      <LayoutBreadcrumbs />
      <ListPage
        listItems={data.listItems}
        heading={data.heading ?? "Stöd och verktyg"}
        type={data.type}
      />
    </>
  );
}
