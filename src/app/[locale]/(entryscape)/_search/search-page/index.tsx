"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useContext, useEffect, useMemo, useState } from "react";
import { SearchFilters } from "@/app/[locale]/(entryscape)/_search/components/search-filters";
import { SearchForm } from "@/app/[locale]/(entryscape)/_search/components/search-form";
import { SearchPageSelector } from "@/app/[locale]/(entryscape)/_search/components/search-page-selector";
import { SearchResults } from "@/app/[locale]/(entryscape)/_search/components/search-results";
import { Container } from "@/components/layout/container";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { Heading } from "@/components/typography/heading";
import SearchProvider, { SearchContext } from "@/providers/search-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { handleLocale } from "@/utilities";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

import { createSearchProviderSettings } from "./search-page-provider-settings";

interface SearchPageProps {
  activeLink?: string;
  searchType: "datasets" | "concepts" | "specifications" | "organisations";
}

export function SearchPage({ searchType }: SearchPageProps) {
  const { env } = useContext(SettingsContext);
  const pathname = usePathname();
  const t = useTranslations();
  const lang = useLocale();
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Remove locale from path if it's the default locale
  useEffect(() => {
    if (pathname)
      handleLocale(window.location.pathname, lang, pathname, router);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Extract query from URL search params
    const getQueryFromUrl = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const rawQuery = searchParams.get("q");
      return rawQuery ? decodeURIComponent(rawQuery.replace(/\+/g, " ")) : "";
    };

    // Handle URL changes (back/forward navigation)
    const handleUrlChange = () => {
      const queryText = getQueryFromUrl();
      if (queryText) setQuery(queryText);
    };

    // Set initial query from URL
    handleUrlChange();

    // Listen for popstate events
    window.addEventListener("popstate", handleUrlChange);

    // Cleanup listener
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  const pageTitle = t(`routes.${searchType}.title`);

  const searchProviderSettings = useMemo(
    () => createSearchProviderSettings(env, lang),
    [env, lang],
  );

  return (
    <div id="data-search">
      <BreadcrumbSetter {...buildBreadcrumb(pageTitle, [])} />
      <title>{`${pageTitle} - Sveriges dataportal`}</title>
      <meta
        property="og:title"
        content={`${pageTitle} - Sveriges dataportal`}
        key="og:title"
      />
      <meta
        name="twitter:title"
        content={`${pageTitle} - Sveriges dataportal`}
        key="twitter:title"
      />

      <SearchProvider {...searchProviderSettings[searchType]}>
        <SearchContext.Consumer>
          {(search) => (
            <>
              <Container>
                <div className="flex max-w-md items-end justify-between">
                  <Heading level={1} size="lg" className="mb-none">
                    {pageTitle}
                  </Heading>
                </div>

                <SearchForm
                  search={search}
                  searchMode={searchType}
                  query={query}
                  setQuery={setQuery}
                />

                <SearchPageSelector query={query} />

                <SearchFilters
                  searchMode={searchType}
                  search={search}
                  query={query}
                />
              </Container>

              <noscript>{t("common.no-js-text")}</noscript>
              <div className="mt-xl bg-white py-xl">
                <Container>
                  <div
                    className={
                      search.result.hits && search.result.hits.length === 0
                        ? "min-h-[800px]"
                        : " "
                    }
                  >
                    <SearchResults
                      showSorting={true}
                      search={search}
                      searchMode={searchType}
                    />
                  </div>
                </Container>
              </div>
            </>
          )}
        </SearchContext.Consumer>
      </SearchProvider>
    </div>
  );
}
