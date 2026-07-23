"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { LabelLink } from "@/components/label-link";
import { SidebarSection } from "@/components/sidebar-section";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function TerminologyPage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(entry.title, [
        {
          name: t("routes.data-structures.title"),
          link: `/${t("routes.data-structures.path")}?q=&f=`,
        },
      ])}
      title={entry.title}
      columnsLayout="rowSpaced"
      mainLayout="content"
      sidebarLayout="panelRaised"
      sidebarTestId="about-section"
      main={
        <>
          <LabelLink
            value={entry.relatedResource}
            testId="publisher"
            className="mb-lg"
          />

          <p
            data-entryscape="text"
            data-entryscape-property="dcterms:description"
            className="text-textSecondary whitespace-pre-line mb-lg"
          />

          <div data-test-id="terminology-block" className="totTerminology">
            <Heading level={2} size="md" className="mb-sm">
              {t("pages.concept_page.first_level_concepts")}
            </Heading>
            <div
              data-entryscape="listStandard"
              data-entryscape-relation="skos:hasTopConcept"
              data-entryscape-limit="20"
              data-entryscape-rowhead="{{conceptLink}}"
            />
          </div>
        </>
      }
      sidebar={
        <>
          <Heading
            level={2}
            size="sm"
            className="mb-sm font-strong text-textSecondary md:mb-md"
          >
            {t("pages.concept_page.about_terminology")}
          </Heading>
          <div className="space-y-lg">
            <SidebarSection
              testId="address"
              heading={t("pages.concept_page.term_adress")}
              items={[{ title: entry.address, url: entry.address }]}
            />

            <SidebarSection
              testId="related-specifications"
              heading={t("pages.datasetpage.related_specifications")}
              items={entry.relatedSpecifications ?? []}
            />

            <SidebarSection
              testId="download-formats"
              heading={t("pages.datasetpage.download_link")}
              items={entry.downloadFormats ?? []}
            />
          </div>
        </>
      }
    />
  );
}
