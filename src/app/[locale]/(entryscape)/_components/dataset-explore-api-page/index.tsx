"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useContext, useState } from "react";
import { Indicators } from "@/app/[locale]/(entryscape)/_components/indicators";
import { CustomLink } from "@/components/custom-link";
import { LabelLink } from "@/components/label-link";
import { Container } from "@/components/layout/container";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { SettingsContext } from "@/providers/settings-provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

const ApiExplorer = dynamic(
  () =>
    import("@/app/[locale]/(entryscape)/_components/api-exploring").then(
      (c) => c.ApiExplorer,
    ),
  { ssr: false },
);

interface DataSetExploreApiPageProps {
  dataSet: string | string[] | undefined;
  apieid: string | string[] | undefined;
}

export function DataSetExploreApiPage({
  dataSet,
  apieid,
}: DataSetExploreApiPageProps) {
  const query = useParams();
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const t = useTranslations();
  const { env } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);

  const [toggleTabs, setToggleTabs] = useState(1);
  const tab = toggleTabs === 1;

  //Toggle between tabs
  const toggleTab = (index: number) => {
    setToggleTabs(index);
  };

  return (
    <Container>
      <BreadcrumbSetter
        {...buildBreadcrumb(t("routes.api_explore.title"), [
          {
            name: t("routes.datasets.title"),
            link: `/${t("routes.datasets.path")}?q=&f=`,
          },
          {
            name: (entry.title as string) || "",
            // `query.name` is absent on the no-name apiexplore route; only
            // append it when present to avoid a "/undefined" crumb link.
            link: `/${t("routes.datasets.path")}/${dataSet}${
              query?.name ? `/${query.name}` : ""
            }`,
          },
        ])}
      />
      <div>
        {/* Title */}
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {t("pages.explore-api-page.explore-api")}
        </Heading>

        <div className="mb-md flex w-full flex-col gap-lg lg:mb-lg">
          {/* Publisher */}
          <LabelLink value={entry.relatedResource} />

          {/* Indicators */}
          <Indicators />
        </div>
        <div className="flex flex-col">
          {/* Refers to dataset - heading*/}
          <Heading level={2} size={"sm"} className="mb-sm md:mb-md">
            {t("pages.explore-api-page.belongs-to-dataset")}
          </Heading>

          {/* Refers to dataset - datset */}
          <span className="text-sm lg:text-md">{entry.title}</span>
        </div>

        <div className="my-lg h-[1px] border border-brown-600 opacity-20"></div>

        {/* Tabs navigation */}
        <nav className="mb-lg">
          <ul className="flex gap-xl">
            <li role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={tab}
                aria-controls="panel-api-contract"
                id="tab-api-contract"
                className={
                  tab
                    ? "text-md underline decoration-2 underline-offset-4	 lg:text-lg"
                    : "text-md lg:text-lg"
                }
                onClick={() => toggleTab(1)}
              >
                {t("pages.explore-api-page.api-contract")}
              </button>
            </li>
            <li role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={!tab}
                aria-controls="panel-information"
                id="tab-information"
                className={
                  !tab
                    ? "text-md underline decoration-2	underline-offset-4 lg:text-lg"
                    : "text-md lg:text-lg"
                }
                onClick={() => toggleTab(2)}
              >
                Information
              </button>
            </li>
          </ul>
        </nav>

        {/* Tabs */}
        <div>
          <div
            role="tabpanel"
            id="panel-api-contract"
            aria-labelledby="tab-api-contract"
            className={tab ? "block" : "hidden"}
          >
            <ApiExplorer env={env} contextId={cid} entryId={apieid as string} />
          </div>

          <div
            role="tabpanel"
            id="panel-information"
            aria-labelledby="tab-information"
            className={!tab ? "block" : "hidden"}
          >
            <div
              className="mb-xl"
              data-entryscape="view"
              data-entryscape-onecol="true"
            />

            <div className="max-w-md bg-pink-200 p-md [&_h2]:mb-xs [&_h2]:text-md [&_h2]:text-textSecondary [&_h2]:lg:text-lg [&_p]:mb-lg [&_p]:text-sm [&_p]:text-textPrimary [&_p]:lg:text-md">
              <div>
                <Heading level={2} size={"sm"}>
                  {t("pages.explore-api-page.access-to-api")}
                </Heading>
                <p>{t("pages.explore-api-page.access-to-api-txt")}</p>
                <Heading level={2} size={"sm"}>
                  {t("pages.explore-api-page.open-apis")}
                </Heading>
                <p>{t("pages.explore-api-page.open-apis-txt")}</p>
                <Heading level={2} size={"sm"}>
                  {t("pages.explore-api-page.api-key")}
                </Heading>
                <p>{t("pages.explore-api-page.api-key-txt")}</p>
              </div>
              {entry.contact && (
                <div className="mb-md">
                  <Heading level={2} size={"sm"}>
                    {t("pages.explore-api-page.contact-publisher")}
                  </Heading>

                  <CustomLink
                    className="!mb-lg text-brown-800"
                    href={`${entry.contact.url}`}
                  >
                    {entry.contact.title}
                  </CustomLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
