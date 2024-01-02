import { MediaFragment } from "@/graphql/__generated__/operations";
import { checkLang } from "@/utilities";
import env from "@beam-australia/react-env";
import { MediaBaseFragment } from "@/graphql/__generated__/operations";
import { isExternalLink } from "@/utilities";
import { CustomImage } from "@/components/global/CustomImage";
import { Heading } from "@/components/global/Typography/Heading";
import Link from "next/link";
import DownloadIcon from "@/assets/icons/download.svg";
import { VideoPlayer } from "@/components/global/VideoPlayer";

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

  switch (media.__typename) {
    case "dataportal_Digg_Image":
      if (!url || url === "") {
        return null;
      }
      return (
        <figure>
          <CustomImage image={media} className="pb-sm" />
          {mediaDescription && (
            <figcaption className="text-brown-600">
              {checkLang(mediaDescription)}
            </figcaption>
          )}
        </figure>
      );
    case "dataportal_Digg_Video":
      return (
        <figure>
          <div className="pb-sm">
            <VideoPlayer media={media} url={url} />
          </div>
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
          target="_blank"
        >
          {description || url}
          <DownloadIcon className="mb-[2px] ml-xs inline-block" />
        </Link>
      );
  }
};

export const MediaBlock: React.FC<MediaFragment> = ({
  heading,
  description,
  media,
}) => {
  return (
    <div className="border-b border-brown-200 pb-sm">
      {heading && (
        <Heading level={2} size={"md"}>
          {heading}
        </Heading>
      )}
      {renderMedia(media, description as string)}
    </div>
  );
};
