"use client";

import dynamic from "next/dynamic";

export const DynamicStatisticGraphNumbers = dynamic(
  () =>
    import("@/features/statistic/statistic-graph-numbers").then(
      (c) => c.StatisticGraphNumbers,
    ),
  { ssr: false },
);

export const DynamicStatisticNumbersDatasets = dynamic(
  () =>
    import("@/features/statistic/statistic-numbers-datasets").then(
      (c) => c.StatisticNumbersDatasets,
    ),
  { ssr: false },
);

export const DynamicStatistic = dynamic(() => import("@/features/statistic"), {
  ssr: false,
});
