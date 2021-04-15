import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import i18n from '../../i18n';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useLazyQuery, useQuery } from '@apollo/client';
import { gql } from 'apollo-boost';
import { slugify } from 'utilities/urlHelpers';
import { Link } from 'react-router-dom';
let moment = require('moment');
import Truncate from 'react-truncate';
export interface ArticleBlockProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

const NEWS = gql`
  query news($siteurl: String!, $lang: String!) {
    news(
      siteurl: $siteurl
      lang: $lang
      take: 3
      skip: 0
      orderby: "startpublish desc"
    ) {
      id
      heading
      preambleHTML
      published
      modified
      imageUrl
    }
  }
`;

/**
 * Block for rendering newslist-items, in blockformat. Will only render in browser, no SSR.
 * @param props route props
 */
export const ArticleBlock: React.FC<ArticleBlockProps> = (props) => {
  const { loading, error, data } = useQuery<{
    news: Array<any>;
  }>(NEWS, {
    variables: {
      siteurl: props.env.CONTENTBACKEND_SITEURL,
      lang: i18n.languages[0],
    },
    ssr: true,
  });

  const history = useHistory();

  function handleClick(id: any, heading: any) {
    history.push(
      `/${i18n.languages[0]}/${i18n.t('routes|news|path')}/${id}/${slugify(
        heading
      )}`
    );
  }

  const articleList =
    data && data.news && data.news.length > 0 ? data.news : [];

  if (!loading && articleList && articleList.length > 0) {
    return (
      <div className="main-container">
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
                      onClick={() => handleClick(n.id, n.heading)}
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
                          <Link
                            className="text-4"
                            to={`/${i18n.languages[0]}/${i18n.t(
                              'routes|news|path'
                            )}/${n.id}/${slugify(n.heading)}`}
                          >
                            {n.heading}
                          </Link>
                        </h3>
                        <p className="text-5">
                        <Truncate lines={3}>
                          {n.preambleHTML}
                        </Truncate>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
            <Link
              to={`/${i18n.languages[0]}/${i18n.t('routes|news|path')}`}
              className="text-5"
            >
              {i18n.t('pages|articles|view-all')}
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return <div className="main-container"></div>;
  }
};
