import React, { FC, useState } from "react";
import Info from "@/assets/icons/stod-verktyg.svg";
import { ToolDataFragment as Tool } from "@/graphql/__generated__/operations";
import { Heading } from "@/components/global/Typography/Heading";
import Link from "next/link";
import { Modal } from "@/components/global/Modal";
import { isExternalLink } from "@/utilities";
import InternalLinkIcon from "@/assets/icons/arrowRight.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";
import { Button } from "@/components/global/Button";

interface ToolsTeaserProps {
  tools: Tool;
}

export const Toolteaser: FC<ToolsTeaserProps> = ({ tools }) => {
  const { heading, link, domainLabel, preamble, description } = tools;
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation("common");
  return (
    <div className="h-full">
      <div
        className="group flex h-full flex-col justify-between gap-lg bg-white p-lg focus-within:outline-dashed 
      focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-primary"
      >
        <div className="flex flex-col-reverse gap-sm">
          <Button
            variant="plain"
            size="sm"
            icon={Info}
            iconPosition="left"
            onClick={(e) => {
              e.preventDefault();
              setShowModal(true);
            }}
            label={t("preview")}
            className="focus--none"
            aria-label={`${t("preview")} ${t("support-tools")} - ${heading}`}
          />
          <div className="flex flex-col gap-sm">
            <Link
              href={link}
              className="focus--none flex flex-col gap-sm no-underline focus-visible:underline"
            >
              <div className="flex items-center justify-between [&_svg_path]:fill-red-400 group-hover:[&_svg_path]:fill-green-600">
                <span
                  className={`px-sm py-[2px] text-sm ${
                    !isExternalLink(link)
                      ? "bg-brown-800  text-white"
                      : "bg-brown-200 text-brown-900"
                  }`}
                >
                  {domainLabel}
                </span>
                {isExternalLink(link) ? (
                  <>
                    <ExternalLinkIcon className="translate-x-0 transform transition-transform duration-500 group-hover:translate-x-1/3" />
                    <span className="sr-only">
                      {t("common|open-in-new-tab")}
                    </span>
                  </>
                ) : (
                  <InternalLinkIcon className="translate-x-0 transform transition-transform duration-500 group-hover:translate-x-1/3" />
                )}
              </div>
              <div>
                <Heading
                  className="text-green-600 group-hover:underline"
                  level={3}
                  size={"xs"}
                >
                  {heading}
                </Heading>
              </div>
            </Link>
            <p className="line-clamp-3 text-sm">{preamble}</p>
          </div>
        </div>
      </div>
      <Modal
        heading={heading}
        closeBtn={t("close")}
        description={description}
        type="tools"
        text={preamble}
        modalOpen={showModal}
        setModalOpen={setShowModal}
        confirmBtn={t("to-page")}
        href={link}
      />
    </div>
  );
};
