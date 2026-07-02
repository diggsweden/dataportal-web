import { useTranslations } from "next-intl";
import type { FC } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";

import {
  DynamicStatistic,
  DynamicStatisticGraphNumbers,
  DynamicStatisticNumbersDatasets,
} from "./statistic-charts";

export const StatisticPage: FC = () => {
  const t = useTranslations();

  return (
    <Container>
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
        {t("pages.statistic.statistic-page-header")}
      </Heading>
      <div className="max-w-md">
        <p className="mb-xl text-lg text-brown-600">
          {t("pages.statistic.statistic-page-text")}
        </p>
        <DynamicStatisticGraphNumbers />
        <p className="mb-xl mt-md">
          {t("pages.statistic.statistic-page-numberofdatasets")}{" "}
          <DynamicStatisticNumbersDatasets />
        </p>
        <div className="flex flex-col gap-xl">
          <DynamicStatistic />
        </div>
      </div>
    </Container>
  );
};
