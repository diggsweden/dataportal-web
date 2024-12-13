import Link from "next/link";
import { FC } from "react";

import { FileFormatBadge } from "@/components/file-format-badge";
import { Heading } from "@/components/typography/heading";
import { SearchHit as SearchHitType } from "@/types/search";

interface SearchHitProps {
  hit: SearchHitType;
  isCompact: boolean;
  onLinkClick?: () => void;
}

export const SearchHit: FC<SearchHitProps> = ({
  hit,
  isCompact,
  onLinkClick,
}) => {
  return (
    <li className="group relative max-w-lg space-y-sm">
      <Link
        href={hit.url}
        onClick={onLinkClick}
        className="search-result-link focus--none before:focus--outline before:focus--out before:focus--primary block no-underline before:absolute before:inset-none"
      >
        <Heading
          level={3}
          size="sm"
          className="focus--underline mb-sm font-normal text-green-600 group-hover:underline"
          lang={hit.titleLang}
        >
          {hit.title}
        </Heading>
      </Link>

      {hit.metadata?.inScheme_resource?.[0] && (
        <span className="inScheme_resource text-sm font-strong text-textSecondary">
          {hit.metadata.inScheme_resource[0]}
        </span>
      )}

      {hit.metadata?.organisation_literal && (
        <span className="break-words text-sm font-strong text-textSecondary">
          {hit.metadata.organisation_literal}
        </span>
      )}

      {hit.metadata?.organisation_type && (
        <span className="text-sm text-textSecondary">
          {"Typ: "}
          <span className="break-words font-strong">
            {hit.metadata.organisation_type}
          </span>
        </span>
      )}

      {isCompact && hit.description && (
        <p className="mb-xs line-clamp-4 break-words md:line-clamp-2">
          {hit.description}
        </p>
      )}

      <div
        className={
          !isCompact ? "flex items-baseline space-x-md" : "block space-y-sm"
        }
      >
        <div className="mb-xs text-sm font-strong text-textSecondary">
          {hit.metadata &&
            hit.metadata.theme_literal &&
            hit.metadata.theme_literal.length > 0 && (
              <span className="category">
                {hit.metadata.theme_literal.join(",  ")}
              </span>
            )}
        </div>
        <div className="formats flex w-full flex-wrap gap-md">
          {hit.metadata?.format_literal?.map((m: string, index: number) => (
            <FileFormatBadge key={index} badgeName={m} />
          ))}
        </div>
      </div>
    </li>
  );
};
