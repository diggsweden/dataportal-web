import { Box, Accordion } from '@digg/design-system';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import { RouterContext } from '../../../shared/RouterContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { NoJavaScriptWarning } from '../../components/NoJavaScriptWarning';
import { QueryParamProvider } from '../../components/QueryParamProvider';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { ArticleList } from '../../components/Articles'
import { EnvSettings } from '../../../config/env/EnvSettings';
import { SettingsContext } from 'components/SettingsProvider';
import { PageProps } from '../PageProps'

const MainContent = Box.withComponent('main');

export class ArticleListPage extends React.Component<PageProps> {
  private headerRef: React.RefObject<Header>;

  constructor(props: PageProps) {
    super(props);
    this.headerRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
    // this.state = {
    //     bgColor: [
    //       '#F0EFEE',
    //       '#F4E0CE',
    //       '#D6D9D3',
    //       "#EBC0B8",
    //     ],
    // };
}

  setFocus() {
    if (this.headerRef.current) {
      this.headerRef.current.setFocusOnMenuButton();
    }
  }

  setTopMargin(height: number) {
    this.setState({ headerHeight: height });
  }

  render() {
    const { location } = this.props;
    let uri = new URLSearchParams(location.search);
    
    return (
      <QueryParamProvider params={uri}>
        <PageMetadata
            seoTitle="Artiklar - Sveriges dataportal"
            seoDescription=""
            seoImageUrl=""
            seoKeywords=""
            robotsFollow={true}
            robotsIndex={true}
            lang={i18n.languages[0]}
          />
        <SettingsContext.Consumer>
          {settings => (            
          <Box
            id="top"
            display="flex"
            direction="column"
            minHeight="100vh"
            bgColor="#fff"
          >
            <NoJavaScriptWarning text="" />

            <Header ref={this.headerRef} />

            <ErrorBoundary>
              <MainContent flex="1 1 auto">
                <div className="main-container">
                  <h1 className="text-header text-1">{i18n.t('pages|articles|articles')}</h1>
                  <div className="content">
                    <ArticleList env={settings.env}/>
                  </div>
                </div>
              </MainContent>
            </ErrorBoundary>
            <Footer onToTopButtonPushed={this.setFocus} />
          </Box>
          )}
        </SettingsContext.Consumer>
      </QueryParamProvider>
    );
  }
}
