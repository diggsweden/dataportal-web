import React, { useEffect, useState } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { SearchMode } from "@/components/content/Search/SearchFilters";
import { FileFormatBadge } from "@/components/global/FileFormatBadge";
import { clearLocalStorage } from "@/utilities";
import useTranslation from "next-translate/useTranslation";
import { SearchSortOrder, SearchContextData } from "@/providers/SearchProvider";
import Link from "next/link";
import { Heading } from "@/components/global/Typography/Heading";
import { Button } from "@/components/global/Button";
import ListIcon from "@/assets/icons/list.svg";
import DetailedListIcon from "@/assets/icons/listDetailed.svg";
import { Select } from "@/components/global/Form/Select";
import { Pagination } from "@/components/global/Pagination";

interface SearchResultsProps {
  search: SearchContextData;
  searchMode: SearchMode;
  showTip?: boolean;
  showSorting: boolean;
}

const searchFocus = () => {
  let content = document.querySelector("#search-result");
  if (!content) return;

  const focusable = content.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const first = focusable[0];

  if (first) {
    first.focus();
  }
};

const saveCurrentScrollPos = () => {
  if (typeof localStorage != "undefined" && typeof location != "undefined") {
    localStorage.setItem(
      `ScrollposY_${location.search}`,
      JSON.stringify(window.scrollY),
    );
  }
};

const clearCurrentScrollPos = () => {
  if (typeof localStorage != "undefined" && typeof location != "undefined") {
    localStorage.setItem(`ScrollposY_${location.search}`, "0");
  }
};

/**
 * Adds sorting options to the search-results
 *
 * @param {*} { search } Context from the SearchProvider
 */
const SortingOptions: React.FC<{
  setCompact: React.Dispatch<React.SetStateAction<boolean>>;
  isCompact: boolean;
  search: SearchContextData;
}> = ({ search, setCompact, isCompact }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-lg flex items-center gap-md md:mb-none">
      <Button
        size="sm"
        variant="plain"
        className="order-3 md:order-none"
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
      >
        {isCompact ? <ListIcon /> : <DetailedListIcon />}
        <span className="hidden md:block">
          {isCompact
            ? t("pages|search$compact-list")
            : t("pages|search$detailed-list")}
        </span>
      </Button>

      <Select
        id="sort"
        label={t("pages|search$sort")}
        onChange={(event) => {
          event.preventDefault();
          clearCurrentScrollPos();
          search
            .set({
              page: 0,
              sortOrder: parseInt(event.target.value),
            })
            .then(() => search.doSearch());
        }}
      >
        <option
          aria-selected={search.request.sortOrder == SearchSortOrder.score_desc}
          value={SearchSortOrder.score_desc}
        >
          {t("pages|search$relevance")}
        </option>

        <option
          aria-selected={
            search.request.sortOrder == SearchSortOrder.modified_desc
          }
          value={SearchSortOrder.modified_desc}
        >
          {t("pages|search$date")}
        </option>
      </Select>

      <Select
        id="hits"
        label={t("pages|search$numberofhits")}
        onChange={(event) => {
          event?.preventDefault();
          clearCurrentScrollPos();
          search
            .set({
              take: parseInt(event.target.value),
            })
            .then(() => search.doSearch());
        }}
      >
        <option aria-selected={search.request.take == 20} value="20">
          {t("pages|search$numberofhits-20")}
        </option>
        <option aria-selected={search.request.take == 50} value="50">
          {t("pages|search$numberofhits-50")}
        </option>
        <option aria-selected={search.request.take == 100} value="100">
          {t("pages|search$numberofhits-100")}
        </option>
      </Select>
    </div>
  );
};

