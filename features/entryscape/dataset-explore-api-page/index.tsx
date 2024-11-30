import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import React, { useContext, useEffect, useState } from "react";

import { CustomLink } from "@/components/custom-link";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { ApiExplorerProps } from "@/features/entryscape/api-exploring";
import { useEntryScapeBlocks } from "@/hooks/use-entry-scape-blocks";
import { EntrystoreContext } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

const ApiExplorer = dynamic(
  () =>
    import("@/features/entryscape/api-exploring").then(
      (c) => c.ApiExplorer,
      (e) => e as React.FC<ApiExplorerProps>,
    ),
  { ssr: false },
);

export const DataSetExploreApiPage: React.FC<{
  dataSet: string | string[] | undefined;
  apieid: string | string[] | undefined;
}> = ({ dataSet, apieid }) => {
  const { query } = useRouter() || {};
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];
  const { t, lang } = useTranslation();
  const { env, setBreadcrumb, iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);

  const [toggleTabs, setToggleTabs] = useState(1);
  const tab = toggleTabs === 1;

  //Toggle between tabs
  const toggleTab = (index: any) => {
    setToggleTabs(index);
  };

  useEntryScapeBlocks({
    entrystoreBase: entry.entrystore.getBaseURI(),
    env: entry.env,
    lang,
    iconSize,
    pageType: "apiexplore",
    context: entry.context,
    esId: entry.esId,
  });

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: t("routes|api_explore$title"),
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: t("routes|datasets$title"),
            link: { ...linkBase, link: `/${t("routes|datasets$path")}?q=&f=` },
          },
          {
            name: (entry.title as string) || "",
            link: {
              ...linkBase,
              link: `/${t("routes|datasets$path")}/${query.dataSet}/${
                query.name
              }`,
            },
          },
        ],
      });
  }, [entry]);

  return (
    <Container>
      <Head>
        <title>{`${entry.title} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
      </Head>
      <div>
        {/* Title */}
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {t("pages|explore-api-page$explore-api")}
        </Heading>

        <div className="mb-md flex w-full flex-col gap-lg lg:mb-lg">
          {/* Publisher */}
          {entry.publisher && (
            <Preamble className="mb-lg">{entry.publisher}</Preamble>
          )}

          {/* Indicators */}
          <div
            data-entryscape="customIndicators"
            data-entryscape-entry={eid}
            data-entryscape-context={cid}
            className="indicators flex flex-col flex-wrap gap-x-lg gap-y-sm text-textSecondary md:flex-row"
          />
        </div>
        <div className="flex flex-col">
          {/* Refers to dataset - heading*/}
          <Heading level={2} size={"sm"} className="mb-sm md:mb-md">
            {t("pages|explore-api-page$belongs-to-dataset")}
          </Heading>

          {/* Refers to dataset - datset */}
          <span className="text-sm lg:text-md">{entry.title}</span>
        </div>

        <div className="my-lg h-[1px] border border-brown-600 opacity-20"></div>

        {/* Tabs navigation */}
        <nav className="mb-lg">
          <ul role="tablist" className="flex gap-xl">
            <li role="presentation">
              <button
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
                {t("pages|explore-api-page$api-contract")}
              </button>
            </li>
            <li role="presentation">
              <button
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
            <div className="mb-xl" data-entryscape="view"></div>

            <div className="max-w-md bg-pink-200 p-md [&_h2]:mb-xs [&_h2]:text-md [&_h2]:text-textSecondary [&_h2]:lg:text-lg [&_p]:mb-lg [&_p]:text-sm [&_p]:text-textPrimary [&_p]:lg:text-md">
              <div>
                <Heading level={2} size={"sm"}>
                  {t("pages|explore-api-page$access-to-api")}
                </Heading>
                <p>{t("pages|explore-api-page$access-to-api-txt")}</p>
                <Heading level={2} size={"sm"}>
                  {t("pages|explore-api-page$open-apis")}
                </Heading>
                <p>{t("pages|explore-api-page$open-apis-txt")}</p>
                <Heading level={2} size={"sm"}>
                  {t("pages|explore-api-page$api-key")}
                </Heading>
                <p>{t("pages|explore-api-page$api-key-txt")}</p>
              </div>
              {entry.contact && (
                <div className="mb-md">
                  <Heading level={2} size={"sm"}>
                    {t("pages|explore-api-page$contact-publisher")}
                  </Heading>

                  <CustomLink
                    className="!mb-lg text-brown-800"
                    href={`${entry.contact.email}`}
                  >
                    {entry.contact.name}
                  </CustomLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
