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

const MainContent = Box.withComponent('main');

export interface PagePropsEn extends RouteComponentProps<any, RouterContext> {}

export class AboutWebPageEn extends React.Component<PagePropsEn> {
  private headerRef: React.RefObject<Header>;

  constructor(props: PagePropsEn) {
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
        <PageMetadata
          seoTitle="About this website - The Swedish dataportal"
          seoDescription=""
          seoImageUrl=""
          seoKeywords=""
          robotsFollow={true}
          robotsIndex={true}
          lang={i18n.languages[0]}
        />
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
                <h1 className="text-header text-1">About this website</h1>
                <div className="content">
                  <p className="preamble text-4">
                    Sweden's data portal is under development and is currently
                    available in a beta version. In 2020, the data portal will
                    be further developed with more features and more content.
                    The new data portal is being further developed and managed
                    by the Agency for Digital Goverment (DIGG). You can still use the
                    old data portal,{' '}
                    <a
                      target="_blank"
                      href="https://oppnadata.se"
                      rel="noreferrer"
                    >
                      oppnadata.se
                    </a>
                    . Oppnadata.se is planned to be closed down in 2020.
                  </p>

                  <p className="main-text text-5">
                    Data is a national resource for the development of business,
                    society and public administration. It is a path to
                    transparency, innovation and growth that benefits the entire
                    society created by citizens, business and government
                    together.
                  </p>
                  <p className="main-text text-5">
                    Sweden's data portal coordinates and makes available datasets
                    provided by public and private organizations. The data
                    portal also functions as the hub where the Swedish
                    authorities publish information about the types of documents
                    that are usually provided electronically for re-use.
                  </p>
                  <p className="main-text text-5">
                    The data portal only contains information about datasets, ie.
                    metadata. Data is retrieved via links for download or
                    requested by the respective organization responsible for
                    their own datasets.
                  </p>

                  <h2 className="text-2">Changelog</h2>
                  <div className="main-text">
                    <span className="text-5-bold">2020-01-09:</span>
                    <ul className="text-5">
                      <li>Made adjustments for the design.</li>
                      <li>Improved search functionality.</li>
                      <li>Made corrections for HTML validation.</li>
                    </ul>
                  </div>

                  <div className="main-text">
                    <span className="text-5-bold">2020-03-17:</span>
                    <ul className="text-5">
                      <li>Further development of the start page</li>
                      <li>
                        Published source code on{' '}
                        <a href="https://github.com/DIGGSweden/dataportal-web">
                          GitHub
                        </a>
                      </li>
                      <li>Prepared for concepts and specifications</li>
                      <li>Prepared for language support (English)</li>
                      <li>Ability to sort datasets</li>
                      <li>Ability to filter datasets after license</li>
                      <li>Statistics of the data portal</li>
                    </ul>
                  </div>

                  <h2 className="text-2">
                    Accessibility report for the data portal
                  </h2>
                  <p className="main-text text-5">
                    The Agency for Digital Goverment (DIGG) is responsible for this site.{' '}
                    <a
                      href={`/${i18n.languages[0]}/${i18n.t(
                        'routes|accessibility|path'
                      )}`}
                    >
                      Here you can read the accessibility report
                    </a>
                    .
                  </p>

                  <h2 className="text-2">Cookies</h2>
                  <p className="main-text text-5">
                    A cookie is a small text file stored on your computer and
                    contains information. Cookies are normally used to improve
                    the site for you as a visitor.
                  </p>

                  <p className="main-text text-5">
                    The new data portal (dataportal.se) stores and uses no
                    cookies. If you still see cookies in the browser, it is
                    because you have previously visited the old data portal
                    (oppnadata.se). These cookies are included in the new data
                    portal because it uses components from the old one, but
                    these cookies are not used.
                  </p>

                  <div className="main-text">
                    <span className="text-5-bold">Cookies that may be present:</span>
                    <ul>
                      <li>CONSENT</li>
                      <li>_fbp</li>
                      <li>_ga</li>
                      <li>_gcl_au</li>
                      <li>_hjid</li>
                    </ul>
                    You can delete the stored cookies by using the cookie
                    clearing feature in your browser.
                  </div>

                  <h2 className="text-2">Comments on the data portal</h2>
                  <p className="main-text text-5">
                    <a
                      target="_blank"
                      href="https://webropol.com/s/beta-sveriges-dataportal"
                      rel="noreferrer"
                    >
                      Please send your comments
                    </a>{' '}
                    on the new data portal to us!
                  </p>
                </div>
              </div>
            </MainContent>
          </ErrorBoundary>
          <Footer onToTopButtonPushed={this.setFocus} />
        </Box>
      </QueryParamProvider>
    );
  }
}
