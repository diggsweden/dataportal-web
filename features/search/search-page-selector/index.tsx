/**
 * @fileoverview Search page selector component that provides navigation tabs
 * for different search categories (datasets, concepts, specifications, content).
 */

import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { ButtonLink } from "@/components/button";

/**
 * Props for the SearchPageSelector component
 * @interface
 */
interface SearchTabsProps {
  /** The current search query string */
  query?: string;
}

/**
 * Configuration for search tabs defining their paths and translation keys
 * @constant
 */
const SEARCH_TABS = [
  { path: "/datasets", translationKey: "search$datasets" },
  { path: "/specifications", translationKey: "search$specifications" },
  { path: "/concepts", translationKey: "search$concepts" },
  { path: "/organisations", translationKey: "search$organisations" },
  { path: "/search", translationKey: "search$content" },
] as const;

/**
 * Navigation component that displays tabs for different search categories.
 * Highlights the currently active tab and maintains the search query across navigation.
 */
export function SearchPageSelector({ query }: SearchTabsProps) {
  const { t, lang } = useTranslation("pages");
  const { pathname } = useRouter() || {};

  return (
    <nav aria-label={t("search$search-type-navigation")}>
      <div
        className="mb-lg flex flex-wrap gap-sm md:gap-md"
        role="tablist"
        aria-label={t("search$search-tabs")}
      >
        {SEARCH_TABS.map(({ path, translationKey }) => (
          <ButtonLink
            key={path}
            variant="light"
            href={`${path}?q=${query || ""}&f=`}
            label={t(translationKey)}
            locale={lang}
            className={`button--large focus--in whitespace-nowrap rounded-t-md ${
              pathname === path ? "active" : ""
            }`}
            role="tab"
            data-tracking-name="search-tab"
            aria-selected={pathname === path}
          />
        ))}
      </div>
    </nav>
  );
}
