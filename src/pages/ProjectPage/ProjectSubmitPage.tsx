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
import { TopImageTellUs } from 'assets/TopImageTellUS';

const MainContent = Box.withComponent('main');

export class ProjectSubmitPage extends React.Component<PageProps, any> {
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
          seoTitle="Tipsa oss! - Sveriges dataportal"
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
                <MainContent
                  className="project__page project__submitpage"
                  flex="1 1 auto"
                >
                  <div className="theme_black">
                    <div className="project__topimage">
                      <TopImageTellUs />
                    </div>
                    <div>
                      <div className="project__banner">
                        <div className="main-container">
                          <h1 className="text-1">Tipsa oss!</h1>
                          <p className="preamble text-4">
                            Vill du tipsa oss kring något som inspirerar till
                            användning av öppna data eller datadriven
                            innovation? Skicka gärna in dina tips till oss!{' '}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="main-container">
                      <div className="content">
                        <h2 className="text-3">Så här går det till </h2>
                        <p className=" main-text text-5">
                          Skicka ett mejl och beskriv kortfattat vad ditt tips
                          handlar om. Skicka gärna med länkar eller annan
                          information som kan hjälpa oss att förstå och bedöma
                          ditt tips. Skriv också hur vi kan ta kontakt med dig
                          eller andra personer som vet mer om det du vill tipsa
                          om. Vi tar gärna emot tips, men kan inte garantera att
                          vi publicerar något kring de tips vi får in.
                        </p>
                        <p className=" main-text text-5">
                          Om vi går vidare med ditt tips tar vi kontakt med dig
                          för att ta reda på mer information för en eventuell
                          artikel på dataportal.se.
                        </p>

                        <a
                          className="submit-link"
                          href="mailto:someone@yoursite.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Skicka in tips via mejl
                        </a>
                      </div>
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
