"use client";

import { useTranslations } from "next-intl";
import { type FC, useContext } from "react";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import { CustomImage, mediaTypeToImage } from "@/components/custom-image";
import { AppLink } from "@/components/link";
import { Heading } from "@/components/typography/heading";
import { type FragmentType, getFragmentData, graphql } from "@/graphql/gql";
import { SettingsContext } from "@/providers/settings-provider";
import { isExternalLink } from "@/utilities";

export const LinkFragment = graphql(`
  fragment Link on dataportal_Digg_Link {
    slug
    title
    description
    linktype
    customPreamble
    showPreamble
    image {
      ...MediaType
    }
  }
`);

export interface PromoProps {
  link: FragmentType<typeof LinkFragment>;
  heading?: string | null;
}

export const Promo: FC<PromoProps> = ({ link, heading }) => {
  const { slug, title, customPreamble, image, description, showPreamble } =
    getFragmentData(LinkFragment, link);
  const t = useTranslations();
  const { iconSize } = useContext(SettingsContext);

  const ingress = showPreamble
    ? customPreamble
      ? customPreamble
      : description
    : null;

  return (
    <>
      {image && (
        <CustomImage
          image={mediaTypeToImage(image)}
          width={384}
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="h-full max-h-[9.5rem] w-full object-cover"
        />
      )}
      <div className="flex h-full flex-col p-lg">
        <AppLink
          href={slug}
          data-tracking-name="promo"
          className="before:focus--outline before:focus--out before:focus--primary focus--none no-underline before:absolute before:inset-none"
        >
          <Heading
            level={heading ? 3 : 2}
            size="sm"
            className={ingress ? "mb-sm" : "mb-lg"}
          >
            {title}
          </Heading>
        </AppLink>
        {ingress && (
          <p className="mb-lg line-clamp-3 text-brown-600">{ingress}</p>
        )}
        <span className="button button--small button--primary focus--none mt-auto group-focus-within:bg-brown-800">
          {t("common.read-more")}
          {isExternalLink(slug) ? (
            <>
              <ExternalLinkIcon
                height={iconSize}
                width={iconSize}
                viewBox="0 0 24 24"
                className="flex-shrink-0"
              />
              <span className="sr-only">{t("common.open-in-new-tab")}</span>
            </>
          ) : (
            <ArrowRightIcon
              height={iconSize}
              width={iconSize}
              viewBox="0 0 24 24"
              className="flex-shrink-0"
            />
          )}
        </span>
      </div>
    </>
  );
};
