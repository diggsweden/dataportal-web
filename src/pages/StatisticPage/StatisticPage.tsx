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
import { SettingsContext } from '../../components/SettingsProvider';
import { StatisticDataPresentation } from '../../components/StatisticDataPresentation';
import { StatisticGraph } from '../../components/StatisticGraph';
import { StatisticGraphNumbers } from '../../components/StatisticGraphNumbers';
import { Statistic } from '../../components/Statistic';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { StatisticNumbersDatasets } from 'components/StatisticNumbers';
import { StaticBreadcrumb } from 'components/Breadcrumb';

const MainContent = Box.withComponent('main');

export interface PageProps extends RouteComponentProps<any, RouterContext> {
  env: EnvSettings;
}

export class StatisticPage extends React.Component<PageProps> {
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
                seoTitle={i18n.t('pages|statistic|statistic-page-seotitle')}
                seoDescription=""
                seoImageUrl=""
                seoKeywords=""
                robotsFollow={true}
                robotsIndex={true}
                lang={i18n.languages[0]}
                canonicalUrl={`${this.props.env.CANONICAL_URL}/${
                  i18n.languages[0]
                }/${i18n.t('routes|statistics|path')}`}
                socialMeta={{
                  socialDescription: i18n.t(
                    'pages|statistic|social_meta_description'
                  ),
                  socialTitle: i18n.t('pages|statistic|social_meta_title'),
                  socialUrl: `${this.props.env.CANONICAL_URL}/${
                    i18n.languages[0]
                  }/${i18n.t('routes|statistics|path')}`,
                }}
              />

              <NoJavaScriptWarning text="" />
              <Header ref={this.headerRef} env={this.props.env} />
              <ErrorBoundary>
                <MainContent flex="1 1 auto">
                  <StaticBreadcrumb
                    env={settings.env}
                    staticPaths={[
                      {
                        path: `/${i18n.languages[0]}/${i18n.t(
                          'routes|statistics|path'
                        )}`,
                        title: i18n.t('routes|statistics|title'),
                      },
                    ]}
                  />
                  <div className="main-container">
                    <h1 className="text-header text-1">
                      {i18n.t('pages|statistic|statistic-page-header')}{' '}
                    </h1>
                    <div className="content statistic-page">
                      <p className="main-text text-5">
                        {i18n.t('pages|statistic|statistic-page-text')}
                      </p>
                      <StatisticGraphNumbers env={settings.env} />
                      <p className="main-text text-5">
                        {i18n.t(
                          'pages|statistic|statistic-page-numberofdatasets'
                        )}{' '}
                        <StatisticNumbersDatasets env={settings.env} />
                      </p>
                      <Statistic env={settings.env} />
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
