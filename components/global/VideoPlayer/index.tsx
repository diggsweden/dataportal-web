import { FC, useEffect, useState } from "react";
import { MediaType_Dataportal_Digg_Video_Fragment as IVideo } from "@/graphql/__generated__/operations";
import ReactPlayer from "react-player";
import PlayIcon from "@/assets/icons/play.svg";

interface VideoProps {
  media: IVideo;
  url: string;
}

export const VideoPlayer: FC<VideoProps> = ({ media, url }) => {
  const [windowLoaded, setWindowLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [urlState, setUrlState] = useState(`${url}#t=10`);

  const thumbnail = media.screen9.meta.poster.thumbnail;

  useEffect(() => {
    if (typeof window !== undefined) {
      setWindowLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      setUrlState(`${url}#t=0`);
    }
  }, [isPlaying]);

  return (
    <div
      className={`group relative ${
        isPlaying ? "cursor-default" : "cursor-pointer"
      }`}
    >
      {windowLoaded && (
        <>
          <ReactPlayer
            id={media.screen9.id}
            url={thumbnail ? url : urlState}
            controls={isPlaying}
            playing={isPlaying}
            playsinline={true}
            onPlay={() => !thumbnail && setUrlState(`${url}#t=0`)}
            light={thumbnail}
          />
          <button
            className={`absolute left-1/2 top-1/2 -translate-x-1/4 -translate-y-1/2 cursor-pointer rounded-full p-xs group-hover:bg-whiteOpaque5 ${
              isPlaying ? "hidden group-hover:bg-none" : "block"
            }}`}
            onClick={() => {
              setIsPlaying(true);
              if (!thumbnail) {
                setUrlState(`${url}#t=0`);
              }
            }}
          >
            <PlayIcon className={`${isPlaying ? "hidden" : "block"}`} />
          </button>
        </>
      )}
    </div>
  );
};
