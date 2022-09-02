import React, { useEffect, useState } from 'react';
import { colorPalette, SearchIcon, Spinner } from '@digg/design-system';
import { SearchContextData } from '.';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { SearchType } from './SearchFilters';
import useTranslation from 'next-translate/useTranslation';

interface SearchInputProps {
  search: SearchContextData;
  searchType: SearchType;
  query: string;
  setQuery: (value: string) => void;
}

/**
 * Perform a search with text input
 *
 * @param {*} { search, searchType, query, setQuery }
 * @returns a form with a text input
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  search,
  searchType,
  query,
  setQuery,
}) => {
  const [trackedQuery, setTrackedQuery] = useState('');
  const { trackEvent } = useMatomo();
  const { t } = useTranslation();

  const getLabel = () => {
    switch (searchType) {
      case 'data':
        return t('pages|datasets$search-datasets');
      case 'begrepp':
        return t('pages|concepts$search-concept');
      case 'specifikationer':
        return t('pages|specifications$search-specifications');
    }
  };

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != 'undefined' && typeof location != 'undefined') {
      localStorage.setItem(`ScrollposY_${location.search}`, '0');
    }
  };

  useEffect(() => {
    setTrackedQuery(query || '');
    if (query && trackedQuery !== query && search.result.count === 0 ? true : false) {
      trackEvent({
        category: `Sökord utan resultat - Typ: ${searchType}`,
        action: query || '',
        name: `${searchType}: Inga sökträffar`,
      });
    }
  }, [search.result]);

  return (
    <div>
      <form
        onSubmit={(event) => {
          clearCurrentScrollPos();
          event.preventDefault();
          search
            .set({
              page: 0,
              query: searchType == 'data' ? query : query ? query : '*',
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
            {getLabel()}
          </label>
          <input
            autoFocus
            id="search-field"
            autoComplete="off"
            name="q"
            type="text"
            placeholder={getLabel()}
            value={query || ''}
            onChange={(e) => {
              clearCurrentScrollPos();
              setQuery(e.target.value);
            }}
            key={search.request.query ? 'loaded' : 'not loaded'}
          ></input>
          <button
            type="submit"
            aria-label={t('common|search')}
          >
            <SearchIcon
              color={colorPalette.white}
              width={[25]}
            />
          </button>
          {search.loadingFacets && <Spinner />}
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
