import {
  Box,
  SearchIcon,
  Button,
  CloseIcon,
  colorPalette,
} from '@digg/design-system';
import React from 'react';
import 'url-search-params-polyfill';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { NoJavaScriptWarning } from '../../components/NoJavaScriptWarning';
import { QueryParamProvider } from '../../components/QueryParamProvider';
import { __RouterContext } from 'react-router';
import {
  SearchContext,
  SearchContextData,
  SearchProvider,
} from '../../components/Search';
import {
  SearchFacetValue,
  SearchRequest,
  FacetSpecification,
  FacetSpecificationItem,
  SearchSortOrder,
} from '../../components/Search/Search';
import { decode } from 'qss';
import { PageMetadata } from '../PageMetadata';
import { RouteComponentProps } from 'react-router-dom';
import { RouterContext } from '../../../shared/RouterContext';
import { SearchFilter } from '../../components/SearchFilter';

import { Loader } from '../../components/Loader';
import { SearchHeader } from '../../components/SearchHead';
import { ESRdfType, ESType } from 'components/Search/EntryScape';
import i18n from 'i18n';
import { id } from 'common-tags';
import { text } from 'express';
import { FileFormatBadge } from '../../components/FileFormatBadge';
import { EnvSettings } from '../../../config/env/EnvSettings';
import ChopLines from 'chop-lines';
import { PageProps } from '../PageProps';
import { StaticBreadcrumb } from 'components/Breadcrumb';
import {DebounceInput} from 'react-debounce-input';

const MainContent = Box.withComponent('main');

interface SearchProps extends PageProps {
  activeLink?: string;
}

interface SearchPageState {
  query: string,
  activeLink: string,
  showFilter: boolean,
  facetFilter: {[facet: string]:string},
  showTip?: boolean,
  headerHeight?: number,  
}

export class SearchPage extends React.Component<SearchProps, SearchPageState> {
  private headerRef: React.RefObject<Header>;
  private inputQueryRef: React.RefObject<HTMLInputElement>;
  private selectQueryRef: React.RefObject<HTMLInputElement>;
  private activeFacetFilterRef: {[key: string] : React.RefObject<DebounceInput>};
  private postscribe: any;

  constructor(props: SearchProps) {
    super(props);
    this.headerRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
    this.inputQueryRef = React.createRef();
    this.activeFacetFilterRef = {}

    this.selectQueryRef = React.createRef();

    this.state = {
      query: '',
      activeLink: 'search',
      showFilter: false,
      facetFilter: {}
    };    
  }

  setFocus() {
    if (this.headerRef.current) {
      this.headerRef.current.setFocusOnMenuButton();
    }
  }

  searchFocus() {
    let content = document.querySelector('#search-result');
    if (!content) return;

    const focusable = content.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const first = focusable[0];

    if (first) {
      first.focus();
    }
  }

  setTopMargin(height: number) {
    this.setState({ headerHeight: height });
  }

  componentDidMount() {
    //needed for handling back/forward buttons and changing state for input correctly
    if (typeof window !== 'undefined') {
      //handles back/forward button
      window.addEventListener('popstate', () => {
        var qs = decode(window.location.search.substring(1)) as any;
        let querytext =
          qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

        if (querytext) this.setState({ query: querytext });
      });

      //*** makes sure querytext is set from location to input, on page reloads
      var qs = decode(window.location.search.substring(1)) as any;
      let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

      if (querytext)
        this.setState({
          query: decodeURIComponent(querytext.replace(/\+/g, '%20')),
        });
      //***
    }
  }