/**
 * @param {SearchContextData} { search } the context of the SearchProvider
 * @param {SearchMode} { searchMode } typ of search, data | begrepp | specifikation
 * @returns a list of links
 * @param {boolean} showSorting disable or enable filters
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  search,
  searchMode,
}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const { trackEvent } = useMatomo();
  const { t } = useTranslation();

  const searchKey = typeof location != "undefined" ? location.search : "server";
  const posY =
    typeof localStorage != "undefined"
      ? localStorage.getItem(`ScrollposY_${searchKey}`)
      : "0";

  const trackSearchHitClick = (url: string) => {
    trackEvent({
      category: `Sidor från en webbplatssökning`,
      name: `${searchMode}: Webbplatssökning`,
      action: `Url: ${url}, sökfras: ${search.request.query}, typ: ${searchMode}`,
    });
  };

  const [isCompact, setCompact] = useState(false);

  useEffect(() => {
    clearLocalStorage("ScrollposY_", `ScrollposY_${searchKey}`);
  }, [searchKey]);

  useEffect(() => {
    const count = search.result.count || -1;
    count > 0 && posY && posY != "0" && window.scrollTo(0, parseInt(posY, 10));
    if (search.request.compact && search.request.compact) setCompact(false);
    else setCompact(true);
  });

  useEffect(() => {
    if (search.result.pages || 0 > 1) {
      clearCurrentScrollPos();
      search
        .set({
          page: pageNumber || 0,
        })
        .then(() => search.doSearch());
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      searchFocus();
    }
  }, [pageNumber]);

  return (
    <>
      <div id="search-result" className="my-xl">
        <div className="mb-lg flex flex-col-reverse justify-between md:flex-row">
          <Heading level={2} size="md" className="search-result-header">
            {search.loadingHits && <span>{t("common|loading")}</span>}
            {!search.loadingHits &&
              search.result &&
              (search.result.count || 0) >= 0 &&
              `${search.result.count} ${t("pages|search$dataset-hits")}`}
          </Heading>

          {searchMode == "datasets" && (
            <SortingOptions
              setCompact={setCompact}
              isCompact={isCompact}
              search={search}
            />
          )}
        </div>

        {search.result && (
          <div>
            <ul className="search-result-list space-y-xl">
              {search.result.hits &&
                search.result.hits.map((hit, index) => (
                  <li className="max-w-lg" key={index}>
                    <Link
                      href={`${hit.url}#ref=${
                        window ? window.location.search : ""
                      }`}
                      onClick={() => {
                        saveCurrentScrollPos();
                        trackSearchHitClick(hit.url || "");
                      }}
                      className="group no-underline"
                    >
                      {hit.metadata &&
                        search.allFacets &&
                        !search.loadingFacets &&
                        hit.metadata["inScheme_resource"] &&
                        search.getFacetValueTitle(
                          "http://www.w3.org/2004/02/skos/core#inScheme",
                          hit.metadata["inScheme_resource"][0],
                        ) && (
                          <span>
                            {search.getFacetValueTitle(
                              "http://www.w3.org/2004/02/skos/core#inScheme",
                              hit.metadata["inScheme_resource"][0],
                            )}
                          </span>
                        )}

                      <Heading
                        level={3}
                        size="sm"
                        className="mb-sm font-normal text-green-600 group-hover:underline "
                        lang={hit.titleLang}
                      >
                        {hit.title}
                      </Heading>

                      {isCompact && hit.descriptionLang && (
                        <p className="mb-xs">{hit.description}</p>
                      )}

                      <div
                        className={
                          !isCompact
                            ? "flex items-baseline space-x-md"
                            : "block"
                        }
                      >
                        <div className="mb-xs text-sm font-strong text-textSecondary">
                          {hit.metadata &&
                            hit.metadata["theme_literal"].length > 0 && (
                              <span className="category">
                                {hit.metadata["theme_literal"].join(",  ")}
                              </span>
                            )}
                          {hit.metadata &&
                            hit.metadata["organisation_literal"] &&
                            hit.metadata["organisation_literal"].length > 0 && (
                              <span className="organisation">
                                {" | " +
                                  hit.metadata["organisation_literal"][0]}
                              </span>
                            )}
                        </div>

                        <div className="formats space-x-md">
                          {hit.metadata &&
                            hit.metadata["format_literal"] &&
                            hit.metadata["format_literal"].map(
                              (m: string, index: number) => (
                                <FileFormatBadge key={index} badgeName={m} />
                              ),
                            )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
        {(search.result.pages || 0) > 1 && (
          <Pagination
            searchResult={search.result.count}
            pages={search.result.pages}
            setPageNumber={setPageNumber}
          />
        )}
      </div>
    </>
  );
};

export default SearchResults;
