import useTranslation from "next-translate/useTranslation";
import { Dispatch, FC, InputHTMLAttributes, SetStateAction } from "react";

import CrossIcon from "@/assets/icons/cross.svg";
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
    <div
      data-test-id="search-input"
      className="relative flex items-center justify-end"
    >
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
      <div
        className={`${
          type === "small" ? "h-[2.75rem]" : "h-[2rem] md:h-[2.75rem]"
        } absolute mr-xs flex`}
      >
        {query && (
          <Button
            type="reset"
            variant="plain"
            icon={CrossIcon}
            iconPosition="right"
            onClick={() => {
              submitSearch?.("");
              setQuery("");
            }}
            aria-label={t("common|clear-search")}
          />
        )}
        <Button
          data-test-id="search-button"
          data-test-loading={isLoading}
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
