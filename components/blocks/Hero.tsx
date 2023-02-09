import React from "react";
import Image from "next/image";
import { checkLang } from "../../utilities/checkLang";
import { renderMarkdown } from "../Renderers";
import { Heading, Container } from "@digg/design-system";
import { handleUrl } from "./Media";
import {
  Media_media_dataportal_Digg_Image,
  Media_media_dataportal_Digg_Video,
} from "../../graphql/__generated__/Media";
import { Text_text } from "../../graphql/__generated__/Text";

type HeroMedia =
  | Media_media_dataportal_Digg_Image
  | Media_media_dataportal_Digg_Video;

interface HeroProps {
  media: HeroMedia;
  heading?: string;
  heroText?: Text_text;
}

const renderMedia = (media: HeroMedia) => {
  const { alt, mime } = media;
  const url = handleUrl(media);

  switch (media.__typename) {
    case "dataportal_Digg_Image":
      return (
        <div>
          <Image
            style={{ width: "100%" }}
            src={url}
            fill
            alt={alt || ""}
            priority={true}
          />
        </div>
      );
    case "dataportal_Digg_Video":
      return (
        <video controls>
          <source src={`${url}`} type={mime} />
        </video>
      );
  }
};

export const Hero: React.FC<HeroProps> = ({ media, heading, heroText }) => {
  return (
    <div className={`hero`}>
      <div className="hero--image">{renderMedia(media)}</div>
      {(heading || heroText) && (
        <Container>
          {heading && (
            <Heading level={1} size="3xl" weight="light" color="pinkPop">
              {checkLang(heading)}
            </Heading>
          )}
          <div className="hero--content">
            {heroText && (
              <div className="text-lg preamble">
                {heroText.markdown && renderMarkdown(heroText.markdown)}
              </div>
            )}
          </div>
        </Container>
      )}
    </div>
  );
};
