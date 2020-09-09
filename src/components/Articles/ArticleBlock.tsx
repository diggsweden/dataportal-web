import React, { Component, useState } from 'react';
import i18n from '../../i18n';
import { TopImage } from 'assets/TopImage';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import ChopLines from 'chop-lines';
import { slugify } from 'utilities/urlHelpers';
let moment = require('moment');

export interface ArticleBlockProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

const lang = 'sv';

const NEWS = gql`
  {
    othernews:
      news(siteurl:"*", lang:"${i18n.languages[0]}", take:3, skip:0, skiptags:["sticky"]){
        id        
        heading
        preamble
        published
        modified
        tags
        body
        imageUrl
      }          
  }
`;

export const ArticleBlock: React.FC<ArticleBlockProps> = () => {
  const { loading, error, data } = useQuery<{
    othernews: Array<any>;
  }>(NEWS);

  // const stickyNews =
  //   data && data.stickynews && data.stickynews.length > 0
  //     ? data.stickynews
  //     : [];

  const articleList =
    data && data.othernews && data.othernews.length > 0 ? data.othernews : [];

  // if (stickyNews.length == 0 && newsList.length == 0) {
  //   return <></>;
  // }

  if (articleList && articleList.length > 0) {
    return (
      <div>
        <h2 className="text-3">{i18n.t('pages|articles|articles')}</h2>
        <div className="news-compact">
          <div className="news-list-compact">
            <ul>
              {loading && (
                <span className="text-5 loading">
                  {i18n.t('common|loading')}
                </span>
              )}
              {!loading && error && (
                <li>Det finns inga nyheter att visa för tillfället.</li>
              )}
              {!loading &&
                articleList &&
                articleList.length > 0 &&
                articleList.map((n, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        (window as any).location.href = `/${
                          i18n.languages[0]
                        }/${i18n.t('routes|news|path')}/${n.id}/${slugify(
                          n.heading
                        )}`;
                      }}
                    >
                      <div className="news-img">
                        {n.imageUrl && (
                          <img
                            src={`${n.imageUrl}?width=500`}
                            alt={n.heading || 'nyhetsbild'}
                          />
                        )}
                      </div>

                      <div className="news-text">
                        <span className="text-6">
                          {moment(n.published.toString()).format('D MMM YYYY')}
                        </span>

                        <h3>
                          <a
                            className="text-4"
                            href={`/${i18n.languages[0]}/${i18n.t('routes|news|path')}/${n.id}/${slugify(n.heading)}`}>{n.heading}



                          </a>
                        </h3>

                        <ChopLines lines={3} lineHeight={27}>
                          <p
                            className="text-5"
                            dangerouslySetInnerHTML={{
                              __html: n.preamble,
                            }}
                          />
                        </ChopLines>
                      </div>
                    </li>
                  );
                })}
            </ul>
            <a
              href={`/${i18n.languages[0]}/${i18n.t('routes|news|path')}`}
              className="text-5"
            >
              {i18n.t('pages|articles|view-all')}
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
