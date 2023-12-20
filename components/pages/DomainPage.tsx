import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ContainerData_Dataportal_Digg_Container_Fragment } from "../../graphql/__generated__/operations";
import { checkLang } from "../../utilities";
import { PublicationDataFragment as IPublication } from "../../graphql/__generated__/operations";
import useTranslation from "next-translate/useTranslation";
import { CategoriesNav } from "../StartPageComponents";
import { handleDomain } from "../../utilities/domain";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Dataportal_LinkType } from "../../graphql/__generated__/types";
import RelatedContentBlock from "@/components/content/blocks/RelatedContentBlock";
import Heading from "@/components/global/Typography/Heading";
import { PromoProps } from "@/components/content/Promo";
import BlockList from "@/components/content/blocks/BlockList";

export interface DomainProps
  extends ContainerData_Dataportal_Digg_Container_Fragment {
  domain?: DiggDomain;
  news?: IPublication[];
  example?: IPublication[];
  event?: IPublication;
  areas?: PromoProps[];
}

const DynamicStatisticGraph = dynamic(
  () => import("../Statistic/StatisticGraph"),
  {
    ssr: false,
  },
);

const DynamicStatisticNumbers = dynamic(
  () => import("../Statistic/StatisticNumbers"),
  {
    ssr: false,
  },
);

const DynamicStatistic = dynamic(() => import("../Statistic/Statistic"), {
  ssr: false,
});

const DynamicArticleBlock = dynamic(
  () => import("../blocks/Article").then((c) => c.ArticleBlock),
  {
    ssr: false,
  },
);

export const DomainPage: React.FC<DomainProps> = (props) => {
  const { domain, areas, news, example } = props || {};
  const { content, puffs, heading, preamble } = handleDomain(props);
  const { pathname } = useRouter() || {};
  const { trackPageView } = useMatomo();
  const { t, lang } = useTranslation("pages");
  const isEn = lang === "en";

  useEffect(() => {
    trackPageView({ documentTitle: "OpenSource" });
  }, [pathname]);

  return (
    <div className="gradient">
      <div className="domain-page">
        <div className="domain-page__header">
          <div className="domain-page__header-heading">
            {heading && <h1>{checkLang(heading)}</h1>}
            <div>
              <p className="preamble domain-page__preamble text-md">
                {checkLang(preamble)}
              </p>
              {domain === "data" && (
                <form
                  className="datapage-form"
                  method="GET"
                  action={`/${lang}/datasets`}
                >
                  <label className="screen-reader" htmlFor="start-search">
                    {t("startpage$search_placeholder")}
                  </label>
                  <input
                    id="start-search"
                    name="q"
                    autoComplete="off"
                    placeholder={t("startpage$search_placeholder")}
                    // submitLabel="screen-reader"
                  />
                </form>
              )}
            </div>
          </div>
        </div>

        {puffs && <RelatedContentBlock links={puffs.links as PromoProps[]} />}

        {/* I´ll be back for this */}
        {!isEn && pathname === `/` && (
          <>
            {news && (
              <DynamicArticleBlock
                articles={news}
                showMoreLink={{
                  title: t("pages|news$view-all"),
                  slug: t("routes|news$path"),
                  description: null,
                  __typename: "dataportal_Digg_Link",
                  linktype: Dataportal_LinkType.External,
                }}
                heading={t("pages|startpage$news")}
              />
            )}

            {example && (
              <DynamicArticleBlock
                articles={example}
                showMoreLink={{
                  title: t("pages|good-examples$view-all"),
                  slug: t("routes|good-examples$path"),
                  description: null,
                  __typename: "dataportal_Digg_Link",
                  linktype: Dataportal_LinkType.External,
                }}
                heading={t("pages|startpage$good-examples")}
              />
            )}
          </>
        )}

        <div className={"fullWidth"}>
          {/* todo: this width? */}
          {content && (
            <div className="content">
              <BlockList blocks={content} />
            </div>
          )}
        </div>

        {domain === "data" && <CategoriesNav />}

        {areas && !domain && lang === "sv" && (
          <div className="domain-page__link-block domain-page__theme-block">
            <Heading size={"h3"}>{t("pages|data$data-areas_text")}</Heading>
            <RelatedContentBlock links={areas} icons={true} />
          </div>
        )}

        {!domain && (
          <div className="domain-page__statistics">
            <div className="domain-page__show_more--link">
              <h2>{t("pages|statistic$statistic-numbers")}</h2>
              <Link
                href={`/${t("routes|statistics$path")}`}
                locale={lang}
                className="statistic-link"
                legacyBehavior
              >
                {t("pages|statistic$statistic-link")}
              </Link>
            </div>

            <div className="statistic-wrapper">
              <DynamicStatisticGraph />
              <DynamicStatisticNumbers />
            </div>

            <DynamicStatistic />
          </div>
        )}
      </div>
    </div>
  );
};
