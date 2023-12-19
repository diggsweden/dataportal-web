import { useMatomo } from "@datapunt/matomo-tracker-react";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PublicationDataFragment as Publication } from "../../../graphql/__generated__/operations";
import { ContainerDataFragment as IContainer } from "../../../graphql/__generated__/operations";
import { checkLang } from "../../../utilities";
import { PublicationListResponse } from "../../../utilities";
import NoSsr from "../../NoSsr/NoSsr";
import { CustomImage } from "@/components/Image";
import { PublicationTeaser } from "../PublicationTeaser";
// import { ArticleBlock } from "../../blocks";

const isPublication = (
  article: Publication | IContainer,
): article is Publication => {
  return article?.__typename === "dataportal_Digg_Publication";
};

const sortArticles = (
  a: Publication | IContainer,
  b: Publication | IContainer,
) => {
  if (isPublication(a) && isPublication(b)) {
    return (new Date(b.publishedAt) as any) - (new Date(a.publishedAt) as any);
  } else {
    return (new Date(b.updatedAt) as any) - (new Date(a.updatedAt) as any);
  }
};

export const PublicationList: React.FC<PublicationListResponse> = ({
  publications,
  category,
  domain,
  seo,
  basePath,
  heading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesNumber, setPageNumber] = useState(0);
  const [gridView] = useState(false);
  const { t, lang } = useTranslation();
  const { pathname, push, query } = useRouter() || {};
  const { trackPageView } = useMatomo();
  const { title, description } = seo || {};

  const articlesPerPage = 10;
  const articlesVisited = articlesNumber * articlesPerPage;
  const displayArticles = publications
    .sort(sortArticles)
    .slice(articlesVisited, articlesVisited + articlesPerPage);
  const pageCount = Math.ceil(publications.length / articlesPerPage);
  const metaTitle =
    title ||
    (category
      ? `${category.name} - Sveriges dataportal`
      : `${t("pages|publications$social_meta_title")}`);
  const domainSlug = domain ? `/${domain}` : "";
  const categorySlug = category ? `/${category.slug}` : "";

  const changePage = (selected: number) => {
    setPageNumber(selected);
    setCurrentPage(selected);
    push(`?page=${selected}`);
  };

  //   useEffect(() => {
  //     skipToContent();
  //     startFromTop();
  //   }, [currentPage]);

  useEffect(() => {
    trackPageView({ documentTitle: "Nyheter" });
  }, [pathname]);

  useEffect(() => {
    if (query.page) {
      const newPage = parseInt(query.page as string);
      setPageNumber(newPage - 1);
      setCurrentPage(newPage);
    }
  }, [query]);

  //   const renderGrid = () => {
  //     if (displayArticles.length > articlesPerPage) {
  //       return (
  //         <ArticleBlock
  //           articles={
  //             displayArticles.slice(
  //               articlesPerPage * currentPage - 1,
  //               articlesPerPage * currentPage,
  //             ) as Publication[]
  //           }
  //         />
  //       );
  //     } else {
  //       return <ArticleBlock articles={displayArticles as Publication[]} />;
  //     }
  //   };

  const renderPagination = () => {
    return (
      pageCount > 1 && (
        <div className="article-list--pagination ">
          {/*<Pagination*/}
          {/*  totalResults={articles.length}*/}
          {/*  resultsPerPage={articlesPerPage}*/}
          {/*  currentPage={currentPage}*/}
          {/*  onPageChanged={changePage}*/}
          {/*  nextButtonText="Nästa"*/}
          {/*/>*/}
        </div>
      )
    );
  };

  return (
    <div className="container">
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        <meta name="twitter:title" content={metaTitle} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta name="og:description" content={description} />
            <meta name="twitter:description" content={description} />
          </>
        )}
      </Head>
      <div className="py-xl">
        <h1 className="text-2xl">
          {heading || category?.name || t("pages|publications$title")}
        </h1>
        <ul className="gap-4 grid grid-flow-col gap-xl pt-xl">
          {publications.map((publication) => (
            <li className="md:w-[296px]">
              <PublicationTeaser publication={publication} />
            </li>
          ))}
        </ul>
      </div>
      {/* <div className="content">
        {!gridView ? (
          <div className="article-list" id="articles">
            <ul>
              {articles.length === 0 && (
                <span className="loading-msg">
                  {t("pages|listpage$no-articles")}
                </span>
              )}
              {displayArticles.map((article, index) => {
                const isPub = isPublication(article);
                const { slug, heading, preamble, tags } = article;
                return (
                  <li key={index}>
                    <NoSsr>
                      {isPub && (
                        <span className="publication-top-bar">
                          <span className="text-base">
                            {article.publishedAt}
                          </span>
                          {tags[0]?.value ? (
                            <span className="text-base">{tags[0].value}</span>
                          ) : (
                            <span className="text-base">
                              {t("pages|listpage$fallback-tag")}
                            </span>
                          )}
                        </span>
                      )}
                    </NoSsr>
                    <Link
                      locale={lang}
                      href={
                        isPub
                          ? `${basePath || pathname}${slug}`
                          : `${domainSlug}${categorySlug}${slug}`
                      }
                      passHref
                    >
                      <span className="text-lg link heading-link">
                        {checkLang(heading)}
                      </span>
                    </Link>

                    <p className="text-base truncate-2">
                      {checkLang(preamble)}
                    </p>
                  </li>
                );
              })}
            </ul>
            {/* Show pagination only when there is more than one page */}
      {/* {pageCount > 1 && (
              <div className="currentpage-tracker">
                <span className="text-base">
                  {t("pages|search$page")} {currentPage} {t("common|of")}{" "}
                  {pageCount}
                </span>
              </div>
            )}
            {renderPagination()}
          </div>
        ) : (
          <div className="article-list" id="articles">
            {/* {renderGrid()} */}
      {/* {renderPagination()}
          </div>
        )}
      </div> */}{" "}
    </div>
  );
};
