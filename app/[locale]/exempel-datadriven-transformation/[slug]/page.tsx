import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/layout/hero";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { SettingsUtil } from "@/env";
import { PublicationFull } from "@/features/publication/publication-full";
import { isAppLocale } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";
import { getGoodExample } from "@/utilities/query-helpers";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) return {};

  const result = await getGoodExample(
    `/${slug}`,
    locale,
    { revalidate: true },
    false,
  );
  if ("notFound" in result) return {};

  const publication = result.props;
  const env = SettingsUtil.create();
  const canonicalPath = `${includeLangInPath(locale)}/exempel-datadriven-transformation/${slug}`;
  const canonicalUrl = `${env.CANONICAL_URL}${canonicalPath}`;
  const title = publication.heading
    ? `${publication.heading} - Sveriges Dataportal`
    : "Sveriges Dataportal";
  const description = publication.preamble ?? undefined;
  const allowSEO = env.envName === "prod";
  const mediaBase = process.env.REACT_APP_MEDIA_BASE_URL ?? "";
  const ogImage = publication.image?.url
    ? `${mediaBase}${publication.image.url}`
    : "/images/svdp-favicon-150.png";

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
      images: [ogImage],
      type: "article",
    },
    twitter: { title, description, images: [ogImage] },
    other: { language: locale },
  };
}

export default async function ExempelDatadrivenTransformationSlugPage({
  params,
}: PageProps) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const result = await getGoodExample(
    `/${slug}`,
    locale,
    { revalidate: true },
    false,
  );
  if ("notFound" in result) notFound();

  const data = result.props;

  return (
    <>
      {data.image && <Hero heading={data.heading} image={data.image} />}
      <PageBreadcrumbs />
      <PublicationFull {...data} />
    </>
  );
}
