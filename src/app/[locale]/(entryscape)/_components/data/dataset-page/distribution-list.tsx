"use client";

import { useTranslations } from "next-intl";
import { esbIcon } from "@/lib/entryscape-blocks/icons";

/**
 * The dataset's distribution list as an inline `data-entryscape="list"` div.
 * `exploreApiLink` and `accessServiceCustom` remain registered blocks (referenced
 * by name) since they can't be expressed as plain templates.
 */
export function DistributionList() {
  const t = useTranslations();

  const formatBadges =
    '{{#eachprop "dcterms:format"}}' +
    '<span title="{{value}}" class="uppercase" data-esb-collection-format="{{optionvalue}}">{{label}}</span>' +
    "{{/eachprop}}";

  const accessButtons =
    '{{#ifprop "dcat:downloadURL"}}' +
    '{{#ifprop "dcat:downloadURL" min="2"}}' +
    t("pages.datasetpage.several_links") +
    "{{/ifprop}}" +
    '{{#ifprop "dcat:downloadURL" min="2" invert="true"}}' +
    '<a href="{{prop "dcat:downloadURL"}}" target="_blank" rel="noopener noreferrer" class="text-white no-underline">' +
    '<span class="button--primary button--large text-white flex items-center no-underline">' +
    t("pages.datasetpage.download_link") +
    esbIcon("download") +
    "</span></a>" +
    "{{/ifprop}}{{/ifprop}}" +
    '{{#ifprop "dcat:downloadURL" invert="true"}}' +
    '<a href="{{prop "dcat:accessURL"}}" target="_blank" rel="noopener noreferrer" class="text-white no-underline">' +
    '<span class="button--primary button--large text-white flex items-center !no-underline">' +
    t("pages.datasetpage.download_link_adress") +
    esbIcon("external") +
    "</span></a>" +
    "{{/ifprop}}";

  const fileList =
    '<div class="escoList"><div class="space-y-lg" aria-live="polite">' +
    '{{#eachprop "dcat:downloadURL"}}' +
    '<div class="flex flex-col md:flex-row gap-md md:gap-lg md:justify-between md:items-center">' +
    '<span class="text-md">{{labelish}}</span>' +
    '<a class="text-white no-underline mr-xs" href="{{value}}" target="_blank" rel="noopener noreferrer">' +
    '<span class="button--primary button--small md:button--large text-white flex items-center !no-underline whitespace-nowrap">' +
    t("pages.datasetpage.download_link") +
    esbIcon("download") +
    "</span></a></div>" +
    "{{/eachprop}}" +
    "</div></div>";

  const rowhead =
    '<span class="flex flex-col">' +
    '<div class="flex justify-between gap-lg mb-sm">' +
    `<span class="text-textPrimary text-lg">${formatBadges}</span>` +
    '{{#ifprop "rdf:type" uri="esterms:ServiceDistribution"}}' +
    '<span class="text-textSecondary text-md"></i>API</span>' +
    "{{/ifprop}}" +
    "</div>" +
    "<span>{{text fallback='<span class=\\'distributionNoName\\'>" +
    t("pages.datasetpage.no_title") +
    "</span>'}}</span>" +
    "</span>" +
    "<div class='flex flex-wrap justify-between items-end md:items-center mt-md md:mt-lg gap-md'>" +
    "<div class='flex flex-col md:flex-row'>" +
    accessButtons +
    "{{exploreApiLink}}" +
    "</div>" +
    '<button class="esbExpandButton group button button--secondary button--large h-fit text-nowrap">' +
    `<span class="flex items-center gap-xs group-aria-expanded:hidden">${t("pages.datasetpage.view_more")}` +
    esbIcon("chevronDown") +
    "</span>" +
    `<span class="hidden items-center gap-xs group-aria-expanded:flex">${t("pages.datasetpage.view_less")}` +
    esbIcon("chevronUp") +
    "</span>" +
    "</button>" +
    "</div>";

  const rowexpand =
    '{{#ifprop "dcat:downloadURL"}}{{#ifprop "dcat:downloadURL" min="2"}}' +
    '<h3 class="rdformsLabel !mt-none">' +
    t("pages.datasetpage.several_links_header") +
    "</h3>" +
    fileList +
    "{{/ifprop}}{{/ifprop}}" +
    '{{view rdformsid="dcat:Distribution" filterpredicates="dcat:downloadURL,dcterms:title,dcat:accessService" onecol="true" class="bg-white"}}' +
    '{{#ifprop "dcat:accessService"}}{{accessServiceCustom}}{{/ifprop}}';

  const listplaceholder =
    '<div class="alert alert-info" role="alert">' +
    t("pages.datasetpage.no_data") +
    "</div>";

  return (
    <div
      data-test-id="datasets-block"
      className="distribution__list [&_li]:shadow-sm [&_li]:mb-lg [&_li]:bg-white"
      data-entryscape="listStandard"
      data-entryscape-onecol="true"
      data-entryscape-relation="dcat:distribution"
      data-entryscape-registry="true"
      data-entryscape-expand-button="false"
      data-entryscape-listbody="{{body}}"
      data-entryscape-limit="100"
      data-entryscape-listplaceholder={listplaceholder}
      data-entryscape-rowhead={rowhead}
      data-entryscape-rowexpand={rowexpand}
    />
  );
}
