import { useMatomo } from '@datapunt/matomo-tracker-react';
import {
  getFormattedDate,
  Container,
  Heading,
  skipToContent,
  startFromTop,
  Pagination,
} from '@digg/design-system';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Publication_dataportal_Digg_Publications as Publication } from '../../../graphql/__generated__/Publication';
import { Containers_dataportal_Digg_Containers as IContainer } from '../../../graphql/__generated__/Containers';
import { MainContainerStyle } from '../../../styles/general/emotion';
import { checkLang } from '../../../utilities/checkLang';
import { PublicationListResponse } from '../../../utilities';
import NoSsr from '../../NoSsr/NoSsr';

const isPublication = (article: Publication | IContainer): article is Publication => {
  return article?.__typename === 'dataportal_Digg_Publication' ? true : false;
};

const sortArticles = (a: Publication | IContainer, b: Publication | IContainer) => {
  if (isPublication(a) && isPublication(b)) {
    return (new Date(b.publishedAt) as any) - (new Date(a.publishedAt) as any);
  } else {
    return (new Date(b.updatedAt) as any) - (new Date(a.updatedAt) as any);
  }
};

export const ArticleListPage: React.FC<PublicationListResponse> = ({
  articles,
  category,
  domain,
  seo,
  basePath,
  heading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesNumber, setPageNumber] = useState(0);
  const { t, lang } = useTranslation();
  const { pathname, push, query } = useRouter() || {};
  const { trackPageView } = useMatomo();
  const { title, description } = seo || {};

  const articlesPerPage = 10;
  const articlesVisited = articlesNumber * articlesPerPage;
  const displayarticles = articles
    .sort(sortArticles)
    .slice(articlesVisited, articlesVisited + articlesPerPage);
  const pageCount = Math.ceil(articles.length / articlesPerPage);
  const metaTitle =
    title ||
    (category
      ? `${category.name} - Sveriges dataportal`
      : `${t('pages|publications$social_meta_title')}`);
  const domainSlug = domain ? `/${domain}` : '';
  const categorySlug = category ? `/${category.slug}` : '';

  const changePage = (selected: number) => {
    setPageNumber(selected);
    setCurrentPage(selected);
    push(`?page=${selected}`);
  };

  useEffect(() => {
    skipToContent();
    startFromTop();
  }, [currentPage]);

  useEffect(() => {
    trackPageView({ documentTitle: 'Nyheter' });
  }, [pathname]);

  useEffect(() => {
    if (query.page) {
      const newPage = parseInt(query.page as string);
      setPageNumber(newPage - 1);
      setCurrentPage(newPage);
    }
  }, [query]);

  return (
    <Container cssProp={MainContainerStyle}>
      <Head>
        <title>{metaTitle}</title>
        <meta
          property="og:title"
          content={metaTitle}
        />
        <meta
          name="twitter:title"
          content={metaTitle}
        />
        {description && (
          <>
            <meta
              name="description"
              content={description}
            />
            <meta
              name="og:description"
              content={description}
            />
            <meta
              name="twitter:description"
              content={description}
            />
          </>
        )}
      </Head>
      <Heading
        size="3xl"
        weight="light"
        color="pinkPop"
      >
        {heading || category?.name || t('pages|publications$title')}
      </Heading>
      <div className="content">
        <div
          className="article-list"
          id="articles"
        >
          <ul>
            {articles.length === 0 && (
              <span className="loading-msg">{t('pages|listpage$no-articles')}</span>
            )}
            {displayarticles.map((article, index) => {
              const isPub = isPublication(article);
              const { slug, heading, preamble } = article;
              return (
                <li key={index}>
                  <NoSsr>
                    {isPub && (
                      <span className="text-base">{getFormattedDate(article.publishedAt)}</span>
                    )}
                  </NoSsr>
                  <Link
                    locale={lang}
                    href={
                      isPub
                        ? `${basePath || '/' + t('routes|publications$path')}${slug}`
                        : `${domainSlug}${categorySlug}${slug}`
                    }
                    className="text-lg link heading-link"
                  >
                    <Heading
                      level={2}
                    >
                      <a className="text-lg link heading-link">{checkLang(heading)}</a>
                    </Heading>
                  </Link>

                  <p className="text-base truncate-2">{checkLang(preamble)}</p>
                </li>
              );
            })}
          </ul>
          {/* Show pagination only when there is more than one page */}
          {pageCount > 1 && (
            <div className="currentpage-tracker">
              <span className="text-base">
                {t('pages|search$page')} {currentPage} {t('common|of')} {pageCount}
              </span>
            </div>
          )}
          {pageCount > 1 && (
            <div className="article-list--pagination ">
              <Pagination
                totalResults={articles.length}
                resultsPerPage={articlesPerPage}
                currentPage={currentPage}
                onPageChanged={changePage}
                nextButtonText="Nästa"
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};