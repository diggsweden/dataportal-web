import React, { useEffect, useState } from 'react';
import { SearchFilter } from '../../components/SearchFilter';
import { SearchContextData } from '../../components/Search';
import {
  Box,
  Button,
  CloseIcon,
  colorPalette,
  SearchIcon,
} from '@digg/design-system';
import { SearchFacetValue } from '../../components/Search/Search';
import i18n from '../../i18n';
import { ESRdfType, ESType } from 'components/Search/EntryScape';

interface SearchFilterProps {
  showFilter: boolean;
  search: SearchContextData;
  searchType: SearchType;
  query: string;
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
export type SearchType = "data" | "begrepp" | "specifikationer";

const FilterSearch: React.FC<FilterSearchProps> = ({
  filterKey,
  filter,
  setFilter,
  fetchMore,
}) => {
  return (
    <div className="filter-search">
      <input
        placeholder={i18n.t('pages|search|filtersearch')}
        className="filter-search__input"
        value={filter[filterKey] || ''}
        onChange={(e) => (
          fetchMore(), setFilter({ ...filter, [filterKey]: e.target.value })
        )}
      />
      <i className="filter-search__icon">
        {' '}
        <SearchIcon color={colorPalette.blackhover} width={[25]} />
      </i>
    </div>
  );
};

const MarkAll: React.FC<MarkAllProps> = ({
  search,
  toggleKey,
  title,
}) => {
  return (
    <div className="filter-checkall">
      <Button
        className={`filter-btn ${search.facetSelected(toggleKey, "*") &&
          'selected'
          }`}
        onClick={async () => {
          await search.set({
            facetValues: search.request.facetValues
              ? search.request.facetValues.filter((f) => f.facet != toggleKey || f.facetType == ESType.wildcard)
              : []
          })

          let wildcardFacet: SearchFacetValue = {
            count: -1,
            facet: toggleKey,
            facetType: ESType.wildcard,
            related: false,
            facetValueString: "",
            resource: "*",
            title: title
          }
          wildcardFacet.facetValueString = `${toggleKey}||${wildcardFacet.resource}||${wildcardFacet.related}||${wildcardFacet.facetType}||${toggleKey}||${wildcardFacet.title}`;
          await search.toggleFacet(wildcardFacet)
          await search.doSearch(false, true, false);

          if (search.facetSelected(toggleKey, "*")) {
            search.sortAllFacets(toggleKey);
          } else {
            search.sortAllFacets();
          }
        }}
      >
        {title}{' '}
        {search.facetSelected(toggleKey, "*")}
        <span className="check"></span>
      </Button>
    </div>
  );
};

/**
 * Controls for filtering searchhits
 *
 * @param {boolean} showFilter disable or enable filters
 * @param {SearchContextData} search context for handling searchstate
 * @param {SearchType} searchType
 * @param {string} query
 * @returns JSX-elements of selects and checkboxes
 */
export const SearchFilters: React.FC<SearchFilterProps> = ({
  showFilter,
  search,
  searchType,
  query,
}) => {
  const [inputFilter, setInputFilter] = useState<InputFilter>({});

  return (
    <>
      <div className={`search-filter-box ${showFilter && 'show-filter'}`}>
        {search.allFacets &&
          Object.entries(search.allFacets).map(([key, value]) => {
            const isLicense = false // Removed for now. key.includes('license');
            const shouldFetchMore = value.show <= value.count;
            const show = (value && value.show) || 20;
            const facetValues = inputFilter[key]
              ? value?.facetValues.filter((v) =>
                v.title
                  ?.toLowerCase()
                  .includes(inputFilter[key].toLowerCase())
              )
              : value?.facetValues.slice(0, show);
            return (
              <Box key={'box' + value.title} className="search-filter">
                <SearchFilter title={value.title}>
                  <div className="search-filter-list">
                    {searchType == "data" && ( //only render on searchpage
                      <>
                        {isLicense ? (
                          <MarkAll
                            search={search}
                            toggleKey={key}
                            title={i18n.t(`filters|allchecktext|${key}`)}
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
                      (facetValue: SearchFacetValue, index: number) => (
                        <Button
                          key={index}
                          className={`filter-btn ${search.facetSelected(key, facetValue.resource) &&
                            'selected'
                            }`}
                          onClick={() => {
                            search.toggleFacet(facetValue).then(async () => {
                              if (search.facetSelected(key, "*")) {
                                let wildcardFacet: SearchFacetValue = {
                                  count: -1,
                                  facet: key,
                                  facetType: ESType.wildcard,
                                  related: false,
                                  facetValueString: "",
                                  resource: "*",
                                  title: i18n.t(`filters|allchecktext|${key}`)
                                }
                                await search.toggleFacet(wildcardFacet);
                              }

                              search.doSearch(false, true, false).then(() => {
                                if (
                                  search.facetSelected(key, facetValue.resource)
                                ) {
                                  search.sortAllFacets(key);
                                } else {
                                  search.sortAllFacets();
                                }
                              });
                            });
                          }}
                        >
                          {facetValue.title || facetValue.resource} (
                          {facetValue.count}){' '}
                          {search.facetSelected(key, facetValue.resource)}
                          <span className={search.facetSelected(key, "*") ? "check-disabled check" : "check"}></span>
                        </Button>
                      )
                    )}

                    {value.facetValues.length > value.show && (
                      <Button

                        className="filter-btn"
                        onClick={() => {
                          search.fetchMoreFacets(key);
                        }}
                      >
                        {search.loadingFacets
                          ? `${i18n.t('common|loading')}...`
                          : `${i18n.t('common|load-more')}...`}
                      </Button>
                    )}

                    {facetValues.length == 0 && (
                      <div className="no-filter-hits show">{i18n.t('pages|search|nohits')}</div>
                    )}

                  </div>
                </SearchFilter>
              </Box>
            );
          })}

        {searchType == "data" && (
          <div className="checkbox__wrapper">
            <input
              id="api_only"
              name="API"
              type="checkbox"
              checked={
                search.request.esRdfTypes?.some(
                  (t) => t == ESRdfType.esterms_ServedByDataService
                ) &&
                search.request.esRdfTypes?.some(
                  (t) => t == ESRdfType.esterms_IndependentDataService
                ) &&
                !search.request.esRdfTypes?.some((t) => t == ESRdfType.dataset)
              }
              onChange={(event) => {
                if (
                  search.request.esRdfTypes?.some(
                    (t) => t == ESRdfType.esterms_ServedByDataService
                  ) &&
                  search.request.esRdfTypes?.some(
                    (t) => t == ESRdfType.esterms_IndependentDataService
                  ) &&
                  !search.request.esRdfTypes?.some(
                    (t) => t == ESRdfType.dataset
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
            ></input>
            <label className="text-6" htmlFor="api_only">
              API
            </label>
          </div>
        )}
      </div>
      <div className="selected-filters">
        {search.request &&
          search.request.facetValues &&
          (search.request.facetValues as SearchFacetValue[]).map(
            (facetValue: SearchFacetValue, index: number) => (
              <button
                key={index}
                className="selectedfilter"
                onClick={() => {
                  search.toggleFacet(facetValue).then(() => {
                    search.doSearch();
                  });
                }}
              >
                {facetValue.title || facetValue.resource}{' '}
                <CloseIcon width={[15]} />
              </button>
            )
          )}
      </div>
      <div
        className={`clear-filters ${search.request?.facetValues &&
          search.request.facetValues.length >= 2 &&
          'show'
          }`}
      >
        <button
          onClick={() => {
            search.set({ facetValues: [] }).then(() => search.doSearch());
          }}
        >
          {i18n.t('common|clear-filters')} (
          {search.request?.facetValues?.length})
        </button>
      </div>
    </>
  );
};

export default SearchFilters;
