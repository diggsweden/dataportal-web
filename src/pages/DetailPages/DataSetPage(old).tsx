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
import { EntrystoreProvider, EntrystoreContext } from '../../components/EntrystoreProvider'
import { PageProps } from '../PageProps'

const MainContent = Box.withComponent('main');

export class DataSetPage extends React.Component<
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
          window.__entryscape_config = {
            page_language: '${i18n.languages[0]}',
            entry: '${this.props.match.params.eid}', 
            context: '${this.props.match.params.cid}'
          }
          </script>                      
          <script src="${
            this.props.env.ENTRYSCAPE_BLOCKS_URL
              ? this.props.env.ENTRYSCAPE_BLOCKS_URL
              : 'https://dataportal.azureedge.net/cdn/blocks.0.18.2.app.js'
          }"></script>                  
          `,
          {
            done: function() {},
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
      <EntrystoreProvider env={this.props.env} cid={this.props.match.params.cid} eid={this.props.match.params.eid}>
        <EntrystoreContext.Consumer>        
          {entry => (
            <QueryParamProvider params={uri}>
            <PageMetadata
              seoTitle={`${entry.title} - Sveriges dataportal`}          
              seoDescription=""
              seoImageUrl=""
              seoKeywords=""
              robotsFollow={true}
              robotsIndex={true}
              lang={i18n.languages[0]}
              canonicalUrl={entry && entry.title? `${this.props.env.CANONICAL_URL}/${i18n.languages[0]}/datasets/${this.props.match.params.cid}_${this.props.match.params.eid}/${slugify(entry.title)}` : ''}
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
                    <div
                      className="col span_8 boxed dataset"
                      data-animation=""
                      data-delay="0"
                    >
                      {/* {(this.props.history && this.props.history.length > 0 &&
                        <a onClick={() => this.props.history.goBack()} className="back-to-search">
                          Tillbaka
                        </a>
                      )} */}

                      {/* <span className="bottom-line"></span> */}

                      <script
                        type="text/x-entryscape-handlebar"
                        data-entryscape="true"
                        data-entryscape-component="template"
                        dangerouslySetInnerHTML={{
                          __html: `
                          <span>{{#eachprop "dcat:theme"}}<span class="tema md5_{{md5}}">{{label}}</span>{{/eachprop}}</span>
                          `,
                        }}
                      ></script>
                      
                      <h1 data-entryscape="text"></h1>

                      <script
                        type="text/x-entryscape-handlebar"
                        data-entryscape="true"
                        data-entryscape-component="template"
                        dangerouslySetInnerHTML={{
                          __html: `
                          <div class="publisher-name">
                          <p class="text-5">
                            {{text relation="dcterms:publisher"}} 
                          <p>
                          `,
                        }}
                      ></script>

                      <script
                        type="text/x-entryscape-handlebar"
                        data-entryscape="true"
                        data-entryscape-component="template"
                        dangerouslySetInnerHTML={{
                          __html: `
                          <div class="description">{{text content="\${dcterms:description}"}}</div>
                          `,
                        }}
                      ></script>

                      <h2 id="text-load1" className="data-header text-3">
                        {i18n.t('pages|datasetpage|download-dataset')}
                      </h2>

                      <script
                        type="text/x-entryscape-handlebar"
                        data-entryscape="true"
                        data-entryscape-component="template"
                        dangerouslySetInnerHTML={{
                          __html: `
                        

                        {{#list relation="dcat:distribution" template="dcat:OnlyDistribution" onecol="true" expandTooltip="Mer information" unexpandTooltip="Mindre information"}}
                        
                              {{{{listbody}}}}
                                <div class="formats">{{body}}</div>
                              {{{{/listbody}}}}

                              {{{{listplaceholder}}}}
                                <div class="alert alert-info" role="alert">Denna datamängd har inga dataresurser angivna</div>
                              {{{{/listplaceholder}}}}

                              {{{{listhead}}}}
                              {{{{/listhead}}}}

                              {{{{rowhead}}}}
                                
                                {{#ifprop "dcat:downloadURL"}}
                                  <a aria-label="Ladda ned distribution" href=\'{{prop "dcat:downloadURL"}}\' class="pull-right btn btn-sm btn-default" role="button" target="_blank"> Ladda ned</a>                              
                                {{/ifprop}}                                                                                
                              
                                <div class="accordion-col">
                                  <span title="Titel på distribution" class="resourceLabel">{{text fallback="<span class=\'distributionNoName\'>Ingen titel given</span>"}}</span>
                                  <span title="Licens" class="licence text-5">
                                  {{prop "dcterms:license" render="label"}}
                                  </span>

                                  <div class="format-div">
                                      <span title="Format" class="format label formatLabel label-success md5_{{prop "dcterms:format" render="md5"}}"
                                      title="{{prop "dcterms:format"}}">{{prop "dcterms:format" render="label"}}</span>\
                                  </div>
                                  </div>

                                {{{{/rowhead}}}}

                        {{/list}}
                        
                        `,
                        }}
                      ></script>

                      <h2 id="text-load2" className="data-header">
                        {i18n.t('pages|datasetpage|about-dataset')}
                      </h2>

                      <script
                        type="text/x-entryscape-handlebar"
                        data-entryscape="true"
                        data-entryscape-component="template"
                        dangerouslySetInnerHTML={{
                          __html: `
                        
                        <div class="viewMetadata">
                          {{viewMetadata 
                              template="dcat:OnlyDataset" 
                              filterpredicates="dcterms:title,dcterms:description,dcterms:publisher"}}
                        </div>

                        `,
                        }}
                      ></script>
                    </div>

                    <div
                      className="col span_4 boxed about-dataset"
                      data-animation=""
                      data-delay="0"
                    >
                      <span className="bottom-line"></span>

                      <span
                        className="entryscape"
                        data-entryscape="true"
                        data-entryscape-block="view"
                        data-entryscape-template="dcat:foaf:Agent"
                        data-entryscape-filterpredicates="foaf:name"
                        data-entryscape-use="_org"
                      ></span>

                      <div className="information-row">
                        <span id="text-load3" className="catalog-span">
                          {' '}
                          {i18n.t('pages|datasetpage|catalog')}
                        </span>
                        <script
                          type="text/x-entryscape-handlebar"
                          data-entryscape="true"
                          data-entryscape-block="template"
                          dangerouslySetInnerHTML={{
                            __html: `<span class="catalog-name">{{text relationinverse="dcat:dataset" define="cat"}}</span>`,
                          }}
                        ></script>
                      </div>

                      <script
                        type="text/x-entryscape-handlebar"
                        data-entryscape="true"
                        data-entryscape-block="template"
                        dangerouslySetInnerHTML={{
                          __html: `{{viewMetadata 
                              relationinverse="dcat:dataset" 
                              onecol=true 
                              template="dcat:OnlyCatalog" 
                              use="cat" 
                              filterpredicates="dcterms:title"}}`,
                        }}
                      ></script>

                      <script
                        type="text/x-entryscape-handlebar"
                        data-entryscape="true"
                        data-entryscape-block="template"
                        dangerouslySetInnerHTML={{
                          __html: `
                        <a class="download-rdf" target="_blank" href="{{metadataURI}}?recursive=dcat">Ladda ner som RDF</a>
                        `,
                        }}
                      ></script>
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
