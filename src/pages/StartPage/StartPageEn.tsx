import {
  Box,
  ArrowIcon,
  SearchIcon,
  Accordion,
  Container,
  colorPalette,
} from '@digg/design-system';
import React from 'react';
import Helmet from 'react-helmet';
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
import { TopImage } from 'assets/TopImage';
import { Statistic } from '../../components/Statistic';
import i18n from 'i18n';
import { PageProps } from 'pages/PageProps';
import { SettingsContext } from 'components/SettingsProvider';
import { StatisticGraph } from '../../components/StatisticGraph';
import { StatisticNumbers } from '../../components/StatisticNumbers';
import { ArticleBlock } from 'components/Articles';

import {
  CategoriesNav,
  Highlight,
  SearchBlock,
} from '../../components/StartPageComponents';
const MainContent = Box.withComponent('main');

export class StartPageEn extends React.Component<PageProps, any> {
  private headerRef: React.RefObject<Header>;

  constructor(props: PageProps) {
    super(props);
    this.headerRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
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
        <SettingsContext.Consumer>
          {(settings) => (
            <Box
              id="top"
              display="flex"
              direction="column"
              minHeight="100vh"
              bgColor="#fff"
            >
              <PageMetadata
                seoTitle="The Swedish dataportal"
                seoDescription="Sweden's national data portal for finding, exploring and using data from the public and private sectors"
                seoImageUrl=""
                seoKeywords=""
                robotsFollow={true}
                robotsIndex={true}
                lang={i18n.languages[0]}
              />
              <NoJavaScriptWarning text="" />

              <Header ref={this.headerRef} />

              <ErrorBoundary>
                <MainContent id="main" flex="1 1 auto">
                <SearchBlock env={settings.env} />
                  <Highlight env={settings.env} />
                  <CategoriesNav env={settings.env} />
                  <ArticleBlock env={settings.env} />



                <div className="statistic">
                  <div className="statistic-header">
                    <h2 className="text-3">Portalen i siffror</h2>
                  </div>

                  <div className="statistic-wrapper">
                    {/* <RenderInBrowser except ie> */}
                    <StatisticGraph env={settings.env} />
                    <StatisticNumbers env={settings.env} />
                  </div>
                  <Statistic env={settings.env} />
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
