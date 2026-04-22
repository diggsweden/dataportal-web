import Head from "next/head";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { FC, useContext, useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { Pagination } from "@/components/pagination";
import { Heading } from "@/components/typography/heading";
import { SearchInput } from "@/features/search/search-input";
import { SearchPageSelector } from "@/features/search/search-page-selector";
import { getSearchHit } from "@/features/search/utils/search-helpers";
import { SearchHitFragment } from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";
import { SearchHit, SearchRequest, SearchResult } from "@/types/search";
import { linkBase, querySearch } from "@/utilities";
import {
  clearCurrentScrollPos,
  saveCurrentScrollPos,
} from "@/utilities/scroll-helper";

interface SearchProps {
  activeLink?: string;
}

export const SearchPageContent: FC<SearchProps> = () => {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const { setBreadcrumb } = useContext(SettingsContext);
  const t = useTranslations();
  const lang = useLocale();
  const [query, setQuery] = useState(searchParams?.get("q") || "");
  const pageNumber = parseInt(searchParams?.get("p") || "1") || 1;

  // Helper to build search URL with updated params
  const buildSearchUrl = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    return `${pathname}?${params.toString()}`;
  };
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [searchRequest, setSearchRequest] = useState<SearchRequest>({
    page: parseInt(searchParams?.get("p") || "1"),
    query: (searchParams?.get("q") as string) || "",
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const highlightWords = (text: string) => {
    if (!text) return;

    const highlightedText = text.split("**").map((text, index) => {
      if (index % 2 === 1) {
        return `<strong>${text}</strong>`;
      } else {
        return text;
      }
    });

    return (
      <span dangerouslySetInnerHTML={{ __html: highlightedText.join("") }} />
    );
  };

  useEffect(() => {
    const count = searchResult?.count || -1;
    if (count > 0 && posY && posY !== "0") {
      window.scrollTo(0, parseInt(posY, 10));
    }
  });

  useEffect(() => {
    router.push(buildSearchUrl({ p: searchParams?.get("p") || "1" }));
    clearCurrentScrollPos();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pageNumber]);

  const changePage = (page: number) => {
    router.push(buildSearchUrl({ p: page }));
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
    setBreadcrumb?.({
      name: t("common.search-content"),
      crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
    });
  }, [pathname]);

  useEffect(() => {
    if (!searchParams?.get("p")) {
      router.push(buildSearchUrl({ p: 1 }));
    }
    const q = searchParams?.get("q") || "";
    setQuery(q);
    setSearchRequest({
      ...searchRequest,
      page: parseInt(searchParams?.get("p") || "1"),
      query: q,
    });
  }, [searchParams]);

  const submitSearch = (newQuery: string) => {
    router.push(buildSearchUrl({ q: newQuery, p: 1 }));
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
        <title>{`${t("common.search")} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${t("common.search")} - Sveriges dataportal`}
          key="og:title"
        />
        <meta
          name="twitter:title"
          content={`${t("common.search")} - Sveriges dataportal`}
          key="twitter:title"
        />
      </Head>
      <Container>
        <Heading level={1} size="lg" className="mb-none">
          {t("common.search-content")}
        </Heading>

        <form
          className="my-lg max-w-md md:my-xl"
          onSubmit={(event) => {
            clearCurrentScrollPos();
            event.preventDefault();
            submitSearch(query);
          }}
          role={"search"}
        >
          <SearchInput
            autoFocus
            id="search-field"
            placeholder={t("pages.content.search")}
            isLoading={loading}
            query={query}
            setQuery={setQuery}
            submitSearch={submitSearch}
            onChange={(e) => {
              clearCurrentScrollPos();
              setQuery(e.target.value);
            }}
            key={searchRequest?.query ? "loaded" : "not loaded"}
            ariaLabel={t("pages.content.search")}
          />
        </form>

        <SearchPageSelector query={query} />
      </Container>

      <div className="mt-xl bg-white py-xl">
        <Container>
          <div id="search-result" className="my-lg">
            <div className="mb-lg md:mb-xl">
              <Heading level={2} size="md">
                {loading && <span>{t("common.loading")}</span>}
                {!loading &&
                  searchResult &&
                  (searchResult.count || 0) >= 0 &&
                  `${searchResult.count} ${t("pages.search.content-hits")}`}
              </Heading>
            </div>

            {searchResult && (
              <ul
                data-test-id="search-result-list"
                className="space-y-lg md:space-y-xl"
              >
                {searchResult.hits &&
                  searchResult.hits.map((hit: SearchHit, index: number) => (
                    <li className="group relative max-w-lg" key={index}>
                      <Link
                        href={`${cleanDoubleSlash(hit.url!)}#ref=${
                          window ? window.location.search : ""
                        }`}
                        onClick={() => {
                          saveCurrentScrollPos();
                        }}
                        data-tracking-name="search-hit"
                        className="before:focus--outline before:focus--out before:focus--primary focus--none no-underline before:absolute before:inset-none"
                      >
                        <Heading
                          level={3}
                          size="sm"
                          className={`mb-sm font-normal text-green-600 group-focus-within:underline group-hover:underline`}
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
            {searchResult?.hits && (
              <Pagination
                totalResults={searchResult?.count || 0}
                itemsPerPage={PER_PAGE}
                pageNumber={pageNumber}
                changePage={changePage}
              />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};
