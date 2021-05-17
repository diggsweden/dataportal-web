import {
  Box,
  ArrowDropIcon,
} from '@digg/design-system';
import React from 'react';
import 'url-search-params-polyfill';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { NoJavaScriptWarning } from '../../components/NoJavaScriptWarning';
import { QueryParamProvider } from '../../components/QueryParamProvider';
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

const MainContent = Box.withComponent('main');

interface SearchProps extends PageProps {
  activeLink?: string;
}

interface SearchPageState {
  query: string;
  activeLink: string;
  showFilter: boolean;
  facetFilter: { [facet: string]: string };
  showTip?: boolean;
  headerHeight?: number;
}

export class SearchPage extends React.Component<SearchProps, SearchPageState> {
  private headerRef: React.RefObject<Header>;
  private postscribe: any;

  constructor(props: SearchProps) {
    super(props);
    this.headerRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);

    this.state = {
      query: '',
      activeLink: 'search',
      showFilter: false,
      facetFilter: {},
    };
  }

  setFocus() {
    if (this.headerRef.current) {
      this.headerRef.current.setFocusOnMenuButton();
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

  handleChange = (target: any) => {
    this.setState({ query: target.value });
  };

  toggleShowOrHide = () => {
    this.setState({ showFilter: !this.state.showFilter });
  };

  toggleShowOrHideB = () => {
    this.setState({ showTip: !this.state.showTip });
  };

  setQuery = (value: string) => {
    this.setState({
      query: value,
    });
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
            socialMeta={{
              socialDescription : i18n.t('pages|datasets|social_meta_description'),
              socialTitle : i18n.t('pages|datasets|social_meta_title'),
              socialUrl : `${this.props.env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t('routes|datasets|path')}`
            }}
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
                        <SearchHeader
                          ref={this.headerRef}
                          activeLink={this.state.activeLink}
                        />

                        <div className="row search-header-wrapper">
                          <h1 className="text-2 search-header">
                            {i18n.t('common|search-dataapi')}
                          </h1>

                          <button
                            aria-expanded={this.state.showTip ? true : false}
                            className={
                              'search-tip__btn text-7' +
                              (this.state.showTip
                                ? ' search-tip__btn--active'
                                : '')
                            }
                            onClick={this.toggleShowOrHideB}
                          >
                            {i18n.t('pages|search|search-tips')}{' '}
                            <ArrowDropIcon
                              rotation={this.state.showTip ? -180 : 0}
                              width={[20, 25]}
                            />
                          </button>
                        </div>

                        <div
                          className={
                            'search-tip__modal' +
                            (this.state.showTip ? ' show-tip' : '')
                          }
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
                              {i18n.t(
                                'pages|search|search-tips-searchfilter-head'
                              )}
                            </span>
                            <span className="text-7">
                              {i18n.t(
                                'pages|search|search-tips-searchfilter-txt'
                              )}
                            </span>
                            <span className="text-7-bold">
                              {' '}
                              {i18n.t(
                                'pages|search|search-tips-sort-head'
                              )}{' '}
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
                              {i18n.t(
                                'pages|search|search-tips-license-head'
                              )}{' '}
                            </span>
                            <span className="text-7">
                              {i18n.t('pages|search|search-tips-license-txt')}{' '}
                              <Link
                                to={`/${i18n.languages[0]}/${i18n.t(
                                  'routes|about-us|path'
                                )}`}
                                className="text-7"
                              >
                                {i18n.t(
                                  'pages|search|search-tips-license-link'
                                )}
                              </Link>
                              .
                            </span>
                          </div>
                        </div>

                        <SearchInput search={search} searchType={"data"} query={this.state.query} setQuery={this.setQuery} />

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

                        <SearchFilters
                          showFilter={this.state.showFilter}
                          searchType="data"
                          search={search}
                          query={this.state.query}
                        />

                        <noscript>{i18n.t('common|no-js-text')}</noscript>

                        <SearchResults search={search} searchType="data" />

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
