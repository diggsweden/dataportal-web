import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect, useState, useMemo } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { SearchFilters } from "@/features/search/search-filters";
import { SearchForm } from "@/features/search/search-form";
import { SearchPageSelector } from "@/features/search/search-page-selector";
import { SearchResults } from "@/features/search/search-results";
import SearchProvider, { SearchContext } from "@/providers/search-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { handleLocale, linkBase } from "@/utilities";

import { createSearchProviderSettings } from "./search-page-provider-settings";

interface SearchPageEntryscapeProps {
  activeLink?: string;
  searchType: "datasets" | "concepts" | "specifications" | "organisations";
}

export const SearchPageEntryscape: FC<SearchPageEntryscapeProps> = ({
  searchType,
}) => {
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const { pathname } = useRouter() || {};
  const { t, lang } = useTranslation();
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Remove locale from path if it's the default locale
  useEffect(() => {
    handleLocale(window.location.pathname, lang, router.asPath, router);
  }, [router.asPath]);

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

  const pageTitle = t(`routes|${searchType}$title`);

  useEffect(() => {
    setBreadcrumb?.({
      name: pageTitle,
      crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
    });
  }, [pathname]);

  const searchProviderSettings = useMemo(
    () => createSearchProviderSettings(env, lang),
    [env, lang],
  );

  return (
    <div id="data-search">
      <Head>
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
      </Head>

      <SearchProvider router={router} {...searchProviderSettings[searchType]}>
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

              <noscript>{t("common|no-js-text")}</noscript>
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
};
