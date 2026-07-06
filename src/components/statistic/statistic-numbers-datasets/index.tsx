interface StatisticNumbersDatasetsProps {
  count: number;
}

export function StatisticNumbersDatasets({
  count,
}: StatisticNumbersDatasetsProps) {
  return <span className="text-lg font-strong"> {count}</span>;
}
