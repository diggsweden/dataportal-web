import useTranslation from "next-translate/useTranslation";
import React, { FC } from "react";
import { CustomImage } from "@/components/global/CustomImage";
import ArrowIcon from "@/assets/icons/arrowRight.svg";

import {
  ContainerDataFragment as IContainer,
  PublicationDataFragment as Publication,
} from "@/graphql/__generated__/operations";
import Heading from "@/components/global/Typography/Heading";
import Link from "next/link";

type PublicationTeaser = {
  publication: Publication | IContainer;
};

export const PublicationTeaser: FC<PublicationTeaser> = ({ publication }) => {
  const { createdAt, tags, heading, slug, image } = publication;
  const { t } = useTranslation();
  const tag = tags[0].value;

  function getUrlWithTag(tag: string) {
    const cleanString = tag
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return cleanString + slug;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("sv", {
      year: "numeric",
      day: "numeric",
      month: "long",
    });
  }

  return (
    <Link
      href={getUrlWithTag(tag)}
      className="group flex h-full flex-col justify-between no-underline"
    >
      <div>
        <CustomImage
          image={image}
          className="h-[184px] w-full object-cover md:h-[240px] lg:h-[184px]"
        />
        <div className="px-md pt-lg text-sm text-textPrimary">
          <span className="text-textSecondary">
            {tag ? tag : t("pages|listpage$fallback-tag")} |{" "}
            {formatDate(createdAt)}
          </span>
          <Heading className="pb-md pt-sm" level={3} size={"sm"}>
            {heading}
          </Heading>
        </div>
      </div>

      <span className="button button--small button--plain">
        Läs mer <ArrowIcon height={16} width={16} viewBox="0 0 24 24" />
      </span>
    </Link>
  );
};
