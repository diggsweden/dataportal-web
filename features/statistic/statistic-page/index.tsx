import { FC, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import Head from "next/head";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

const DynamicStatisticGraphNumbers = dynamic(
  () =>
    import("@/features/statistic/statistic-graph-numbers").then(
      (c) => c.StatisticGraphNumbers,
    ),
  {
    ssr: false,
  },
);

const DynamicStatisticNumbersDatasets = dynamic(
  () =>
    import("@/features/statistic/statistic-numbers-datasets").then(
      (c) => c.StatisticNumbersDatasets,
    ),
  {
    ssr: false,
  },
);

const DynamicStatistic = dynamic(() => import("@/features/statistic"), {
  ssr: false,
});

export const StatisticPage: FC = () => {
  const { t } = useTranslation("pages");
  const { pathname } = useRouter() || {};
  const { setBreadcrumb } = useContext(SettingsContext);

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: t("statistic$statistic-page-header"),
        crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
      });
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
      <Container>
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
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
