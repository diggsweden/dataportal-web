"use client";

import { useTranslations } from "next-intl";
import { type FC, useState } from "react";

import { SearchInput } from "@/app/[locale]/(entryscape)/_search/search-input";

interface HeroSearchProps {
  isFrontpage: boolean;
}

export const HeroSearch: FC<HeroSearchProps> = ({ isFrontpage }) => {
  const t = useTranslations();
  const [query, setQuery] = useState("");

  const destination = `/${t("routes.datasets.path")}`;
  const placeholder = t("pages.startpage.search_placeholder");

  return (
    <search>
      <form
        className={`datapage-form w-full max-w-md ${
          isFrontpage ? "mx-auto" : "justify-start"
        }`}
        method="GET"
        action={destination}
      >
        <SearchInput
          id="start-search"
          placeholder={placeholder}
          query={query}
          setQuery={setQuery}
          ariaLabel={placeholder}
        />
      </form>
    </search>
  );
};
