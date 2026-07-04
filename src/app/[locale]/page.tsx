import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getStartPage } from "@/app/[locale]/data";
import { BlockList } from "@/components/blocks/block-list";
import { ButtonLink } from "@/components/button";
import { ContentBox } from "@/components/content-box";
import { ImageFragment, mediaTypeToImage } from "@/components/custom-image";
import { Container } from "@/components/layout/container";
import { Hero } from "@/components/layout/hero";
import { SeoDataFragment } from "@/components/meta-data";
import { Statistic } from "@/components/statistic";
import { StatisticGraph } from "@/components/statistic/statistic-graph";
import { StatisticNumbers } from "@/components/statistic/statistic-numbers";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { SettingsUtil } from "@/env";
import { getFragmentData } from "@/graphql/gql";
import { getResourceLabel } from "@/i18n/get-resource-label";
import { getPathname, Link } from "@/i18n/navigation";
import { isAppLocale } from "@/i18n/routing";
import {
  getStatisticHistory,
  getStatisticNumbers,
  getTopCategories,
  getTopOrganisations,
} from "@/lib/statistic";
import { dataCategories } from "@/utilities/data-categories";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * SEO for the start page, in the Next 15 `Metadata` shape. Most fields
 * come from the CMS via `seo`; falls back to the Swedish/English copy
 * we ship in `locales/{sv,en}/pages.json`.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};

  const [t, data] = await Promise.all([
    getTranslations({ locale }),
    getStartPage(locale),
  ]);
  const seo = getFragmentData(SeoDataFragment, data.seo);
  const seoImage = getFragmentData(ImageFragment, seo?.image);

  const env = SettingsUtil.create();
  const canonicalPath = getPathname({ locale, href: "/" });
  const canonicalUrl = `${env.CANONICAL_URL}${canonicalPath}`;
  const title = seo?.title
    ? `${seo.title} - Sveriges Dataportal`
    : "Sveriges Dataportal";
  const defaultDescription =
    "Sveriges nationella dataportal för att hitta, utforska och använda data från offentlig och privat sektor";
  const description =
    seo?.description ?? t("pages.startpage.preamble") ?? defaultDescription;
  const mediaBase = process.env.REACT_APP_MEDIA_BASE_URL ?? "";
  const ogImage = seoImage?.url
    ? `${mediaBase}${seoImage.url}`
    : "/images/svdp-favicon-150.png";

  // `<MetaData>` only allows follow/index in prod + non-draft. Start
  // page is never a draft route, so we just gate on env.
  const allowSEO = env.envName === "prod";

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
    twitter: {
      title,
      description,
      images: [ogImage],
    },
    other: {
      language: locale,
    },
  };
}

/**
 * App Router start page. The page body is small enough (Hero, blocks,
 * data-category shortcuts, statistics) that there's no reason for an
 * intermediary client component — it's inlined here.
 *
 * Server-rendered top to bottom: data-category shortcut links use
 * `getResourceLabel(locale)` (the server twin of `useResourceLabel`)
 * so the `<ContentBox>` ships as static HTML. The statistic widgets are
 * plain server components too — the live EntryStore counts are fetched
 * here via `@/lib/statistic` (cached) and passed down as props, so no
 * client `useEffect` waterfall and no `dynamic({ ssr: false })`.
 */
export default async function LocaleStartPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const [t, tResource, data] = await Promise.all([
    getTranslations({ locale }),
    getResourceLabel(locale),
    getStartPage(locale),
  ]);

  // `getStartPage` returns an empty `{ type: "StartPage" }` stub when the
  // GraphQL fetch fails (see `./data`). `id` is the cheapest distinguishing
  // field — treat its absence as "nothing to render" rather than crash.
  if (!data.id) return null;

  const { heading, preamble, image, blocks } = data;

  // Live statistic counts are fetched server-side (cached in `@/lib/statistic`)
  // and passed to the presentational widgets as props.
  const env = SettingsUtil.create();
  const [history, numbers, organisations, categories] = await Promise.all([
    getStatisticHistory(env),
    getStatisticNumbers(env),
    getTopOrganisations(env),
    getTopCategories(env, locale),
  ]);

  const searchProps = {
    destination: getPathname({ locale, href: "/datasets" }),
    placeholder: t("pages.startpage.search_placeholder"),
  };

  return (
    <>
      {image && (
        <Hero
          heading={heading}
          preamble={preamble}
          image={mediaTypeToImage(image)}
          search={searchProps}
          isFrontpage
        />
      )}

      <Container>
        <div id="startPage" className="space-y-md lg:space-y-xl">
          {!image && heading && (
            <Heading level={1} size="lg" className="mb-lg md:mb-xl">
              {heading}
            </Heading>
          )}
          {!image && preamble && (
            <Preamble className="max-w-md">{preamble}</Preamble>
          )}

          <div className="mb-xl">
            {blocks && <BlockList blocks={blocks} landingPage={true} />}
          </div>

          <ContentBox heading={t("pages.startpage.datasets_by_category")}>
            <ul className="flex flex-wrap justify-center gap-md lg:gap-lg">
              {dataCategories.map((category) => (
                <li key={category.href}>
                  <ButtonLink
                    className="text-center"
                    aria-label={t("pages.startpage.search_datasets_format", {
                      category: tResource(category.href),
                    })}
                    href={`/${t("routes.datasets.path")}?f=${encodeURIComponent(
                      `http://www.w3.org/ns/dcat#theme||${
                        category.href
                      }||FALSE||uri||${tResource(
                        "http://www.w3.org/ns/dcat#theme",
                      )}||${tResource(category.href)}`,
                    )}`}
                    label={tResource(category.href)}
                  />
                </li>
              ))}
            </ul>
          </ContentBox>

          <section id="statistics" className="my-xl">
            <div className="mb-2xl flex flex-col justify-between gap-sm md:flex-row md:items-end">
              <Heading level={2} size="lg">
                {t("pages.statistic.statistic-numbers")}
              </Heading>
              <Link
                href="/statistics"
                className="statistic-link"
                aria-label={t("pages.statistic.statistic-link-aria")}
              >
                {t("pages.statistic.statistic-link")}
              </Link>
            </div>

            <div className="mb-2xl flex flex-wrap justify-between">
              <StatisticGraph points={history} />
              <StatisticNumbers
                datasetCount={numbers.datasetCount}
                publisherCount={numbers.publisherCount}
              />
            </div>
            <div className="flex flex-col items-start gap-xl md:grid md:grid-cols-2">
              <Statistic
                organisations={organisations}
                categories={categories}
              />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
