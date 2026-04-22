import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect, useMemo, useState } from "react";

import { SettingsContext } from "@/providers/settings-provider";

interface HistoryPoint {
  x: string;
  y: number;
}

interface HistoryApiPoint {
  x: number | string;
  y: number;
}

const Y_TICK_COUNT = 5;
const BAR_COLOR = "#CD7A6E";

function buildYTicks(max: number): number[] {
  if (max <= 0) return [0];
  const rawStep = max / Y_TICK_COUNT;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;
  const niceStep =
    normalized >= 5 ? 5 : normalized >= 2 ? 2 : normalized >= 1 ? 1 : 1;
  const step = niceStep * magnitude;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step; v += step) ticks.push(Math.round(v));
  return ticks;
}

export const StatisticGraph: FC = () => {
  const { env } = useContext(SettingsContext);
  const { t } = useTranslation();
  const [points, setPoints] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    const url =
      env.ENTRYSCAPE_HISTORY_STATS_URL ||
      "https://admin.dataportal.se/stats/historyData.json";

    fetch(url)
      .then((res) => res.json())
      .then((data: HistoryApiPoint[]) => {
        const list = data
          .slice(0, 19)
          .map(({ x, y }) => ({
            x: x.toString().substring(2, 7),
            y,
          }))
          .reverse();
        setPoints(list);
      })
      .catch(() => {
        // Chart is aria-hidden / decorative; silently fail.
      });
  }, [env.ENTRYSCAPE_HISTORY_STATS_URL]);

  const { yTicks, yMax } = useMemo(() => {
    const max = points.reduce((acc, p) => Math.max(acc, p.y), 0);
    const ticks = buildYTicks(max);
    return { yTicks: ticks, yMax: ticks[ticks.length - 1] || 1 };
  }, [points]);

  return (
    <div
      aria-hidden="true"
      className="statistics-graph mb-lg w-full lg:mb-none lg:w-[79%]"
    >
      <div className="flex flex-col items-end">
        <div className="flex h-[380px] w-full gap-sm pl-[70px] pr-[10px]">
          <div className="relative -ml-[70px] flex h-full w-[70px] flex-col-reverse justify-between pr-sm text-right text-sm text-textSecondary">
            {yTicks.map((tick) => (
              <span
                key={tick}
                className="absolute right-sm -translate-y-1/2"
                style={{ bottom: `${(tick / yMax) * 100}%` }}
              >
                {tick}
              </span>
            ))}
          </div>

          <div className="border-gray-300 flex flex-1 items-end gap-[2px] border-b border-l">
            {points.map((point, idx) => (
              <div
                key={`${point.x}-${idx}`}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div
                  className="w-3/4 self-center"
                  style={{
                    height: `${(point.y / yMax) * 100}%`,
                    backgroundColor: BAR_COLOR,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full pl-[70px] pr-[10px]">
          <div className="flex flex-1 gap-[2px] pt-xs text-sm text-textSecondary">
            {points.map((point, idx) => (
              <span
                key={`label-${point.x}-${idx}`}
                className={`flex-1 text-center ${
                  idx % 2 === 1 ? "hidden lg:inline" : ""
                }`}
              >
                {point.x}
              </span>
            ))}
          </div>
        </div>

        <span className="mr-md">{t("pages|statistic$dataset-numbers")}</span>
      </div>
    </div>
  );
};

export default StatisticGraph;
