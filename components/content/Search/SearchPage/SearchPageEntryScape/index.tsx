import { FC, useContext, useEffect, useState } from "react";
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
import { Container } from "@/components/layout/Container";
import { ESRdfType, ESType } from "@/utilities/entryScape";
import SearchFilters from "@/components/content/Search/SearchFilters";
import SearchResults from "@/components/content/Search/SearchResults";
import { Heading } from "@/components/global/Typography/Heading";
import { Button } from "@/components/global/Button";
import { SearchTips } from "@/components/content/Search/SearchTips";
import { SearchPageSelector } from "@/components/content/Search/SearchPageSelector";
import ChevronDownIcon from "@/assets/icons/chevronDown.svg";
import { linkBase } from "@/utilities";

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
        let qs = decode(window.location.search.substring(1)) as any;
        const querytext =
          qs.q && qs.q.toString().length > 0 ? qs.q.toString() : "";

        if (querytext) setQuery(querytext);
      });

      //*** makes sure querytext is set from location to input, on page reloads
      let qs = decode(window.location.search.substring(1)) as any;
      let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : "";

      if (querytext)
        setQuery(decodeURIComponent(querytext.replace(/\+/g, "%20")));
      //***
    }
  }, []);

  const pageTitle = t(`routes|${searchType}$title`);

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: pageTitle,
        crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
      });

    trackPageView({ documentTitle: pageTitle });
  }, [pathname]);

  const specsPathResover = (hitMeta: any) => {
    let resourceUri = hitMeta.getResourceURI();
    let path: string;

    if (resourceUri.includes("://")) {
      let tmp = resourceUri.split("://");
      path = tmp[0] + "/" + tmp[1];
    } else path = resourceUri;

    if (resourceUri && !resourceUri.includes("dataportal.se")) {
      return `/externalspecification/${path}`;
    } else {
      if (
        path.startsWith("https/dataportal.se/specifications") ||
        path.startsWith("https/www-sandbox.dataportal.se/specifications")
      )
        path = path.slice(path.lastIndexOf("dataportal.se/") + 13);

      return path;
    }
  };

  const termsPathResover = (hitMeta: any) => {
    const resourceUri = hitMeta.getResourceURI();

    let path: string;

    if (resourceUri.indexOf("://") > -1) {
      var tmp = resourceUri.split("://");
      path = tmp[0] + "/" + tmp[1];
    } else path = resourceUri;

    if (resourceUri && !resourceUri.includes("dataportal.se")) {
      return `/externalconcept/${path}`;
    } else {
      //NDP-343
      if (
        path.startsWith("https/dataportal.se/concepts") ||
        path.startsWith("https/www-sandbox.dataportal.se/concepts")
      )
        path = path.slice(path.lastIndexOf("dataportal.se/") + 13);

      return path;
    }
  };

  let searchProviderSettings = {
    datasets: {
      entryscapeUrl: env.ENTRYSCAPE_DATASETS_PATH
        ? `https://${env.ENTRYSCAPE_DATASETS_PATH}/store`
        : "https://admin.dataportal.se/store",
      hitSpecifications: {
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
      },
      facetSpecification: {
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
          {
            resource: "http://data.europa.eu/r5r/applicableLegislation",
            type: ESType.uri,
            dcatProperty: "dcatap:applicableLegislation",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 7,
          },
        ],
      },
      initRequest: {
        esRdfTypes: [
          ESRdfType.dataset,
          ESRdfType.esterms_IndependentDataService,
          ESRdfType.esterms_ServedByDataService,
        ],
        takeFacets: 30,
        language: lang,
        sortOrder: SearchSortOrder.score_desc,
      },
    },
    specifications: {
      entryscapeUrl: env.ENTRYSCAPE_SPECS_PATH
        ? `https://${env.ENTRYSCAPE_SPECS_PATH}/store`
        : "https://editera.dataportal.se/store",
      hitSpecifications: {
        "http://www.w3.org/ns/dx/prof/Profile": {
          path: `/specifications/`,
          titleResource: "dcterms:title",
          descriptionResource: "dcterms:description",
          pathResolver: specsPathResover,
        },
        "http://purl.org/dc/terms/Standard": {
          path: `/specifications/`,
          titleResource: "dcterms:title",
          descriptionResource: "dcterms:description",
          pathResolver: specsPathResover,
        },
      },
      facetSpecification: {
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
        ],
      },
      initRequest: {
        esRdfTypes: [ESRdfType.spec_standard, ESRdfType.spec_profile],
        language: lang,
        takeFacets: 30,
      },
    },
    concepts: {
      entryscapeUrl: env.ENTRYSCAPE_TERMS_PATH
        ? `https://${env.ENTRYSCAPE_TERMS_PATH}/store`
        : "https://editera.dataportal.se/store",
      hitSpecifications: {
        "http://www.w3.org/2004/02/skos/core#Concept": {
          path: `/concepts/`,
          titleResource: "http://www.w3.org/2004/02/skos/core#prefLabel",
          descriptionResource: "http://www.w3.org/2004/02/skos/core#definition",
          pathResolver: termsPathResover,
        },
      },
      facetSpecification: {
        facets: [
          {
            resource: "http://www.w3.org/2004/02/skos/core#inScheme",
            type: ESType.uri,
            indexOrder: 0,
          },
        ],
      },
      initRequest: {
        esRdfTypes: [ESRdfType.term],
        language: lang,
        takeFacets: 30,
      },
    },
  };

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

      {postscribeStatus === "ready" && (
        <SearchProvider
          entryscapeUrl={
            searchProviderSettings[
              searchType as keyof typeof searchProviderSettings
            ].entryscapeUrl
          }
          hitSpecifications={
            searchProviderSettings[
              searchType as keyof typeof searchProviderSettings
            ].hitSpecifications
          }
          facetSpecification={
            searchProviderSettings[
              searchType as keyof typeof searchProviderSettings
            ].facetSpecification
          }
          initRequest={
            searchProviderSettings[
              searchType as keyof typeof searchProviderSettings
            ].initRequest
          }
        >
          <SearchContext.Consumer>
            {(search) => (
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
