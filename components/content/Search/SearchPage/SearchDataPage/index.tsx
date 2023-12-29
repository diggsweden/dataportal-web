import React, { useContext, useEffect, useState } from "react";
import { SearchForm } from "@/components/content/Search/SearchForm";
import { SettingsContext } from "@/providers/SettingsProvider";
import SearchProvider, {
  SearchContext,
  SearchSortOrder,
} from "@/providers/SearchProvider";
import { decode } from "qss";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { useScript } from "@/hooks/useScript";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Head from "next/head";
import Container from "@/components/layout/Container";
import { ESRdfType, ESType } from "@/utilities/entryScape";
import SearchFilters from "@/components/content/Search/SearchFilters";
import SearchResults from "@/components/content/Search/SearchResults";
import Heading from "@/components/global/Typography/Heading";
import { Button } from "@/components/global/Button";
import { SearchTips } from "@/components/content/Search/SearchTips";
import { SearchPageSelector } from "@/components/content/Search/SearchPageSelector";

interface SearchProps {
  activeLink?: string;
}

export const SearchDataPage: React.FC<SearchProps> = () => {
  const { env } = useContext(SettingsContext);
  const { pathname, query: routerQuery } = useRouter() || {};
  const { t, lang } = useTranslation();
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const postscribeStatus = useScript(
    "/postscribe.min.js",
    "sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM",
    "anonymous",
  );
  const { trackPageView } = useMatomo();

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != "undefined") {
      localStorage.setItem(`ScrollposY_${routerQuery}`, "0");
    }
  };

  useEffect(() => {
    //needed for handling back/forward buttons and changing state for input correctly
    if (typeof window !== "undefined") {
      //handles back/forward button
      window.addEventListener("popstate", () => {
        var qs = decode(window.location.search.substring(1)) as any;
        const querytext =
          qs.q && qs.q.toString().length > 0 ? qs.q.toString() : "";

        if (querytext) setQuery(querytext);
      });

      //*** makes sure querytext is set from location to input, on page reloads
      var qs = decode(window.location.search.substring(1)) as any;
      let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : "";

      if (querytext)
        setQuery(decodeURIComponent(querytext.replace(/\+/g, "%20")));
      //***
    }
  }, []);

  useEffect(() => {
    trackPageView({ documentTitle: t("routes|datasets$title") });
  }, [pathname]);

  return (
    <div id="data-search">
      <Head>
        <title>{`${t("common|search-dataapi")} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${t("common|search-dataapi")} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${t("common|search-dataapi")} - Sveriges dataportal`}
        />
      </Head>
      {postscribeStatus === "ready" && (
        <SearchProvider
          entryscapeUrl={
            env.ENTRYSCAPE_DATASETS_PATH
              ? `https://${env.ENTRYSCAPE_DATASETS_PATH}/store`
              : "https://admin.dataportal.se/store"
          }
          hitSpecifications={{
            "http://www.w3.org/ns/dcat#Dataset": {
              path: `/datasets/`,
              titleResource: "dcterms:title",
              descriptionResource: "dcterms:description",
            },
            "http://www.w3.org/ns/dcat#DataService": {
              path: `/dataservice/`,
              titleResource: "dcterms:title",
              descriptionResource: "dcterms:description",
            },
          }}
          facetSpecification={{
            facets: [
              {
                resource: "http://www.w3.org/ns/dcat#theme",
                type: ESType.uri,
                dcatProperty: "dcat:theme",
                dcatType: "choice",
                dcatFilterEnabled: true,
                indexOrder: 0,
              },
              {
                resource: "http://purl.org/dc/terms/publisher",
                type: ESType.uri,
                indexOrder: 1,
              },
              {
                resource: "http://purl.org/dc/terms/format",
                type: ESType.literal,
                dcatProperty: "dcterms:format",
                dcatType: "choice",
                dcatFilterEnabled: true,
                indexOrder: 3,
              },
              {
                resource: "http://purl.org/dc/terms/accrualPeriodicity",
                type: ESType.uri,
                dcatProperty: "dcterms:accrualPeriodicity",
                dcatType: "choice",
                dcatFilterEnabled: true,
                indexOrder: 4,
              },
              {
                resource: "http://purl.org/dc/terms/type",
                type: ESType.uri,
                related: true,
                indexOrder: 5,
              },
              {
                resource: "http://purl.org/dc/terms/license",
                type: ESType.uri,
                dcatProperty: "dcterms:license",
                dcatType: "choice",
                dcatFilterEnabled: false,
                indexOrder: 6,
              },
            ],
          }}
          initRequest={{
            esRdfTypes: [
              ESRdfType.dataset,
              ESRdfType.esterms_IndependentDataService,
              ESRdfType.esterms_ServedByDataService,
            ],
            takeFacets: 30,
            language: lang,
            sortOrder: SearchSortOrder.score_desc,
          }}
        >
          <SearchContext.Consumer>
            {(search) => (
              <Container className="my-xl">
                <div className="flex justify-between">
                  <Heading level={1} size="lg">
                    {t("common|search-dataapi")}
                  </Heading>

                  <Button
                    aria-expanded={showTip}
                    variant="plain"
                    className={
                      "search-tip__btn text-xs" +
                      (showTip ? " search-tip__btn--active" : "")
                    }
                    onClick={() => {
                      clearCurrentScrollPos();
                      setShowTip(!showTip);
                    }}
                    label={t("pages|search$search-tips")}
                  />
                </div>

                <SearchTips showTip={showTip} />

                <SearchForm
                  search={search}
                  searchMode={"datasets"}
                  query={query}
                  setQuery={setQuery}
                />

                <SearchPageSelector activeLink={"search"} query={query} />

                <SearchFilters
                  showFilter={showFilter}
                  searchMode="datasets"
                  search={search}
                  query={query}
                  setShowFilter={setShowFilter}
                />
                <noscript>{t("common|no-js-text")}</noscript>
                <SearchResults
                  showSorting={showFilter}
                  search={search}
                  searchMode="datasets"
                />
              </Container>
            )}
          </SearchContext.Consumer>
        </SearchProvider>
      )}
    </div>
  );
};
