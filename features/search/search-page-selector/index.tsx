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
  { path: "/concepts", translationKey: "search$concepts" },
  { path: "/specifications", translationKey: "search$specifications" },
  { path: "/search", translationKey: "search$content" },
] as const;

/**
 * Navigation component that displays tabs for different search categories.
 * Highlights the currently active tab and maintains the search query across navigation.
 *
 * @component
 * @param {SearchTabsProps} props - The component props
 * @param {string} [props.query] - The current search query string
 * @returns {JSX.Element} A navigation component with search category tabs
 */
export function SearchPageSelector({ query }: SearchTabsProps) {
  const { t, lang } = useTranslation("pages");
  const { pathname } = useRouter() || {};

  return (
    <nav aria-label={t("search$search-type-navigation")}>
      <div
        className="mb-lg flex gap-md overflow-x-scroll md:overflow-x-visible"
        role="tablist"
        aria-label={t("search$search-tabs")}
      >
        {SEARCH_TABS.map(({ path, translationKey }) => (
          <ButtonLink
            key={path}
            variant="plain"
            href={`${path}?q=${query || ""}&f=`}
            label={t(translationKey)}
            locale={lang}
            className={`focus--in whitespace-nowrap ${
              pathname === path
                ? "bg-pink-200 font-strong text-textPrimary"
                : ""
            }`}
            role="tab"
            aria-selected={pathname === path}
          />
        ))}
      </div>
    </nav>
  );
}
