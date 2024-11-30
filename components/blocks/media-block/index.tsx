import env from "@beam-australia/react-env";
import Link from "next/link";
import { FC } from "react";

import DocumentIcon from "@/assets/icons/document.svg";
import PDFIcon from "@/assets/icons/PDF.svg";
import { CustomImage } from "@/components/custom-image";
import { Heading } from "@/components/typography/heading";
import {
  MediaBaseFragment,
  MediaFragment,
} from "@/graphql/__generated__/operations";
import { isExternalLink, checkLang } from "@/utilities";

export const handleUrl = ({ screen9, url, __typename }: MediaBaseFragment) => {
  const documentBaseUrl = env("DOCUMENT_BASE_URL");
  const mediaBaseUrl = env("MEDIA_BASE_URL");

  if (screen9 || isExternalLink(url)) {
    return url;
  } else if (__typename === "dataportal_Digg_File") {
    return (documentBaseUrl || mediaBaseUrl || "") + `${url}`;
  }

  return (mediaBaseUrl || "") + `${url}`;
};

const renderMedia = (
  media: MediaFragment["media"],
  mediaDescription?: string,
) => {
  const { description } = media;
  const url = handleUrl(media);
  const isPDF = url?.includes(".pdf");

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
          {mediaDescription && (
            <figcaption className="text-brown-600">
              {checkLang(mediaDescription)}
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
          {description || url}
          {isPDF ? (
            <PDFIcon className="ml-xs inline-block" />
          ) : (
            <DocumentIcon className="ml-xs inline-block" />
          )}
        </Link>
      );
  }
};

export const MediaBlock: FC<MediaFragment> = ({
  heading,
  description,
  media,
}) => {
  return (
    <div className="max-w-md">
      {heading && (
        <Heading level={2} size={"md"} className="mb-md md:mb-lg">
          {heading}
        </Heading>
      )}
      {renderMedia(media, description as string)}
    </div>
  );
};
