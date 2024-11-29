import { Dispatch, SetStateAction, FC } from "react";
import { SearchContextData } from "@/providers/search-provider";
import { SearchMode } from "@/features/search/search-filters";
import useTranslation from "next-translate/useTranslation";
import { SearchInput } from "@/features/search/search-input";

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
export const SearchForm: FC<SearchFormProps> = ({
  search,
  searchMode,
  query,
  setQuery,
}) => {
  const { t } = useTranslation();

  const placeholder = t(`pages|${searchMode}$search`);

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != "undefined" && typeof location != "undefined") {
      localStorage.setItem(`ScrollposY_${location.search}`, "0");
    }
  };

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
    <div className="my-lg max-w-md md:my-xl">
      <form
        role={"search"}
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
    </div>
  );
};
