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
    <div>
      <Link
        href={link}
        className="group flex h-full flex-col justify-between gap-lg bg-white p-lg no-underline"
      >
        <div className="flex justify-between [&_svg_path]:fill-red-400">
          <span className="bg-brown-800 px-md py-xs text-sm text-white">
            {domainLabel}
          </span>
          {isExternalLink(link) ? <ExternalLinkIcon /> : <InternalLinkIcon />}
        </div>
        <div>
          <Heading
            className="text-green-600 group-hover:underline"
            level={3}
            size={"sm"}
          >
            {heading}
          </Heading>
        </div>
        <p>{preamble}</p>
        <span
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
          className={`${
            showModal ? "no-hover" : ""
          } button button--small button--plain focus--none z-50 px-xs hover:!bg-brown-200 group-hover:bg-transparent`}
        >
          <Info /> Förhandsgrandska
        </span>
      </Link>
      <Modal
        heading={heading}
        closeBtn={"stäng"}
        description={description}
        text={preamble}
        modalOpen={showModal}
        setModalOpen={setShowModal}
        confirmBtn={"hej"}
      />
    </div>
  );
};
