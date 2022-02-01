import { Box, ArrowDropIcon } from '@digg/design-system';
import React, { useEffect, useState } from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { SearchContext, SearchProvider } from '../../components/Search';
import { SearchSortOrder } from '../../components/Search/Search';
import { decode } from 'qss';
import { PageMetadata } from '../PageMetadata';
import { SearchFilters } from './SearchFilters';
import { SearchHeader } from '../../components/SearchHead';
import { ESRdfType, ESType } from 'components/Search/EntryScape';
import i18n from 'i18n';
import { PageProps } from '../PageProps';
import { StaticBreadcrumb } from 'components/Breadcrumb';
import { Link } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { FilterIcon } from '../../assets/Icon_FilterIcon';
import { CloseIcon2 } from '../../assets/Icon_Close';

interface SearchProps extends PageProps {
  activeLink?: string;
}

export const SearchPage: React.FC<SearchProps> = ({ location, env }) => {
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != 'undefined' && typeof location != 'undefined') {
      localStorage.setItem(`ScrollposY_${location.search}`, '0');
    }
  };

  useEffect(() => {
    //needed for handling back/forward buttons and changing state for input correctly
    if (typeof window !== 'undefined') {
      //handles back/forward button
      window.addEventListener('popstate', () => {
        var qs = decode(window.location.search.substring(1)) as any;
        const querytext =
          qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

        if (querytext) setQuery(querytext);
      });

      //*** makes sure querytext is set from location to input, on page reloads
      var qs = decode(window.location.search.substring(1)) as any;
      let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

      if (querytext)
        setQuery(decodeURIComponent(querytext.replace(/\+/g, '%20')));
      //***
    }
  }, []);

  return (                
          <SearchProvider
            entryscapeUrl={
              env.ENTRYSCAPE_DATASETS_PATH
                ? `https://${env.ENTRYSCAPE_DATASETS_PATH}/store`
                : 'https://admin.dataportal.se/store'
            }
            hitSpecifications={{
              'http://www.w3.org/ns/dcat#Dataset': {
                path: `/${i18n.languages[0]}/datasets/`,
                titleResource: 'dcterms:title',
                descriptionResource: 'dcterms:description',
              },
              'http://www.w3.org/ns/dcat#DataService': {
                path: `/${i18n.languages[0]}/dataservice/`,
                titleResource: 'dcterms:title',
                descriptionResource: 'dcterms:description',
              },
            }}
            facetSpecification={{
              facets: [
                { 
                  resource: 'http://www.w3.org/ns/dcat#theme', 
                  type: ESType.uri,
                  dcatProperty: "dcat:theme",
                  dcatType: "choice",
                  dcatFilterEnabled: true,
                  indexOrder: 0
                },
                {
                  resource: 'http://purl.org/dc/terms/publisher',
                  type: ESType.uri,
                  indexOrder: 1
                },
                {
                  resource: 'http://purl.org/dc/terms/format',
                  type: ESType.literal,
                  dcatProperty: "dcterms:format",
                  dcatType: "choice",
                  dcatFilterEnabled: true,
                  indexOrder: 3
                },
                {
                  resource: 'http://purl.org/dc/terms/accrualPeriodicity',
                  type: ESType.uri,
                  dcatProperty: "dcterms:accrualPeriodicity",
                  dcatType: "choice",
                  dcatFilterEnabled: true,
                  indexOrder: 4
                },
                {
                  resource: 'http://purl.org/dc/terms/type',
                  type: ESType.uri,
                  related: true,
                  indexOrder: 5
                },
                {
                  resource: 'http://purl.org/dc/terms/license',
                  type: ESType.uri,
                  dcatProperty: "dcterms:license",
                  dcatType: "choice",
                  dcatFilterEnabled: false,
                  indexOrder: 6                  
                },
              ],
            }}
            initRequest={{
              esRdfTypes: [
                ESRdfType.dataset,
                ESRdfType.esterms_IndependentDataService,
                ESRdfType.esterms_ServedByDataService,
              ],
              takeFacets: 30,
              language: i18n.languages[0],
              sortOrder: SearchSortOrder.score_desc,
            }}
          >
            <PageMetadata
              seoTitle={`${i18n.t('routes|datasets|title')} - ${i18n.t(
                'common|logo-title'
              )}`}
              seoDescription=""
              seoImageUrl=""
              seoKeywords=""
              robotsFollow={true}
              robotsIndex={true}
              lang={i18n.languages[0]}
              socialMeta={{
                socialDescription: i18n.t('pages|datasets|social_meta_description'),
                socialTitle: i18n.t('pages|datasets|social_meta_title'),
                socialUrl: `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t(
                  'routes|datasets|path'
                )}`,
              }}
            />

            <StaticBreadcrumb
              env={env}
              staticPaths={[
                {
                  path: `/${i18n.languages[0]}/${i18n.t('routes|datasets|path')}`,
                  title: i18n.t('routes|datasets|title'),
                },
              ]}
            />
            <SearchContext.Consumer>
              {(search) => (
                <div className="wpb_wrapper">
                  <div className="main-container">
                    <SearchHeader activeLink={'search'} />

                    <div className="row search-header-wrapper">
                      <h1 className="text-2 search-header">
                        {i18n.t('common|search-dataapi')}
                      </h1>

                      <button
                        aria-expanded={showTip ? true : false}
                        className={
                          'search-tip__btn text-7' +
                          (showTip ? ' search-tip__btn--active' : '')
                        }
                        onClick={() => {
                          clearCurrentScrollPos();
                          setShowTip(!showTip);
                        }}
                      >
                        {i18n.t('pages|search|search-tips')}{' '}
                        <ArrowDropIcon rotation={showTip ? 180 : 0} width={'24px'} />
                      </button>
                    </div>

                    <div
                      className={'search-tip__modal' + (showTip ? ' show-tip' : '')}
                    >
                      <div className="search-tip__modal-wrapper">
                        <span className="text-7-bold">
                          {i18n.t('pages|search|search-tips-search-head')}
                        </span>
                        <span className="text-7">
                          {i18n.t('pages|search|search-tips-search-txt')}
                        </span>
                        <span className="text-7-bold">
                          {i18n.t('pages|search|search-tips-filter-head')}
                        </span>
                        <span className="text-7">
                          {i18n.t('pages|search|search-tips-filter-txt')}
                        </span>
                        <span className="text-7-bold">
                          {i18n.t('pages|search|search-tips-searchfilter-head')}
                        </span>
                        <span className="text-7">
                          {i18n.t('pages|search|search-tips-searchfilter-txt')}
                        </span>
                        <span className="text-7-bold">
                          {' '}
                          {i18n.t('pages|search|search-tips-sort-head')}{' '}
                        </span>
                        <span className="text-7">
                          {i18n.t('pages|search|search-tips-sort-txt1')} "
                          {i18n.t('pages|search|search-tips-sort-txt2')}"
                          {i18n.t('pages|search|search-tips-sort-txt3')} "
                          {i18n.t('pages|search|search-tips-sort-txt4')}"
                          {i18n.t('pages|search|search-tips-sort-txt5')}
                        </span>
                        <span className="text-7-bold">
                          {' '}
                          {i18n.t('pages|search|search-tips-license-head')}{' '}
                        </span>
                        <span className="text-7">
                          {i18n.t('pages|search|search-tips-license-txt')}{' '}
                          <Link
                            to={`/${i18n.languages[0]}/${i18n.t(
                              'routes|about-us|path'
                            )}`}
                            className="text-7"
                          >
                            {i18n.t('pages|search|search-tips-license-link')}
                          </Link>
                          .
                        </span>
                      </div>
                    </div>

                    <SearchInput
                      search={search}
                      searchType={'data'}
                      query={query}
                      setQuery={setQuery}
                    />

                    <div className="mobile-filters">
                      <button
                        aria-label={showFilter
                          ? i18n.t('common|hide-filter')
                          : i18n.t('common|show-filter')}
                        className={showFilter ? 'filter-active' : ''}
                        onClick={() => setShowFilter(!showFilter)}
                      >
                        {i18n.t('common|filter')}
                        {showFilter ?
                          <CloseIcon2 />
                          :
                          <FilterIcon />
                        }
                      </button>
                    </div>

                    <SearchFilters
                      showFilter={showFilter}
                      searchType="data"
                      search={search}
                      query={query}
                    />
                    <noscript>{i18n.t('common|no-js-text')}</noscript>
                    <SearchResults
                    showSorting={showFilter}
                    search={search} searchType="data" />
                  </div>
                </div>
              )}
            </SearchContext.Consumer>
          </SearchProvider>         
  );
};
