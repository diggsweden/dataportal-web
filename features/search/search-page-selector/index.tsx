/**
 * @fileoverview Search page selector component that provides navigation tabs
 * for different search categories (datasets, concepts, specifications, content).
 */

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
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
  { path: "/datasets", translationKey: "pages.search.datasets" },
  { path: "/specifications", translationKey: "pages.search.specifications" },
  { path: "/concepts", translationKey: "pages.search.concepts" },
  { path: "/organisations", translationKey: "pages.search.organisations" },
  { path: "/search", translationKey: "pages.search.content" },
] as const;

/**
 * Navigation component that displays tabs for different search categories.
 * Highlights the currently active tab and maintains the search query across navigation.
 */
export function SearchPageSelector({ query }: SearchTabsProps) {
  const t = useTranslations();
  const { pathname } = useRouter() || {};

  return (
    <nav aria-label={t("pages.search.search-type-navigation")}>
      <div
        className="mb-lg flex flex-wrap gap-sm md:gap-md"
        role="tablist"
        aria-label={t("pages.search.search-tabs")}
      >
        {SEARCH_TABS.map(({ path, translationKey }) => (
          <ButtonLink
            key={path}
            variant="light"
            href={`${path}?q=${query || ""}&f=`}
            label={t(translationKey)}
            className={`search-page-selector-button button--large focus--in whitespace-nowrap rounded-t-md ${
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
