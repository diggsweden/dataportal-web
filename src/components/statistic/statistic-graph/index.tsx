import { useTranslations } from "next-intl";
import type { StatisticHistoryPoint } from "@/lib/statistic";

const Y_TICK_COUNT = 5;
const BAR_COLOR = "#CD7A6E";
const MAX_BARS = 19;

function buildYTicks(max: number): number[] {
  if (max <= 0) return [0];
  const rawStep = max / Y_TICK_COUNT;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const niceStep =
    normalized >= 5 ? 5 : normalized >= 2 ? 2 : normalized >= 1 ? 1 : 1;
  const step = niceStep * magnitude;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step; v += step) ticks.push(Math.round(v));
  return ticks;
}

interface StatisticGraphProps {
  points: StatisticHistoryPoint[];
}

export function StatisticGraph({ points }: StatisticGraphProps) {
  const t = useTranslations();

  const bars = points
    .slice(0, MAX_BARS)
    .map(({ x, y }) => ({ label: x.substring(2, 7), value: y }))
    .reverse();

  const yTicks = buildYTicks(
    bars.reduce((acc, p) => Math.max(acc, p.value), 0),
  );
  const yMax = yTicks[yTicks.length - 1] || 1;

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
            {bars.map((bar) => (
              <div
                key={bar.label}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div
                  className="w-3/4 self-center"
                  style={{
                    height: `${(bar.value / yMax) * 100}%`,
                    backgroundColor: BAR_COLOR,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full pl-[70px] pr-[10px]">
          <div className="flex flex-1 gap-[2px] pt-xs text-sm text-textSecondary">
            {bars.map((bar, idx) => (
              <span
                key={`label-${bar.label}`}
                className={`flex-1 text-center ${
                  idx % 2 === 1 ? "hidden lg:inline" : ""
                }`}
              >
                {bar.label}
              </span>
            ))}
          </div>
        </div>

        <span className="mr-md">{t("pages.statistic.dataset-numbers")}</span>
      </div>
    </div>
  );
}
