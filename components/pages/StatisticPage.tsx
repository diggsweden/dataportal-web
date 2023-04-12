import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Heading, Container } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { MainContainerStyle } from "../../styles/general/emotion";

const DynamicStatisticGraphNumbers = dynamic(
  () =>
    import("../Statistic/StatisticGraphNumbers").then(
      (c) => c.StatisticGraphNumbers
    ),
  {
    ssr: false,
  }
);

const DynamicStatisticNumbersDatasets = dynamic(
  () =>
    import("../Statistic/StatisticNumbersDatasets").then(
      (c) => c.StatisticNumbersDatasets
    ),
  {
    ssr: false,
  }
);

const DynamicStatistic = dynamic(() => import("../Statistic/Statistic"), {
  ssr: false,
});

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
          "statistic$statistic-page-header"
        )} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${t(
            "statistic$statistic-page-header"
          )} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${t(
            "statistic$statistic-page-header"
          )} - Sveriges dataportal`}
        />
      </Head>
      <Container cssProp={MainContainerStyle}>
        <Heading size={"2xl"}>{t("statistic$statistic-page-header")} </Heading>
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
      </Container>
    </>
  );
};
