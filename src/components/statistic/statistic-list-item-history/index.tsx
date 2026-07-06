interface StatisticListItemHistoryProps {
  listText?: string;
  listNumber?: number;
}

export function StatisticListItemHistory({
  listText,
  listNumber,
}: StatisticListItemHistoryProps) {
  return (
    <li className="pl-sm">
      <p className="inline-flex w-full justify-between">
        <span>{listText}</span>
        <span className="text-right font-strong">{listNumber}</span>
      </p>
    </li>
  );
}
