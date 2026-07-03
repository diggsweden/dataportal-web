import env from "@beam-australia/react-env";
import type { ResultOf } from "@graphql-typed-document-node/core";
import type { FC } from "react";
import DocumentIcon from "@/assets/icons/document.svg";
import DocumentPdfIcon from "@/assets/icons/document-pdf.svg";
import { CustomImage, ImageFragment } from "@/components/custom-image";
import { AppLink } from "@/components/link";
import { Heading } from "@/components/typography/heading";
import { MediaTypeFragment } from "@/graphql/fragments";
import { type FragmentType, getFragmentData, graphql } from "@/graphql/gql";
import { checkLang, isExternalLink } from "@/utilities";

export const MediaFragment = graphql(`
  fragment Media on dataportal_Digg_Media {
    heading
    description
    media {
      ...MediaType
    }
  }
`);

interface MediaUrlParts {
  screen9?: unknown;
  url: string;
  __typename: string;
}

export const handleUrl = ({ screen9, url, __typename }: MediaUrlParts) => {
  const documentBaseUrl = env("DOCUMENT_BASE_URL");
  const mediaBaseUrl = env("MEDIA_BASE_URL");

  if (screen9 || isExternalLink(url)) {
    return url;
  } else if (__typename === "dataportal_Digg_File") {
    return `${documentBaseUrl || mediaBaseUrl || ""}${url}`;
  }

  return `${mediaBaseUrl || ""}${url}`;
};

const renderMedia = (
  media: ResultOf<typeof MediaTypeFragment>,
  mediaDescription?: string,
) => {
  switch (media.__typename) {
    case "dataportal_Digg_Image": {
      const image = getFragmentData(ImageFragment, media);
      const url = handleUrl(image);
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
    }
    case "dataportal_Digg_File": {
      const url = handleUrl(media);
      const isPDF = url?.includes(".pdf");
      return (
        <AppLink
          href={url}
          className="text-lg text-brown-600 underline-offset-[6px] hover:no-underline"
        >
          {media.description || url}
          {isPDF ? (
            <DocumentPdfIcon className="ml-xs inline-block" />
          ) : (
            <DocumentIcon className="ml-xs inline-block" />
          )}
        </AppLink>
      );
    }
  }
};

export const MediaBlock: FC<{ block: FragmentType<typeof MediaFragment> }> = ({
  block,
}) => {
  const { heading, description, media } = getFragmentData(MediaFragment, block);
  const mediaData = getFragmentData(MediaTypeFragment, media);

  return (
    <div className="max-w-md">
      {heading && (
        <Heading level={2} size={"md"} className="mb-md md:mb-lg">
          {heading}
        </Heading>
      )}
      {renderMedia(mediaData, description as string)}
    </div>
  );
};
