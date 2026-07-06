"use client";

import { type FC, useEffect, useState } from "react";

const SCREEN9_PLAYER_JS = "https://cdn.screen9.com/players/amber-player.js";
const SCREEN9_PLAYER_CSS = "https://cdn.screen9.com/players/amber-player.css";

function useStylesheet(href: string) {
  useEffect(() => {
    if (!href || document.querySelector(`link[href="${href}"]`)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, [href]);
}

export const VideoPlayer: FC<{ video_id: string }> = ({ video_id }) => {
  const containerid = `video_screen9_${video_id}`;
  let player: { dispose(): void } | undefined;

  useStylesheet(SCREEN9_PLAYER_CSS);

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

        const setAttributeFromEvent = (event: Event) => {
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

      const setStateFromEvent = (event: Event) => {
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

  const status = useScript(SCREEN9_PLAYER_JS);

  useEffect(() => {
    if (status === "ready" && video_id) {
      const options = {
        mediaid: video_id,
        containerid,
        token: process.env.NEXT_PUBLIC_SCREEN9_API_TOKEN,
      };
      if (window.screen9) {
        player = new window.screen9.Player(options);
      }
    }
    return () => {
      if (player) {
        player.dispose();
        const script = document.querySelector(
          `script[src="${SCREEN9_PLAYER_JS}"]`,
        );
        if (script) {
          script.remove();
        }
      }
    };
  }, [status]);

  return (
    <video id={containerid} className="video-js vjs-fluid" controls playsInline>
      <track kind="captions" />
      Video
    </video>
  );
};
