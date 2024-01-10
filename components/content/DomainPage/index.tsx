import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { handleDomain } from "@/utilities/domain";
import { ContainerData_Dataportal_Digg_Container_Fragment } from "@/graphql/__generated__/operations";
import { PublicationDataFragment as IPublication } from "@/graphql/__generated__/operations";
import { PublicationList } from "@/components/content/Publication/PublicationList";
import { PromoProps } from "@/components/content/Promo";
import { CategoriesNav } from "@/components/navigation/CategoriesNav";
import { RelatedContentBlock } from "@/components/content/blocks/RelatedContentBlock";
import { BlockList } from "@/components/content/blocks/BlockList";
import useTranslation from "next-translate/useTranslation";
import { Heading } from "@/components/global/Typography/Heading";
import { Container } from "@/components/layout/Container";
import { Preamble } from "@/components/global/Typography/Preamble";
import { ContentBox } from "@/components/content/ContentBox";

export interface DomainProps
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

export const DomainPage: React.FC<DomainProps> = (props) => {
  const { domain, areas, news, example } = props || {};
  const { content, puffs, preamble } = handleDomain(props);
  const { pathname } = useRouter() || {};
  const { trackPageView } = useMatomo();
  const { t, lang } = useTranslation("pages");
  const isEn = lang === "en";

  useEffect(() => {
    trackPageView({ documentTitle: "OpenSource" });
  }, [pathname]);

  return (
    <div id="DomainPage">
      <Container>
        {domain === "data" && (
          <Preamble className="max-w-md">{preamble}</Preamble>
        )}

        {puffs && <RelatedContentBlock links={puffs.links as PromoProps[]} />}

        {/* I´ll be back for this */}
        {!isEn && pathname === `/` && (
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
          <div className="py-xl">
            <ContentBox
              heading="Var med och delta"
              description="På Sveriges dataportal synliggörs data från en rad olika typer av organisationer och sektorer. Data hämtas via länkar för nedladdning eller efterfrågas hos respektive organisation som ansvarar för sina egna datamängder."
              links={[
                { label: "Tipsa om dataanvändning", href: "/anvand-data" },
                { label: "Begär ut data", href: "/datasamverkan" },
                {
                  label: "Delta i communityt",
                  href: "https://community.dataportal.se/",
                },
              ]}
            />{" "}
          </div>
        )}

        {domain === "data" && <CategoriesNav />}

        {areas && !domain && lang === "sv" && (
          <div className="py-xl">
            <Heading size={"md"} level={2}>
              {t("pages|data$data-areas_text")}
            </Heading>
            <RelatedContentBlock links={areas} icons={true} inline={true} />
          </div>
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
