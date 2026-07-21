"use client";

import { useTranslations } from "next-intl";
import { Fragment, useContext } from "react";
import { ContactPublisherBlock } from "@/app/[locale]/(entryscape)/_components/contact-publisher-block";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { SpecIndicators } from "@/app/[locale]/(entryscape)/_components/indicators";
import ListBlockIcon from "@/assets/icons/list-block.svg";
import { Box } from "@/components/box";
import { LabelLink } from "@/components/label-link";
import { SidebarSection } from "@/components/sidebar-section";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { SettingsContext } from "@/providers/settings-provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
import { SpecificationClasses } from "./classes-properties";
import { SpecificationImage } from "./image";
import { SpecificationResources } from "./resources";

export function SpecificationPage() {
  const entry = useContext(EntrystoreContext);
  const { iconSize } = useContext(SettingsContext);
  const t = useTranslations();

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(entry.title, [
        {
          name: t("routes.specifications.title"),
          link: `/${t("routes.specifications.path")}?q=&f=`,
        },
      ])}
      title={entry.title}
      intro={
        <>
          <LabelLink
            testId="publisher"
            value={entry.relatedResource}
            className="mb-lg"
          />
          <SpecIndicators />
        </>
      }
      main={
        <>
          <SpecificationImage />
          {entry.description && (
            <>
              <Heading level={2} size="md" className="mb-md md:mb-lg">
                {t("common.description")}
              </Heading>
              <p className="text-textSecondary whitespace-pre-line mb-lg">
                {entry.description}
              </p>
            </>
          )}

          <SpecificationClasses />

          <Heading level={2} size="md" className="mb-md md:mb-lg">
            {t("pages.specification_page.resource_specification")}
          </Heading>

          <SpecificationResources />

          <ContactPublisherBlock />
        </>
      }
      sidebar={
        <>
          <Box
            testId="related-datasets"
            color="white"
            padding="xl"
            rounded={true}
            className="mb-lg md:mb-xl"
          >
            <div className="flex items-center gap-sm">
              <ListBlockIcon
                className="flex-shrink-0 text-primary"
                height={iconSize * 3}
                width={iconSize * 3}
                viewBox={`0 0 ${iconSize * 1.5} ${iconSize * 1.5}`}
              />

              <span className="text-xl md:text-2xl text-primary">
                {entry.relatedDatasets?.length}
              </span>
              <span className="text-sm leading-4">
                {t("pages.specification_page.datasets-follows-specification")}
              </span>
            </div>

            {!!entry.relatedDatasetsGrunddata?.length && (
              <p className="mt-lg text-sm">
                {t("pages.specification_page.national_grunddata_count", {
                  count: entry.relatedDatasetsGrunddata.length,
                })}{" "}
                {entry.relatedDatasetsGrunddata.map((dataset, index) => (
                  <Fragment key={`${dataset.url ?? ""}|${dataset.title}`}>
                    {index > 0 && ", "}
                    <LabelLink value={dataset} size="small" />
                  </Fragment>
                ))}
              </p>
            )}
          </Box>

          <Box testId="about-section" color="white" padding="xl" rounded={true}>
            <Heading
              level={2}
              size="md"
              className="mb-md text-textSecondary md:mb-lg"
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
                heading={t("pages.datasetpage.download_link")}
                items={entry.downloadFormats ?? []}
                testId="download-formats"
              />
            </div>
          </Box>
        </>
      }
    />
  );
}
