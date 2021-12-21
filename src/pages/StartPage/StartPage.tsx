import { Box } from '@digg/design-system';
import React from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { Statistic } from '../../components/Statistic';
import { PageProps } from 'pages/PageProps';
import { StatisticNumbers } from '../../components/StatisticNumbers';
import { StatisticGraph } from '../../components/StatisticGraph';

import {
  CategoriesNav,
  Highlight,
  SearchBlock,
  DevportalBlock,
} from '../../components/StartPageComponents';
import { ArticleBlock } from 'components/Articles';

export const StartPage: React.FC<PageProps> = ({ env }) => {
  return (
    <>
      <PageMetadata
        seoTitle={i18n.t('pages|startpage|seo_title')}
        seoDescription={i18n.t('pages|startpage|seo_description')}
        seoImageUrl=""
        seoKeywords=""
        robotsFollow={true}
        robotsIndex={true}
        lang={i18n.languages[0]}
        canonicalUrl={`${env.CANONICAL_URL}/${i18n.languages[0]}/`}
        socialMeta={{
          socialDescription: i18n.t('pages|startpage|social_meta_description'),
          socialTitle: i18n.t('pages|startpage|social_meta_title'),
          socialUrl: `${env.CANONICAL_URL}/${i18n.languages[0]}/`,
        }}
      />
      <SearchBlock env={env} />
      <Highlight env={env} />
      <ArticleBlock env={env} />
      <DevportalBlock env={env} />
      <CategoriesNav env={env} />

      <div className="statistic">
        <div className="statistic-header">
          <h2 className="text-3">
            {' '}
            {i18n.t('pages|statistic|statistic-numbers')}
          </h2>
        </div>

        <div className="statistic-wrapper">
          <StatisticGraph env={env} />
          <StatisticNumbers env={env} />
        </div>
        <Statistic env={env} />
      </div>
    </>
  );
};
