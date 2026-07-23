"use client";

import { useTranslations } from "next-intl";
import { Accordion } from "@/components/accordion";
import { esbIcon } from "@/lib/entryscape-blocks/icons";

/**
 * A spec's `prof:hasResource` descriptors split into introduced (no
 * `prof:isInheritedFrom`) vs reused (with it). Filtered per row with `{{#ifprop}}`
 * rather than `constraints` — the latter silently stops filtering past ~10
 * related entries. Non-matching rows render empty `<li>`s hidden via CSS.
 */
export function SpecificationResources() {
  const t = useTranslations();

  const downloadButton =
    '<a class="resource-download" href="{{#ifprop "prof:hasArtifact"}}{{prop "prof:hasArtifact"}}{{/ifprop}}{{#ifprop "prof:hasArtifact" invert=true}}{{resourceURI}}{{/ifprop}}">' +
    '<span class="button button--primary button--large text-white">' +
    `<span class="resource-download__label--download">${t("pages.specification_page.scheme_download")}</span>` +
    `<span class="resource-download__label--goto">${t("pages.specification_page.go_to_resource")}</span>` +
    esbIcon("download", "resource-download__icon--download") +
    esbIcon("arrow", "resource-download__icon--link") +
    esbIcon("external", "resource-download__icon--external") +
    "</span></a>";

  const expandButton =
    '<button class="esbExpandButton group button button--secondary button--large h-fit text-nowrap">' +
    `<span class="flex items-center gap-xs group-aria-expanded:hidden">${t("pages.datasetpage.view_more")}` +
    esbIcon("chevronDown") +
    "</span>" +
    `<span class="hidden items-center gap-xs group-aria-expanded:flex">${t("pages.datasetpage.view_less")}` +
    esbIcon("chevronUp") +
    "</span>" +
    "</button>";

  const ifExtras = (markup: string) =>
    `{{#ifprop "dcterms:description"}}${markup}{{/ifprop}}`;

  const rowContent =
    '<div class="resource-row">' +
    '<div class="flex justify-between items-start gap-md">' +
    '<span class="text-lg">{{text}}</span>' +
    '<span class="flex-shrink-0 bg-green-200 px-sm py-xs text-sm uppercase">{{prop "prof:hasRole" render="label"}}</span>' +
    "</div>" +
    '<span class="block mt-sm mb-lg">{{prop "dcterms:format"}}</span>' +
    '<div class="flex flex-wrap justify-between items-end md:items-center mt-md md:mt-lg gap-md">' +
    downloadButton +
    ifExtras(expandButton) +
    "</div>" +
    "</div>";

  const rowExpandContent = ifExtras(
    '{{view rdformsid="editera:prof:ResourceDescriptor" filterpredicates="dcterms:title,prof:hasRole" onecol="true" class="bg-white"}}',
  );

  const listbody =
    '<div class="[&_li]:bg-white [&_li]:mb-lg [&_li]:shadow-sm [&_li:not(:has(.resource-row))]:hidden">{{body}}</div>';

  const placeholder =
    '<div class="alert alert-info" role="alert">' +
    t("pages.specification_page.no_resources") +
    "</div>";

  const wrap = (invert: boolean, markup: string) =>
    invert
      ? `{{#ifprop "prof:isInheritedFrom" invert=true}}${markup}{{/ifprop}}`
      : `{{#ifprop "prof:isInheritedFrom"}}${markup}{{/ifprop}}`;

  const block = (introduced: boolean, testId: string) => (
    <div
      data-test-id={testId}
      data-entryscape="listStandard"
      data-entryscape-relation="prof:hasResource"
      data-entryscape-template="prof:ResourceDescriptor"
      data-entryscape-rdftype="prof:ResourceDescriptor"
      data-entryscape-expand-button="false"
      data-entryscape-limit="100"
      data-entryscape-listbody={listbody}
      data-entryscape-listplaceholder={placeholder}
      data-entryscape-rowhead={wrap(introduced, rowContent)}
      data-entryscape-rowexpand={wrap(introduced, rowExpandContent)}
    />
  );

  return (
    <>
      <Accordion
        title={t("pages.specification_page.introduced_resources")}
        className="[&:not(:has(.resource-row))]:hidden"
      >
        {block(true, "introduced-resources")}
      </Accordion>

      <Accordion
        title={t("pages.specification_page.reused_resources")}
        className="[&:not(:has(.resource-row))]:hidden"
      >
        {block(false, "reused-resources")}
      </Accordion>
    </>
  );
}
