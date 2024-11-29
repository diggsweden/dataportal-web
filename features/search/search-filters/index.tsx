import React, { useContext, useState, useMemo } from "react";
import { ESRdfType, ESType } from "@/utilities/entryscape/entryscape";
import useTranslation from "next-translate/useTranslation";
import { SearchContextData } from "@/providers/search-provider";
import { SearchFilter } from "@/features/search/search-filters/search-filter";
import FilterIcon from "@/assets/icons/filter.svg";
import SearchIcon from "@/assets/icons/search.svg";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form/text-input";
import { SettingsContext } from "@/providers/settings-provider";
import {
  SearchCheckboxFilter,
  SearchCheckboxFilterIcon,
} from "./search-checkbox-filter";
import { SearchActiveFilters } from "./search-active-filters";

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
  title: string;
  fetchMore: () => void;
}

type InputFilter = { [key: string]: string };
export type SearchMode = "content" | "datasets" | "concepts" | "specifications";

const FilterSearch: React.FC<FilterSearchProps> = ({
  filterKey,
  title,
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
      <TextInput
        id={filterKey}
        name={filterKey}
        placeholder={t("search$filtersearch")}
        className="focus--in border-none"
        aria-label={title}
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
        aria-hidden="true"
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
 * @param setShowFilter
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
  const { iconSize } = useContext(SettingsContext);
  const [inputFilter, setInputFilter] = useState<InputFilter>({});

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != "undefined" && typeof location != "undefined") {
      localStorage.setItem(`ScrollposY_${location.search}`, "0");
    }
  };

  const selected = (key: string, facetValue: SearchFacetValue) => {
    return search.facetSelected(key, facetValue.resource);
  };

  const doSearch = async (key: string, facetValue: SearchFacetValue) => {
    clearCurrentScrollPos();

    await search.toggleFacet(facetValue);

    if (search.facetSelected(key, "*")) {
      let wildcardFacet: SearchFacetValue = {
        count: -1,
        facet: key,
        facetType: ESType.wildcard,
        related: false,
        facetValueString: "",
        resource: "*",
        title: t(`filters|allchecktext$${key}`),
      };
      await search.toggleFacet(wildcardFacet);
    }

    await search.doSearch(false, true, false);

    if (selected(key, facetValue)) {
      search.sortAllFacets(key);
    } else {
      search.sortAllFacets();
    }
  };

  function updateFilters() {
    search.updateFacetStats();
    setShowFilter(!showFilter);
  }

  const groupedFacets = useMemo(() => {
    const grouped: { [key: string]: { [key: string]: SearchFacet } } = {};

    Object.entries(search.allFacets || {}).forEach(([key, facet]) => {
      const group = facet.group || "default";
      if (!grouped[group]) {
        grouped[group] = {};
      }
      grouped[group][key] = facet;
    });

    return grouped;
  }, [search.allFacets]);

  const hvd = "http://data.europa.eu/r5r/applicableLegislation";
  const national = "http://purl.org/dc/terms/subject";

  const activeCheckboxFilters = useMemo(() => {
    const filters = [];

    // HVD filter
    if (search.request.facetValues?.some((t) => t.title === ESRdfType.hvd)) {
      filters.push({
        id: "hvd_only",
        label: t(`resources|${hvd}`),
        facetValue: search.request.facetValues.find(
          (t) => t.title === ESRdfType.hvd,
        ),
      });
    }

    // National filter
    if (
      search.request.facetValues?.some(
        (t) => t.facet === ESRdfType.national_data,
      )
    ) {
      filters.push({
        id: "national_only",
        label: t(`resources|${national}`),
        facetValue: search.request.facetValues.find(
          (t) => t.facet === ESRdfType.national_data,
        ),
      });
    }

    // API only filter
    if (
      searchMode === "datasets" &&
      search.request.esRdfTypes?.some(
        (t) => t === ESRdfType.esterms_ServedByDataService,
      ) &&
      search.request.esRdfTypes?.some(
        (t) => t === ESRdfType.esterms_IndependentDataService,
      ) &&
      !search.request.esRdfTypes?.some((t) => t === ESRdfType.dataset)
    ) {
      filters.push({
        id: "api_only",
        label: t(`resources|api`),
        // Special handling for API filter since it uses esRdfTypes
        isApiFilter: true,
      });
    }

    return filters;
  }, [search.request.facetValues, search.request.esRdfTypes, searchMode]);

  return (
    <div id="SearchFilters" role="region" aria-label={t("common|filter")}>
      <Button
        variant="plain"
        size="sm"
        icon={FilterIcon}
        iconPosition="left"
        aria-label={
          showFilter ? t("common|hide-filter") : t("common|show-filter")
        }
        aria-expanded={showFilter}
        aria-controls="filter-content"
        onClick={() => updateFilters()}
        label={showFilter ? t("common|hide-filter") : t("common|show-filter")}
        disabled={
          search.loadingFacets && Object.keys(groupedFacets).length === 0
        }
      />

      <div
        id="filter-content"
        className={`mt-lg border-t border-brown-400 pt-lg ${
          showFilter ? "block" : "hidden"
        }`}
      >
        {Object.entries(groupedFacets).map(([groupName, groupFacets]) => (
          <div
            id="group-container"
            key={groupName}
            className="mb-lg items-center md:flex"
          >
            {groupName !== "default" && (
              <h4 className="mb-sm mr-md text-sm text-textSecondary md:mb-none">
                {t(`filters|group$${groupName}`)}:
              </h4>
            )}
            <ul
              className="flex flex-col flex-wrap gap-md md:flex-row"
              role="list"
              aria-label={t("common|available-filters")}
            >
              {Object.entries(groupFacets)
                .sort((a, b) => (a[1].indexOrder > b[1].indexOrder ? 1 : -1))
                .map(([key, value], idx: number) => {
                  const isLicense = false;
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

                  if (key !== hvd && key !== national) {
                    return (
                      <li key={`${value.title}-${idx}`} role="listitem">
                        <SearchFilter
                          title={value.title}
                          usedFilters={FindFilters(
                            value.facetValues,
                            search.request.facetValues,
                          )}
                        >
                          <div className="absolute z-10 mr-lg mt-sm max-h-[600px] w-full overflow-y-auto bg-white shadow-md md:max-w-[20.625rem]">
                            {(searchMode == "datasets" ||
                              searchMode == "specifications") && (
                              //only render on searchpage
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
                                    title={value.title}
                                    fetchMore={() =>
                                      shouldFetchMore &&
                                      search.fetchMoreFacets(key)
                                    }
                                  />
                                )}
                              </>
                            )}
                            {/* List of filter options within this category */}
                            <ul role="listbox" aria-multiselectable="true">
                              {facetValues.map(
                                (
                                  facetValue: SearchFacetValue,
                                  index: number,
                                ) => (
                                  <li
                                    key={index}
                                    role="option"
                                    aria-selected={selected(key, facetValue)}
                                  >
                                    <button
                                      className={`focus--in group relative flex w-full items-center break-all py-md pl-md pr-[3rem] text-left hover:bg-brown-100 ${
                                        selected(key, facetValue) &&
                                        "font-strong"
                                      }`}
                                      onClick={() => {
                                        doSearch(key, facetValue);
                                      }}
                                      role="checkbox"
                                      aria-checked={selected(key, facetValue)}
                                    >
                                      {facetValue.title || facetValue.resource}{" "}
                                      ({facetValue.count})
                                      {/* Decorative checkbox icon */}
                                      <span
                                        className="absolute right-md"
                                        aria-hidden="true"
                                      >
                                        <SearchCheckboxFilterIcon
                                          isChecked={selected(key, facetValue)}
                                          iconSize={iconSize}
                                        />
                                      </span>
                                    </button>
                                  </li>
                                ),
                              )}
                            </ul>

                            {value.facetValues.length > value.show && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="mx-sm my-md"
                                onClick={() => {
                                  search.fetchMoreFacets(key);
                                }}
                                disabled={search.loadingFacets}
                                label={
                                  search.loadingFacets
                                    ? t("common|loading")
                                    : t("common|load-more")
                                }
                              />
                            )}
                            {facetValues.length == 0 && (
                              <div className="p-md">
                                {t("pages|search$nohits")}
                              </div>
                            )}
                          </div>
                        </SearchFilter>
                      </li>
                    );
                  } else if (key === hvd) {
                    return (
                      <SearchCheckboxFilter
                        key={key}
                        id="hvd_only"
                        name="hvd"
                        checked={activeCheckboxFilters.some(
                          (filter) => filter.id === "hvd_only",
                        )}
                        onChange={() => doSearch(key, facetValues[0])}
                        label={t(`resources|${key}`)}
                        iconSize={iconSize}
                      />
                    );
                  } else if (key === national) {
                    return (
                      <SearchCheckboxFilter
                        key={key}
                        id="national_only"
                        name="National"
                        checked={activeCheckboxFilters.some(
                          (filter) => filter.id === "national_only",
                        )}
                        onChange={() => doSearch(key, facetValues[0])}
                        label={t(`resources|${key}`)}
                        iconSize={iconSize}
                      />
                    );
                  }
                })}

              {searchMode == "datasets" && groupName == "distribution" && (
                <SearchCheckboxFilter
                  key="api_only"
                  id="api_only"
                  name="API"
                  checked={activeCheckboxFilters.some(
                    (filter) => filter.id === "api_only",
                  )}
                  onChange={() => {
                    clearCurrentScrollPos();
                    if (
                      activeCheckboxFilters.some(
                        (filter) => filter.id === "api_only",
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
                  label={t(`resources|api`)}
                  iconSize={iconSize}
                />
              )}
            </ul>
          </div>
        ))}
      </div>

      <SearchActiveFilters
        search={search}
        query={query}
        searchMode={searchMode}
        activeCheckboxFilters={activeCheckboxFilters}
      />
    </div>
  );
};

export default SearchFilters;
