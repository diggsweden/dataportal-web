import React from 'react';
import { Link } from 'react-router-dom';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { PageProps } from '../PageProps';

export const RedirectPage: React.FC<PageProps> = () =>
  <>
    <PageMetadata
      seoTitle="Redirect page - Sveriges dataportal"
      seoDescription=""
      seoImageUrl=""
      seoKeywords=""
      robotsFollow={true}
      robotsIndex={true}
      lang={i18n.languages[0]}
    />
    <div className="main-container">
      <h1 className="text-1">
        {i18n.t('pages|redirect|pagenotfound_header')}{' '}
      </h1>
      <div className="content text-5 redirectpage__content">
        <span> {i18n.t('pages|redirect|pagenotfound-text')}</span>

        <ul>
          <li>
            <Link className="text-4" to={`/${i18n.languages[0]}`}>
              {i18n.t('pages|redirect|pagenotfound-link')}
            </Link>
          </li>
          <li>
            <Link className="text-4" to={`/${i18n.languages[0]}/${i18n.t(
              'routes|datasets|path'
            )}?q=&f=`}>
              {i18n.t('pages|redirect|pagenotfound-link2')}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </>