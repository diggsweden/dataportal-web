import { Box } from '@digg/design-system';
import React from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { ArticleList } from '../../components/Articles';
import { PageProps } from '../PageProps';
import { StaticBreadcrumb } from 'components/Breadcrumb';

export const ArticleListPage: React.FC<PageProps> = ({ env }) => (
  <>
    <PageMetadata
      seoTitle={`${i18n.t('pages|articles|articles')} - ${i18n.t(
        'common|seo-title'
      )}`}
      seoDescription=""
      seoImageUrl=""
      seoKeywords=""
      robotsFollow={true}
      robotsIndex={true}
      lang={i18n.languages[0]}
      socialMeta={{
        socialDescription: i18n.t('pages|articles|social_meta_description'),
        socialTitle: i18n.t('pages|articles|social_meta_title'),
        socialUrl: `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t(
          'routes|news|path'
        )}`,
      }}
    />

    <StaticBreadcrumb
      env={env}
      staticPaths={[
        {
          path: `/${i18n.languages[0]}/${i18n.t('routes|news|path')}`,
          title: i18n.t('routes|news|title'),
        },
      ]}
    />
    <div className="main-container">
      <h1 className="text-header text-1">
        {i18n.t('pages|articles|articles')}
      </h1>
      <div className="content">
        <ArticleList env={env} />
      </div>
    </div>
  </>
);
