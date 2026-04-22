import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { trackPageView } from "./track";

/**
 * Fires a Matomo page view on every pathname change. Router-agnostic — uses
 * `next/navigation`'s `usePathname()` which works under both Pages and App
 * routers, so this hook survives the App Router migration unchanged.
 */
export function usePageViews(enabled: boolean) {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || !pathname) return;
    trackPageView(pathname);
  }, [enabled, pathname]);
}
