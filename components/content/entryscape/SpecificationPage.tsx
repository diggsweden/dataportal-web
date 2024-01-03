import useTranslation from "next-translate/useTranslation";
import React, { useContext, useEffect } from "react";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import { SettingsContext } from "@/providers/SettingsProvider";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import Head from "next/head";
import { hemvist } from "@/utilities";

export const SpecificationPage: React.FC<{ curi: string }> = ({ curi }) => {
  const { env } = useContext(SettingsContext);
  const { title } = useContext(EntrystoreContext);
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
  }, []);

  useEffect(() => {
    trackPageView({ documentTitle: title });
  }, [pathname]);

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
          window.__entryscape_config = [{
            block: 'config',
            page_language: '${lang}',            
            routes: [              
              {
                regex:new RegExp('(\/*\/specifications\/)(.+)'),
                uri:'https://dataportal.se/specifications/${curi}',
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
            itemstore: {
              bundles: [
                'dcat',
                'https://${
                  env.ENTRYSCAPE_SPECS_PATH
                    ? env.ENTRYSCAPE_SPECS_PATH
                    : "editera.dataportal.se"
                }/theme/templates/adms.json',
                'https://${
                  env.ENTRYSCAPE_SPECS_PATH
                    ? env.ENTRYSCAPE_SPECS_PATH
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
              }],

            blocks: [
              ${hemvist(t)},
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
                expandTooltip: 'Visa mer',
                unexpandTooltip: 'Visa mindre',
                listbody: '<div class="specification__resource--body">{{body}}</div>',
                listplaceholder: '<div class="alert alert-info" role="alert">Denna specifikation har inga resurser.</div>',
                rowhead:'<span class="specification__resource--header text-lg font-bold">{{text}}</span>' + 
                  '<span class="specification__resource--type text-md">{{prop "prof:hasRole" class="type" render="label"}}</span>' +
                  '<div class="specification__resource--description text-md esbDescription">{{ text content="\${skos:definition}" }}</div>' +
                  '<a target="_blank" class="specification__resource--downloadlink download_url text-md" href="{{resourceURI}}">${t(
                    "pages|specification_page$download",
                  )} {{prop "prof:hasRole" class="type" render="label"}}</a>',
              },
              {
                block: 'indexLink',
                extends: 'template',
                htemplate: '<a class="btn btn-default primaryBtn" href="/theme/specs">' +
                  'Tillbaka till sök' +
                  '</a>',
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
    <div className="detailpage specification">
      <Head>
        <title>{title ? `${title} - Sveriges dataportal` : "test"}</title>
        <meta property="og:title" content={`${title} - Sveriges dataportal`} />
        <meta name="twitter:title" content={`${title} - Sveriges dataportal`} />
      </Head>
      <div className="detailpage__wrapper">
        {/* Left column */}
        <div className="detailpage__wrapper--leftcol content">
          <h1>{title}</h1>
          <script
            type="text/x-entryscape-handlebar"
            data-entryscape="true"
            data-entryscape-component="template"
            dangerouslySetInnerHTML={{
              __html: `
                          <p class="text-md">
                            {{text relation="dcterms:publisher"}} 
                          <p>
                          `,
            }}
          ></script>

          <p className="text-md">
            <span
              data-entryscape="text"
              data-entryscape-content="${dcterms:description}"
            ></span>
          </p>

          <h2>{t("pages|specification_page$resource_specification")}</h2>
          <div
            className="specification__resource"
            data-entryscape="resourceDescriptors2"
            data-entryscape-rdftype="prof:ResourceDescriptor"
          ></div>

          <div className="contact__publisher hbbr">
            <h3>{t("pages|datasetpage$contact-publisher")}</h3>
            <p className="text-md">
              {t("pages|datasetpage$contact-publisher-text")}
              {t("pages|datasetpage$contact-publisher-text2")}{" "}
              <a
                className="link text-md"
                href="https://community.dataportal.se/"
                lang="en"
              >
                community
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="detailpage__wrapper--rightcol specification__about hbbr">
          <div className="detailpage__wrapper--rightcol-info text-base">
            <h2>{t("pages|specification_page$about_specification")}</h2>

            <span
              data-entryscape="hemvist"
              className="text-base hemvist hemvist__specification"
            />

            <div
              className="specificationDetails"
              data-entryscape="view"
              data-entryscape-rdformsid="prof:Profile"
              data-entryscape-filterpredicates="dcterms:title,dcterms:description,dcat:distribution,dcterms:publisher,prof:hasResource,adms:prev"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
