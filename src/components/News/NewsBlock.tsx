import React, { Component, useState } from 'react';
import i18n from '../../i18n';
import { TopImage } from 'assets/TopImage';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import ChopLines from 'chop-lines';
import { slugify } from 'utilities/urlHelpers';
let moment = require('moment');

export interface NewsBlockProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

const lang = 'sv';

const NEWS = gql`
  {
    othernews:
      news(siteurl:"*", lang:"${lang}", take:3, skip:0, skiptags:["sticky"]){
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

export const NewsBlock: React.FC<NewsBlockProps> = () => {
  const { loading, error, data } = useQuery<{
    othernews: Array<any>;
  }>(NEWS);

  // const stickyNews =
  //   data && data.stickynews && data.stickynews.length > 0
  //     ? data.stickynews
  //     : [];

  const newsList =
    data && data.othernews && data.othernews.length > 0 ? data.othernews : [];

  // if (stickyNews.length == 0 && newsList.length == 0) {
  //   return <></>;
  // }

  if(newsList && newsList.length > 0) {
    return (
      <div>
        <h2 className="text-3">Nyheter</h2>
        <div className="news-compact">
          <div className="news-list-compact">
            <ul>
              {loading && <span className="text-5 loading">{i18n.t('common|loading')}</span>}
              {!loading && error && (
                <li>Det finns inga nyheter att visa för tillfället.</li>
              )}
              {!loading &&
                newsList &&
                newsList.length > 0 &&
                newsList.map((n, index) => {
                  return (


                    <li key={index}
                    onClick={() => {
                      (window as any).location.href = `/${i18n.languages[0]}/nyheter/${
                        n.id
                      }/${slugify(n.heading)}`;
                    }}
                    >


                      <div className="news-img">
                        {n.imageUrl && <img src={`${n.imageUrl}?width=500`} alt={n.heading || 'nyhetsbild'} />}
                      </div>

                      
                      <div className="news-text">
                        <span className="text-6">
                          {moment(n.published.toString()).format('D MMM YYYY')}
                        </span>

                        <h3>
                          <a
                            className="text-4"
                            href={`/${i18n.languages[0]}/nyheter/${
                              n.id
                            }/${slugify(n.heading)}`}
                          >
                            {n.heading}
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
              Visa alla nyheter
            </a>
          </div>
        </div>
      </div>
    );
  }
  else{
    return <></>
  }
};

