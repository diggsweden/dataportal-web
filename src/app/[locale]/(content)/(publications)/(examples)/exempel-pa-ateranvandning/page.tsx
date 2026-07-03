import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getGoodExamplesList } from "@/app/[locale]/(content)/(publications)/(examples)/data";
import { PublicationList } from "@/app/[locale]/(content)/(publications)/components/publication-list";
import { ImageFragment } from "@/components/custom-image";
import { PageShell } from "@/components/layout/page-shell";
import { SettingsUtil } from "@/env";
import { makeFragmentData } from "@/graphql/gql";
import { isAppLocale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
import { includeLangInPath } from "@/utilities/check-lang";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const heroImage = makeFragmentData(
  {
    __typename: "dataportal_Digg_Image" as const,
    url: "/images/exampleReuseHero.jpg",
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
  const canonicalPath = `${includeLangInPath(locale)}/exempel-pa-ateranvandning`;
  const canonicalUrl = `${env.CANONICAL_URL}${canonicalPath}`;
  const title = "Exempel på återanvändning av data";
  const description =
    "Läs om hur olika dataanvändare har skapat nytta och innovation från data som har delats av offentliga aktörer.";
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

export default async function ExempelPaAteranvandningPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const resolvedSearchParams = await searchParams;

  const data = await getGoodExamplesList(locale, {
    reuse: true,
    heading: "Exempel på återanvändning av data",
    breadcrumb: "Exempel på återanvändning",
    preamble:
      "Läs om hur olika dataanvändare har skapat nytta och innovation från data som har delats av offentliga aktörer.",
    basePath: "/exempel-pa-ateranvandning",
  });

  return (
    <PageShell
      heading={data.heading}
      preamble={data.preamble}
      image={heroImage}
      breadcrumb={buildBreadcrumb(data.breadcrumb ?? data.heading ?? "", [])}
    >
      <PublicationList
        listItems={data.listItems}
        heading={data.heading ?? ""}
        type={data.type}
        breadcrumb={data.breadcrumb}
        searchParams={resolvedSearchParams}
      />
    </PageShell>
  );
}
