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

const MainContent = Box.withComponent('main');

export class DataServicePage extends React.Component<
  PageProps,
  { scriptsAdded: Boolean; scriptsLoaded: Boolean }
> {
  private headerRef: React.RefObject<Header>;
  private postscribe: any;

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
                : 'registrera.oppnadata.se'
            }\/store'          
          };
          window.__entryscape_config = [{

            block: 'config',
            page_language: '${i18n.languages[0]}',
            entry: '${this.props.match.params.eid}', 
            context: '${this.props.match.params.cid}',
            
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
                      }/datasets/${this.props.match.params.cid}_${
                        this.props.match.params.eid
                      }/${slugify(entry.title)}`
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
                    <div className="detailpage__wrapper">
                      {/* Left column */}
                      {/* Left column */}
                      <div className="detailpage__wrapper--leftcol content">
                        {/* <div data-entryscape="dataserviceView"></div> */}

                        <h1 className="text-2" data-entryscape="text"></h1>

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
                        {/* 
                        <span className="text-5-bold api-flag">
                          <i className="fas fa-cog"></i>API
                        </span> */}

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
