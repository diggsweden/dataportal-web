import React, { useEffect, useState } from "react";
import { SearchContextData } from "@/providers/SearchProvider";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { SearchMode } from "@/components/content/Search/SearchFilters";
import useTranslation from "next-translate/useTranslation";
import { SearchInput } from "@/components/content/Search/SearchInput";

interface SearchFormProps {
  search: SearchContextData;
  searchMode: SearchMode;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Perform a search with text input
 *
 * @param {*} { search, searchType, query, setQuery }
 * @returns a form with a text input
 */
export const SearchForm: React.FC<SearchFormProps> = ({
  search,
  searchMode,
  query,
  setQuery,
}) => {
  const [trackedQuery, setTrackedQuery] = useState("");
  const { trackEvent } = useMatomo();
  const { t } = useTranslation();

  const placeholder = t(`pages|${searchMode}$search`);

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != "undefined" && typeof location != "undefined") {
      localStorage.setItem(`ScrollposY_${location.search}`, "0");
    }
  };

  useEffect(() => {
    setTrackedQuery(query || "");
    if (!!(query && trackedQuery !== query && search.result.count === 0)) {
      trackEvent({
        category: `Sökord utan resultat - Typ: ${searchMode}`,
        action: query || "",
        name: `${searchMode}: Inga sökträffar`,
      });
    }
  }, [search.result]);

  return (
    <div className="my-xl max-w-md">
      <form
        onSubmit={(e) => {
          clearCurrentScrollPos();
          e.preventDefault();
          search
            .set({
              page: 0,
              query: query,
              fetchFacets: true,
            })
            .then(() => search.doSearch());
        }}
      >
        <SearchInput
          autoFocus
          id="search-field"
          autoComplete="off"
          name="q"
          placeholder={placeholder}
          query={query}
          setQuery={setQuery}
          value={query}
          search={search}
          key={search.request.query ? "loaded" : "not loaded"}
        />
      </form>
    </div>
  );
};
