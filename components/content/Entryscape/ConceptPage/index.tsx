import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect } from "react";
import { SettingsContext } from "@/providers/SettingsProvider";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import Head from "next/head";
import { hemvist, linkBase, preambleBlock } from "@/utilities";
import { Heading } from "@/components/global/Typography/Heading";
import { Container } from "@/components/layout/Container";

export const ConceptPage: FC<{ curi?: string; scheme?: string }> = ({
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
   * or else blocks won't have access to DOM
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
  }, []);

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: entry.title,
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: t("routes|concepts$title"),
            link: { ...linkBase, link: `/${t("routes|concepts$path")}?q=&f=` },
          },
        ],
      });

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

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/externalconcept/") > -1)
              if(isTerm)
                return "/externalterminology/" + path;
              else
                return "/externalconcept/" + path;

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/concepts/") > -1)
            {
              let entryPath = '';
              if(resourceUri.includes('https://www-sandbox.dataportal.se/concepts'))
              entryPath = resourceUri.replace("https://www-sandbox.dataportal.se/concepts","");

              else
              entryPath = resourceUri.replace("https://dataportal.se/concepts","");

              if(isTerm)
                return "/terminology" + entryPath;
              else
                return "/concepts" + entryPath;
            }

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/externalterminology/") > -1)                            
              return "/externalconcept/" + path;

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/terminology/") > -1)    
            {
              let entryPath = '';
              if(resourceUri.includes('https://www-sandbox.dataportal.se/concepts'))
              entryPath = resourceUri.replace("https://www-sandbox.dataportal.se/concepts","");

              else
              entryPath = resourceUri.replace("https://dataportal.se/concepts","");

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
                regex:new RegExp('(\/*\/externalconcept\/)(.+)'),
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
                uri:'https://${
                  env.ENTRYSCAPE_TERMS_PATH.includes("sandbox")
                    ? "www-sandbox.dataportal.se"
                    : "dataportal.se"
                }/concepts/${curi}',
                page_language: '${lang}',
                },  
              {
                regex:new RegExp('(\/*\/concepts\/)(.+)'),
                uri:'https://${
                  env.ENTRYSCAPE_TERMS_PATH.includes("sandbox")
                    ? "www-sandbox.dataportal.se"
                    : "dataportal.se"
                }/concepts/${curi}',
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
              ${preambleBlock},
              {
                block: 'terminologyButton',
                extends: 'template',
                relation: 'skos:inScheme',      
                class: "entryscape",          
                template:'{{termLink}}'
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
                    var label = getLocalizedValue(entry.getAllMetadata(),'skos:prefLabel','${lang}'); 
                    el.innerHTML = label
                    var dpUri = getDataportalUri(ruri);
                    el.setAttribute('href', dpUri)
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
                    var util = new window.ESJS.EntryStoreUtil(entrystore);
                    
                    node.firstElementChild.appendChild(el);

                    var ruri = getLocalizedValue(entry.getAllMetadata(),'skos:inScheme','${lang}');                                             

                    if(ruri)
                      util.getEntryByResourceURI(ruri).then((e) => {                              
                        var label = getLocalizedValue(e.getAllMetadata(),'dcterms:title','${lang}'); 
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
                block: 'terminology',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h3 class="text-md">${t(
                  "pages|concept_page$terminology_concept",
                )}</h3>{{/ifprop}}'
              },	  
              {
                block: 'conceptBlock',
                class: 'conceptDetail',
                extends: 'template',
                template: '{{#ifprop "dcterms:description"}}<span class="preamble">{{ text content="\${dcterms:description}" }}</span>{{/ifprop}}' +
                          '{{#ifprop "skos:definition"}}<span class="preamble">{{ text content="\${skos:definition}" }}</span>{{/ifprop}}' +
                
                  '{{#ifprop "skos:altLabel"}}<div><h2>${t(
                    "pages|concept_page$alternativ_term",
                  )}</h2><span>{{ text content="\${skos:altLabel}" }}</span></div>{{/ifprop}}' +

                '{{#ifprop "skos:example"}}<div><h2>${t(
                  "pages|concept_page$example",
                )}</h2><span>{{ text content="\${skos:example}" }}</span></div>{{/ifprop}}' + 

                '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}' + 
                  '{{#ifprop "skos:broader"}}<div><h2>${t(
                    "pages|concept_page$superior_concept",
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:broader"}}{{broaderList}}</div>{{/ifprop}}' +
                  '{{#ifprop "skos:broader" invert="true"}}<div><h2>${t(
                    "pages|concept_page$superior_concept",
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:broader" invert="true"}}<span class="mb-xl">${t(
                    "pages|concept_page$no_superior_concept",
                  )}</span></div>{{/ifprop}}' + 

                  '{{#ifprop "skos:narrower"}}<div><h2>${t(
                    "pages|concept_page$subordinate_concepts",
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:narrower"}}{{narrowerList}}</div>{{/ifprop}}' +
                  '{{#ifprop "skos:narrower" invert="true"}}<div><h2>${t(
                    "pages|concept_page$subordinate_concepts",
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:narrower" invert="true"}}<span>${t(
                    "pages|concept_page$no_subordinate_concepts",
                  )}</span></div>{{/ifprop}}' +
              
                  '{{#ifprop "skos:related"}}<div><h2>${t(
                    "pages|concept_page$related_concepts",
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:related"}}{{relatedList}}</div>{{/ifprop}}' +
                  '{{#ifprop "skos:related" invert="true"}}<div><h2>${t(
                    "pages|concept_page$related_concepts",
                  )}</h2>{{/ifprop}}' +
                  '{{#ifprop "skos:related" invert="true"}}<span>${t(
                    "pages|concept_page$no_related_concepts",
                  )}</span></div>{{/ifprop}}{{/ifprop}}' +

                '{{#ifprop "skos:historyNote"}}<div><h2>${t(
                  "pages|concept_page$historical_note",
                )}</h2><span>{{ text content="\${skos:historyNote}" }}</span></div>{{/ifprop}}' +

                '{{#ifprop "skos:editorialNote"}}<div><h2>${t(
                  "pages|concept_page$editorial_note",
                )}</h2><span>{{ text content="\${skos:editorialNote}" }}</span></div>{{/ifprop}}' +

                '{{#ifprop "skos:note"}}<div><h2>${t(
                  "pages|concept_page$note",
                )}</h2><span>{{ text content="\${skos:note}" }}</span></div>{{/ifprop}}' 
              },
              {
                block: 'conceptHierarchy',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${t(
                  "pages|concept_page$visualization_concepts",
                )}</h2><div class="concept_hierarchy">{{hierarchy scale="1.7"}}</div>{{/ifprop}}'
              },
              {
                block: 'toppbegrepp',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<h2 class="toplist-header !text-lg">${t(
                  "pages|concept_page$first_level_concepts",
                )}</h2>{{toppbegreppLista}}{{/ifprop}}'
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
                block: 'infoHeadBlock',
                extends: 'template',
                template: '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}${t(
                  "pages|concept_page$about_concept",
                )}{{/ifprop}}' +

                '{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}${t(
                  "pages|concept_page$about_terminology",
                )}{{/ifprop}}'
              },
            ],
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
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
        {entry.title}
      </Heading>
      <div className="mb-lg flex flex-col gap-xl md:mb-xl lg:flex-row lg:gap-2xl">
        {/* Left column */}
        <div className="flex w-full max-w-md flex-col">
          <div
            className="flex flex-col gap-lg"
            data-entryscape="conceptBlock"
          />

          <span data-entryscape="toppbegrepp" className="conceptDetail" />
        </div>

        {/* Right column */}
        <div className="mb-lg w-full pt-none lg:mb-none lg:max-w-[296px]">
          <Heading
            level={2}
            size={"sm"}
            className="mb-sm text-textSecondary md:mb-md"
          >
            <span data-entryscape="infoHeadBlock" />
          </Heading>
          <span
            className="text-sm text-textSecondary"
            data-entryscape="hemvist"
          />

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

      <div data-entryscape="conceptHierarchy" className="conceptDetail" />
    </Container>
  );
};
