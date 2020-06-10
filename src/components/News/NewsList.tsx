import React, { Component, useState } from 'react';
import i18n from '../../i18n';
import { TopImage } from 'assets/TopImage';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import ChopLines from 'chop-lines';
import { slugify } from 'utilities/urlHelpers'
let moment = require('moment');

export interface NewsListProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

export const NewsList : React.FC<NewsListProps> = (props) => {  
  moment.locale(i18n.languages[0]);
  const NEWS = gql `
  {
    news(siteurl:"*", lang:"${i18n.languages[0]}", take:5, skip:0){
      id        
      heading
      preamble
      published
      modified
      tags
      body 
    }
  }
`;

  const [bgColor] = 
    useState(
      ['#F0EFEE',
      '#F4E0CE',
      '#D6D9D3',
      "#EBC0B8"
      ]);  

  const { loading, error, data } = useQuery<{news:Array<any>}>(NEWS);

  const newsList = data && data.news && data.news.length > 0
  ? data.news
  : [];  

return (
  <div className="news-list">
    <ul>
      {loading && (<li>laddar..</li>)}
      {!loading && error && (<li>Det finns inga nyheter att visa för tillfället.</li>)}
      {!loading && newsList && newsList.length > 0 &&              
        newsList.map((n,index) => {                                
        return (
          

          
          <li
          onClick={() => {(window as any).location.href = `/${i18n.languages[0]}/nyheter/${n.id}/${slugify(n.heading)}`;}}
          key={index} style={{borderColor: bgColor[Math.floor(Math.random()*bgColor.length)]}}>          
            <span className="text-6">{moment(n.published.toString()).format("D MMM YYYY")}</span>
            <a className="text-3" href={`/${i18n.languages[0]}/nyheter/${n.id}/${slugify(n.heading)}`}>{n.heading}</a>
            <ChopLines
              lines={3}
              lineHeight={27}
              >                    
              <p
                className="text-5"
                dangerouslySetInnerHTML={{
                  __html: n.preamble,
                }}
              />                
            </ChopLines> 
          </li>
        )})
      }
    </ul>
  </div>
  );
}
