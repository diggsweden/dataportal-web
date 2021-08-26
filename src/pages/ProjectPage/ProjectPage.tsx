import React from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { ProjectItem } from '../../components/Projects'
import { PageProps } from '../PageProps'

export const ProjectPage: React.FC<PageProps> = ({ env, match }) =>
  <div className="project__page">
    <PageMetadata
      seoTitle="Projekt - Sveriges dataportal"
      seoDescription=""
      seoImageUrl=""
      seoKeywords=""
      robotsFollow={true}
      robotsIndex={true}
      lang={i18n.languages[0]}
    />
    <ProjectItem env={env} id={match.params.nid} />
  </div>
