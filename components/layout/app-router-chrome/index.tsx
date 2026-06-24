"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { type FC, type ReactNode, useEffect } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Sidebar } from "@/components/navigation/sidebar";
import {
  SkipToContent,
  skipToElement,
} from "@/components/navigation/skip-to-content";
import { CookieBanner } from "@/features/cookie-banner";
import type {
  MenuLinkFragment,
  MenuLinkIconFragment,
  NavigationDataFragment,
} from "@/graphql/__generated__/operations";
import { useLayoutState } from "@/providers/layout-state-provider";
import { defaultSettings } from "@/providers/settings-provider";
import type { SubLink, SubLinkFooter } from "@/types/global";

interface AppRouterChromeProps {
  children: ReactNode;
  /**
   * Navigation payload for the current locale, resolved server-side in
   * `app/[locale]/layout.tsx`. `null` when the GraphQL fetch failed — the
   * Header / Footer / Sidebar then degrade to empty menus.
   */
  navigationData: NavigationDataFragment | null;
}

/**
 * App Router chrome — the shell every `app/[locale]/.../page.tsx` renders
 * inside. Client-side because it reads interactive layout state (sidebar,
 * cookie-settings dialog, breadcrumbs) and wires the skip-link + hash-scroll
 * behaviour.
 *
 * Differences vs. the Pages Router chrome in `pages/_app.tsx`:
 *  - No `<Hero>`: Pages Router piped hero content through `LayoutState`
 *    because layouts couldn't access page data; App Router pages import
 *    `<Hero>` directly and place it themselves.
 *  - No `<MetaData>`: per-page `generateMetadata()` replaces it.
 *  - No `resolvePage(pageProps)`: `pageProps` is a Pages Router concept.
 *  - No Settings / Matomo / LocalStore providers: those live in
 *    `AppRouterProviders` one level up, so this file only renders chrome.
 *
 * `pages/_app.tsx` keeps rendering the legacy chrome for any route still
 * served by the Pages Router — the two chromes never collide on a single
 * request.
 */
export const AppRouterChrome: FC<AppRouterChromeProps> = ({
  children,
  navigationData,
}) => {
  const pathname = usePathname();
  const t = useTranslations();
  const {
    settingsOpen,
    setSettingsOpen,
    openSideBar,
    setOpenSideBar,
    breadcrumbState,
  } = useLayoutState();

  useEffect(() => {
    // On navigation to a URL containing `#hash`, scroll the target into
    // view + focus it for AT users. Pages Router reads `router.asPath`
    // (which keeps fragment + query); App Router's `usePathname` strips
    // both so we fall back to `window.location.hash`.
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (hash) skipToElement(hash);
  }, [pathname]);

  return (
    <>
      {/* `hooks/use-entry-scape-blocks.ts` mounts EntryScape scripts into
          this node via `document.getElementById`. Kept 1:1 with Pages
          Router chrome — see `docs/entryscape-blocks.md`. */}
      <div id="scriptsPlaceholder" />
      <CookieBanner
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
      />
      <div
        id="top"
        className={`relative h-[100dvh] md:h-full ${
          openSideBar ? "overflow-y-hidden md:overflow-y-auto" : ""
        }`}
      >
        <SkipToContent text={t("common.skiptocontent")} />
        <Header
          mainMenu={(navigationData?.mainMenu as MenuLinkFragment[]) || []}
          serviceMenu={
            (navigationData?.serviceMenu as MenuLinkIconFragment[]) || []
          }
          setOpenSideBar={setOpenSideBar}
          openSideBar={openSideBar}
        />
        <Sidebar
          sidebarMenu={
            navigationData?.sidebarMenu as
              | MenuLinkIconFragment[]
              | SubLink[]
              | []
          }
          openSideBar={openSideBar}
          setOpenSideBar={setOpenSideBar}
        />
        <noscript>
          <div>
            <span>{defaultSettings.noScriptContent}</span>
          </div>
        </noscript>

        <div
          id="siteWrapper"
          className={`transition-all duration-300 ease-in-out ${
            openSideBar ? "2xl:w-[calc(100vw-18.75rem)]" : "w-full"
          }`}
        >
          <main
            id="main"
            className="flex min-h-[calc(100vh-46.5rem)] flex-col pb-lg lg:min-h-[calc(100vh-38.25rem)] [&>#Hero]:order-first"
          >
            {breadcrumbState.crumbs.length > 0 && pathname !== "/" && (
              <Breadcrumbs {...breadcrumbState} />
            )}
            {children}
          </main>
        </div>
        <Footer
          footerData={(navigationData?.footerMenu as SubLinkFooter[]) || []}
          setSettingsOpen={setSettingsOpen}
          setOpenSideBar={setOpenSideBar}
          openSideBar={openSideBar}
        />
      </div>
    </>
  );
};
