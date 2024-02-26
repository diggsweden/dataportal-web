import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import { FC, useContext, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ContainerData_Dataportal_Digg_Container_Fragment } from "@/graphql/__generated__/operations";
import { PublicationDataFragment as IPublication } from "@/graphql/__generated__/operations";
import { PublicationList } from "@/components/content/Publication/PublicationList";
import { PromoProps } from "@/components/content/Promo";
import { RelatedContentBlock } from "@/components/content/blocks/RelatedContentBlock";
import { BlockList } from "@/components/content/blocks/BlockList";
import { Heading } from "@/components/global/Typography/Heading";
import { Container } from "@/components/layout/Container";
import { Preamble } from "@/components/global/Typography/Preamble";
import { ContentBox } from "@/components/content/ContentBox";
import { dataCategories } from "@/utilities/dataCategories";
import { ButtonLink } from "@/components/global/Button";
import { isExternalLink, linkBase } from "@/utilities";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";
import { SettingsContext } from "@/providers/SettingsProvider";

export interface LandingPageProps
  extends ContainerData_Dataportal_Digg_Container_Fragment {
  domain?: DiggDomain;
  news?: IPublication[];
  example?: IPublication[];
  event?: IPublication;
  areas?: PromoProps[];
}

const DynamicStatisticGraph = dynamic(
  () => import("@/components/content/Statistic/StatisticGraph"),
  {
    ssr: false,
  },
);

const DynamicStatisticNumbers = dynamic(
  () => import("@/components/content/Statistic/StatisticNumbers"),
  {
    ssr: false,
  },
);

const DynamicStatistic = dynamic(
  () => import("@/components/content/Statistic"),
  {
    ssr: false,
  },
);

const contentBoxLinks = [
  { label: "Tipsa om dataanvändning", href: "/anvand-data" },
  { label: "Begär ut data", href: "/datasamverkan" },
  {
    label: "Delta i communityt",
    href: "https://community.dataportal.se/",
  },
];

export const LandingPage: FC<LandingPageProps> = (props) => {
  const { domain, news, example, image, heading, blocks, preamble, name } =
    props || {};

  const { setBreadcrumb } = useContext(SettingsContext);
  const { pathname } = useRouter() || {};
  const { trackPageView } = useMatomo();
  const { t, lang } = useTranslation();
  const isEn = lang === "en";

  const topPromos =
    blocks.length &&
    blocks[0].__typename === "dataportal_Digg_RelatedContent" &&
    blocks[0];
  const content = topPromos ? blocks.slice(1) : blocks;

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: heading ? heading : t(`pages|${props.domain}$heading`),
        crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
      });

    trackPageView({ documentTitle: name });
  }, [pathname]);

  return (
    <div id="LandingPage">
      <Container>
        {!image && heading && (
          <Heading level={1} size="lg" className="mb-lg md:mb-xl">
            {heading}
          </Heading>
        )}

        {domain === "data" || (!image && preamble) ? (
          <Preamble className="max-w-md">{preamble}</Preamble>
        ) : null}

        {topPromos && (
          <RelatedContentBlock links={topPromos.links as PromoProps[]} />
        )}

        {/* I´ll be back for this */}
        {!isEn && pathname === "/" && (
          <>
            {example && (
              <PublicationList
                publications={example}
                showMoreLink={{
                  title: t("pages|good-examples$view-all"),
                  slug: t("routes|good-examples$path"),
                }}
                heading={t("pages|startpage$good-examples")}
              />
            )}
            {news && (
              <PublicationList
                publications={news}
                showMoreLink={{
                  title: t("pages|news$view-all"),
                  slug: t("routes|news$path"),
                }}
                heading={t("pages|startpage$news")}
              />
            )}
          </>
        )}

        <div className={"mb-xl"}>
          {content && <BlockList blocks={content} />}
        </div>

        {!domain && lang === "sv" && (
          <ContentBox
            heading="Var med och delta"
            description="På Sveriges dataportal synliggörs data från en rad olika typer av organisationer och sektorer. Data hämtas via länkar för nedladdning eller efterfrågas hos respektive organisation som ansvarar för sina egna datamängder."
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
        )}

        {!domain && (
          <ContentBox heading={t("pages|startpage$datasets_by_category")}>
            <ul className="flex flex-wrap justify-center gap-md lg:gap-lg">
              {dataCategories?.map((category, idx: number) => (
                <li key={idx}>
                  <ButtonLink
                    className="text-center"
                    aria-label={t("pages|startpage$search_datasets_format", {
                      category: t(`resources|${category.href}`),
                    })}
                    href={`/${t("routes|datasets$path")}?f=${encodeURIComponent(
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
        )}

        {!domain && (
          <section id="statistics" className="my-xl">
            <div className="mb-2xl flex items-end justify-between">
              <Heading level={2} size={"lg"}>
                {t("pages|statistic$statistic-numbers")}
              </Heading>
              <Link
                href={`/${t("routes|statistics$path")}`}
                locale={lang}
                className="statistic-link"
                legacyBehavior
              >
                {t("pages|statistic$statistic-link")}
              </Link>
            </div>

            <div className="mb-2xl flex flex-wrap justify-between">
              <DynamicStatisticGraph />
              <DynamicStatisticNumbers />
            </div>
            <div className="grid items-start gap-xl md:grid-cols-2">
              <DynamicStatistic />
            </div>
          </section>
        )}
      </Container>
    </div>
  );
};
