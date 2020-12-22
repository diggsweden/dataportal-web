import React, { Component } from 'react';
import i18n from '../../i18n';
import { TopImage } from 'assets/TopImage';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/client';
import { gql } from 'apollo-boost';
import ChopLines from 'chop-lines';
let moment = require('moment');
import { decode } from 'qss';
import { Helmet } from 'react-helmet'
import { StaticBreadcrumb } from 'components/Breadcrumb';
import { slugify } from 'utilities/urlHelpers';

export interface ArticleItemProps {
  children?: React.ReactNode;
  env: EnvSettings;
  id: string;
}

const hasWindow = typeof window !== 'undefined';

export const ArticleItem : React.FC<ArticleItemProps> = (props) => {    

  moment.locale(i18n.languages[0]);
  let id = '0';

  //check if id is sent in via QueryString
  if(hasWindow)
  {
    var qs = decode(window.location.search.substring(1)) as any;        
    id = qs.id && qs.id.toString().length > 0? qs.id.toString() : '0';    
  }

  //id via route is always preffered
  if(props.id)
    id = props.id;

  const NEWS = gql `
  {
    news(siteurl:"${props.env.CONTENTBACKEND_SITEURL}", lang:"${i18n.languages[0]}",id:"${id}"){
      id        
      heading
      preambleHTML
      published
      modified      
      bodyHTML
      imageUrl
    }
  }
`
;

  const { loading, error, data } = useQuery<{news:Array<any>}>(NEWS);

  const articleItem = data && data.news && data.news.length > 0
  ? data.news[0]
  : null;

    return (    
      <>
        {!loading && articleItem &&
          <StaticBreadcrumb env={props.env} staticPaths={[
            {
              path: `/${i18n.languages[0]}/${i18n.t('routes|news|path')}`,
              title: i18n.t('routes|news|title')
            },
            {
              path: `/${i18n.languages[0]}/${i18n.t(
                'routes|news|path'
                )}/${articleItem.id}/${slugify(articleItem.heading)}`,
              title: articleItem.heading
            }
          ]} />
        }
        <div className="main-container">                  
          <div className="">
            <div className="news-article content">
          {loading && (<span className="text-5 loading">{i18n.t('common|loading')}</span>)}
          {!loading && articleItem && id && id != '0' ?
            <>
              <Helmet>
                <title>{articleItem.heading} - {i18n.t('common|seo-title')}</title>
              </Helmet>            
              {articleItem && articleItem.imageUrl && (
                <img alt={articleItem.heading || 'nyhetsbild'} src={`${articleItem.imageUrl}?width=1024`} />
              )}
              <span className="date_published text-6">{moment(articleItem.published.toString()).format("D MMM YYYY")}</span>
              <h1 className="text-1">{articleItem.heading}</h1>            
              <p
                  className="preamble text-4"
                  dangerouslySetInnerHTML={{
                    __html: articleItem.preambleHTML,
                  }}
              ></p>                                       
              <div
                className="main-text text-5"
                dangerouslySetInnerHTML={{
                  __html: articleItem.bodyHTML,
                }}
              ></div>                          
            </>  
            : !loading &&
            <>
              <h1 className="text-1">Den artikeln finns inte längre kvar.</h1>
            </>
          }
        </div>                                                    
          </div>
        </div>
      </>
    )  
}
