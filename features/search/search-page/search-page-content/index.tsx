import { FC, useContext, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { linkBase, querySearch } from "@/utilities";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { SearchHitFragment } from "@/graphql/__generated__/operations";
import { getSearchHit } from "@/utilities/search-helpers";
import { Heading } from "@/components/typography/heading";
import { Container } from "@/components/layout/container";
import { SearchPageSelector } from "@/features/search/search-page-selector";
import { SearchInput } from "@/features/search/search-input";
import { Pagination } from "@/components/pagination";
import { SettingsContext } from "@/providers/settings-provider";

interface SearchProps {
  activeLink?: string;
}

export const SearchPageContent: FC<SearchProps> = () => {
  const router = useRouter() || {};
  const { setBreadcrumb } = useContext(SettingsContext);
  const { pathname, query: routerQuery } = router || {};
  const { t, lang } = useTranslation("common");
  const [query, setQuery] = useState((routerQuery?.q as string) || "");
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
    count > 0 && posY && posY != "0" && window.scrollTo(0, parseInt(posY, 10));
  });

  useEffect(() => {
    router.push({ query: { ...router.query, p: router.query.p } });
    clearCurrentScrollPos();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pageNumber]);

  const changePage = (page: number) => {
    router.push({ query: { ...router.query, p: page } });
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
    setBreadcrumb &&
      setBreadcrumb({
        name: t("common|search-content"),
        crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
      });
  }, [pathname]);

  useEffect(() => {
    if (!routerQuery.p) {
      router.push({ query: { ...router.query, p: 1 } });
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
    router.push({ query: { ...router.query, q: newQuery, p: 1 } });
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
          role={"search"}
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
            ariaLabel={t("pages|content$search")}
          />
        </form>

        <SearchPageSelector query={query} />
      </Container>

      <div className="bg-white">
        <Container>
          <div id="search-result" className="my-lg py-xl md:my-xl">
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
                    <li className="group relative max-w-lg" key={index}>
                      <Link
                        href={`${cleanDoubleSlash(hit.url!)}#ref=${
                          window ? window.location.search : ""
                        }`}
                        onClick={() => {
                          saveCurrentScrollPos();
                        }}
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
    </div>
  );
};
