"use client";

import { useLocale, useTranslations } from "next-intl";
import { useContext } from "react";
import { ContactPublisherBlock } from "@/app/[locale]/(entryscape)/_components/contact-publisher-block";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { AppLink } from "@/components/link";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { useEntryScapeBlocks } from "@/lib/entryscape-blocks/use-blocks";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { ApiIndexContext } from "@/providers/api-index-context";
import { SettingsContext } from "@/providers/settings-provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

interface DataServicePageProps {
  dataSet: string | string[] | undefined;
  name: string | string[] | undefined;
}

export function DataServicePage({ dataSet, name }: DataServicePageProps) {
  const t = useTranslations();
  const lang = useLocale();
  const { findDetection } = useContext(ApiIndexContext);
  const { iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];

  useEntryScapeBlocks({
    entrystoreBase: entry.entrystore.getBaseURI(),
    env: entry.env,
    lang,
    iconSize,
    pageType: "dataservice",
    context: entry.context,
    esId: entry.esId,
  });

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(entry.title || "", [
        {
          name: t("routes.datasets.title"),
          link: `/${t("routes.datasets.path")}?q=&f=`,
        },
      ])}
      title={entry.title}
      head={
        <>
          <title>{`${entry.title} - Sveriges dataportal`}</title>
          <meta
            property="og:title"
            content={`${entry.title} - Sveriges dataportal`}
          />
          <meta
            name="twitter:title"
            content={`${entry.title} - Sveriges dataportal`}
          />
        </>
      }
      columnsLayout="compact"
      mainLayout="compact"
      sidebarLayout="panel"
      main={
        <>
          {entry.publisher && <Preamble>{entry.publisher}</Preamble>}
          <div
            data-test-id="indicators"
            data-entryscape="customIndicators"
            className="indicators flex flex-col flex-wrap gap-x-lg gap-y-sm text-textSecondary md:flex-row"
          />
          <span className="!font-ubuntu text-lg text-textSecondary">
            {entry.description}
          </span>
          <div className="bg-white p-lg">
            <div
              data-entryscape="view"
              data-entryscape-rdformsid="dcat:DataService"
              data-entryscape-filterpredicates="dcterms:title,dcterms:publisher,dcterms:type,dcterms:license,dcterms:accessRights,dcat:landingPage,foaf:page"
              className="dataservice__access"
            />
            {findDetection(cid, eid) && (
              <span className="esbRowAlignSecondary">
                <AppLink
                  href={`/${t(
                    "routes.dataservices.path",
                  )}/${cid}_${eid}/${name}/apiexplore/${eid}`}
                  className="dataservice-explore-api-link entryscape link text-md"
                >
                  Utforska API
                </AppLink>
                <br />
              </span>
            )}
          </div>
          <ContactPublisherBlock variant="highlighted" />
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
          <div data-entryscape="aboutDaservice" className="mb-lg" />
          <div
            data-entryscape="view"
            data-entryscape-rdformsid="dcat:DataService"
            data-entryscape-filterpredicates="dcterms:title,dcterms:publisher,dcat:endpointURL"
            className="lg:w-full"
          />
        </>
      }
    />
  );
}
