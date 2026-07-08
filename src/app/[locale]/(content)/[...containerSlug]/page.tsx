import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { ImageFragment, mediaTypeToImage } from "@/components/custom-image";
import { PageShell } from "@/components/layout/page-shell";
import { SeoDataFragment } from "@/components/meta-data";
import { SettingsUtil } from "@/env";
import { ParentFragment } from "@/graphql/fragments";
import { getFragmentData } from "@/graphql/gql";
import { isAppLocale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
import { includeLangInPath } from "@/utilities/check-lang";

import { ContainerPage } from "./_components/container-page";
import { LandingPage } from "./_components/landing-page";
import { getMultiContainer } from "./data";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; containerSlug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, containerSlug } = await params;
  if (!isAppLocale(locale)) return {};

  const result = await getMultiContainer(containerSlug, locale);
  if (!result) return {};

  const container = result.container;
  if (!container) return {};

  const seo = getFragmentData(SeoDataFragment, container.seo);
  const seoImage = getFragmentData(ImageFragment, seo?.image);
  const containerImage = getFragmentData(
    ImageFragment,
    mediaTypeToImage(container.image),
  );
  const env = SettingsUtil.create();
  const slug = `/${containerSlug.join("/")}`;
  const canonicalPath = `${includeLangInPath(locale)}${slug}`;
  const canonicalUrl = `${env.CANONICAL_URL}${canonicalPath}`;
  const title = seo?.title
    ? `${seo.title} - Sveriges Dataportal`
    : container.heading
      ? `${container.heading} - Sveriges Dataportal`
      : "Sveriges Dataportal";
  const description = seo?.description ?? container.preamble ?? undefined;
  const allowSEO = env.envName === "prod";
  const mediaBase = process.env.REACT_APP_MEDIA_BASE_URL ?? "";
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

export default async function ContainerSlugPage({ params }: PageProps) {
  const { locale, containerSlug } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const result = await getMultiContainer(containerSlug, locale);
  if (!result) notFound();

  const { container, related } = result;
  if (!container) notFound();

  const slug = containerSlug.join("/");
  const isSearchPage = slug === "data-apier" || slug === "data-apis";

  const parentData = getFragmentData(ParentFragment, container.parent);
  const parentCrumbs =
    parentData?.heading && parentData.slug
      ? [{ name: parentData.heading, link: parentData.slug }]
      : [];

  return (
    <PageShell
      heading={container.heading}
      preamble={isSearchPage ? null : container.preamble}
      image={container.image ? mediaTypeToImage(container.image) : undefined}
      breadcrumb={buildBreadcrumb(container.heading ?? "", parentCrumbs)}
      search={isSearchPage}
    >
      {container.landingPage ? (
        <LandingPage
          {...container}
          locale={locale}
          pathname={`${includeLangInPath(locale)}/${containerSlug.join("/")}`}
        />
      ) : (
        <ContainerPage
          {...container}
          related={related?.filter(
            (r): r is NonNullable<typeof r> => r !== null,
          )}
        />
      )}
    </PageShell>
  );
}
