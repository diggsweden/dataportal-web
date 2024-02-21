import React, { useContext, useEffect, useState } from 'react';
import SearchProvider from '../Search/SearchProvider';
import { decode } from 'qss';
import {
  SearchHeader,
  SearchFilters,
  SearchInput,
  SearchResults,
  ESRdfType,
  ESType,
  SettingsContext,
  SearchContext,
} from '..';
import { FilterIcon, CloseIcon } from '../Icons';
import useTranslation from 'next-translate/useTranslation';
import { useScript } from '../../hooks/useScript';
import { makeBreadcrumbsFromPath } from '../../utilities';
import router, { useRouter } from 'next/router';
import { initBreadcrumb } from '../../pages/_app';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import Head from 'next/head';
import { Container, Heading } from '@digg/design-system';
import { MainContainerStyle } from '../../styles/general/emotion';

interface SearchProps {
  activeLink?: string;
}

export const SearchTermsPage: React.FC<SearchProps> = () => {
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const { t, lang } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const postscribeStatus = useScript(
    '/postscribe.min.js',
    'sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM',
    'anonymous'
  );
  const { pathname, asPath } = useRouter() || {};
  const { trackPageView } = useMatomo();

  useEffect(() => {
    //needed for handling back/forward buttons and changing state for input correctly
    if (typeof window !== 'undefined') {
      //handles back/forward button
      window.addEventListener('popstate', () => {
        var qs = decode(window.location.search.substring(1)) as any;
        let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

        if (querytext) setQuery(querytext);
      });

      //*** makes sure querytext is set from location to input, on page reloads
      var qs = decode(window.location.search.substring(1)) as any;
      let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

      if (querytext) setQuery(decodeURIComponent(querytext.replace(/\+/g, '%20')));

      //***

      //Scroll to top on pagination click.
      // window.scrollTo(0, 0);
    }
    setBreadcrumb && setBreadcrumb(makeBreadcrumbsFromPath(asPath, t('routes|concepts$title')));
    return () => {
      setBreadcrumb && setBreadcrumb(initBreadcrumb);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  });

  useEffect(() => {
    trackPageView({ documentTitle: t('routes|concepts$title') });
  }, [pathname]);

  const pathResover = (hitMeta: any) => {
    var resourceUri = hitMeta.getResourceURI();

    var path = '';

    if (resourceUri.indexOf('://') > -1) {
      var tmp = resourceUri.split('://');
      path = tmp[0] + '/' + tmp[1];
    } else path = resourceUri;

    if (resourceUri && !resourceUri.includes('dataportal.se')) return `/externalconcepts/${path}`;
    else {
      //NDP-343
      if (
        path.startsWith('https/dataportal.se/concepts') ||
        path.startsWith('https/www-sandbox.dataportal.se/concepts')
      )
        path = path.slice(path.lastIndexOf('dataportal.se/') + 13);

      return path;
    }
  };

  return (
    <>
      <Head>
        <title>{`${t('search-concept')} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${t('search-concept')} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${t('search-concept')} - Sveriges dataportal`}
        />
      </Head>
      {postscribeStatus === 'ready' && (
        <SearchProvider
          entryscapeUrl={
            env.ENTRYSCAPE_TERMS_PATH
              ? `https://${env.ENTRYSCAPE_TERMS_PATH}/store`
              : 'https://editera.dataportal.se/store'
          }
          hitSpecifications={{
            'http://www.w3.org/2004/02/skos/core#Concept': {
              path: `/concepts/`,
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
                indexOrder: 0,
              },
            ],
          }}
          initRequest={{
            esRdfTypes: [ESRdfType.term],
            language: lang,
            takeFacets: 30,
          }}
        >
          <SearchContext.Consumer>
            {(search) => (
              <div className="wpb_wrapper">
                <Container cssProp={MainContainerStyle}>
                  <SearchHeader activeLink={'terms'} />

                  <div className="row">
                    <Heading className="search-header">{t('search-concept')}</Heading>
                  </div>

                  <SearchInput
                    search={search}
                    searchType="begrepp"
                    query={query}
                    setQuery={setQuery}
                  />

                  <SearchFilters
                    showFilter={showFilter}
                    search={search}
                    searchType="begrepp"
                    query={query}
                    setShowFilter={setShowFilter}
                  />
                  <noscript>{t('search-datasets')}</noscript>
                  <SearchResults
                    showSorting={showFilter}
                    search={search}
                    searchType="begrepp"
                  />
                </Container>
              </div>
            )}
          </SearchContext.Consumer>
        </SearchProvider>
      )}
    </>
  );
};
