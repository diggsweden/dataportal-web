import { FC, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { querySearch } from "@/utilities";
import { useRouter } from "next/router";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Head from "next/head";
import Link from "next/link";
import { SearchHitFragment } from "@/graphql/__generated__/operations";
import { getSearchHit } from "@/utilities/searchHelpers";
import { Heading } from "@/components/global/Typography/Heading";
import { Container } from "@/components/layout/Container";
import { SearchPageSelector } from "@/components/content/Search/SearchPageSelector";
import { SearchInput } from "@/components/content/Search/SearchInput";
import { Pagination } from "@/components/global/Pagination";

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
  const pageNumber = parseInt(routerQuery?.p as string) || 1;
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
      pageNumber && pageNumber > 1 ? (pageNumber - 1) * PER_PAGE : 0,
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
    router.query.p = pageNumber.toString();
    router.push(router);
    clearCurrentScrollPos();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pageNumber]);

  const changePage = (page: number) => {
    router.query.p = page.toString();
    router.push(router);
    clearCurrentScrollPos();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
      <Container>
        <Heading level={1} size="lg" className="mb-none">
          {t("common|search-content")}
        </Heading>

        <form
          className="my-lg max-w-md md:my-xl"
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

        <div id="search-result" className="my-lg md:my-xl">
          <div className="mb-lg md:mb-xl">
            <Heading level={2} size="md">
              {loading && <span>{t("common|loading")}</span>}
              {!loading &&
                searchResult &&
                (searchResult.count || 0) >= 0 &&
                `${searchResult.count} ${t("pages|search$content-hits")}`}
            </Heading>
          </div>

          {searchResult && (
            <ul className="search-result-list space-y-lg md:space-y-xl">
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
                        className={`focus--underline focus--outline focus--primary focus--out mb-sm font-normal 
                        text-green-600 group-hover:underline`}
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
          )}
        </div>
        {searchResult?.hits && (
          <Pagination
            totalResults={searchResult?.count || 0}
            itemsPerPage={PER_PAGE}
            pageNumber={pageNumber}
            changePage={changePage}
          />
        )}
      </Container>
    </div>
  );
};
