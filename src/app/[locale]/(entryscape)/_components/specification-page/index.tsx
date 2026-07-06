"use client";

import { useLocale, useTranslations } from "next-intl";
import { useContext, useState } from "react";
import { ContactPublisherBlock } from "@/app/[locale]/(entryscape)/_components/contact-publisher-block";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { Button } from "@/components/button";
import { AppLink } from "@/components/link";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { useEntryScapeBlocks } from "@/lib/entryscape-blocks/use-blocks";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { SettingsContext } from "@/providers/settings-provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function SpecificationPage() {
  const { iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const lang = useLocale();
  const [showAllDatasets, setShowAllDatasets] = useState(false);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const relatedDatasets = showAllDatasets
    ? entry.relatedDatasets
    : entry.relatedDatasets?.slice(0, 4);
  const keywords = showAllKeywords
    ? entry.keywords
    : entry.keywords?.slice(0, 4);

  useEntryScapeBlocks({
    entrystoreBase: entry.entrystore.getBaseURI(),
    env: entry.env,
    lang,
    iconSize,
    pageType: "specification",
    context: entry.context,
    esId: entry.esId,
  });

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
          {entry.organisationLink ? (
            <AppLink
              data-test-id="publisher"
              className="mb-lg text-lg font-normal text-green-600 hover:!no-underline"
              href={entry.organisationLink}
            >
              {entry.publisher}
            </AppLink>
          ) : (
            entry.publisher && (
              <Preamble data-test-id="publisher" className="mb-lg">
                {entry.publisher}
              </Preamble>
            )
          )}
          <Preamble
            data-test-id="description"
            className="mb-lg mt-md md:mb-xl md:mt-lg"
          >
            {entry.description}
          </Preamble>
          <Heading level={2} size="md" className="mb-md md:mb-lg">
            {t("pages.specification_page.resource_specification")}
          </Heading>
          <div
            data-test-id="resource-descriptors"
            data-entryscape="resourceDescriptors2"
            data-entryscape-rdftype="prof:ResourceDescriptor"
          />
          <ContactPublisherBlock variant="specification" />
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
            <div data-test-id="address">
              <Heading
                className="font-strong text-textSecondary"
                level={3}
                size="xxs"
              >
                {t("pages.specification_page.address")}
              </Heading>
              <AppLink
                className="break-words text-sm text-green-600 hover:no-underline"
                href={entry.address}
              >
                {entry.address}
              </AppLink>
            </div>
            {entry.keywords && entry.keywords?.length > 0 && (
              <div data-test-id="keywords">
                <Heading
                  className="font-strong text-textSecondary"
                  level={3}
                  size="xxs"
                >
                  {t("pages.datasetpage.keyword")}
                </Heading>
                <div className="flex flex-col">
                  {keywords?.map((k) => (
                    <span
                      className="mb-sm w-fit bg-pink-200 px-sm py-xs text-sm font-strong"
                      key={k}
                    >
                      {k}
                    </span>
                  ))}
                </div>
                <Button
                  size="xs"
                  className="mt-xs px-sm py-xs !font-strong text-brown-600"
                  variant="plain"
                  label={
                    showAllKeywords
                      ? t("pages.datasetpage.view_less")
                      : t("pages.datasetpage.view_more")
                  }
                  onClick={() => setShowAllKeywords(!showAllKeywords)}
                />
              </div>
            )}
            <div
              data-entryscape-dialog
              data-entryscape-rdformsid="dcat:contactPoint"
            />
            <div
              data-entryscape="view"
              data-entryscape-rdformsid="prof:Profile"
              data-entryscape-filterpredicates="dcterms:title,dcterms:description,dcat:distribution,dcterms:publisher,prof:hasResource,adms:prev,dcat:keyword"
            />
            {entry.relatedDatasets && entry.relatedDatasets.length > 0 && (
              <div data-test-id="related-datasets">
                <Heading
                  className="font-strong text-textSecondary"
                  level={3}
                  size="xxs"
                >
                  {t("pages.specification_page.related_datasets")}
                </Heading>
                {relatedDatasets?.map((ds) => (
                  <AppLink
                    className="fit mb-sm block text-sm text-green-600 hover:no-underline"
                    key={ds.url}
                    href={ds.url}
                  >
                    {ds.title}
                  </AppLink>
                ))}
                {entry.relatedDatasets?.length > 4 && (
                  <Button
                    size="xs"
                    className="mt-xs px-sm py-xs !font-strong text-brown-600"
                    variant="plain"
                    label={
                      showAllDatasets
                        ? t("pages.datasetpage.view_less")
                        : t("pages.datasetpage.view_more")
                    }
                    onClick={() => setShowAllDatasets(!showAllDatasets)}
                  />
                )}
              </div>
            )}
            {entry.downloadFormats && entry.downloadFormats?.length > 0 && (
              <div data-test-id="download-formats">
                <Heading
                  className="font-strong text-textSecondary"
                  level={3}
                  size="xxs"
                >
                  {t("pages.datasetpage.download_link")}
                </Heading>
                <div className="flex flex-col gap-xs">
                  {entry.downloadFormats.map(({ title, url }) => (
                    <a
                      key={url}
                      href={url}
                      className="text-sm text-green-600 hover:no-underline"
                    >
                      {title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
