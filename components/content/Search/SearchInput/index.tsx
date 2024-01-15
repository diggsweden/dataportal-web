import { Dispatch, FC, InputHTMLAttributes, SetStateAction } from "react";
import { TextInput } from "@/components/global/Form/TextInput";
import { Button } from "@/components/global/Button";
import SearchIcon from "@/assets/icons/search.svg";
import useTranslation from "next-translate/useTranslation";
import CloseIcon from "@/assets/icons/closeCross.svg";
import SpinnerIcon from "@/assets/icons/spinner.svg";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  isLoading?: boolean;
  submitSearch?: Dispatch<string>;
  type?: "small" | "large";
  setOpenSearch?: Function;
}

export const SearchInput: FC<SearchInputProps> = ({
  id,
  placeholder,
  query,
  isLoading,
  submitSearch,
  setQuery,
  type,
  setOpenSearch,
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
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        type={type}
        onChange={(e) => setQuery(e.target.value)}
        {...props}
      />
      <div className="absolute mr-xs flex h-[44px]">
        {(type === "small" || query) && (
          <Button
            type="reset"
            variant="plain"
            icon={CloseIcon}
            iconPosition="right"
            onClick={() => {
              submitSearch && submitSearch("");
              setQuery("");
              setOpenSearch && setOpenSearch(false);
            }}
          />
        )}
        <Button
          type="submit"
          label={type !== "small" ? t("common|search") : ""}
          icon={isLoading ? SpinnerIcon : SearchIcon}
          iconPosition="left"
        />
      </div>
    </div>
  );
};
