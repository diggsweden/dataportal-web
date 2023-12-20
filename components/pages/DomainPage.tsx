import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ContainerData_Dataportal_Digg_Container_Fragment } from "../../graphql/__generated__/operations";
import { checkLang } from "../../utilities";
import { Puffs, IPuff } from "../navigation";
import { PublicationDataFragment as IPublication } from "../../graphql/__generated__/operations";
import useTranslation from "next-translate/useTranslation";
import { ContentArea } from "../ContentArea";
import { CategoriesNav } from "../StartPageComponents";
import { handleDomain } from "../../utilities/domain";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PublicationList } from "../publications/PublicationList";
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

        <div className={"fullWidth"}>
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