  componentDidUpdate() {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  // const handleSearchToggle = () => {
  //   const element = document.getElementById('searchfield');
  //   if (element) {
  //     isSearchVisible ? element.blur() : element.focus();
  //   }
  //   setIsSearchVisible(!isSearchVisible);
  // };

  handleChange = (target: any) => {
    this.setState({ query: target.value });
  };

  toggleShowOrHide = () => {
    this.setState({ showFilter: !this.state.showFilter });
  };

  toggleShowOrHideB = () => {
    this.setState({ showTip: !this.state.showTip });
  };

  render() {
    const { location } = this.props;
    let uri = new URLSearchParams(location.search);

    return (
      <QueryParamProvider params={uri}>
        <SearchProvider
          entryscapeUrl={
            this.props.env.ENTRYSCAPE_DATASETS_PATH
              ? `https://${this.props.env.ENTRYSCAPE_DATASETS_PATH}/store`
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
              { resource: 'http://www.w3.org/ns/dcat#theme', type: ESType.uri },
              {
                resource: 'http://purl.org/dc/terms/publisher',
                type: ESType.uri,
              },
              {
                resource: 'http://purl.org/dc/terms/format',
                type: ESType.literal,
              },
              // {
              //   resource: 'http://purl.org/dc/terms/accessRights',
              //   type: ESType.uri,
              // },
              {
                resource: 'http://purl.org/dc/terms/license',
                type: ESType.uri,
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
          />
          <Box
            id="top"
            display="flex"
            direction="column"
            minHeight="100vh"
            bgColor="#fff"
          >
            <NoJavaScriptWarning text="" />

            <Header ref={this.headerRef} activeLink={this.state.activeLink} />

            <ErrorBoundary>
              <MainContent id="main" flex="1 1 auto">
                <StaticBreadcrumb
                  env={this.props.env}
                  staticPaths={[
                    {
                      path: `/${i18n.languages[0]}/${i18n.t(
                        'routes|datasets|path'
                      )}`,
                      title: i18n.t('routes|datasets|title'),
                    },
                  ]}
                />
                <SearchContext.Consumer>
                  {(search) => (
                    <div className="wpb_wrapper">
                      <div className="main-container">
                        <h1 className="text-2 search-header">
                          {i18n.t('common|search-dataapi')}
                        </h1>
                        {/* <div className="row"> */}
                        <form
                          onSubmit={(event) => {
                            event.preventDefault();
                            this.setState({
                              query: this.inputQueryRef.current!.value,
                            });
                            search
                              .set({
                                page: 0,
                                query: this.inputQueryRef.current!.value || '',
                                fetchFacets: true,
                              })
                              .then(() => search.doSearch());
                          }}
                        >
                          <SearchHeader
                            ref={this.headerRef}
                            activeLink={this.state.activeLink}
                          />

                          <div className="search-box">
                            <label
                              className="screen-reader"
                              htmlFor="search-field"
                            >
                              {i18n.t('pages|datasets|search-datasets')}
                            </label>
                            <input
                              autoFocus
                              id="search-field"
                              autoComplete="off"
                              name="q"
                              ref={this.inputQueryRef}
                              type="text"
                              placeholder={i18n.t(
                                'pages|datasets|search-datasets'
                              )}
                              value={this.state.query}
                              onChange={this.handleChange}
                              key={
                                search.request.query ? 'loaded' : 'not loaded'
                              }
                            ></input>
                            <button
                              type="submit"
                              aria-label={i18n.t('common|search')}
                            >
                              <SearchIcon
                                color={colorPalette.white}
                                width={[25]}
                              />
                            </button>
                            {search.loadingFacets}
                          </div>
                        </form>

                        {/* <div className="col search-tip__wrapper">
                            <button
                              className="search-tip__btn text-6"
                              onClick={this.toggleShowOrHideB}
                            >
                              Söktips
                            </button>

                            <div
                              className={
                                'search-tip__modal' +
                                (this.state.showTip ? ' show-tip' : '')
                              }
                            >
                              <div className="search-tip__modal-wrapper">
                                <button
                                  className="close-modal__btn"
                                  onClick={this.toggleShowOrHideB}
                                >
                                  <CloseIcon color={colorPalette.black100} />
                                </button>
                                <span className="text-7-bold">Filtrering</span>
                                <span className="text-7">
                                  Om flertalet filter används samtidigt läggs
                                  det ett ”och” <strong>(AND)</strong> mellan
                                  dem. Läggs flera alternativ till inom samma
                                  filter används ”eller” <strong>(OR)</strong>{' '}
                                  mellan dem.
                                </span>
                                <span className="text-7-bold">
                                  Sortera din sökningen
                                </span>
                                <span className="text-7">
                                  Sökresultatet kan sorteras efter relevans
                                  vilket matchar sökterm mot rubrik. Sortering
                                  kan även göras efter senast ändrad vilket
                                  utgår ifrån när metadatat uppdaterades.
                                </span>
                                <span className="text-7-bold">
                                  Läs mer om sökfunktionen
                                </span>
                                <span className="text-7">
                                  Du kan läsa mer om sökning på sidan{' '}
                                  <a className="text-7" href="#">
                                    Sökfunktion på Sveriges dataportral
                                  </a>
                                  .
                                </span>
                              </div>
                            </div>
                          </div> */}

                        {/* </div> */}

                        <div className="mobile-filters">
                          <button
                            className={
                              this.state.showFilter ? 'filter-active' : ''
                            }
                            onClick={this.toggleShowOrHide}
                          >
                            {this.state.showFilter
                              ? i18n.t('common|hide-filter')
                              : i18n.t('common|show-filter')}
                          </button>
                        </div>

                        <div
                          className={
                            'search-filter-box' +
                            (this.state.showFilter ? ' show-filter' : '')
                          }
                        >
                          {search.allFacets &&
                            Object.entries(search.allFacets).map(
                              ([key, value]) => {       
                                if(!this.activeFacetFilterRef[key])
                                  this.activeFacetFilterRef[key] = React.createRef();                     
                                return (
                                  <Box
                                    key={'box' + value.title}
                                    className="search-filter"
                                  >
                                    <SearchFilter title={value.title} onChange={() => {                                      
                                      if(this.activeFacetFilterRef)
                                        Object.values(this.activeFacetFilterRef).forEach((r) => {
                                          if(r.current)
                                            r.current.setState({value : ""});
                                        })
                                        search.sortAllFacets();                                                 
                                      this.setState({
                                        facetFilter:{}
                                      });  
                                    }}>
                                      <div className="search-filter-list">
                                      
                                        {/* //Search within filter */}
                                        <div className="search-filter-list__search">
                                        <DebounceInput
                                          minLength={0}                                          
                                          debounceTimeout={350}                                          
                                          placeholder={i18n.t('pages|search|filtersearch')}
                                          className="search-filter-list__input"                   
                                          ref={this.activeFacetFilterRef[key]}                                                                                                                                                                                              
                                          onChange={event => 
                                            {                                                                                                   
                                              //entryscape can only return 100 facets, so when we seem to have more than 100 facets, we need to fetch new data
                                              if(value.count >= 100)
                                              {
                                                search.searchInFacets(event.target.value,key).then(() => {                                                 
                                                  search.showMoreFacets(key);                                                                                            
                                                  var facetFilter = this.state.facetFilter;
                                                                                              
                                                  facetFilter[value.predicate] = event.target.value;

                                                  this.setState({
                                                    facetFilter:facetFilter
                                                  });                                                                                     
                                                });         
                                              }
                                              //dont fetch new data, just set filter state
                                              else
                                              {
                                                search.showMoreFacets(key);

                                                var facetFilter = this.state.facetFilter;
                                                                                                
                                                facetFilter[value.predicate] = event.target.value;

                                                this.setState({
                                                  facetFilter:facetFilter
                                                });  
                                              }                                              
                                            }} 
                                            />                                      
                                          <i className="search-filter-list__icon">
                                            {' '}
                                            <SearchIcon
                                              color={colorPalette.blackhover}
                                              width={[25]}
                                            />
                                          </i>
                                        </div>

                                        {/* //Search within filter */}

                                        {value &&
                                          value.facetValues &&
                                          (value.facetValues as SearchFacetValue[])       
                                            .filter(f => !this.state.facetFilter[value.predicate] || (this.state.facetFilter[value.predicate] && f.title?.toLowerCase().includes(this.state.facetFilter[value.predicate])))                                   
                                            .slice(0, value.show || 20)
                                            .map(
                                              (
                                                facetValue: SearchFacetValue,
                                                index: number
                                              ) => (
                                                <Button
                                                  key={index}
                                                  className={
                                                    search.facetSelected(
                                                      key,
                                                      facetValue.resource
                                                    )
                                                      ? 'selected'
                                                      : ''
                                                  }
                                                  onClick={() => {
                                                    search
                                                      .toggleFacet(facetValue)
                                                      .then(() => {
                                                        search
                                                          .doSearch(
                                                            false,
                                                            true,
                                                            false
                                                          )
                                                          .then(() => {
                                                            if (
                                                              search.facetSelected(
                                                                key,
                                                                facetValue.resource
                                                              )
                                                            ) {
                                                              search.sortAllFacets(
                                                                key
                                                              );
                                                            } else {
                                                              search.sortAllFacets();
                                                            }
                                                          });
                                                      });
                                                  }}
                                                >
                                                  {facetValue.title ||
                                                    facetValue.resource}{' '}
                                                  {facetValue.count > 0? `(${facetValue.count})` : ' '}
                                                  {search.facetSelected(
                                                    key,
                                                    facetValue.resource
                                                  )}
                                                  <span className="check"></span>
                                                </Button>
                                              )
                                            )}
                                        {value.facetValues.length >
                                          value.show && (
                                          <Button
                                            onClick={() => {
                                              search.fetchMoreFacets(key);
                                            }}
                                          >
                                            {search.loadingFacets
                                              ? `${i18n.t('common|loading')}...`
                                              : `${i18n.t(
                                                  'common|load-more'
                                                )}...`}
                                          </Button>
                                        )}
                                      </div>
                                    </SearchFilter>
                                  </Box>
                                )
                              }                              
                            )}

                          <div className="checkbox__wrapper">
                            <input
                              id="api_only"
                              name="API"
                              type="checkbox"
                              checked={
                                search.request.esRdfTypes?.some(
                                  (t) =>
                                    t == ESRdfType.esterms_ServedByDataService
                                ) &&
                                search.request.esRdfTypes?.some(
                                  (t) =>
                                    t ==
                                    ESRdfType.esterms_IndependentDataService
                                ) &&
                                !search.request.esRdfTypes?.some(
                                  (t) => t == ESRdfType.dataset
                                )
                              }
                              onChange={(event) => {
                                if (
                                  search.request.esRdfTypes?.some(
                                    (t) =>
                                      t == ESRdfType.esterms_ServedByDataService
                                  ) &&
                                  search.request.esRdfTypes?.some(
                                    (t) =>
                                      t ==
                                      ESRdfType.esterms_IndependentDataService
                                  ) &&
                                  !search.request.esRdfTypes?.some(
                                    (t) => t == ESRdfType.dataset
                                  )
                                ) {
                                  this.setState({
                                    query: this.inputQueryRef.current!.value,
                                  });
                                  search
                                    .set({
                                      esRdfTypes: [
                                        ESRdfType.dataset,
                                        ESRdfType.esterms_IndependentDataService,
                                        ESRdfType.esterms_ServedByDataService,
                                      ],
                                      query:
                                        this.inputQueryRef.current!.value || '',
                                    })
                                    .then(() => search.doSearch());
                                } else {
                                  this.setState({
                                    query: this.inputQueryRef.current!.value,
                                  });
                                  search
                                    .set({
                                      esRdfTypes: [
                                        ESRdfType.esterms_IndependentDataService,
                                        ESRdfType.esterms_ServedByDataService,
                                      ],
                                      query:
                                        this.inputQueryRef.current!.value || '',
                                    })
                                    .then(() => search.doSearch());
                                }
                              }}
                            ></input>
                            <label className="text-6" htmlFor="api_only">
                              API
                            </label>
                          </div>
                        </div>

                        <div className="selected-filters">
                          {search.request &&
                            search.request.facetValues &&
                            (search.request
                              .facetValues as SearchFacetValue[]).map(
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
                          className={
                            'clear-filters' +
                            (search.request &&
                            search.request.facetValues &&
                            search.request.facetValues.length >= 2
                              ? ' show'
                              : '')
                          }
                        >
                          <button
                            onClick={() => {
                              search
                                .set({
                                  facetValues: [],
                                })
                                .then(() => {
                                  search.doSearch();
                                });
                            }}
                          >
                            {i18n.t('common|clear-filters')} (
                            {search.request &&
                              search.request.facetValues &&
                              search.request.facetValues.length}
                            )
                          </button>
                        </div>

                        <noscript>{i18n.t('common|no-js-text')}</noscript>

                        <div id="search-result" className="search-result">
                          <div className="search-result-head">
                            {search.loadingHits && (
                              <h2 className="text-4 search-result-header">
                                <span className="loading">
                                  {i18n.t('common|loading')}
                                </span>
                              </h2>
                            )}
                            <div>
                              {!search.loadingHits &&
                                search.result &&
                                (search.result.count || 0) >= 0 && (
                                  <h2 className="text-4 search-result-header">
                                    {search.result.count}{' '}
                                    {i18n.t('pages|search|dataset-hits')}{' '}
                                  </h2>
                                )}
                            </div>
                            <div className="sorting-options">
                              <div className="search-hits">
                                <label htmlFor="hits" className="text-6-bold">
                                  {i18n.t('pages|search|numberofhits')}
                                </label>

                                <select
                                  id="hits"
                                  name={i18n.t('pages|search|numberofhits')}
                                  onChange={(event) => {
                                    event?.preventDefault();
                                    search
                                      .set({
                                        take: parseInt(event.target.value),
                                      })
                                      .then(() => search.doSearch());
                                  }}
                                >
                                  <option
                                    selected={search.request.take == 20}
                                    value="20"
                                  >
                                    20
                                  </option>
                                  <option
                                    selected={search.request.take == 50}
                                    value="50"
                                  >
                                    50
                                  </option>
                                  <option
                                    selected={search.request.take == 100}
                                    value="100"
                                  >
                                    100
                                  </option>
                                </select>
                              </div>

                              <div className="search-sort">
                                <span className="text-6-bold">
                                  {' '}
                                  {i18n.t('pages|search|sort')}
                                </span>
                                <button
                                  onClick={(event) => {
                                    event.preventDefault();
                                    search
                                      .set({
                                        page: 0,
                                        sortOrder: SearchSortOrder.score_desc,
                                      })
                                      .then(() => search.doSearch());
                                  }}
                                  className={
                                    search.request.sortOrder &&
                                    search.request.sortOrder ==
                                      SearchSortOrder.score_desc
                                      ? 'text-7 sort-active'
                                      : 'text-7'
                                  }
                                >
                                  {i18n.t('pages|search|relevance')}
                                </button>

                                <button
                                  onClick={(event) => {
                                    event.preventDefault();
                                    search
                                      .set({
                                        page: 0,
                                        sortOrder: SearchSortOrder.modified_asc,
                                      })
                                      .then(() => search.doSearch());
                                  }}
                                  className={
                                    search.request.sortOrder &&
                                    search.request.sortOrder ==
                                      SearchSortOrder.modified_asc
                                      ? 'text-7 sort-active'
                                      : 'text-7'
                                  }
                                >
                                  {i18n.t('pages|search|date')}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div>
                            <ul className="search-result-list">
                              {search.result.hits &&
                                search.result.hits.map((hit, index) => (
                                  <li
                                    className="search-result-list-item"
                                    key={index}
                                    // onClick={() => {
                                    //   (window as any).location.href = hit.url;
                                    // }}
                                  >
                                    <span className="result-theme text-6">
                                      <ChopLines lines={1} lineHeight={27}>
                                        {hit.metadata &&
                                          hit.metadata['theme_literal'].join(
                                            ',  '
                                          )}
                                      </ChopLines>
                                    </span>{' '}
                                    <a
                                      href={`${hit.url}#ref=${
                                        window ? window.location.search : ''
                                      }`}
                                    >
                                      <h3 className="text-4">{hit.title}</h3>
                                    </a>
                                    <p className="text-6">{hit.description}</p>
                                    <span className="result-org text-6-bold">
                                      {hit.metadata &&
                                        hit.metadata['organisation_literal'] &&
                                        hit.metadata['organisation_literal'][0]}
                                    </span>
                                    <div className="format-row">
                                      {hit.metadata &&
                                        hit.metadata['format_literal'] &&
                                        hit.metadata['format_literal'].map(
                                          (m: string, index: number) => (
                                            <p
                                              className="result-format"
                                              key={index}
                                            >
                                              <FileFormatBadge badgeName={m} />
                                            </p>
                                          )
                                        )}
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>

                        {(search.result.pages || 0) > 1 && (
                          <div className="pagination">
                            <div className="first-page">
                              {(search.request.page || 0) > 1 && (
                                <button
                                  className=""
                                  onClick={() => {
                                    search
                                      .set({
                                        page: 0,
                                      })
                                      .then(() => search.doSearch());
                                    window.scrollTo({
                                      top: 0,
                                      behavior: 'smooth',
                                    });
                                    this.searchFocus();
                                  }}
                                >
                                  {i18n.t('pages|search|first-page')}
                                </button>
                              )}
                            </div>

                            <div className="prev-next-page">
                              <button
                                disabled={(search.request.page || 0) === 0}
                                className=""
                                onClick={() => {
                                  search
                                    .set({
                                      page: (search.request.page || 0) - 1,
                                    })
                                    .then(() => search.doSearch());
                                  window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth',
                                  });
                                  this.searchFocus();
                                }}
                              >
                                {i18n.t('pages|search|prev-page')}
                              </button>
                              <span>
                                {i18n.t('pages|search|page')}{' '}
                                {(search.request.page || 0) + 1}{' '}
                                {i18n.t('common|of')} {search.result.pages}
                              </span>
                              <button
                                className=""
                                disabled={
                                  (search.result.pages || 1) ===
                                  (search.request.page || 0) + 1
                                }
                                onClick={() => {
                                  search
                                    .set({
                                      page: (search.request.page || 0) + 1,
                                    })
                                    .then(() => search.doSearch());
                                  window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth',
                                  });
                                  this.searchFocus();
                                }}
                              >
                                {i18n.t('pages|search|next-page')}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </SearchContext.Consumer>
              </MainContent>
            </ErrorBoundary>
            <Footer onToTopButtonPushed={this.setFocus} />
          </Box>
        </SearchProvider>
      </QueryParamProvider>
    );
  }
}
