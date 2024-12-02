import React, { FC, useContext, useEffect } from "react";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { SettingsContext } from "@/providers/SettingsProvider";
import Head from "next/head";
import { linkBase } from "@/utilities";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";
import Link from "next/link";
import InfoIcon from "@/assets/icons/dela-data.svg";
import DiamondIcon from "@/assets/icons/diamond.svg";
import { ButtonLink } from "@/components/global/Button";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import SpecListIcon from "@/assets/icons/specList.svg";
import HoldingHandsIcon from "@/assets/icons/holdingHands.svg";
import { CustomLink } from "@/components/global/CustomLink";
export const OrganisationPage: FC = () => {
  const { pathname } = useRouter() || {};
  const { setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: entry.title,
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: t("routes|organisations$title"),
            link: {
              ...linkBase,
              link: `/${t("routes|organisations$path")}?q=&f=`,
            },
          },
        ],
      });
  }, [pathname, entry]);

  return (
    <Container>
      <Head>
        <title>{`${entry.title} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
        {entry.description && (
          <meta property="og:description" content={entry.description} />
        )}
        <meta
          name="twitter:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
      </Head>
      <div>
        {/* Title */}
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {entry.title}
        </Heading>

        <div className="mb-lg gap-2xl md:mb-xl lg:flex">
          {/* Left column */}
          <div className="mb-lg flex w-full max-w-md flex-shrink-0 flex-col gap-xl lg:mb-xl">
            {/* Description */}
            {entry.description !== "" && (
              <p className="mb-lg">{entry.description}</p>
            )}

            {/* Datasets wrapper */}
            <div>
              <Heading
                level={2}
                size={"md"}
                className="mb-lg inline-flex items-center gap-[0.625rem]"
              >
                {t("common|datasets")} <InfoIcon className="mt-[2px]" />
              </Heading>
              <div className="box-border flex w-full flex-col items-center gap-xl rounded-lg bg-white p-xl md:items-end">
                <div className="flex w-full flex-col items-center py-lg md:flex-row">
                  <div className="flex flex-shrink-0 flex-col items-center gap-sm">
                    <DiamondIcon />
                    <span className="text-xl text-primary md:text-2xl">
                      {entry.organisationData.datasets.total || 0}
                    </span>
                    <span className="text-center text-sm text-textSecondary">
                      {entry.organisationData.datasets.totTitle}
                    </span>
                  </div>
                  <span
                    className="mb-[2rem] w-[11.125rem] border-b-2 border-brown-400 pt-[2rem] md:mb-none md:mr-[2rem] 
                    md:h-[11.125rem] md:w-none md:border-b-0 md:border-r-2 md:pl-[2rem] md:pt-none"
                  />
                  <div className="grid grid-cols-2 gap-x-sm gap-y-xl">
                    {entry.organisationData.datasets.dataInfo.map(
                      (data: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-sm"
                        >
                          <span className="text-xl text-primary md:text-2xl">
                            {data.total}
                          </span>
                          <span className="text-center text-sm">
                            {data.title}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
                {entry.organisationData.datasets.link && (
                  <ButtonLink
                    href={entry.organisationData.datasets.link}
                    label={t("pages|organisation_page$view-all-data")}
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  />
                )}
              </div>
            </div>

            {/* Specifications wrapper */}
            {entry.organisationData.specifications.total > 0 && (
              <div>
                <Heading level={2} size={"md"} className="mb-lg">
                  {t("common|specifications")}
                </Heading>
                <div className="box-border flex w-full flex-col items-center gap-lg rounded-lg bg-white p-xl md:flex-row md:justify-between md:gap-xl">
                  <div className="flex flex-col items-center gap-sm md:flex-row md:gap-lg">
                    <SpecListIcon />
                    <span className="inline-flex items-center gap-sm">
                      <span className="text-xl text-textSecondary md:text-2xl">
                        {entry.organisationData.specifications.total}
                      </span>
                      <span className="text-textSecondary">
                        {t("common|specifications")}
                      </span>
                    </span>
                  </div>
                  <ButtonLink
                    href={entry.organisationData.specifications.link}
                    label={t("pages|organisation_page$view-all-spec")}
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  />
                </div>
              </div>
            )}

            {/* Terminology wrapper */}
            {entry.organisationData?.terms?.length > 0 && (
              <div>
                <Heading level={2} size={"md"} className="mb-lg">
                  {t("common|term-with-concept")}
                </Heading>
                <div className="box-border flex w-full flex-col items-center gap-lg rounded-lg bg-white p-xl md:flex-row md:justify-between md:gap-xl">
                  <div className="flex flex-col items-center gap-sm md:flex-row md:gap-lg">
                    <HoldingHandsIcon />
                    <div className="inline-flex flex-col gap-sm">
                      {entry.organisationData?.terms?.length > 0 &&
                        entry.organisationData.terms.map(
                          (term: any, idx: number) => (
                            <Link
                              key={idx}
                              href={term.url}
                              className="text-sm text-green-600 hover:no-underline"
                            >
                              {term.title}
                            </Link>
                          ),
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Concepts wrapper */}
            {entry.organisationData?.concepts?.total > 0 && (
              <div>
                <Heading level={2} size={"md"} className="mb-lg">
                  {t("common|concepts")}
                </Heading>
                <div className="box-border flex w-full flex-col items-center gap-lg rounded-lg bg-white p-xl md:flex-row md:justify-between md:gap-xl">
                  <div className="flex flex-col items-center gap-sm md:flex-row md:gap-lg">
                    <HoldingHandsIcon />
                    <span className="inline-flex items-center gap-sm">
                      <span className="text-xl text-textSecondary md:text-2xl">
                        {entry.organisationData.concepts.total}
                      </span>
                      <span className="text-textSecondary">
                        {t("common|concepts")}
                      </span>
                    </span>
                  </div>
                  <ButtonLink
                    href={entry.organisationData.concepts.link}
                    label={t("pages|organisation_page$view-all-concepts")}
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="mb-lg w-full max-w-md space-y-lg pt-none lg:mb-none lg:max-w-[26.25rem]">
            {/* About dataset - wrapper  */}
            <div className="box-border w-full rounded-lg bg-white p-xl">
              <Heading
                level={2}
                size={"md"}
                className="mb-md text-textSecondary md:mb-lg"
              >
                {`${t("common|about")} ${entry.title}`}
              </Heading>

              <div className="space-y-lg">
                {entry.contact && entry.contact.email && (
                  <div>
                    <Heading
                      className="font-strong text-textSecondary"
                      level={3}
                      size={"xxs"}
                    >
                      {t("pages|organisation_page$contact")}
                    </Heading>
                    <CustomLink
                      className="text-sm text-green-600 hover:no-underline"
                      href={entry.contact.email}
                    >
                      {entry.contact.name}
                    </CustomLink>
                  </div>
                )}

                <p className="font-strong text-textSecondary">{`${t(
                  "pages|organisation_page$org-type",
                )}: ${entry.organisationData.orgType}`}</p>

                {entry.organisationData.orgNo && (
                  <p className="font-strong text-textSecondary">
                    {`${t("pages|organisation_page$org-no")}: ${
                      entry.organisationData.orgNo
                    }`}
                  </p>
                )}

                {entry.mqaCatalog && entry.mqaCatalog.url && (
                  <div>
                    <Heading
                      className="font-strong text-textSecondary"
                      level={3}
                      size={"xxs"}
                    >
                      {t("pages|datasetpage$mqa")}
                    </Heading>
                    <Link
                      className="text-sm text-green-600 hover:no-underline"
                      href={entry.mqaCatalog.url}
                    >
                      {entry.mqaCatalog.title}
                    </Link>
                  </div>
                )}

                {entry.downloadFormats && entry.downloadFormats?.length > 0 && (
                  <div>
                    <Heading
                      className="font-strong text-textSecondary"
                      level={3}
                      size={"xxs"}
                    >
                      {t("pages|organisation_page$download_link")}
                    </Heading>
                    <div className="flex flex-col gap-sm">
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
