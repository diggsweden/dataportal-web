import useTranslation from "next-translate/useTranslation";
import React, { FC } from "react";
import { CustomImage } from "@/components/global/CustomImage";
import ArrowIcon from "@/assets/icons/arrowRight.svg";
import {
  ContainerDataFragment as IContainer,
  PublicationDataFragment as Publication,
} from "@/graphql/__generated__/operations";
import { Heading } from "@/components/global/Typography/Heading";
import Link from "next/link";
import { formatDate } from "@/utilities/dateHelper";

interface PublicationTeaserProps {
  publication: Publication | IContainer;
}

export const PublicationTeaser: FC<PublicationTeaserProps> = ({
  publication,
}) => {
  const { createdAt, tags, heading, slug, image } = publication;
  const { t, lang } = useTranslation();
  const tag = tags[0].value;

  function getUrlWithTag(tag: string) {
    const cleanString = tag
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return cleanString === "nyhet"
      ? "/nyheter" + slug
      : "/" + cleanString + slug;
  }

  return (
    <Link
      href={getUrlWithTag(tag)}
      className="group flex h-full flex-col justify-between no-underline"
    >
      <div>
        <CustomImage
          image={image}
          height={240}
          width={384}
          className="h-[184px] w-full object-cover md:h-[240px] lg:h-[184px]"
        />
        <div className="px-md pt-lg text-sm text-textPrimary">
          <span className="text-textSecondary">
            {tag ? tag : t("pages|listpage$fallback-tag")} |{" "}
            {formatDate(lang, createdAt)}
          </span>
          <Heading className="pb-md pt-sm" level={3} size={"sm"}>
            {heading}
          </Heading>
        </div>
      </div>

      <span className="button button--small button--plain focus--none">
        Läs mer <ArrowIcon height={16} width={16} viewBox="0 0 24 24" />
      </span>
    </Link>
  );
};
