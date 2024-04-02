import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect } from "react";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import { SettingsContext } from "@/providers/SettingsProvider";
import { useRouter } from "next/router";
import Head from "next/head";
import { hemvist, keyword, linkBase } from "@/utilities";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";
import { Preamble } from "@/components/global/Typography/Preamble";

export const SpecificationPage: FC<{
  curi?: string;
  scheme?: string;
}> = ({ curi, scheme }) => {
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { lang, t } = useTranslation();
  const { pathname } = useRouter() || {};

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
  }, []);

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: entry.title,
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: t("routes|specifications$title"),
            link: {
              ...linkBase,
              link: `/${t("routes|specifications$path")}?q=&f=`,
            },
          },
        ],
      });
  }, [pathname, entry.title]);

  const addScripts = () => {
    if (typeof window !== "undefined") {
      const postscribe = (window as any).postscribe;

      if (curi) {
        postscribe(
          "#scriptsPlaceholder",

          `
          <script>
            var __entryscape_plugin_config = {
              entrystore_base: 'https:\/\/${
                env.ENTRYSCAPE_SPECS_PATH
                  ? env.ENTRYSCAPE_SPECS_PATH
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

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/externalspecification/") > -1)
              return "/externalspecification/" + path;

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/specifications/") > -1)
            {
              let entryPath = '';

              if(resourceUri.includes('https://www-sandbox.dataportal.se/specifications'))
              entryPath = resourceUri.replace("https://www-sandbox.dataportal.se/specifications","");
              
              else
              entryPath = resourceUri.replace("https://dataportal.se/specifications","");
                return "/specifications" + entryPath;
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
                regex:new RegExp('(\/*\/externalspecification\/)(.+)'),
                uri:'${scheme}://${curi}',
                page_language: '${lang}'
              },                
              {
                regex:new RegExp('(\/*\/specifications\/)(.+)'),
                uri:'https://${
                  env.ENTRYSCAPE_SPECS_PATH.startsWith("sandbox")
                    ? "www-sandbox.dataportal.se"
                    : "dataportal.se"
                }/specifications/${curi}',
                page_language: '${lang}'
              }              
            ],
            entrystore: 'https://${
              env.ENTRYSCAPE_SPECS_PATH
                ? env.ENTRYSCAPE_SPECS_PATH
                : "editera.dataportal.se"
            }/store',
            clicks: {
              specification: 'details.html',
              specifications: 'index.html',
            },
            namespaces: {
              adms: 'http://www.w3.org/ns/adms#',
              prof: 'http://www.w3.org/ns/dx/prof/',
            },
            collections: [
              {
                type: 'facet',
                name: 'theme',
                label: 'Theme',
                property: 'dcat:theme',
                nodetype: 'uri',
                templatesource: 'dcat:theme-isa',
              }
            ],
            itemstore: {
              bundles: [
                'dcat',
                'https://${
                  env.ENTRYSCAPE_SPECS_PATH.includes("sandbox")
                    ? "sandbox.editera.dataportal.se"
                    : "editera.dataportal.se"
                }/theme/templates/adms.json',
                'https://${
                  env.ENTRYSCAPE_SPECS_PATH.includes("sandbox")
                    ? "sandbox.editera.dataportal.se"
                    : "editera.dataportal.se"
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
              }
            ],
            blocks: [
              ${hemvist(t)},
              ${keyword(t)},
              {
                block: 'resourceDescriptors2',
                extends: 'list',
                relation: 'prof:hasResource',
                template: 'prof:ResourceDescriptor',
                expandTooltip: '${t("pages|datasetpage$view_more")}',
                unexpandTooltip: '${t("pages|datasetpage$view_less")}',
                expandButton: false,
                listbody: '<div class="specification__resource--body">{{body}}</div>',
                listplaceholder: '<div class="alert alert-info" role="alert">Denna specifikation har inga resurser.</div>',
                rowhead:
                '<span>{{text}}</span>' + 
                  '<span class="block mb-md">{{prop "prof:hasRole" class="type" render="label"}}</span>' +
                  '<div>{{ text content="\${skos:definition}" }}</div>' +
                  '<div class="flex justify-between items-end md:items-center mt-md md:mt-lg gap-lg">' +
                    '<a href="{{resourceURI}}" tabindex="-1">' +
                      '<button class="button button--primary button--large text-white">${t(
                        "pages|specification_page$specification_download",
                      )}' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
                        '<path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="#FFFFFF"/>' +
                        '</svg>' +
                    '</button>' +
                    '</a>' +
                    '<button open="{{expandTooltip}}" close="{{unexpandTooltip}}" class="esbExpandButton button button--secondary button--large h-fit text-nowrap">' +
                    '</button>' +
                  '</div>', 
              },
            ],
          }];
          </script>

          <script src="${
            lang == "sv"
              ? env.ENTRYSCAPE_OPENDATA_SV_URL
              : env.ENTRYSCAPE_OPENDATA_EN_URL
          }"></script>
          <script src="${
            env.ENTRYSCAPE_BLOCKS_URL
          }"></script>                      
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
        <title>
          {entry.title ? `${entry.title} - Sveriges dataportal` : "test"}
        </title>
        <meta
          property="og:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
      </Head>
      <div>
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {entry.title}
        </Heading>
        <div className="flex flex-col gap-xl md:mb-xl lg:flex-row lg:gap-2xl">
          {/* Left column */}
          <div className="flex w-full max-w-md flex-col">
            {entry.publisher && (
              <Preamble className="mb-lg">{entry.publisher}</Preamble>
            )}

            <span
              className="mb-lg mt-md !font-ubuntu text-lg text-textSecondary md:mb-xl md:mt-lg"
              data-entryscape="text"
              data-entryscape-content="${dcterms:description}"
            />

            <Heading level={2} size={"md"} className="mb-md md:mb-lg">
              {t("pages|specification_page$resource_specification")}
            </Heading>
            <div
              data-entryscape="resourceDescriptors2"
              data-entryscape-rdftype="prof:ResourceDescriptor"
            ></div>

            <div className="contact__publisher mt-md md:mt-lg">
              <Heading level={3} size={"sm"}>
                {t("pages|datasetpage$contact-publisher")}
              </Heading>
              <p>
                {t("pages|datasetpage$contact-publisher-text")}
                {t("pages|datasetpage$contact-publisher-text2")}{" "}
                <a href="https://community.dataportal.se/" lang="en">
                  community
                </a>
                .
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="h-fit w-full max-w-md bg-white p-md lg:max-w-[296px]">
            <div className="w-full">
              <Heading
                level={2}
                size={"sm"}
                className="mb-sm font-strong text-textSecondary md:mb-md"
              >
                {t("pages|specification_page$about_specification")}
              </Heading>
              <span data-entryscape="hemvist" />
              <div data-entryscape="keyword" />
              <div
                data-entryscape-dialog
                data-entryscape-rdformsid="dcat:contactPoint"
              />

              <div
                data-entryscape="view"
                data-entryscape-rdformsid="prof:Profile"
                data-entryscape-filterpredicates="dcterms:title,dcterms:description,dcat:distribution,dcterms:publisher,prof:hasResource,adms:prev,dcat:keyword"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
