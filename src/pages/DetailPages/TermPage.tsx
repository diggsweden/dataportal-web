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

const MainContent = Box.withComponent('main');

export interface TermPageProps
  extends RouteComponentProps<any, RouterContext> {
    env: EnvSettings;
  }

export class TermPage extends React.Component<
  TermPageProps,
  { scriptsAdded: Boolean; scriptsLoaded: Boolean }
> {
  private headerRef: React.RefObject<Header>;
  private postscribe: any;

  constructor(props: TermPageProps) {
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

      this.postscribe = (window as any).postscribe;

      if(this.props.match.params.eid && this.props.match.params.cid)
      {
        this.postscribe(
          '#scriptsPlaceholder',
          `                     
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${this.props.env.ENTRYSCAPE_TERMS_PATH? this.props.env.ENTRYSCAPE_TERMS_PATH : 'editera.dataportal.se'}\/store'          
          };
          </script>

          <script> 
          
          window.__entryscape_config = {
            block: 'config',
            page_language: '${i18n.languages[0]}',
            entry: '${this.props.match.params.eid}',              
            context: '${this.props.match.params.cid}',
            entrystore: 'https://${this.props.env.ENTRYSCAPE_TERMS_PATH? this.props.env.ENTRYSCAPE_TERMS_PATH : 'editera.dataportal.se'}/store',
            clicks: {
              concept: 'details.html',
              concepts: 'index.html',
              test: 'test.html',
            },
            collections: [
              {
                type: 'facet',
                name: 'terminology',
                label: 'Terminologier',
                property: 'skos:inScheme',
                nodetype: 'uri',
                limit: 10,
              }],
            blocks: [
              {
                block: 'terminologyButton',
                extends: 'link',
                relation: 'skos:inScheme',
                click: 'terminology.html',
                class: 'btn btn-default secondaryBtn',
                content: '\${dcterms:title}'
              },
              {
                block: 'maybeBroaderButton',
                extends: 'template',
                template: '{{#ifprop "skos:broader"}}{{broaderButton}}{{/ifprop}}' +
                  '{{#ifprop "skos:broader" invert="true"}} Detta begrepp är överst i terminologin{{/ifprop}}'
              },
              {
                block: 'broaderButton',
                extends: 'link',
                relation: 'skos:broader',
                click: './',
                class: 'btn btn-default secondaryBtn',
                content: '\${skos:prefLabel}'
              },
              {
                block: 'conceptSearch',
                extends: 'searchList',
                rdftype: 'skos:Concept',
                rdformsid: 'skosmos:concept',
                initsearch: true,
                facets: true,
                headless: true,
                rowhead: '{{link class="float-right btn btn-sm btn-default primaryBtn" content="Gå till begrepp" namedclick="concept"}}' +
                  '{{link class="float-right btn btn-outline-secondary secondaryBtn" click="terminology.html" relation="skos:inScheme" }}' +
                  '<h2>{{text namedclick="concept"}}</h2>' +
                  '<div class="esbDescription">{{ text content="\${skos:definition}" }}</div>',
                limit: 8
              },
              {
                block: 'conceptSearchInTemplate',
                extends: 'searchList',
                define: 'conceptSearchInTemplate',
                placeholder: "Sök efter begrepp ...",
                headless: false,
                rowhead: '{{link class="float-right btn btn-sm btn-default primaryBtn" content="Gå till begrepp" namedclick="concept"}}' +
                  '<h2>{{text namedclick="concept"}}</h2>' +
                  '<div class="esbDescription">{{ text content="\${skos:definition}" }}</div>',
                rdftype: 'skos:Concept',
                rdformsid: 'skosmos:concept',
                initsearch: true,
                limit: 8
              },
              {
                block: 'conceptResults',
                extends: 'results',
                use: 'conceptSearchInTemplate',
                templateFilter: '{{resultsize}} matchande begrepp i terminologin',
                templateFilterNoResults: 'Din sökning matchar inga begrepp i denna terminologi',
                templateNoFilter: '{{resultsize}} begrepp i terminologin',
              },
              {
                block: 'indexLink',
                extends: 'template',
                htemplate: '<a class="btn btn-default primaryBtn" href="/theme/begrepp">' +
                  'Tillbaka till sök' +
                  '</a>',
              },
            ],
            type2template: {
              'skos:Concept': 'skosmos:concept',
            },
          };

          </script>
          
          <script src="${this.props.env.ENTRYSCAPE_BLOCKS_URL? this.props.env.ENTRYSCAPE_BLOCKS_URL : 'https://dataportal.azureedge.net/cdn/blocks.0.18.2.app.js'}"></script>          
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
      <QueryParamProvider params={uri}>
        <PageMetadata
          seoTitle="Datamängd - Sveriges dataportal"
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
                <div
                  className="col span_4 boxed about-dataset concept"
                  data-animation=""
                  data-delay="0"
                >
                  <h1 className="text-1">
                    <span
                      data-entryscape="text"
                      data-entryscape-content="${skos:prefLabel}"
                      data-entryscape-define="concept"
                    ></span>
                  </h1>

                  <p className="description">
                    <span
                      data-entryscape="text"
                      data-entryscape-fallback="Ingen definition given för begreppet."
                      data-entryscape-content="${skos:definition}"
                      data-entryscape-use="concept"
                    ></span>
                  </p>

                  <div className="download-rdf rdfLinks">
                    <script type="text/x-entryscape-handlebar">
                      <span className="text-5-bold">Ladda ner begreppet:</span>

                      <div>
                        <a href="{{ metadataURI}}" target="_blank">
                          RDF/XML,
                        </a>

                        <a
                          href="{{ metadataURI }}?format=text/turtle"
                          target="_blank"
                        >
                          TURTLE,
                        </a>

                        <a
                          href="{{ metadataURI }}?format=text/n-triples"
                          target="_blank"
                        >
                          N-TRIPLES,
                        </a>

                        <a
                          href="{{ metadataURI }}?format=application/ld+json"
                          target="_blank"
                        >
                          JSON-LD
                        </a>
                      </div>
                    </script>
                  </div>

                  <div className="terminology-group">
                    <h2 className="text-5-bold">Terminologi</h2>
                    <span
                      className="terminology entryscape"
                      data-entryscape="terminologyButton"
                    ></span>

                    <h2 className="text-5-bold">Överliggande begrepp</h2>
                    <span
                      className="terminology entryscape"
                      data-entryscape="maybeBroaderButton"
                    ></span>
                  </div>

                  <div className="myrow">
                    <h2 className="text-5-bold">Underordnade begrepp</h2>
                    <div className="mycolumn">
                      <span
                        data-entryscape="list"
                        data-entryscape-listplaceholder="Det finns inga underordnade begrepp"
                        data-entryscape-click="details.html"
                        data-entryscape-relation="skos:narrower"
                      ></span>
                    </div>
                    <h2 className="text-5-bold">Relaterade begrepp</h2>
                    <div className="mycolumn">
                      <span
                        data-entryscape="list"
                        data-entryscape-listplaceholder="Det finns inga relaterade begrepp"
                        data-entryscape-click="details.html"
                        data-entryscape-relation="skos:related"
                      ></span>
                    </div>
                  </div>

                  <div className="concept-details">
                    <h2>Detaljer om begreppet</h2>
                    <span
                      data-entryscape="view"
                      data-entryscape-filterpredicates="skos:narrower,skos:broader,skos:inScheme,skos:topConceptOf"
                      data-entryscape-rdformsid="skosmos:concept"
                    ></span>
                  </div>
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
