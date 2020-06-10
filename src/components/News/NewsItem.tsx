import React, { Component } from 'react';
import i18n from '../../i18n';
import { TopImage } from 'assets/TopImage';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import ChopLines from 'chop-lines';
let moment = require('moment');
import { decode } from 'qss';

export interface NewsItemProps {
  children?: React.ReactNode;
  env: EnvSettings;
  id: string;
}

const hasWindow = typeof window !== 'undefined';

export const NewsItem : React.FC<NewsItemProps> = (props) => {    

  moment.locale(i18n.languages[0]);
  let id = '0';

  //check if id is sent in via QueryString
  if(hasWindow)
  {
    var qs = decode(window.location.search.substring(1)) as any;        
console.log(qs);
    id = qs.id && qs.id.toString().length > 0? qs.id.toString() : '0';    
  }

  //id via route is always preffered
  if(props.id)
    id = props.id;

  const NEWS = gql `
  {
    news(siteurl:"*", lang:"${i18n.languages[0]}",id:"${id}"){
      id        
      heading
      preamble
      published
      modified
      tags
      body 
      imageUrl
    }
  }
`
;

  const { loading, error, data } = useQuery<{news:Array<any>}>(NEWS);

  const newsItem = data && data.news && data.news.length > 0
  ? data.news[0]
  : null;

    return (                    
      <div className="news-article content">

        {loading && (<div>laddar..</div>)}
        {!loading && newsItem && id && id != '0' ?
          <>
            {newsItem && newsItem.imageUrl && (
              <img src={newsItem.imageUrl} />
            )}

            <span className="text-6">{moment(newsItem.published.toString()).format("D MMM YYYY")}</span>
            <h1 className="text-1">{newsItem.heading}</h1>
            <p className="preamble text-4">
            {newsItem.preamble}
            </p>                              
            <p
              className="main-text text-5"
              dangerouslySetInnerHTML={{
                __html: newsItem.body,
              }}
            />                          
          </>  
          : !loading &&
          <>
            <h1 className="text-1">Den nyheten finns inte längre kvar.</h1>
          </>
        }
      </div>                                                    
    )  
}
