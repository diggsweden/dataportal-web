import type { ReactNode } from "react";

import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ChromeBreadcrumbs } from "@/components/navigation/breadcrumbs/chrome-breadcrumbs";
import { Sidebar } from "@/components/navigation/sidebar";
import { SkipToContent } from "@/components/navigation/skip-to-content";
import { CookieBanner } from "@/features/cookie-banner";
import type {
  MenuLinkFragment,
  MenuLinkIconFragment,
  NavigationDataFragment,
} from "@/graphql/__generated__/operations";
import { defaultSettings } from "@/providers/settings-provider";
import type { SubLink, SubLinkFooter } from "@/types/global";

import { HashScrollHandler } from "./hash-scroll-handler";
import { SiteWrapper } from "./site-wrapper";
import { TopWrapper } from "./top-wrapper";

interface AppRouterChromeProps {
  children: ReactNode;
  navigationData: NavigationDataFragment | null;
}

export async function AppRouterChrome({
  children,
  navigationData,
}: AppRouterChromeProps) {
  const t = await getTranslations();

  const mainMenu = (navigationData?.mainMenu as MenuLinkFragment[]) || [];
  const serviceMenu =
    (navigationData?.serviceMenu as MenuLinkIconFragment[]) || [];
  const sidebarMenu =
    (navigationData?.sidebarMenu as MenuLinkIconFragment[] | SubLink[]) || [];
  const footerData =
    (navigationData?.footerMenu as SubLinkFooter[]) || [];

  return (
    <>
      <div id="scriptsPlaceholder" />
      <CookieBanner />
      <TopWrapper>
        <SkipToContent text={t("common.skiptocontent")} />
        <Header mainMenu={mainMenu} serviceMenu={serviceMenu} />
        <Sidebar sidebarMenu={sidebarMenu} />
        <noscript>
          <div>
            <span>{defaultSettings.noScriptContent}</span>
          </div>
        </noscript>
        <SiteWrapper>
          <div className="chrome-breadcrumbs">
            <ChromeBreadcrumbs />
          </div>
          <main
            id="main"
            className="min-h-[calc(100vh-46.5rem)] pb-lg md:pb-xl lg:min-h-[calc(100vh-38.25rem)]"
          >
            {children}
          </main>
        </SiteWrapper>
        <Footer footerData={footerData} />
      </TopWrapper>
      <HashScrollHandler />
    </>
  );
}
