import React, { Component, useState } from 'react';
import i18n from '../../i18n';
import { TopImage } from 'assets/TopImage';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import ChopLines from 'chop-lines';
let moment = require('moment');

export interface NewsBlockProps {
  children?: React.ReactNode;
  env: EnvSettings;
}

const lang = "sv";

const NEWS = gql `
  {
    news(siteurl:"dataportal.web.local", lang:"${lang}", take:5, skip:0){
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

export const NewsBlock : React.FC<NewsBlockProps> = () => {  

  const { loading, error, data } = useQuery<{news:Array<any>}>(NEWS);

  const stickyNews = data && data.news && data.news.length > 0
  ? data.news.filter((n) => n.tags && n.tags.filter((t:any) => t == "Sticky").length > 0)
  : [];

  const newsList = data && data.news && data.news.length > 0
  ? data.news.filter((n) => (!n.tags) || (n.tags && n.tags.length == 0) || (n.tags && n.tags.length > 0 && n.tags.filter((t:any) => t != "Sticky").length > 0))
  : [];  

return (
    <div>
      <h2 className="text-3">Nyheter</h2>
      <div className="news-compact">
        <div className="news-pinned">
          <div>
            <TopImage />
          </div>          
          {!loading && stickyNews && stickyNews.length > 0 &&
              //stickyNews.map((n,index) => {                
               // return (
                  <div>
                    <span className="text-6">{stickyNews[0].published}</span>
                    <h3 className="">
                      <a className="text-4" href="#">
                      {stickyNews[0].heading}
                      </a>
                    </h3>
                    <ChopLines
                      lines={4}
                      lineHeight={26}>                    
                      <p
                        className="text-5"
                        dangerouslySetInnerHTML={{
                          __html: stickyNews[0].preamble,
                        }}
                      />                
                    </ChopLines> 
                  </div>
              //)})
          }                        
        </div>

        <div className="news-list-compact">          
          <ul>          
            {loading && (<li>laddar..</li>)}
            {!loading && error && (<li>Det finns inga nyheter att visa för tillfället.</li>)}
            {!loading && newsList && newsList.length > 0 &&              
              newsList.map((n,index) => {                                
                return (
                <li key={index}>   
                  <span className="text-6">{n.published}</span>     
                  <h3>
                    <a className="text-4" href="#">
                      {n.heading}
                    </a>
                  </h3>                                    
                  <ChopLines
                    lines={2}
                    lineHeight={26}>                    
                    <p
                      dangerouslySetInnerHTML={{
                        __html: n.preamble,
                      }}
                    />                
                  </ChopLines>                                                   
                </li>)
              })                
            }            
          </ul>
          <a
            href={`/${i18n.languages[0]}/${i18n.t('routes|news|path')}`}
            className="default-button text-5">
            Visa alla nyheter
          </a>
        </div>
      </div>
    </div>
  );  
}
