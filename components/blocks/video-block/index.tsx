import { VideoFragment } from "@/graphql/__generated__/operations";
import { checkLang } from "@/utilities";
import { Heading } from "@/components/typography/heading";
import { VideoPlayer } from "@/components/video-player";

export const VideoBlock: React.FC<VideoFragment> = ({
  heading,
  description,
  video_id,
}) => {
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
