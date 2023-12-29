import React, { useEffect, useState } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { SearchMode } from "@/components/content/Search/SearchFilters";
import { FileFormatBadge } from "@/components/FileFormatBadge";
import { clearLocalStorage } from "@/utilities";
import useTranslation from "next-translate/useTranslation";
import { SearchSortOrder, SearchContextData } from "@/providers/SearchProvider";
import Link from "next/link";
import Heading from "@/components/global/Typography/Heading";

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
    <div className="flex space-x-md">
      <div id="list-view" className="listview-options">
        {isCompact ? (
          <button
            aria-label={
              isCompact
                ? `${t("pages|search$compact-list")}`
                : `${t("pages|search$compact-list-active")}`
            }
            onClick={() => {
              clearCurrentScrollPos();
              search.set({ compact: true }).then(() => {
                search.setStateToLocation();
                setCompact(false);
              });
            }}
          >
            {t("pages|search$compact-list")}
          </button>
        ) : (
          <button
            aria-label={
              isCompact
                ? `${t("pages|search$detailed-list-active")}`
                : `${t("pages|search$detailed-list")}`
            }
            onClick={() => {
              clearCurrentScrollPos();
              search.set({ compact: false }).then(() => {
                search.setStateToLocation();
                setCompact(true);
              });
            }}
          >
            {t("pages|search$detailed-list")}
          </button>
        )}
      </div>

      <div className="search-sort">
        <label className="sorting-heading text-base font-bold" htmlFor="sort">
          {t("pages|search$sort")}
        </label>
        <select
          className="text-base"
          id="sort"
          name={t("pages|search$sort")}
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
            aria-selected={
              search.request.sortOrder == SearchSortOrder.score_desc
            }
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
        </select>
      </div>

      <div className="search-hits">
        <label className="sorting-heading text-base font-bold" htmlFor="hits">
          {t("pages|search$numberofhits")}
        </label>

        <select
          className="text-base"
          id="hits"
          name={t("pages|search$numberofhits")}
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
        </select>
      </div>
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
  showSorting,
}) => {
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
    if (search.request.compact && search.request.compact) setCompact(false);
    else setCompact(true);
  });

  useEffect(() => {
    const count = search.result.count || -1;
    count > 0 && posY && posY != "0" && window.scrollTo(0, parseInt(posY, 10));
  });

  return (
    <>
      <div id="search-result" className="my-xl">
        <div className="mb-lg flex justify-between">
          <Heading level={2} size="md" className="search-result-header">
            {search.loadingHits && <span>{t("common|loading")}</span>}
            {!search.loadingHits &&
              search.result &&
              (search.result.count || 0) >= 0 &&
              `${search.result.count} ${t("pages|search$dataset-hits")}`}
          </Heading>

          {searchMode == "datasets" && (
            <div
              className={
                showSorting
                  ? "active sorting-options-wrapper"
                  : "sorting-options-wrapper"
              }
            >
              <SortingOptions
                setCompact={setCompact}
                isCompact={isCompact}
                search={search}
              />
            </div>
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

                      {!isCompact && (
                        <div className="org-format">
                          <span className="result-org text-base">
                            {hit.metadata &&
                              hit.metadata["organisation_literal"] &&
                              hit.metadata["organisation_literal"][0]}
                          </span>

                          <div className="org-format-filebadges">
                            {hit.metadata &&
                              hit.metadata["format_literal"] &&
                              hit.metadata["format_literal"].map(
                                (m: string, index: number) => (
                                  <p className="text-base file" key={index}>
                                    <FileFormatBadge badgeName={m} />
                                  </p>
                                ),
                              )}
                          </div>
                        </div>
                      )}

                      <div className="mb-xs text-sm font-strong text-textSecondary">
                        {isCompact &&
                          hit.metadata &&
                          hit.metadata["organisation_literal"] &&
                          hit.metadata["organisation_literal"].length > 0 && (
                            <span className="organisation">
                              {hit.metadata["organisation_literal"][0] + " | "}
                            </span>
                          )}
                        {isCompact && (
                          <span className="category">
                            {hit.metadata &&
                              hit.metadata["theme_literal"].join(",  ")}
                          </span>
                        )}
                      </div>

                      {isCompact && (
                        <div className="formats space-x-md">
                          {hit.metadata &&
                            hit.metadata["format_literal"] &&
                            hit.metadata["format_literal"].map(
                              (m: string, index: number) => (
                                <span
                                  className="bg-pink-200 px-sm py-xs text-sm uppercase"
                                  key={index}
                                >
                                  <FileFormatBadge badgeName={m} />
                                </span>
                              ),
                            )}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {(search.result.pages || 0) > 1 && (
        <div className="pagination">
          <div className="prev-next-page">
            <div className="first-page">
              {(search.request.page || 0) > 1 && (
                <button
                  onClick={() => {
                    clearCurrentScrollPos();
                    search
                      .set({
                        page: 0,
                      })
                      .then(() => search.doSearch());
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                    searchFocus();
                  }}
                >
                  {t("pages|search$first-page")}
                </button>
              )}
            </div>
            <button
              disabled={(search.request.page || 0) === 0}
              onClick={() => {
                clearCurrentScrollPos();
                search
                  .set({
                    page: (search.request.page || 0) - 1,
                  })
                  .then(() => search.doSearch());
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                searchFocus();
              }}
            >
              {t("pages|search$prev-page")}
            </button>
            <span>
              {t("pages|search$page")} {(search.request.page || 0) + 1}{" "}
              {t("common|of")} {search.result.pages}
            </span>
            <button
              disabled={
                (search.result.pages || 1) === (search.request.page || 0) + 1
              }
              onClick={() => {
                clearCurrentScrollPos();
                search
                  .set({
                    page: (search.request.page || 0) + 1,
                  })
                  .then(() => search.doSearch());
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                searchFocus();
              }}
            >
              {t("pages|search$next-page")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResults;
