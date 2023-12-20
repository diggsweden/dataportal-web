import useTranslation from "next-translate/useTranslation";
import React from "react";
import { CustomImage } from "@/components/global/CustomImage";
import LinkArrow from "@/assets/icons/linkArrow.svg";
import { ButtonLink } from "@/components/global/Button";
import {
  PublicationDataFragment as Publication,
  ContainerDataFragment as IContainer,
} from "@/graphql/__generated__/operations";

type PublicationTeaser = {
  publication: Publication | IContainer;
};

export const PublicationTeaser: React.FC<PublicationTeaser> = ({
  publication,
}) => {
  const { createdAt, tags, heading, slug, image } = publication;
  const { t } = useTranslation();
  const href = tags[0].value;

  function getHref(tag: string) {
    const cleanString = tag.toLowerCase().replace(/\s/g, "");
    switch (cleanString) {
      case "nyhet":
        return `nyheter${slug}`;
        break;
      case "godaexempel":
        return `goda-exempel${slug}`;
        break;
      default:
        return "";
    }
  }

  function getDate(date: string) {
    const parsedDate = new Date(date);
    return parsedDate.getDay();
  }

  return (
    <article className="flex h-full flex-col justify-between">
      <div>
        <CustomImage
          image={image}
          className="h-[184px] w-full object-cover md:h-[240px] lg:h-[184px]"
        />
        <div className="px-md pt-lg text-sm text-brown-600">
          <span>
            {getDate(createdAt)} Juni 2023 |{" "}
            {tags[0]?.value ? tags[0].value : t("pages|listpage$fallback-tag")}
          </span>
          <h3 className="pb-md pt-sm text-xl">{heading}</h3>
        </div>
      </div>
      <ButtonLink
        href={getHref(href)}
        variant="plain"
        size="sm"
        label="Läs mer"
        icon={LinkArrow}
        iconPosition="right"
      />
    </article>
  );
};
