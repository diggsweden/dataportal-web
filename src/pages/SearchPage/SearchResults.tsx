import React, { useEffect, useState } from 'react';
import { SearchContextData } from '../../components/Search';
import i18n from '../../i18n';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { SearchType } from './SearchFilters';
import { SearchSortOrder } from '../../components/Search/Search';
import Truncate from 'react-truncate';
import { FileFormatBadge } from '../../components/FileFormatBadge';
import { Link } from 'react-router-dom';
import { clearLocalStorage } from '../../utilities';
import { DetailedList } from '../../assets/DetailedList';
import { CompactList } from '../../assets/CompactList';
import { compact } from 'lodash';

interface SearchResultsProps {
  search: SearchContextData;
  searchType: SearchType;
  showTip?: boolean;
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
    localStorage.setItem(
      `ScrollposY_${location.search}`,
      JSON.stringify(window.scrollY)
    );
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
  return (
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
            clearCurrentScrollPos();
            search
              .set({
                take: parseInt(event.target.value),
              })
              .then(() => search.doSearch());
          }}
        >
          <option aria-selected={search.request.take == 20} value="20">
            20
          </option>
          <option aria-selected={search.request.take == 50} value="50">
            50
          </option>
          <option aria-selected={search.request.take == 100} value="100">
            100
          </option>
        </select>
      </div>

      <div className="listview-options">
        <span className="text-6-bold">{i18n.t('pages|search|list-view')}:</span>
        <button
          aria-label={
            isCompact
              ? `${i18n.t('pages|search|detailed-list-active')}`
              : `${i18n.t('pages|search|detailed-list')}`
          }
          className={isCompact  ? 'active' : ''}
          onClick={() => {
            clearCurrentScrollPos();            
            search.set({compact:false}).then(() => {search.setStateToLocation();setCompact(true);});            
          }}
        >
          <DetailedList />
        </button>
        <button
          aria-label={
            isCompact 
              ? `${i18n.t('pages|search|compact-list')}`
              : `${i18n.t('pages|search|compact-list-active')}`
          }
          className={isCompact  ? ' ' : 'active'}
          onClick={() => {            
            clearCurrentScrollPos();
            search.set({compact:true}).then(() => {search.setStateToLocation();setCompact(false);});            
          }}
        >
          <CompactList />
        </button>
      </div>

      <div className="search-sort">
        <span className="text-6-bold"> {i18n.t('pages|search|sort')}</span>
        <button
          onClick={(event) => {
            event.preventDefault();
            clearCurrentScrollPos();
            search
              .set({
                page: 0,
                sortOrder: SearchSortOrder.score_desc,
              })
              .then(() => search.doSearch());
          }}
          className={
            search.request.sortOrder &&
            search.request.sortOrder == SearchSortOrder.score_desc
              ? 'text-7 sort-active'
              : 'text-7 '
          }
        >
          {i18n.t('pages|search|relevance')}
        </button>

        <button
          onClick={(event) => {
            event.preventDefault();
            clearCurrentScrollPos();
            search
              .set({
                page: 0,
                sortOrder: SearchSortOrder.modified_desc,
              })
              .then(() => search.doSearch());
          }}
          className={
            search.request.sortOrder &&
            search.request.sortOrder == SearchSortOrder.modified_desc
              ? 'text-7 sort-active'
              : 'text-7 '
          }
        >
          {i18n.t('pages|search|date')}
        </button>
      </div>
    </div>
  );
};

/**
 * @param {SearchContextData} { search } the context of the SearchProvider
 * @param {SearchType} { searchType } typ of search, data | begrepp | specifikation
 * @returns a list of links
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  search,
  searchType,
}) => {
  const { trackEvent } = useMatomo();

  const searchKey = typeof location != 'undefined' ? location.search : 'server';
  const posY =
    typeof localStorage != 'undefined'
      ? localStorage.getItem(`ScrollposY_${searchKey}`)
      : '0';

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
    if(search.request.compact && search.request.compact == true)
      setCompact(false)
    else
      setCompact(true);
  });

  useEffect(() => {
    const count = search.result.count || -1;
    count > 0 && posY && posY != '0' && window.scrollTo(0, parseInt(posY, 10));
  });

  return (
    <>
      <div id="search-result" className="search-result">
        <div className="search-result-head">
          <h2 className="text-4 search-result-header">
            {search.loadingHits && <span>{i18n.t('common|loading')}</span>}
            {!search.loadingHits &&
              search.result &&
              (search.result.count || 0) >= 0 &&
              `${search.result.count} ${i18n.t('pages|search|dataset-hits')}`}
          </h2>

          {searchType == 'data' && (
            <SortingOptions
              setCompact={setCompact}
              isCompact={isCompact}
              search={search}
            />
          )}
        </div>

        {search.result && (
          <div>
            <ul className="search-result-list">
              {search.result.hits &&
                search.result.hits.map((hit, index) => (
                  <li className="search-result-list-item" key={index}>
                    {isCompact  ? (
                      <span className="result-theme text-6">
                        <Truncate lines={1}>
                          {hit.metadata &&
                            hit.metadata['theme_literal'].join(',  ')}
                        </Truncate>
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
                        <span className="result-theme text-6">
                          {search.getFacetValueTitle(
                            'http://www.w3.org/2004/02/skos/core#inScheme',
                            hit.metadata['inScheme_resource'][0]
                          )}
                        </span>
                      )}
                    <Link
                      to={`${hit.url}#ref=${
                        window ? window.location.search : ''
                      }`}
                      onClick={() => {
                        saveCurrentScrollPos();
                        trackSearchHitClick(hit.url || '');
                      }}
                    >
                      <h3 lang={hit.titleLang} className="text-4">
                        {hit.title}
                      </h3>
                    </Link>

                    
                    {isCompact ? (
                      <p lang={hit.descriptionLang} className="text-6">
                        {hit.description}
                      </p>
                    ) : (
                      ''
                    )}

                    {isCompact ? (
                      ''
                    ) : (
                      <div className="org-format">
                        <span className="result-org text-6">
                          {hit.metadata &&
                            hit.metadata['organisation_literal'] &&
                            hit.metadata['organisation_literal'][0]}
                        </span>

                        <div className="org-format-filebadges">
                          {hit.metadata &&
                            hit.metadata['format_literal'] &&
                            hit.metadata['format_literal'].map(
                              (m: string, index: number) => (
                                <p className="text-6 file" key={index}>
                                  <FileFormatBadge badgeName={m} />
                                </p>
                              )
                            )}
                        </div>
                      </div>
                    )}

                    {isCompact ? (
                      <span className="result-org text-6-bold">
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
                          hit.metadata['format_literal'].map(
                            (m: string, index: number) => (
                              <p className="result-format" key={index}>
                                <FileFormatBadge badgeName={m} />
                              </p>
                            )
                          )}
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
              <button
                className=""
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
                {i18n.t('pages|search|first-page')}
              </button>
            )}
          </div>

          <div className="prev-next-page">
            <button
              disabled={(search.request.page || 0) === 0}
              className=""
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
              {i18n.t('pages|search|prev-page')}
            </button>
            <span>
              {i18n.t('pages|search|page')} {(search.request.page || 0) + 1}{' '}
              {i18n.t('common|of')} {search.result.pages}
            </span>
            <button
              className=""
              disabled={
                (search.result.pages || 1) === (search.request.page || 0) + 1
              }
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
              {i18n.t('pages|search|next-page')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResults;
