import React, { Component, useEffect, useState } from 'react';
import i18n from '../../i18n';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/client';
import { gql } from 'apollo-boost';
import { slugify } from 'utilities/urlHelpers';
import { Link } from 'react-router-dom';
import Truncate from 'react-truncate';
import ReactPaginate from 'react-paginate'
let moment = require('moment');

export interface ArticleListProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

export const ArticleList: React.FC<ArticleListProps> = ({ env }) => {
  moment.locale(i18n.languages[0]);
  const NEWS = gql`
  {
    news(siteurl:"${env.CONTENTBACKEND_SITEURL}", lang:"${i18n.languages[0]}", take:50, skip:0, orderby:"startpublish desc"){
      id        
      heading
      preambleHTML
      published
      modified            
    }
  }
`;

  const { loading, error, data } = useQuery<{ news: Array<any> }>(NEWS);
  const [articleList, setArticleList] = useState<any[]>([]);

  useEffect(() => {
    if (data?.news && data.news.length > 0) {
      setArticleList(data.news);
    }
  }, [!loading && data]);

  const [articlesNumber, setPageNumber] = useState(0);
  const articlesPerPage = 10;
  const articlesVisited = articlesNumber * articlesPerPage;
  const [currentPage, setCurrentPage] = useState(1);

  const displayArticles = articleList
    .slice(articlesVisited, articlesVisited + articlesPerPage);

  const pageCount = Math.ceil(articleList.length / articlesPerPage);

  const newsFocus = () => {
    let content = document.querySelector('#newsList');
    if (!content) return;
  
    const focusable = content.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  
    const first = focusable[0];
  
    if (first) {
      first.focus();
    }
  };

  const changePage = ({ selected }: { selected: any }) => {
    let currentPage = selected + 1;
    setPageNumber(selected);
    setCurrentPage(selected + 1);
  };

  return (
    <div className="news-list" id='newsList'>
      <ul>
        {loading && (
          <span className="text-5 loading">{i18n.t('common|loading')}</span>
        )}
        {!loading && error && (
          <span className="loading-msg">
            Det finns inga nyheter att visa för tillfället.
          </span>
        )}
        {!loading &&
          displayArticles.map((n, index) => {
            return (
              <li key={index}>
                <span className="text-6">
                  {moment(n.published.toString()).format('D MMM YYYY')}
                </span>
                <Link
                  className="text-4"
                  onClick={() => console.log('hello')}
                  to={`/${i18n.languages[0]}/${i18n.t('routes|news|path')}/${n.id
                    }/${slugify(n.heading)}`}
                >
                  {n.heading}
                </Link>

                <p className="text-6">
                  <Truncate lines={2}>{n.preambleHTML}</Truncate>
                </p>
              </li>
            );
          })}
      </ul>
      {/* Show pagination only when there is more than one page */}
      {(pageCount > 1) && (
        <div className='currentpage-tracker'>
          <span className='text-6'>
          {i18n.t('pages|search|page')} {currentPage} {i18n.t('common|of')} {pageCount}
          </span>
        </div>
      )}
      {(pageCount > 1) && (
        <ReactPaginate
          previousLabel="Föregående"
          nextLabel="Nästa"
          onClick={newsFocus}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName="pagination-wrapper"
          previousLinkClassName="pagination-prev_btn default-button"
          previousAriaLabel="Föregående sida"
          nextLinkClassName="pagination-nex_btn default-button"
          nextAriaLabel="Nästa sida"
        />
      )}
    </div>
  );
};
