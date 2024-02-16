import React, { FC, useState } from "react";
import Info from "@/assets/icons/stod-verktyg.svg";
import { ToolDataFragment as Tool } from "@/graphql/__generated__/operations";
import { Heading } from "@/components/global/Typography/Heading";
import Link from "next/link";
import { Modal } from "@/components/global/Modal";
import { isExternalLink } from "@/utilities";
import InternalLinkIcon from "@/assets/icons/arrowRight.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";

interface ToolsTeaserProps {
  tools: Tool;
}

export const Toolteaser: FC<ToolsTeaserProps> = ({ tools }) => {
  const { heading, link, domainLabel, preamble, description } = tools;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="h-full">
      <Link
        href={link}
        className="group flex h-full flex-col justify-between gap-lg bg-white p-lg no-underline"
      >
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between [&_svg_path]:fill-red-400 group-hover:[&_svg_path]:fill-green-600">
            <span
              className={`px-sm py-[2px] text-sm text-white ${
                !isExternalLink(link)
                  ? "bg-brown-800"
                  : "bg-brown-200 text-brownOpaque5"
              }`}
            >
              {domainLabel}
            </span>
            {isExternalLink(link) ? (
              <ExternalLinkIcon className="translate-x-0 transform transition-transform duration-500 group-hover:translate-x-1/3" />
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
          <p className="text-sm">{preamble}</p>
        </div>
        <span
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
          className="text-xs button button--small button--plain focus--none px-xs hover:!bg-brown-200 group-hover:bg-transparent"
        >
          <Info /> Förhandsgrandska
        </span>
      </Link>
      <Modal
        heading={heading}
        closeBtn={"Stäng"}
        description={description}
        text={preamble}
        modalOpen={showModal}
        setModalOpen={setShowModal}
        confirmBtn={"Till sidan"}
        href={link}
      />
    </div>
  );
};
