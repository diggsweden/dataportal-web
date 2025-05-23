import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import React, { FC, useState } from "react";

import InternalLinkIcon from "@/assets/icons/arrow-right.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import InfoCircleIcon from "@/assets/icons/info-circle.svg";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { Heading } from "@/components/typography/heading";
import { ToolDataFragment as Tool } from "@/graphql/__generated__/operations";
import { isExternalLink } from "@/utilities";

interface ToolsTeaserProps {
  tools: Tool;
}

export const Toolteaser: FC<ToolsTeaserProps> = ({ tools }) => {
  const { heading, link, domainLabel, preamble, description } = tools;
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation("common");
  return (
    <div data-test-id="tool-teaser" className="h-full">
      <div className="flex h-full flex-col justify-between gap-lg bg-white p-lg">
        <div className="flex h-full flex-col-reverse gap-sm">
          <Button
            data-test-id="tool-teaser-preview-button"
            variant="plain"
            size="sm"
            icon={InfoCircleIcon}
            iconPosition="left"
            onClick={(e) => {
              e.preventDefault();
              setShowModal(true);
            }}
            label={t("preview")}
            className="focus--primary no-group-hover z-20"
            aria-label={`${t("preview")} ${t("support-tools")} - ${heading}`}
          />
          <div className="flex h-full flex-col gap-sm">
            <div className="flex items-center justify-between gap-sm">
              <span
                data-test-id="tool-teaser-domain-label"
                className={`px-sm py-[2px] text-sm ${
                  !isExternalLink(link)
                    ? "bg-brown-800  text-white"
                    : "bg-brown-200 text-brown-900"
                }`}
              >
                {domainLabel}
              </span>
              <span
                data-test-id="tool-teaser-icon"
                className="text-red-400 hover:text-green-600 group-hover:text-green-600"
              >
                {isExternalLink(link) ? (
                  <>
                    <ExternalLinkIcon className="flex-shrink-0 transform  transition-transform duration-500 group-hover:translate-x-1/3" />
                    <span className="sr-only">
                      {t("common|open-in-new-tab")}
                    </span>
                  </>
                ) : (
                  <InternalLinkIcon className="flex-shrink-0 transform transition-transform duration-500 group-hover:translate-x-1/3" />
                )}
              </span>
            </div>
            <div>
              <Link
                data-test-id="tool-teaser-link"
                data-test-is-external={isExternalLink(link)}
                href={link}
                className="link-focus before:focus--outline before:focus--out before:focus--primary focus--none z-10 flex flex-col gap-sm no-underline before:absolute before:inset-none focus-visible:underline"
              >
                <Heading
                  data-test-id="tool-teaser-heading"
                  className="text-green-600 group-hover:underline"
                  level={3}
                  size={"xs"}
                >
                  {heading}
                </Heading>
              </Link>
            </div>
            <p
              data-test-id="tool-teaser-preamble"
              className="line-clamp-3 flex-grow text-sm"
            >
              {preamble}
            </p>
          </div>
        </div>
      </div>
      <Modal
        heading={heading}
        closeBtn={t("close")}
        description={description}
        textSize="md"
        text={preamble}
        modalOpen={showModal}
        setModalOpen={setShowModal}
        confirmBtn={t("to-page")}
        ariaLabel={`${t("to-page")} - ${heading}`}
        href={link}
      />
    </div>
  );
};
