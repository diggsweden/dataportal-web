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

export interface SpecificationPageProps
  extends RouteComponentProps<any, RouterContext> {
    env: EnvSettings;
  }

export class SpecificationPage extends React.Component<
  SpecificationPageProps,
  { scriptsAdded: Boolean; scriptsLoaded: Boolean }
> {
  private headerRef: React.RefObject<Header>;
  private postscribe: any;

  constructor(props: SpecificationPageProps) {
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

      if(this.props.match.params.eid && this.props.match.params.cid)
      {
        this.postscribe(
          '#scriptsPlaceholder',

          `
          <script>
            var __entryscape_plugin_config = {
              entrystore_base: 'https:\/\/${this.props.env.ENTRYSCAPE_SPECS_PATH? this.props.env.ENTRYSCAPE_SPECS_PATH : 'editera.dataportal.se'}\/store'            
            };
          </script>

          <script>
          window.__entryscape_config = {
            block: 'config',
            page_language: '${i18n.languages[0]}',
            entry: '${this.props.match.params.eid}', 
            context: '${this.props.match.params.cid}',
            entrystore: 'https://${this.props.env.ENTRYSCAPE_SPECS_PATH? this.props.env.ENTRYSCAPE_SPECS_PATH : 'editera.dataportal.se'}/store',
            clicks: {
              specification: 'details.html',
              specifications: 'index.html',
            },
            namespaces: {
              adms: 'http://www.w3.org/ns/adms#',
              prof: 'http://www.w3.org/ns/dx/prof/',
            },
            itemstore: {
              bundles: [
                'dcat',
                'https://${this.props.env.ENTRYSCAPE_SPECS_PATH? this.props.env.ENTRYSCAPE_SPECS_PATH : 'editera.dataportal.se'}/theme/templates/adms.json',
                'https://${this.props.env.ENTRYSCAPE_SPECS_PATH? this.props.env.ENTRYSCAPE_SPECS_PATH : 'editera.dataportal.se'}/theme/templates/prof.json',
              ],
            },
            collections: [
              {
                type: 'facet',
                name: 'theme',
                label: 'Theme',
                property: 'dcat:theme',
                nodetype: 'uri',
                templatesource: 'dcat:theme-isa',
              },
              {
                type: 'facet',
                name: 'keyword',
                label: 'Keyword',
                property: 'dcat:keyword',
                nodetype: 'literal',
              }],

            blocks: [
              {
                block: 'specificationSearch',
                extends: 'searchList',
                rdftype: ['dcterms:Standard', 'prof:Profile'],
                rdformsid: 'prof:Profile',
                initsearch: true,
                facets: true,
                headless: true,
                rowhead: '<h4>{{ link namedclick="specification" }}</h4>' +
                  '{{ text content="\${dcterms:description}" }}',
              },
              {
                block: 'resourceDescriptors',
                extends: 'list',
                relation: 'prof:hasResource',
                template: 'prof:ResourceDescriptor',
                expandTooltip: 'Mer information',
                unexpandTooltip: 'Mindre information',
                listbody: '<div class="formats">{{body}}</div>',
                listplaceholder: '<div class="alert alert-info" role="alert">Denna specifikation har inga resurser.</div>',
                rowhead: '<a target="_blank" class="float-right btn btn-sm btn-default primaryBtn" href="{{resourceURI}}">Gå till resurs</a>' +
                  '<h2>{{text}}</h2>' +
                  '{{prop "prof:hasRole" render="label"}}' +
                  '<div class="esbDescription">{{ text content="\${skos:definition}" }}</div>',
              },
              {
                block: 'indexLink',
                extends: 'template',
                htemplate: '<a class="btn btn-default primaryBtn" href="/theme/specs">' +
                  'Tillbaka till sök' +
                  '</a>',
              },
            ],

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
                  className="col span_8 boxed dataset"
                  data-animation=""
                  data-delay="0"
                >

                  <h1 className="text-1">
                    <span
                      data-entryscape="text"
                      data-entryscape-content="${dcterms:title}"
                      data-entryscape-define="specification"
                    ></span>
                  </h1>

                  <p className="description">
                    <span
                      data-entryscape="text"
                      data-entryscape-content="${dcterms:description}"
                      data-entryscape-use="specification"
                    ></span>
                  </p>

                  <div data-entryscape="resourceDescriptors"></div>

                  <h2 className="about-header">Om specifikation</h2>

                  <div
                    className="specificationDetails"
                    data-entryscape="view"
                    data-entryscape-rdformsid="prof:Profile"
                    data-entryscape-filterpredicates="dcterms:title,dcterms:description,dcat:distribution"
                  ></div>
                </div>

                <div
                  className="col span_4 boxed about-specification about-dataset"
                  data-animation=""
                  data-delay="0"
                >
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
