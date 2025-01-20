import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import React, { FC, useContext, useEffect, useState } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import DiamondIcon from "@/assets/icons/diamond.svg";
import HoldingHandsIcon from "@/assets/icons/holding-hands.svg";
import ListBlockIcon from "@/assets/icons/list-block.svg";
import QuestionCircleIcon from "@/assets/icons/question-circle.svg";
import { Button, ButtonLink } from "@/components/button";
import { CustomLink } from "@/components/custom-link";
import { Container } from "@/components/layout/container";
import { Modal } from "@/components/modal";
import { Heading } from "@/components/typography/heading";
import Showcase from "@/features/entryscape/showcase";
import { EntrystoreContext } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { DataInfo, TermInfo } from "@/types/organisation";
import { linkBase } from "@/utilities";

export const OrganisationPage: FC = () => {
  const { pathname } = useRouter() || {};
  const { setBreadcrumb, iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setBreadcrumb?.({
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
      <div>
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {entry.title}
        </Heading>

        <div className="mb-lg gap-2xl md:mb-xl lg:flex">
          {/* Left column */}
          <div className="mb-xl flex w-full max-w-md flex-shrink-0 flex-col gap-xl">
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
                {t("common|datasets")}
                <Button
                  variant="plain"
                  className="rounded-full !p-xs"
                  aria-label={t("pages|organisation_page$data-info")}
                  icon={QuestionCircleIcon}
                  iconPosition="left"
                  onClick={() => setShowInfo(!showInfo)}
                />
              </Heading>

              <Modal
                modalOpen={showInfo}
                setModalOpen={setShowInfo}
                onClick={() => setShowInfo(false)}
                description={t("pages|organisation_page$data-info-more")}
                closeBtn={t("common|close")}
                closeBtnClassName="ml-auto"
                modalSize="sm"
              />
              <div className="box-border flex w-full flex-col items-center gap-xl rounded-lg bg-white p-xl md:items-end">
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
                      (data: DataInfo, idx: number) => (
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
                {entry.organisationData?.datasets.link && (
                  <ButtonLink
                    href={entry.organisationData?.datasets.link}
                    label={t("pages|organisation_page$view-all-data")}
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  />
                )}
              </div>
            </div>
            {/* Specifications wrapper */}
            {entry.organisationData?.specifications.total &&
            entry.organisationData?.specifications.total > 0 ? (
              <div>
                <Heading level={2} size={"md"} className="mb-lg">
                  {t("common|specifications")}
                </Heading>
                <div className="box-border flex w-full flex-col items-center gap-lg rounded-lg bg-white p-xl md:flex-row md:justify-between md:gap-xl">
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
                      <span>{t("common|specifications")}</span>
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
            ) : null}
            {/* Terminology wrapper */}
            {entry.organisationData?.terms?.termsInfo?.length &&
            entry.organisationData?.terms?.termsInfo?.length > 0 ? (
              <div>
                <Heading level={2} size={"md"} className="mb-lg">
                  {t("common|term-with-concept")}
                </Heading>
                <div className="box-border flex w-full flex-col items-center gap-lg rounded-lg bg-white p-xl md:flex-row md:justify-between md:gap-xl">
                  <div className="flex w-full flex-col items-center gap-sm text-textSecondary md:flex-row md:gap-lg">
                    <HoldingHandsIcon
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
                        <span>{t("common|terminologies")}</span>
                      </span>
                      <div className="flex flex-col justify-center gap-sm">
                        {entry.organisationData?.terms?.termsInfo.map(
                          (term: TermInfo, idx: number) => (
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
              </div>
            ) : null}
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

              <div className="space-y-lg text-sm">
                <div>
                  <Heading
                    className="font-strong text-textSecondary"
                    level={3}
                    size={"xxs"}
                  >
                    {t("pages|organisation_page$contact")}
                  </Heading>
                  {entry.contact && entry.contact.email ? (
                    <CustomLink
                      className="text-sm text-green-600 hover:no-underline"
                      href={entry.contact.email}
                    >
                      {entry.contact.name}
                    </CustomLink>
                  ) : (
                    <p>{t("pages|organisation_page$no-contact")}</p>
                  )}
                </div>

                <div>
                  <Heading
                    className="font-strong text-textSecondary"
                    level={3}
                    size={"xxs"}
                  >
                    {t("pages|organisation_page$org-type")}
                  </Heading>
                  <p>
                    {entry.organisationData?.orgType ||
                      t("pages|organisation_page$no-org-type")}
                  </p>
                </div>

                {entry.organisationData?.orgNumber && (
                  <div>
                    <Heading
                      className="font-strong text-textSecondary"
                      level={3}
                      size={"xxs"}
                    >
                      {t("pages|organisation_page$org-no")}
                    </Heading>
                    <p>{entry.organisationData.orgNumber}</p>
                  </div>
                )}

                {entry.mqaCatalog && (
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
        {entry.organisationData?.showcases &&
          entry.organisationData?.showcases.length > 0 && (
            <div>
              <Heading level={2} size={"md"} className="mb-lg md:mb-xl">
                {t("pages|organisation_page$showcases_heading")}
              </Heading>
              <div className="grid grid-cols-3 gap-xl">
                {entry.organisationData?.showcases.map((showcase) => (
                  <Showcase key={showcase.title} {...showcase} />
                ))}
              </div>
            </div>
          )}
      </div>
    </Container>
  );
};
