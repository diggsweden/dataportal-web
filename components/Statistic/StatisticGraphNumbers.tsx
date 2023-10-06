import { Heading } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import React, { useContext, useEffect, useState } from "react";
// import 'scss/statistic/statistic.scss';
import { SettingsContext } from "..";
import { StatisticListItemHistory } from "./";

// import { isIE } from 'react-device-detect';

interface StatisticState {
  children?: React.ReactNode;
  x?: any;
  y?: any;
  xList: string[];
  yList: string[];

  toSort?: any;
  topItemsToShow: number;
  screenWidth: number;
}

export const StatisticGraphNumbers: React.FC = () => {
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
            let item = {
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
              xList: stats.toSort.map((item: any) => item.x),
              yList: stats.toSort.map((item: any) => item.y),
            };
          });
        });
    }
  }, []);

  if (/* isIE do we still need this? */ false) {
    return <></>;
  } else {
    return (
      <div className="toplist">
        {/* Toplist */}
        <div className="statistic-toplist">
          <div className="toplist-wrapper">
            <Heading level={2} size="lg">
              {t("statistic$dataset-numbers")}
            </Heading>
            <div className="top-list">
              <ol className="text-md font-bold">
                {stats.yList &&
                  stats.yList
                    .slice(0, stats.topItemsToShow)
                    .map((item: any, index: any) => {
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
        </div>
      </div>
    );
  }
};
