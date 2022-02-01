import React from 'react';
import i18n from 'i18next';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/client';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
let moment = require('moment');

export interface BreadcrumbProps {
  connectedtagpath: string;
  env: EnvSettings;
}
const hasWindow = typeof window !== 'undefined';

const breadcrumbQuery = gql`
  query breadcrumbs($siteurl: String!, $paths: [String], $lang: String) {
    tags(siteurl: $siteurl, connectedtagpathsor: $paths, lang: $lang) {
      connectedTagPath
      title
    }
  }
`;

export const Breadcrumb: React.FC<BreadcrumbProps> = (props) => {
  moment.locale(i18n.languages[0]);

  let connectedtagpath = '';

  if (props.connectedtagpath) {
    connectedtagpath = props.connectedtagpath;
  }

  let pathsplitted: string[] = connectedtagpath
    ? connectedtagpath.split('/')
    : [];
  pathsplitted = pathsplitted.filter(function (x) {
    return x != '';
  });
  var copy = [...pathsplitted];
  let path: string[] = [];

  pathsplitted.forEach((element) => {
    path.push(`/${copy.join('/')}/`);
    copy.pop();
  });

  const { loading, error, data } = useQuery<{ tags: Array<any> }>(
    breadcrumbQuery,
    {
      variables: {
        paths: path,
        lang: i18n.languages[0] ?? 'sv',
        siteurl: props.env.CONTENTBACKEND_SITEURL,
      },
    }
  );

  const breadcrumb =
    !loading && data && data.tags
      ? //sort the paths by most number of "/"
        data.tags.sort((a, b) => {
          let aNum = (a.connectedTagPath.match(/\//g) || []).length;
          let bNum = (b.connectedTagPath.match(/\//g) || []).length;

          if (aNum > bNum) return 1;
          if (aNum < bNum) return -1;
          return 0;
        })
      : [];

  return (
    <div className="breadcrumb text-7">
      {loading && (
        <ul className="breadcrumb__list">
          <li className="breadcrumb__list--item"></li>
        </ul>
      )}
      {!loading && data && data!.tags && (
        <ul className="breadcrumb__list">
          <li className="breadcrumb__list--item text-7">
            <Link to={`/${i18n.languages[0]}`}>
              {i18n.t('common|home-text')}
            </Link>
          </li>
          {data!.tags.map((n, index) => {
            return (
              <li className="breadcrumb__list--item text-7">
                <Link to={`/${i18n.languages[0]}${n.connectedTagPath}`}>
                  {n.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
