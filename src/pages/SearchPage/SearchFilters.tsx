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
import { values } from 'lodash';

interface SearchFilterProps {
  showFilter: boolean;
  search: SearchContextData;
  inputQueryRef?: React.RefObject<HTMLInputElement>;
  setQuery?: any;
}

interface MarkAllProps {
  search: SearchContextData;
  toggleKey: string;
  title:string;
  values: SearchFacetValue[];
  rest: SearchFacetValue[];
  checkAll: CheckedFilter;
  setCheckAll: React.Dispatch<React.SetStateAction<CheckedFilter>>;
  toggleAll: (
    search: SearchContextData,
    key: string,
    checkAll: CheckedFilter,
    values: SearchFacetValue[],
    title:string
  ) => Promise<void>;
}

interface FilterSearchProps {
  filterKey: string;
  filter: InputFilter;
  setFilter: React.Dispatch<React.SetStateAction<InputFilter>>;
  fetchMore: () => void;
}

type CheckedFilter = { [key: string]: boolean };
type InputFilter = { [key: string]: string };

const toggleAllFilter = async (
  search: SearchContextData,
  key: string,
  checkAll: CheckedFilter,
  values: SearchFacetValue[],
  title: string,
) => {

  let wildcardFacet:SearchFacetValue = {
    count:-1,
    facet: key,
    facetType: ESType.wildcard,    
    related: false,
    facetValueString: "",
    resource: "*",
    title: title
  }
  wildcardFacet.facetValueString = `${key}||${wildcardFacet.resource}||${wildcardFacet.related}||${wildcardFacet.facetType}||${key}||${wildcardFacet.title}`;

  if (!checkAll[key]) {
    search
      .set({        
        facetValues: search.request.facetValues
          ? search.request.facetValues.filter((f) => f.facet != key)
          : [],
      })
      .then(() => {
        search.doSearch();
      });
  } else {
    await search.toggleFacet(wildcardFacet);    
    // await search    
    //   .set({
    //     facetValues: search.request.facetValues
    //       ? [...search.request.facetValues.filter((f) => f.facet != key), wildcardFacet]
    //       : [wildcardFacet],       
    // });
    await search.doSearch(false, true, false).then(() => {
      search.sortAllFacets();
    });
    await search.fetchMoreFacets(key);
  }
};

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
  values,
  title,
  rest,
  checkAll,
  toggleAll,
  setCheckAll,  
}) => {  
  return (
    <div className="filter-checkall">      
      <Button        
        className={`filter-btn ${
          search.facetSelected(toggleKey, "*") &&
          'selected'
        }`}
        onClick={async () => {          
          await search.set({            
            facetValues:search.request.facetValues
              ? search.request.facetValues.filter((f) => f.facet != toggleKey || f.facetType == ESType.wildcard)
              : []
          })

          let wildcardFacet:SearchFacetValue = {
            count:-1,
            facet: toggleKey,
            facetType: ESType.wildcard,    
            related: false,
            facetValueString: "",
            resource: "*",
            title: title
          }
          wildcardFacet.facetValueString = `${toggleKey}||${wildcardFacet.resource}||${wildcardFacet.related}||${wildcardFacet.facetType}||${toggleKey}||${wildcardFacet.title}`;
          await search.toggleFacet(wildcardFacet)
          await  search.doSearch(false, true, false);

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
 * @param {React.RefObject<HTMLInputElement>} inputQueryRef ref to input field
 * @param {function} setQuery sets search query
 * @returns JSX-elements of selects and checkboxes
 */
export const SearchFilters: React.FC<SearchFilterProps> = ({
  showFilter,
  search,
  inputQueryRef,
  setQuery,
}) => {
  const [checkAll, setCheckAll] = useState<CheckedFilter>({});
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
            const rest = value?.facetValues.slice(show);
            return (
              <Box key={'box' + value.title} className="search-filter">
                <SearchFilter title={value.title}>
                  <div className="search-filter-list">
                    {inputQueryRef && ( //only render on searchpage
                      <>
                        {isLicense ? (
                          <MarkAll
                            search={search}
                            toggleKey={key}
                            values={facetValues}
                            rest={rest}
                            checkAll={checkAll}
                            toggleAll={toggleAllFilter}
                            setCheckAll={setCheckAll}        
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
                          className={`filter-btn ${
                            search.facetSelected(key, facetValue.resource) &&
                            'selected'
                          }`}
                          onClick={() => {
                            search.toggleFacet(facetValue).then(async () => {
                              if(search.facetSelected(key, "*"))
                              {                                
                                let wildcardFacet:SearchFacetValue = {
                                  count:-1,
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
                          <span className={search.facetSelected(key, "*")? "check-disabled check" : "check"}></span>
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

        {inputQueryRef && setQuery && (
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
                  setQuery();
                  search
                    .set({
                      esRdfTypes: [
                        ESRdfType.dataset,
                        ESRdfType.esterms_IndependentDataService,
                        ESRdfType.esterms_ServedByDataService,
                      ],
                      query: inputQueryRef.current!.value || '',
                    })
                    .then(() => search.doSearch());
                } else {
                  setQuery();
                  search
                    .set({
                      esRdfTypes: [
                        ESRdfType.esterms_IndependentDataService,
                        ESRdfType.esterms_ServedByDataService,
                      ],
                      query: inputQueryRef.current!.value || '',
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
        className={`clear-filters ${
          search.request?.facetValues &&
          search.request.facetValues.length >= 2 &&
          'show'
        }`}
      >
        <button
          onClick={() => {
            setCheckAll({});
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
