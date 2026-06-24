import Link from "next/link";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import { Badge } from "@/components/badge";
import { FileFormatBadge } from "@/components/file-format-badge";
import { Heading } from "@/components/typography/heading";
import type { SearchHit as SearchHitType } from "@/types/search";

interface SearchHitProps {
  hit: SearchHitType;
  isCompact: boolean;
  onLinkClick?: () => void;
}

const URL_BADGE_MAP = {
  "/datasets": "pages.datasets.dataset_title",
  "/dataservice": "pages.datasetpage.dataservice",
  "/dataset-series": "pages.dataset-series.data-serie",
} as const satisfies Record<string, string>;

type BadgeKey = (typeof URL_BADGE_MAP)[keyof typeof URL_BADGE_MAP];

const getBadgeForUrl = (url: string): BadgeKey | null => {
  for (const [prefix, translationKey] of Object.entries(URL_BADGE_MAP)) {
    if (url.startsWith(prefix)) {
      return translationKey;
    }
  }
  return null;
};

export const SearchHit: FC<SearchHitProps> = ({
  hit,
  isCompact,
  onLinkClick,
}) => {
  const t = useTranslations();
  const badgeTranslationKey = getBadgeForUrl(hit.url);

  return (
    <li className="group relative max-w-lg space-y-sm">
      <Link
        href={hit.url}
        onClick={onLinkClick}
        data-tracking-name="search-hit"
        className="focus--none before:focus--outline before:focus--out before:focus--primary block no-underline before:absolute before:inset-none"
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

      <div className="block space-y-sm">
        <div className="mb-xs text-sm font-strong text-textSecondary">
          {hit.metadata?.theme_literal &&
            hit.metadata.theme_literal.length > 0 && (
              <span className="category">
                {hit.metadata.theme_literal.length > 1
                  ? t("pages.datasetpage.categories")
                  : t("pages.datasetpage.category_tag")}
                : {hit.metadata.theme_literal.join(",  ")}
              </span>
            )}
        </div>
        <div className="formats flex w-full flex-wrap gap-md">
          {badgeTranslationKey && <Badge text={t(badgeTranslationKey)} />}
          {hit.metadata?.custom_facet_literal?.map((m: string) => (
            <Badge key={m} text={m} />
          ))}
          {hit.metadata?.format_literal?.map((m: string) => (
            <FileFormatBadge key={m} badgeName={m} />
          ))}
        </div>
      </div>
    </li>
  );
};
