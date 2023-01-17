import { ArrowDropIcon, Container, Heading } from "@digg/design-system";
import React, { useContext, useEffect, useState } from "react";
import {
  SearchContext,
  SearchHeader,
  SearchFilters,
  SearchInput,
  SearchResults,
  SettingsContext,
  ESType,
  ESRdfType,
} from "..";
import SearchProvider from "../Search/SearchProvider";
import { decode } from "qss";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useScript } from "../../hooks/useScript";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Head from "next/head";
import { MainContainerStyle } from "../../styles/general/emotion";

interface SearchProps {
  activeLink?: string;
}

/* eslint-disable no-unused-vars */
export enum SearchSortOrder {
  score_desc = 2,
  modified_asc = 4,
  modified_desc = 8,
}
/* eslint-enable no-unused-vars */

export const SearchPage: React.FC<SearchProps> = () => {
  const { env } = useContext(SettingsContext);
  const { pathname, query: routerQuery } = useRouter() || {};
  const { t, lang } = useTranslation();
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const postscribeStatus = useScript(
    "https://dataportal.azureedge.net/cdn/postscribe.min.js",
    "sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM",
    "anonymous"
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
    <Container cssProp={MainContainerStyle}>
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
              <div className="wpb_wrapper">
                <SearchHeader activeLink={"search"} query={query} />

                <div className="row search-header-wrapper">
                  <Heading
                    color={"pinkPop"}
                    weight={"light"}
                    size={"3xl"}
                    className="search-header"
                  >
                    {t("common|search-dataapi")}
                  </Heading>

                  <button
                    aria-expanded={showTip ? true : false}
                    className={
                      "search-tip__btn text-xs" +
                      (showTip ? " search-tip__btn--active" : "")
                    }
                    onClick={() => {
                      clearCurrentScrollPos();
                      setShowTip(!showTip);
                    }}
                  >
                    {t("pages|search$search-tips")}{" "}
                    <ArrowDropIcon
                      rotation={showTip ? 180 : 0}
                      width={"24px"}
                    />
                  </button>
                </div>

                <div
                  className={"search-tip__modal" + (showTip ? " show-tip" : "")}
                >
                  <div className="search-tip__modal-wrapper">
                    <div className="text-bold text-lg">
                      {t("pages|search$search-tips-search-head")}
                    </div>
                    <span className="text-base">
                      {t("pages|search$search-tips-search-txt")}
                    </span>
                    <div className="text-bold text-lg">
                      {t("pages|search$search-tips-filter-head")}
                    </div>
                    <span className="text-base">
                      {t("pages|search$search-tips-filter-txt")}
                    </span>
                    <div className="text-bold text-lg">
                      {t("pages|search$search-tips-searchfilter-head")}
                    </div>
                    <span className="text-base">
                      {t("pages|search$search-tips-searchfilter-txt")}
                    </span>
                    <div className="text-bold text-lg">
                      {" "}
                      {t("pages|search$search-tips-sort-head")}{" "}
                    </div>
                    <span className="text-base">
                      {t("pages|search$search-tips-sort-txt1")}
                      {t("pages|search$search-tips-sort-txt2")}
                      {t("pages|search$search-tips-sort-txt3")}
                      {t("pages|search$search-tips-sort-txt4")}
                      {t("pages|search$search-tips-sort-txt5")}
                    </span>
                    <span className="text-bold text-lg">
                      {" "}
                      {t("pages|search$search-tips-license-head")}{" "}
                    </span>
                    <span className="text-base">
                      {t("pages|search$search-tips-license-txt")}{" "}
                      <Link
                        href={`${t("routes|about-us$path")}`}
                        locale={lang}
                        className="text-base"
                      >
                        {t("pages|search$search-tips-license-link")}
                      </Link>
                      .
                    </span>
                  </div>
                </div>

                <SearchInput
                  search={search}
                  searchType={"data"}
                  query={query}
                  setQuery={setQuery}
                />

                <SearchFilters
                  showFilter={showFilter}
                  searchType="data"
                  search={search}
                  query={query}
                  setShowFilter={setShowFilter}
                />
                <noscript>{t("common|no-js-text")}</noscript>
                <SearchResults
                  showSorting={showFilter}
                  search={search}
                  searchType="data"
                />
              </div>
            )}
          </SearchContext.Consumer>
        </SearchProvider>
      )}
    </Container>
  );
};
