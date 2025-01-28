import { Translate } from "next-translate";

import {
  catalog,
  exploreApiLink,
  keyword,
  theme,
  customIndicators,
} from "./global";

export const datasetBlocks = (
  t: Translate,
  iconSize: number,
  lang: string,
  cid: string,
  eid: string,
) => {
  return [
    ...customIndicators(t, iconSize),
    ...exploreApiLink(lang, cid, eid, t),
    keyword(t),
    theme(t),
    catalog,
    {
      block: "formatBadge",
      extends: "template",
      template: {
        wrapper: '<div class="">',
        noFormat: {
          condition: '{{#ifprop "dcterms:format" invert="true"}}',
          content:
            '<span title="Inget format angivet" class="text-md" data-esb-collection-format="__na">-</span>',
        },
        formats: {
          condition: '{{#eachprop "dcterms:format"}}',
          content:
            '<span title="{{value}}" class="uppercase" data-esb-collection-format="{{optionvalue}}">{{label}}</span>',
        },
        wrapperEnd: "</div>",
      },
    },
    {
      block: "formatBadges2",
      extends: "template",
      template:
        '{{#eachprop "dcterms:format"}}' +
        '<span title="{{value}}" class="uppercase" data-esb-collection-format="{{optionvalue}}">{{label}}</span>' +
        "{{/eachprop}}",
    },
    {
      block: "distributionAccessCustom",
      extends: "template",
      template:
        '{{#ifprop "dcat:downloadURL"}}' +
        '{{#ifprop "dcat:downloadURL" min="2"}}' +
        t("pages|datasetpage$several_links") +
        "{{/ifprop}}" +
        '{{#ifprop "dcat:downloadURL" min="2" invert="true"}}' +
        '<a href="{{prop "dcat:downloadURL"}}" class="text-white noUnderline">' +
        '<span class="button--primary button--large text-white flex items-center !no-underline">' +
        t("pages|datasetpage$download_link") +
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        1.5 * iconSize +
        '" height="' +
        1.5 * iconSize +
        '" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">' +
        '<path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="#6E615A"/>' +
        "</svg>" +
        "</span>" +
        "</a>" +
        "{{/ifprop}}" +
        "{{/ifprop}}" +
        '{{#ifprop "dcat:downloadURL" invert="true"}}' +
        '<a href="{{prop "dcat:accessURL"}}" class="text-white noUnderline">' +
        '<span class="button--primary button--large text-white flex items-center !no-underline">' +
        t("pages|datasetpage$download_link_adress") +
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        1.5 * iconSize +
        '" height="' +
        1.5 * iconSize +
        '" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">' +
        '<path d="M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3M19 19H5V5H12V3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12H19V19Z" fill="#6E615A"/>' +
        "</svg>" +
        "</span>" +
        "</a>" +
        "{{/ifprop}}",
    },
    {
      block: "fileList2",
      extends: "template",
      directlabel: false,
      template:
        "{{#unless directlabel}}" +
        "{{fileListEntries}}" +
        "{{else}}" +
        '<div class="escoList">' +
        '<div class="space-y-lg" aria-live="polite">' +
        '{{#eachprop "dcat:downloadURL"}}' +
        '<div class="flex flex-col md:flex-row gap-md md:gap-lg md:justify-between md:items-center">' +
        '<span class="text-md">{{labelish}}</span>' +
        '<a class="text-white noUnderline mr-xs" href="{{value}}">' +
        '<span class="button--primary button--small md:button--large text-white flex items-center !no-underline whitespace-nowrap">' +
        t("pages|datasetpage$download_link") +
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        1.5 * iconSize +
        '" height="' +
        1.5 * iconSize +
        '" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">' +
        '<path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="#F0EFEE"/>' +
        "</svg>" +
        "</span>" +
        "</a>" +
        "</div>" +
        "{{/eachprop}}" +
        "</div>" +
        "</div>" +
        "{{/unless}}",
    },
    {
      block: "accessServiceCustom",
      extends: "template",
      relation: "dcat:accessService",
      template:
        '<span class="border-t border-brown-600 pt-md flex flex-col">' +
        '{{view rdformsid="dcat:endpointDescription,dcat:dcterms:type_ds"}}' +
        '<button class="button--primary button--large flex items-center !no-underline w-fit">' +
        '{{link class="linkInBtn noUnderline" namedclick="dataservice-link" content="' +
        t("pages|datasetpage$read_about_api") +
        '"}}' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        1.5 * iconSize +
        '" height="' +
        1.5 * iconSize +
        '" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">' +
        '<path d="M4.08008 11V13H16.0801L10.5801 18.5L12.0001 19.92L19.9201 12L12.0001 4.08002L10.5801 5.50002L16.0801 11H4.08008Z" fill="#6E615A"/>' +
        "</svg>" +
        "</button>" +
        "</span>",
    },
    {
      block: "distributionListCustom",
      extends: "list",
      relation: "dcat:distribution",
      expandTooltip: t("pages|datasetpage$view_more"),
      unexpandTooltip: t("pages|datasetpage$view_less"),
      registry: false,
      expandButton: false,
      hl: 2,
      listbody: '<div class="formats">{{body}}</div>',
      listplaceholder:
        '<div class="alert alert-info" role="alert">' +
        t("pages|datasetpage$no_data") +
        "</div>",
      rowhead:
        '<span class="flex flex-col">' +
        '<div class="flex justify-between gap-lg mb-sm">' +
        '<span class="text-textPrimary text-lg">{{formatBadges2}}</span>' +
        '{{#ifprop "rdf:type" uri="esterms:ServiceDistribution"}}' +
        '<span class="text-textSecondary text-md"></i>API</span>' +
        "{{/ifprop}}" +
        "</div>" +
        "<span>{{text fallback='<span class=\\'distributionNoName\\'>'}}</span>" +
        t("pages|datasetpage$no_title") +
        "</span>" +
        "</span>" +
        "<div class='flex flex-wrap justify-between items-end md:items-center mt-md md:mt-lg gap-lg'>" +
        "<div class='flex flex-col md:flex-row'>" +
        "{{distributionAccessCustom}}" +
        "{{exploreApiLink}}" +
        "</div>" +
        '<button open="{{expandTooltip}}" close="{{unexpandTooltip}}" class="esbExpandButton button button--secondary button--large h-fit text-nowrap">' +
        "</button>" +
        "</div>",
      rowexpand:
        '{{#ifprop "dcat:downloadURL"}}' +
        '{{#ifprop "dcat:downloadURL" min="2"}}' +
        '<h3 class="rdformsLabel !mt-none">' +
        t("pages|datasetpage$several_links_header") +
        "</h3>" +
        '{{fileList2 directlabel="inherit:registry"}}' +
        "{{/ifprop}}" +
        "{{/ifprop}}" +
        '{{view rdformsid="dcat:Distribution" filterpredicates="dcat:downloadURL,dcterms:title,dcat:accessService"}}' +
        '{{#ifprop "dcat:accessService"}}{{accessServiceCustom}}{{/ifprop}}',
    },
    {
      block: "aboutDataset",
      extends: "template",
      template:
        '<div class="about_dataset">' +
        '<div class="view_metadata_group">' +
        '{{viewMetadata template="dcat:Dataset" filterpredicates="' +
        filterAllExceptContactAndLandingPage.join(",") +
        '"}}' +
        "</div>" +
        '<div class="keyword">' +
        "{{keyword}}" +
        "</div>" +
        '<div class="theme">' +
        "{{theme}}" +
        "</div>" +
        '<div class="view_metadata_group">' +
        '{{viewMetadata template="dcat:Dataset" filterpredicates="' +
        filterContactAndLandingPage.join(",") +
        '"}}' +
        "</div>" +
        "</div>",
    },
  ];
};

