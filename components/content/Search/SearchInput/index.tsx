import React, { FC, InputHTMLAttributes } from "react";
import { TextInput } from "@/components/global/Form/TextInput";
import { Button } from "@/components/global/Button";
import SearchIcon from "@/assets/icons/search.svg";
import useTranslation from "next-translate/useTranslation";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
}

export const SearchInput: FC<SearchInputProps> = ({
  id,
  placeholder,
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
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        {...props}
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
