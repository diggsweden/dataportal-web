import useTranslation from "next-translate/useTranslation";
import {
  useEffect,
  useState,
  FC,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

import ListCompactIcon from "@/assets/icons/list-compact.svg";
import ListDetailedIcon from "@/assets/icons/list-detailed.svg";
import { Button } from "@/components/button";
import { Pagination } from "@/components/pagination";
import { Heading } from "@/components/typography/heading";
import { SearchMode } from "@/features/search/search-filters";
import { SearchSelectFilter } from "@/features/search/search-filters/search-select-filter";
import { SearchHit } from "@/features/search/search-hit";
import {
  SearchSortOrder,
  SearchContextData,
} from "@/providers/search-provider";
import { SettingsContext } from "@/providers/settings-provider";

interface SearchResultsProps {
  search: SearchContextData;
  searchMode: SearchMode;
  showTip?: boolean;
  showSorting: boolean;
}

const searchFocus = () => {
  const content = document.querySelector("#search-result");
  if (!content) return;

  const focusable = content.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const first = focusable[0];

  if (first) {
    first.focus();
  }
};

const SCROLL_POS_PREFIX = "ScrollPosY_" as const;

function getScrollKey(search: string): string {
  return `${SCROLL_POS_PREFIX}${search}`;
}

function saveCurrentScrollPos(): void {
  if (typeof window === "undefined") return;
  const key = getScrollKey(window.location.search);
  localStorage.setItem(key, window.scrollY.toString());
}

function clearCurrentScrollPos(): void {
  if (typeof window === "undefined") return;
  const key = getScrollKey(window.location.search);
  localStorage.removeItem(key);
}

/**
 * Adds sorting options to the search-results
 *
 * @param {*} { search } Context from the SearchProvider
 */
const SortingOptions: FC<{
  setCompact: Dispatch<SetStateAction<boolean>>;
  isCompact: boolean;
  search: SearchContextData;
}> = ({ search, setCompact, isCompact }) => {
  const { t } = useTranslation();
  const { iconSize } = useContext(SettingsContext);

  return (
    <div className="mb-lg flex flex-wrap items-center justify-between gap-md md:mb-none">
      <Button
        size="sm"
        variant="plain"
        className="hidden md:order-none md:flex"
        icon={isCompact ? ListCompactIcon : ListDetailedIcon}
        iconPosition="left"
        aria-label={
          isCompact
            ? t("pages|search$detailed-list-active")
            : t("pages|search$detailed-list")
        }
        onClick={() => {
          clearCurrentScrollPos();
          search.set({ compact: isCompact }).then(() => {
            search.setStateToLocation();
            setCompact(!isCompact);
          });
        }}
        label={
          isCompact
            ? t("pages|search$compact-list")
            : t("pages|search$detailed-list")
        }
      />

      {/* For mobile only */}
      <Button
        size="sm"
        variant="plain"
        iconSize={iconSize * 1.5}
        className="px-none md:hidden"
        icon={isCompact ? ListCompactIcon : ListDetailedIcon}
        iconPosition="left"
        aria-label={
          isCompact
            ? t("pages|search$detailed-list-active")
            : t("pages|search$detailed-list")
        }
        label={t("pages|search$list")}
        onClick={() => {
          clearCurrentScrollPos();
          search.set({ compact: isCompact }).then(() => {
            search.setStateToLocation();
            setCompact(!isCompact);
          });
        }}
      />

      <div className="flex items-center gap-md">
        <SearchSelectFilter
          id="sort"
          label={t("pages|search$sort")}
          value={search.request.sortOrder?.toString()}
          options={[
            {
              value: SearchSortOrder.score_desc.toString(),
              label: t("pages|search$relevance"),
            },
            {
              value: SearchSortOrder.modified_desc.toString(),
              label: t("pages|search$date"),
            },
          ]}
          onChange={(event) => {
            clearCurrentScrollPos();
            search
              .set({
                page: 0,
                sortOrder: parseInt(event.target.value),
              })
              .then(() => search.doSearch());
          }}
        />

        <SearchSelectFilter
          id="hits"
          label={t("pages|search$numberofhits")}
          value={search.request.take?.toString()}
          options={[
            { value: "20", label: t("pages|search$numberofhits-20") },
            { value: "50", label: t("pages|search$numberofhits-50") },
            { value: "100", label: t("pages|search$numberofhits-100") },
          ]}
          onChange={(event) => {
            clearCurrentScrollPos();
            search
              .set({
                take: parseInt(event.target.value),
              })
              .then(() => search.doSearch());
          }}
        />
      </div>
    </div>
  );
};

export const SearchResults: FC<SearchResultsProps> = ({
  search,
  searchMode,
}) => {
  const [isCompact, setCompact] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    // Restore scroll position only after results are loaded
    if (!search.loadingHits && search.result.hits!.length > 0) {
      const scrollKey = getScrollKey(window.location.search);
      const savedPosition = localStorage.getItem(scrollKey);

      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
        localStorage.removeItem(scrollKey); // Clear after restoring
      }
    }
  }, [search.loadingHits, search.result.hits]);

  // Set compact view state
  useEffect(() => {
    setCompact(!search.request.compact);
  }, [search.request.compact]);

  const changePage = (page: number) => {
    if (search.result.pages || 0 > 1) {
      clearCurrentScrollPos();
      search
        .set({
          page: page - 1,
        })
        .then(() => search.doSearch());
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      searchFocus();
    }
  };

  // Track both result count and filter changes
  useEffect(() => {
    if (search.loadingHits) {
      setLastUpdate(t("common|loading"));
    } else if (search.result) {
      const count = search.result.count || 0;
      const message = `${count} ${t("pages|search$dataset-hits")}`;
      setLastUpdate(message);
    }
  }, [search.loadingHits, search.result?.count, search.request.facetValues, t]);

  const SearchResultSkeleton = () => (
    <div className="animate-pulse space-y-lg opacity-50">
      <div className="rounded h-lg w-1/4 bg-green-600" />
      <div className="flex flex-col gap-sm">
        <div className="rounded my-xs h-sm w-1/3 bg-textSecondary" />
        <div className="rounded h-md w-3/4 bg-textPrimary" />
        <div className="rounded h-md w-3/4 bg-textPrimary" />
        {searchMode === "datasets" && (
          <div className="rounded h-sm w-2/4 bg-textSecondary" />
        )}
      </div>
    </div>
  );

  return (
    <div id="search-result" className="md:my-lg">
      <div className="mb-lg flex flex-col justify-between md:flex-row">
        <Heading
          level={2}
          size="md"
          className="search-result-header mb-md text-xl"
        >
          {/* Visual display of the count */}
          <span aria-hidden="true">
            {search.loadingHits && `${t("common|loading")}...`}
            {!search.loadingHits &&
              search.result &&
              (search.result.count || 0) >= 0 &&
              `${search.result.count} ${t("pages|search$dataset-hits")}`}
          </span>
          {/* Screen reader announcement */}
          <div aria-live="polite" className="sr-only" role="status">
            {lastUpdate}
          </div>
        </Heading>

        {searchMode !== "content" && (
          <SortingOptions
            setCompact={setCompact}
            isCompact={isCompact}
            search={search}
          />
        )}
      </div>

      {search.loadingHits && search.result.hits!.length === 0 ? (
        <div className="space-y-xl">
          {[...Array(5)].map((_, index) => (
            <SearchResultSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div>
          <ul className="search-result-list space-y-xl">
            {search.result.hits?.map((hit, index) => (
              <SearchHit
                key={index}
                hit={hit}
                isCompact={isCompact}
                onLinkClick={saveCurrentScrollPos}
              />
            ))}
          </ul>
        </div>
      )}
      {(search.result.pages || 0) > 1 && (
        <Pagination
          totalResults={search.result.count || 0}
          itemsPerPage={search.request.take ? search.request.take : 20}
          pageNumber={search?.request.page && search?.request.page + 1}
          changePage={changePage}
        />
      )}
    </div>
  );
};

export default SearchResults;
