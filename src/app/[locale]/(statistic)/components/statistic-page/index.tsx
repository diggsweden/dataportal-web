import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Statistic } from "@/components/statistic";
import { StatisticGraphNumbers } from "@/components/statistic/statistic-graph-numbers";
import { StatisticNumbersDatasets } from "@/components/statistic/statistic-numbers-datasets";
import { Heading } from "@/components/typography/heading";
import { SettingsUtil } from "@/env";
import {
  getStatisticHistory,
  getStatisticNumbers,
  getTopCategories,
  getTopOrganisations,
} from "@/lib/statistic";

export async function StatisticPage() {
  const [t, lang] = await Promise.all([getTranslations(), getLocale()]);
  const env = SettingsUtil.create();

  const [history, numbers, organisations, categories] = await Promise.all([
    getStatisticHistory(env),
    getStatisticNumbers(env),
    getTopOrganisations(env),
    getTopCategories(env, lang),
  ]);

  return (
    <Container>
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
        {t("pages.statistic.statistic-page-header")}
      </Heading>
      <div className="max-w-md">
        <p className="mb-xl text-lg text-brown-600">
          {t("pages.statistic.statistic-page-text")}
        </p>
        <StatisticGraphNumbers history={history} />
        <p className="mb-xl mt-md">
          {t("pages.statistic.statistic-page-numberofdatasets")}{" "}
          <StatisticNumbersDatasets count={numbers.datasetCount} />
        </p>
        <div className="flex flex-col gap-xl">
          <Statistic organisations={organisations} categories={categories} />
        </div>
      </div>
    </Container>
  );
}
