import { createFocusTrap, FocusTrap } from "focus-trap";
import useTranslation from "next-translate/useTranslation";
import {
  FC,
  useContext,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
} from "react";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import CrossIcon from "@/assets/icons/cross.svg";
import FilterIcon from "@/assets/icons/filter.svg";
import SearchIcon from "@/assets/icons/search.svg";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form/text-input";
import { SearchFilter } from "@/features/search/search-filters/search-filter";
import { SearchContextData } from "@/providers/search-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { ESRdfType } from "@/types/entrystore-core";
import { SearchFacet, SearchFacetValue } from "@/types/search";
import { clearCurrentScrollPos } from "@/utilities/scroll-helper";

import { SearchActiveFilters } from "./search-active-filters";
import {
  SearchCheckboxFilter,
  SearchCheckboxFilterIcon,
} from "./search-checkbox-filter";

interface SearchFilterProps {
  showFilter: boolean;
  search: SearchContextData;
  searchMode: SearchMode;
  query: string;
  setShowFilter: Dispatch<SetStateAction<boolean>>;
  showTip?: boolean;
}

interface FilterSearchProps {
  filterKey: string;
  filter: InputFilter;
  setFilter: Dispatch<SetStateAction<InputFilter>>;
  title: string;
  fetchMore: () => void;
}

type InputFilter = { [key: string]: string };
export type SearchMode =
  | "content"
  | "datasets"
  | "concepts"
  | "specifications"
  | "organisations"
  | "datasets-series";

