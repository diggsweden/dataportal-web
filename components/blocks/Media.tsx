import {
  Media as IMedia,
  Media_media,
} from "../../graphql/__generated__/Media";
import { FileLink } from "../Navigation";
import { checkLang } from "../../utilities/checkLang";
import { Heading } from "@digg/design-system";
import { Video } from "../Video";
import env from "@beam-australia/react-env";
import { MediaBase } from "../../graphql/__generated__/MediaBase";
import { isExternalLink } from "../../utilities/checkers";
import { CustomImage } from "../Image";

export const handleUrl = ({ screen9, url }: MediaBase) => {
  if (screen9 || isExternalLink(url)) {
    return url;
  }

  return (env("MEDIA_BASE_URL") || "") + `${url}`;
};

const renderMedia = (media: Media_media, mediaDescription?: string) => {
  const { description } = media;
  const url = handleUrl(media);
  switch (media.__typename) {
    case "dataportal_Digg_Image":
      if (!url || url === "") {
        return null;
      }
      return (
        <figure>
          <CustomImage image={media} style="responsive" sizes={{mobile: "100vw", tablet: "100vw", desktop: "50vw"}} />
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
    <div className="media">
      {heading && (
        <Heading level={2} className="media-heading">
          {checkLang(heading)}
        </Heading>
      )}
      {renderMedia(media, description as string)}
    </div>
  );
};
