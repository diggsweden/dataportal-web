import useTranslation from "next-translate/useTranslation";
import React, { useContext, useEffect, useState } from "react";
import { SettingsContext } from "@/providers/SettingsProvider";
import {
  FlexibleXYPlot,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  XAxis,
  YAxis,
} from "react-vis";

interface StatisticGraphState {
  useCanvas?: boolean;
  x?: any;
  y?: any;
  screenWidth: number;
  publishers?: number;
  datasets?: number;
}

export const StatisticGraph: React.FC = () => {
  const { env } = useContext(SettingsContext);

  const { t } = useTranslation();
  const [stats, setStats] = useState<StatisticGraphState>({
    useCanvas: false,
    x: [],
    y: [],
    screenWidth: 1080,
    publishers: 151,
    datasets: 2180,
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
          let list: { x: any; y: any }[] = [];

          for (let i = 0; i < data.length; i++) {
            let item = {
              x: data[i].x.toString().substring(2, 7),
              y: data[i].y,
            };

            if (i < 19) {
              list.push(item);
            }
          }
          setStats((prev) => {
            return {
              ...prev,
              x: list.reverse(),
            };
          });
        });
    }
  }, []);

  const useCanvas = stats.useCanvas;
  const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;

  return (
    <div className="statistics-graph mb-lg w-full lg:mb-none lg:w-[79%]">
      <span className="sr-only">{t("pages|statistic$graph-screenreader")}</span>

      <div className="flex flex-col items-end">
        {/* @ts-ignore */}
        <FlexibleXYPlot
          xType="ordinal"
          height={380}
          margin={{
            bottom: 40,
            left: 70,
            right: 10,
          }}
        >
          <XAxis
            height={0}
            tickSizeOuter={0}
            className="hide-odd-stat text-sm"
          />
          <YAxis width={64} className="text-sm" />
          {/* @ts-ignore */}
          <BarSeries data={stats.x} barWidth={0.75} color="#CD7A6E" />
        </FlexibleXYPlot>
        <span className="mr-md">{t("pages|statistic$dataset-numbers")}</span>
      </div>
    </div>
  );
};

export default StatisticGraph;
