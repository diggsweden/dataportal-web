import { useMatomo } from "@datapunt/matomo-tracker-react";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const DynamicStatisticGraphNumbers = dynamic(
  () =>
    import("@/components/content/Statistic/StatisticGraphNumbers").then(
      (c) => c.StatisticGraphNumbers,
    ),
  {
    ssr: false,
  },
);

const DynamicStatisticNumbersDatasets = dynamic(
  () =>
    import("@/components/content/Statistic/StatisticNumbersDatasets").then(
      (c) => c.StatisticNumbersDatasets,
    ),
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

export const StatisticPage: React.FC = () => {
  const { t } = useTranslation("pages");
  const { pathname } = useRouter() || {};
  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView({ documentTitle: "Statistik" });
  }, [pathname]);

  return (
    <>
      <Head>
        <title>{`${t(
          "statistic$statistic-page-header",
        )} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${t(
            "statistic$statistic-page-header",
          )} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${t(
            "statistic$statistic-page-header",
          )} - Sveriges dataportal`}
        />
      </Head>
      <div className="container">
        <h2>{t("statistic$statistic-page-header")} </h2>
        <div className="content statistic-page">
          <p className="main-text text-md">
            {t("statistic$statistic-page-text")}
          </p>
          <DynamicStatisticGraphNumbers />
          <p className="main-text text-md">
            {t("statistic$statistic-page-numberofdatasets")}{" "}
            <DynamicStatisticNumbersDatasets />
          </p>
          <DynamicStatistic />
        </div>
      </div>
    </>
  );
};
