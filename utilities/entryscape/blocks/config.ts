import { Translate } from "next-translate";

import { EnvSettings } from "@/env/env-settings";
import { includeLangInPath } from "@/utilities/check-lang";

import { apiexploreBlocks } from "./apiexplore";
import { conceptBlocks } from "./concept";
import { dataserviceBlocks } from "./dataservice";
import { datasetBlocks } from "./datasets";
import { specificationBlocks } from "./specification";
import { terminologyBlocks } from "./terminology";

interface CreateBlocksConfigProps {
  entrystoreBase: string;
  env: EnvSettings;
  lang: string;
  iconSize?: number;
  t: Translate;
  pageType: string;
  context: string;
  esId: string;
}

export const createBlocksConfig = ({
  entrystoreBase,
  env,
  lang,
  iconSize,
  context,
  esId,
  t,
  pageType,
}: CreateBlocksConfigProps) => {
  const baseConfig = {
    block: "config",
    page_language: lang,
    spa: true,
    entrystore: entrystoreBase || "https://admin.dataportal.se/store",
    ...(context !== "" && { context }),
    ...(esId !== "" && { entry: esId }),
  };

  switch (pageType) {
    case "specification":
      return [
        {
          ...baseConfig,
          clicks: {
            specification: "details.html",
            specifications: "index.html",
          },
          collections: [
            {
              type: "facet",
              name: "theme",
              label: "Theme",
              property: "dcat:theme",
              nodetype: "uri",
              templatesource: "dcat:theme-isa",
            },
          ],
          namespaces: {
            adms: "http://www.w3.org/ns/adms#",
            prof: "http://www.w3.org/ns/dx/prof/",
          },
          itemstore: {
            bundles: [
              "dcat",
              `https://${
                env.ENTRYSCAPE_SPECS_PATH.includes("sandbox")
                  ? "sandbox.admin.dataportal.se"
                  : "editera.dataportal.se"
              }/theme/templates/adms.json`,
              `https://${
                env.ENTRYSCAPE_SPECS_PATH.includes("sandbox")
                  ? "sandbox.editera.dataportal.se"
                  : "editera.dataportal.se"
              }/theme/templates/prof.json`,
            ],
          },
          blocks: specificationBlocks(t, iconSize || 24),
        },
      ];
    case "concept":
      return [
        {
          ...baseConfig,
          clicks: {
            concept: "details",
            concepts: "index",
            test: "test.html",
          },
          collections: [
            {
              type: "facet",
              name: "terminology",
              label: "Terminologier",
              property: "skos:inScheme",
              nodetype: "uri",
              limit: 10,
            },
          ],
          namespaces: {
            adms: "http://www.w3.org/ns/adms#",
            prof: "http://www.w3.org/ns/dx/prof/",
          },
          blocks: conceptBlocks(t, iconSize || 24, lang),
        },
      ];
    case "terminology":
      return [
        {
          ...baseConfig,
          clicks: {
            concept: "details",
            concepts: "index",
            test: "test.html",
          },
          collections: [
            {
              type: "facet",
              name: "terminology",
              label: "Terminologier",
              property: "skos:inScheme",
              nodetype: "uri",
              limit: 10,
            },
          ],
          namespaces: {
            adms: "http://www.w3.org/ns/adms#",
            prof: "http://www.w3.org/ns/dx/prof/",
          },
          blocks: terminologyBlocks(t, lang),
        },
      ];
    case "dataset":
      return [
        {
          ...baseConfig,
          clicks: {
            "dataservice-link": "/" + lang + "/dataservice/${context}_${entry}",
          },
          namespaces: {
            esterms: "http://entryscape.com/terms/",
            peu: "http://publications.europa.eu/resource/authority/",
          },
          collections: [
            {
              type: "facet",
              name: "format",
              label: "Format",
              property: "dcterms:format",
              related: false,
              nodetype: "literal",
              searchIndextype: "string",
              limit: 7,
              options: {
                pdf: ["PDF", "application/pdf"],
                html: ["text/html", "application/xhtml+xml", "HTML"],
                xml: ["application/xml", "text/xml", "XML"],
                json: [
                  "application/json",
                  "application/ld+json",
                  "application/json-ld",
                  "application/json+zip",
                ],
                csv: [
                  "text/csv",
                  "CSV",
                  ".csv",
                  "application/zip+csv",
                  "text/csv+zip",
                ],
                text: ["text/plain", ".txt"],
                rdf: ["application/rdf+xml", "application/sparql-query"],
                zip: ["ZIP", "application/zip", "application/x-zip-compressed"],
                image: [
                  "jpg",
                  "image/jpeg",
                  "image/jpg",
                  "image/png",
                  "tiff",
                  "image/tiff",
                ],
                atom: ["application/atom+xml"],
                wfs: [
                  "application/vnd.ogc.wfs_xml",
                  "application/gml+xml",
                  "wfs",
                ],
                wms: [
                  "application/vnd.ogc.wms_xml",
                  "application/vnd.iso.19139+xml",
                  "WMS",
                ],
                wmts: ["application/vnd.ogc.wmts_xml"],
                wcs: ["application/vnd.ogc.wcs_xml"],
                kml: ["application/vnd.google-earth.kml+xml"],
                geojson: ["application/vnd.geo+json"],
                shp: ["application/x-shapefile", "application/x-shp"],
                xls: [
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "application/vnd.ms-excel",
                  ".xlsx",
                  ".xls",
                ],
                ods: ["application/vnd.oasis.opendocument.spreadsheet"],
                [t("pages|datasetpage$fileformat")]: null,
              },
            },
          ],
          blocks: datasetBlocks(t, iconSize || 24, lang, context, esId),
        },
      ];
    case "dataservice":
      return [
        {
          ...baseConfig,
          namespaces: {
            esterms: "http://entryscape.com/terms/",
            peu: "http://publications.europa.eu/resource/authority/",
          },
          blocks: dataserviceBlocks(t, iconSize || 24, lang, context, esId),
        },
      ];
    case "apiexplore":
      return [
        {
          ...baseConfig,
          clicks: {
            "dataservice-link": "/" + lang + "/dataservice/${context}_${entry}",
          },
          namespaces: {
            esterms: "http://entryscape.com/terms/",
            peu: "http://publications.europa.eu/resource/authority/",
          },
          collections: [
            {
              type: "facet",
              name: "format",
              label: "Format",
              property: "dcterms:format",
              related: false,
              nodetype: "literal",
              searchIndextype: "string",
              limit: 7,
              options: {
                pdf: ["PDF", "application/pdf"],
                html: ["text/html", "application/xhtml+xml", "HTML"],
                xml: ["application/xml", "text/xml", "XML"],
                json: [
                  "application/json",
                  "application/ld+json",
                  "application/json-ld",
                  "application/json+zip",
                ],
                csv: [
                  "text/csv",
                  "CSV",
                  ".csv",
                  "application/zip+csv",
                  "text/csv+zip",
                ],
                text: ["text/plain", ".txt"],
                rdf: ["application/rdf+xml", "application/sparql-query"],
                zip: ["ZIP", "application/zip", "application/x-zip-compressed"],
                image: [
                  "jpg",
                  "image/jpeg",
                  "image/jpg",
                  "image/png",
                  "tiff",
                  "image/tiff",
                ],
                atom: ["application/atom+xml"],
                wfs: [
                  "application/vnd.ogc.wfs_xml",
                  "application/gml+xml",
                  "wfs",
                ],
                wms: [
                  "application/vnd.ogc.wms_xml",
                  "application/vnd.iso.19139+xml",
                  "WMS",
                ],
                wmts: ["application/vnd.ogc.wmts_xml"],
                wcs: ["application/vnd.ogc.wcs_xml"],
                kml: ["application/vnd.google-earth.kml+xml"],
                geojson: ["application/vnd.geo+json"],
                shp: ["application/x-shapefile", "application/x-shp"],
                xls: [
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "application/vnd.ms-excel",
                  ".xlsx",
                  ".xls",
                ],
                ods: ["application/vnd.oasis.opendocument.spreadsheet"],
                [t("pages|datasetpage$fileformat")]: null,
              },
            },
          ],
          blocks: apiexploreBlocks(t, iconSize || 24),
        },
      ];
    case "mqa":
      return [
        {
          ...baseConfig,
          clicks: {
            katalog:
              includeLangInPath(lang) +
              "/metadatakvalitet/katalog/${entry}/${context}",
          },
        },
      ];
    default:
      return [baseConfig];
  }
};
