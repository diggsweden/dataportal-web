"use client";

import { cx } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { type FC, type ReactNode, useEffect } from "react";
import { CookieBanner } from "@/components/cookie-banner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Sidebar } from "@/components/navigation/sidebar";
import {
  SkipToContent,
  skipToElement,
} from "@/components/navigation/skip-to-content";
import type {
  MenuLinkFragment,
  MenuLinkIconFragment,
  NavigationDataFragment,
} from "@/graphql/gql/graphql";
import { usePathname } from "@/i18n/navigation";
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
 * Deliberately minimal:
 *  - No `<Hero>`: pages import `<Hero>` directly and place it themselves.
 *  - No `<MetaData>`: per-page `generateMetadata()` replaces it.
 *  - No Settings / Matomo / LocalStore providers: those live in
 *    `AppRouterProviders` one level up, so this file only renders chrome.
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
    // view + focus it for AT users. `usePathname` strips the fragment, so
    // we read it from `window.location.hash`.
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
        className={cx(
          "relative flex min-h-[100dvh] flex-col",
          openSideBar && "overflow-y-hidden md:overflow-y-auto",
        )}
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
          className={cx(
            "flex-1 transition-all duration-300 ease-in-out",
            openSideBar ? "2xl:w-[calc(100vw-18.75rem)]" : "w-full",
          )}
        >
          <main
            id="main"
            className="flex flex-1 flex-col pb-lg [&>#Hero]:order-first"
          >
            {breadcrumbState.crumbs.length > 0 &&
              !/^\/(en|sv)?$/.test(pathname) && (
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
