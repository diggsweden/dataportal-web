import React from 'react';
import 'scss/search/search_head.scss';
import { NavLink } from 'react-router-dom';
import i18n from 'i18n';

interface SearchHeaderProps {
  activeLink?: string;
}

//Navigation between data & Api:s, concepts, specifications.
export const SearchHeader: React.FC<SearchHeaderProps> = () => {
  return (
    <div className="search-head">
      <div><NavLink activeClassName='active' className={'text-6 '} to={`/${i18n.languages[0]}/datasets?q=&f=`} ><span>{i18n.t('pages|search|datasets')}</span></NavLink></div>
      <div><NavLink activeClassName='active' className={'text-6 '} to={`/${i18n.languages[0]}/concepts?q=&f=`}><span>{i18n.t('pages|search|concepts')}</span></NavLink></div>
      <div><NavLink activeClassName='active' className={'text-6 '} to={`/${i18n.languages[0]}/specifications?q=&f=`}><span>{i18n.t('pages|search|specifications')}</span></NavLink></div>
    </div>
  );
}