import React, { useState } from "react";
import { ESRdfType, ESType } from "@/utilities/entryScape";
import useTranslation from "next-translate/useTranslation";
import { SearchContextData } from "@/providers/SearchProvider";
import { SearchFilter } from "@/components/content/Search/SearchFilters/SearchFilter";
import FilterIcon from "@/assets/icons/filter.svg";
import CloseIcon from "@/assets/icons/closeCross.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import SearchIcon from "@/assets/icons/search.svg";
import { Button } from "@/components/global/Button";
import { TextInput } from "@/components/global/Form/TextInput";

interface SearchFilterProps {
  showFilter: boolean;
  search: SearchContextData;
  searchMode: SearchMode;
  query: string;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showTip?: boolean;
}

interface MarkAllProps {
  search: SearchContextData;
  toggleKey: string;
  title: string;
}

interface FilterSearchProps {
  filterKey: string;
  filter: InputFilter;
  setFilter: React.Dispatch<React.SetStateAction<InputFilter>>;
  fetchMore: () => void;
}

type InputFilter = { [key: string]: string };
export type SearchMode = "content" | "datasets" | "concepts" | "specifications";

const FilterSearch: React.FC<FilterSearchProps> = ({
  filterKey,
  filter,
  setFilter,
  fetchMore,
}) => {
  const { t } = useTranslation("pages");

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != "undefined" && typeof location != "undefined") {
      localStorage.setItem(`ScrollposY_${location.search}`, "0");
    }
  };

  return (
    <div className="relative flex items-center">
      <label htmlFor={filterKey} className="sr-only">
        {t("search$filtersearch")}
      </label>
      <TextInput
        id={filterKey}
        name={filterKey}
        placeholder={t("search$filtersearch")}
        value={filter[filterKey] || ""}
        onChange={(e) => (
          clearCurrentScrollPos(),
          fetchMore(),
          setFilter({ ...filter, [filterKey]: e.target.value })
        )}
      />
      <SearchIcon
        height={24}
        width={24}
        className="absolute right-sm [&_path]:fill-brown-500"
      />
    </div>
  );
};

const MarkAll: React.FC<MarkAllProps> = ({ search, toggleKey, title }) => {
  return (
    <div className="filter-checkall">
      <button
        className={`filter-btn ${
          search.facetSelected(toggleKey, "*") && "selected"
        }`}
        onClick={async () => {
          await search.set({
            facetValues: search.request.facetValues
              ? search.request.facetValues.filter(
                  (f) => f.facet != toggleKey || f.facetType == ESType.wildcard,
                )
              : [],
          });

          let wildcardFacet: SearchFacetValue = {
            count: -1,
            facet: toggleKey,
            facetType: ESType.wildcard,
            related: false,
            facetValueString: "",
            resource: "*",
            title: title,
          };
          wildcardFacet.facetValueString = `${toggleKey}||${wildcardFacet.resource}||${wildcardFacet.related}||${wildcardFacet.facetType}||${toggleKey}||${wildcardFacet.title}`;
          await search.toggleFacet(wildcardFacet);
          await search.doSearch(false, true, false);

          if (search.facetSelected(toggleKey, "*")) {
            search.sortAllFacets(toggleKey);
          } else {
            search.sortAllFacets();
          }
        }}
      >
        {title} {search.facetSelected(toggleKey, "*")}
        <span className="check"></span>
      </button>
    </div>
  );
};

const FindFilters = (
  categoryFilters: SearchFacetValue[],
  checkedFilters: SearchFacetValue[] | undefined,
) => {
  if (!checkedFilters) return "";

  const allTitles = categoryFilters.map((item) => item.title);
  const checkedTitles = checkedFilters.map((item) => item.title);
  const union = allTitles.filter((x) => checkedTitles.includes(x));

  if (union.length > 0) {
    return " (" + union.length + ")";
  }

  return "";
};

/**
 * Controls for filtering searchhits
 *
 * @param {boolean} showFilter disable or enable filters
 * @param {SearchContextData} search context for handling searchstate
 * @param {SearchMode} searchMode
 * @param {string} query
 * @returns JSX-elements of selects and checkboxes
 */
