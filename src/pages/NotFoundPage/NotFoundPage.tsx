import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { RouterContext } from '../../../shared/RouterContext';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { __RouterContext } from 'react-router';

export const NotFoundPage: React.FC<RouteComponentProps<any, RouterContext>> =
  ({ staticContext, location }) => {
    if (staticContext) {
      staticContext.statusCode = 404;
    }

    if(location.pathname && location.pathname.includes("/en/"))
      i18n.changeLanguage("en");  
    else
      i18n.changeLanguage("sv");  

    return (
      <>
        <PageMetadata
          seoTitle={i18n.t('pages|notfoundpage|heading')}
          seoDescription={i18n.t('pages|notfoundpage|heading')}
          seoImageUrl=""
          seoKeywords=""
          robotsFollow={true}
          robotsIndex={true}
          lang={i18n.languages[0]}
        />

        <div className="main-container">
          <h1 className="text-1">
            {i18n.t('pages|redirect|pagenotfound_header')}
          </h1>
          <div className="content redirectpage__content">
            <span className="text-5">
              {i18n.t('pages|notfoundpage|body')}
            </span>

            <ul>
              <li>
                <Link className="text-4" to={`/${i18n.languages[0]}`}>
                  {i18n.t('pages|redirect|pagenotfound-link')}
                </Link>
              </li>
              <li>
                <Link
                  className="text-4"
                  to={`/${i18n.languages[0]}/${i18n.t(
                    'routes|datasets|path'
                  )}?q=&f=`}
                >
                  {i18n.t('pages|redirect|pagenotfound-link2')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  };
