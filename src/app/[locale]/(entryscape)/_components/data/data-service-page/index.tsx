"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { ContactPublisherBlock } from "@/app/[locale]/(entryscape)/_components/contact-publisher-block";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { Box } from "@/components/box";
import { LabelLink } from "@/components/label-link";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
import { Indicators } from "../../indicators";

const ABOUT_FIELDS = [
  "dcat:contactPoint_ds",
  "dcat:keyword_ds",
  "dcat:theme-ds",
  "dcatap:applicableLegislation_ds",
  "dcatap:hvdCategory",
  "dcat:dcterms:license_ds",
  "dcat:dcterms:accessRights",
  "dcat:landingPage_ds",
  "dcat:foaf:page_ds",
];

const DETAILS_EXCLUDED = [
  "dcterms:title",
  "dcterms:description",
  ...ABOUT_FIELDS,
];

export function DataServicePage() {
  const t = useTranslations();
  const entry = useContext(EntrystoreContext);

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(entry.title || "", [
        {
          name: t("routes.datasets.title"),
          link: `/${t("routes.datasets.path")}?q=&f=`,
        },
      ])}
      title={entry.title}
      columnsLayout="compact"
      mainLayout="compact"
      sidebarLayout="panel"
      main={
        <>
          <LabelLink value={entry.relatedResource} />

          <Indicators />

          <p
            className="mb-lg text-textSecondary whitespace-pre-line"
            data-test-id="description"
            data-entryscape="text"
            data-entryscape-property="dcterms:description"
          />

          <Box color="white" padding="lg">
            <div
              data-entryscape="view"
              data-entryscape-onecol="true"
              data-entryscape-filterpredicates={DETAILS_EXCLUDED.join(",")}
            />
            {/* "Explore API" link — renders only when this service has a detected API */}
            <div data-entryscape="exploreApiLink" />
          </Box>
          <ContactPublisherBlock />
        </>
      }
      sidebar={
        <>
          <Heading
            level={2}
            size="sm"
            className="mb-md font-strong text-textSecondary md:mb-lg"
          >
            {t("pages.dataservicepage.api")}
          </Heading>
          <div
            data-entryscape="view"
            data-entryscape-onecol="true"
            data-entryscape-rdformsid={ABOUT_FIELDS.join(",")}
            className="lg:w-full space-y-lg"
          />
        </>
      }
    />
  );
}
