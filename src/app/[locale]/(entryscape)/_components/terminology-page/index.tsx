"use client";

import { useLocale, useTranslations } from "next-intl";
import { useContext } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { AppLink } from "@/components/link";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { useEntryScapeBlocks } from "@/lib/entryscape-blocks/use-blocks";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { SettingsContext } from "@/providers/settings-provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function TerminologyPage() {
  const { iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const lang = useLocale();

  useEntryScapeBlocks({
    entrystoreBase: entry.entrystore.getBaseURI(),
    env: entry.env,
    lang,
    iconSize,
    pageType: "terminology",
    context: entry.context,
    esId: entry.esId,
  });

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(entry.title, [
        {
          name: t("routes.concepts.title"),
          link: `/${t("routes.concepts.path")}?q=&f=`,
        },
      ])}
      title={entry.title}
      columnsLayout="rowSpaced"
      mainLayout="content"
      sidebarLayout="panelRaised"
      sidebarTestId="about-section"
      main={
        <>
          {entry.organisationLink ? (
            <AppLink
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
          {entry.description !== "" && (
            <p data-test-id="description" className="mb-lg text-textSecondary">
              {entry.description}
            </p>
          )}
          <span
            data-test-id="terminology-block"
            data-entryscape="terminologyBlock"
            className="totTerminology conceptDetail"
          />
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
            <div data-test-id="address">
              <Heading
                className="font-strong text-textSecondary"
                level={3}
                size="xxs"
              >
                {t("pages.concept_page.term_adress")}
              </Heading>
              <AppLink
                className="break-words text-sm text-green-600 hover:no-underline"
                href={entry.address}
              >
                {entry.address}
              </AppLink>
            </div>
            {entry.relatedSpecifications &&
              entry.relatedSpecifications?.length > 0 && (
                <div>
                  <Heading
                    className="font-strong text-textSecondary"
                    level={3}
                    size="xxs"
                  >
                    {t("pages.datasetpage.related_specifications")}
                  </Heading>
                  {entry.relatedSpecifications.map(({ title, url }) => (
                    <AppLink
                      className="block text-sm text-green-600 hover:no-underline"
                      key={url}
                      href={url}
                    >
                      {title}
                    </AppLink>
                  ))}
                </div>
              )}
            {entry.relatedTerm && (
              <div data-test-id="related-terminology">
                <Heading
                  className="font-strong text-textSecondary"
                  level={3}
                  size="xxs"
                >
                  {t("pages.concept_page.terminology_concept")}
                </Heading>
                <AppLink
                  className="block text-sm text-green-600 hover:no-underline"
                  href={entry.relatedTerm.url}
                >
                  {entry.relatedTerm.title}
                </AppLink>
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
                  {entry.downloadFormats.map(({ title, url }, idx) => (
                    <a
                      key={url}
                      href={url + (idx === 0 ? "" : "&recursive=conceptscheme")}
                      className="text-sm text-green-600 hover:no-underline"
                    >
                      {title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      }
    />
  );
}
