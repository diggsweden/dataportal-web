import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/layout/hero";
import { SettingsUtil } from "@/env";
import { ListPage } from "@/features/pages/list-page";
import { isAppLocale } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";
import { getGoodExamplesList } from "@/utilities/query-helpers";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

interface PageProps {
  params: Promise<{ locale: string }>;
}

const heroImage = {
  __typename: "dataportal_Digg_Image" as const,
  url: "/images/goodExamplesHero.jpg",
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
  const canonicalPath = `${includeLangInPath(locale)}/exempel-datadriven-transformation`;
  const canonicalUrl = `${env.CANONICAL_URL}${canonicalPath}`;
  const title = "Goda exempel - Sveriges Dataportal";
  const description = "Goda exempel på datadriven innovation i samhället.";
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

export default async function ExempelDatadrivenTransformationPage({
  params,
}: PageProps) {
  const { locale } = await params;
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
    <>
      <Hero heading={data.heading} preamble={data.preamble} image={heroImage} />
      <ListPage
        listItems={data.listItems}
        heading={data.heading ?? ""}
        type={data.type}
        breadcrumb={data.breadcrumb}
      />
    </>
  );
}
