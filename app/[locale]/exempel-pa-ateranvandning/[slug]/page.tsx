import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/layout/hero";
import { LayoutBreadcrumbs } from "@/components/navigation/layout-breadcrumbs";
import { SettingsUtil } from "@/env";
import { PublicationFull } from "@/features/publication/publication-full";
import { isAppLocale } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";
import { getGoodExample } from "@/utilities/query-helpers";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) return {};

  const publication = await getGoodExample(`/${slug}`, locale, {}, true);
  if (!publication) return {};
  const env = SettingsUtil.create();
  const canonicalPath = `${includeLangInPath(locale)}/exempel-pa-ateranvandning/${slug}`;
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

export default async function ExempelPaAteranvandningSlugPage({
  params,
}: PageProps) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getGoodExample(`/${slug}`, locale, {}, true);
  if (!data) notFound();

  return (
    <>
      {data.image && <Hero heading={data.heading} image={data.image} />}
      <LayoutBreadcrumbs />
      <PublicationFull {...data} />
    </>
  );
}
