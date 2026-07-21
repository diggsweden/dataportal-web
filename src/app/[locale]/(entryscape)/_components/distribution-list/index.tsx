"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { SettingsContext } from "@/providers/settings-provider";

/**
 * The dataset's distribution list as an inline `data-entryscape="list"` div.
 * `exploreApiLink` and `accessServiceCustom` remain registered blocks (referenced
 * by name) since they can't be expressed as plain templates.
 */
export function DistributionList() {
  const t = useTranslations();
  const { iconSize } = useContext(SettingsContext);
  const s = 1.5 * iconSize;

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
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">` +
    '<path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="#6E615A"/>' +
    "</svg></span></a>" +
    "{{/ifprop}}{{/ifprop}}" +
    '{{#ifprop "dcat:downloadURL" invert="true"}}' +
    '<a href="{{prop "dcat:accessURL"}}" target="_blank" rel="noopener noreferrer" class="text-white no-underline">' +
    '<span class="button--primary button--large text-white flex items-center !no-underline">' +
    t("pages.datasetpage.download_link_adress") +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">` +
    '<path d="M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3M19 19H5V5H12V3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12H19V19Z" fill="#6E615A"/>' +
    "</svg></span></a>" +
    "{{/ifprop}}";

  const fileList =
    '<div class="escoList"><div class="space-y-lg" aria-live="polite">' +
    '{{#eachprop "dcat:downloadURL"}}' +
    '<div class="flex flex-col md:flex-row gap-md md:gap-lg md:justify-between md:items-center">' +
    '<span class="text-md">{{labelish}}</span>' +
    '<a class="text-white no-underline mr-xs" href="{{value}}" target="_blank" rel="noopener noreferrer">' +
    '<span class="button--primary button--small md:button--large text-white flex items-center !no-underline whitespace-nowrap">' +
    t("pages.datasetpage.download_link") +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">` +
    '<path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="#F0EFEE"/>' +
    "</svg></span></a></div>" +
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
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" class="flex-shrink-0"><path d="M18 10L12 16L6 10L7.4 8.6L12 13.2L16.6 8.6L18 10Z" fill="currentColor"/></svg>` +
    "</span>" +
    `<span class="hidden items-center gap-xs group-aria-expanded:flex">${t("pages.datasetpage.view_less")}` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" class="flex-shrink-0"><path d="M6 14L12 8L18 14L16.6 15.4L12 10.8L7.4 15.4L6 14Z" fill="currentColor"/></svg>` +
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
      data-entryscape-listplaceholder={listplaceholder}
      data-entryscape-rowhead={rowhead}
      data-entryscape-rowexpand={rowexpand}
    />
  );
}
