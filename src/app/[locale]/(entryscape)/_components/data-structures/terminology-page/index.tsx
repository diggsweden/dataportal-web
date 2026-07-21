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

export function TerminologyPage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();

  const viewAllHref = buildFacetSearchLink(
    t("routes.data-structures.path"),
    "http://www.w3.org/2004/02/skos/core#inScheme",
    entry.address,
    t("pages.terminology.terminology"),
    entry.title,
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
      intro={
        <>
          <LabelLink
            value={entry.relatedResource}
            testId="publisher"
            className="mb-xl"
          />
          <Badge
            text={t("pages.terminology.terminology")}
            color="dark-green"
            className="flex w-fit"
          />
        </>
      }
      main={
        <>
          <p
            data-entryscape="text"
            data-entryscape-property="dcterms:description"
            className="mb-lg empty:mb-none text-textSecondary whitespace-pre-line"
          />

          <MembersAccordion
            relationinverse="skos:inScheme"
            rdftype="skos:Concept"
            rowLink="{{conceptLink}}"
            countPrefixKey="pages.terminology.includes"
            unitKey="concepts"
            viewAllKey="pages.terminology.view_all"
            viewAllHref={viewAllHref}
          />

          <InteroperableSpecificationsAccordion />
        </>
      }
      sidebar={
        <>
          <InteroperableSpecificationsCard labelKey="pages.terminology.specifications_use" />
          <Box testId="about-section" color="white" padding="xl" rounded={true}>
            <Heading
              level={2}
              size="sm"
              className="mb-sm font-strong text-textSecondary md:mb-md"
            >
              {t("common.details")}
            </Heading>
            <div className="space-y-lg">
              <SidebarSection
                testId="address"
                heading={t("pages.terminology.address")}
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
        </>
      }
    />
  );
}
