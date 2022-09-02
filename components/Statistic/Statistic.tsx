import { Heading } from '@digg/design-system';
import useTranslation from 'next-translate/useTranslation';
import React, { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '..';
import { EnvSettings } from '../../env';
import { StatisticListItem } from './StatisticListItem';
import { getNumbersData } from './StatisticNumbers';

interface StatisticState {
  children?: React.ReactNode;
  labels?: string[];
  series?: any;
  values?: any;
  publisherCount?: number;
  datasetCount?: number;
  concepts?: number;
  terminologies?: number;
  specifications?: number;
  labelsTheme?: string[];
  seriesTheme?: string[];
  valuesTheme?: string[];
  toSort?: any;
  topItemsToShow: number;
  screenWidth: number;
}

export const getStatistics = async (env: EnvSettings, lang: string) => {
  const numbersData = await getNumbersData(env);

  let url = 'https://admin.dataportal.se/charts/themeData.json';

  if (env.ENTRYSCAPE_THEME_STATS_URL_EN && lang != 'sv') {
    url = env.ENTRYSCAPE_THEME_STATS_URL_EN;
  } else if (env.ENTRYSCAPE_THEME_STATS_URL) {
    url = env.ENTRYSCAPE_THEME_STATS_URL;
  }

  const toSort: any[] = [];

  // * Fetch data
  const themeStatsResponse = await fetch(url);

  // ! Log if there is an error
  !themeStatsResponse.ok &&
    console.error({ status: themeStatsResponse.status, text: themeStatsResponse.statusText });

  const getThemeStats = async () => {
    if (!themeStatsResponse.ok) return {};

    const data = await themeStatsResponse.json();

    for (let i = 0; i < data.labels.length; i++) {
      let item = {
        label: data.labels[i],
        serie: data.series[i],
        value: data.values[i],
      };

      toSort.push(item);
    }

    toSort.sort(function (a: any, b: any) {
      return b.serie - a.serie;
    });

    return {
      labelsTheme: toSort.map((item: any) => item.label),
      seriesTheme: toSort.map((item: any) => item.serie),
      valuesTheme: toSort.map((item: any) => item.value),
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
export const Statistic: React.FC = () => {
  const { env } = useContext(SettingsContext);
  const { t, lang } = useTranslation('pages');

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
      })
    );
  }, [lang]);

  return (
    <div className="toplist">
      {/* Toplist */}
      <div className="statistic-toplist">
        <div className="toplist-wrapper">
          <Heading
            level={2}
            size="lg"
          >
            {t('statistic$top')} {stats.topItemsToShow} {t('statistic$top-organizations')}
          </Heading>

          <div className="top-list">
            <ol
              key={'toplist-organisation'}
              className="text-md font-bold"
            >
              {stats.series.slice(0, stats.topItemsToShow).map((item: any, index: any) => {
                return (
                  <StatisticListItem
                    key={'org-' + index}
                    listText={stats.labels && stats.labels[index]}
                    listNumber={item}
                    listUrl={`/${lang}/datasets?f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7C${
                      stats.values && encodeURIComponent(stats.values[index])
                    }%7C%7Cfalse%7C%7Curi%7C%7COrganisationer%7C%7C${
                      stats.labels && stats.labels[index]
                    }`}
                  />
                );
              })}
            </ol>
          </div>
        </div>

        <div className="toplist-wrapper">
          <Heading
            level={2}
            size="lg"
          >
            {t('statistic$top')} {stats.topItemsToShow} {t('statistic$top-categories')}
          </Heading>

          <div className="top-list">
            <ol className="text-md font-bold">
              {stats.seriesTheme &&
                stats.seriesTheme.slice(0, stats.topItemsToShow).map((item: any, index: any) => {
                  return (
                    <StatisticListItem
                      key={'cat-' + index}
                      listText={stats.labelsTheme && stats.labelsTheme[index]}
                      listNumber={item}
                      listUrl={`/${lang}/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7C${
                        stats.valuesTheme && encodeURIComponent(stats.valuesTheme[index])
                      }%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7C${
                        stats.labelsTheme && stats.labelsTheme[index]
                      }`}
                    />
                  );
                })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
