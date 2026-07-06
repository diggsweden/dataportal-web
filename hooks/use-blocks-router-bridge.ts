import { useRouter } from "next/router";
import { useEffect } from "react";

declare global {
  interface Window {
    __entryscape_blocks_click?: (href: string, event?: MouseEvent) => boolean;
  }
}

/**
 * Bridge between EntryScape Blocks link clicks and the Next.js router.
 *
 * Contract with Blocks:
 *   - Blocks calls window.__entryscape_blocks_click(href, event) when a
 *     link rendered by the link block is clicked.
 *   - Return value:
 *       true  → handler took over navigation (and called preventDefault);
 *               Blocks must not navigate.
 *       false → handler declined; Blocks falls back to its default
 *               behaviour (browser navigation).
 */
export const useBlocksRouterBridge = () => {
  const router = useRouter();

  useEffect(() => {
    const handler = (href: string, event?: MouseEvent): boolean => {
      if (
        event &&
        (event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button === 1)
      ) {
        return false;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return false;
      }

      if (url.origin !== window.location.origin) return false;

      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash
      ) {
        return false;
      }

      event?.preventDefault();
      router.push(`${url.pathname}${url.search}${url.hash}`);
      return true;
    };

    window.__entryscape_blocks_click = handler;
    return () => {
      if (window.__entryscape_blocks_click === handler) {
        delete window.__entryscape_blocks_click;
      }
    };
  }, [router]);
};
