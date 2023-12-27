import React, { useContext, useEffect, useState } from "react";
import SearchProvider from "../Search/SearchProvider";
import { decode } from "qss";
import {
  ESRdfType,
  ESType,
  SearchContext,
  SearchFilters,
  SearchHeader,
  SearchInput,
  SearchResults,
} from "..";
import { SettingsContext } from "@/providers/SettingsProvider";
import useTranslation from "next-translate/useTranslation";
import { useScript } from "../../hooks/useScript";
import { useRouter } from "next/router";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Head from "next/head";

interface SearchProps {
  activeLink?: string;
}

export const SearchTermsPage: React.FC<SearchProps> = () => {
  const { env } = useContext(SettingsContext);
  const { t, lang } = useTranslation("common");
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const postscribeStatus = useScript(
    "/postscribe.min.js",
    "sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM",
    "anonymous",
  );
  const { pathname } = useRouter() || {};
  const { trackPageView } = useMatomo();

  useEffect(() => {
    //needed for handling back/forward buttons and changing state for input correctly
    if (typeof window !== "undefined") {
      //handles back/forward button
      window.addEventListener("popstate", () => {
        var qs = decode(window.location.search.substring(1)) as any;
        let querytext =
          qs.q && qs.q.toString().length > 0 ? qs.q.toString() : "";

        if (querytext) setQuery(querytext);
      });

      //*** makes sure querytext is set from location to input, on page reloads
      var qs = decode(window.location.search.substring(1)) as any;
      let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : "";

      if (querytext)
        setQuery(decodeURIComponent(querytext.replace(/\+/g, "%20")));

      //***

      //Scroll to top on pagination click.
      // window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  });

  useEffect(() => {
    trackPageView({ documentTitle: t("routes|concepts$title") });
  }, [pathname]);

  const pathResover = (hitMeta: any) => {
    var resourceUri = hitMeta.getResourceURI();

    var path = "";

    if (resourceUri.indexOf("://") > -1) {
      var tmp = resourceUri.split("://");
      path = tmp[0] + "/" + tmp[1];
    } else path = resourceUri;

    if (resourceUri && !resourceUri.includes("dataportal.se"))
      return `/externalconcepts/${path}`;
    else {
      //NDP-343
      if (path.startsWith("https/dataportal.se/concepts"))
        path = path.replace("https/dataportal.se/concepts", "");

      return `/concepts${path}`;
    }
  };

  return (
    <>
      <Head>
        <title>{`${t("search-concept")} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${t("search-concept")} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${t("search-concept")} - Sveriges dataportal`}
        />
      </Head>
      {postscribeStatus === "ready" && (
        <SearchProvider
          entryscapeUrl={
            env.ENTRYSCAPE_TERMS_PATH
              ? `https://${env.ENTRYSCAPE_TERMS_PATH}/store`
              : "https://editera.dataportal.se/store"
          }
          hitSpecifications={{
            "http://www.w3.org/2004/02/skos/core#Concept": {
              path: `/concepts/`,
              titleResource: "http://www.w3.org/2004/02/skos/core#prefLabel",
              descriptionResource:
                "http://www.w3.org/2004/02/skos/core#definition",
              pathResolver: pathResover,
            },
          }}
          facetSpecification={{
            facets: [
              {
                resource: "http://www.w3.org/2004/02/skos/core#inScheme",
                type: ESType.uri,
                indexOrder: 0,
              },
            ],
          }}
          initRequest={{
            esRdfTypes: [ESRdfType.term],
            language: lang,
            takeFacets: 30,
          }}
        >
          <SearchContext.Consumer>
            {(search) => (
              <div className="wpb_wrapper">
                <div className="container">
                  <SearchHeader activeLink={"terms"} query={query} />

                  <div className="row">
                    <h1 className="search-header">{t("search-concept")}</h1>
                  </div>

                  <SearchInput
                    search={search}
                    searchMode="concepts"
                    query={query}
                    setQuery={setQuery}
                  />

                  <SearchFilters
                    showFilter={showFilter}
                    search={search}
                    searchMode="concepts"
                    query={query}
                    setShowFilter={setShowFilter}
                  />
                  <noscript>{t("search-datasets")}</noscript>
                  <SearchResults
                    showSorting={showFilter}
                    search={search}
                    searchMode="concepts"
                  />
                </div>
              </div>
            )}
          </SearchContext.Consumer>
        </SearchProvider>
      )}
    </>
  );
};
