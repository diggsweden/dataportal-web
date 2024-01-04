import React, { FC, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { querySearch } from "@/utilities";
import { useRouter } from "next/router";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Head from "next/head";
import Link from "next/link";
import { SearchHitFragment } from "@/graphql/__generated__/operations";
import { getSearchHit } from "@/utilities/searchHelpers";
import Heading from "@/components/global/Typography/Heading";
import Container from "@/components/layout/Container";
import { SearchPageSelector } from "@/components/content/Search/SearchPageSelector";
import { SearchInput } from "@/components/content/Search/SearchInput";

interface SearchProps {
  activeLink?: string;
}

export const SearchContentPage: FC<SearchProps> = () => {
  const router = useRouter() || {};
  const { pathname, query: routerQuery } = router || {};
  const { t, lang } = useTranslation("common");
  const [query, setQuery] = useState((routerQuery?.q as string) || "");
  const [trackedQuery, setTrackedQuery] = useState("");
  const { trackEvent } = useMatomo();
  const { trackPageView } = useMatomo();

  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [searchRequest, setSearchRequest] = useState<SearchRequest>({
    page: parseInt(routerQuery?.p as string),
    query: routerQuery?.q as string,
  });
  const [loading, setLoading] = useState(false);
  const PER_PAGE = 10;
  const searchKey = typeof location != "undefined" ? location.search : "server";
  const posY =
    typeof localStorage != "undefined"
      ? localStorage.getItem(`ScrollposY_${searchKey}`)
      : "0";

  const doSearch = async () => {
    setLoading(true);

    const result = (await querySearch(
      searchRequest.query || "",
      lang,
      PER_PAGE,
      searchRequest?.page && searchRequest?.page > 1
        ? (searchRequest?.page - 1) * PER_PAGE
        : 0,
      true,
    )) as any;

    const hits: SearchHit[] = result?.dataportal_Digg_Search?.hits
      ? result.dataportal_Digg_Search?.hits.map((r: SearchHitFragment) => {
          return getSearchHit(r, t);
        })
      : [];

    setSearchResult({
      ...searchResult,
      hits,
      count: result?.dataportal_Digg_Search?.totalNrOfHits || 0,
    });

    setLoading(false);
  };

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != "undefined" && typeof location != "undefined") {
      localStorage.setItem(`ScrollposY_${location.search}`, "0");
    }
  };

  const searchFocus = () => {
    let content = document.querySelector("#search-result");
    if (!content) return;

    const focusable = content.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const first = focusable[0];

    if (first) {
      first.focus();
    }
  };

  const saveCurrentScrollPos = () => {
    if (typeof localStorage != "undefined" && typeof location != "undefined") {
      localStorage.setItem(
        `ScrollposY_${location.search}`,
        JSON.stringify(window.scrollY),
      );
    }
  };

  const trackSearchHitClick = (url: string) => {
    trackEvent({
      category: `Sidor från en webbplatssökning`,
      name: `Content: Webbplatssökning`,
      action: `Url: ${url}, sökfras: ${searchRequest?.query}, typ: Content`,
    });
  };

  const highlightWords = (text: string) => {
    if (!text) return;

    const highlightedText = text.split("**").map((text, index) => {
      if (index % 2 === 1) {
        return `<span class="search-result-list__highlight">${text}</span>`;
      } else {
        return text;
      }
    });

    return (
      <span dangerouslySetInnerHTML={{ __html: highlightedText.join("") }} />
    );
  };

  const handlePagination = (action: "increment" | "decrement") => {
    if (!searchRequest.page) return;
    const decrement = searchRequest.page > 1 ? +searchRequest.page - 1 : 1;
    const increment = +(searchRequest?.page ?? 1) + 1;
    const page = action === "increment" ? increment : decrement;
    router.query.p = page.toString();
    router.push(router);
    clearCurrentScrollPos();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    searchFocus();
  };

  useEffect(() => {
    setTrackedQuery(query || "");
    if (!!(query && trackedQuery !== query && searchResult?.count === 0)) {
      trackEvent({
        category: `Sökord utan resultat - Typ: Content`,
        action: query || "",
        name: `Content: Inga sökträffar`,
      });
    }
  }, [searchResult]);

  useEffect(() => {
    const count = searchResult?.count || -1;
    count > 0 && posY && posY != "0" && window.scrollTo(0, parseInt(posY, 10));
  });

  useEffect(() => {
    doSearch();
  }, [searchRequest]);

  useEffect(() => {
    trackPageView({ documentTitle: t("routes|search$title") });
  }, [pathname]);

  useEffect(() => {
    if (!routerQuery.p) {
      routerQuery.p = "1";
      router.push(router);
    }
    const q = (routerQuery.q as string) || "";
    setQuery(q);
    setSearchRequest({
      ...searchRequest,
      page: parseInt(routerQuery.p as string),
      query: q,
    });
  }, [routerQuery]);

  const submitSearch = (newQuery: string) => {
    routerQuery.q = newQuery;
    routerQuery.p = "1";
    router.push(router);
    setSearchRequest({
      ...searchRequest,
      query: newQuery,
      page: 1,
    });
  };

  const cleanDoubleSlash = (url: string) => {
    return url.replace(/\/\//g, "/");
  };

  return (
    <div className="SearchContentPage">
      <Head>
        <title>{`${t("common|search")} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${t("common|search")} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${t("common|search")} - Sveriges dataportal`}
        />
      </Head>
      <Container className="my-xl">
        <Heading level={1} size="lg">
          {t("common|search-content")}
        </Heading>

        <form
          className="my-xl max-w-md"
          onSubmit={(event) => {
            clearCurrentScrollPos();
            event.preventDefault();
            submitSearch(query);
          }}
        >
          <SearchInput
            autoFocus
            id="search-field"
            placeholder={t("pages|content$search")}
            isLoading={loading}
            query={query}
            setQuery={setQuery}
            submitSearch={submitSearch}
            onChange={(e) => {
              clearCurrentScrollPos();
              setQuery(e.target.value);
            }}
            key={searchRequest?.query ? "loaded" : "not loaded"}
          />
        </form>

        <SearchPageSelector />

        <div id="search-result" className="search-result">
          <div className="mb-xl">
            <Heading level={2} size="md" className="search-result-header">
              {loading && <span>{t("common|loading")}</span>}
              {!loading &&
                searchResult &&
                (searchResult.count || 0) >= 0 &&
                `${searchResult.count} ${t("pages|search$content-hits")}`}
            </Heading>
          </div>

          {searchResult && (
            <div>
              <ul className="search-result-list space-y-xl">
                {searchResult.hits &&
                  searchResult.hits.map((hit: SearchHit, index: number) => (
                    <li className="max-w-lg" key={index}>
                      <Link
                        href={`${cleanDoubleSlash(hit.url!)}#ref=${
                          window ? window.location.search : ""
                        }`}
                        onClick={() => {
                          saveCurrentScrollPos();
                          trackSearchHitClick(cleanDoubleSlash(hit.url!) || "");
                        }}
                        className="group no-underline"
                      >
                        <Heading
                          level={3}
                          size="sm"
                          className="mb-sm font-normal text-green-600 group-hover:underline "
                          lang={hit.titleLang}
                        >
                          {highlightWords(hit.title)}
                        </Heading>
                      </Link>
                      {hit.description && (
                        <p>{highlightWords(hit.description)}</p>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {searchResult?.count && searchResult.count > PER_PAGE && (
          <div className="pagination">
            <div className="prev-next-page">
              {/* Prev page */}
              <button
                disabled={searchRequest?.page === 1}
                onClick={() => handlePagination("decrement")}
              >
                {t("pages|search$prev-page")}
              </button>

              <span>
                {t("pages|search$page")} {searchRequest?.page ?? 1}{" "}
                {t("common|of")}{" "}
                {searchResult?.count &&
                  Math.ceil(searchResult.count / PER_PAGE)}
              </span>

              {/* Next page */}
              <button
                disabled={
                  (searchRequest?.page ?? 1) >=
                  Math.ceil(searchResult?.count / PER_PAGE)
                }
                onClick={() => handlePagination("increment")}
              >
                {t("pages|search$next-page")}
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