const filterCatalogProperties = [
  "dcterms:title",
  "dcterms:description",
  "dcterms:spatial",
  "dcat:keyword",
  "dcat:theme",
  "dcterms:publisher",
  "dcterms:provenance",
  "dcat:inSeries",
];

const filterAllExceptContactAndLandingPage = [
  ...filterCatalogProperties,
  "dcterms:issued",
  "http://www.w3.org/ns/adms#versionNotes",
  "dcat:theme",
  "dcat:temporalResolution",
  "dcterms:identifier",
  "dcterms:language",
  "dcterms:modified",
  "dcterms:temporal",
  "dcterms:accrualPeriodicity",
  "dcterms:accessRights",
  "dcterms:conformsTo",
  "dcat:version",
  "dcat:hasVersion",
  "dcat:spatialResolutionInMeters",
  "dcterms:isReferencedBy",
  "dcterms:relation",
  "dcat:qualifiedRelation",
];

const filterContactAndLandingPage = [
  ...filterCatalogProperties,
  "dcterms:creator",
  "adms:identifier",
  "dcat:contactPoint",
  "dcterms:source",
  "dcat:landingPage",
  "http://data.europa.eu/r5r/applicableLegislation",
  "http://xmlns.com/foaf/0.1/page",
  "http://data.europa.eu/r5r/hvdCategory",
  "schema:offers",
  "prov:qualifiedAttribution",
  "dcterms:subject",
];
