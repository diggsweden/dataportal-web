import useTranslation from "next-translate/useTranslation";
import { FC, ReactNode, useContext, useEffect, useState } from "react";

import { Heading } from "@/components/typography/heading";
import { EnvSettings } from "@/env";
import { StatisticListItem } from "@/features/statistic/statistic-list-item";
import { getNumbersData } from "@/features/statistic/statistic-numbers";
import { SettingsContext } from "@/providers/settings-provider";

interface ThemeItem {
  label: string;
  serie: number;
  value: string;
}

interface StatisticState {
  children?: ReactNode;
  labels?: string[];
  series?: number[];
  values?: string[];
  publisherCount?: number;
  datasetCount?: number;
  concepts?: number;
  terminologies?: number;
  specifications?: number;
  labelsTheme?: string[];
  seriesTheme?: number[];
  valuesTheme?: string[];
  toSort: ThemeItem[];
  topItemsToShow: number;
  screenWidth: number;
}

export const getStatistics = async (env: EnvSettings, lang: string) => {
  const numbersData = await getNumbersData(env);

  let url = "https://admin.dataportal.se/charts/themeData.json";

  if (env.ENTRYSCAPE_THEME_STATS_URL_EN && lang != "sv") {
    url = env.ENTRYSCAPE_THEME_STATS_URL_EN;
  } else if (env.ENTRYSCAPE_THEME_STATS_URL) {
    url = env.ENTRYSCAPE_THEME_STATS_URL;
  }

  const toSort: ThemeItem[] = [];

  // * Fetch data
  const themeStatsResponse = await fetch(url);

  // ! Log if there is an error
  if (!themeStatsResponse.ok) {
    console.error({
      status: themeStatsResponse.status,
      text: themeStatsResponse.statusText,
    });
  }

  const getThemeStats = async () => {
    if (!themeStatsResponse.ok) return {};

    const data = await themeStatsResponse.json();

    for (let i = 0; i < data.labels.length; i++) {
      const item = {
        label: data.labels[i],
        serie: data.series[i],
        value: data.values[i],
      };

      toSort.push(item);
    }

    toSort.sort((a, b) => b.serie - a.serie);

    return {
      labelsTheme: toSort.map((item: ThemeItem) => item.label),
      seriesTheme: toSort.map((item: ThemeItem) => item.serie),
      valuesTheme: toSort.map((item: ThemeItem) => item.value),
      toSort,
    };
  };

  const themeStats = await getThemeStats();

  return {
    ...numbersData,
    ...themeStats,
  };
};

//Statistic
export const Statistic: FC = () => {
  const { env } = useContext(SettingsContext);
  const { t, lang } = useTranslation("pages");

  const [stats, setStats] = useState<StatisticState>({
    publisherCount: -1,
    datasetCount: -1,
    concepts: -1,
    terminologies: -1,
    specifications: -1,
    labels: [],
    series: [],
    values: [],
    labelsTheme: [],
    seriesTheme: [],
    valuesTheme: [],
    toSort: [],
    topItemsToShow: 5,
    screenWidth: 1080,
  });

  useEffect(() => {
    getStatistics(env, lang).then((data) =>
      setStats({
        ...stats,
        ...data,
      }),
    );
  }, [lang]);

  return (
    <>
      <div className="block bg-white p-xl">
        <Heading level={3} size="sm" className="mb-lg">
          {t("statistic$top-organisations")}
        </Heading>

        <ol key={"toplist-organisation"} className="list-decimal pl-lg">
          {stats.series &&
            stats.series
              .slice(0, stats.topItemsToShow)
              .map((item: number, index: number) => {
                return (
                  <StatisticListItem
                    key={"org-" + index}
                    listText={stats.labels && stats.labels[index]}
                    listNumber={item}
                    listUrl={`/datasets?f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7C${
                      stats.values && encodeURIComponent(stats.values[index])
                    }%7C%7Cfalse%7C%7Curi%7C%7COrganisationer%7C%7C${
                      stats.labels && stats.labels[index]
                    }`}
                  />
                );
              })}
        </ol>
      </div>

      <div className="block bg-white p-xl">
        <Heading level={3} size="sm" className="mb-lg">
          {t("statistic$top-categories")}
        </Heading>

        <ol className="list-decimal pl-lg">
          {stats.seriesTheme &&
            stats.seriesTheme
              .slice(0, stats.topItemsToShow)
              .map((item: number, index: number) => {
                return (
                  <StatisticListItem
                    key={"cat-" + index}
                    listText={stats.labelsTheme && stats.labelsTheme[index]}
                    listNumber={item}
                    listUrl={`/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7C${
                      stats.valuesTheme &&
                      encodeURIComponent(stats.valuesTheme[index])
                    }%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7C${
                      stats.labelsTheme && stats.labelsTheme[index]
                    }`}
                  />
                );
              })}
        </ol>
      </div>
    </>
  );
};

export default Statistic;
