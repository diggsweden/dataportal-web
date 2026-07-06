import { useTranslations } from "next-intl";
import { StatisticListItemHistory } from "@/components/statistic/statistic-list-item-history";
import { Heading } from "@/components/typography/heading";
import type { StatisticHistoryPoint } from "@/lib/statistic";

const TOP_ITEMS_TO_SHOW = 19;

interface StatisticGraphNumbersProps {
  history: StatisticHistoryPoint[];
}

export function StatisticGraphNumbers({ history }: StatisticGraphNumbersProps) {
  const t = useTranslations();

  const items = history
    .slice(0, TOP_ITEMS_TO_SHOW)
    .map(({ x, y }) => ({ label: x.substring(0, 7), value: y }));

  return (
    <div>
      <Heading level={2} className="mb-lg md:mb-xl">
        {t("pages.statistic.dataset-numbers")}
      </Heading>
      <div className="bg-white p-xl">
        <ol className="list-decimal space-y-lg pl-lg">
          {items.map((item, index) => (
            <StatisticListItemHistory
              key={item.label ?? `history-${index}`}
              listText={item.label}
              listNumber={item.value}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
