import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ContainerData_Dataportal_Digg_Container_Fragment } from "@/graphql/__generated__/operations";
import { checkLang } from "@/utilities";
import { Puffs, IPuff } from "../navigation";
import { PublicationDataFragment as IPublication } from "../../graphql/__generated__/operations";
import useTranslation from "next-translate/useTranslation";
import { ContentArea } from "../ContentArea";
import { CategoriesNav } from "../StartPageComponents";
import { handleDomain } from "@/utilities/domain";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Dataportal_LinkType } from "@/graphql/__generated__/types";
import Heading from "@/components/global/Typography/Heading";

export interface DomainProps
  extends ContainerData_Dataportal_Digg_Container_Fragment {
  domain?: DiggDomain;
  news?: IPublication[];
  example?: IPublication[];
  event?: IPublication;
  areas?: IPuff[];
  themes?: IPuff[];
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
  () => import("@/components/content/Statistic/Statistic"),
  {
    ssr: false,
  },
);

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

        {puffs && (
          <Puffs
            links={puffs.links as IPuff[]}
            basepath={domain ? "/" + domain : undefined}
          />
        )}
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
              <ContentArea blocks={content} />
            </div>
          )}
        </div>

        {domain === "data" && <CategoriesNav />}

        {areas && !domain && lang === "sv" && (
          <div className="domain-page__link-block domain-page__theme-block">
            <h2>{t("pages|data$data-areas_text")}</h2>
            <Puffs links={areas} />
          </div>
        )}

        {!domain && (
          <section id="statistics">
            <div className="mb-2xl flex items-end justify-between">
              <Heading size={"h1"}>
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

            <div className="mb-2xl grid gap-xl md:grid-cols-[3.7fr_1fr]">
              <DynamicStatisticGraph />
              <DynamicStatisticNumbers />
            </div>

            <DynamicStatistic />
          </section>
        )}
      </div>
    </div>
  );
};
