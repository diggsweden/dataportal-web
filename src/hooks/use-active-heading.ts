import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

/** Current only while the heading is fully in the viewport. */
const isInView = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
};

interface UseActiveHeadingOptions {
  /** Skip tracking — the sticky nav only tracks on large screens. */
  enabled?: boolean;
  /** Suspends updates while a programmatic scroll runs. */
  paused?: RefObject<boolean>;
}

/**
 * Tracks which of `ids` is the current section while scrolling; the last match
 * stands when nothing is fully visible. Ids resolve through `getElementById`
 * every pass, so targets may appear later and ids like `4.1` still work.
 */
export const useActiveHeading = (
  ids: string[],
  { enabled = true, paused }: UseActiveHeadingOptions = {},
): [string | null, Dispatch<SetStateAction<string | null>>] => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // `ids` is rebuilt inline each render, so key the effect on contents.
  const idsRef = useRef(ids);
  idsRef.current = ids;
  const idsKey = ids.join(" ");

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;

    const scan = () => {
      frame = 0;
      if (paused?.current) return;

      for (const id of idsRef.current) {
        const element = document.getElementById(id);
        if (element && isInView(element)) {
          setActiveId(id);
          return;
        }
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(scan);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, idsKey, paused]);

  return [activeId, setActiveId];
};
