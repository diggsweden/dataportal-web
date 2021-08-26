import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import { RouterContext } from '../../../shared/RouterContext';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { StatisticGraphNumbers } from '../../components/StatisticGraphNumbers';
import { Statistic } from '../../components/Statistic';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { StatisticNumbersDatasets } from 'components/StatisticNumbers';
import { StaticBreadcrumb } from 'components/Breadcrumb';

export interface PageProps extends RouteComponentProps<any, RouterContext> {
  env: EnvSettings;
}

export const StatisticPage: React.FC<PageProps> = ({ env }) =>
  <>
    <PageMetadata
      seoTitle={i18n.t('pages|statistic|statistic-page-seotitle')}
      seoDescription=""
      seoImageUrl=""
      seoKeywords=""
      robotsFollow={true}
      robotsIndex={true}
      lang={i18n.languages[0]}
      canonicalUrl={`${env.CANONICAL_URL}/${i18n.languages[0]
        }/${i18n.t('routes|statistics|path')}`}
      socialMeta={{
        socialDescription: i18n.t(
          'pages|statistic|social_meta_description'
        ),
        socialTitle: i18n.t('pages|statistic|social_meta_title'),
        socialUrl: `${env.CANONICAL_URL}/${i18n.languages[0]
          }/${i18n.t('routes|statistics|path')}`,
      }}
    />

    <StaticBreadcrumb
      env={env}
      staticPaths={[
        {
          path: `/${i18n.languages[0]}/${i18n.t(
            'routes|statistics|path'
          )}`,
          title: i18n.t('routes|statistics|title'),
        },
      ]}
    />
    <div className="main-container">
      <h1 className="text-header text-1">
        {i18n.t('pages|statistic|statistic-page-header')}{' '}
      </h1>
      <div className="content statistic-page">
        <p className="main-text text-5">
          {i18n.t('pages|statistic|statistic-page-text')}
        </p>
        <StatisticGraphNumbers env={env} />
        <p className="main-text text-5">
          {i18n.t(
            'pages|statistic|statistic-page-numberofdatasets'
          )}{' '}
          <StatisticNumbersDatasets env={env} />
        </p>
        <Statistic env={env} />
      </div>
    </div>
  </>
