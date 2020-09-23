import React, { Component, useState } from 'react';
import i18n from '../../i18n';
import { TopImage } from 'assets/TopImage';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Loader } from '../Loader';
import ChopLines from 'chop-lines';
import { slugify } from 'utilities/urlHelpers';
let moment = require('moment');

export interface ArticleListProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

export const ArticleList: React.FC<ArticleListProps> = (props) => {
  moment.locale(i18n.languages[0]);
  const NEWS = gql`
  {
    news(siteurl:"*", lang:"${i18n.languages[0]}", take:5, skip:0){
      id        
      heading
      preamble
      published
      modified
      tags
      body 
    }
  }
`;

  // const [bgColor] =
  //   useState(
  //     ['#F0EFEE',
  //     '#F4E0CE',
  //     '#D6D9D3',
  //     "#EBC0B8"
  //     ]);

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
                <a
                  className="text-4"
                  href={`/${i18n.languages[0]}/${i18n.t(
                    'pages|articles|articles'
                  )}/${n.id}/${slugify(n.heading)}`}
                >
                  {n.heading}
                </a>
                <ChopLines lines={2} lineHeight={27}>
                  <p
                    className="text-5"
                    dangerouslySetInnerHTML={{
                      __html: n.preamble,
                    }}
                  />
                </ChopLines>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
