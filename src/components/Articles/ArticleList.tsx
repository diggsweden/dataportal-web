import React, { Component, useState } from 'react';
import i18n from '../../i18n';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/client';
import { gql } from 'apollo-boost';
import { Loader } from '../Loader';
import ChopLines from 'chop-lines';
import { slugify } from 'utilities/urlHelpers';
import { Link } from 'react-router-dom';
import Truncate from 'react-truncate';
let moment = require('moment');

export interface ArticleListProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

export const ArticleList: React.FC<ArticleListProps> = (props) => {
  moment.locale(i18n.languages[0]);
  const NEWS = gql`
  {
    news(siteurl:"${props.env.CONTENTBACKEND_SITEURL}", lang:"${i18n.languages[0]}", take:50, skip:0, orderby:"startpublish desc"){
      id        
      heading
      preambleHTML
      published
      modified            
    }
  }
`;

  const { loading, error, data } = useQuery<{ news: Array<any> }>(NEWS);

  const articleList =
    data && data.news && data.news.length > 0 ? data.news : [];

  return (
    <div className="news-list">
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
          articleList &&
          articleList.length > 0 &&
          articleList.map((n, index) => {
            return (
              <li
                // onClick={() => {
                //   (window as any).location.href = `/${
                //     i18n.languages[0]
                //   }/artiklar/${n.id}/${slugify(n.heading)}`;
                // }}
                key={index}
              >
                <span className="text-6">
                  {moment(n.published.toString()).format('D MMM YYYY')}
                </span>
                <Link
                  className="text-4"
                  to={`/${i18n.languages[0]}/${i18n.t('routes|news|path')}/${
                    n.id
                  }/${slugify(n.heading)}`}
                >
                  {n.heading}
                </Link>

                <p className="text-5">
                  <Truncate lines={2}>{n.preambleHTML}</Truncate>
                </p>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
