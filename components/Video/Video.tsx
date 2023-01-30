import env from "@beam-australia/react-env";
import React, { useEffect } from "react";
import { Media_media_dataportal_Digg_Video as IVideo } from "../../graphql/__generated__/Media";
import { useScript } from "../../hooks/useScript";

interface VideoProps extends IVideo {}

export const Video: React.FC<VideoProps> = ({ screen9 }) => {
  const status = useScript("https://cdn.screen9.com/players/amber-player.js");
  const containerid = `video_screen9_${screen9.id}`;

  useEffect(() => {
    if (status === "ready" && screen9?.id) {
      const options = {
        mediaid: screen9.id,
        containerid,
        token: env("SCREEN9_API_TOKEN"),
      };

      new (window as any).screen9.Player(options);
    }
  }, [status]);

  return (
    <video id={containerid} className="video-js vjs-fluid" controls playsInline>
      Video
    </video>
  );
};
