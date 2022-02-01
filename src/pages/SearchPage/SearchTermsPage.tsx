import React, { useEffect, useState } from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { SearchContext, SearchProvider } from '../../components/Search';
import { decode } from 'qss';
import { PageMetadata } from '../PageMetadata';
import { SearchHeader } from 'components/SearchHead';
import { ESRdfType, ESType } from 'components/Search/EntryScape';
import i18n from 'i18n';
import { PageProps } from '../PageProps';
import { StaticBreadcrumb } from 'components/Breadcrumb';
import SearchFilters from './SearchFilters';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import { FilterIcon } from '../../assets/Icon_FilterIcon';
import { CloseIcon2 } from '../../assets/Icon_Close';

interface SearchProps extends PageProps {
  activeLink?: string;
}

export const SearchTermsPage: React.FC<SearchProps> = ({ location, env }) => {
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  useEffect(() => {
    //needed for handling back/forward buttons and changing state for input correctly
    if (typeof window !== 'undefined') {
      //handles back/forward button
      window.addEventListener('popstate', () => {
        var qs = decode(window.location.search.substring(1)) as any;
        let querytext =
          qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

        if (querytext) setQuery(querytext);
      });

      //*** makes sure querytext is set from location to input, on page reloads
      var qs = decode(window.location.search.substring(1)) as any;
      let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

      if (querytext)
        setQuery(decodeURIComponent(querytext.replace(/\+/g, '%20')));

      //***

      //Scroll to top on pagination click.
      // window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  });

  const pathResover = (hitMeta: any) => {
    var resourceUri = hitMeta.getResourceURI();

    var path = '';

    if (resourceUri.indexOf('://') > -1) {
      var tmp = resourceUri.split('://');
      path = tmp[0] + '/' + tmp[1];
    } else path = resourceUri;

    if (resourceUri && !resourceUri.includes('dataportal.se'))
      return `/${i18n.languages[0]}/externalconcepts/${path}`;
    else {
      //NDP-343
      if (path.startsWith('https/dataportal.se/concepts'))
        path = path.replace('https/dataportal.se/concepts', '');

      return `/${i18n.languages[0]}/concepts${path}`;
    }
  };

  return (
    <SearchProvider
      entryscapeUrl={
        env.ENTRYSCAPE_TERMS_PATH
          ? `https://${env.ENTRYSCAPE_TERMS_PATH}/store`
          : 'https://editera.dataportal.se/store'
      }
      hitSpecifications={{
        'http://www.w3.org/2004/02/skos/core#Concept': {
          path: `/${i18n.languages[0]}/concepts/`,
          titleResource: 'http://www.w3.org/2004/02/skos/core#prefLabel',
          descriptionResource: 'http://www.w3.org/2004/02/skos/core#definition',
          pathResolver: pathResover,
        },
      }}
      facetSpecification={{
        facets: [
          {
            resource: 'http://www.w3.org/2004/02/skos/core#inScheme',
            type: ESType.uri,
            indexOrder: 0
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
        socialMeta={{
          socialDescription: i18n.t(
            'pages|specifications|social_meta_description'
          ),
          socialTitle: i18n.t('pages|specifications|social_meta_title'),
          socialUrl: `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t(
            'routes|specifications|path'
          )}`,
        }}
      />
      <StaticBreadcrumb
        env={env}
        staticPaths={[
          {
            path: `/${i18n.languages[0]}/${i18n.t('routes|concepts|path')}`,
            title: i18n.t('routes|concepts|title'),
          },
        ]}
      />
      <SearchContext.Consumer>
        {(search) => (
          <div className="wpb_wrapper">
            <div className="main-container">
              <SearchHeader activeLink={'terms'} />

              <div className="row">
                <h1 className="text-2 search-header">
                  {i18n.t('common|search-concept')}
                </h1>
              </div>

              <SearchInput
                search={search}
                searchType="begrepp"
                query={query}
                setQuery={setQuery}
              />

              <div className="mobile-filters">
                <button
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
                search={search}
                searchType="begrepp"
                query={query}
              />
              <noscript>{i18n.t('common|search-datasets')}</noscript>
              <SearchResults
                showSorting={showFilter}
                search={search}
                searchType="begrepp" />
            </div>
          </div>
        )}
      </SearchContext.Consumer>
    </SearchProvider>
  );
};
