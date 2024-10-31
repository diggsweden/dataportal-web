import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect, useState } from "react";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import { SettingsContext } from "@/providers/SettingsProvider";
import { useRouter } from "next/router";
import Head from "next/head";
import { hemvist, keyword, linkBase } from "@/utilities";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";
import { Preamble } from "@/components/global/Typography/Preamble";
import { Button } from "@/components/global/Button";

export const SpecificationPage: FC<{ curi?: string; uri?: string }> = ({
  curi,
  uri,
}) => {
  const { env, setBreadcrumb, iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { lang, t } = useTranslation();
  const { pathname } = useRouter() || {};
  const [showAllDatasets, setShowAllDatasets] = useState(false);
  const relatedDatasets = showAllDatasets
    ? entry.conformsTo
    : entry.conformsTo?.slice(0, 4);

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

      if (curi || uri) {
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
            if (!resourceUri || !window?.location?.pathname) {
              return resourceUri;
            }

            const currentPath = window.location.pathname;
            const encodedResourceUri = encodeURIComponent(resourceUri);
            var path = '';                      

            if(resourceUri.indexOf('://') > -1)
            {
              var tmp = resourceUri.split("://");
              path = tmp[0] + '/' + tmp[1];
            }
            else
              path = resourceUri;              

            if(currentPath.includes("/externalspecification"))
              return "/externalspecification?resource=" + encodedResourceUri;

            if(currentPath.includes("/specifications/"))
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
                regex:new RegExp('(\/*\/externalspecification)(.+)'),
                uri:'${decodeURIComponent(uri as string)}',
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
                    '<a href="{{resourceURI}}">' +
                      '<span class="button button--primary button--large text-white">${t(
                        "pages|specification_page$specification_download",
                      )}' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="${
                          1.5 * iconSize
                        }" height="${
                          1.5 * iconSize
                        }" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">' +
                        '<path d="M4.08008 11V13H16.0801L10.5801 18.5L12.0001 19.92L19.9201 12L12.0001 4.08002L10.5801 5.50002L16.0801 11H4.08008Z" fill="#6E615A"/>' +
                        '</svg>' +
                    '</span>' +
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
            {entry.conformsTo && entry.conformsTo.length > 0 && (
              <div>
                <span className="rdformsLabel">
                  {t("pages|specification_page$related_datasets")}
                </span>
                {relatedDatasets?.map((ds, idx) => (
                  <a
                    className="fit mb-sm block text-sm text-green-600 hover:no-underline"
                    key={idx}
                    href={`/datasets${ds.url}`}
                  >
                    {ds.title}
                  </a>
                ))}
                {entry.conformsTo?.length > 4 && (
                  <Button
                    size={"xs"}
                    className="mt-xs px-sm py-xs !font-strong text-brown-600"
                    variant={"plain"}
                    label={
                      showAllDatasets
                        ? t("pages|datasetpage$view_less")
                        : t("pages|datasetpage$view_more")
                    }
                    onClick={() => setShowAllDatasets(!showAllDatasets)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
