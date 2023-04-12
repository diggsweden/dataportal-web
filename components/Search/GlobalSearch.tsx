import { SearchField } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState, FormEvent, forwardRef } from "react";
import {
  DiggRadio,
  DiggRadioLabel,
  DiggRadioWrapper,
} from "../Form/Styles/FormStyles";
import { SearchMode } from "./SearchFilters";

const searchModes: SearchMode[] = [
  "content",
  "datasets",
  "concepts",
  "specifications",
];

interface GlobalSearchProps {
  className?: string;
  onSearch?: () => void;
  hidden?: boolean;
}

export const GlobalSearch = forwardRef<HTMLInputElement, GlobalSearchProps>(
  ({ className, onSearch, hidden }, ref) => {
    const { t } = useTranslation();
    const router = useRouter() || {};
    const [query, setQuery] = useState("");
    const [searchMode, setSearchMode] = useState<SearchMode>("datasets");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const targetPath =
        searchMode === "content" ? `/search` : `/${searchMode}`;
      onSearch && onSearch();
      const pathAndQuery = `${targetPath}?p=1&q=${query}&f=`;

      if (router.pathname === targetPath) {
        router.push(pathAndQuery).then(() => {
          router.reload();
        });
      } else {
        router.push(pathAndQuery);
      }
    };

    return (
      <div className={className} aria-hidden={hidden}>
        <form onSubmit={handleSubmit}>
          <label className="screen-reader" htmlFor="search-field">
            {searchMode}
          </label>
          <SearchField
            ref={ref}
            id="search-field"
            submitLabel={t("common|search")}
            autoComplete="off"
            name="q"
            type="text"
            placeholder={t(`common|search`)}
            value={query || ""}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            disabled={hidden}
          />
          <fieldset>
            <legend className="screen-reader">Search modes: </legend>
            <DiggRadioWrapper className="radio_wrapper">
              {searchModes.map((mode) => {
                const text = t(`pages|search\$${mode}`);
                return (
                  <DiggRadioLabel key={mode}>
                    <DiggRadio
                      disabled={hidden}
                      type="radio"
                      name={mode}
                      checked={searchMode === mode}
                      value={text}
                      onChange={(e) =>
                        setSearchMode(e.target.name as SearchMode)
                      }
                    />
                    <span>{text}</span>
                  </DiggRadioLabel>
                );
              })}
            </DiggRadioWrapper>
          </fieldset>
        </form>
      </div>
    );
  }
);

GlobalSearch.displayName = "GlobalSearch";
