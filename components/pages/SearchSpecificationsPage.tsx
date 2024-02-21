import React, { useContext, useEffect, useState } from 'react';
import { decode } from 'qss';
import SearchProvider from '../Search/SearchProvider';
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
import useTranslation from 'next-translate/useTranslation';
import { useScript } from '../../hooks/useScript';
import { useRouter } from 'next/router';
import { initBreadcrumb } from '../../pages/_app';
import { makeBreadcrumbsFromPath } from '../../utilities';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import Head from 'next/head';
import { Heading, Container } from '@digg/design-system';
import { MainContainerStyle } from '../../styles/general/emotion';

interface SearchProps {
  activeLink?: string;
}

export const SearchSpecificationsPage: React.FC<SearchProps> = () => {
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
        const querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

        if (querytext) setQuery(querytext);
      });

      //*** makes sure querytext is set from location to input, on page reloads
      var qs = decode(window.location.search.substring(1)) as any;
      let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

      if (querytext) setQuery(decodeURIComponent(querytext.replace(/\+/g, '%20')));

      //***
    }
    setBreadcrumb &&
      setBreadcrumb(makeBreadcrumbsFromPath(asPath, t('routes|specifications$title')));
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
    trackPageView({ documentTitle: t('routes|specifications$title') });
  }, [pathname]);

  const pathResover = (hitMeta: any) => {
    var resourceUri = hitMeta.getResourceURI();

    var path = '';

    if (resourceUri.includes('://')) {
      let tmp = resourceUri.split('://');
      path = tmp[0] + '/' + tmp[1];
    } else path = resourceUri;

    if (resourceUri && !resourceUri.includes('dataportal.se')) {
      return `/externalspecification/${path}`;
    } else {
      if (
        path.startsWith('https/dataportal.se/specifications') ||
        path.startsWith('https/www-sandbox.dataportal.se/specifications')
      )
        path = path.slice(path.lastIndexOf('dataportal.se/') + 13);

      return path;
    }
  };

  return (
    <>
      <Head>
        <title>{`${t('search-specs')} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${t('search-specs')} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${t('search-specs')} - Sveriges dataportal`}
        />
      </Head>
      {postscribeStatus === 'ready' && (
        <SearchProvider
          hitSpecifications={{
            'http://www.w3.org/ns/dx/prof/Profile': {
              path: `/specifications/`,
              titleResource: 'dcterms:title',
              descriptionResource: 'dcterms:description',
              pathResolver: pathResover,
            },
            'http://purl.org/dc/terms/Standard': {
              path: `/specifications/`,
              titleResource: 'dcterms:title',
              descriptionResource: 'dcterms:description',
              pathResolver: pathResover,
            },
          }}
          facetSpecification={{
            facets: [
              {
                resource: 'http://www.w3.org/ns/dcat#theme',
                type: ESType.uri,
                dcatProperty: 'dcat:theme',
                dcatType: 'choice',
                dcatFilterEnabled: true,
                indexOrder: 0,
              },
              {
                resource: 'http://purl.org/dc/terms/publisher',
                type: ESType.uri,
                indexOrder: 1,
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
            language: lang,
            takeFacets: 30,
          }}
        >
          <SearchContext.Consumer>
            {(search) => (
              <div className="wpb_wrapper">
                <Container cssProp={MainContainerStyle}>
                  <SearchHeader activeLink={'specifications'} />

                  <div className="row">
                    <Heading
                      level={2}
                      className="search-header"
                    >
                      {t('search-specs')}
                    </Heading>
                  </div>

                  <SearchInput
                    search={search}
                    searchType="specifikationer"
                    query={query}
                    setQuery={setQuery}
                  />

                  <SearchFilters
                    search={search}
                    showFilter={showFilter}
                    searchType="specifikationer"
                    query={query}
                    setShowFilter={setShowFilter}
                  />
                  <noscript>{t('no-js-text')}</noscript>
                  <SearchResults
                    showSorting={showFilter}
                    search={search}
                    searchType="specifikationer"
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
