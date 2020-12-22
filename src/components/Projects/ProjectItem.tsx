import React, { Component } from 'react';
import i18n from '../../i18n';
import { Box } from '@digg/design-system';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/client';
import { gql } from 'apollo-boost';
let moment = require('moment');
import { decode } from 'qss';
import { Helmet } from 'react-helmet';
import { StaticBreadcrumb } from 'components/Breadcrumb';
import { slugify } from 'utilities/urlHelpers';

export interface ProjectItemProps {
  children?: React.ReactNode;
  env: EnvSettings;
  id: string;
}

const hasWindow = typeof window !== 'undefined';

const MainContent = Box.withComponent('main');

export const ProjectItem: React.FC<ProjectItemProps> = (props) => {
  moment.locale(i18n.languages[0]);
  let id = '0';

  //check if id is sent in via QueryString
  if (hasWindow) {
    var qs = decode(window.location.search.substring(1)) as any;
    id = qs.id && qs.id.toString().length > 0 ? qs.id.toString() : '0';
  }

  //id via route is always preffered
  if (props.id) id = props.id;

  const PROJECTS = gql`
  {
    projects(siteurl:"*", lang:"${i18n.languages[0]}",id:"${id}"){
      id        
      heading
      preambleHTML
      published
      modified      
      bodyHTML
      bannerImageUrl
      bannerImageText
      imageUrl
      imageText
      projectColor
    }
  }
`;
  const { loading, error, data } = useQuery<{ projects: Array<any> }>(PROJECTS);

  const projectItem =
    data && data.projects && data.projects.length > 0 ? data.projects[0] : null;

  return (
    <MainContent flex="1 1 auto">     
      {!loading && projectItem && id && id != '0' ? (
        <>
         <StaticBreadcrumb env={props.env} staticPaths={[
            {
              path: `/${i18n.languages[0]}/${i18n.t('routes|projects|path')}`,
              title: i18n.t('routes|projects|title')
            },
            {
              path: `/${i18n.languages[0]}/${i18n.t(
                'routes|projects|path'
                )}/${projectItem.id}/${slugify(projectItem.heading)}`,
              title: projectItem.heading
            }
          ]} />
          <Helmet>
            <title>
              {projectItem.heading} - {i18n.t('common|seo-title')}
            </title>
          </Helmet>

          <div className={projectItem.projectColor}>
            <div className="project__topimage">
              {projectItem && projectItem.bannerImageUrl && (
                <img src={`${projectItem.bannerImageUrl}`} alt={`${projectItem.bannerImageText}`} />
              )}
            </div>
            <div className={projectItem.projectColor}>
              <div className="project__banner">
                <div className="main-container">
                  <h1 className="text-1">{projectItem.heading}</h1>                  
                  <p
                  className="preamble text-4"
                    dangerouslySetInnerHTML={{
                    __html: projectItem.preambleHTML,
                  }}
                />
                  {/* Theme */}
                  {/* <p className="preamble text-4">{projectItem.projectColor}</p> */}
                </div>
              </div>
            </div>

            <div className="main-container">
              <div className="project__editor news-article content">
                {loading && (
                  <span className="text-5 loading">
                    {i18n.t('common|loading')}
                  </span>
                )}

                <div
                  className="project__editor--p main-text text-5"
                  dangerouslySetInnerHTML={{
                    __html: projectItem.bodyHTML,
                  }}
                />

                <span className="text-5-bold">Publicerad:</span>
                <span className="text-5">
                  {moment(projectItem.published.toString()).format(
                    'D MMM YYYY'
                  )}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        !loading && (
          <>
            <h1 className="text-1">Projektet finns inte längre kvar.</h1>
          </>
        )
      )}
    </MainContent>
  );
};
