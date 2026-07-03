"use client";

import { type FC, useState } from "react";

import { SearchInput } from "@/app/[locale]/(entryscape)/_search/components/search-input";

interface HeroSearchProps {
  destination: string;
  placeholder: string;
  isFrontpage: boolean;
}

/**
 * Client boundary for the hero search form. The form itself is a
 * vanilla `method="GET"` submit (no server action needed — the
 * browser navigates to `${destination}?q=…`), but `<SearchInput>` is
 * controlled so its conditional clear-button can read the current
 * value. That's the only reason we need `useState` here.
 */
export const HeroSearch: FC<HeroSearchProps> = ({
  destination,
  placeholder,
  isFrontpage,
}) => {
  const [query, setQuery] = useState("");

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
