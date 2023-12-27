import React, { FC } from "react";
import { TextInput } from "@/components/global/Form/TextInput";
import { Button } from "@/components/global/Button";
import SearchIcon from "@/assets/icons/search.svg";
import useTranslation from "next-translate/useTranslation";

interface SearchInputProps {
  id: string;
  placeholder: string;
}

export const SearchInput: FC<SearchInputProps> = ({ id, placeholder }) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex items-center justify-end">
      {placeholder && (
        <label className="sr-only" htmlFor="start-search">
          {placeholder}
        </label>
      )}
      <TextInput
        id={id}
        name="q"
        type="text"
        autoComplete="off"
        placeholder={placeholder}
      />
      <div id="searchSubmit" className="absolute mr-[4px] h-[44px]">
        <Button
          type="submit"
          label={t("common|search")}
          icon={SearchIcon}
          iconPosition="left"
        />
      </div>
    </div>
  );
};
