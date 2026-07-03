import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PublicationList } from "@/app/[locale]/(content)/(publications)/components/publication-list";
import { ImageFragment } from "@/components/custom-image";
import { PageShell } from "@/components/layout/page-shell";
import { SettingsUtil } from "@/env";
import { makeFragmentData } from "@/graphql/gql";
import { isAppLocale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
import { includeLangInPath } from "@/utilities/check-lang";
import { getNewsList } from "./data";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const heroImage = makeFragmentData(
  {
    __typename: "dataportal_Digg_Image",
    url: "/images/newsHero.png",
    name: null,
    alt: null,
    description: null,
    mime: "image/png",
    ext: ".png",
    width: 1200,
    height: 300,
    screen9: { id: "" },
  },
  ImageFragment,
);

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

export default async function NyheterPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const resolvedSearchParams = await searchParams;

  const data = await getNewsList(locale, {
    heading: "Nyheter",
    preamble: "Nyheter för Sveriges Dataportal",
    basePath: "/nyheter",
  });

  return (
    <PageShell
      heading={data.heading}
      preamble={data.preamble}
      image={heroImage}
      breadcrumb={buildBreadcrumb(data.heading ?? "Nyheter", [])}
    >
      <PublicationList
        listItems={data.listItems}
        heading={data.heading ?? "Nyheter"}
        type={data.type}
        searchParams={resolvedSearchParams}
      />
    </PageShell>
  );
}
