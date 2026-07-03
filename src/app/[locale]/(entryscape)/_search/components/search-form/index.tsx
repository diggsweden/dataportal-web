import { useTranslations } from "next-intl";
import type { Dispatch, SetStateAction } from "react";

import type { SearchMode } from "@/app/[locale]/(entryscape)/_search/components/search-filters";
import { SearchInput } from "@/app/[locale]/(entryscape)/_search/components/search-input";
import type { SearchContextData } from "@/providers/search-provider";
import { clearCurrentScrollPos } from "@/utilities/scroll-helper";

interface SearchFormProps {
  search: SearchContextData;
  searchMode: SearchMode;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

/**
 * Perform a search with text input
 *
 * @param {*} { search, searchType, query, setQuery }
 * @returns a form with a text input
 */
export function SearchForm({
  search,
  searchMode,
  query,
  setQuery,
}: SearchFormProps) {
  const t = useTranslations();

  const placeholder = t(
    `pages.${searchMode}.search` as Parameters<typeof t>[0],
  );

  const submitSearch = (newQuery: string) => {
    search
      .set({
        page: 0,
        query: newQuery,
        fetchFacets: true,
      })
      .then(() => search.doSearch());
  };

  return (
    <search className="my-lg max-w-md md:my-xl">
      <form
        onSubmit={(e) => {
          clearCurrentScrollPos();
          e.preventDefault();
          submitSearch(query);
        }}
      >
        <SearchInput
          autoFocus
          id="search-field"
          placeholder={placeholder}
          isLoading={search.loadingHits}
          query={query}
          setQuery={setQuery}
          submitSearch={submitSearch}
          value={query}
          key={search.request.query ? "loaded" : "not loaded"}
          ariaLabel={placeholder}
        />
      </form>
    </search>
  );
}
