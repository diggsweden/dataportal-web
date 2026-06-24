import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/layout/hero";
import { SettingsUtil } from "@/env";
import { ListPage } from "@/features/pages/list-page";
import { isAppLocale } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";
import { getNewsList } from "@/utilities/query-helpers";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string }>;
}

const heroImage = {
  __typename: "dataportal_Digg_Image" as const,
  url: "/images/newsHero.png",
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
  const canonicalPath = `${includeLangInPath(locale)}/nyheter`;
  const canonicalUrl = `${env.CANONICAL_URL}${canonicalPath}`;
  const title = "Nyheter - Sveriges Dataportal";
  const description = "Nyheter för Sveriges Dataportal";
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

export default async function NyheterPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getNewsList(locale, {
    heading: "Nyheter",
    preamble: "Nyheter för Sveriges Dataportal",
    basePath: "/nyheter",
  });

  return (
    <>
      <Hero heading={data.heading} preamble={data.preamble} image={heroImage} />
      <ListPage
        listItems={data.listItems}
        heading={data.heading ?? "Nyheter"}
        type={data.type}
      />
    </>
  );
}
