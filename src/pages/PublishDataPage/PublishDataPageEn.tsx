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
import { PageProps } from '../PageProps'

const MainContent = Box.withComponent('main');

export class PublishDataPageEn extends React.Component<PageProps, any> {
  private headerRef: React.RefObject<Header>;

  constructor(props: PageProps) {
    super(props);
    this.headerRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
    this.state = { activeLink: 'register' };
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
          seoTitle={`${i18n.t('routes|register-data|title')} - ${i18n.t(
            'common|logo-title'
          )}`}
          seoDescription=""
          seoImageUrl=""
          seoKeywords=""
          robotsFollow={true}
          robotsIndex={true}
          lang={i18n.languages[0]}
          canonicalUrl={`${this.props.env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t('routes|register-data|path')}/`}
        />
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
            <MainContent flex="1 1 auto">
              <div className="main-container">
                <h1 className="text-header text-1">Register data</h1>
                <div className="content">
                  <p className="preamble text-4">
                    Welcome in contributing content to Sweden's data portal by
                    publishing your datasets. Your contribution will then be
                    searchable for everyone and thus the chances of your
                    datasets being used will increase. It is only when data is
                    used that the benefits will arise.
                  </p>
                  <p className="main-text text-5">
                    It is important to make it easy for users to find and
                    understand the data by ensuring that the content of the data
                    is suitable for the purposes they are intended for and that
                    it is technically feasible to access these data.
                  </p>

                  <p className="main-text text-5">
                    Soon, Sweden's data portal will deliver services that will
                    simplify for both the users who want to use data, but also
                    for the actors who want to make information available. The
                    three different services that are planned for are:
                  </p>

                  <ul className="main-text text-5">
                    <li>Search data</li>
                    <li>Search concepts</li>
                    <li>Search specifications</li>
                  </ul>

                  <p className="main-text text-5">
                    The data portal aims to enable a more efficient exchange of
                    information in a digital ecosystem by linking data with its
                    specification and concepts.
                  </p>

                  <p className="main-text text-5">
                    Sweden's data portal provides tools for uploading content to
                    the services.
                  </p>

                  <div className="link-blocks">
                    <div
                      className="link-block"
                      onClick={(e) => {
                        window.location.href =
                          'https://registrera.oppnadata.se/';
                      }}
                    >
                      <div className="link-wrapper">
                        <a className="" href="https://registrera.oppnadata.se/">
                          View your data on Sweden's data portal{' '}
                        </a>
                        <p className="text-5">
                          Register your organisation and harvesting source on
                          Sweden´s data portal. Search and explore datasets
                          harvested and manage your data directory before
                          publishing.
                        </p>
                      </div>
                    </div>

                    <div
                      className="link-block disabled-linkbox"
                      // onClick={e => {
                      //   window.location.href = `https://editera.dataportal.se/`;
                      // }}
                    >
                      <div className="link-wrapper">
                        <div className="soon">{i18n.t('common|soon')}</div>

                        <a
                          className=""
                          // href="https://editera.dataportal.se/"
                        >
                          Register and manage concepts and specifications
                        </a>
                        <p className="text-5">
                          Get access tools where you can describe, link,
                          maintain and publish concepts and specifications.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2">How it works</h2>
                  <p className="main-text text-5">
                    Sweden's data portal collects daily descriptions of datasets
                    published publicly by organisations. Another word for
                    describing a dataset is metadata. The portal publishes only
                    metadata while the actual data sources remain with the
                    publishing organisation. Both open and limited data can be
                    described here. Data that can be used by everyone is given
                    direct access via links on the portal. Data that has some
                    kind of restriction is requested from or agreed upon by
                    respective organisation.
                  </p>

                  <p className="main-text text-5">
                    <a
                      href="https://www.europeandataportal.eu/sv/homepage"
                      target="_blank"
                    >
                      The european data portal
                    </a>{' '}
                    in turn harvests and displays data from Sweden's data
                    portal.
                  </p>

                  <h2 className="text-2">How to get started publishing data</h2>
                  <p className="main-text text-5">
                    In order for Sweden's data portal to know what data you
                    have, you must publish a directory of your data. In the
                    directory, your data must be described as datasets. For
                    example, a dataset may correspond to the data stored in a
                    particular system, data that a particular target group is
                    interested in, data that relates to a specific topic or data
                    that is managed in a uniform manner.
                  </p>

                  <p className="main-text text-5">
                    You should do the following once you have identified
                    descriptions to one or more datasets you want to publish on
                    the data portal:{' '}
                  </p>

                  <ol className="main-text text-5">
                    <li>
                      Describe your datasets according to the standardized
                      metadata specification{' '}
                      <a
                        target="_blank"
                        href="https://docs.dataportal.se/dcat/en/"
                      >
                        DCAT-AP-SE
                      </a>
                      . Many users use an external tool for this step.
                    </li>
                    <li>
                      Publish the specification with a stable URL. This URL is
                      your so-called "harvesting source" to which the data
                      portal will automatically retrieve your data directory
                      from.
                    </li>
                    <li>
                      Create a user or log in to registera.dataportal.se. The
                      Data Portal provides tools to validate, merge, and examine
                      your data directory before publishing.
                    </li>
                    <li>
                      Make sure the harvesting source matches the URL you
                      created in step 2. If necessary, check that the harvesting
                      to register.dataportal.se works.
                    </li>
                    <li>
                      When you are done, your datasets will appear on Sweden's
                      data portal within a day.
                    </li>
                  </ol>

                  <p className="main-text text-5">
                    For more information about the data portals technical
                    framework and recommendations regarding harvesting metadata,
                    see{' '}
                    <a href="https://docs.dataportal.se/" target="_blank">
                      docs.dataportal.se/
                    </a>
                    .
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
