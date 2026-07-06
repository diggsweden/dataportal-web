import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PublicationFull } from "@/app/[locale]/(content)/(publications)/_components/publication-full";
import { getGoodExample } from "@/app/[locale]/(content)/(publications)/(examples)/data";
import { ImageFragment, mediaTypeToImage } from "@/components/custom-image";
import { PageShell } from "@/components/layout/page-shell";
import { SettingsUtil } from "@/env";
import { getFragmentData } from "@/graphql/gql";
import { isAppLocale } from "@/i18n/routing";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
import { includeLangInPath } from "@/utilities/check-lang";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isAppLocale(locale)) return {};

  const publication = await getGoodExample(`/${slug}`, locale, {}, false);
  if (!publication) return {};
  const env = SettingsUtil.create();
  const canonicalPath = `${includeLangInPath(locale)}/exempel-datadriven-transformation/${slug}`;
  const canonicalUrl = `${env.CANONICAL_URL}${canonicalPath}`;
  const title = publication.heading
    ? `${publication.heading} - Sveriges Dataportal`
    : "Sveriges Dataportal";
  const description = publication.preamble ?? undefined;
  const allowSEO = env.envName === "prod";
  const mediaBase = process.env.REACT_APP_MEDIA_BASE_URL ?? "";
  const publicationImage = getFragmentData(
    ImageFragment,
    mediaTypeToImage(publication.image),
  );
  const ogImage = publicationImage?.url
    ? `${mediaBase}${publicationImage.url}`
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

  const data = await getGoodExample(`/${slug}`, locale, {}, false);
  if (!data) notFound();

  return (
    <PageShell
      heading={data.heading}
      image={data.image ? mediaTypeToImage(data.image) : undefined}
      breadcrumb={buildBreadcrumb(data.heading ?? "", [
        { name: "Goda Exempel", link: "/exempel-datadriven-transformation" },
      ])}
    >
      <PublicationFull {...data} />
    </PageShell>
  );
}
