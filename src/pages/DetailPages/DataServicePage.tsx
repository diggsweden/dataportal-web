import { Box } from '@digg/design-system';
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
import { Link } from 'react-router-dom';
import { PageMetadata } from '../PageMetadata';
import { encode, decode } from 'qss';
import { Loader } from '../../components/Loader';
import i18n from 'i18n';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { slugify } from 'utilities/urlHelpers';
import {
  EntrystoreProvider,
  EntrystoreContext,
} from '../../components/EntrystoreProvider';
import { PageProps } from '../PageProps';
import { StaticBreadcrumb } from 'components/Breadcrumb';

const MainContent = Box.withComponent('main');

export class DataServicePage extends React.Component<
  PageProps,
  { scriptsAdded: Boolean; scriptsLoaded: Boolean }
> {
  private headerRef: React.RefObject<Header>;
  private postscribe: any;
  private referredSearch: string = `/${i18n.languages[0]}/${i18n.t(
    'routes|datasets|path'
  )}/?q=`;

  constructor(props: PageProps) {
    super(props);
    this.headerRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
  }

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  componentDidMount() {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (typeof window !== 'undefined') {
      //check if reffereing search params is set to hash
      if (
        window.location &&
        window.location.hash &&
        window.location.hash.includes('ref=?')
      )
        this.referredSearch = `/${i18n.languages[0]}/${i18n.t(
          'routes|datasets|path'
        )}/?${window.location.hash.split('ref=?')[1]}`;

      window.onpopstate = (e: any) => {
        window.location.reload();
      };
    }

    this.addScripts();
  }

  addScripts() {
    if (typeof window !== 'undefined') {
      let reactThis = this;

      this.postscribe = (window as any).postscribe;

      if (this.props.match.params.eid && this.props.match.params.cid) {
        this.postscribe(
          '#scriptsPlaceholder',
          ` 
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              this.props.env.ENTRYSCAPE_DATASETS_PATH
                ? this.props.env.ENTRYSCAPE_DATASETS_PATH
                : 'admin.dataportal.se'
            }\/store'          
          };
          window.__entryscape_config = [{

            block: 'config',
            page_language: '${i18n.languages[0]}',
            entry: '${this.props.match.params.eid}', 
            context: '${this.props.match.params.cid}',
            namespaces:{
              esterms: 'http://entryscape.com/terms/',
              peu: 'http://publications.europa.eu/resource/authority/'
            },

            blocks: [
              {
                block: 'dataserviceReferences2',
                extends: 'template',
                hl: '2',
                template: '{{#ifprop "dcat:servesDataset"}}' +
                  '  {{dataserviceForwardReferences hl="inherit:hl"}}' +
                  '{{/ifprop}}' +
                  '{{#ifprop "dcat:servesDataset" invert="true"}}' +
                  '  {{dataserviceBackwardReferences hl="inherit:hl"}}' +
                  '{{/ifprop}}',
              },
              {
                block: 'accessRightsIndicator',
                extends: 'template',
                template: '{{#ifprop "dcterms:accessRights"}}' +
                  '{{#eachprop "dcterms:accessRights"}}<span class="esbIndicator" title="{{description}}">' +
                  '{{#ifprop "dcterms:accessRights" uri="peu:access-right/PUBLIC"}}' +
                  '<i class="fas fa-lock-open"></i>{{/ifprop}}' +
                  '{{#ifprop "dcterms:accessRights" uri="peu:access-right/NON_PUBLIC"}}' +
                  '<i class="fas fa-key"></i>{{/ifprop}}' +
                  '{{#ifprop "dcterms:accessRights" uri="peu:access-right/RESTRICTED"}}' +
                  '<i class="fas fa-lock"></i>{{/ifprop}}' +
                  '<span class="esbIndicatorLabel">{{label}}</span>{{/eachprop}}' +
                  '</span>{{/ifprop}}',
              },
              {
                block: 'architectureIndicator',
                extends: 'template',
                template: '{{#ifprop "dcterms:type"}}' +
                  '<span class="esbIndicator" title="TjÃ¤nstens arkitekturstil">' +
                  '<i class="fas fa-wrench"></i>' +
                  '<span class="text-5">{{#eachprop "dcterms:type"}}{{label}}{{separator}}{{/eachprop}}</span></span>' +
                  '{{/ifprop}}',
              },
              {
                block: 'periodicityIndicator',
                extends: 'template',
                template: '{{#eachprop "dcterms:accrualPeriodicity"}}<span class="esbIndicator" title="Uppdateringsfrekvens">' +
                  '<i class="fas fa-redo"></i>' +
                  '<span class="">{{label}}</span></span>{{/eachprop}}',
              },
              {
                block: 'licenseIndicator',
                loadEntry: true,
                run: function(node, data, items, entry) {
                  var v = entry.getMetadata().findFirstValue(null, 'dcterms:license');
                  if (v.indexOf("http://creativecommons.org/") === 0) {
                    var variant;
                    if (v === "http://creativecommons.org/publicdomain/zero/1.0/") {
                      variant = "zero";
                    } else if (v.indexOf("http://creativecommons.org/licenses/") === 0) {
                      variant = v.substr(36).split('/')[0];
                    } else {
                      return; // Unknown cc version.
                    }
                    node.innerHTML = '<span class="esbIndicator" title="Licens från Creative Commons">' +
                      '<i class="license-icon fab fa-creative-commons"></i>' +
                      '<span class="esbIndicatorLabel">' + variant.toLowerCase() + '</span></span>';
                  }
                },
              },
              {
                block: 'dataserviceForwardReferences2',
                extends: 'list',
                relation: 'dcat:servesDataset',
                hl: '2',
                limit: '3',
                listhead: '<h{{hl}}>DatamÃ¤ngder som anvÃ¤nder detta API</h{{hl}}>',
                rowhead: '{{link namedclick="dataset"}}',
              },
              {
                block: 'dataserviceBackwardReferences2',
                extends: 'list',
                relationinverse: 'dcat:accessService',
                layout: 'raw',
                hl: '2',
                limit: '3',
                listhead: '<h{{hl}}>DatamÃ¤ngder som anvÃ¤nder detta API</h{{hl}}>',
                rowhead: '{{link relationinverse="dcat:distribution" namedclick="dataset"}}',
              },
            
            ]
          }]
          </script>              

          <script src="${
            i18n.languages[0] == 'sv'
              ? this.props.env.ENTRYSCAPE_OPENDATA_SV_URL
              : this.props.env.ENTRYSCAPE_OPENDATA_EN_URL
          }"></script>
          <script src="${
            this.props.env.ENTRYSCAPE_BLOCKS_URL
          }"></script>                       
          `,
          {
            done: function () {},
          }
        );
      }
    }
  }

  setFocus() {
    if (this.headerRef.current) {
      this.headerRef.current.setFocusOnMenuButton();
    }
  }

  render() {
    const { location } = this.props;
    let uri = new URLSearchParams(location.search);

    return (
      <EntrystoreProvider
        env={this.props.env}
        cid={this.props.match.params.cid}
        eid={this.props.match.params.eid}
        entrystoreUrl={this.props.env.ENTRYSCAPE_DATASETS_PATH}
      >
        <EntrystoreContext.Consumer>
          {(entry) => (
            <QueryParamProvider params={uri}>
              <PageMetadata
                seoTitle={`${entry.title} - Sveriges dataportal`}
                seoDescription=""
                seoImageUrl=""
                seoKeywords=""
                robotsFollow={true}
                robotsIndex={true}
                lang={i18n.languages[0]}
                canonicalUrl={
                  entry && entry.title
                    ? `${this.props.env.CANONICAL_URL}/${
                        i18n.languages[0]
                      }/${i18n.t('routes|dataservices|path')}/${
                        this.props.match.params.cid
                      }_${this.props.match.params.eid}/${slugify(entry.title)}`
                    : ''
                }
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
                  <MainContent
                    className="detailpage main-container"
                    flex="1 1 auto"
                  >
                    <StaticBreadcrumb
                      env={this.props.env}
                      staticPaths={[
                        {
                          path: this.referredSearch,
                          title: i18n.t('routes|datasets|title'),
                        },
                        {
                          path: `/${i18n.languages[0]}/${i18n.t(
                            'routes|dataservices|path'
                          )}/${this.props.match.params.cid}_${
                            this.props.match.params.eid
                          }/${slugify(entry.title)}`,
                          title: entry.title,
                        },
                      ]}
                    />
                    <div className="detailpage__wrapper">
                      {/* Left column */}
                      <div className="detailpage__wrapper--leftcol content">
                        <h1 className="text-2">{entry.title}</h1>

                        {/* Publisher */}
                        <script
                          type="text/x-entryscape-handlebar"
                          data-entryscape="true"
                          data-entryscape-component="template"
                          dangerouslySetInnerHTML={{
                            __html: `
                          <p class="text-5">
                            {{text relation="dcterms:publisher"}} 
                          <p>
                          `,
                          }}
                        ></script>

                        {/* Indicators */}
                        <div className="row indicators">
                          <div
                            data-entryscape="architectureIndicator"
                            className="architectureIndicator"
                          ></div>
                          <div
                            data-entryscape="accessRightsIndicator"
                            className="accessRightsIndicator"
                          ></div>
                          <div
                            data-entryscape="periodicityIndicator"
                            className="architectureIndicator"
                          ></div>
                          <div
                            data-entryscape="licenseIndicator"
                            className="licenseIndicator"
                          ></div>
                        </div>

                        {/* Description */}
                        <script
                          type="text/x-entryscape-handlebar"
                          data-entryscape="true"
                          data-entryscape-component="template"
                          dangerouslySetInnerHTML={{
                            __html: `
                          <div class="description text-5">{{text content="\${dcterms:description}"}}</div>
                          `,
                          }}
                        ></script>

                        <script
                          type="text/x-entryscape-handlebar"
                          data-entryscape="true"
                          data-entryscape-component="template"
                          dangerouslySetInnerHTML={{
                            __html: `
                        
                        <div class="dataservice__access">
                          {{viewMetadata 
                              template="dcat:DataService"
                              filterpredicates="dcterms:title,dcterms:publisher,dcterms:type,dcterms:license,dcterms:accessRights,dcat:landingPage,foaf:page"
                            }}
                        </div>
                        `,
                          }}
                        ></script>

                        <div className="contact__publisher hbbr">
                          <h3 className="text-4">
                            {i18n.t('pages|datasetpage|contact-publisher')}
                          </h3>
                          <p className="text-5">
                            {i18n.t('pages|datasetpage|contact-publisher-text')}
                            {i18n.t(
                              'pages|datasetpage|contact-publisher-text2'
                            )}{' '}
                            <a
                              className="text-5-link"
                              href="https://community.dataportal.se/"
                            >
                              community
                            </a>
                            .
                          </p>
                        </div>
                      </div>

                      {/* Right column */}
                      <div className="detailpage__wrapper--rightcol hbbr">
                        <div className="detailpage__wrapper--rightcol-info text-6">
                          <h2 className="text-5-bold">
                            {i18n.t('pages|dataservicepage|api')}
                          </h2>

                          <script
                            type="text/x-entryscape-handlebar"
                            data-entryscape="true"
                            data-entryscape-component="template"
                            dangerouslySetInnerHTML={{
                              __html: `
                                <div class="dataservice_moreinfo">
                                  {{viewMetadata 
                                      template="dcat:DataService"
                                      filterpredicates="dcterms:title,dcterms:publisher,dcat:endpointURL"
                                    }}
                                </div>
                                `,
                            }}
                          ></script>
                        </div>

                        {/* <div className="detailpage__wrapper--rightcol-info text-6">
                          <h2 className="text-5-bold">
                            {i18n.t('pages|datasetpage|catalog')}
                          </h2>
                        </div> */}
                      </div>
                    </div>
                  </MainContent>
                </ErrorBoundary>
                <Footer onToTopButtonPushed={this.setFocus} />
              </Box>
            </QueryParamProvider>
          )}
        </EntrystoreContext.Consumer>
      </EntrystoreProvider>
    );
  }
}
