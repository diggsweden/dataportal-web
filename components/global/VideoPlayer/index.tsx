import React, { useEffect, useState } from "react";

export const VideoPlayer: React.FC<{ video_id: string }> = ({ video_id }) => {
  const containerid = `video_screen9_${video_id}`;
  let player: any;

  const useScript = (src: string) => {
    const [status, setStatus] = useState(src ? "loading" : "idle");

    useEffect(() => {
      if (!src) {
        setStatus("idle");
        return;
      }

      const existingScript = document.querySelector(`script[src="${src}"]`);

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.setAttribute("data-status", "loading");
        document.body.appendChild(script);

        const setAttributeFromEvent = (event: any) => {
          script.setAttribute(
            "data-status",
            event.type === "load" ? "ready" : "error",
          );
        };

        script.addEventListener("load", setAttributeFromEvent);
        script.addEventListener("error", setAttributeFromEvent);
      } else {
        setStatus(existingScript.getAttribute("data-status") || "error");
      }

      const setStateFromEvent = (event: any) => {
        setStatus(event.type === "load" ? "ready" : "error");
      };

      const script =
        existingScript || document.querySelector(`script[src="${src}"]`);
      script?.addEventListener("load", setStateFromEvent);
      script?.addEventListener("error", setStateFromEvent);

      return () => {
        script?.removeEventListener("load", setStateFromEvent);
        script?.removeEventListener("error", setStateFromEvent);
      };
    }, [src]);

    return status;
  };

  const status = useScript("https://cdn.screen9.com/players/amber-player.js");

  useEffect(() => {
    if (status === "ready" && video_id) {
      const options = {
        mediaid: video_id,
        containerid,
        token: process.env.NEXT_PUBLIC_SCREEN9_API_TOKEN,
      };
      player = new (window as any).screen9.Player(options);
    }
    return () => {
      if (player) {
        player.dispose();
        const script = document.querySelector(
          `script[src="https://cdn.screen9.com/players/amber-player.js"]`,
        );
        script && script.remove();
      }
    };
  }, [status]);

  return (
    <video id={containerid} className="video-js vjs-fluid" controls playsInline>
      Video
    </video>
  );
};
