import React, { useEffect, useState } from 'react';
import { SearchContextData } from '.';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { SearchType } from './SearchFilters';
import { FileFormatBadge } from '../FileFormatBadge';
import { clearLocalStorage } from '../../utilities';
import { DetailedList, CompactList } from '../Icons';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { SearchSortOrder } from '../pages/SearchPage';
import { Button, Heading } from '@digg/design-system';

interface SearchResultsProps {
  search: SearchContextData;
  searchType: SearchType;
  showTip?: boolean;
  showSorting: boolean;
}

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

const clearCurrentScrollPos = () => {
  if (typeof localStorage != 'undefined' && typeof location != 'undefined') {
    localStorage.setItem(`ScrollposY_${location.search}`, '0');
  }
};

/**
 * Adds sorting options to the search-results
 *
 * @param {*} { search } Context from the SearchProvider
 */
const SortingOptions: React.FC<{
  setCompact: React.Dispatch<React.SetStateAction<boolean>>;
  isCompact: boolean;
  search: SearchContextData;
}> = ({ search, setCompact, isCompact }) => {
  const { t } = useTranslation();
  return (
    <div className="sorting-options">
      <div className="search-sort">
        <span className="sorting-heading text-base font-bold">{t('pages|search$sort')}</span>

        <select
          className="text-base"
          id=""
          name={t('pages|search$numberofhits')}
          onChange={(event) => {
            event.preventDefault();
            clearCurrentScrollPos();
            search
              .set({
                page: 0,
                sortOrder: parseInt(event.target.value),
              })
              .then(() => search.doSearch());
          }}
        >
          <option
            aria-selected={search.request.sortOrder == SearchSortOrder.score_desc}
            value={SearchSortOrder.score_desc}
          >
            {t('pages|search$relevance')}
          </option>

          <option
            aria-selected={search.request.sortOrder == SearchSortOrder.modified_desc}
            value={SearchSortOrder.modified_desc}
          >
            {t('pages|search$date')}
          </option>
        </select>
      </div>

      <div className="search-hits">
        <label
          className="sorting-heading text-base font-bold"
          htmlFor="hits"
        >
          {t('pages|search$numberofhits')}
        </label>

        <select
          className="text-base"
          id="hits"
          name={t('pages|search$numberofhits')}
          onChange={(event) => {
            event?.preventDefault();
            clearCurrentScrollPos();
            search
              .set({
                take: parseInt(event.target.value),
              })
              .then(() => search.doSearch());
          }}
        >
          <option
            aria-selected={search.request.take == 20}
            value="20"
          >
            {t('pages|search$numberofhits-20')}
          </option>
          <option
            aria-selected={search.request.take == 50}
            value="50"
          >
            {t('pages|search$numberofhits-50')}
          </option>
          <option
            aria-selected={search.request.take == 100}
            value="100"
          >
            {t('pages|search$numberofhits-100')}
          </option>
        </select>
      </div>

      {/* //Show compact och detailed list view. */}
      <div className="listview-options">
        <span className="sorting-heading text-base font-bold">{t('pages|search$list-view')}</span>
        {isCompact ? (
          <button
            aria-label={
              isCompact
                ? `${t('pages|search$compact-list')}`
                : `${t('pages|search$compact-list-active')}`
            }
            className={isCompact ? 'text-base list-view_btn' : 'text-base list-view_btn active'}
            onClick={() => {
              clearCurrentScrollPos();
              search.set({ compact: true }).then(() => {
                search.setStateToLocation();
                setCompact(false);
              });
            }}
          >
            {t('pages|search$compact-list')}
            <CompactList />
          </button>
        ) : (
          <button
            aria-label={
              isCompact
                ? `${t('pages|search$detailed-list-active')}`
                : `${t('pages|search$detailed-list')}`
            }
            className={isCompact ? 'text-base list-view_btn active' : 'text-base list-view_btn'}
            onClick={() => {
              clearCurrentScrollPos();
              search.set({ compact: false }).then(() => {
                search.setStateToLocation();
                setCompact(true);
              });
            }}
          >
            {t('pages|search$detailed-list')}
            <DetailedList />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * @param {SearchContextData} { search } the context of the SearchProvider
 * @param {SearchType} { searchType } typ of search, data | begrepp | specifikation
 * @returns a list of links
 * @param {boolean} showSorting disable or enable filters
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  search,
  searchType,
  showSorting,
}) => {
  const { trackEvent } = useMatomo();
  const { t, lang } = useTranslation();

  const searchKey = typeof location != 'undefined' ? location.search : 'server';
  const posY =
    typeof localStorage != 'undefined' ? localStorage.getItem(`ScrollposY_${searchKey}`) : '0';

  const trackSearchHitClick = (url: string) => {
    trackEvent({
      category: `Sidor från en webbplatssökning`,
      name: `${searchType}: Webbplatssökning`,
      action: `Url: ${url}, sökfras: ${search.request.query}, typ: ${searchType}`,
    });
  };

  const [isCompact, setCompact] = useState(true);

  useEffect(() => {
    clearLocalStorage('ScrollposY_', `ScrollposY_${searchKey}`);
  }, [searchKey]);

  useEffect(() => {
    if (search.request.compact && search.request.compact == true) setCompact(false);
    else setCompact(true);
  });

  useEffect(() => {
    const count = search.result.count || -1;
    count > 0 && posY && posY != '0' && window.scrollTo(0, parseInt(posY, 10));
  });

  return (
    <>
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
            {search.loadingHits && <span>{t('common|loading')}</span>}
            {!search.loadingHits &&
              search.result &&
              (search.result.count || 0) >= 0 &&
              `${search.result.count} ${t('pages|search$dataset-hits')}`}
          </Heading>

          {searchType == 'data' && (
            <div
              className={showSorting ? 'active sorting-options-wrapper' : 'sorting-options-wrapper'}
            >
              <SortingOptions
                setCompact={setCompact}
                isCompact={isCompact}
                search={search}
              />
            </div>
          )}
        </div>

        {search.result && (
          <div>
            <ul className="search-result-list">
              {search.result.hits &&
                search.result.hits.map((hit, index) => (
                  <li
                    className="search-result-list-item"
                    key={index}
                  >
                    {isCompact ? (
                      <span className="result-theme text-base truncate">
                        {hit.metadata && hit.metadata['theme_literal'].join(',  ')}
                      </span>
                    ) : (
                      ''
                    )}

                    {hit.metadata &&
                      search.allFacets &&
                      !search.loadingFacets &&
                      hit.metadata['inScheme_resource'] &&
                      search.getFacetValueTitle(
                        'http://www.w3.org/2004/02/skos/core#inScheme',
                        hit.metadata['inScheme_resource'][0]
                      ) && (
                        <span className="result-theme text-base">
                          {search.getFacetValueTitle(
                            'http://www.w3.org/2004/02/skos/core#inScheme',
                            hit.metadata['inScheme_resource'][0]
                          )}
                        </span>
                      )}
                    <Link href={`/${lang}${hit.url}#ref=${window ? window.location.search : ''}`}>
                      <a
                        onClick={() => {
                          saveCurrentScrollPos();
                          trackSearchHitClick(hit.url || '');
                        }}
                      >
                        <Heading
                          level={3}
                          lang={hit.titleLang}
                        >
                          {hit.title}
                        </Heading>
                      </a>
                    </Link>

                    {isCompact && hit.descriptionLang ? (
                      <p className="text-base">{hit.description}</p>
                    ) : (
                      ''
                    )}

                    {isCompact ? (
                      ''
                    ) : (
                      <div className="org-format">
                        <span className="result-org text-base">
                          {hit.metadata &&
                            hit.metadata['organisation_literal'] &&
                            hit.metadata['organisation_literal'][0]}
                        </span>

                        <div className="org-format-filebadges">
                          {hit.metadata &&
                            hit.metadata['format_literal'] &&
                            hit.metadata['format_literal'].map((m: string, index: number) => (
                              <p
                                className="text-base file"
                                key={index}
                              >
                                <FileFormatBadge badgeName={m} />
                              </p>
                            ))}
                        </div>
                      </div>
                    )}

                    {isCompact ? (
                      <span className="result-org text-base font-bold">
                        {hit.metadata &&
                          hit.metadata['organisation_literal'] &&
                          hit.metadata['organisation_literal'][0]}
                      </span>
                    ) : (
                      ''
                    )}

                    {isCompact ? (
                      <div className="format-row">
                        {hit.metadata &&
                          hit.metadata['format_literal'] &&
                          hit.metadata['format_literal'].map((m: string, index: number) => (
                            <p
                              className="result-format"
                              key={index}
                            >
                              <FileFormatBadge badgeName={m} />
                            </p>
                          ))}
                      </div>
                    ) : (
                      ''
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {(search.result.pages || 0) > 1 && (
        <div className="pagination">
          <div className="first-page">
            {(search.request.page || 0) > 1 && (
              <Button
                inline
                onClick={() => {
                  clearCurrentScrollPos();
                  search
                    .set({
                      page: 0,
                    })
                    .then(() => search.doSearch());
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
          </div>

          <div className="prev-next-page">
            <Button
              disabled={(search.request.page || 0) === 0}
              inline
              onClick={() => {
                clearCurrentScrollPos();
                search
                  .set({
                    page: (search.request.page || 0) - 1,
                  })
                  .then(() => search.doSearch());
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
                searchFocus();
              }}
            >
              {t('pages|search$prev-page')}
            </Button>
            <span>
              {t('pages|search$page')} {(search.request.page || 0) + 1} {t('common|of')}{' '}
              {search.result.pages}
            </span>
            <Button
              disabled={(search.result.pages || 1) === (search.request.page || 0) + 1}
              inline
              onClick={() => {
                clearCurrentScrollPos();
                search
                  .set({
                    page: (search.request.page || 0) + 1,
                  })
                  .then(() => search.doSearch());
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
    </>
  );
};

export default SearchResults;
