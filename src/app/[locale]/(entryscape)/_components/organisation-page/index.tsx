"use client";

import { useTranslations } from "next-intl";
import { useContext, useState } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import Showcase from "@/app/[locale]/(entryscape)/_components/showcase";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import DataIcon from "@/assets/icons/data.svg";
import DiamondIcon from "@/assets/icons/diamond.svg";
import ListBlockIcon from "@/assets/icons/list-block.svg";
import QuestionCircleIcon from "@/assets/icons/question-circle.svg";
import { Box } from "@/components/box";
import { Button, ButtonLink } from "@/components/button";
import { AppLink } from "@/components/link";
import { Modal } from "@/components/modal";
import { SidebarSection } from "@/components/sidebar-section";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { SettingsContext } from "@/providers/settings-provider";
import type { DataInfo, TermInfo } from "@/types/organisation";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function OrganisationPage() {
  const { iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(entry.title, [
        {
          name: t("routes.organisations.title"),
          link: `/${t("routes.organisations.path")}?q=&f=`,
        },
      ])}
      title={entry.title}
      mainLayout="organisation"
      sidebarLayout="panelsWide"
      main={
        <>
          {/* Description */}
          {entry.description !== "" && (
            <p data-test-id="description" className="mb-lg">
              {entry.description}
            </p>
          )}
          {/* Datasets wrapper */}
          <div data-test-id="organisation-datasets">
            <Heading
              level={2}
              size={"md"}
              className="mb-lg inline-flex items-center gap-[0.625rem]"
            >
              {t("common.datasets")}
              <Button
                data-test-id="data-info-button"
                variant="plain"
                className="rounded-full !p-xs"
                aria-label={t("pages.organisation_page.data-info")}
                icon={QuestionCircleIcon}
                iconPosition="left"
                onClick={() => setShowInfo(!showInfo)}
              />
            </Heading>

            <Modal
              data-test-id="data-info-modal"
              modalOpen={showInfo}
              setModalOpen={setShowInfo}
              onClick={() => setShowInfo(false)}
              description={t("pages.organisation_page.data-info-more")}
              closeBtn={t("common.close")}
              closeBtnClassName="ml-auto"
              size="sm"
            />
            <Box
              color="white"
              padding="xl"
              rounded={true}
              className="flex flex-col gap-xl items-center md:items-end"
            >
              <div className="flex w-full flex-col items-center py-lg md:flex-row">
                <div className="flex flex-shrink-0 flex-col items-center gap-sm">
                  <DiamondIcon
                    className="flex-shrink-0 text-primary"
                    height={iconSize * 3}
                    width={iconSize * 3}
                    viewBox={`0 0 ${iconSize * 1.5} ${iconSize * 1.5}`}
                  />
                  <span className="text-xl text-primary md:text-2xl">
                    {entry.organisationData?.datasets.total || 0}
                  </span>
                  <span className="text-center text-sm text-textSecondary">
                    {entry.organisationData?.datasets.totTitle}
                  </span>
                </div>
                <span
                  className="mb-[2rem] w-[11.125rem] border-b-2 border-brown-400 pt-[2rem] md:mb-none md:mr-[2rem] 
                    md:h-[11.125rem] md:w-none md:border-b-0 md:border-r-2 md:pl-[2rem] md:pt-none"
                />
                <div className="grid grid-cols-2 gap-x-sm gap-y-xl">
                  {entry.organisationData?.datasets.dataInfo.map(
                    (data: DataInfo) => (
                      <div
                        key={data.title}
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
              {entry.organisationData?.datasets.link && (
                <ButtonLink
                  data-test-id="organisation-datasets-link"
                  href={entry.organisationData?.datasets.link}
                  label={t("pages.organisation_page.view-all-data")}
                  icon={ArrowRightIcon}
                  iconPosition="right"
                />
              )}
            </Box>
          </div>
          {/* Specifications wrapper */}
          {entry.organisationData?.specifications.total &&
          entry.organisationData?.specifications.total > 0 ? (
            <div data-test-id="organisation-specifications">
              <Heading level={2} size={"md"} className="mb-lg">
                {t("common.specifications")}
              </Heading>
              <Box
                color="white"
                padding="xl"
                rounded={true}
                className="flex flex-col items-center gap-lg md:flex-row md:justify-between md:gap-xl"
              >
                <div className="flex flex-col items-center gap-sm text-textSecondary md:flex-row md:gap-lg">
                  <ListBlockIcon
                    className="flex-shrink-0"
                    height={iconSize * 3}
                    width={iconSize * 3}
                    viewBox={`0 0 ${iconSize * 1.5} ${iconSize * 1.5}`}
                  />
                  <span className="inline-flex items-center gap-sm">
                    <span className="text-xl md:text-2xl">
                      {entry.organisationData.specifications.total}
                    </span>
                    <span>{t("common.specifications")}</span>
                  </span>
                </div>
                <ButtonLink
                  data-test-id="organisation-specifications-link"
                  href={entry.organisationData.specifications.link}
                  label={t("pages.organisation_page.view-all-spec")}
                  icon={ArrowRightIcon}
                  iconPosition="right"
                />
              </Box>
            </div>
          ) : null}
          {/* Terminology wrapper */}
          {entry.organisationData?.terms?.termsInfo?.length &&
          entry.organisationData?.terms?.termsInfo?.length > 0 ? (
            <div data-test-id="organisation-terminology">
              <Heading level={2} size={"md"} className="mb-lg">
                {t("common.term-with-concept")}
              </Heading>
              <Box
                color="white"
                padding="xl"
                rounded={true}
                className="flex w-full flex-col items-center gap-lg md:flex-row md:justify-between md:gap-xl"
              >
                <div className="flex w-full flex-col items-center gap-sm text-textSecondary md:flex-row md:gap-lg">
                  <DataIcon
                    className="flex-shrink-0"
                    height={iconSize * 3}
                    width={iconSize * 3}
                    viewBox={`0 0 ${iconSize * 1.5} ${iconSize * 1.5}`}
                  />

                  <div className="flex w-full flex-col gap-xl md:flex-row">
                    <span className="inline-flex items-center justify-center gap-sm">
                      <span className="text-xl md:text-2xl">
                        {entry.organisationData.terms.total}
                      </span>
                      <span>{t("common.terminologies")}</span>
                    </span>
                    <div className="flex flex-col justify-center gap-sm">
                      {entry.organisationData?.terms?.termsInfo.map(
                        (term: TermInfo, idx: number) => (
                          <AppLink
                            data-test-id="organisation-terminology-link"
                            key={term.url}
                            href={term.url}
                            className="text-sm text-green-600 hover:no-underline"
                          >
                            {term.title}
                          </AppLink>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </Box>
            </div>
          ) : null}
        </>
      }
      sidebar={
        <>
          {/* About dataset - wrapper  */}
          <Box testId="about-section" color="white" padding="xl" rounded={true}>
            <Heading
              level={2}
              size={"md"}
              className="mb-md text-textSecondary md:mb-lg"
            >
              {`${t("common.about")} ${entry.title}`}
            </Heading>

            <div className="space-y-lg text-sm">
              <SidebarSection
                testId="contact"
                heading={t("pages.organisation_page.contact")}
                items={[
                  entry.contact ?? t("pages.organisation_page.no-contact"),
                ]}
                color="primary"
              />

              <SidebarSection
                testId="organisation-type"
                heading={t("pages.organisation_page.org-type")}
                items={[
                  entry.organisationData?.orgType ||
                    t("pages.organisation_page.no-org-type"),
                ]}
                color="primary"
              />

              <SidebarSection
                testId="organisation-number"
                heading={t("pages.organisation_page.org-no")}
                items={[entry.organisationData?.orgNumber]}
                color="primary"
              />

              <SidebarSection
                testId="mqa-link"
                heading={t("pages.datasetpage.mqa")}
                items={[entry.mqaCatalog]}
              />

              <SidebarSection
                testId="download-formats"
                heading={t("pages.organisation_page.download_link")}
                items={entry.downloadFormats ?? []}
              />
            </div>
          </Box>
        </>
      }
      footer={
        entry.organisationData?.showcases &&
        entry.organisationData?.showcases.length > 0 ? (
          <div>
            <Heading level={2} size="md" className="mb-lg md:mb-xl">
              {`${t("pages.organisation_page.showcases_heading")} (${
                entry.organisationData?.showcases.length
              })`}
            </Heading>
            <div className="flex flex-col gap-xl md:grid md:grid-cols-2 lg:grid-cols-3">
              {entry.organisationData?.showcases.map((showcase) => (
                <Showcase key={showcase.title} {...showcase} />
              ))}
            </div>
          </div>
        ) : undefined
      }
    />
  );
}
