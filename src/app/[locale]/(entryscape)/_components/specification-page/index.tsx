"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { ContactPublisherBlock } from "@/app/[locale]/(entryscape)/_components/contact-publisher-block";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";

import { LabelLink } from "@/components/label-link";
import { SidebarSection } from "@/components/sidebar-section";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { SettingsContext } from "@/providers/settings-provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function SpecificationPage() {
  const entry = useContext(EntrystoreContext);
  const { iconSize } = useContext(SettingsContext);
  const t = useTranslations();
  const s = 1.5 * iconSize;

  const resourceRowhead =
    "<span>{{text}}</span>" +
    '<span class="block mb-md">{{prop "prof:hasRole" class="type" render="label"}}</span>' +
    // biome-ignore lint/suspicious/noTemplateCurlyInString: Entryscape template-content syntax, not a JS placeholder
    '<div>{{ text content="${skos:definition}" }}</div>' +
    '<div class="flex justify-between items-end md:items-center mt-md md:mt-lg gap-lg">' +
    '<a class="resource-download" href="{{#ifprop "prof:hasArtifact"}}{{prop "prof:hasArtifact"}}{{/ifprop}}{{#ifprop "prof:hasArtifact" invert=true}}{{resourceURI}}{{/ifprop}}">' +
    '<span class="button button--primary button--large text-white">' +
    t("pages.specification_page.specification_download") +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" class="resource-download__icon--internal flex-shrink-0"><path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="#6E615A"/></svg>` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" class="resource-download__icon--external flex-shrink-0"><path d="M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3M19 19H5V5H12V3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12H19V19Z" fill="#6E615A"/></svg>` +
    "</span></a></div>";

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(entry.title, [
        {
          name: t("routes.specifications.title"),
          link: `/${t("routes.specifications.path")}?q=&f=`,
        },
      ])}
      title={entry.title}
      columnsLayout="row"
      mainLayout="content"
      sidebarLayout="panelFlush"
      main={
        <>
          <LabelLink
            testId="publisher"
            value={entry.relatedResource}
            className="mb-lg"
          />

          <p
            data-test-id="description"
            data-entryscape="text"
            data-entryscape-property="dcterms:description"
            className="text-textSecondary whitespace-pre-line mb-lg"
          />

          <Heading level={2} size="md" className="mb-md md:mb-lg">
            {t("pages.specification_page.resource_specification")}
          </Heading>

          {/* Resource-descriptor list (was the resourceDescriptors2 block) */}
          <div
            data-test-id="resource-descriptors"
            data-entryscape="listStandard"
            data-entryscape-relation="prof:hasResource"
            data-entryscape-template="prof:ResourceDescriptor"
            data-entryscape-rdftype="prof:ResourceDescriptor"
            data-entryscape-expand-button="false"
            data-entryscape-listbody='<div class="[&_li]:bg-white [&_li]:mb-lg [&_li]:shadow-sm">{{body}}</div>'
            data-entryscape-listplaceholder='<div class="alert alert-info" role="alert">Denna specifikation har inga resurser.</div>'
            data-entryscape-rowhead={resourceRowhead}
          />

          <ContactPublisherBlock />
        </>
      }
      sidebar={
        <div data-test-id="about-section">
          <Heading
            level={2}
            size="sm"
            className="mb-sm font-strong text-textSecondary md:mb-md"
          >
            {t("pages.specification_page.about_specification")}
          </Heading>
          <div className="space-y-lg">
            <SidebarSection
              testId="address"
              heading={t("pages.specification_page.address")}
              items={[{ title: entry.address, url: entry.address }]}
            />
            <SidebarSection
              heading={t("pages.datasetpage.keyword")}
              items={entry.keywords ?? []}
              variant="pill"
              collapseAt={4}
            />

            <div
              data-entryscape="view"
              data-entryscape-onecol="true"
              data-entryscape-rdformsid="prof:Profile"
              data-entryscape-filterpredicates="dcterms:title,dcterms:description,dcat:distribution,dcterms:publisher,prof:hasResource,adms:prev,dcat:keyword"
            />
            <SidebarSection
              testId="related-datasets"
              heading={t("pages.specification_page.related_datasets")}
              items={entry.relatedDatasets ?? []}
              collapseAt={4}
            />

            <SidebarSection
              heading={t("pages.datasetpage.download_link")}
              items={entry.downloadFormats ?? []}
              testId="download-formats"
            />
          </div>
        </div>
      }
    />
  );
}
