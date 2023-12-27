import React, { useEffect, useState } from "react";
import { SearchContextData } from ".";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { SearchMode } from "./SearchFilters";
import useTranslation from "next-translate/useTranslation";

interface SearchFormProps {
  search: SearchContextData;
  searchMode: SearchMode;
  query: string;
  // eslint-disable-next-line no-unused-vars
  setQuery: (value: string) => void;
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
    if (
      query && trackedQuery !== query && search.result.count === 0
        ? true
        : false
    ) {
      trackEvent({
        category: `Sökord utan resultat - Typ: ${searchMode}`,
        action: query || "",
        name: `${searchMode}: Inga sökträffar`,
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
              query: searchMode == "datasets" ? query : query ? query : "*",
              fetchFacets: true,
            })
            .then(() => search.doSearch());
        }}
      >
        <div className="search-box">
          <label className="screen-reader" htmlFor="search-field">
            {placeholder}
          </label>
          <input
            autoFocus
            id="search-field"
            // submitLabel={t("common|search")}
            autoComplete="off"
            name="q"
            type="text"
            placeholder={placeholder}
            value={query || ""}
            onChange={(e) => {
              clearCurrentScrollPos();
              setQuery(e.target.value);
            }}
            key={search.request.query ? "loaded" : "not loaded"}
          />
          {/*{search.loadingFacets && <Spinner className={"spinner"} />}*/}
        </div>
      </form>
    </div>
  );
};
