import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/layout/hero";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { SettingsUtil } from "@/env";
import { ContainerPage } from "@/features/pages/container-page";
import { LandingPage } from "@/features/pages/landing-page";
import { isAppLocale } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";
import { getMultiContainer } from "@/utilities/query-helpers";

interface PageProps {
  params: Promise<{ locale: string; containerSlug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, containerSlug } = await params;
  if (!isAppLocale(locale)) return {};

  const result = await getMultiContainer(containerSlug, locale);
  if ("notFound" in result) return {};

  const container = result.props.container;
  if (!container) return {};

  const seo = container.seo;
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
  const ogImage = seo?.image?.url
    ? `${mediaBase}${seo.image.url}`
    : container.image?.url
      ? `${mediaBase}${container.image.url}`
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
  if ("notFound" in result) notFound();

  const { container, related } = result.props;
  if (!container) notFound();

  return (
    <>
      {container.image && (
        <Hero
          heading={container.heading}
          preamble={container.preamble}
          image={container.image}
        />
      )}
      <PageBreadcrumbs />
      {container.landingPage ? (
        <LandingPage {...container} />
      ) : (
        <ContainerPage
          {...container}
          related={related?.filter(
            (r): r is NonNullable<typeof r> => r !== null,
          )}
        />
      )}
    </>
  );
}
