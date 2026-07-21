"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { ContactPublisherBlock } from "@/app/[locale]/(entryscape)/_components/contact-publisher-block";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { Indicators } from "@/app/[locale]/(entryscape)/_components/indicators";
import { Box } from "@/components/box";
import { LabelLink } from "@/components/label-link";
import { SidebarSection } from "@/components/sidebar-section";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
import { DistributionList } from "./distribution-list";

/** RDForms item IDs shown, in order, in the top "About dataset" block. */
const ABOUT_FIELDS = [
  "dcat:dcterms:creator_da",
  "dcat:prov:qualifiedAttribution",
  "dcat:contactPoint_da",
  "dcatap:applicableLegislation_da",
  "dcatap:hvdCategory",
  "dcat:landingPage_da",
  "dcat:foaf:page_da",
];

/**
 * Fields already rendered elsewhere — the About block above (ABOUT_FIELDS) plus
 * the ones handled in React/other blocks — so they are filtered out of the
 * catch-all "details" view below.
 */
const DETAILS_EXCLUDED = [
  "dcterms:title",
  "dcterms:description",
  "dcat:theme",
  "dcat:dcterms:spatial_bb_da",
  "dcat:keyword",
  ...ABOUT_FIELDS,
];

/** Catalog predicates already shown at dataset level, hidden from the catalog view. */
const CATALOG_EXCLUDED = [
  "dcterms:issued",
  "dcterms:language",
  "dcterms:modified",
  "dcterms:spatial",
  "dcterms:license",
  "dcat:themeTaxonomi",
  "dcat:service",
];

export function DatasetPage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(entry.title, [
        {
          name: t("routes.datasets.title"),
          link: `/${t("routes.datasets.path")}?q=&f=`,
        },
      ])}
      title={entry.title}
      main={
        <>
          {/* Publisher */}
          <div className="mb-md flex flex-col gap-md">
            <LabelLink value={entry.relatedResource} />

            {/* Related dataset series */}
            {entry.relatedDatasetSeries &&
              entry.relatedDatasetSeries.length > 0 && (
                <div className="inline-flex flex-wrap items-center gap-sm text-sm">
                  <span className="text-textSecondary">
                    {t("pages.datasetpage.related_dataset_series")}
                  </span>
                  {entry.relatedDatasetSeries.map((ds, idx) => (
                    <span
                      key={`${ds.url ?? ""}|${ds.title}`}
                      className="inline-flex items-center"
                    >
                      <LabelLink value={ds} size="small" />
                      {idx < (entry.relatedDatasetSeries?.length ?? 0) - 1 &&
                        ", "}
                    </span>
                  ))}
                </div>
              )}
          </div>

          {/* Indicators */}
          <Indicators />
          {/* Description */}
          <p
            className="mb-lg whitespace-pre-line text-textSecondary"
            data-test-id="description"
            data-entryscape="text"
            data-entryscape-property="dcterms:description"
          />

          <div>
            {/* Distribution list */}
            <DistributionList />

            {/* Dataset maps */}
            <div
              className="mb-lg"
              data-entryscape="view"
              data-entryscape-rdformsid="dcat:dcterms:spatial_bb_da"
              data-entryscape-onecol="true"
            />

            {/* TODO: Readd this when autoVisualizations fetches data that works map 
            kartor.stockholm.se or karta.skovde.se gives first CSP rules errors but 
            after they are fixed they give connection timeout or 404 errors. The map 
            opengeodata.goteborg.se works fine but feels too narrow to use this block. */}
            {/* <div
              className="mb-lg"
              data-entryscape="autoVisualizations"
              data-entryscape-include-auto-visualizations="true"
              data-entryscape-onecol="true"
            /> */}

            <ContactPublisherBlock />
          </div>
        </>
      }
      sidebar={
        <>
          {/* About dataset - wrapper  */}
          <Box testId="about-section" color="white" padding="xl" rounded={true}>
            <Heading
              level={2}
              size={"md"}
              className="mb-md text-textSecondary md:mb-lg"
            >
              {t("pages.datasetpage.about-dataset")}
            </Heading>

            <div className="space-y-lg">
              {/* About dataset */}
              <div
                data-entryscape="view"
                data-entryscape-onecol="true"
                data-entryscape-rdformsid={ABOUT_FIELDS.join(",")}
              />
              <SidebarSection
                heading={t("pages.datasetpage.keyword")}
                items={entry.keywords ?? []}
                variant="pill"
                collapseAt={4}
              />

              <div
                data-entryscape="view"
                className="pill-list"
                data-entryscape-onecol="true"
                data-entryscape-rdformsid="dcat:theme-da"
              />
              <div
                data-entryscape="view"
                data-entryscape-onecol="true"
                data-entryscape-filterpredicates={DETAILS_EXCLUDED.join(",")}
              />

              {/* Related specifications */}
              <SidebarSection
                heading={t("pages.datasetpage.related_specifications")}
                items={entry.relatedSpecifications ?? []}
                collapseAt={4}
              />

              {/* Download formats */}
              <SidebarSection
                heading={t("pages.datasetpage.download_link")}
                items={entry.downloadFormats ?? []}
                testId="download-formats"
              />
            </div>
          </Box>

          {/* Catalog information wrapper */}
          <Box
            testId="catalog-information"
            color="white"
            padding="xl"
            rounded={true}
          >
            <Heading
              level={2}
              size={"md"}
              className="mb-md text-textSecondary md:mb-lg"
            >
              {t("pages.datasetpage.catalog")}
            </Heading>
            <div className="space-y-lg">
              <SidebarSection
                heading={t("pages.datasetpage.mqa-catalog")}
                items={[entry.mqaCatalog]}
              />

              {/* Catalog */}
              <div
                data-entryscape="view"
                data-entryscape-rdformsid="dcat:Catalog"
                data-entryscape-relationinverse="dcat:dataset"
                data-entryscape-onecol="true"
                data-entryscape-filterpredicates={CATALOG_EXCLUDED.join(",")}
              />
            </div>
          </Box>
        </>
      }
    />
  );
}
