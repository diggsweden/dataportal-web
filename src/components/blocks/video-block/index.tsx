import type { FC } from "react";

import { Heading } from "@/components/typography/heading";
import { VideoPlayer } from "@/components/video-player";
import { type FragmentType, getFragmentData, graphql } from "@/graphql/gql";
import { checkLang } from "@/utilities";

export const VideoFragment = graphql(`
  fragment Video on dataportal_Digg_Video {
    heading
    description
    video_id
  }
`);

export const VideoBlock: FC<{ block: FragmentType<typeof VideoFragment> }> = ({
  block,
}) => {
  const { heading, description, video_id } = getFragmentData(
    VideoFragment,
    block,
  );

  return (
    <div className="max-w-md">
      {heading && (
        <Heading level={2} size={"md"} className="mb-md md:mb-lg">
          {heading}
        </Heading>
      )}

      <figure className="border-b border-brown-200 pb-sm">
        <div className="pb-sm">
          <VideoPlayer video_id={video_id ?? ""} />
        </div>
        {description && (
          <figcaption className="text-brown-600">
            {checkLang(description)}
          </figcaption>
        )}
      </figure>
    </div>
  );
};
