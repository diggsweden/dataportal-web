import { FC, useEffect } from "react";
import { useRouter } from "next/router";
import Container from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import Head from "next/head";

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
  () => import("@/components/content/Statistic"),
  {
    ssr: false,
  },
);

export const StatisticPage: FC = () => {
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
      <Container className="py-xl">
        <Heading level={1} size={"lg"}>
          {t("statistic$statistic-page-header")}
        </Heading>
        <div className="max-w-md">
          <p className="mb-xl text-lg text-brown-600">
            {t("statistic$statistic-page-text")}
          </p>
          <DynamicStatisticGraphNumbers />
          <p className="mb-xl mt-md">
            {t("statistic$statistic-page-numberofdatasets")}{" "}
            <DynamicStatisticNumbersDatasets />
          </p>
          <div className="flex flex-col gap-xl">
            <DynamicStatistic />
          </div>
        </div>
      </Container>
    </>
  );
};
