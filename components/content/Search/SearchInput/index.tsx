import React, {
  Dispatch,
  FC,
  InputHTMLAttributes,
  SetStateAction,
} from "react";
import { TextInput } from "@/components/global/Form/TextInput";
import { Button } from "@/components/global/Button";
import SearchIcon from "@/assets/icons/search.svg";
import useTranslation from "next-translate/useTranslation";
import { SearchContextData } from "@/providers/SearchProvider";
import CloseIcon from "@/assets/icons/closeCross.svg";
import SpinnerIcon from "@/assets/icons/spinner.svg";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  query: string;
  search?: SearchContextData;
  setQuery: Dispatch<SetStateAction<string>>;
  submitMeiliSearch?: Dispatch<string>;
}

export const SearchInput: FC<SearchInputProps> = ({
  id,
  placeholder,
  query,
  search,
  submitMeiliSearch,
  setQuery,
  ...props
}) => {
  const { t } = useTranslation();
  const requestQuery = search ? search.request.query : null;

  return (
    <div className="relative flex items-center justify-end">
      <label className="sr-only" htmlFor={id}>
        {placeholder}
      </label>
      <TextInput
        id={id}
        name="q"
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        {...props}
      />
      <div className="absolute mr-[4px] flex h-[44px]">
        {query && (
          <Button
            type="reset"
            variant="plain"
            icon={CloseIcon}
            iconPosition="right"
            onClick={() => {
              search &&
                requestQuery &&
                search
                  .set({
                    page: 0,
                    query: "",
                    fetchFacets: true,
                  })
                  .then(() => search.doSearch());
              submitMeiliSearch && submitMeiliSearch("");
              setQuery("");
            }}
          />
        )}
        <Button
          type="submit"
          label={t("common|search")}
          icon={search && search.loadingFacets ? SpinnerIcon : SearchIcon}
          iconPosition="left"
        />
      </div>
    </div>
  );
};
