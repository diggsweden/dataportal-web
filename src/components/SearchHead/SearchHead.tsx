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
            <div><Link className={'text-6 ' + (this.props.activeLink == 'search' ? 'active' : '')} to={`/${i18n.languages[0]}/datasets?q=&f=`} ><span>{i18n.t('pages|search|datasets')}</span></Link></div>
            <div><Link className={'text-6 ' + (this.props.activeLink == 'terms' ? 'active' : '')} to={`/${i18n.languages[0]}/concepts?q=&f=`}><span>{i18n.t('pages|search|concepts')}</span></Link></div>
            <div><Link className={'text-6 ' + (this.props.activeLink == 'specifications' ? 'active' : '')} to={`/${i18n.languages[0]}/specifications?q=&f=`}><span>{i18n.t('pages|search|specifications')}</span></Link></div>
          </div>
        );   
    }
}
