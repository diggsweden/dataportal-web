import { FC, useState } from "react";
import { MediaType_Dataportal_Digg_Video_Fragment as IVideo } from "@/graphql/__generated__/operations";

interface VideoProps {
  media: IVideo;
  url: string;
}

export const VideoPlayer: FC<VideoProps> = ({ media, url }) => {
  const [visibleControlls, SetVisibleControlls] = useState(false);

  return (
    <video
      controls={visibleControlls}
      onMouseOver={() => SetVisibleControlls(true)}
      onMouseLeave={() => SetVisibleControlls(false)}
    >
      <source src={url} type={media.mime} />
      Video
    </video>
  );
};
