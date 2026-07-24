"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import {
  InteroperableSpecificationsAccordion,
  InteroperableSpecificationsCard,
} from "@/app/[locale]/(entryscape)/_components/data-structures/interoperable-specifications";
import { MembersAccordion } from "@/app/[locale]/(entryscape)/_components/data-structures/members-accordion";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { Badge } from "@/components/badge";
import { Box } from "@/components/box";
import { LabelLink } from "@/components/label-link";
import { SidebarSection } from "@/components/sidebar-section";
import { Heading } from "@/components/typography/heading";
import { buildFacetSearchLink } from "@/lib/entrystore/entrystore-helpers";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function DataVocabularyPage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();

  // Classes/properties reference their data vocabulary via rdfs:isDefinedBy.
  // The "view all" link filters the data-structures search to this vocabulary
  // and, per list, to only classes / only properties.
  const buildViewAllHref = (rdfType: "term_class" | "term_property") =>
    buildFacetSearchLink(
      t("routes.data-structures.path"),
      "http://www.w3.org/2000/01/rdf-schema#isDefinedBy",
      entry.address,
      t("pages.data-vocabulary.data-vocabulary"),
      entry.title,
      rdfType,
    );

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
      sidebarLayout="panels"
      sidebarTestId="about-section"
      intro={
        <>
          <LabelLink
            value={entry.relatedResource}
            testId="publisher"
            className="mb-xl"
          />
          <Badge
            text={t("pages.data-vocabulary.data-vocabulary")}
            color="dark-green"
            className="flex w-fit"
          />
        </>
      }
      main={
        <>
          <p
            data-entryscape="text"
            data-entryscape-property="rdfs:comment"
            className="mb-lg empty:mb-none text-textSecondary whitespace-pre-line"
          />

          <MembersAccordion
            relationinverse="rdfs:isDefinedBy"
            rdftype="rdfs:Class"
            rowLink={'{{link namedclick="class"}}'}
            countPrefixKey="pages.data-vocabulary.includes"
            unitKey="classes"
            viewAllKey="pages.data-vocabulary.view_all_classes"
            viewAllHref={buildViewAllHref("term_class")}
          />
          <MembersAccordion
            relationinverse="rdfs:isDefinedBy"
            rdftype="rdf:Property"
            rowLink={'{{link namedclick="property"}}'}
            countPrefixKey="pages.data-vocabulary.includes"
            unitKey="properties"
            viewAllKey="pages.data-vocabulary.view_all_properties"
            viewAllHref={buildViewAllHref("term_property")}
            className="mt-lg"
          />

          <InteroperableSpecificationsAccordion />
        </>
      }
      sidebar={
        <>
          <Box color="white" className="mb-lg md:mb-xl">
            <Heading
              level={2}
              size="sm"
              className="mb-sm text-textSecondary md:mb-md"
            >
              {t("common.details")}
            </Heading>
            <div className="space-y-lg">
              <SidebarSection
                testId="address"
                heading={t("pages.data-vocabulary.address")}
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
          </Box>
          <InteroperableSpecificationsCard labelKey="pages.data-vocabulary.specifications_use" />
        </>
      }
    />
  );
}
