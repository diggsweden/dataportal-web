import { useTranslations } from "next-intl";
import { StatisticDataPresentation } from "@/components/statistic/statistic-data-presentation";

interface StatisticNumbersProps {
  datasetCount: number;
  publisherCount: number;
}

export function StatisticNumbers({
  datasetCount,
  publisherCount,
}: StatisticNumbersProps) {
  const t = useTranslations();

  return (
    <div className="flex w-full flex-col justify-between lg:w-[18%]">
      <StatisticDataPresentation
        dataText={t("pages.search.datasets")}
        dataNumber={datasetCount}
      />
      <StatisticDataPresentation
        dataText={t("pages.search.organisations")}
        dataNumber={publisherCount}
      />
    </div>
  );
}
