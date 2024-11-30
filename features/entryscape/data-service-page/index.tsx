import Head from "next/head";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import React, { useContext, useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { useEntryScapeBlocks } from "@/hooks/use-entry-scape-blocks";
import { ApiIndexContext } from "@/providers/api-index-context";
import { EntrystoreContext } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

export const DataServicePage: React.FC<{
  dataSet: string | string[] | undefined;
  name: string | string[] | undefined;
}> = ({ dataSet, name }) => {
  const { lang, t } = useTranslation();
  const { findDetection } = useContext(ApiIndexContext);
  const { setBreadcrumb, iconSize } = useContext(SettingsContext);
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

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: entry.title || "",
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: t("routes|datasets$title"),
            link: { ...linkBase, link: `/${t("routes|datasets$path")}?q=&f=` },
          },
        ],
      });
  }, [entry.title]);

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
      <main>
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {entry.title}
        </Heading>

        <div className="gap-2xl lg:flex">
          {/* Left column */}
          <div className="flex flex-col gap-lg">
            {entry.publisher && <Preamble>{entry.publisher}</Preamble>}
            {/* Indicators */}
            <div
              data-entryscape="customIndicators"
              className="indicators flex flex-col flex-wrap gap-x-lg gap-y-sm text-textSecondary md:flex-row"
            />

            {/* Description */}
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
                  <Link
                    href={`/${t(
                      "routes|dataservices$path",
                    )}/${cid}_${eid}/${name}/apiexplore/${eid}`}
                    locale={lang}
                    className="dataservice-explore-api-link entryscape link text-md"
                  >
                    Utforska API
                  </Link>
                  <br />
                </span>
              )}
            </div>

            <div className="bg-pink-200 p-lg">
              <Heading level={3}>
                {t("pages|datasetpage$contact-publisher")}
              </Heading>
              <p>
                {t("pages|datasetpage$contact-publisher-text")}
                {t("pages|datasetpage$contact-publisher-text2")}{" "}
                <a
                  className="link"
                  href="https://community.dataportal.se/"
                  lang="en"
                >
                  community
                </a>
                .
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="mb-lg box-border h-fit w-full max-w-md flex-shrink-0 bg-white p-md lg:mb-none lg:max-w-[296px]">
            <Heading
              level={2}
              size={"sm"}
              className="mb-md font-strong text-textSecondary md:mb-lg"
            >
              {t("pages|dataservicepage$api")}
            </Heading>
            {/* About dataservice */}
            <div data-entryscape="aboutDaservice" className="mb-lg" />

            <div
              data-entryscape="view"
              data-entryscape-rdformsid="dcat:DataService"
              data-entryscape-filterpredicates="dcterms:title,dcterms:publisher,dcat:endpointURL"
              className="lg:w-full"
            />
          </div>
        </div>
      </main>
    </Container>
  );
};
