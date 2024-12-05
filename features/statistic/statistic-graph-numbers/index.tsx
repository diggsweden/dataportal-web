import useTranslation from "next-translate/useTranslation";
import { FC, ReactNode, useContext, useEffect, useState } from "react";

import { Heading } from "@/components/typography/heading";
import { StatisticListItemHistory } from "@/features/statistic/statistic-list-item-history";
import { SettingsContext } from "@/providers/settings-provider";

interface StatisticState {
  children?: ReactNode;
  x?: number[];
  y?: number[];
  xList: string[];
  yList: number[];
  toSort: Array<{ x: string; y: number }>;
  topItemsToShow: number;
  screenWidth: number;
}

export const StatisticGraphNumbers: FC = () => {
  const { env } = useContext(SettingsContext);
  const { t } = useTranslation("pages");

  const [stats, setStats] = useState<StatisticState>({
    x: [],
    y: [],
    xList: [],
    yList: [],
    toSort: [],
    topItemsToShow: 19,
    screenWidth: 1080,
  });

  useEffect(() => {
    if (typeof fetch !== "undefined") {
      fetch(
        env.ENTRYSCAPE_HISTORY_STATS_URL
          ? env.ENTRYSCAPE_HISTORY_STATS_URL
          : "https://admin.dataportal.se/stats/historyData.json",
      )
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            const item = {
              x: data[i].x.toString().substring(0, 7),
              y: data[i].y,
            };

            if (i < 19) {
              stats.toSort.push(item);
              // list.push(item);
            }
          }

          setStats((prev) => {
            return {
              ...prev,
              xList: stats.toSort.map((item) => item.x),
              yList: stats.toSort.map((item) => item.y),
            };
          });
        });
    }
  }, []);

  return (
    <div>
      <Heading level={2} className="mb-lg md:mb-xl">
        {t("statistic$dataset-numbers")}
      </Heading>
      <div className="bg-white p-xl">
        <ol className="list-decimal space-y-lg pl-lg">
          {stats.yList &&
            stats.yList
              .slice(0, stats.topItemsToShow)
              .map((item: number, index: number) => {
                return (
                  <StatisticListItemHistory
                    key={"cat-" + index}
                    listText={stats.xList && stats.xList[index]}
                    listNumber={item}
                  />
                );
              })}
        </ol>
      </div>
    </div>
  );
};
