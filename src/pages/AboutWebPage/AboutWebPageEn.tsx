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
import { PageProps } from '../PageProps';

const MainContent = Box.withComponent('main');

export class AboutWebPageEn extends React.Component<PageProps> {
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
        <PageMetadata
          seoTitle="About this website - The Swedish dataportal"
          seoDescription=""
          seoImageUrl=""
          seoKeywords=""
          robotsFollow={true}
          robotsIndex={true}
          lang={i18n.languages[0]}
          canonicalUrl={`${this.props.env.CANONICAL_URL}/${
            i18n.languages[0]
          }/${i18n.t('routes|about|path')}/`}
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
                    Sweden's data portal is under development and will be
                    further developed during 2020 with more features and more
                    content. The new data portal is being managed by the Agency
                    for Digital Government (DIGG).
                  </p>

                  <p className="main-text text-5">
                    Data is a national resource for the development of business,
                    society and public administration. It is a path to
                    transparency, innovation and growth that benefits the entire
                    society created by citizens, business and government
                    together.
                  </p>
                  <p className="main-text text-5">
                    Sweden's data portal coordinates and makes available data
                    sets provided by public and private organizations. The data
                    portal also functions as the hub where the Swedish
                    authorities publish information about the types of documents
                    that are usually provided electronically for re-use.
                  </p>
                  <p className="main-text text-5">
                    The data portal only contains information about datasets,
                    i.e. metadata. Data is retrieved via links for download or
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

                  <div className="main-text">
                    <span className="text-5-bold">2020-04-16:</span>
                    <ul className="text-5">
                      <li>Design adjustments</li>
                      <li>Adjustments for better accessibility</li>
                    </ul>
                  </div>

                  <div className="main-text">
                    <span className="text-5-bold">2020-06-10:</span>
                    <ul className="text-5">
                      <li>Design adjustments</li>
                      <li>Improved search functionality</li>
                      <li>Search phrases with AND, OR and NOT can be used</li>
                      <li>
                        Improved relevance in the hit list after searching
                      </li>
                    </ul>
                  </div>

                  <div className="main-text">
                    <span className="text-5-bold">2020-08-19:</span>
                    <ul className="text-5">
                      <li>
                        Sitemap that enabels indexing and search on google
                      </li>
                      <li>Newspublishing</li>
                      <li>Various bug fixes</li>
                      <li>Security updates</li>
                    </ul>
                  </div>

                  <div className="main-text">
                    <span className="text-5-bold">2020-08-19:</span>
                    <ul className="text-5">
                      <li>
                        Page for statistics in text
                      </li>
                      <li>Various bug fixes</li>
                      <li>Improved performance</li>
                      <li>Shut down the website Oppna data och PSI</li>
                    </ul>
                  </div>

                  <h2 className="text-2">
                    Accessibility report for the data portal
                  </h2>
                  <p className="main-text text-5">
                    The Agency for Digital Government (DIGG) is responsible for
                    this site. Read the {' '}
                    <a
                      href={`/${i18n.languages[0]}/${i18n.t(
                        'routes|accessibility|path'
                      )}`}
                    >
                      accessibility report
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
                    <span className="text-5-bold">
                      Cookies that may be present:
                    </span>
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
                    Please send your {' '}
                    <a
                      target="_blank"
                      href="https://webropol.com/s/beta-sveriges-dataportal"
                      rel="noreferrer"
                    >
                      comments
                    </a>
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
