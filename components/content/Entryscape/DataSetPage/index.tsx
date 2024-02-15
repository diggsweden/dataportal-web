import React, { useContext, useEffect, useState } from "react";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { SettingsContext } from "@/providers/SettingsProvider";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Button } from "@/components/global/Button";
import Head from "next/head";
import {
  architechtureIndicator,
  hvdIndicator,
  exploreApiLink,
  licenseIndicator,
  linkBase,
  periodicityIndicator,
  customIndicators,
} from "@/utilities";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";

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
  "http://data.europa.eu/r5r/applicableLegislation",
];

export const DataSetPage: React.FC = () => {
  const { pathname, query } = useRouter() || {};
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { lang, t } = useTranslation();
  const { trackPageView } = useMatomo();
  const { dataSet, name } = query || {};
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];
  const hasWindow = typeof window !== "undefined";
  const postscribe = hasWindow && (window as any).postscribe;
  const [showText, setShowText] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
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
  /*   console.log(entry); */
  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: entry.title,
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: t("routes|datasets$title"),
            link: { ...linkBase, link: `/${t("routes|datasets$path")}?q=&f=` },
          },
        ],
      });
  }, [pathname, entry]);

  useEffect(() => {
    if (postscribe) {
      addScripts();
    }
  }, [postscribe]);

  useEffect(() => {
    trackPageView({ documentTitle: Array.isArray(name) ? name[0] : name });
  }, [pathname]);

  useEffect(() => {
    (() => {
      const description = document.querySelector("#pre-description");
      if (description) {
        return setDescriptionHeight(description.clientHeight);
      }
    })();
  });

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
              ${customIndicators},
              ${periodicityIndicator},
              ${licenseIndicator},
              ${architechtureIndicator},
              ${hvdIndicator},
              ${exploreApiLink(cid, eid, t)},
              {
                block: 'formatBadge',
                extends: 'template',
                template: '<div class="">' +
                  '{{#ifprop "dcterms:format" invert="true"}}' +
                  '<span title="Inget format angivet" class="text-md" data-esb-collection-format="__na">-</span>' +
                  '{{/ifprop}}' +
                  '{{#eachprop "dcterms:format"}}' +
                  '<span title="{{value}}" class="uppercase" data-esb-collection-format="{{optionvalue}}">{{label}}</span>' +
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
                extends: 'template',
                template: '{{#ifprop "dcat:downloadURL"}}' +
                  '{{#ifprop "dcat:downloadURL" min="2"}}${t(
                    "pages|datasetpage$several_links",
                  )}{{/ifprop}}' +
                  '{{#ifprop "dcat:downloadURL" min="2" invert="true"}}' +
                  '<a href="{{prop "dcat:downloadURL"}}" class="text-white noUnderline">' +
                  '<button class="button--primary button--large text-white flex items-center !no-underline">' +
                  '${t("pages|datasetpage$download_link")}' +
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
                  '<path d="M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3M19 19H5V5H12V3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12H19V19Z" fill="#6E615A"/>' +
                  '</svg>' +
                  '</button>' +
                  '</a>' +
                  '{{/ifprop}}' +
                  '{{/ifprop}}' +
                  '{{#ifprop "dcat:downloadURL" invert="true"}}' +
                  '<a href="{{prop "dcat:accessURL"}}" class="text-white noUnderline">' +
                  '<button class="button--primary button--large text-white flex items-center !no-underline">' +
                  '${t("pages|datasetpage$download_link_adress")}' +
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
                  '<path d="M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3M19 19H5V5H12V3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12H19V19Z" fill="#6E615A"/>' +
                  '</svg>' +
                  '</button>' +
                  '</a>' +
                  '{{/ifprop}}',
              },
              {
                block: 'fileList2',
                extends: 'template',
                directlabel: false,
                template: '{{#unless directlabel}}' +
                  '{{fileListEntries}}' +
                  '{{else}}' +
                  '<div class="escoList"><div class="entryList" aria-live="polite">' +
                  '{{#eachprop "dcat:downloadURL"}}' +
                  
                  '<div class="esbRow distribution__extended-list"><div class="esbRowHead">' +
                  '<div class="esbRowMain">' +
                  '<span class="esbRowAlign"><span class="esbRowAlignPrimary text-base">{{labelish}}</span>' +
                  '<span class="esbRowAlignSecondary text-base"><a href="{{value}}"' +
                  ' class="text-base">' +
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
                template: 
                '<button class="button--primary button--large flex items-center !no-underline">' +
                  '{{link class="linkInBtn noUnderline" tabIndex="-1" namedclick="dataservice-link" content="${t(
                    "pages|datasetpage$read_about_api",
                  )}"}}' +
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
                  '<path d="M4.08008 11V13H16.0801L10.5801 18.5L12.0001 19.92L19.9201 12L12.0001 4.08002L10.5801 5.50002L16.0801 11H4.08008Z" fill="#6E615A"/>' +
                  '</svg>' +
                '</button>'          
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
                block: 'costIndicator2',
                extends: 'template',
                template: '{{#ifprop "schema:offers"}}<span class="esbIndicator" title="Avgift"><i class="fas fa-coins"></i>' +
                  '<span class="esbIndicatorLabel">Avgift</span></span>{{/ifprop}}',
              },
              
              {
                block: 'distributionListCustom',
                extends: 'list',
                relation: 'dcat:distribution',
                expandTooltip: '${t("pages|datasetpage$view_more")}',
                unexpandTooltip: '${t("pages|datasetpage$view_less")}',
                registry: false,
                clickExpand: false,
                hl: 2,
                listbody: '<div class="formats">{{body}}</div>',
                listplaceholder: '<div class="alert alert-info" role="alert">${t(
                  "pages|datasetpage$no_data",
                )}</div>',
                rowhead:
                  '<span class="flex flex-col gap-sm">' +
                  '<div class="flex justify-between gap-lg">' +
                  '<span class="text-textPrimary text-lg">{{formatBadges2}}</span>' +
                  '{{#ifprop "rdf:type" uri="esterms:ServiceDistribution"}}' +
                    '<span class="text-textSecondary text-md"></i>API</span>' +
                  '{{/ifprop}}' +  
                  '</div>' +                
                  '<span>{{text fallback="<span class=\\\'distributionNoName\\\'>${t(
                    "pages|datasetpage$no_title",
                  )}</span>"}}</span>' +                  
                  '<div class="flex flex-col md:flex-row gap-sm mt-md md:mt-none">' +
                  '{{distributionAccessCustom}}' +
                  '{{exploreApiLink}}' +
                  '</span>' +
                  '{{#ifprop "dcat:accessService"}}{{accessServiceCustom}}{{/ifprop}}',
                  rowexpand: '{{#ifprop "dcat:downloadURL"}}' +
                  '{{#ifprop "dcat:downloadURL" min="2"}}' +
                  '<h{{hinc}} class="distribution_files_header">${t(
                    "pages|datasetpage$several_links_header",
                  )}</h{{hinc}}>' +
                  '{{fileList2 directlabel="inherit:registry"}}' +
                  '{{/ifprop}}' +
                  '{{/ifprop}}' +
                  '{{view rdformsid="dcat:Distribution" filterpredicates="dcat:downloadURL,dcterms:title,dcat:accessService"}}'
              },
              
              {
                block: 'keyword',
                extends: 'template',
                template:'{{#ifprop "dcat:keyword"}}' + 
                    '<div class="rdforms">' +
                      '<div class="rdformsRow rdformsTopLevel">' +
                        '<div class="rdformsLabel">' +
                          '${t("pages|datasetpage$keyword")}' +
                        '</div>' +
                        '<div>' +
                          '{{#eachprop "dcat:keyword" limit=4 expandbutton="${t(
                            "pages|datasetpage$view_more",
                          )}" unexpandbutton="${t(
                            "pages|datasetpage$view_less",
                          )}"}}' +
                            '<div title="{{value}}" class="text-sm mb-sm font-strong bg-pink-200 w-fit py-xs px-sm" data-esb-collection-format="{{optionvalue}}">{{value}}</div>' +
                          '{{/eachprop}}' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                  '{{/ifprop}}',
              },
              {
                block: 'aboutDataset',
                extends: 'template',
                template: '<div class="about_dataset">' +
                            '<div class="view_metadata_group">' +
                              '{{viewMetadata template="dcat:Dataset" filterpredicates="${filterAllExceptContactAndLandingPage.join(
                                ",",
                              )}"}}' +
                            '</div>' +
                            '<div class="keyword">' +
                              '{{keyword}}' +
                            '</div>' +
                            '<div class="view_metadata_group">' +
                              '{{viewMetadata template="dcat:Dataset" filterpredicates="${filterContactAndLandingPage.join(
                                ",",
                              )}"}}' +
                            '</div>' +
                          '</div>',
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
      <div>
        {/* Title */}
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {entry.title}
        </Heading>

        <div className="mb-lg gap-2xl md:mb-xl lg:flex">
          {/* Left column */}
          <div className="mb-lg flex w-full max-w-md flex-col gap-lg lg:mb-xl">
            {/* Publisher */}
            <script
              type="text/x-entryscape-handlebar"
              data-entryscape="true"
              data-entryscape-component="template"
              dangerouslySetInnerHTML={{
                __html: `
                              
                                  {{text relation="dcterms:publisher"}} 
                               
                                `,
              }}
            />

            {/* Indicators */}
            <div
              data-entryscape="customIndicators"
              className="indicators flex flex-col flex-wrap gap-x-lg gap-y-sm text-textSecondary md:flex-row"
            />

            <div className="indicators flex max-w-fit flex-col md:flex-row [&_div]:min-w-fit">
              <div
                data-entryscape="periodicityIndicator"
                className="architectureIndicator"
              />
              <div
                data-entryscape="licenseIndicator"
                className="licenseIndicator"
              />
              <div data-entryscape="hvdIndicator" className="hvdIndicator" />
              <div data-entryscape="costIndicator2" className="costIndicator" />
            </div>

            {/* Description */}
            <div className="flex flex-col items-end gap-sm">
              <pre
                id="pre-description"
                className={`w-full whitespace-pre-line text-left font-ubuntu text-md ${
                  showText ? "line-clamp-none" : "line-clamp-[8]"
                }`}
              >
                {entry.description}
              </pre>
              {descriptionHeight > 191 && (
                <Button
                  size={"sm"}
                  variant={"plain"}
                  label={
                    showText
                      ? t("pages|datasetpage$view_less")
                      : t("pages|datasetpage$view_more")
                  }
                  onClick={() => setShowText(!showText)}
                />
              )}
            </div>

            <div>
              {/* Distribution list */}
              <div
                className="distribution__list"
                data-entryscape="distributionListCustom"
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
                <Heading
                  level={2}
                  size={"sm"}
                  className="mb-sm text-textSecondary md:mb-md"
                >
                  {t("pages|datasetpage$contact-publisher")}
                </Heading>
                <p>
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
          </div>
          {/* Right column */}
          <div className="mb-lg w-full pt-none lg:mb-none lg:max-w-[296px]">
            {/* About dataset - wrapper  */}
            <div className=" lg:w-[296px] ">
              <Heading
                level={2}
                size={"sm"}
                className="mb-md text-textSecondary md:mb-lg"
              >
                {t("pages|datasetpage$about-dataset")}
              </Heading>
              {/* About dataset */}
              <div
                data-entryscape-dialog
                data-entryscape-rdformsid="dcat:contactPoint"
              />
              <div data-entryscape="aboutDataset" className="mb-lg" />
            </div>

            {/* Catalog informaton wrapper */}
            <div className="bg-white p-md">
              <Heading
                level={2}
                size={"sm"}
                className="mb-sm text-textSecondary md:mb-md"
              >
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

              {/* Download RDF */}
              <script
                className="download__rdf"
                type="text/x-entryscape-handlebar"
                data-entryscape="true"
                data-entryscape-block="template"
                dangerouslySetInnerHTML={{
                  __html: `
                      <a class="text-white noUnderline" href="{{metadataURI}}?recursive=dcat">
                      <button class="button--primary button--large text-white flex items-center !no-underline">
                      ${t("pages|datasetpage$rdf")}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="#F0EFEE"/>
                      </svg>
                      </button>
                      </a>
                      `,
                }}
              ></script>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
