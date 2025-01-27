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

export const DatasetPage: FC = () => {
  const { pathname } = useRouter() || {};
  const { setBreadcrumb, iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { lang, t } = useTranslation();
  const [showText, setShowText] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  // const [showAllKeywords, setShowAllKeywords] = useState(false);
  const relatedSpecs = showAllSpecs
    ? entry.relatedSpecifications
    : entry.relatedSpecifications?.slice(0, 4);
  // const keywords = showAllKeywords
  //   ? entry.keywords
  //   : entry.keywords?.slice(0, 4);

  useEntryScapeBlocks({
    entrystoreBase: entry.entrystore.getBaseURI(),
    env: entry.env,
    lang,
    iconSize,
    pageType: "dataset",
    context: entry.context,
    esId: entry.esId,
  });

  useEffect(() => {
    setBreadcrumb?.({
      name: entry.title,
      crumbs: [
        { name: "start", link: { ...linkBase, link: "/" } },
        {
          name: t("routes|datasets$title"),
          link: { ...linkBase, link: `/${t("routes|datasets$path")}?q=&f=` },
        },
      ],
    });
  }, [pathname, entry]);

  useEffect(() => {
    (() => {
      const description = document.querySelector("#pre-description");
      if (description) {
        return setDescriptionHeight(description.clientHeight);
      }
    })();
  });

  return (
    <Container>
      <div>
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {entry.title}
        </Heading>
        <div className="mb-lg gap-2xl md:mb-xl lg:flex">
          {/* Left column */}
          <div className="mb-lg flex w-full max-w-md flex-col gap-lg lg:mb-xl">
            {/* Publisher */}
            <div className="mb-md flex flex-col gap-md">
              {entry.organisationLink ? (
                <Link
                  className="text-lg font-normal text-green-600 hover:!no-underline"
                  href={entry.organisationLink}
                >
                  {entry.publisher}
                </Link>
              ) : (
                entry.publisher && <Preamble>{entry.publisher}</Preamble>
              )}

              {/* Related dataset series */}
              {entry.relatedDatasetSeries &&
                entry.relatedDatasetSeries.length > 0 && (
                  <div className="inline-flex flex-wrap items-center gap-sm text-sm">
                    <span className="text-textSecondary">
                      {t("pages|datasetpage$related_dataset_series")}
                    </span>
                    {entry.relatedDatasetSeries.map((ds, idx) => (
                      <span key={idx} className="inline-flex items-center">
                        <Link
                          href={ds.url}
                          className="text-sm text-green-600 hover:no-underline"
                        >
                          {ds.title}
                        </Link>
                        {idx < (entry.relatedDatasetSeries?.length ?? 0) - 1 &&
                          ", "}
                      </span>
                    ))}
                  </div>
                )}
            </div>

            {/* Indicators */}
            <div
              data-test-id="indicators"
              data-entryscape="customIndicators"
              className="indicators flex flex-col flex-wrap gap-x-lg gap-y-sm text-textSecondary md:flex-row"
            />

            {/* Description */}
            <div className="flex flex-col items-end gap-sm">
              <pre
                id="pre-description"
                className={`w-full whitespace-pre-line text-left font-ubuntu text-md ${
                  showText ? "line-clamp-none" : "line-clamp-[8]"
                }`}
              >
                {entry.description}
              </pre>
              {descriptionHeight > 191 && (
                <Button
                  size={"sm"}
                  variant={"plain"}
                  label={
                    showText
                      ? t("pages|datasetpage$view_less")
                      : t("pages|datasetpage$view_more")
                  }
                  onClick={() => setShowText(!showText)}
                />
              )}
            </div>

            <div>
              {/* Distribution list */}
              <div
                data-test-id="datasets-block"
                className="distribution__list"
                data-entryscape="distributionListCustom"
                data-entryscape-registry="true"
              />

              {/* Dataset maps */}
              <div
                className="dataset__map"
                data-entryscape="view"
                data-entryscape-rdformsid="dcat:dcterms:spatial_bb_da"
                data-entryscape-label="true"
              ></div>

              <div
                className="dataset__map"
                data-entryscape="autoVisualizations"
                data-entryscape-include-auto-visualizations="true"
              ></div>

              {/* Questions  or comments */}
              <div
                data-test-id="contact-publisher"
                className="contact__publisher mt-md md:mt-lg"
              >
                <Heading
                  level={2}
                  size={"sm"}
                  className="mb-sm text-textSecondary md:mb-md"
                >
                  {t("pages|datasetpage$contact-publisher")}
                </Heading>
                <p>
                  {t("pages|datasetpage$contact-publisher-text")}
                  {t("pages|datasetpage$contact-publisher-text2")}{" "}
                  <a
                    className="link text-md"
                    href="https://community.dataportal.se/"
                    lang="en"
                  >
                    community
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="mb-lg w-full max-w-md space-y-lg pt-none lg:mb-none lg:max-w-[18.5rem]">
            {/* About dataset - wrapper  */}
            <div
              data-test-id="about-section"
              className="box-border w-full bg-white p-md"
            >
              <Heading
                level={2}
                size={"sm"}
                className="mb-md font-strong text-textSecondary md:mb-lg"
              >
                {t("pages|datasetpage$about-dataset")}
              </Heading>

              <div className="space-y-lg">
                {/* About dataset */}
                <div data-entryscape="aboutDataset" />
                {/* TODO: Fix the order of the datasets so the keywords can be 
                handled the same way on all pages */}
                {/*             
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
                */}
                {entry.relatedSpecifications &&
                  entry.relatedSpecifications.length > 0 && (
                    <div>
                      <Heading
                        className="font-strong text-textSecondary"
                        level={3}
                        size={"xxs"}
                      >
                        {t("pages|datasetpage$related_specifications")}
                      </Heading>
                      {relatedSpecs?.map((spec, idx) => (
                        <a
                          className="fit mb-sm block text-sm text-green-600 hover:no-underline"
                          key={idx}
                          href={spec.url}
                        >
                          {spec.title}
                        </a>
                      ))}
                      {entry.relatedSpecifications?.length > 4 && (
                        <Button
                          size={"xs"}
                          className="mt-xs px-sm py-xs !font-strong text-brown-600"
                          variant={"plain"}
                          label={
                            showAllSpecs
                              ? t("pages|datasetpage$view_less")
                              : t("pages|datasetpage$view_more")
                          }
                          onClick={() => setShowAllSpecs(!showAllSpecs)}
                        />
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* Catalog informaton wrapper */}
            <div
              data-test-id="catalog-information"
              className="box-border w-full bg-white p-md"
            >
              <Heading
                level={2}
                size={"sm"}
                className="mb-sm font-strong text-textSecondary md:mb-md"
              >
                {t("pages|datasetpage$catalog")}
              </Heading>
              <div className="space-y-lg">
                {entry.mqaCatalog && (
                  <div>
                    <Heading
                      className="font-strong text-textSecondary"
                      level={3}
                      size={"xxs"}
                    >
                      {t("pages|datasetpage$mqa-catalog")}
                    </Heading>
                    <Link
                      className="text-sm text-green-600 underline-offset-2 hover:no-underline"
                      href={entry.mqaCatalog.url}
                    >
                      {entry.mqaCatalog.title}
                    </Link>
                  </div>
                )}
                <div />

                {/* Catalog */}
                <div data-entryscape="catalog" />

                <div
                  data-entryscape="view"
                  data-entryscape-rdformsid="dcat:OnlyCatalog"
                  data-entryscape-relationinverse="dcat:dataset"
                  data-entryscape-onecol="true"
                  data-entryscape-filterpredicates="dcterms:issued,dcterms:language,dcterms:modified,dcterms:spatial,dcterms:license,dcat:themeTaxonomi"
                />

                {/* Download formats */}
                {entry.downloadFormats && entry.downloadFormats?.length > 0 && (
                  <div data-test-id="download-formats">
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
            </div>
          </div>
          {/* End right column */}
        </div>
      </div>
    </Container>
  );
};
