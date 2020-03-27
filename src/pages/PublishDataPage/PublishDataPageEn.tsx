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

export class PublishDataPageEn extends React.Component<PagePropsEn, any> {
  private headerRef: React.RefObject<Header>;

  constructor(props: PagePropsEn) {
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
                    You have the opportunity to contribute content to Sweden's
                    data portal yourself by publishing your datasets. They then
                    become searchable for everyone and thus the chances of being
                    used increase. It is only when using data that benefit
                    arises.
                  </p>
                  <p className="main-text text-5">
                    It should be easy for users to find and understand if data
                    is suitable for the purposes they have, both in terms of
                    content and technically. Soon, Sweden's data portal will
                    contain three different services. The services simplify both
                    for the users who want to use data, but also for the actors
                    who want to make information available.
                  </p>

                  <ul className="main-text text-5">
                    <li>Search data</li>
                    <li>Search concepts</li>
                    <li>Search specifications</li>
                  </ul>

                  <p className="main-text text-5">
                    The data portal enables a more efficient exchange of
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
                      onClick={e => {
                        window.location.href =
                          'https://registrera.oppnadata.se/';
                      }}
                    >
                      <div className="link-wrapper">
                        <a className="" href="https://registrera.oppnadata.se/">
                          View your data on Sweden's data portal{' '}
                        </a>
                        <p className="text-5">
                          Register your organization and harvesting source on
                          Sweden's data portal. Check data volumes harvested and
                          manage your data directory before publishing.
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
                          Manage and concepts and specifications
                        </a>
                        <p className="text-5">
                          Register your organization to access tools where
                          actors can describe, link, maintain and publish
                          concepts and specifications.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2">This is how it works</h2>
                  <p className="main-text text-5">
                    Sweden's data portal collects daily descriptions of data
                    volumes published publicly by organizations. Another word
                    for a description of a dataset is metadata. Only the
                    metadata is published on the portal, while the actual data
                    sources remain with the publishing organization. Both open
                    and limited data can be described. Data that can be used by
                    everyone is given direct access via links on the portal.
                    Data that has some kind of restriction is requested or
                    agreed upon by the respective organization.
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
                    A prerequisite for publishing data to Sweden data portal is
                    to create and publish a directory of metadata in a common
                    and standardized way.
                  </p>

                  <p className="main-text text-5">
                    Once you have identified one or more datasets whose
                    descriptions you want to publish to Sweden's data portal
                    should you do the following:{' '}
                  </p>

                  <ol className="main-text text-5">
                    <li>
                      Describe your datasets according to the standardized
                      metadata specification{' '}
                      <a
                        target="_blank"
                        href="https://diggsweden.github.io/DCAT-AP-SE/"
                      >
                        DCAT-AP-SE
                      </a>
                      . Many users use an external tool for this step.
                    </li>
                    <li>
                      Publish the specification to your own stable URL. This URL
                      is your so-called "harvesting source" from which the data
                      portal automatically retrieves your data directory.
                    </li>
                    <li>
                      Create a user or log in to{' '}
                      <a
                        target="_blank"
                        href="https://registrera.oppnadata.se/"
                      >
                        registrera.dataportal.se
                      </a>
                      . The Data Portal provides here tools to validate, merge,
                      and examine your data directory before publishing.
                    </li>
                    <li>
                      Link Sweden's data portal to your organization's data by
                      registering, modifying and confirming you harvesting
                      source. Validate and save. If necessary, check that the
                      harvest to{' '}
                      <a
                        target="_blank"
                        href="https://registrera.oppnadata.se/"
                      >
                        registrera.dataportal.se
                      </a>{' '}
                      works.
                    </li>
                    <li>
                      When you are done, your datasets will appear on Sweden's
                      data portal.
                    </li>
                  </ol>

                  <p className="main-text text-5">
                    During the development of the beta version of dataportal.se,
                    publishers are referred to{' '}
                    <a href="https://oppnadata.se" target="_blank">
                      oppnadata.se
                    </a>{' '}
                    for guidance on making information available and publishing
                    metadata to the data portal.
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
