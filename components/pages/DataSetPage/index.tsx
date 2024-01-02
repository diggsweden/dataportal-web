import React, { useContext, useEffect, useState } from "react";
import { EntrystoreContext } from "../..";
import ShowMoreText from "react-show-more-text";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { SettingsContext } from "@/providers/SettingsProvider";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Head from "next/head";
import ChevronDown from "@/assets/icons/chevronDown.svg";
import ChevronRight from "@/assets/icons/chevronRight.svg";

import {
  accessrigthsIndicator,
  architechtureIndicator,
  exploreApiLink,
  licenseIndicator,
  periodicityIndicator,
} from "@/utilities";
import Container from "../../layout/Container";
import Heading from "../../global/Typography/Heading";
import { Button } from "@/components/global/Button";

const filterCatalogProperties = [
  "dcat:keyword",
  "dcterms:title",
  "dcterms:description",
  "dcterms:publisher",
  "dcat:bbox",
  "dcterms:spatial",
  "dcterms:provenance",
];

const filterAllExceptContactAndLandingPage = [
  ...filterCatalogProperties,
  "dcat:theme",
  "dcterms:identifier",
  "dcterms:language",
  "dcterms:modified",
  "dcterms:temporal",
  "dcterms:accrualPeriodicity",
  "dcterms:accessRights",
];

const filterContactAndLandingPage = [
  ...filterCatalogProperties,
  "dcat:contactPoint",
  "dcat:landingPage",
];

