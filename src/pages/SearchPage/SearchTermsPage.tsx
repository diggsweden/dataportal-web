import {
  Box,
  SearchIcon,
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
  SearchProvider,
} from '../../components/Search';
import { decode } from 'qss';
import { PageMetadata } from '../PageMetadata';
import { Loader } from '../../components/Loader';
import { SearchHeader } from 'components/SearchHead';
import { ESRdfType, ESType } from 'components/Search/EntryScape';
import i18n from 'i18n';
import { PageProps } from '../PageProps';
import { StaticBreadcrumb } from 'components/Breadcrumb';
import SearchFilters from './SearchFilters';

const MainContent = Box.withComponent('main');

interface SearchProps extends PageProps {
  activeLink?: string;
}

export class SearchTermsPage extends React.Component<SearchProps, any> {
  private headerRef: React.RefObject<Header>;
  private searchRef: React.RefObject<SearchHeader>;
  private inputQueryRef: React.RefObject<HTMLInputElement>;

  constructor(props: SearchProps) {
    super(props);
    this.headerRef = React.createRef();
    this.searchRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
    this.inputQueryRef = React.createRef();
    this.state = { query: '*', activeLink: 'search', showFilters: false };
    this.state = { activeLink: 'terms' };
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

      //Scroll to top on pagination click.
      // window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  handleChange = (target: any) => {
    this.setState({ query: target.value });
  };

  toggleShowOrHide = () => {
    this.setState({ showFilter: !this.state.showFilter });
  };

  pathResover = (hitMeta: any) => {
    var resourceUri = hitMeta.getResourceURI();

    var path = '';

    if (resourceUri.indexOf('://') > -1) {
      var tmp = resourceUri.split("://");
      path = tmp[0] + '/' + tmp[1];
    }
    else
      path = resourceUri;

    if (resourceUri && !resourceUri.includes('dataportal.se'))
      return `/${i18n.languages[0]}/externalconcepts/${path}`;
    else
      return `/${i18n.languages[0]}/concepts/${path}`;
  };

  render() {
    const { location } = this.props;
    let uri = new URLSearchParams(location.search);

    return (
      <QueryParamProvider params={uri}>
        <SearchProvider
          entryscapeUrl={this.props.env.ENTRYSCAPE_TERMS_PATH ? `https://${this.props.env.ENTRYSCAPE_TERMS_PATH}/store` : 'https://editera.dataportal.se/store'}
          hitSpecifications={{
            "http\://www.w3.org/2004/02/skos/core#Concept":
            {
              path: `/${i18n.languages[0]}/concepts/`,
              titleResource: 'http://www.w3.org/2004/02/skos/core#prefLabel',
              descriptionResource: 'http://www.w3.org/2004/02/skos/core#definition',
              pathResolver: this.pathResover
            }
          }}
          facetSpecification={{
            facets: [
              {
                resource: 'http://www.w3.org/2004/02/skos/core#inScheme',
                type: ESType.uri,
              },
            ],
          }}
          initRequest={{
            esRdfTypes: [ESRdfType.term],
            language: i18n.languages[0],
            takeFacets: 30,
          }}
        >
          <PageMetadata
            seoTitle={`${i18n.t('routes|concepts|title')} - ${i18n.t(
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
                        'routes|concepts|path'
                      )}`,
                      title: i18n.t('routes|concepts|title'),
                    },
                  ]}
                />
                <SearchContext.Consumer>
                  {(search) => (
                    <div className="wpb_wrapper">
                      <div className="main-container">
                        <SearchHeader
                          ref={this.headerRef}
                          activeLink={this.state.activeLink}
                        />

                        <div className="row">
                          <h1 className="text-2 search-header">
                            {i18n.t('common|search-concept')}
                          </h1>
                          <span className="text-6-bold beta_badge--lg">
                            BETA
                          </span>
                        </div>

                        <form
                          onSubmit={(event) => {
                            event.preventDefault();
                            search
                              .set({
                                page: 0,
                                query: this.inputQueryRef.current!.value || '*',
                                fetchFacets: true,
                              })
                              .then(() => search.doSearch());
                          }}
                        >
                          <div className="search-box">
                            <label
                              className="screen-reader"
                              htmlFor="search-field"
                            >
                              {i18n.t('pages|concepts|search-concept')}
                            </label>
                            <input
                              autoFocus
                              id="search-field"
                              autoComplete="off"
                              name="q"
                              ref={this.inputQueryRef}
                              type="text"
                              placeholder={i18n.t(
                                'pages|concepts|search-concept'
                              )}
                              value={this.state.query}
                              onChange={this.handleChange}
                              key={
                                search.request.query ? 'loaded' : 'not loaded'
                              }
                            ></input>
                            <button type="submit" aria-label="Sök">
                              <SearchIcon
                                color={colorPalette.white}
                                width={[25]}
                              />
                            </button>
                            {search.loadingFacets && <Loader />}
                          </div>
                        </form>

                        <div className="mobile-filters">
                          <button
                            className={
                              this.state.showFilter ? 'filter-active' : ''
                            }
                            onClick={this.toggleShowOrHide}
                          >
                            {this.state.showFilter
                              ? `${i18n.t('common|hide-filter')}`
                              : `${i18n.t('common|show-filter')}`}
                          </button>
                        </div>

                        <SearchFilters showFilter={this.state.showFilter} search={search} />

                        <noscript>{i18n.t('common|search-datasets')}</noscript>

                        <div id="search-result" className="search-result">
                          <h2 className="text-4 search-result-header">
                            {search.loadingHits &&
                              `${i18n.t('common|loading')}...`}
                            {!search.loadingHits &&
                              search.result &&
                              (search.result.count || 0) >= 0 &&
                              `${search.result.count} ${i18n.t(
                                'pages|search|concept-hits'
                              )}`}{' '}
                          </h2>
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
                                    { hit.metadata && search.allFacets && !search.loadingFacets
                                      && hit.metadata['inScheme_resource'] && search.getFacetValueTitle('http://www.w3.org/2004/02/skos/core#inScheme', hit.metadata['inScheme_resource'][0]) &&
                                      <span className="result-theme text-6">
                                        {search.getFacetValueTitle('http://www.w3.org/2004/02/skos/core#inScheme', hit.metadata['inScheme_resource'][0])}
                                      </span>
                                    }
                                    <a
                                      href={`${hit.url}#ref=${window ? window.location.search : ''
                                        }`}
                                    >
                                      <h3 className="text-4">{hit.title}</h3>
                                    </a>
                                    <p className="result-desc text-6">{hit.description}</p>
                                    <p className="result-org text-6-bold">
                                      {hit.metadata &&
                                        hit.metadata['organisation_literal'] &&
                                        hit.metadata['organisation_literal'][0]}
                                    </p>
                                    <div className="format-row">
                                      {hit.metadata &&
                                        hit.metadata['format_literal'] &&
                                        hit.metadata['format_literal'].map(
                                          (m: string, index: number) => (
                                            <p
                                              className="result-format"
                                              key={index}
                                            >
                                              <span>{m}</span>
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
