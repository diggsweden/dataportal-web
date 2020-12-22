import React, { Component, useState } from 'react';
import i18n from '../../i18n';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/client';
import { gql } from 'apollo-boost';
import { Loader } from '../Loader';
import ChopLines from 'chop-lines';
import { slugify } from 'utilities/urlHelpers';
import { Link } from 'react-router-dom';
let moment = require('moment');

export interface ProjectListProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

export const ProjectList: React.FC<ProjectListProps> = (props) => {
  moment.locale(i18n.languages[0]);
  const PROJECTS = gql`
  {
    projects(siteurl:"*", lang:"${i18n.languages[0]}", take:1000, skip:0){
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

  const [bgColor] = useState(['#F0EFEE', '#F4E0CE', '#D6D9D3', '#EBC0B8']);

  const { loading, error, data } = useQuery<{ projects: Array<any> }>(PROJECTS);

  const articleList =
    data && data.projects && data.projects.length > 0 ? data.projects : [];

  return (
    <div className="project">
      {loading && (
        <span className="text-5-bold loading">{i18n.t('common|loading')}</span>
      )}

      {!loading && error && (
        <span className="loading-msg">
          Det finns inga nyheter att visa för tillfället.
        </span>
      )}
      <ul className="project__list">
        {!loading && (
          <li className="project__li project__suggest">
            <div className="project__text">
              <h2 className="text-2">Tipsa oss!</h2>
              <p className="text-5">
                Vet du något spännande som är skapat med data från Sveriges
                dataportal?
              </p>
              <Link
                className="text-5"
                to={`/${i18n.languages[0]}/${i18n.t('routes|projectsubmit|path')}`}
              >
                Skicka in tips!
              </Link>
            </div>
          </li>
        )}

        {!loading &&
          articleList &&
          articleList.length > 0 &&
          articleList.map((n, index) => {
            return (
              <li
                className={`${n.projectColor} project__li`}
                onClick={() => {
                  (window as any).location.href = `/${
                    i18n.languages[0]
                  }/inspiration/${n.id}/${slugify(n.heading)}`;
                }}
                key={index}
                // style={{
                //   borderColor:
                //     bgColor[Math.floor(Math.random() * bgColor.length)],
                // }}
              >
                <div className="project__img">
                  {n.imageUrl && (
                    <img
                      src={`${n.imageUrl}`}
                      alt={n.imageText || 'nyhetsbild'}
                    />
                  )}
                </div>
                <div className="project__text">
                  <Link
                    className="project__title text-4"
                    to={`/${i18n.languages[0]}/inspiration/${n.id}/${slugify(
                      n.heading
                    )}`}
                  >
                    {n.heading}
                  </Link>
                  <ChopLines lines={5} lineHeight={23}>
                    <p
                      className="project__desciption text-5"
                      dangerouslySetInnerHTML={{
                        __html: n.preambleHTML,
                      }}
                    />
                  </ChopLines>
                </div>
              </li>
            );
          })}
        <li className="project__li project__placeholder"></li>
      </ul>
    </div>
  );
};
