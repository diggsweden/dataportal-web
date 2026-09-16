import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface UseActiveHeadingOptions {
  /** Skip tracking — the sticky nav only tracks on large screens. */
  enabled?: boolean;
  /** Suspends updates while a programmatic scroll runs. */
  paused?: RefObject<boolean>;
}

/**
 * Current section while scrolling: first heading fully on screen, else the last
 * scrolled past. Resolved with `getElementById`, so ids like `4.1` work.
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

      // Ids are in document order, so anything past a below-fold heading is too.
      let scrolledPast: string | null = null;

      for (const id of idsRef.current) {
        const element = document.getElementById(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top < 0) {
          scrolledPast = id;
          continue;
        }
        if (rect.bottom <= window.innerHeight) {
          setActiveId(id);
          return;
        }
        break;
      }

      if (scrolledPast) setActiveId(scrolledPast);
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
