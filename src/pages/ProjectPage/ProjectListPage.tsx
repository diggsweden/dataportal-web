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
import { ProjectList } from '../../components/Projects';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { SettingsContext } from 'components/SettingsProvider';
import { PageProps } from '../PageProps';
import { TopImageInspo } from 'assets/TopImageInspo';
import { StaticBreadcrumb } from 'components/Breadcrumb';

const MainContent = Box.withComponent('main');

export class ProjectListPage extends React.Component<PageProps, any> {
  private headerRef: React.RefObject<Header>;

  constructor(props: PageProps) {
    super(props);
    this.headerRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
    this.state = { activeLink: 'projects' };
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
          seoTitle="Inspiration - Sveriges dataportal"
          seoDescription=""
          seoImageUrl=""
          seoKeywords=""
          robotsFollow={true}
          robotsIndex={true}
          lang={i18n.languages[0]}
          // canonicalUrl={`${this.props.env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t('routes|projects|path')}/`}

        />
        <SettingsContext.Consumer>
          {(settings) => (
            <Box
              id="top"
              display="flex"
              direction="column"
              minHeight="100vh"
              bgColor="#fff"
            >
              <NoJavaScriptWarning text="" />

              <Header ref={this.headerRef} activeLink={this.state.activeLink} />

              <ErrorBoundary>
                <MainContent className="projectlistpage" flex="1 1 auto">
                  <StaticBreadcrumb env={settings.env} staticPaths={[
                    {
                      path: `/${i18n.languages[0]}/${i18n.t('routes|projects|path')}`,
                      title: i18n.t('routes|projects|title')
                    }
                  ]} />
                  <div className="projectlistpage__img">
                    <TopImageInspo></TopImageInspo>
                  </div>
                  <div className="main-container">
                    <div className="content">
                      <h1 className="text-header text-1">
                        Inspiration
                      </h1>
                      <p className="text-5">
                        Här har vi samlat konkreta exempel på hur data från
                        Sveriges dataportal används i praktiken. Vi hoppas att
                        du blir inspirerad att bidra du också!
                      </p>
                    </div>
                    <ProjectList env={settings.env} />
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
