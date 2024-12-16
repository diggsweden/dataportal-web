import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect, useState } from "react";

import { Button } from "@/components/button";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Preamble } from "@/components/typography/preamble";
import { useEntryScapeBlocks } from "@/hooks/use-entry-scape-blocks";
import { EntrystoreContext } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

export const SpecificationPage: FC = () => {
  const { setBreadcrumb, iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { lang, t } = useTranslation();
  const { pathname } = useRouter() || {};
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

  useEffect(() => {
    setBreadcrumb?.({
      name: entry.title,
      crumbs: [
        { name: "start", link: { ...linkBase, link: "/" } },
        {
          name: t("routes|specifications$title"),
          link: {
            ...linkBase,
            link: `/${t("routes|specifications$path")}?q=&f=`,
          },
        },
      ],
    });
  }, [pathname, entry.title]);

  return (
    <Container>
      <div>
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {entry.title}
        </Heading>
        <div className="flex flex-col gap-xl md:mb-xl lg:flex-row lg:gap-2xl">
          {/* Left column */}
          <div className="flex w-full max-w-md flex-col">
            {entry.publisher && (
              <Preamble className="mb-lg">{entry.publisher}</Preamble>
            )}

            <span className="mb-lg mt-md !font-ubuntu text-lg text-textSecondary md:mb-xl md:mt-lg">
              {entry.description}
            </span>

            <Heading level={2} size={"md"} className="mb-md md:mb-lg">
              {t("pages|specification_page$resource_specification")}
            </Heading>
            <div
              data-entryscape="resourceDescriptors2"
              data-entryscape-rdftype="prof:ResourceDescriptor"
            ></div>

            <div className="contact__publisher mt-md md:mt-lg">
              <Heading level={3} size={"sm"}>
                {t("pages|datasetpage$contact-publisher")}
              </Heading>
              <p>
                {t("pages|datasetpage$contact-publisher-text")}
                {t("pages|datasetpage$contact-publisher-text2")}{" "}
                <a href="https://community.dataportal.se/" lang="en">
                  community
                </a>
                .
              </p>
            </div>
          </div>
          {/* End left column */}

          {/* Right column */}
          <div className="h-fit w-full max-w-md bg-white p-md lg:max-w-[296px]">
            <div className="w-full">
              <Heading
                level={2}
                size={"sm"}
                className="mb-sm font-strong text-textSecondary md:mb-md"
              >
                {t("pages|specification_page$about_specification")}
              </Heading>

              <div className="space-y-lg">
                <div>
                  <Heading
                    className="font-strong text-textSecondary"
                    level={3}
                    size={"xxs"}
                  >
                    {t("pages|specification_page$address")}
                  </Heading>

                  <Link
                    className="break-words text-sm text-green-600 hover:no-underline"
                    href={entry.address}
                  >
                    {entry.address}
                  </Link>
                </div>

                {entry.keywords && entry.keywords?.length > 0 && (
                  <div>
                    <Heading
                      className="font-strong text-textSecondary"
                      level={3}
                      size={"xxs"}
                    >
                      {t("pages|datasetpage$keyword")}
                    </Heading>
                    <div className="flex flex-col">
                      {keywords?.map((k, idx) => (
                        <span
                          className="mb-sm w-fit bg-pink-200 px-sm py-xs text-sm font-strong"
                          key={idx}
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                    <Button
                      size={"xs"}
                      className="mt-xs px-sm py-xs !font-strong text-brown-600"
                      variant={"plain"}
                      label={
                        showAllKeywords
                          ? t("pages|datasetpage$view_less")
                          : t("pages|datasetpage$view_more")
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
                  <div>
                    <span className="rdformsLabel">
                      {t("pages|specification_page$related_datasets")}
                    </span>
                    {relatedDatasets?.map((ds, idx) => (
                      <a
                        className="fit mb-sm block text-sm text-green-600 hover:no-underline"
                        key={idx}
                        href={ds.url}
                      >
                        {ds.title}
                      </a>
                    ))}
                    {entry.relatedDatasets?.length > 4 && (
                      <Button
                        size={"xs"}
                        className="mt-xs px-sm py-xs !font-strong text-brown-600"
                        variant={"plain"}
                        label={
                          showAllDatasets
                            ? t("pages|datasetpage$view_less")
                            : t("pages|datasetpage$view_more")
                        }
                        onClick={() => setShowAllDatasets(!showAllDatasets)}
                      />
                    )}
                  </div>
                )}

                {/* Download formats */}
                {entry.downloadFormats && entry.downloadFormats?.length > 0 && (
                  <div>
                    <Heading
                      className="font-strong text-textSecondary"
                      level={3}
                      size={"xxs"}
                    >
                      {t("pages|datasetpage$download_link")}
                    </Heading>
                    <div className="flex flex-col gap-xs">
                      {entry.downloadFormats.map(({ title, url }, idx) => (
                        <a
                          key={idx}
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
              {/* End right column */}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
