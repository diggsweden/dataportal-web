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

export class ConceptPage extends React.Component<
  PageProps,
  { scriptsAdded: Boolean; scriptsLoaded: Boolean }
> {
  private headerRef: React.RefObject<Header>;
  private postscribe: any;
  private referredSearch: string = `/${i18n.languages[0]}/${i18n.t(
    'routes|concepts|path'
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
          'routes|concepts|path'
        )}/?${window.location.hash.split('ref=?')[1]}`;

      window.onpopstate = (e: any) => {
        window.location.reload();
      };
    }

    this.addScripts();
  }

  addScripts() {
    if (typeof window !== 'undefined') {
      this.postscribe = (window as any).postscribe;

      if (this.props.match.params.eid && this.props.match.params.cid) {
        this.postscribe(
          '#scriptsPlaceholder',
          `                     
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              this.props.env.ENTRYSCAPE_TERMS_PATH
                ? this.props.env.ENTRYSCAPE_TERMS_PATH
                : 'editera.dataportal.se'
            }\/store'          
          };
          </script>

          <script> 
          
          window.__entryscape_config = {
            block: 'config',
            page_language: '${i18n.languages[0]}',
            entry: '${this.props.match.params.eid}',              
            context: '${this.props.match.params.cid}',
            entrystore: 'https://${
              this.props.env.ENTRYSCAPE_TERMS_PATH
                ? this.props.env.ENTRYSCAPE_TERMS_PATH
                : 'editera.dataportal.se'
            }/store',
            clicks: {
              concept: 'details',
              concepts: 'index',
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
                click: 'terminology',
                class: 'text-5-link',
                content: '\${dcterms:title}'
              },
              {
                block: 'broader',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{maybeBroaderButton}}{{/ifprop}}'
              },
              {
                block: 'narrower',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{maybeNarrowerButton}}{{/ifprop}}'
              },
              {
                block: 'related',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{maybeRelatedButton}}{{/ifprop}}'
              },
              {
                block: 'terminology-size',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}{{conceptResults}}{{/ifprop}}'
              },
              {
                block: 'concept-hierarchy-header',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<span className="hbbr text-4 concept_hierarchy--header">Visualisering av underordnade begrepp</span>{{/ifprop}}'
              },
              {
                block: 'concept-hierarchy',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<div class="concept_hierarchy hbbr">{{hierarchy scale="1.7"}}</div>{{/ifprop}}'
              },
              {
                block: 'maybeBroaderButton',
                extends: 'template',
                template: '{{#ifprop "skos:broader"}}<h2 class="text-4">Överordnade begrepp</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:broader"}}{{broaderList}}{{/ifprop}}' +
                  '{{#ifprop "skos:broader" invert="true"}}<h2 class="text-4">Överordnade begrepp</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:broader" invert="true"}}<span class="text-5">Har inga överordnade begrepp</span>{{/ifprop}}'
              },
              {
                block: 'maybeNarrowerButton',
                extends: 'template',
                template:'{{#ifprop "skos:narrower"}}<h2 class="text-4">Underordnade begrepp</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:narrower"}}{{narrowerList}}{{/ifprop}}' +
                  '{{#ifprop "skos:narrower" invert="true"}}<h2 class="text-4">Underordnade begrepp</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:narrower" invert="true"}}<span class="text-5">Har inga underordnade begrepp</span>{{/ifprop}}'
              },
              {
                block: 'maybeRelatedButton',
                extends: 'template',
                template:'{{#ifprop "skos:related"}}<h2 class="text-4">Relaterade begrepp</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:related"}}{{relatedList}}{{/ifprop}}' +
                  '{{#ifprop "skos:related" invert="true"}}<h2 class="text-4">Relaterade begrepp</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:related" invert="true"}}<span class="text-5">Har inga relaterade begrepp</span>{{/ifprop}}'
              },
              {
                block: 'broaderList',
                extends: 'link',
                relation: 'skos:broader',
                click: './',
                class: 'text-5-link',
                content: '\${skos:prefLabel}',
              },
              {
                block: 'narrowerList',
                extends: 'list',
                layout: 'raw',
                rowhead: '{{link namedclick="concept"}}',
                relation: 'skos:narrower',
                click: './',
                class: 'text-5-link',
                limit: 20,
                content: '\${skos:prefLabel}'
              },
              {
                block: 'relatedList',
                extends: 'list',
                layout: 'raw',
                rowhead: '{{link namedclick="concept"}}',
                relation: 'skos:related',
                click: './',
                limit: 20,
                class: 'text-5-link',
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
                block: 'overconcept',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>Överordnat begrepp</h2>{{/ifprop}}' +
                '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{broaderButton}}{{/ifprop}}'
              },	  
              {
                block: 'underconcept',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>Underordnade begrepp</h2>{{/ifprop}}'
              },
              {
                block: 'underconcept2',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>Underordnade begrepp</h2>{{/ifprop}}' +
                '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{narrowerButton}}{{/ifprop}}'
              },	 
              {
                block: 'relatedconcept',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>Relaterade begrepp</h2>{{/ifprop}}'
              },
              {
                block: 'relatedconcept2',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>Relaterade begrepp</h2>{{/ifprop}}' +
                '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{relatedButton}}{{/ifprop}}'
              },	 
              {
                block: 'terminology',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<span className="terminology__label text-6-bold">Terminologi</span>{{/ifprop}}'
                },	  
                {
                  block: 'terminology-numbers',
                  extends: 'template',
                  template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<span className="terminology__label text-6-bold">Antal begrepp inom terminologin</span>{{/ifprop}}'
                  },
                  {
                    block: 'toppbegrepp',
                    extends: 'template',
                    template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<span class="toplist-header  text-4">Begrepp i terminologins första nivå</span>{{toppbegreppLista}}{{/ifprop}}'
                  },
                  {
                    block: 'pref-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:prefLabel"}}<span>Föredragen term</span>{{/ifprop}}'
                  },
                  {
                    block: 'alt-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:altLabel"}}<span>Alternativ term</span>{{/ifprop}}'
                  },
                  {
                    block: 'hidden-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:hiddenLabel"}}<span>Dold term</span>{{/ifprop}}'
                  },
                  {
                    block: 'example-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:example"}}<span>Exempel</span>{{/ifprop}}'
                  },
                  {
                    block: 'history-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:historyNote"}}<span>Historisk anmärkning</span>{{/ifprop}}'
                  },
                  {
                    block: 'editorial-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:editorialNote"}}<span>Redaktionell anmärkning</h2>{{/ifprop}}'
                  },
                  {
                    block: 'note-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:note"}}<span>Anmärkning</span>{{/ifprop}}'
                  },
                  {
                    block: 'exactMatch-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:exactMatch"}}<span>Har exakt motsvarande begrepp</span>{{/ifprop}}'
                  },
                  {
                    block: 'closeMatch-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:closeMatch"}}<span>Har snarlikt motsvarande begrepp</span>{{/ifprop}}'
                  },
                  {
                    block: 'relatedMatch-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:relatedMatch"}}<span>Har relaterat motsvarande begrepp</span>{{/ifprop}}'
                  },
                  {
                    block: 'broadMatch-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:broadMatch"}}<span>Har överordnat motsvarande begrepp</span>{{/ifprop}}'
                  },
                  {
                    block: 'narrowMatch-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:narrowMatch"}}<span>Har underordnat motsvarande begrepp</span>{{/ifprop}}'
                  },
                  {
                    block: 'concept-head',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<span class="text-5-bold">Om terminologi</h2>{{/ifprop}}'
                  },
                  {
                    block: 'term-head',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<span class="text-5-bold">Om begrepp</h2>{{/ifprop}}'
                  },
              {
                block: 'toppbegreppLista',
                extends: 'list',
                namedclick: 'test',
                relation: "skos:hasTopConcept",
                layout: 'raw',
                limit: 20,
                rowhead: '{{link namedclick="concept"}}',
                click: ''
              },       
              {
                block: 'conceptResults',
                extends: 'results',
                use: 'conceptSearchInTemplate',
                templateFilter: '{{resultsize}} begrepp',
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
        cid={this.props.match.params.cid}
        eid={this.props.match.params.eid}
        entrystoreUrl={this.props.env.ENTRYSCAPE_TERMS_PATH}
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
                    ? `${this.props.env.CANONICAL_URL}/${i18n.languages[0]}/${
                        i18n.languages[0]
                      }/${i18n.t('routes|concepts|path')}/${
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
                    flex="1 1 auto"
                    className="detailpage main-container"
                  >
                    <StaticBreadcrumb
                      env={this.props.env}
                      staticPaths={[
                        {
                          path: this.referredSearch,
                          title: i18n.t('routes|concepts|title'),
                        },
                        {
                          path: `/${i18n.languages[0]}/${i18n.t(
                            'routes|concepts|path'
                          )}/${this.props.match.params.cid}_${
                            this.props.match.params.eid
                          }/${slugify(entry.title)}`,
                          title: '',
                        },
                      ]}
                    />
                    <div className="detailpage__wrapper">
                      {/* Left column */}
                      {/* Left column */}
                      <div className="detailpage__wrapper--leftcol content">
                        <span className="text-6-bold beta_badge--xl">BETA</span>
                        <h1 className="text-2 terminology_header">
                          <span data-entryscape="hemvist"></span>
                          <span
                            data-entryscape="text"
                            data-entryscape-content="${skos:prefLabel}"
                            data-entryscape-define="concept"
                          ></span>

                          <span
                            data-entryscape="text"
                            data-entryscape-content="${dcterms:title}"
                            data-entryscape-define="terminology"
                          ></span>
                        </h1>

                        <p className="description text-5">
                          <span
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:definition}"
                            data-entryscape-use="concept"
                          ></span>

                          <span
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${dcterms:description}"
                            data-entryscape-use="terminology"
                          ></span>
                        </p>

                        <div className="column">
                          <span data-entryscape="alt-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:altLabel}"
                            data-entryscape-use="concept"
                          ></span>

                          <span data-entryscape="example-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:example}"
                            data-entryscape-use="concept"
                          ></span>
                        </div>

                        <div className="terminology-group">
                          <span data-entryscape="broader"></span>
                        </div>

                        <div className="terminology-group">
                          <span data-entryscape="narrower"></span>
                        </div>

                        <div className="terminology-group">
                          <span
                            data-entryscape="related"
                            data-entryscape-click=""
                          ></span>
                        </div>

                        {/* <span
                          data-entryscape="view"
                          data-entryscape-filterpredicates="skos:narrower,skos:broader,skos:inScheme,skos:topConceptOf,core:definition"
                        ></span> */}

                        <div className="column">
                          {/* <span data-entryscape="pref-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:prefLabel}"
                            data-entryscape-use="concept"
                          ></span> */}

                          {/* <span data-entryscape="alt-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:altLabel}"
                            data-entryscape-use="concept"
                          ></span> */}

                          {/* <span data-entryscape="hidden-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:hiddenLabel}"
                            data-entryscape-use="concept"
                          ></span> */}

                          {/* <h2>Anmärkningar</h2> */}

                          <span data-entryscape="history-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:historyNote}"
                            data-entryscape-use="concept"
                          ></span>

                          <span data-entryscape="editorial-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:editorialNote}"
                            data-entryscape-use="concept"
                          ></span>

                          <span data-entryscape="note-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:note}"
                            data-entryscape-use="concept"
                          ></span>

                          {/* <span data-entryscape="note-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:note}"
                            data-entryscape-use="concept"
                          ></span> */}

                          {/* <span data-entryscape="exactMatch-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:exactMatch}"
                            data-entryscape-use="concept"
                          ></span>

                          <span data-entryscape="closeMatch-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:closeMatch}"
                            data-entryscape-use="concept"
                          ></span>

                          <span data-entryscape="relatedMatch-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:relatedMatch}"
                            data-entryscape-use="concept"
                          ></span>

                          <span data-entryscape="broadMatch-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:broadMatch}"
                            data-entryscape-use="concept"
                          ></span>

                          <span data-entryscape="narrowMatch-Label"></span>
                          <span
                            className="concept-detail"
                            data-entryscape="text"
                            data-entryscape-fallback=""
                            data-entryscape-content="${skos:narrowMatch}"
                            data-entryscape-use="concept"
                          ></span> */}

                          <span
                            className="terminology__top-concepts text-6"
                            data-entryscape="alt-term"
                          ></span>
                        </div>

                        <span
                          className="terminology__top-concepts text-6"
                          data-entryscape="toppbegrepp"
                        ></span>

                        <span
                          className="conceptsearch"
                          data-entryscape="conceptSearchInTemplate"
                        ></span>

                        {/* <h2 className="text-4">
                          Visualisering av underordnade begrepp
                        </h2>
                        <div
                          className="concept_hierarchy"
                          data-entryscape="hierarchy"
                          data-entryscape-scale="1.7"
                        ></div> */}
                      </div>

                      {/* Right column */}
                      <div className="detailpage__wrapper--rightcol hbbr">
                        <div className="detailpage__wrapper--rightcol-info text-6">
                          <h2 className="text-5-bold">
                            {/* {i18n.t('pages|datasetpage|about-dataset')} */}
                            <span data-entryscape="term-head"></span>
                            <span data-entryscape="concept-head"></span>
                          </h2>

                          <span
                            className="text-6 terminology"
                            data-entryscape="terminology-numbers"
                          ></span>
                          <span
                            className="text-6 terminology-numbers"
                            data-entryscape="terminology-size"
                          ></span>

                          <span
                            className="text-6 terminology"
                            data-entryscape="terminology"
                          ></span>

                          <span
                            className="terminology__path text-6"
                            data-entryscape="terminologyButton"
                          ></span>

                          <script
                            type="text/x-entryscape-handlebar"
                            data-entryscape="true"
                            data-entryscape-component="template"
                            dangerouslySetInnerHTML={{
                              __html: `
                                    <div class="terminilogy__download-wrapper">
                                    <span class="terminology__label text-6-bold">
                                      Nedladdning
                                    </span>
      
                                  <div class="terminology__download-links text-6">
                                    <a
                                      class="terminology__download-link"
                                      href="{{ metadataURI}}"
                                      target="_blank"
                                    >
                                      RDF/XML
                                    </a>
      
                                    <a
                                      class="terminology__download-link"
                                      href="{{ metadataURI }}?format=text/turtle"
                                      target="_blank"
                                    >
                                      TURTLE
                                    </a>
      
                                    <a
                                      class="terminology__download-link"
                                      href="{{ metadataURI }}?format=text/n-triples"
                                      target="_blank"
                                    >
                                      N-TRIPLES
                                    </a>
      
                                    <a
                                      class="terminology__download-link"
                                      href="{{ metadataURI }}?format=application/ld+json"
                                      target="_blank"
                                    >
                                      JSON-LD
                                    </a>
                                  </div>
                                  </div>
                                  `,
                            }}
                          ></script>
                        </div>
                      </div>
                    </div>
                    <div className="detailpage__wrapper--fullwith">
                      <div
                        data-entryscape="concept-hierarchy-header"
                        className="concept-hierarchy-header"
                      ></div>

                      <div
                        data-entryscape="concept-hierarchy"
                        data-entryscape-scale="1.7"
                      ></div>

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
