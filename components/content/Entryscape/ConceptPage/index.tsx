import useTranslation from "next-translate/useTranslation";
import React, { useContext, useEffect } from "react";
import { SettingsContext } from "@/providers/SettingsProvider";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import { initBreadcrumb } from "@/pages/_app";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import Head from "next/head";
import { hemvist } from "@/utilities";
import { Heading } from "@/components/global/Typography/Heading";
import { Container } from "@/components/layout/Container";

export const ConceptPage: React.FC<{ curi?: string; scheme?: string }> = ({
  curi,
  scheme,
}) => {
  let postscribe: any;
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { lang, t } = useTranslation();
  const { pathname } = useRouter() || {};
  const { trackPageView } = useMatomo();

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (typeof window !== "undefined") {
      //check if reffereing search params is set to hash
      if (
        window.location &&
        window.location.hash &&
        window.location.hash.includes("ref=?")
      )
        window.onpopstate = () => {
          window.location.reload();
        };
    }
    addScripts();
    return () => {
      setBreadcrumb && setBreadcrumb(initBreadcrumb);
    };
  }, []);

  useEffect(() => {
    trackPageView({ documentTitle: entry.title });
  }, [pathname, entry.title]);

  const addScripts = () => {
    if (typeof window !== "undefined") {
      postscribe = (window as any).postscribe;

      if (curi) {
        postscribe(
          "#scriptsPlaceholder",
          `                     
          <script>          

          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_TERMS_PATH
                ? env.ENTRYSCAPE_TERMS_PATH
                : "editera.dataportal.se"
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
                return "/externalterminology/" + path;
              else
                return "/externalconcepts/" + path;

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/concepts/") > -1)
            {
              var entryPath = resourceUri.replace("https://dataportal.se/concepts","");

              if(isTerm)
                return "/terminology" + entryPath;
              else
                return "/concepts" + entryPath;
            }

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/externalterminology/") > -1)                            
              return "/externalconcepts/" + path;

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/terminology/") > -1)    
            {
              var entryPath = resourceUri.replace("https://dataportal.se/concepts","");            
               return "/concepts" + entryPath;
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
            page_language: '${lang}',
            routes: [              
              {
                regex:new RegExp('(\/*\/externalconcepts\/)(.+)'),
                uri:'${scheme}://${curi}',
                page_language: '${lang}'
              },             
              {
                regex:new RegExp('(\/*\/externalterminology\/)(.+)'),
                uri:'${scheme}://${curi}',
                page_language: '${lang}'
              },         
              {
                regex:new RegExp('(\/*\/terminology\/)(.+)'),
                uri:'https://dataportal.se/concepts/${curi}',
                page_language: '${lang}',
                constraints: {
                  "rdf:type": "skos:ConceptScheme"
              }
              },             
              {
                regex:new RegExp('(\/*\/concepts\/)(.+)'),
                uri:'https://dataportal.se/concepts/${curi}',
                page_language: '${lang}'
              }                            
            ],           
            entrystore: 'https://${
              env.ENTRYSCAPE_TERMS_PATH
                ? env.ENTRYSCAPE_TERMS_PATH
                : "editera.dataportal.se"
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
              ${hemvist(t)},
              {
                block: 'terminologyButtonOLD',
                extends: 'link',
                relation: 'skos:inScheme',
                click: 'terminology',
                class: 'text-md link',
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
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2 class="concept-header">${t(
                  "pages|concept_page$visualization_concepts",
                )}</h2>{{/ifprop}}'
              },
              {
                block: 'concept-hierarchy',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<div class="concept_hierarchy">{{hierarchy scale="1.7"}}</div>{{/ifprop}}'
              },
              {
                block: 'maybeBroaderButton',
                extends: 'template',
                template: '{{#ifprop "skos:broader"}}<h2 class="relatedList-label">${t(
                  "pages|concept_page$superior_concept",
                )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:broader"}}{{broaderList}}{{/ifprop}}' +
                  '{{#ifprop "skos:broader" invert="true"}}<h2 class="relatedList-label">${t(
                    "pages|concept_page$superior_concept",
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:broader" invert="true"}}<span class="mb-xl">${t(
                    "pages|concept_page$no_superior_concept",
                  )}</span>{{/ifprop}}'
              },
              {
                block: 'maybeNarrowerButton',
                extends: 'template',
                template:'{{#ifprop "skos:narrower"}}<h2 class="relatedList-label">${t(
                  "pages|concept_page$subordinate_concepts",
                )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:narrower"}}{{narrowerList}}{{/ifprop}}' +
                  '{{#ifprop "skos:narrower" invert="true"}}<h2 class="relatedList-label">${t(
                    "pages|concept_page$subordinate_concepts",
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:narrower" invert="true"}}<span>${t(
                    "pages|concept_page$no_subordinate_concepts",
                  )}</span>{{/ifprop}}'
              },
              {
                block: 'maybeRelatedButton',
                extends: 'template',
                template:'{{#ifprop "skos:related"}}<h2 class="relatedList-label">${t(
                  "pages|concept_page$related_concepts",
                )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:related"}}{{relatedList}}{{/ifprop}}' +
                  '{{#ifprop "skos:related" invert="true"}}<h2 class="relatedList-label">${t(
                    "pages|concept_page$related_concepts",
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:related" invert="true"}}<span>${t(
                    "pages|concept_page$no_related_concepts",
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
                class: 'text-md link',
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
                class: 'text-md link',
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
                    var label = getLocalizedValue(entry.getMetadata(),'skos:prefLabel','${lang}'); 
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

                    var ruri = getLocalizedValue(entry.getMetadata(),'skos:inScheme','${lang}');                                             

                    if(ruri)
                      util.getEntryByResourceURI(ruri).then((e) => {                              
                        var label = getLocalizedValue(e.getMetadata(),'dcterms:title','${lang}'); 
                        el.innerHTML = label
                        var dpUri = getDataportalUri(ruri,true);
                        el.setAttribute('href', dpUri)
                        el.setAttribute('class', 'terminology__path text-base entryscape text-md link')  
                      });                      
                  }
                },
                loadEntry:true
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
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${t(
                  "pages|concept_page$superior_concepts",
                )}</h2>{{/ifprop}}' +
                '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{broaderButton}}{{/ifprop}}'
              },	  
              {
                block: 'underconcept',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${t(
                  "pages|concept_page$subordinate_concepts",
                )}</h2>{{/ifprop}}'
              },
              {
                block: 'underconcept2',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${t(
                  "pages|concept_page$subordinate_concepts",
                )}</h2>{{/ifprop}}' +
                '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{narrowerButton}}{{/ifprop}}'
              },	 
              {
                block: 'relatedconcept',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${t(
                  "pages|concept_page$related_concepts",
                )}</h2>{{/ifprop}}'
              },
              {
                block: 'relatedconcept2',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${t(
                  "pages|concept_page$related_concepts",
                )}</h2>{{/ifprop}}' +
                '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}{{relatedButton}}{{/ifprop}}'
              },	 
              {
                block: 'terminology',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h3 class="text-md">${t(
                  "pages|concept_page$terminology_concept",
                )}</h3>{{/ifprop}}'
                },	  
                {
                  block: 'terminology-numbers',
                  extends: 'template',
                  template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<span class="terminology__label text-md">${t(
                    "pages|concept_page$number_of_concepts",
                  )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'toppbegrepp',
                    extends: 'template',
                    template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<h2 class="toplist-header  text-md">${t(
                      "pages|concept_page$first_level_concepts",
                    )}</h2>{{toppbegreppLista}}{{/ifprop}}'
                  },
                  {
                    block: 'pref-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:prefLabel"}}<span>${t(
                      "pages|concept_page$preferred_term",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'alt-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:altLabel"}}<span>${t(
                      "pages|concept_page$alternativ_term",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'hidden-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:hiddenLabel"}}<span>${t(
                      "pages|concept_page$hidden_term",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'example-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:example"}}<span>${t(
                      "pages|concept_page$example",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'history-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:historyNote"}}<span>${t(
                      "pages|concept_page$historical_note",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'editorial-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:editorialNote"}}<span>${t(
                      "pages|concept_page$editorial_note",
                    )}</h2>{{/ifprop}}'
                  },
                  {
                    block: 'note-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:note"}}<span class="block font-strong text-lg">Anmärkning ${t(
                      "pages|concept_page$note",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'exactMatch-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:exactMatch"}}<span>${t(
                      "pages|concept_page$exact_match",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'closeMatch-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:closeMatch"}}<span>${t(
                      "pages|concept_page$close_match",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'relatedMatch-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:relatedMatch"}}<span>${t(
                      "pages|concept_page$related_match",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'broadMatch-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:broadMatch"}}<span>${t(
                      "pages|concept_page$superior_match",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'narrowMatch-Label',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "skos:narrowMatch"}}<span>${t(
                      "pages|concept_page$subordinate_match",
                    )}</span>{{/ifprop}}'
                  },
                  {
                    block: 'concept-head',
                    class: 'text-md',
                    extends: 'template',
                    template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<span class="text-md">${t(
                      "pages|concept_page$about_terminology",
                    )}</h2>{{/ifprop}}'
                  },
                  {
                    block: 'term-head',
                    class: 'text-lg',
                    extends: 'template',
                    template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<span class="text-lg">${t(
                      "pages|concept_page$about_concept",
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
            lang == "sv"
              ? env.ENTRYSCAPE_OPENDATA_SV_URL
              : env.ENTRYSCAPE_OPENDATA_EN_URL
          }"></script>
          <script src="${env.ENTRYSCAPE_BLOCKS_URL}"></script>         
          `,
          {
            done: function () {},
          },
        );
      }
    }
  };

  return (
    <Container>
      <Head>
        <title>{`${entry.title} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
      </Head>
      <Heading
        level={1}
        size={"lg"}
        className="mb-none py-xl text-xl lg:text-2xl"
      >
        {entry.title}
      </Heading>
      <div className="justify-between gap-2xl lg:flex">
        {/* Left column */}
        <div className="flex flex-col gap-lg">
          <div>
            <span data-entryscape="alt-Label" />
            <span
              data-entryscape="text"
              data-entryscape-fallback=""
              data-entryscape-content="${skos:altLabel}"
            />

            <span data-entryscape="example-Label" />
            <span
              data-entryscape="text"
              data-entryscape-fallback=""
              data-entryscape-content="${skos:example}"
            />
          </div>

          <div>
            <span className="text-md" data-entryscape="broader" />
          </div>

          <div>
            <span data-entryscape="narrower" />
          </div>

          <div>
            <span data-entryscape="related" data-entryscape-click="" />
          </div>

          <div>
            <span data-entryscape="history-Label" />
            <span
              data-entryscape="text"
              data-entryscape-fallback=""
              data-entryscape-content="${skos:historyNote}"
            />

            <span data-entryscape="editorial-Label" />
            <span
              data-entryscape="text"
              data-entryscape-fallback=""
              data-entryscape-content="${skos:editorialNote}"
            />

            <span data-entryscape="note-Label" />
            <span
              data-entryscape="text"
              data-entryscape-fallback=""
              data-entryscape-content="${skos:note}"
            />

            <span data-entryscape="alt-term" />
          </div>

          <span data-entryscape="toppbegrepp" />
        </div>

        {/* Right column */}
        <div className="mb-lg pt-none lg:mb-none lg:w-[296px]">
          <div className="lg:w-[296px]">
            <Heading level={2} size={"md"}>
              <span data-entryscape="term-head" />
              <span data-entryscape="concept-head" />
            </Heading>
            <span data-entryscape="hemvist" />
            <span className="text-md" data-entryscape="terminology" />
            <span data-entryscape="terminologyButton" />
            <script
              type="text/x-entryscape-handlebar"
              data-entryscape="true"
              data-entryscape-component="template"
              dangerouslySetInnerHTML={{
                __html: `
                       <div class="terminilogy__download-wrapper">
                          <h3 class="text-md">
                          ${t("pages|concept_page$download_concept")}
                          </h3>

                        <div class="text-md"">
                          <a
                            class="terminology__download-link"
                            href="{{ metadataURI}}"
                          >
                            RDF/XML
                          </a>

                          <a
                            class="terminology__download-link"
                            href="{{ metadataURI }}?format=text/turtle"
                          >
                            TURTLE
                          </a>

                          <a
                            class="terminology__download-link"
                            href="{{ metadataURI }}?format=text/n-triples"
                          >
                            N-TRIPLES
                          </a>

                          <a
                            class="terminology__download-link"
                            href="{{ metadataURI }}?format=application/ld+json"
                          >
                            JSON-LD
                          </a>
                        </div>
                        </div>
                      `,
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <span data-entryscape="concept-hierarchy-header" />

        <div
          className="bg-white"
          data-entryscape="concept-hierarchy"
          data-entryscape-scale="1.7"
        />
      </div>
    </Container>
  );
};
