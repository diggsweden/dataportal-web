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
interface SearchProps extends PageProps {
  activeLink?: string;
}

export const SearchSpecificationsPage: React.FC<SearchProps> = ({env}) => {
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  });

  const pathResover = (hitMeta: any) => {
    var resourceUri = hitMeta.getResourceURI();

    var scheme = 'https';
    var path = '';

    if (resourceUri.includes('://')) {
      var tmp = resourceUri.split('://');
      path = tmp[1];
      scheme = tmp[0];

      if (path.includes('dataportal.se/')) {
        path = path.replace('dataportal.se/', '');
      }
    } else path = resourceUri;

    return `/${i18n.languages[0]}/${path}`;
  };

  return (
    <SearchProvider
      hitSpecifications={{
        'http://www.w3.org/ns/dx/prof/Profile': {
          path: `/${i18n.languages[0]}/specifications/`,
          titleResource: 'dcterms:title',
          descriptionResource: 'dcterms:description',
          pathResolver: pathResover,
        },
        'http://purl.org/dc/terms/Standard': {
          path: `/${i18n.languages[0]}/specifications/`,
          titleResource: 'dcterms:title',
          descriptionResource: 'dcterms:description',
          pathResolver: pathResover,
        },
      }}
      facetSpecification={{
        facets: [
          { resource: 'http://www.w3.org/ns/dcat#theme', type: ESType.uri },
          {
            resource: 'http://purl.org/dc/terms/publisher',
            type: ESType.uri,
          },
        ],
      }}
      entryscapeUrl={
        env.ENTRYSCAPE_SPECS_PATH
          ? `https://${env.ENTRYSCAPE_SPECS_PATH}/store`
          : 'https://editera.dataportal.se/store'
      }
      initRequest={{
        esRdfTypes: [ESRdfType.spec_standard, ESRdfType.spec_profile],
        language: i18n.languages[0],
        takeFacets: 30,
      }}
    >
      <PageMetadata
        seoTitle={`${i18n.t('routes|specifications|title')} - ${i18n.t(
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
            path: `/${i18n.languages[0]}/${i18n.t(
              'routes|specifications|path'
            )}`,
            title: i18n.t('routes|specifications|title'),
          },
        ]}
      />
      <SearchContext.Consumer>
        {(search) => (
          <div className="wpb_wrapper">
            <div className="main-container">
              <SearchHeader activeLink={'specifications'} />

              <div className="row">
                <h1 className="text-2 search-header">
                  {i18n.t('common|search-specs')}
                </h1>
<<<<<<< HEAD
                <span className="text-7-bold beta_badge--lg">BETA</span>
=======
>>>>>>> prod
              </div>

              <SearchInput
                search={search}
                searchType="specifikationer"
                query={query}
                setQuery={setQuery}
              />

              <div className="mobile-filters">
                <button
                  className={showFilter ? 'filter-active' : ''}
                  onClick={() => setShowFilter(!showFilter)}
                >
                  {showFilter
                    ? `${i18n.t('common|hide-filter')}`
                    : `${i18n.t('common|show-filter')}`}
                </button>
              </div>

              <SearchFilters
                search={search}
                showFilter={showFilter}
                searchType="specifikationer"
                query={query}
              />

              <noscript>{i18n.t('common|no-js-text')}</noscript>

              <SearchResults search={search} searchType="specifikationer" />
            </div>
          </div>
        )}
      </SearchContext.Consumer>
    </SearchProvider>
  );
};
