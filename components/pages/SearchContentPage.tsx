import React, { useContext, useEffect, useState } from 'react';
import { SearchHeader, SettingsContext, FileFormatBadge } from '..';
import useTranslation from 'next-translate/useTranslation';
import { querySearch } from '../../utilities';
import router, { useRouter } from 'next/router';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import Head from 'next/head';
import { Button, Container, Heading, SearchField } from '@digg/design-system';
import { MainContainerStyle } from '../../styles/general/emotion';
import Link from 'next/link';
import { Search_dataportal_Digg_Search_hits } from '../../graphql/__generated__/Search';
import { encode, decode } from 'qss';

interface SearchProps {
  activeLink?: string;
}

export const SearchContentPage: React.FC<SearchProps> = () => {
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const { t, lang } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [trackedQuery, setTrackedQuery] = useState('');
  const { trackEvent } = useMatomo();
  const { pathname, asPath } = useRouter() || {};
  const { trackPageView } = useMatomo();

  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [searchRequest, setSearchRequest] = useState<SearchRequest>();
  const [loading, setLoading] = useState(false);
  const PER_PAGE = 10;
  const searchKey = typeof location != 'undefined' ? location.search : 'server';
  const posY =
    typeof localStorage != 'undefined' ? localStorage.getItem(`ScrollposY_${searchKey}`) : '0';

  const doSearch = () =>
    new Promise<void>(async (resolve) => {
      setLoading(true);

      setStateToLocation();

      const result = (await querySearch(
        query.length > 0 ? query : '',
        lang,
        PER_PAGE,
        searchRequest?.page && searchRequest?.page > 1 ? (searchRequest?.page - 1) * PER_PAGE : 0,
        true
      )) as any;

      let hits: SearchHit[] =
        result?.dataportal_Digg_Search?.hits || []
          ? result.dataportal_Digg_Search?.hits.map((r: Search_dataportal_Digg_Search_hits) => {
              return {
                url: `/${r.hit?.slug}`,
                title: r.hit?.heading ?? r.hit?.name,
                description: r.highlights
                  ?.map((c) => {
                    return c?.value;
                  })
                  .join(' '),
                descriptionLang: r.highlights
                  ?.map((c) => {
                    return c?.value;
                  })
                  .join(' '),
              } as SearchHit;
            })
          : [];

      setSearchResult({
        ...searchResult,
        hits: hits,
        count: result.dataportal_Digg_Search?.totalNrOfHits || 0,
      });

      setLoading(false);

      resolve();
    });

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != 'undefined' && typeof location != 'undefined') {
      localStorage.setItem(`ScrollposY_${location.search}`, '0');
    }
  };

  /**
   * Save current request state to Location
   */
  const setStateToLocation = () => {
    if (typeof window != 'undefined' && history) {
      let query = searchRequest?.query ? searchRequest?.query : '';

      let page = searchRequest?.page ? searchRequest?.page : '1';

      let newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?' +
        encode({
          p: page,
          q: query,
        });
      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  /**
   * parse values in location to state
   *
   * Returns true if any values was parsed
   */
  const parseLocationToState = () => {
    return new Promise<Boolean>((resolve) => {
      let fetchResults = false;

      if (typeof window != 'undefined' && history && window.location.search) {
        var qs = decode(window.location.search.substring(1)) as any;

        let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';
        let page = qs.p && qs.p.toString().length > 0 ? qs.p.toString() : null;

        setSearchRequest({
          ...searchRequest,
          query: decodeURIComponent(querytext.replace(/\+/g, '%20')),
          page: page ?? 1,
        });

        resolve(true);
      } else resolve(false);
    });
  };

  const searchFocus = () => {
    let content = document.querySelector('#search-result');
    if (!content) return;

    const focusable = content.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const first = focusable[0];

    if (first) {
      first.focus();
    }
  };

  const saveCurrentScrollPos = () => {
    if (typeof localStorage != 'undefined' && typeof location != 'undefined') {
      localStorage.setItem(`ScrollposY_${location.search}`, JSON.stringify(window.scrollY));
    }
  };

  const trackSearchHitClick = (url: string) => {
    trackEvent({
      category: `Sidor från en webbplatssökning`,
      name: `Content: Webbplatssökning`,
      action: `Url: ${url}, sökfras: ${searchRequest?.query}, typ: Content`,
    });
  };

  const highlightWords = (text: string) => {
    if (!text) return;

    const highlightedText = text.split('**').map((text, index) => {
      if (index % 2 === 1) {
        return `<span class="search-result-list__highlight">${text}</span>`;
      } else {
        return text;
      }
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText.join('') }} />;
  };

  useEffect(() => {
    setTrackedQuery(query || '');
    if (query && trackedQuery !== query && searchResult?.count === 0 ? true : false) {
      trackEvent({
        category: `Sökord utan resultat - Typ: Content`,
        action: query || '',
        name: `Content: Inga sökträffar`,
      });
    }
  }, [searchResult]);

  useEffect(() => {
    //needed for handling back/forward buttons and changing state for input correctly
    if (typeof window !== 'undefined') {
      //handles back/forward button
      window.addEventListener('popstate', () => {
        var qs = decode(window.location.search.substring(1)) as any;
        let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

        if (querytext) setQuery(querytext);

        router.push(window.location.pathname + window.location.search);
        parseLocationToState();
      });

      //*** makes sure querytext is set from location to input, on page reloads
      var qs = decode(window.location.search.substring(1)) as any;
      let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';

      if (querytext) setQuery(decodeURIComponent(querytext.replace(/\+/g, '%20')));
      parseLocationToState();
      //***
    }
  }, []);

  useEffect(() => {
    const count = searchResult?.count || -1;
    count > 0 && posY && posY != '0' && window.scrollTo(0, parseInt(posY, 10));
  });

  useEffect(() => {
    doSearch();
  }, [searchRequest]);

  useEffect(() => {
    trackPageView({ documentTitle: t('routes|search$title') });
  }, [pathname]);

  return (
    <>
      <Head>
        <title>{`${t('common|search-content')} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${t('common|search-content')} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${t('common|search-content')} - Sveriges dataportal`}
        />
      </Head>
      <div className="wpb_wrapper">
        <Container cssProp={MainContainerStyle}>
          <SearchHeader activeLink={'content'} />

          <div className="row">
            <Heading
              className="search-header"
              size={'3xl'}
              weight="light"
              color="pinkPop"
            >
              {t('common|search-content')}
            </Heading>
          </div>

          <div>
            <form
              onSubmit={(event) => {
                clearCurrentScrollPos();
                event.preventDefault();
                setSearchRequest({
                  ...searchRequest,
                  query: query,
                  page: 1,
                });
              }}
            >
              <div className="search-box">
                <label
                  className="screen-reader"
                  htmlFor="search-field"
                >
                  Content
                </label>
                <SearchField
                  autoFocus
                  id="search-field"
                  submitLabel={t('common|search')}
                  autoComplete="off"
                  name="q"
                  type="text"
                  placeholder={t('pages|content$search-content')}
                  value={query || ''}
                  onChange={(e) => {
                    clearCurrentScrollPos();
                    setQuery(e.target.value);
                  }}
                  key={searchRequest?.query ? 'loaded' : 'not loaded'}
                />
              </div>
            </form>
          </div>

          <div
            id="search-result"
            className="search-result"
          >
            <div className="search-result-head">
              <Heading
                level={2}
                size="md"
                className="search-result-header"
              >
                {loading && <span>{t('common|loading')}</span>}
                {!loading &&
                  searchResult &&
                  (searchResult.count || 0) >= 0 &&
                  `${searchResult.count} ${t('pages|search$content-hits')}`}
              </Heading>

              {/* {searchType == 'data' && (
        <div
          className={showSorting ? 'active sorting-options-wrapper' : 'sorting-options-wrapper'}
        >
          <SortingOptions
            setCompact={setCompact}
            isCompact={isCompact}
            search={search}
          />
        </div>
      )} */}
            </div>

            {searchResult && (
              <div>
                <ul className="search-result-list">
                  {searchResult.hits &&
                    searchResult.hits.map((hit: SearchHit, index: number) => (
                      <li
                        className="search-result-list-item"
                        key={index}
                      >
                        <Link
                          href={`${hit.url}#ref=${window ? window.location.search : ''}`}
                          onClick={() => {
                            saveCurrentScrollPos();
                            trackSearchHitClick(hit.url || '');
                          }}
                        >
                          <p
                            lang={hit.titleLang}
                            className="text-lg link heading-link"
                          >
                            {highlightWords(hit.title)}
                          </p>
                        </Link>
                        {hit.description && (
                          <p className="text-base no-underline">
                            {highlightWords(hit.description)}
                          </p>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {searchResult?.count && searchResult.count > PER_PAGE && (
            <div className="pagination">
              {/* <div className="first-page">
        {(searchRequest?.page || 0) > 1 && (
          <Button
            inline
            onClick={() => {
              clearCurrentScrollPos();
              setSearchRequest
                ({
                  page: 0,
                });
                doSearch();
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              searchFocus();
            }}
          >
            {t('pages|search$first-page')}
          </Button>
        )}
      </div> */}

              <div className="prev-next-page">
                {/* Prev page */}
                <Button
                  disabled={searchRequest?.page === 1}
                  inline
                  onClick={() => {
                    clearCurrentScrollPos();
                    setSearchRequest({
                      ...searchRequest,
                      page:
                        searchRequest?.page && searchRequest?.page > 1
                          ? +searchRequest?.page - 1
                          : 1,
                    });
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                    searchFocus();
                    // setSearchRequest({
                    //   ...searchRequest,
                    //   page: searchRequest?.page? searchRequest?.page -1 : 1
                    // });
                  }}
                >
                  {t('pages|search$prev-page')}
                </Button>

                <span>
                  {t('pages|search$page')} {searchRequest?.page ?? 1} {t('common|of')}{' '}
                  {searchResult?.count && Math.ceil(searchResult.count / PER_PAGE)}
                </span>

                {/* Next page */}
                <Button
                  disabled={(searchRequest?.page ?? 1) >= Math.ceil(searchResult?.count / PER_PAGE)}
                  inline
                  onClick={() => {
                    clearCurrentScrollPos();
                    setSearchRequest({
                      ...searchRequest,
                      page: +(searchRequest?.page ?? 1) + 1,
                    });
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                    searchFocus();
                  }}
                >
                  {t('pages|search$next-page')}
                </Button>
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};
