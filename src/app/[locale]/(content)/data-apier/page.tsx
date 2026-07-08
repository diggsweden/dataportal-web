import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { ImageFragment, mediaTypeToImage } from "@/components/custom-image";
import { PageShell } from "@/components/layout/page-shell";
import { SeoDataFragment } from "@/components/meta-data";
import { SettingsUtil } from "@/env";
import { getFragmentData } from "@/graphql/gql";
import { isAppLocale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
import { includeLangInPath } from "@/utilities/check-lang";

import { LandingPage } from "../[...containerSlug]/_components/landing-page";
import { getMultiContainer } from "../[...containerSlug]/data";

export const revalidate = 60;

const SLUG_BY_LOCALE: Record<string, string> = {
  sv: "data-apier",
  en: "data-apis",
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};

  const slug = SLUG_BY_LOCALE[locale] ?? SLUG_BY_LOCALE.sv;
  const container = (await getMultiContainer([slug], locale))?.container;
  if (!container) return {};

  const env = SettingsUtil.create();
  const seo = getFragmentData(SeoDataFragment, container.seo);
  const seoImage = getFragmentData(ImageFragment, seo?.image);
  const containerImage = getFragmentData(
    ImageFragment,
    mediaTypeToImage(container.image),
  );
  const allowSEO = env.envName === "prod";
  const mediaBase = process.env.REACT_APP_MEDIA_BASE_URL ?? "";
  const canonicalUrl = `${env.CANONICAL_URL}${includeLangInPath(locale)}/${slug}`;

  const title = seo?.title
    ? `${seo.title} - Sveriges Dataportal`
    : container.heading
      ? `${container.heading} - Sveriges Dataportal`
      : "Sveriges Dataportal";
  const description = seo?.description ?? container.preamble ?? undefined;
  const ogImage = seoImage?.url
    ? `${mediaBase}${seoImage.url}`
    : containerImage?.url
      ? `${mediaBase}${containerImage.url}`
      : "/images/svdp-favicon-150.png";

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: {
      follow: allowSEO && (seo?.robotsFollow ?? true),
      index: allowSEO && (seo?.robotsIndex ?? true),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sveriges Dataportal",
      images: [ogImage],
      type: "website",
    },
    twitter: { title, description, images: [ogImage] },
    other: { language: locale },
  };
}

export default async function SearchApiPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const slug = SLUG_BY_LOCALE[locale] ?? SLUG_BY_LOCALE.sv;
  const result = await getMultiContainer([slug], locale);
  if (!result?.container) notFound();

  const { container } = result;

  return (
    <PageShell
      heading={container.heading}
      image={container.image ? mediaTypeToImage(container.image) : undefined}
      breadcrumb={buildBreadcrumb(container.heading ?? "", [])}
      search
    >
      <LandingPage
        {...container}
        locale={locale}
        pathname={`${includeLangInPath(locale)}/${slug}`}
      />
    </PageShell>
  );
}
