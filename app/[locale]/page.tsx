import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BlockList } from "@/components/blocks/block-list";
import { ButtonLink } from "@/components/button";
import { ContentBox } from "@/components/content-box";
import { Container } from "@/components/layout/container";
import { Hero } from "@/components/layout/hero";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { SettingsUtil } from "@/env";
import Statistic from "@/features/statistic";
import StatisticGraph from "@/features/statistic/statistic-graph";
import StatisticNumbers from "@/features/statistic/statistic-numbers";
import { getResourceLabel } from "@/i18n/get-resource-label";
import { isAppLocale } from "@/i18n/routing";
import { includeLangInPath } from "@/utilities/check-lang";
import { dataCategories } from "@/utilities/data-categories";
import { getStartPage } from "@/utilities/query-helpers";

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * SEO for the start page. Mirrors the tags `<MetaData>` emits in the
 * Pages Router chrome, in the Next 15 `Metadata` shape. Most fields
 * come from the CMS via `seo`; falls back to the Swedish/English copy
 * we ship in `locales/{sv,en}/pages.json`.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};

  const [t, startPageResult] = await Promise.all([
    getTranslations({ locale }),
    getStartPage(locale),
  ]);
  const data = startPageResult.props;
  const seo = data.seo ?? null;

  const env = SettingsUtil.create();
  const canonicalPath = `${includeLangInPath(locale)}/`;
  const canonicalUrl = `${env.CANONICAL_URL}${canonicalPath}`;
  const title = seo?.title
    ? `${seo.title} - Sveriges Dataportal`
    : "Sveriges Dataportal";
  const defaultDescription =
    "Sveriges nationella dataportal för att hitta, utforska och använda data från offentlig och privat sektor";
  const description =
    seo?.description ?? t("pages.startpage.preamble") ?? defaultDescription;
  const mediaBase = process.env.REACT_APP_MEDIA_BASE_URL ?? "";
  const ogImage = seo?.image?.url
    ? `${mediaBase}${seo.image.url}`
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
 * App Router start page. Replaces `pages/index.ts` and the old
 * `features/pages/start-page` wrapper — the page body is small enough
 * (Hero, blocks, data-category shortcuts, statistics) that there's no
 * reason for an intermediary client component.
 *
 * Server-rendered top to bottom: data-category shortcut links use
 * `getResourceLabel(locale)` (the server twin of `useResourceLabel`)
 * so the `<ContentBox>` ships as static HTML. The three statistic
 * widgets are still client components — they `useEffect`-fetch live
 * counts from EntryStore — but they're plain imports now, no
 * `dynamic({ ssr: false })`. That wrapper was a `react-vis` workaround;
 * the chart is hand-rolled flexbox now and SSRs cleanly with empty
 * placeholder values. `landing-page` (Pages Router) still uses the
 * old `dynamic({ ssr: false })` pattern — leave it until that route
 * ports.
 */
export default async function LocaleStartPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const [t, tResource, { props: data }] = await Promise.all([
    getTranslations({ locale }),
    getResourceLabel(locale),
    getStartPage(locale),
  ]);

  // `getStartPage` returns an empty `{ type: "StartPage" }` stub when the
  // GraphQL fetch fails (see `utilities/query-helpers.ts`). `id` is the
  // cheapest distinguishing field — treat its absence as "nothing to
  // render" rather than crash. Mirrors the Pages Router fallback.
  if (!data.id) return null;

  const { heading, preamble, image, blocks } = data;

  // The Pages Router chrome always set the search prop on the start
  // page (see `pages/_app.tsx` — `pathname === "/"` branch). Same here.
  // `includeLangInPath` returns `""` for Swedish so `/datasets` stays
  // unprefixed while `/en` gets `/en/datasets`.
  const searchProps = {
    destination: `${includeLangInPath(locale)}/datasets`,
    placeholder: t("pages.startpage.search_placeholder"),
  };

  return (
    <>
      {image && (
        <Hero
          heading={heading}
          preamble={preamble}
          image={image}
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
                href={`/${t("routes.statistics.path")}`}
                className="statistic-link"
                aria-label={t("pages.statistic.statistic-link-aria")}
              >
                {t("pages.statistic.statistic-link")}
              </Link>
            </div>

            <div className="mb-2xl flex flex-wrap justify-between">
              <StatisticGraph />
              <StatisticNumbers />
            </div>
            <div className="flex flex-col items-start gap-xl md:grid md:grid-cols-2">
              <Statistic />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
