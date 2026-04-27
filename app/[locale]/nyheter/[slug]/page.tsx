import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PageWithHero } from "@/components/layout/page-with-hero";
import { PublicationFull } from "@/features/publication/publication-full";
import { isAppLocale } from "@/i18n/routing";
import {
  buildPageMetadata,
  resolveCmsOgImage,
} from "@/utilities/page-metadata";
import { getNewsItem } from "@/utilities/query-helpers";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) return {};

  const publication = await getNewsItem(`/${slug}`, locale);
  if (!publication) return {};

  return buildPageMetadata({
    locale,
    path: `/nyheter/${slug}`,
    title: publication.heading,
    description: publication.preamble,
    ogImage:
      resolveCmsOgImage(publication.image?.url) ??
      "/images/svdp-favicon-150.png",
    ogType: "article",
  });
}

export default async function NyheterSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await getNewsItem(`/${slug}`, locale);
  if (!data) notFound();

  return (
    <PageWithHero heading={data.heading} image={data.image}>
      <PublicationFull {...data} />
    </PageWithHero>
  );
}
