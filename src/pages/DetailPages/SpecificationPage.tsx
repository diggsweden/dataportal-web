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

export class SpecificationPage extends React.Component<
  PageProps,
  { scriptsAdded: Boolean; scriptsLoaded: Boolean }
> {
  private headerRef: React.RefObject<Header>;
  private postscribe: any;
  private referredSearch: string = `/${i18n.languages[0]}/${i18n.t(
    'routes|specifications|path'
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
          'routes|specifications|path'
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

      if (this.props.match.params.curi) {
        this.postscribe(
          '#scriptsPlaceholder',

          `
          <script>
            var __entryscape_plugin_config = {
              entrystore_base: 'https:\/\/${
                this.props.env.ENTRYSCAPE_SPECS_PATH
                  ? this.props.env.ENTRYSCAPE_SPECS_PATH
                  : 'editera.dataportal.se'
              }\/store'            
            };
          </script>

          <script>
          window.__entryscape_config = {
            block: 'config',
            page_language: '${i18n.languages[0]}',
            //entry: '${this.props.match.params.eid}', 
            //context: '${this.props.match.params.cid}',
            routes: [              
              {
                regex:new RegExp('(\/*\/specifications\/)(.+)'),
                uri:'https://dataportal.se/specifications/${this.props.match.params.curi}',
                page_language: '${i18n.languages[0]}'
              }              
            ],
            entrystore: 'https://${
              this.props.env.ENTRYSCAPE_SPECS_PATH
                ? this.props.env.ENTRYSCAPE_SPECS_PATH
                : 'editera.dataportal.se'
            }/store',
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
                'https://${
                  this.props.env.ENTRYSCAPE_SPECS_PATH
                    ? this.props.env.ENTRYSCAPE_SPECS_PATH
                    : 'editera.dataportal.se'
                }/theme/templates/adms.json',
                'https://${
                  this.props.env.ENTRYSCAPE_SPECS_PATH
                    ? this.props.env.ENTRYSCAPE_SPECS_PATH
                    : 'editera.dataportal.se'
                }/theme/templates/prof.json',
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
                block: 'resourceDescriptors2',
                extends: 'list',
                relation: 'prof:hasResource',
                template: 'prof:ResourceDescriptor',
                expandTooltip: 'Mer information',
                unexpandTooltip: 'Mindre information',
                listbody: '<div class="specification__resource--body">{{body}}</div>',
                listplaceholder: '<div class="alert alert-info" role="alert">Denna specifikation har inga resurser.</div>',
                rowhead:'<span class="specification__resource--header text-4">{{text}}</span>' + 
                  '<span class="specification__resource--type text-5">{{prop "prof:hasRole" class="type" render="label"}}</span>' +
                  '<div class="specification__resource--description text-5 esbDescription">{{ text content="\${skos:definition}" }}</div>' +
                  '<a target="_blank" class="specification__resource--downloadlink text-5" href="{{resourceURI}}">${i18n.t('pages|specification_page|download')} {{prop "prof:hasRole" class="type" render="label"}}</a>',
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
          <script src="${
            this.props.env.ENTRYSCAPE_BLOCKS_URL
              ? this.props.env.ENTRYSCAPE_BLOCKS_URL
              : 'https://dataportal.azureedge.net/cdn/blocks.0.18.2.app.js'
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
        entryUri={`https://dataportal.se/specifications/${this.props.match.params.curi}`}
        entrystoreUrl={this.props.env.ENTRYSCAPE_SPECS_PATH}
      >
        <EntrystoreContext.Consumer>
          {(entry) => (
            <QueryParamProvider params={uri}>
              <PageMetadata
                seoTitle={`${entry.title} - ${i18n.t('common|seo-title')}`}
                seoDescription=""
                seoImageUrl=""
                seoKeywords=""
                robotsFollow={true}
                robotsIndex={true}
                lang={i18n.languages[0]}
                socialMeta={{
                  socialDescription : entry.description,
                  socialTitle : entry.title,
                  socialUrl :  entry && entry.title
                    ? `${this.props.env.CANONICAL_URL}/${
                        i18n.languages[0]
                      }/${i18n.t('routes|specifications|path')}/${
                        this.props.match.params.curi}`
                    : ''
                }}
                canonicalUrl={
                  entry && entry.title
                    ? `${this.props.env.CANONICAL_URL}/${
                        i18n.languages[0]
                      }/${i18n.t('routes|specifications|path')}/${
                        this.props.match.params.curi}`
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
                    flex="1 1 auto"
                    className="detailpage main-container"
                  >
                    <StaticBreadcrumb
                      env={this.props.env}
                      staticPaths={[
                        {
                          path: this.referredSearch,
                          title: i18n.t('routes|specifications|title'),
                        },
                        {
                          path: `/${i18n.languages[0]}/${i18n.t(
                            'routes|specifications|path'
                          )}/${this.props.match.params.curi}`,
                          title: entry.title,
                        },
                      ]}
                    />
                    <div className="detailpage__wrapper">
                      {/* Left column */}
                      <div className="detailpage__wrapper--leftcol content">
                        <span className="text-6-bold beta_badge--xl">BETA</span>

                        <h1 className="text-2">{entry.title}</h1>

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

                        <p className="text-5">
                          <span
                            data-entryscape="text"
                            data-entryscape-content="${dcterms:description}"
                          ></span>
                        </p>

                        <h2 className="text-3">{i18n.t('pages|specification_page|resource_specification')}</h2>
                        <div
                          className="specification__resource"
                          data-entryscape="resourceDescriptors2"
                          data-entryscape-rdftype= "prof:ResourceDescriptor"
                        ></div>

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
                          <h2 className="text-5-bold">{i18n.t('pages|specification_page|about_specification')}</h2>

                          <div
                            className="specificationDetails"
                            data-entryscape="view"
                            data-entryscape-rdformsid="prof:Profile"
                            data-entryscape-filterpredicates="dcterms:title,dcterms:description,dcat:distribution,dcterms:publisher,prof:hasResource,adms:prev"
                          ></div>
                        </div>
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
