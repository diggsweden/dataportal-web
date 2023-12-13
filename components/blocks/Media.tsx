import { MediaFragment as IMedia } from "../../graphql/__generated__/operations";
import { FileLink } from "../Navigation";
import { checkLang } from "../../utilities";
import { Video } from "../Video";
import env from "@beam-australia/react-env";
import { MediaBaseFragment } from "../../graphql/__generated__/operations";
import { isExternalLink } from "../../utilities";
import { CustomImage } from "../Image";

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

const renderMedia = (media: IMedia["media"], mediaDescription?: string) => {
  const { description } = media;
  const url = handleUrl(media);
  switch (media.__typename) {
    case "dataportal_Digg_Image":
      if (!url || url === "") {
        return null;
      }
      return (
        <figure>
          <CustomImage
            image={media}
            style="responsive"
            sizes={{ mobile: "100vw", tablet: "100vw", desktop: "50vw" }}
          />
          {mediaDescription && (
            <figcaption>
              <p className="media-description">{checkLang(mediaDescription)}</p>
            </figcaption>
          )}
        </figure>
      );
    case "dataportal_Digg_Video":
      return (
        <figure role="group">
          <Video {...media} />
          {mediaDescription && (
            <figcaption>
              <p className="media-description">{checkLang(mediaDescription)}</p>
            </figcaption>
          )}
        </figure>
      );

    case "dataportal_Digg_File":
      return <FileLink link={url}>{description || url}</FileLink>;
  }
};

export const Media: React.FC<IMedia> = ({ heading, description, media }) => {
  return (
    <div>
      {heading && <h2>{checkLang(heading)}</h2>}
      {renderMedia(media, description as string)}
    </div>
  );
};
