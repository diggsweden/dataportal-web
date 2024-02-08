import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApiExplorerProps } from "@/components/content/Entryscape/ApiExploring";

import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import useTranslation from "next-translate/useTranslation";
import { SettingsContext } from "@/providers/SettingsProvider";
import { useRouter } from "next/router";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Head from "next/head";
import { Heading } from "@/components/global/Typography/Heading";
import { Container } from "@/components/layout/Container";
import { linkBase } from "@/utilities";
import { CustomLink } from "@/components/global/CustomLink";

const ApiExplorer = dynamic(
  () =>
    import("@/components/content/Entryscape/ApiExploring").then(
      (c) => c.ApiExplorer,
      (e) => e as React.FC<ApiExplorerProps>,
    ),
  { ssr: false },
);

export const DataSetExploreApiPage: React.FC<{
  dataSet: string | string[] | undefined;
  apieid: string | string[] | undefined;
}> = ({ dataSet, apieid }) => {
  const { pathname, query } = useRouter() || {};
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];
  const { t, lang } = useTranslation();
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);

  const [toggleTabs, setToggleTabs] = useState(1);
  const tab = toggleTabs === 1;
  const { trackPageView } = useMatomo();
  let postscribe: any;

  //Toggle between tabs
  const toggleTab = (index: any) => {
    setToggleTabs(index);
  };

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (typeof window !== "undefined") {
      //check if refering search params is set to hash
      if (
        window.location &&
        window.location.hash &&
        window.location.hash.includes("ref=?")
      )
        window.onpopstate = () => {
          window.location.reload();
        };
    }
  }, []);

  useEffect(() => {
    addScriptsDistribution();
  }, []);

  useEffect(() => {
    trackPageView({
      documentTitle: `${t("routes|api_explore$title")} - ${apieid}`,
    });
  }, [pathname]);

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: t("routes|api_explore$title"),
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: t("routes|datasets$title"),
            link: { ...linkBase, link: `/${t("routes|datasets$path")}?q=&f=` },
          },
          {
            name: (entry.title as string) || "",
            link: {
              ...linkBase,
              link: `/${t("routes|datasets$path")}/${query.dataSet}/${
                query.name
              }`,
            },
          },
        ],
      });
  }, [entry]);

  const addScriptsDistribution = () => {
    if (typeof window !== "undefined") {
      postscribe = (window as any).postscribe;

      if (apieid && cid) {
        postscribe(
          "#scriptsPlaceholder",
          ` 
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_DATASETS_PATH
                ? env.ENTRYSCAPE_DATASETS_PATH
                : "admin.dataportal.se"
            }\/store'          
          };
          window.__entryscape_config = [{

            block: 'config',
            page_language: '${lang}',
            entry: '${apieid}', 
            context: '${cid}',
            clicks: {"dataservice-link":"/dataservice/\${context}_\${entry}/"},
            namespaces:{
              esterms: 'http://entryscape.com/terms/',
              peu: 'http://publications.europa.eu/resource/authority/'
            },

            collections: [
              {
                type: 'facet',
                name: 'format',
                label: 'Format',
                property: 'dcterms:format',
                related: false,
                nodetype: 'literal',
                searchIndextype: 'string',
                limit: 7,
                options: {
                  pdf: ['PDF', 'application/pdf'],
                  html: ['text/html', 'application/xhtml+xml', 'HTML'],
                  xml: ['application/xml', 'text/xml', 'XML'],
                  json: ['application/json', 'application/ld+json', 'application/json-ld', 'application/json+zip'],
                  csv: ['text/csv', 'CSV', '.csv', 'application/zip+csv', 'text/csv+zip'],
                  text: ['text/plain', '.txt'],
                  rdf: ['application/rdf+xml', 'application/sparql-query'],
                  zip: ['ZIP', 'application/zip', 'application/x-zip-compressed'],
                  image: ['jpg', 'image/jpeg', 'image/jpg', 'image/png', 'tiff', 'image/tiff'],
                  atom: ['application/atom+xml'],
                  wfs: ['application/vnd.ogc.wfs_xml', 'application/gml+xml', 'wfs'],
                  wms: ['application/vnd.ogc.wms_xml', 'application/vnd.iso.19139+xml', 'WMS'],
                  wmts: ['application/vnd.ogc.wmts_xml'],
                  wcs: ['application/vnd.ogc.wcs_xml'],
                  kml: ['application/vnd.google-earth.kml+xml'],
                  geojson: ['application/vnd.geo+json'],
                  shp: ['application/x-shapefile', 'application/x-shp'],
                  xls: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', '.xlsx', '.xls'],
                  ods: ['application/vnd.oasis.opendocument.spreadsheet'],
                  '${t("pages|datasetpage$fileformat")}': null,
                },
              },
            ],

            blocks: [
              {
                block: 'licenseIndicator2',
                loadEntry: true,
                run: function(node, data, items, entry) {
                  var v = entry.getAllMetadata().findFirstValue(null, 'dcterms:license');
                  if (v.indexOf("http://creativecommons.org/") === 0) {
                    var variant;
                    if (v === "http://creativecommons.org/publicdomain/zero/1.0/") {
                      variant = "Creative Commons";
                    } else if (v.indexOf("http://creativecommons.org/licenses/") === 0) {
                      variant = "Creative commons";
                    } else {
                      return; // Unknown cc version.
                    }
                    node.innerHTML = '<span class="esbIndicator" title="Licens från Creative Commons">' +
                      '<i class="license-icon fab fa-creative-commons"></i>' +
                      '<span class="esbIndicatorLabel">' + variant.toLowerCase() + '</span></span>';
                  }
                },
              },
              {
                block: 'architectureIndicator',
                extends: 'template',
                template: '{{#ifprop "dcterms:type"}}' +
                  '<span class="esbIndicator" title="TjÃ¤nstens arkitekturstil">' +
                  '<span class="material-icons-outlined">build_circle</span>' +
                  '<i class="fas fa-wrench"></i>' +
                  '<span class="esbIndicatorLabel">{{#eachprop "dcterms:type"}}{{label}}{{separator}}{{/eachprop}}</span></span>' +
                  '{{/ifprop}}',
              },
              {
                block: 'costIndicator',
                extends: 'template',
                template: '{{#ifprop "schema:offers"}}<span class="esbIndicator" title="Avgift">' +
                  '<i class="fas fa-coins"></i>' +
                  '<span class="esbIndicatorLabel">Avgift</span></span>' +
                  '{{/ifprop}}',
              },
              {
                block: 'accessRightsIndicator',
                extends: 'template',
                template: '{{#ifprop "dcterms:accessRights"}}' +
                  '{{#eachprop "dcterms:accessRights"}}<span class="esbIndicator" title="{{description}}">' +
                  '{{#ifprop "dcterms:accessRights" uri="peu:access-right/PUBLIC"}}' +
                  '<i class="fas fa-lock-open"></i>{{/ifprop}}' +
                  '{{#ifprop "dcterms:accessRights" uri="peu:access-right/NON_PUBLIC"}}' +
                  '<i class="fas fa-key"></i>{{/ifprop}}' +
                  '{{#ifprop "dcterms:accessRights" uri="peu:access-right/RESTRICTED"}}' +
                  '<i class="fas fa-lock"></i>{{/ifprop}}' +
                  '<span class="esbIndicatorLabel">{{label}}</span>{{/eachprop}}' +
                  '</span>{{/ifprop}}',
              },
              {
                block: 'periodicityIndicator',
                extends: 'template',
                template: '{{#eachprop "dcterms:accrualPeriodicity"}}<span class="esbIndicator" title="Uppdateringsfrekvens">' +
                  '<i class="fas fa-redo"></i>' +
                  '<span class="">{{label}}</span></span>{{/eachprop}}',
              },

              {
                block: 'costIndicator2',
                extends: 'template',
                template: '{{#ifprop "schema:offers"}}<span class="esbIndicator" title="Avgift"><i class="fas fa-coins"></i>' +
                  '<span class="esbIndicatorLabel">Avgift</span></span>{{/ifprop}}',
              },         
          ]
          }]
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
      <div className="detailpage__wrapper-topinfo">
        {/* Title */}
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {t("pages|explore-api-page$explore-api")}
        </Heading>
        {/* Publisher */}
        <span>{entry.publisher}</span>
        {/* Indicators */}
        <div className="my-lg flex text-textSecondary">
          <div
            data-entryscape="accessRightsIndicator"
            className="accessRightsIndicator"
            data-entryscape-entry={eid}
            data-entryscape-context={cid}
          ></div>
          <div
            data-entryscape="periodicityIndicator"
            className="architectureIndicator"
            data-entryscape-entry={eid}
            data-entryscape-context={cid}
          ></div>
          <div
            data-entryscape="licenseIndicator2"
            className="licenseIndicator"
            data-entryscape-entry={eid}
            data-entryscape-context={cid}
          ></div>

          <div
            data-entryscape="costIndicator2"
            className="costIndicator"
            data-entryscape-entry={eid}
            data-entryscape-context={cid}
          ></div>
        </div>
        <div className="flex flex-col">
          {/* Refers to dataset - heading*/}
          <Heading level={2} size={"sm"} className="mb-sm md:mb-md">
            {t("pages|explore-api-page$belongs-to-dataset")}
          </Heading>

          {/* Refers to dataset - datset */}
          <span className="break-words text-sm lg:text-md">{entry.title}</span>
        </div>

        <div className="my-lg h-[1px] break-words border border-brown-600 opacity-20"></div>

        {/* Tabs navigation */}
        <nav className="mb-lg">
          <ul className="flex gap-xl">
            <li>
              <button
                className={
                  tab
                    ? "text-md underline decoration-2 underline-offset-4	 lg:text-lg"
                    : "text-md lg:text-lg"
                }
                onClick={() => toggleTab(1)}
              >
                {t("pages|explore-api-page$api-contract")}
              </button>
            </li>
            <li>
              <button
                className={
                  !tab
                    ? "text-md underline decoration-2	underline-offset-4 lg:text-lg"
                    : "text-md lg:text-lg"
                }
                onClick={() => toggleTab(2)}
              >
                Information
              </button>
            </li>
          </ul>
        </nav>

        {/* Tabs */}
        <div>
          <div className={tab ? "block" : "hidden"}>
            <ApiExplorer env={env} contextId={cid} entryId={apieid as string} />
          </div>

          <div className={!tab ? "block" : "hidden"}>
            <div className="mb-xl" data-entryscape="view"></div>

            <div className="max-w-md bg-pink-200 p-md [&_h2]:mb-xs [&_h2]:text-md [&_h2]:text-textSecondary [&_h2]:lg:text-lg [&_p]:mb-lg [&_p]:text-sm [&_p]:text-textPrimary [&_p]:lg:text-md">
              <div>
                <Heading level={2} size={"sm"}>
                  {t("pages|explore-api-page$access-to-api")}
                </Heading>
                <p>{t("pages|explore-api-page$access-to-api-txt")}</p>
                <Heading level={2} size={"sm"}>
                  {t("pages|explore-api-page$open-apis")}
                </Heading>
                <p>{t("pages|explore-api-page$open-apis-txt")}</p>
                <Heading level={2} size={"sm"}>
                  {t("pages|explore-api-page$api-key")}
                </Heading>
                <p>{t("pages|explore-api-page$api-key-txt")}</p>
              </div>
              {entry.contact && (
                <div className="mb-md">
                  <Heading level={2} size={"sm"}>
                    {t("pages|explore-api-page$contact-publisher")}
                  </Heading>

                  <CustomLink
                    className="!mb-lg text-brown-800"
                    href={`mailto:${entry.contact.email}`}
                  >
                    {entry.contact.name}
                  </CustomLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
