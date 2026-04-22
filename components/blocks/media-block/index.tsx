"use client";

import Link from "next/link";
import { FC } from "react";

import DocumentPdfIcon from "@/assets/icons/document-pdf.svg";
import DocumentIcon from "@/assets/icons/document.svg";
import { CustomImage } from "@/components/custom-image";
import { Heading } from "@/components/typography/heading";
import { MediaFragment } from "@/graphql/__generated__/operations";
import { useMediaBaseUrl } from "@/providers/media-url-provider";
import { isExternalLink, checkLang } from "@/utilities";

export const MediaBlock: FC<MediaFragment> = ({
  heading,
  description,
  media,
}) => {
  const mediaBaseUrl = useMediaBaseUrl();

  const getUrl = () => {
    if (media.screen9 || isExternalLink(media.url)) {
      return media.url;
    }
    return (mediaBaseUrl || "") + `${media.url}`;
  };

  const url = getUrl();
  const isPDF = url?.includes(".pdf");

  const renderMedia = () => {
    switch (media.__typename) {
      case "dataportal_Digg_Image":
        if (!url || url === "") {
          return null;
        }
        return (
          <figure className="border-b border-brown-200 pb-sm">
            <CustomImage
              image={media}
              width={640}
              className="pb-sm"
              sizes="(max-width: 640px) 80vw, (max-width: 1200px) 60vw, (max-width: 1920px) 30vw, 25vw"
            />
            {description && (
              <figcaption className="text-brown-600">
                {checkLang(description as string)}
              </figcaption>
            )}
          </figure>
        );
      case "dataportal_Digg_File":
        return (
          <Link
            href={url}
            className="text-lg text-brown-600 underline-offset-[6px] hover:no-underline"
          >
            {media.description || url}
            {isPDF ? (
              <DocumentPdfIcon className="ml-xs inline-block" />
            ) : (
              <DocumentIcon className="ml-xs inline-block" />
            )}
          </Link>
        );
    }
  };

  return (
    <div className="max-w-md">
      {heading && (
        <Heading level={2} size={"md"} className="mb-md md:mb-lg">
          {heading}
        </Heading>
      )}
      {renderMedia()}
    </div>
  );
};