const FilterSearch: FC<FilterSearchProps> = ({
  filterKey,
  title,
  filter,
  setFilter,
  fetchMore,
}) => {
  const { t } = useTranslation("pages");

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
        className="absolute right-sm text-brown-500"
        aria-hidden="true"
      />
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
 * @param showFilter disable or enable filters
 * @param search context for handling searchstate
 * @param searchMode
 * @param query
 * @param setShowFilter
 * @returns JSX-elements of selects and checkboxes
 */
export const SearchFilters: FC<SearchFilterProps> = ({
  showFilter,
  search,
  searchMode,
  query,
  setShowFilter,
}) => {
  const { t } = useTranslation();
  const { iconSize } = useContext(SettingsContext);
  const [inputFilter, setInputFilter] = useState<InputFilter>({});
  const ref = useRef<HTMLDivElement>(null);
  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    if (showFilter && ref.current && window.innerWidth < 600) {
      trapRef.current = createFocusTrap(ref.current, {
        escapeDeactivates: false,
        allowOutsideClick: true,
      });
      trapRef.current.activate();
    }

    if (showFilter && window.innerWidth < 600) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      if (trapRef.current) {
        trapRef.current.deactivate();
      }
      document.body.style.overflow = "auto";
    };
  }, [showFilter]);

  const selected = (key: string, facetValue: SearchFacetValue) => {
    return search.facetSelected(key, facetValue.resource);
  };

  const doSearch = async (key: string, facetValue: SearchFacetValue) => {
    clearCurrentScrollPos();

    await search.toggleFacet(facetValue);

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

  const MobileButton = ({ className }: { className?: string }) => {
    return (
      <Button
        variant="secondary"
        size="sm"
        iconSize={iconSize * 1.5}
        icon={showFilter ? CrossIcon : FilterIcon}
        iconPosition="left"
        label={showFilter ? t("common|close-filter") : t("common|show-filter")}
        onClick={() => updateFilters()}
        className={`md:hidden ${className ? className : ""}`}
      />
    );
  };

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
  }, [searchMode, search.allFacets]);

  return (
    <div id="SearchFilters" role="region" aria-label={t("common|filter")}>
      <div
        className={`fixed inset-none z-40 overflow-hidden bg-brownOpaque5 md:hidden 
        ${showFilter ? "visible" : "hidden"}`}
        onClick={() => setShowFilter(false)}
      />

      <Button
        variant="plain"
        size="sm"
        icon={showFilter ? ChevronUpIcon : ChevronDownIcon}
        iconSize={iconSize * 1.5}
        iconPosition="left"
        aria-label={
          showFilter ? t("common|hide-filter") : t("common|show-filter")
        }
        aria-expanded={showFilter}
        aria-controls="filter-content"
        onClick={() => updateFilters()}
        label={showFilter ? t("common|hide-filter") : t("common|show-filter")}
        className="hidden items-center py-xs md:flex"
        disabled={
          search.loadingFacets && Object.keys(groupedFacets).length === 0
        }
      />

      <MobileButton className="my-xl" />

      <div
        ref={ref}
        id="filter-content"
        className={`fixed inset-md z-50 w-auto border-t border-brown-400 bg-pink-50 md:static md:mt-xl md:bg-transparent md:pt-[1.875rem] ${
          showFilter ? "block" : "hidden"
        }`}
      >
        <div className="flex h-full flex-col space-y-lg overflow-y-auto overscroll-contain p-lg md:gap-none md:space-y-sm md:p-none">
          <MobileButton className="mb-lg" />

          {Object.entries(groupedFacets).map(([groupName, groupFacets]) => (
            <div
              id="group-container"
              key={groupName}
              className="mb-md items-center border-b border-dashed border-brown-500 pb-lg md:!mb-sm md:flex md:border-none md:pb-none"
            >
              {groupName !== "default" && (
                <h4 className="mb-sm mr-md shrink-0 text-sm text-textSecondary md:mb-none md:w-[120px]">
                  {t(`filters|group$${groupName}`)}:
                </h4>
              )}
              <ul
                className="flex w-full flex-row flex-wrap gap-md"
                role="list"
                aria-label={t("common|available-filters")}
              >
                {Object.entries(groupFacets)
                  .sort((a, b) => (a[1].indexOrder > b[1].indexOrder ? 1 : -1))
                  .map(([key, value], idx: number) => {
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

                    if (!value.customFilter && !value.customSearch) {
                      return (
                        <li
                          key={`${value.title}-${idx}`}
                          role="listitem"
                          className="w-full md:w-auto"
                        >
                          <SearchFilter
                            title={value.title}
                            usedFilters={FindFilters(
                              value.facetValues,
                              search.request.facetValues,
                            )}
                          >
                            <div className="absolute z-10 mr-lg mt-sm max-h-[200px] w-full overflow-y-auto overscroll-contain border border-brown-200 bg-white shadow-md md:max-h-[600px] md:max-w-[20.625rem]">
                              <FilterSearch
                                filterKey={key}
                                filter={inputFilter}
                                setFilter={setInputFilter}
                                title={value.title}
                                fetchMore={() =>
                                  shouldFetchMore && search.fetchMoreFacets(key)
                                }
                              />

                              {/* List of filter options within this category */}
                              <ul role="listbox" aria-multiselectable="true">
                                {facetValues
                                  // .filter((v) => v.count > 0)
                                  .map(
                                    (
                                      facetValue: SearchFacetValue,
                                      index: number,
                                    ) => (
                                      <li
                                        key={index}
                                        role="option"
                                        aria-selected={selected(
                                          key,
                                          facetValue,
                                        )}
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
                                          aria-checked={selected(
                                            key,
                                            facetValue,
                                          )}
                                        >
                                          {facetValue.title ||
                                            facetValue.resource}{" "}
                                          ({facetValue.count})
                                          {/* Decorative checkbox icon */}
                                          <span
                                            className="absolute right-md mt-[0.375rem]"
                                            aria-hidden="true"
                                          >
                                            <SearchCheckboxFilterIcon
                                              isChecked={selected(
                                                key,
                                                facetValue,
                                              )}
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
                    } else {
                      return (
                        <SearchCheckboxFilter
                          key={key}
                          id={value.predicate}
                          name={value.title}
                          checked={
                            value.customFilter
                              ? search.facetSelected(
                                  key,
                                  value?.customLabel ||
                                    value?.customFilter ||
                                    "",
                                )
                              : value.customSearch?.length ===
                                  search.request.esRdfTypes?.length &&
                                value.customSearch?.every(
                                  (type) =>
                                    search.request.esRdfTypes?.includes(type),
                                )
                          }
                          onChange={() => {
                            if (value.customSearch) {
                              clearCurrentScrollPos();
                              if (
                                value.customSearch !== search.request.esRdfTypes
                              ) {
                                search
                                  .set({
                                    esRdfTypes: value.customSearch,
                                    query,
                                  })
                                  .then(() => search.doSearch());
                              } else {
                                search
                                  .set({
                                    esRdfTypes: [
                                      ESRdfType.dataset,
                                      ESRdfType.data_service,
                                      ESRdfType.dataset_series,
                                    ],
                                    query,
                                  })
                                  .then(() => search.doSearch());
                              }
                            } else {
                              doSearch(key, facetValues[0]);
                            }
                          }}
                          label={t(`resources|${key}`)}
                          iconSize={iconSize}
                        />
                      );
                    }
                  })}
              </ul>
            </div>
          ))}
          {/* Mobile active filters */}
          <div className="md:hidden">
            <SearchActiveFilters
              search={search}
              query={query}
              searchMode={searchMode}
            />
          </div>
          <MobileButton className="!mt-xl" />
        </div>
      </div>

      <SearchActiveFilters
        search={search}
        query={query}
        searchMode={searchMode}
      />
    </div>
  );
};

export default SearchFilters;
