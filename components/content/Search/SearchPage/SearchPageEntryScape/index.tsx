import { FC, useContext, useEffect, useState, useMemo } from "react";
import { SearchForm } from "@/components/content/Search/SearchForm";
import { SettingsContext } from "@/providers/SettingsProvider";
import SearchProvider, { SearchContext } from "@/providers/SearchProvider";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { Container } from "@/components/layout/Container";
import SearchFilters from "@/components/content/Search/SearchFilters";
import SearchResults from "@/components/content/Search/SearchResults";
import { Heading } from "@/components/global/Typography/Heading";
import { Button } from "@/components/global/Button";
import { SearchTips } from "@/components/content/Search/SearchTips";
import { SearchPageSelector } from "@/components/content/Search/SearchPageSelector";
import ChevronDownIcon from "@/assets/icons/chevronDown.svg";
import { linkBase } from "@/utilities";
import { createSearchProviderSettings } from "./searchPageProviderSettings";

interface SearchProps {
  activeLink?: string;
  searchType: "datasets" | "concepts" | "specifications";
}

export const SearchPageEntryScape: FC<SearchProps> = ({ searchType }) => {
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const { pathname, query: routerQuery } = useRouter() || {};
  const { t, lang } = useTranslation();
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != "undefined") {
      localStorage.setItem(`ScrollposY_${routerQuery}`, "0");
    }
  };

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
    setBreadcrumb &&
      setBreadcrumb({
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
        />
        <meta
          name="twitter:title"
          content={`${pageTitle} - Sveriges dataportal`}
        />
      </Head>

      <SearchProvider {...searchProviderSettings[searchType]}>
        <SearchContext.Consumer>
          {(search) => (
            <>
              <Container>
                <div className="flex max-w-md items-end justify-between">
                  <Heading level={1} size="lg" className="mb-none">
                    {pageTitle}
                  </Heading>

                  {searchType === "datasets" && (
                    <Button
                      aria-expanded={showTip}
                      variant="plain"
                      size="sm"
                      icon={ChevronDownIcon}
                      iconPosition="right"
                      className={showTip ? "active" : " "}
                      onClick={() => {
                        clearCurrentScrollPos();
                        setShowTip(!showTip);
                      }}
                      label={t("pages|search$search-tips")}
                    />
                  )}
                </div>

                {searchType === "datasets" && <SearchTips showTip={showTip} />}

                <SearchForm
                  search={search}
                  searchMode={searchType}
                  query={query}
                  setQuery={setQuery}
                />

                <SearchPageSelector query={query} />

                <SearchFilters
                  showFilter={showFilter}
                  searchMode={searchType}
                  search={search}
                  query={query}
                  setShowFilter={setShowFilter}
                />
              </Container>

              <noscript>{t("common|no-js-text")}</noscript>
              <div className="bg-white">
                <Container>
                  <div
                    className={
                      search.result.hits && search.result.hits.length === 0
                        ? "min-h-[800px]"
                        : " "
                    }
                  >
                    <SearchResults
                      showSorting={showFilter}
                      search={search}
                      searchMode="datasets"
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
