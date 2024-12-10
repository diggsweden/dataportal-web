import useTranslation from "next-translate/useTranslation";
import { useContext, useEffect, useState } from "react";

import { EnvSettings } from "@/env";
import { StatisticDataPresentation } from "@/features/statistic/statistic-data-presentation";
import { SettingsContext } from "@/providers/settings-provider";

export const getNumbersData = async (env: EnvSettings) => {
  const ESOrgStatsUrl =
    env.ENTRYSCAPE_ORG_STATS_URL ||
    "https://admin.dataportal.se/charts/orgData.json";
  const ESConceptStatsUrl =
    env.ENTRYSCAPE_CONCEPT_STATS_URL ||
    "https://editera.dataportal.se/stats/entityData.json";

  // * Fetch data
  const orgStatsResponse = await fetch(ESOrgStatsUrl);
  const conceptStatsResponse = await fetch(ESConceptStatsUrl);

  // ! Log if there is an error
  if (!orgStatsResponse.ok) {
    console.error({
      status: orgStatsResponse.status,
      text: orgStatsResponse.statusText,
    });
  }
  if (!conceptStatsResponse.ok) {
    console.error({
      status: conceptStatsResponse.status,
      text: conceptStatsResponse.statusText,
    });
  }

  const orgStats = orgStatsResponse.ok ? await orgStatsResponse.json() : {};
  const { series } = orgStats;

  // ? spread data or make object empty
  const data = {
    ...orgStats,
    ...(conceptStatsResponse.ok ? await conceptStatsResponse.json() : {}),
    // ? shift nested array
    series: series[0] || [],
  };

  return data;
};

export const StatisticNumbers = () => {
  const { env } = useContext(SettingsContext);
  const { t } = useTranslation("pages");
  const [state, setState] = useState({
    publisherCount: -1,
    datasetCount: -1,
    concepts: -1,
    terminologies: -1,
    specifications: -1,
  });

  useEffect(() => {
    getNumbersData(env).then((data) =>
      setState({
        ...data,
      }),
    );
  }, []);

  return (
    <div className="flex w-full flex-col justify-between lg:w-[18%]">
      <StatisticDataPresentation
        dataText={t("search$datasets")}
        dataNumber={state.datasetCount}
      />
      <StatisticDataPresentation
        dataText={t("search$organisations")}
        dataNumber={state.publisherCount}
      />
    </div>
  );
};

export default StatisticNumbers;
