interface StatisticDataPresentationProps {
  dataText?: string;
  dataNumber?: number;
}

export function StatisticDataPresentation({
  dataText,
  dataNumber,
}: StatisticDataPresentationProps) {
  return (
    <div className="w-full bg-white px-lg py-[3.125rem] text-center first:mb-lg">
      <span className="block break-words text-2xl text-primary">
        {dataNumber || 0}
      </span>
      <span className="block hyphens-auto text-md">{dataText || ""}</span>
    </div>
  );
}
