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
import CheckboxIcon from "@/assets/icons/checkbox.svg";
import CheckboxCheckedIcon from "@/assets/icons/checkboxChecked.svg";

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
        className="focus--in border-none"
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
  const [inputFilter, setInputFilter] = useState<InputFilter>({});
  const hvd = "http://data.europa.eu/r5r/applicableLegislation";
  const containHVD = !search.request.facetValues?.find(
    (d) => d.facet === hvd && search.request.facetValues?.length === 1,
  );

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != "undefined" && typeof location != "undefined") {
      localStorage.setItem(`ScrollposY_${location.search}`, "0");
    }
  };

  const selected = (key: string, facetValue: SearchFacetValue) => {
    return search.facetSelected(key, facetValue.resource);
  };

  const doSearch = (key: string, facetValue: SearchFacetValue) => {
    clearCurrentScrollPos();
    search.toggleFacet(facetValue).then(async () => {
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

      search.doSearch(false, true, false).then(() => {
        if (selected(key, facetValue)) {
          search.sortAllFacets(key);
        } else {
          search.sortAllFacets();
        }
      });
    });
  };

  return (
    <div id="SearchFilters">
      <Button
        variant="plain"
        size="sm"
        icon={FilterIcon}
        iconPosition="left"
        aria-label={
          showFilter ? t("common|hide-filter") : t("common|show-filter")
        }
        onClick={() => setShowFilter(!showFilter)}
        label={showFilter ? t("common|hide-filter") : t("common|show-filter")}
      />

      <div className={showFilter ? "block" : "hidden"}>
        <ul className="mb-lg mt-md flex flex-col flex-wrap gap-md md:flex-row">
          {search.allFacets &&
            Object.entries(search.allFacets)
              .sort((a, b) => (a[1].indexOrder > b[1].indexOrder ? 1 : -1))
              .map(([key, value], idx: number) => {
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

                if (key !== hvd) {
                  return (
                    <li key={"box" + value.title + idx}>
                      <SearchFilter
                        title={
                          value.title +
                          FindFilters(
                            value.facetValues,
                            search.request.facetValues,
                          )
                        }
                      >
                        <div className="absolute z-10 mr-lg mt-sm max-h-[600px] w-full overflow-y-auto bg-white shadow-md md:max-w-[330px]">
                          {searchMode == "datasets" ||
                            (searchMode == "specifications" && (
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
                                    fetchMore={() =>
                                      shouldFetchMore &&
                                      search.fetchMoreFacets(key)
                                    }
                                  />
                                )}
                              </>
                            ))}

                          {facetValues.map(
                            (facetValue: SearchFacetValue, index: number) => {
                              if (facetValue.count > 0)
                                return (
                                  <button
                                    aria-pressed={selected(key, facetValue)}
                                    key={index}
                                    className={`group relative flex w-full items-center break-all py-md pl-md pr-xl text-left hover:bg-brown-100 ${
                                      selected(key, facetValue) && "font-strong"
                                    }`}
                                    onClick={() => {
                                      doSearch(key, facetValue);
                                    }}
                                  >
                                    {facetValue.title || facetValue.resource} (
                                    {facetValue.count}){" "}
                                    {selected(key, facetValue)}
                                    <span className="absolute right-md">
                                      {selected(key, facetValue) ? (
                                        <CheckboxCheckedIcon />
                                      ) : (
                                        <CheckboxIcon />
                                      )}
                                    </span>
                                  </button>
                                );
                            },
                          )}

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
                } else {
                  return (
                    <div key={value.title} className="relative max-w-fit">
                      <input
                        id="hvd_only"
                        name="API"
                        type="checkbox"
                        className="peer/hvd-only sr-only"
                        checked={search.request.facetValues?.some(
                          (t) => t.title == ESRdfType.hvd,
                        )}
                        onChange={() => doSearch(key, facetValues[0])}
                      />
                      <label
                        className="button button--small button--secondary z-2 focus--outline focus--primary relative cursor-pointer pr-xl 
                        peer-checked:after:translate-x-full peer-focus-visible/hvd-only:bg-whiteOpaque5 peer-focus-visible/hvd-only:outline-dashed peer-focus-visible/hvd-only:outline-[3px] 
                        peer-focus-visible/hvd-only:outline-offset-2 peer-focus-visible/hvd-only:outline-primary md:pr-xl"
                        htmlFor="hvd_only"
                      >
                        {t(`resources|${key}`)}
                      </label>
                      <CheckboxIcon className="pointer-events-none absolute right-md top-1/4 peer-checked/hvd-only:hidden" />
                      <CheckboxCheckedIcon className="pointer-events-none absolute right-md top-1/4 hidden peer-checked/hvd-only:block" />
                    </div>
                  );
                }
              })}
          {searchMode == "datasets" && (
            <div className="relative max-w-fit">
              <input
                id="api_only"
                name="API"
                type="checkbox"
                className="peer/api-only sr-only"
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
              <label
                className="button button--small button--secondary z-2 focus--outline focus--primary relative cursor-pointer pr-xl 
                peer-checked:after:translate-x-full peer-focus-visible/api-only:bg-whiteOpaque5 peer-focus-visible/api-only:outline-dashed 
                peer-focus-visible/api-only:outline-[3px] peer-focus-visible/api-only:outline-offset-2 peer-focus-visible/api-only:outline-primary md:pr-xl"
                htmlFor="api_only"
              >
                API
              </label>
              <CheckboxIcon className="pointer-events-none absolute right-md top-1/4 peer-checked/api-only:hidden" />
              <CheckboxCheckedIcon className="pointer-events-none absolute right-md top-1/4 hidden peer-checked/api-only:block" />
            </div>
          )}
        </ul>
      </div>
      {search.request.facetValues && search.request.facetValues.length > 0 && (
        <div className="mt-lg flex flex-col justify-between gap-md md:flex-row md:items-baseline">
          <div className="flex flex-col flex-wrap gap-sm md:flex-row md:gap-md">
            {containHVD && (
              <span className="text-textSecondary">
                {t("common|active-filters")}
              </span>
            )}
            {search.request &&
              search.request.facetValues &&
              (search.request.facetValues as SearchFacetValue[]).map(
                (facetValue: SearchFacetValue, index: number) =>
                  facetValue.facet !== hvd && (
                    <Button
                      variant="filter"
                      size="xs"
                      key={index}
                      label={facetValue.title || facetValue.resource}
                      icon={CloseIcon}
                      iconPosition="right"
                      className="w-full justify-between py-md text-left font-strong md:w-auto md:py-[2px]"
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
                ? "block whitespace-nowrap"
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
      )}
    </div>
  );
};

export default SearchFilters;
