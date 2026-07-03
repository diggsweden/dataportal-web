import { AppLink } from "@/components/link";

interface StatisticListItemProps {
  listText?: string;
  listNumber?: number;
  listUrl?: string;
  translation?: string;
}

export function StatisticListItem({
  listText,
  listNumber,
  listUrl,
  translation,
}: StatisticListItemProps) {
  return (
    <li className="mb-lg pl-sm last:mb-none">
      <div className="flex w-full justify-between">
        <AppLink
          href={listUrl || "#"}
          className="mr-sm hyphens-auto text-green-600"
          aria-label={`${listText} ${listNumber} ${translation}`}
        >
          {listText}
        </AppLink>
        <span className="font-strong">{listNumber}</span>
      </div>
    </li>
  );
}
