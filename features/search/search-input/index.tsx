import useTranslation from "next-translate/useTranslation";
import { Dispatch, FC, InputHTMLAttributes, SetStateAction } from "react";

import CloseIcon from "@/assets/icons/closeCross.svg";
import SearchIcon from "@/assets/icons/search.svg";
import SpinnerIcon from "@/assets/icons/spinner.svg";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form/text-input";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  ariaLabel: string;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  isLoading?: boolean;
  submitSearch?: Dispatch<string>;
  type?: "small" | "large";
}

export const SearchInput: FC<SearchInputProps> = ({
  id,
  placeholder,
  ariaLabel,
  query,
  isLoading,
  submitSearch,
  setQuery,
  type,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex items-center justify-end">
      <label className="sr-only" htmlFor={id}>
        {placeholder}
      </label>
      <TextInput
        id={id}
        name="q"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={ariaLabel}
        {...props}
      />
      <div className="absolute mr-xs flex h-[2.75rem]">
        {query && (
          <Button
            type="reset"
            variant="plain"
            icon={CloseIcon}
            iconPosition="right"
            onClick={() => {
              submitSearch?.("");
              setQuery("");
            }}
            aria-label={t("common|clear-search")}
          />
        )}
        <Button
          type="submit"
          label={type !== "small" ? t("common|search") : ""}
          icon={isLoading ? SpinnerIcon : SearchIcon}
          iconPosition="left"
          aria-label={ariaLabel}
        />
      </div>
    </div>
  );
};
