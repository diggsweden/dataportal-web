import React from 'react';
import 'scss/search/search_head.scss';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import i18n from 'i18n';

interface HeadingWithRouterProps extends RouteComponentProps<{}> {
  children?: React.ReactNode;
}

interface SearchHeaderProps {
  activeLink?: string;
}

//Search head
export class SearchHeader extends React.Component<SearchHeaderProps> {
    render(){
        return(
            <div className="search-head">
            <div><a className={'text-6 ' + (this.props.activeLink == 'search' ? 'active' : '')} href={`/${i18n.languages[0]}/datasets?q=&f=`} ><span>{i18n.t('pages|search|datasets')}</span></a></div>
            <div><a className={'text-6 ' + (this.props.activeLink == 'terms' ? 'active' : '')} href={`/${i18n.languages[0]}/concepts?q=&f=`}><span>{i18n.t('pages|search|concepts')}</span></a></div>
            <div><a className={'text-6 ' + (this.props.activeLink == 'specifications' ? 'active' : '')} href={`/${i18n.languages[0]}/specifications?q=&f=`}><span>{i18n.t('pages|search|specifications')}</span></a></div>
          </div>
        );   
    }
}
