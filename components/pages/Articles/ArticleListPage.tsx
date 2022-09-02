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
import React, { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../..';
import { News_dataportal_Digg_News as News } from '../../../graphql/__generated__/News';
import { initBreadcrumb } from '../../../pages/_app';
import { MainContainerStyle } from '../../../styles/general/emotion';
import { makeBreadcrumbsFromPath, slugify } from '../../../utilities';
import { checkLang } from '../../../utilities/checkLang';

const sortByDate = (a: News, b: News) =>
  (new Date(b.publishedAt) as any) - (new Date(a.publishedAt) as any);

export const ArticleListPage: React.FC<{ newsList: News[] }> = ({ newsList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesNumber, setPageNumber] = useState(0);
  const { t, lang } = useTranslation('pages');
  const { pathname, push, query } = useRouter() || {};
  const { setBreadcrumb } = useContext(SettingsContext);
  const { trackPageView } = useMatomo();

  const articlesPerPage = 10;
  const articlesVisited = articlesNumber * articlesPerPage;
  const displayArticles = newsList
    .sort(sortByDate)
    .slice(articlesVisited, articlesVisited + articlesPerPage);
  const pageCount = Math.ceil(newsList.length / articlesPerPage);

  const changePage = (selected: number) => {
    setPageNumber(selected);
    setCurrentPage(selected);
    push(`?page=${selected}`);
  };

  useEffect(() => {
    setBreadcrumb && setBreadcrumb(makeBreadcrumbsFromPath(pathname, t('articles$articles')));
    return () => {
      setBreadcrumb && setBreadcrumb(initBreadcrumb);
    };
  }, []);

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
        <title>{`${t('articles$articles')} - Sveriges Dataportal`}</title>
        <meta
          property="og:title"
          content={`${t('articles$articles')} - Sveriges Dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${t('articles$articles')} - Sveriges Dataportal`}
        />
      </Head>
      <Heading size="2xl">{t('articles$articles')}</Heading>
      <div className="content">
        <div
          className="news-list"
          id="newsList"
        >
          <ul>
            {newsList.length === 0 && (
              <span className="loading-msg">Det finns inga nyheter att visa för tillfället.</span>
            )}
            {displayArticles.map((n, index) => {
              return (
                <li key={index}>
                  <span className="text-base">{getFormattedDate(n.publishedAt)}</span>
                  <Link
                    locale={lang}
                    href={`/${lang}/${t('routes|news$path')}/${n.id}/${slugify(n.heading || '_')}`}
                    passHref
                  >
                    <a className="text-lg link">{checkLang(n.heading)}</a>
                  </Link>

                  <p className="text-base truncate-2">{checkLang(n.preamble)}</p>
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
            <div className="news-list--pagination">
              <Pagination
                totalResults={newsList.length}
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