export const SearchFilters: React.FC<SearchFilterProps> = ({
  showFilter,
  search,
  searchMode,
  query,
  setShowFilter,
}) => {
  const { t } = useTranslation();
  const [inputFilter, setInputFilter] = useState<InputFilter>({});

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != "undefined" && typeof location != "undefined") {
      localStorage.setItem(`ScrollposY_${location.search}`, "0");
    }
  };

  return (
    <>
      <div className="mb-md">
        <Button
          variant="plain"
          size="sm"
          icon={FilterIcon}
          iconPosition="left"
          aria-label={
            showFilter ? t("common|hide-filter") : t("common|show-filter")
          }
          className={showFilter ? "filter-active" : ""}
          onClick={() => setShowFilter(!showFilter)}
          label={showFilter ? t("common|hide-filter") : t("common|show-filter")}
        ></Button>
      </div>

      <div className={showFilter ? "block" : "hidden"}>
        <div className="mb-lg flex space-x-md">
          {search.allFacets &&
            Object.entries(search.allFacets)
              .sort((a, b) => (a[1].indexOrder > b[1].indexOrder ? 1 : -1))
              .map(([key, value]) => {
                const isLicense = false; // Removed for now. key.includes('license');
                const shouldFetchMore = value.show <= value.count;
                const show = (value && value.show) || 20;
                const facetValues = inputFilter[key]
                  ? value?.facetValues.filter(
                      (v) =>
                        v.title
                          ?.toLowerCase()
                          .includes(inputFilter[key].toLowerCase()),
                    )
                  : value?.facetValues.slice(0, show);
                return (
                  <div key={"box" + value.title} className="search-filter">
                    <SearchFilter
                      title={
                        value.title +
                        FindFilters(
                          value.facetValues,
                          search.request.facetValues,
                        )
                      }
                    >
                      <div className="absolute mt-sm max-w-[330px] bg-white shadow-md">
                        {searchMode == "datasets" && ( //only render on searchpage
                          <>
                            {isLicense ? (
                              <MarkAll
                                search={search}
                                toggleKey={key}
                                title={t(`filters|allchecktext$${key}`)}
                              />
                            ) : (
                              <FilterSearch
                                filterKey={key}
                                filter={inputFilter}
                                setFilter={setInputFilter}
                                fetchMore={() =>
                                  shouldFetchMore && search.fetchMoreFacets(key)
                                }
                              />
                            )}
                          </>
                        )}

                        {facetValues.map(
                          (facetValue: SearchFacetValue, index: number) => {
                            const selected = search.facetSelected(
                              key,
                              facetValue.resource,
                            );
                            return (
                              <button
                                aria-pressed={selected}
                                key={index}
                                className={`block w-full px-md py-md text-left hover:bg-brown-100 ${
                                  selected && "selected"
                                }`}
                                onClick={() => {
                                  clearCurrentScrollPos();
                                  search
                                    .toggleFacet(facetValue)
                                    .then(async () => {
                                      if (search.facetSelected(key, "*")) {
                                        let wildcardFacet: SearchFacetValue = {
                                          count: -1,
                                          facet: key,
                                          facetType: ESType.wildcard,
                                          related: false,
                                          facetValueString: "",
                                          resource: "*",
                                          title: t(
                                            `filters|allchecktext$${key}`,
                                          ),
                                        };
                                        await search.toggleFacet(wildcardFacet);
                                      }

                                      search
                                        .doSearch(false, true, false)
                                        .then(() => {
                                          if (selected) {
                                            search.sortAllFacets(key);
                                          } else {
                                            search.sortAllFacets();
                                          }
                                        });
                                    });
                                }}
                              >
                                {facetValue.title || facetValue.resource} (
                                {facetValue.count}) {selected}
                                <span
                                  className={
                                    search.facetSelected(key, "*")
                                      ? "check-disabled check"
                                      : "check"
                                  }
                                ></span>
                              </button>
                            );
                          },
                        )}

                        {value.facetValues.length > value.show && (
                          <button
                            className="filter-btn"
                            onClick={() => {
                              search.fetchMoreFacets(key);
                            }}
                          >
                            {search.loadingFacets
                              ? `${t("common|loading")}...`
                              : `${t("common|load-more")}...`}
                          </button>
                        )}

                        {facetValues.length == 0 && (
                          <div className="no-filter-hits show">
                            {t("pages|search$nohits")}
                          </div>
                        )}
                      </div>
                    </SearchFilter>
                  </div>
                );
              })}
          {searchMode == "datasets" && (
            <div className="button button--secondary button--small">
              <label className="text-base" htmlFor="api_only">
                API
              </label>
              <input
                id="api_only"
                name="API"
                type="checkbox"
                checked={
                  search.request.esRdfTypes?.some(
                    (t) => t == ESRdfType.esterms_ServedByDataService,
                  ) &&
                  search.request.esRdfTypes?.some(
                    (t) => t == ESRdfType.esterms_IndependentDataService,
                  ) &&
                  !search.request.esRdfTypes?.some(
                    (t) => t == ESRdfType.dataset,
                  )
                }
                onChange={() => {
                  clearCurrentScrollPos();
                  if (
                    search.request.esRdfTypes?.some(
                      (t) => t == ESRdfType.esterms_ServedByDataService,
                    ) &&
                    search.request.esRdfTypes?.some(
                      (t) => t == ESRdfType.esterms_IndependentDataService,
                    ) &&
                    !search.request.esRdfTypes?.some(
                      (t) => t == ESRdfType.dataset,
                    )
                  ) {
                    search
                      .set({
                        esRdfTypes: [
                          ESRdfType.dataset,
                          ESRdfType.esterms_IndependentDataService,
                          ESRdfType.esterms_ServedByDataService,
                        ],
                        query: query,
                      })
                      .then(() => search.doSearch());
                  } else {
                    search
                      .set({
                        esRdfTypes: [
                          ESRdfType.esterms_IndependentDataService,
                          ESRdfType.esterms_ServedByDataService,
                        ],
                        query: query,
                      })
                      .then(() => search.doSearch());
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex space-x-md">
          {search.request.facetValues &&
            search.request.facetValues.length > 0 && (
              <span className="text-textSecondary">
                {t("common|active-filters")}:
              </span>
            )}
          {search.request &&
            search.request.facetValues &&
            (search.request.facetValues as SearchFacetValue[]).map(
              (facetValue: SearchFacetValue, index: number) => (
                <Button
                  variant="filter"
                  size="xs"
                  key={index}
                  label={facetValue.title || facetValue.resource}
                  icon={CloseIcon}
                  iconPosition="right"
                  onClick={() => {
                    clearCurrentScrollPos();
                    search.toggleFacet(facetValue).then(() => {
                      search.doSearch();
                    });
                  }}
                />
              ),
            )}
        </div>
        <div
          className={
            search.request?.facetValues &&
            search.request.facetValues.length >= 2
              ? "block"
              : "hidden"
          }
        >
          <Button
            variant="plain"
            size="sm"
            icon={TrashIcon}
            iconPosition="left"
            onClick={() => {
              clearCurrentScrollPos();
              search.set({ facetValues: [] }).then(() => search.doSearch());
            }}
            label={t("common|clear-filters")}
          />
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
