import React, { useEffect } from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import {
  EntrystoreProvider,
  EntrystoreContext,
} from '../../components/EntrystoreProvider';
import { PageProps } from '../PageProps';
import { StaticBreadcrumb } from 'components/Breadcrumb';

export const ConceptPage: React.FC<PageProps> = ({ env, match }) => {
  let postscribe: any;
  let referredSearch: string = `/${i18n.languages[0]}/${i18n.t(
    'routes|concepts|path'
  )}/?q=`;

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (typeof window !== 'undefined') {
      //check if reffereing search params is set to hash
      if (
        window.location &&
        window.location.hash &&
        window.location.hash.includes('ref=?')
      )
        referredSearch = `/${i18n.languages[0]}/${i18n.t(
          'routes|concepts|path'
        )}/?${window.location.hash.split('ref=?')[1]}`;

      window.onpopstate = (e: any) => {
        window.location.reload();
      };
    }

    addScripts();
  }, []);

  const addScripts = () => {
    if (typeof window !== 'undefined') {
      postscribe = (window as any).postscribe;

      if (match.params.curi) {
        postscribe(
          '#scriptsPlaceholder',
          `                     
          <script>          

          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_TERMS_PATH
                ? env.ENTRYSCAPE_TERMS_PATH
                : 'editera.dataportal.se'
            }\/store'          
          };
          </script>

          <script> 
          
          function getDataportalUri(resourceUri, isTerm){

            var path = '';                      

            if(resourceUri.indexOf('://') > -1)
            {
              var tmp = resourceUri.split("://");
              path = tmp[0] + '/' + tmp[1];
            }
            else
              path = resourceUri;              

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/externalconcepts/") > -1)
              if(isTerm)
                return "/${i18n.languages[0]}/externalterminology/" + path;
              else
                return "/${i18n.languages[0]}/externalconcepts/" + path;

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/concepts/") > -1)
            {
              var entryPath = resourceUri.replace("https://dataportal.se/concepts","");

              if(isTerm)
                return "/${i18n.languages[0]}/terminology" + entryPath;
              else
                return "/${i18n.languages[0]}/concepts" + entryPath;
            }

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/externalterminology/") > -1)                            
              return "/${i18n.languages[0]}/externalconcepts/" + path;

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/terminology/") > -1)    
            {
              var entryPath = resourceUri.replace("https://dataportal.se/concepts","");            
               return "/${i18n.languages[0]}/concepts" + entryPath;
            }

            return resourceUri;
          }

          function getLocalizedValue(metadataGraph, prop, lang) {
              var val = '';
              var fallbackLang = 'sv';
          
              var stmts = metadataGraph.find(null, prop);
              if (stmts.length > 0) {      
                var obj = {};
                for (var s = 0; s < stmts.length; s++) {
                  obj[stmts[s].getLanguage() || ''] = stmts[s].getValue();
                }
          
                if(typeof obj[lang] != 'undefined')
                {        
                  val = obj[lang];
                }
                else if(obj[fallbackLang] && fallbackLang != lang)
                {       
                  val = obj[fallbackLang];
                }
                else
                {        
                  val = Object.entries(obj)[0][1];
                }
              }
          
              return val;
          }

          
          window.__entryscape_config = [{
            block: 'config',
            page_language: '${i18n.languages[0]}',
            routes: [              
              {
                regex:new RegExp('(\/*\/externalconcepts\/)(.+)'),
                uri:'${match.params.scheme}://${match.params.curi}',
                page_language: '${i18n.languages[0]}'
              },             
              {
                regex:new RegExp('(\/*\/externalterminology\/)(.+)'),
                uri:'${match.params.scheme}://${match.params.curi}',
                page_language: '${i18n.languages[0]}'
              },         
              {
                regex:new RegExp('(\/*\/terminology\/)(.+)'),
                uri:'https://dataportal.se/concepts/${match.params.curi}',
                page_language: '${i18n.languages[0]}'
              },             
              {
                regex:new RegExp('(\/*\/concepts\/)(.+)'),
                uri:'https://dataportal.se/concepts/${match.params.curi}',
                page_language: '${i18n.languages[0]}'
              }                            
            ],           
            entrystore: 'https://${
              env.ENTRYSCAPE_TERMS_PATH
                ? env.ENTRYSCAPE_TERMS_PATH
                : 'editera.dataportal.se'
            }/store',
            clicks: {
              concept: 'details',
              concepts: 'index',
              test: 'test.html',
            },
            namespaces: {
              adms: 'http://www.w3.org/ns/adms#',
              prof: 'http://www.w3.org/ns/dx/prof/',              
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
                block: 'terminologyButtonOLD',
                extends: 'link',
                relation: 'skos:inScheme',
                click: 'terminology',
                class: 'text-5-link',
                content: '\${dcterms:title}'
              },
              {
                block: 'terminologyButton',
                extends: 'template',
                relation: 'skos:inScheme',      
                class: "entryscape",          
                template:'{{termLink}}'
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
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<span className="hbbr text-4 concept_hierarchy--header">${i18n.t(
                  'pages|concept_page|visualization_concepts'
                )}</span>{{/ifprop}}'
              },
              {
                block: 'concept-hierarchy',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<div class="concept_hierarchy hbbr">{{hierarchy scale="1.7"}}</div>{{/ifprop}}'
              },
              {
                block: 'maybeBroaderButton',
                extends: 'template',
                template: '{{#ifprop "skos:broader"}}<h2 class="text-4">${i18n.t(
                  'pages|concept_page|superior_concept'
                )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:broader"}}{{broaderList}}{{/ifprop}}' +
                  '{{#ifprop "skos:broader" invert="true"}}<h2 class="text-4">${i18n.t(
                    'pages|concept_page|superior_concept'
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:broader" invert="true"}}<span class="text-5">${i18n.t(
                    'pages|concept_page|no_superior_concept'
                  )}</span>{{/ifprop}}'
              },
              {
                block: 'maybeNarrowerButton',
                extends: 'template',
                template:'{{#ifprop "skos:narrower"}}<h2 class="text-4">${i18n.t(
                  'pages|concept_page|subordinate_concepts'
                )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:narrower"}}{{narrowerList}}{{/ifprop}}' +
                  '{{#ifprop "skos:narrower" invert="true"}}<h2 class="text-4">${i18n.t(
                    'pages|concept_page|subordinate_concepts'
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:narrower" invert="true"}}<span class="text-5">${i18n.t(
                    'pages|concept_page|no_subordinate_concepts'
                  )}</span>{{/ifprop}}'
              },
              {
                block: 'maybeRelatedButton',
                extends: 'template',
                template:'{{#ifprop "skos:related"}}<h2 class="text-4">${i18n.t(
                  'pages|concept_page|related_concepts'
                )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:related"}}{{relatedList}}{{/ifprop}}' +
                  '{{#ifprop "skos:related" invert="true"}}<h2 class="text-4">${i18n.t(
                    'pages|concept_page|related_concepts'
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:related" invert="true"}}<span class="text-5">${i18n.t(
                    'pages|concept_page|no_related_concepts'
                  )}</span>{{/ifprop}}'
              },
              {
                block: 'broaderList',
                extends: 'template',
                relation: 'skos:broader',      
                class: "entryscape",          
                template:'{{conceptLink}}'
              },                                             
              {
                block: 'narrowerList',
                extends: 'list',
                layout: 'raw',
                rowhead: '{{conceptLink}}',
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
                content: '\${skos:prefLabel}',
                rowhead: '{{conceptLink}}'
              },
              {
                block: 'conceptLink',                     
                run: function(node,a2,a3,entry) {                     
                  if(node && node.firstElementChild && entry)
                  {
                    var el = document.createElement('a');

                    //node.firstElementChild.setAttribute('class', 'entryscape-list-item')  
                    node.setAttribute('class', 'entryscape')  

                    node.firstElementChild.appendChild(el);
                         
                    var ruri = entry.getResourceURI();
                    var label = getLocalizedValue(entry.getMetadata(),'skos:prefLabel','${
                      i18n.languages[0]
                    }'); 
                    el.innerHTML = label
                    var dpUri = getDataportalUri(ruri);
                    el.setAttribute('href', dpUri)
                    el.setAttribute('class', 'entryListRow')  
                  }
                },
                loadEntry:true
              },
              {
                block: 'termLink',                     
                run: function(node,a2,a3,entry) {                                        
                  if(node && node.firstElementChild && entry)
                  {
                    var el = document.createElement('a');
                    var entrystore = entry.getEntryStore();
                    var util = new window.EntryStore.EntryStoreUtil(entrystore);
                    
                    node.firstElementChild.appendChild(el);

                    var ruri = getLocalizedValue(entry.getMetadata(),'skos:inScheme','${
                      i18n.languages[0]
                    }');                                             

                    if(ruri)
                      util.getEntryByResourceURI(ruri).then((e) => {                              
                        var label = getLocalizedValue(e.getMetadata(),'dcterms:title','${
                          i18n.languages[0]
                        }'); 
                        el.innerHTML = label
                        var dpUri = getDataportalUri(ruri,true);
                        el.setAttribute('href', dpUri)
                        el.setAttribute('class', 'terminology__path text-6 entryscape text-5-link')  
                      });                      
                  }
                },
                loadEntry:true
              },

              {
                block: 'hemvist',
                loadEntry: true,
                run: function(node, data, items, entry) {
                  
                  var resourceURI = entry.getResourceURI();
                  var linkTitle = '${i18n.t(
                    'pages|concept_page|concept_adress'
                  )}';

                  if(window.location.pathname.indexOf("/terminology/") > -1 || window.location.pathname.indexOf("/externalterminology/") > -1)
                    linkTitle = '${i18n.t('pages|concept_page|term_adress')}';
                  
                  if (resourceURI.indexOf('https://dataportal.se/') === 0) {
                    node.innerHTML=linkTitle + ': <a href='+resourceURI+'>'+resourceURI+'</a>';
                  }
                  else
                  {
                    node.innerHTML='<span class="">'+linkTitle+'</span> <a href='+resourceURI+'>'+resourceURI+'</a>';
                  } 
                }
              },
              
              {
                block: 'conceptSearchInTemplate',
                extends: 'searchList',
                define: 'conceptSearchInTemplate',
                placeholder: "Sök efter begrepp ...",
                headless: true,
                //rowhead: '{{link class="float-right btn btn-sm btn-default primaryBtn" content="Gå till begrepp" namedclick="concept"}}' +
                //  '<h2>{{text namedclick="concept"}}</h2>' +
                //  '<div class="esbDescription">{{ text content="\${skos:definition}" }}</div>',
                rdftype: 'skos:Concept',
                rdformsid: 'skosmos:concept',
                initsearch: true,
                limit: 8
              },
              {
                block: 'overconcept',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${i18n.t(
                  'pages|concept_page|superior_concepts'
                )}</h2>{{/ifprop}}' +
                '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{broaderButton}}{{/ifprop}}'
              },	  
              {
                block: 'underconcept',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${i18n.t(
                  'pages|concept_page|subordinate_concepts'
                )}</h2>{{/ifprop}}'
              },
              {
                block: 'underconcept2',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${i18n.t(
                  'pages|concept_page|subordinate_concepts'
                )}</h2>{{/ifprop}}' +
                '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{narrowerButton}}{{/ifprop}}'
              },	 
              {
                block: 'relatedconcept',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${i18n.t(
                  'pages|concept_page|related_concepts'
                )}</h2>{{/ifprop}}'
              },
              {
                block: 'relatedconcept2',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${i18n.t(
                  'pages|concept_page|related_concepts'
                )}</h2>{{/ifprop}}' +
                '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{relatedButton}}{{/ifprop}}'
              },	 
              {
                block: 'terminology',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<span className="terminology__label text-6-bold">${i18n.t(
                  'pages|concept_page|terminology_concept'
                )}</span>{{/ifprop}}'
                },	  
                {
                  block: 'terminology-numbers',
                  extends: 'template',
                  template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<span className="terminology__label text-6-bold">${i18n.t(
                    'pages|concept_page|number_of_concepts'
                  )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'toppbegrepp',
                    extends: 'template',
                    template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<span class="toplist-header  text-4">${i18n.t(
                      'pages|concept_page|first_level_concepts'
                    )}</span>{{toppbegreppLista}}{{/ifprop}}'
                  },
                  {
                    block: 'pref-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:prefLabel"}}<span>${i18n.t(
                      'pages|concept_page|preferred_term'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'alt-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:altLabel"}}<span>${i18n.t(
                      'pages|concept_page|alternativ_term'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'hidden-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:hiddenLabel"}}<span>${i18n.t(
                      'pages|concept_page|hidden_term'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'example-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:example"}}<span>${i18n.t(
                      'pages|concept_page|example'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'history-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:historyNote"}}<span>${i18n.t(
                      'pages|concept_page|historical_note'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'editorial-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:editorialNote"}}<span>${i18n.t(
                      'pages|concept_page|editorial_note'
                    )}</h2>{{/ifprop}}'
                  },
                  {
                    block: 'note-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:note"}}<span>Anmärkning ${i18n.t(
                      'pages|concept_page|note'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'exactMatch-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:exactMatch"}}<span>${i18n.t(
                      'pages|concept_page|exact_match'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'closeMatch-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:closeMatch"}}<span>${i18n.t(
                      'pages|concept_page|close_match'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'relatedMatch-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:relatedMatch"}}<span>${i18n.t(
                      'pages|concept_page|related_match'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'broadMatch-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:broadMatch"}}<span>${i18n.t(
                      'pages|concept_page|superior_match'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'narrowMatch-Label',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "skos:narrowMatch"}}<span>${i18n.t(
                      'pages|concept_page|subordinate_match'
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'concept-head',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<span class="text-5-bold">${i18n.t(
                      'pages|concept_page|about_terminology'
                    )}</h2>{{/ifprop}}'
                  },
                  {
                    block: 'term-head',
                    class: 'text-5-bold',
                    extends: 'template',
                    template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<span class="text-5-bold">${i18n.t(
                      'pages|concept_page|about_concept'
                    )}</h2>{{/ifprop}}'
                  },
              {
                block: 'toppbegreppLista',
                extends: 'list',
                namedclick: 'test',
                relation: "skos:hasTopConcept",
                layout: 'raw',
                limit: 20,
                rowhead: '{{conceptLink}}',
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
          }];

          </script>
          
          <script src="${
            i18n.languages[0] == 'sv'
              ? env.ENTRYSCAPE_OPENDATA_SV_URL
              : env.ENTRYSCAPE_OPENDATA_EN_URL
          }"></script>
          <script src="${
            env.ENTRYSCAPE_BLOCKS_URL
          }"></script>         
          `,
          {
            done: function () {},
          }
        );
      }
    }
  };

  let entryUri = match.params.scheme
    ? `${match.params.scheme}://${match.params.curi}`
    : `https://dataportal.se/concepts/${match.params.curi}`;

  return (
    <EntrystoreProvider
      env={env}
      entryUri={entryUri}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      fetchMore={false}
    >
      <EntrystoreContext.Consumer>
        {(entry) => (
          <div className="detailpage">
            <PageMetadata
              seoTitle={`${entry.title} - ${i18n.t('common|seo-title')}`}
              seoDescription=""
              seoImageUrl=""
              seoKeywords=""
              robotsFollow={true}
              robotsIndex={true}
              lang={i18n.languages[0]}
              socialMeta={{
                socialDescription: entry.description,
                socialTitle: entry.title,
                socialUrl: `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t(
                  'routes|concepts|path'
                )}/${match.params.scheme}/${match.params.curi}`,
              }}
              canonicalUrl={
                entry && entry.title
                  ? `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t(
                      'routes|concepts|path'
                    )}/${match.params.curi}`
                  : ''
              }
            />
            <StaticBreadcrumb
              env={env}
              staticPaths={[
                {
                  path: referredSearch,
                  title: i18n.t('routes|concepts|title'),
                },
                {
                  path: `/${i18n.languages[0]}/${i18n.t(
                    'routes|concepts|path'
                  )}/${match.params.scheme}/${match.params.curi}`,
                  title: '',
                },
              ]}
            />
            <div className="detailpage__wrapper">
              {/* Left column */}
              <div className="detailpage__wrapper--leftcol content">
<<<<<<< HEAD
                <span className="text-7-bold beta_badge--xl">BETA</span>
=======
>>>>>>> prod
                <h1 className="text-2 terminology_header">
                  <span>{entry.title}</span>
                </h1>

                <p className="description text-5">
                  <span
                    data-entryscape="text"
                    data-entryscape-fallback=""
                    data-entryscape-content="${skos:definition}"
                  ></span>

                  <span
                    data-entryscape="hemvist"
                    className="entryscape hemvist"
                  ></span>

                  <span
                    data-entryscape="text"
                    data-entryscape-fallback=""
                    data-entryscape-content="${dcterms:description}"
                  ></span>
                </p>

                <div className="column">
                  <span data-entryscape="alt-Label"></span>
                  <span
                    className="concept-detail"
                    data-entryscape="text"
                    data-entryscape-fallback=""
                    data-entryscape-content="${skos:altLabel}"
                  ></span>

                  <span data-entryscape="example-Label"></span>
                  <span
                    className="concept-detail"
                    data-entryscape="text"
                    data-entryscape-fallback=""
                    data-entryscape-content="${skos:example}"
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

                <div className="column">
                  <span data-entryscape="history-Label"></span>
                  <span
                    className="concept-detail"
                    data-entryscape="text"
                    data-entryscape-fallback=""
                    data-entryscape-content="${skos:historyNote}"
                  ></span>

                  <span data-entryscape="editorial-Label"></span>
                  <span
                    className="concept-detail"
                    data-entryscape="text"
                    data-entryscape-fallback=""
                    data-entryscape-content="${skos:editorialNote}"
                  ></span>

                  <span data-entryscape="note-Label"></span>
                  <span
                    className="concept-detail"
                    data-entryscape="text"
                    data-entryscape-fallback=""
                    data-entryscape-content="${skos:note}"
                  ></span>

                  <span
                    className="terminology__top-concepts text-6"
                    data-entryscape="alt-term"
                  ></span>
                </div>

                <span
                  className="terminology__top-concepts text-6"
                  data-entryscape="toppbegrepp"
                ></span>
              </div>

              {/* Right column */}
              <div className="detailpage__wrapper--rightcol hbbr">
                <div className="detailpage__wrapper--rightcol-info text-6">
                  <h2 className="text-5-bold">
                    <span data-entryscape="term-head"></span>
                    <span data-entryscape="concept-head"></span>
                  </h2>
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
                                    ${i18n.t(
                                      'pages|concept_page|download_concept'
                                    )}
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
          </div>
        )}
      </EntrystoreContext.Consumer>
    </EntrystoreProvider>
  );
};
