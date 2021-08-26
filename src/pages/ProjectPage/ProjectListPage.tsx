import React from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { ProjectList } from '../../components/Projects';
import { PageProps } from '../PageProps';
import { TopImageInspo } from 'assets/TopImageInspo';
import { StaticBreadcrumb } from 'components/Breadcrumb';


export const ProjectListPage: React.FC<PageProps> = ({ env }) =>
  <div className="projectlistpage">
    <PageMetadata
      seoTitle="Inspiration - Sveriges dataportal"
      seoDescription=""
      seoImageUrl=""
      seoKeywords=""
      robotsFollow={true}
      robotsIndex={true}
      lang={i18n.languages[0]}
    // canonicalUrl={`${this.props.env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t('routes|projects|path')}/`}

    />
    <StaticBreadcrumb env={env} staticPaths={[
      {
        path: `/${i18n.languages[0]}/${i18n.t('routes|projects|path')}`,
        title: i18n.t('routes|projects|title')
      }
    ]} />
    <div className="projectlistpage__img">
      <TopImageInspo></TopImageInspo>
    </div>
    <div className="main-container">
      <div className="content">
        <h1 className="text-header text-1">
          Inspiration
        </h1>
        <p className="text-5">
          Här har vi samlat konkreta exempel på hur data från
          Sveriges dataportal används i praktiken. Vi hoppas att
          du blir inspirerad att bidra du också!
        </p>
      </div>
      <ProjectList env={env} />
    </div>
  </div>
