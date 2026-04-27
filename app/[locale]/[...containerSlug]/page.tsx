import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PageWithHero } from "@/components/layout/page-with-hero";
import { ContainerPage } from "@/features/pages/container-page";
import { LandingPage } from "@/features/pages/landing-page";
import { isAppLocale } from "@/i18n/routing";
import {
  buildPageMetadata,
  resolveCmsOgImage,
} from "@/utilities/page-metadata";
import { getMultiContainer } from "@/utilities/query-helpers";

export const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || "60", 10);

interface PageProps {
  params: Promise<{ locale: string; containerSlug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, containerSlug } = await params;
  if (!isAppLocale(locale)) return {};

  const result = await getMultiContainer(containerSlug, locale);
  if (!result?.container) return {};

  const { container } = result;
  const seo = container.seo;

  return buildPageMetadata({
    locale,
    path: `/${containerSlug.join("/")}`,
    title: seo?.title ?? container.heading,
    description: seo?.description ?? container.preamble,
    ogImage:
      resolveCmsOgImage(seo?.image?.url ?? container.image?.url) ??
      "/images/svdp-favicon-150.png",
    robotsFollow: seo?.robotsFollow,
    robotsIndex: seo?.robotsIndex,
  });
}

export default async function ContainerSlugPage({ params }: PageProps) {
  const { locale, containerSlug } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const result = await getMultiContainer(containerSlug, locale);
  if (!result) notFound();

  const { container, related } = result;
  if (!container) notFound();

  return (
    <PageWithHero
      heading={container.heading}
      preamble={container.preamble}
      image={container.image}
    >
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
    </PageWithHero>
  );
}