export const DataSetPage: React.FC = () => {
  const { pathname, query } = useRouter() || {};
  const { env } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { lang, t } = useTranslation();
  const { trackPageView } = useMatomo();
  const { dataSet, name } = query || {};
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];
  const hasWindow = typeof window !== "undefined";
  const postscribe = hasWindow && (window as any).postscribe;
  const [openList, setOpenList] = useState(false);
  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (hasWindow) {
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
  }, []);

  useEffect(() => {
    if (postscribe) {
      addScripts();
    }
  }, [postscribe]);

  useEffect(() => {
    trackPageView({ documentTitle: Array.isArray(name) ? name[0] : name });
  }, [pathname]);

  const addScripts = () => {
    if (hasWindow) {
      if (eid && cid) {
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

          function getApiExploreUrl(entryid,apientryid)
          {
            return '/${t(
              "routes|datasets$path",
            )}/${cid}_'+entryid+'/${name}/apiexplore/'+apientryid;
          }          
          
          window.__entryscape_config = [{

            block: 'config',
            page_language: '${lang}',
            entry: '${eid}', 
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
              ${accessrigthsIndicator},
              ${periodicityIndicator},
              ${licenseIndicator},
              ${architechtureIndicator},
              ${exploreApiLink(cid, eid, t)},
              {
                block: 'formatBadge',
                extends: 'template',
                template: '<div class="">' +
                  '{{#ifprop "dcterms:format" invert="true"}}' +
                  '<span title="Inget format angivet" class="" data-esb-collection-format="__na">-</span>' +
                  '{{/ifprop}}' +
                  '{{#eachprop "dcterms:format"}}' +
                  '<span title="{{value}}" class="" data-esb-collection-format="{{optionvalue}}">{{label}}</span>' +
                  '{{/eachprop}}</div>',
              },
              {
              block: 'formatBadges2',
              extends: 'template',
              template: '{{#eachprop "dcterms:format"}}' +
                '<span title="{{value}}" class="uppercase" data-esb-collection-format="{{optionvalue}}">{{label}}</span>' +
                '{{/eachprop}}',
              },
              {
                block: 'distributionAccessCustom',
                relation: 'dcat:distribution',
                extends: 'template',
                template: '{{#ifprop "dcat:downloadURL"}}' +
                  '{{#ifprop "dcat:downloadURL" min="2"}}${t(
                    "pages|datasetpage$several_links",
                  )}{{/ifprop}}' +
                  '{{#ifprop "dcat:downloadURL" min="2" invert="true"}}' +
                  '<a href="{{prop "dcat:downloadURL"}}" class="text-white" target="_blank"">${t(
                    "pages|datasetpage$download_link",
                  )}</a>' +
                  '{{/ifprop}}' +
                  '{{/ifprop}}' +
                  '{{#ifprop "dcat:downloadURL" invert="true"}}' +
                  '<a class="text-white" href="{{prop "dcat:accessURL"}}" target="_blank">' +
                  '<button class="button--primary flex items-center button--large">' +
                  '${t("pages|datasetpage$download_link_adress")}' +
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
                  '<path d="M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3M19 19H5V5H12V3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12H19V19Z" fill="#FFFFF  "/>' +
                  '</svg>' +
                  '<button>' +
                  '{{/ifprop}}',
              },
              {
                block: 'fileList2',
                extends: 'template',
                directlabel: false,
                template: '{{#unless directlabel}}' +
                  '{{fileListEntries}}' +
                  '{{else}}' +
                  '<div class=""><div class="" aria-live="polite">' +
                  '{{#eachprop "dcat:downloadURL"}}' +
                  
                  '<div class=""><div class="">' +
                  '<div class="">' +
                  '<span class=""><span class="">{{labelish}}</span>' +
                  '<span class=""><a href="{{value}}"' +
                  ' class="" target="_blank">' +
                  '${t(
                    "pages|datasetpage$download_link",
                  )}</a></span></span></div></div></div>' +
                  '{{/eachprop}}' +
                  '</div></div>' +
                  '{{/unless}}',
              },
              {
                block: 'accessServiceCustom',
                extends: 'template',
                relation: 'dcat:accessService',
                template: '<hr>' +
                  '{{view rdformsid="dcat:endpointDescription,dcat:dcterms:type_ds"}}' +
                  '{{link class="" namedclick="dataservice-link" content="${t(
                    "pages|datasetpage$read_about_api",
                  )}"}}'          
              },
              {
                block: 'costIndicator',
                extends: 'template',
                template: '{{#ifprop "schema:offers"}}<span class="" title="Avgift">' +
                  '<i class=""></i>' +
                  '<span class="">Avgift</span></span>' +
                  '{{/ifprop}}',
              },
              {
                block: 'costIndicator2',
                extends: 'template',
                template: '{{#ifprop "schema:offers"}}<span class="" title="Avgift"><i class=""></i>' +
                  '<span>Avgift</span></span>{{/ifprop}}',
              },
              
              




              {
                block: 'distributionListCustom',
                extends: 'list',
                relation: 'dcat:distribution',
                expandTooltip: 'Visa mer',
                unexpandTooltip: 'Visa mindre',
                registry: false,
                clickExpand: false,
                hl: 2,
                listbody: '<div class="">{{body}}</div>',
                listplaceholder: '<div role="alert">${t(
                  "pages|datasetpage$no_data",
                )}</div>',
                rowhead:
                  '<span class="">' +                 
                  '<span class="">{{text fallback="<span class=\\\'distributionNoName\\\'>${t(
                    "pages|datasetpage$no_title",
                  )}</span>"}}</span>' +                  
                  '<div class="">' +
                  
                  '{{exploreApiLink}}' +


                  '{{#ifprop "dcat:downloadURL" invert="true"}}' +
                  '<a class="text-white mt-2xl" href="{{prop "dcat:accessURL"}}" target="_blank">' +
                  '<button class="button--primary flex items-center button--large">' +
                  '${t("pages|datasetpage$download_link_adress")}' +
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
                  '<path d="M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3M19 19H5V5H12V3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12H19V19Z" fill="#FFFFF  "/>' +
                  '</svg>' +
                  '<button>' +
                  '{{/ifprop}}',

                  rowexpand: '{{#ifprop "dcat:downloadURL"}}' +
                  '</div>' +

                  '{{#ifprop "dcat:downloadURL" min="2"}}' +
                  '<h{{hinc}} class="">${t(
                    "pages|datasetpage$several_links_header",
                  )}</h{{hinc}}>' +
                  '{{fileList2 directlabel="inherit:registry"}}' +
                  '{{/ifprop}}' +
                  '{{/ifprop}}' +
                  '{{view rdformsid="dcat:Distribution" filterpredicates="dcat:downloadURL,dcterms:title,dcat:accessService"}}'
              },




              {
                block: 'listCustom',
                extends: 'template',
                template:
                  '{{view rdformsid="dcat:Distribution" filterpredicates="dcat:downloadURL,dcterms:title,dcat:accessService"}}'
              },

              {
                block: 'formatbadge',
                extends: 'template',
                template: '<span class="format-badge">{{formatBadges2}}</span>',
              },
              {
                block: 'api',
                extends: 'template',
                template: '<span class="text-textSecondary"><i></i>API</span>',
              },    
              {
                block: 'exploreAPI',
                extends: 'template',
                relation: 'dcat:distribution',
                template:
                  '<button class="button--primary flex items-center button--large">' +
                  '{{view rdformsid="dcat:endpointDescription,dcat:dcterms:type_ds"}}' +
                  '{{link class="api_readmore text-md link text-white" namedclick="dataservice-link" content="${t(
                    "pages|datasetpage$read_about_api",
                  )}"}}' +
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4.08008 11V13H16.0801L10.5801 18.5L12.0001 19.92L19.9201 12L12.0001 4.08002L10.5801 5.50002L16.0801 11H4.08008Z" fill="#6E615A"/></svg>' +
                  '</button>'
              },
              
              {
                block: 'keyword',
                extends: 'template',
                template:'{{#ifprop "dcat:keyword"}}' + 
                    '<div class="keywords">' +
                        '<div class="keywordHeading">' +
                          '${t("pages|datasetpage$keyword")}' +
                        '</div>' +
                        '<div>' +
                          '{{#eachprop "dcat:keyword" limit=4 expandbutton="${t(
                            "pages|datasetpage$view_more",
                          )}" unexpandbutton="${t(
                            "pages|datasetpage$view_less",
                          )}"}}' +
                            '<div title="{{value}}" class="keywordTitle" data-esb-collection-format="{{optionvalue}}">{{value}}</div>' +
                          '{{/eachprop}}' +
                        '</div>' +
                    '</div>' +
                  '{{/ifprop}}',
              },
              {
                block: 'aboutDataset',
                extends: 'template',
                template:
                            '<div>' +
                              '{{viewMetadata template="dcat:Dataset" filterpredicates="${filterAllExceptContactAndLandingPage.join(
                                ",",
                              )}"}}' +
                            '</div>' +
                            '<div class="keyword">' +
                              '{{keyword}}' +
                            '</div>' +
                            '<div>' +
                              '{{viewMetadata template="dcat:Dataset" filterpredicates="${filterContactAndLandingPage.join(
                                ",",
                              )}"}}' +
                            '</div>'
              },
            ]
          }]
          </script>              

          <script src="${
            lang === "sv"
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
    <main>
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
      <Container>
        {/* Title */}
        <Heading size="lg" className="py-xl text-xl lg:text-2xl" level={1}>
          {entry.title}
        </Heading>
        {/* Content wrapper */}
        <div className="lg:flex">
          {/* Left column */}
          <div className="lg:mr-2xl">
            {/* Indicators */}
            <div className="indicators">
              <div data-entryscape="accessRightsIndicator" />
              <div
                data-entryscape="periodicityIndicator"
                className="architectureIndicator"
              />
              <div
                data-entryscape="licenseIndicator"
                className="licenseIndicator"
              />
              <div data-entryscape="costIndicator2" className="costIndicator" />
            </div>

            {/* Description */}
            <div className="pt-lg text-md text-textSecondary">
              <ShowMoreText
                lines={8}
                more={t("pages|datasetpage$view_more")}
                less={t("pages|datasetpage$view_less")}
                className="text-md"
                anchorClass="text-md view-more-text-link font-strong cursor-pointer hover:underline"
                expanded={false}
              >
                <span className="text-md">{entry.description}</span>
              </ShowMoreText>
            </div>

            <div className="mt-lg flex flex-col bg-white p-lg">
              {/* Use data - header */}
              <div className="flex items-center justify-between pb-sm">
                <Heading level={2}>
                  <div data-entryscape="formatbadge"></div>
                </Heading>
                <div data-entryscape="api"></div>
              </div>
              {/* Publisher */}
              <script
                type="text/x-entryscape-handlebar"
                data-entryscape="true"
                data-entryscape-component="template"
                dangerouslySetInnerHTML={{
                  __html: `
                                <p class="mb-0 text-md text-textPrimary">
                                  {{text relation="dcterms:publisher"}} 
                                <p>
                                `,
                }}
              />
              <div>
                <div className="flex justify-between">
                  <div className="flex gap-lg">
                    <div data-entryscape="distributionAccessCustom"></div>
                    <div data-entryscape="exploreAPI"></div>
                  </div>
                  <Button
                    variant={"secondary"}
                    onClick={() => setOpenList(!openList)}
                    label={`${
                      openList
                        ? t("pages|datasetpage$view_less")
                        : t("pages|datasetpage$view_more")
                    }`}
                    icon={openList ? ChevronDown : ChevronRight}
                    iconPosition="right"
                  />
                </div>
              </div>

              {/* Distribution list */}
              <div
                className={`list slide-down + ${openList && " active"}`}
                data-entryscape="listCustom"
                data-entryscape-registry="true"
              ></div>
              {/* Dataset map */}
              <div
                className="dataset__map"
                data-entryscape="view"
                data-entryscape-rdformsid="dcat:dcterms:spatial_bb_da"
                data-entryscape-label="false"
              ></div>
              {/* Questions  or comments */}
              <div className="contact__publisher hbbr">
                <h3>{t("pages|datasetpage$contact-publisher")}</h3>
                <p className="">
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
              <div
                className="mt-lg"
                data-entryscape="distributionListCustom"
              ></div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg-mt-none mt-xl w-[296px]">
            {/* About dataset - wrapper  */}
            <div>
              <Heading level={2} size={"sm"}>
                {t("pages|datasetpage$about-dataset")}
              </Heading>

              {/* About dataset */}
              <div>
                <div
                  data-entryscape-dialog
                  data-entryscape-rdformsid="dcat:contactPoint"
                />
                <div data-entryscape="aboutDataset" className="about-dataset" />
              </div>
            </div>

            {/* Catalog informaton wrapper */}
            <div>
              <Heading size={"sm"} level={2}>
                {t("pages|datasetpage$catalog")}
              </Heading>
              {/* Catalog */}
              <script
                type="text/x-entryscape-handlebar"
                data-entryscape="true"
                data-entryscape-block="template"
                dangerouslySetInnerHTML={{
                  __html: `
                          {{viewMetadata 
                          relationinverse="dcat:dataset" 
                          onecol=true 
                          template="dcat:OnlyCatalog"                               
                          filterpredicates="dcterms:issued,dcterms:language,dcterms:modified,dcterms:spatial,dcterms:license,dcat:themeTaxonomi"
                          }}
                        `,
                }}
              ></script>
            </div>

            {/* Download RDF */}
            <script
              className=""
              type="text/x-entryscape-handlebar"
              data-entryscape="true"
              data-entryscape-block="template"
              dangerouslySetInnerHTML={{
                __html: `
                      <a class="text-white" href="{{metadataURI}}?recursive=dcat">
                      <button class="button--primary flex p-sm items-center justify-between">
                        ${t("pages|datasetpage$rdf")}
                        <svg class="ml-sm" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="#F0EFEE"/>
                        </svg>
                      </button>
                    </a>
                      `,
              }}
            ></script>
          </div>
        </div>
      </Container>
    </main>
  );
};
