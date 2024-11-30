import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect } from "react";

import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import { BlockList } from "@/components/blocks/block-list";
import { RelatedContentBlock } from "@/components/blocks/related-content-block";
import { ButtonLink } from "@/components/button";
import { ContentBox } from "@/components/content-box";
import { GridList } from "@/components/grid-list";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import {
  ContainerDataFragment,
  GoodExampleDataFragment,
  NewsItemDataFragment,
} from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";
import { isExternalLink, linkBase } from "@/utilities";
import { dataCategories } from "@/utilities/data-categories";

export interface LandingPageProps extends ContainerDataFragment {
  news?: NewsItemDataFragment[];
  example?: GoodExampleDataFragment[];
  // event?: IPublication;
}

const DynamicStatisticGraph = dynamic(
  () => import("@/features/statistic/statistic-graph"),
  {
    ssr: false,
  },
);

const DynamicStatisticNumbers = dynamic(
  () => import("@/features/statistic/statistic-numbers"),
  {
    ssr: false,
  },
);

const DynamicStatistic = dynamic(() => import("@/features/statistic"), {
  ssr: false,
});

const contentBoxLinks = [
  { label: "Bidra till Sveriges dataportal", href: "/om-oss" },
  { label: "Hitta datasamverkan", href: "/datasamverkan" },
  {
    label: "Delta i communityt",
    href: "https://community.dataportal.se/",
  },
];

export const LandingPage: FC<LandingPageProps> = (props) => {
  const { parent, news, example, image, heading, blocks, preamble } =
    props || {};

  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();
  const { t, lang } = useTranslation();

  const topPromos =
    blocks &&
    blocks.length > 0 &&
    blocks[0].__typename === "dataportal_Digg_RelatedContent" &&
    blocks[0];
  const content = topPromos ? blocks.slice(1) : blocks;

  useEffect(() => {
    const crumbs = [{ name: "start", link: { ...linkBase, link: "/" } }];
    if (parent && parent.heading && parent.slug) {
      crumbs.push({
        name: parent.heading,
        link: { ...linkBase, link: parent.slug },
      });
    }

    setBreadcrumb?.({
      name: heading,
      crumbs: crumbs,
    });
  }, [pathname]);

  return (
    <Container>
      <div id="LandingPage" className="space-y-md lg:space-y-xl">
        {!image && heading && (
          <Heading level={1} size="lg" className="mb-lg md:mb-xl">
            {heading}
          </Heading>
        )}

        {pathname === `/${t("routes|search-api$path")}` ||
        (!image && preamble) ? (
          <Preamble className="max-w-md">{preamble}</Preamble>
        ) : null}

        {topPromos && <RelatedContentBlock {...topPromos} landingPage={true} />}

        {pathname === "/" && lang === "sv" && (
          <>
            {news && (
              <GridList
                className="!my-xl md:!my-2xl"
                items={news}
                showMoreLink={{
                  title: t("pages|news$view-all"),
                  slug: t("routes|news$path"),
                }}
                heading={t("pages|startpage$news")}
              />
            )}
            {example && (
              <GridList
                className="!my-xl md:!my-2xl"
                items={example}
                showMoreLink={{
                  title: t("pages|good-examples$view-all"),
                  slug: t("routes|good-examples$path"),
                }}
                heading={t("pages|startpage$good-examples")}
              />
            )}

            <ContentBox
              heading="Var med och delta"
              description="På Sveriges dataportal kan du som delar eller använder data, eller på andra sätt vill att data ska bli en strategisk resurs för bred samhällsnytta, delta på olika sätt. Här kan du ha dialoger med andra, bidra med innehåll eller kanske hitta en framtida samverkanspart."
            >
              <div className="flex flex-wrap justify-center gap-md lg:gap-xl">
                {contentBoxLinks.map((link, idx: number) => (
                  <ButtonLink
                    key={idx}
                    href={link.href}
                    label={link.label}
                    icon={
                      isExternalLink(link.href)
                        ? ExternalLinkIcon
                        : ArrowRightIcon
                    }
                    iconPosition="right"
                  />
                ))}
              </div>
            </ContentBox>
          </>
        )}

        <div className={"mb-xl"}>
          {content && <BlockList blocks={content} landingPage={true} />}
        </div>

        {pathname === "/" && (
          <>
            <ContentBox heading={t("pages|startpage$datasets_by_category")}>
              <ul className="flex flex-wrap justify-center gap-md lg:gap-lg">
                {dataCategories?.map((category, idx: number) => (
                  <li key={idx}>
                    <ButtonLink
                      className="text-center"
                      aria-label={t("pages|startpage$search_datasets_format", {
                        category: t(`resources|${category.href}`),
                      })}
                      href={`/${t(
                        "routes|datasets$path",
                      )}?f=${encodeURIComponent(
                        `http://www.w3.org/ns/dcat#theme||${
                          category.href
                        }||FALSE||uri||${t(
                          "resources|http://www.w3.org/ns/dcat#theme",
                        )}||${t("resources|" + category.href)}`,
                      )}`}
                      label={t(`resources|${category.href}`)}
                    />
                  </li>
                ))}
              </ul>
            </ContentBox>

            <section id="statistics" className="my-xl">
              <div className="mb-2xl flex flex-col justify-between gap-sm md:flex-row md:items-end">
                <Heading level={2} size={"lg"}>
                  {t("pages|statistic$statistic-numbers")}
                </Heading>
                <Link
                  href={`/${t("routes|statistics$path")}`}
                  locale={lang}
                  className="statistic-link"
                >
                  {t("pages|statistic$statistic-link")}
                </Link>
              </div>

              <div className="mb-2xl flex flex-wrap justify-between">
                <DynamicStatisticGraph />
                <DynamicStatisticNumbers />
              </div>
              <div className="flex flex-col items-start gap-xl md:grid md:grid-cols-2">
                <DynamicStatistic />
              </div>
            </section>
          </>
        )}
      </div>
    </Container>
  );
};
