import React from 'react';
import i18n from 'i18next';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { Link } from 'react-router-dom';

export interface StaticPath{
  path: string,
  title: string
}

export interface StaticBreadcrumbProps{    
  staticPaths: StaticPath[];
  env: EnvSettings; 
}

export const StaticBreadcrumb : React.FC<StaticBreadcrumbProps> = (props) => {  
  return(
  <div className="breadcrumb text-7">    
    {props.staticPaths && props.staticPaths.length > 0 && (
      <ul className="breadcrumb__list">
        <li className="breadcrumb__list--item">
          <Link to={`/${i18n.languages[0]}`}>{i18n.t('common|home-text')}</Link>
        </li>         
        {props.staticPaths.map((n, index) => {                
          return (                
            <li key={index} className="breadcrumb__list--item text-7">        
              <Link to={`${n.path}`}>{n.title}</Link>        
            </li>   
          );  
        })}
    </ul>
    )}    
  </div>
  );
};
