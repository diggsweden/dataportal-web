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

export class AccessibilityWebPageEn extends React.Component<PagePropsEn> {
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
          seoTitle="Accessibility - The Swedish dataportal"
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
                <h1 className="text-header text-1">
                  Accessibility for Sweden's data portal
                </h1>
                <div className="content">
                  <p className="preamble text-4">
                    The Agency for Digital Government is responsible for this site. We want as
                    many people as possible to be able to use the site. This document
                    describes how Sweden's data portal fulfills{' '}
                    <cite>the Act on Access to Digital Public Service</cite>,
                    any known accessibility issues, and how to report
                    deficiencies to us so that we can address them.
                  </p>
                  <h2 className="text-2">How accessible is the site?</h2>
                  <p className="main-text text-5">
                    We are aware that parts of the site are not fully
                    accessible.
                  </p>
                  <p className="main-text text-5">
                    The links below lead to detailed information about which
                    ones accessibility problems you may encounter in different
                    use situations.
                  </p>
                  <div className="main-text text-5">
                    <ul>
                      <li>
                        <a href="#usage-1">Use without vision</a>
                      </li>
                    </ul>
                  </div>
                  <h2 className="text-2">What can you do if you can't use parts of the site?</h2>
                  <p className="main-text text-5">
                  If you need content from Sweden's data portal that is not accessible to you, but which is excluded from the law's scope as described below, you can{' '}
                    <a href="https://www.digg.se/tdosanmalan">let us know</a>.
                  </p>
                  <p className="main-text text-5">
                    You can also contact us in the following ways:
                  </p>
                  <div className="main-text text-5">
                    <ul>
                      <li>
                        send email to{' '}
                        <a href="mailto:info@digg.se">info@digg.se</a>
                      </li>
                      <li>
                        call <a href="tel:+46-771-114400">0771-11 44 00</a>
                      </li>
                    </ul>
                  </div>
                  <h2 className="text-2">Report deficiencies in site availability</h2>
                  <p className="main-text text-5">
                    We constantly strive to improve the site's accessibility. If
                    you find any problems not described on this page, or if you
                    believe we do not comply with the law,{' '}
                    <a href="https://www.digg.se/tdosanmalan">let us know</a> so
                    we know the problem exists.
                  </p>
                  <h2 className="text-2">Oversight</h2>
                  <p className="main-text text-5">
                    The Agency for Digital Government is responsible for the
                    oversight of{' '}
                    <cite>
                      the Act on Accessibility for Digital Public Service
                    </cite>
                    . If you are not happy with how we handle your views, you
                    can{' '}
                    <a href="https://www.digg.se/tdosanmalan">
                      contact the Agency for Digital Government
                    </a>{' '}
                    and address it.
                  </p>
                  <h2 className="text-2">Technical information on site accessibility</h2>
                  <p className="main-text text-5">
                    This site is not compatible with{' '}
                    <cite>
                      the Act on Accessibility for Digital Public Service
                    </cite>
                    . Inaccessible parts are described below.
                  </p>
                  <h2 className="text-2" id="inaccessible-content">
                    Content that is not accessible
                  </h2>
                  <p className="main-text text-5">
                    The content described below is in one way or another not
                    completely accessible.
                  </p>
                  <h3 className="text-3">Lack of compliance with the legal requirements</h3>
                  
                  <h4 className="text-4-bold" id="usage-1">Problems when used without vision</h4>
                  <div className="main-text text-5">
                    <ul>
                      <li>
                        <p>
                        The generated bar chart displayed on the home page has no text option.{' '}
                          <span>
                            [<abbr>WCAG</abbr> 1.1.1 (A)]
                          </span>
                        </p>
                      </li>
                    </ul>
                  </div>

                  <h2 className="text-2">How we tested the site</h2>
                  <p className="main-text text-5">
                    We have done a self-assessment (internal testing) of
                    Sweden's data portal.
                  </p>
                  <p className="main-text text-5">
                    The most recent assessment was made on 16&#160;March
                    2020.
                  </p>
                  <p className="main-text text-5">
                    The report was last updated on 18&#160;March 2020.
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
