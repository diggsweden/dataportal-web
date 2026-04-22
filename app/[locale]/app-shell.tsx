"use client";

import reactenv from "@beam-australia/react-env";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { FC, ReactNode, useEffect, useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import {
  Breadcrumbs,
  BreadcrumbProps,
} from "@/components/navigation/breadcrumbs";
import { Sidebar } from "@/components/navigation/sidebar";
import { SkipToContent } from "@/components/navigation/skip-to-content";
import { EnvSettings, SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { CookieBanner } from "@/features/cookie-banner";
import { NavigationDataFragment } from "@/graphql/__generated__/operations";
import { ApolloProvider } from "@/providers/apollo-provider";
import { LocalStoreProvider } from "@/providers/local-store-provider";
import {
  HeroData,
  SettingsProvider,
  defaultSettings,
} from "@/providers/settings-provider";
import { TrackingProvider } from "@/providers/tracking-provider";
import { SubLinkFooter } from "@/types/global";

interface AppShellProps {
  children: ReactNode;
  navigationData: NavigationDataFragment | null;
}

const getCookiesAccepted = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem("digg-store");
    if (!stored) return false;
    const data = JSON.parse(stored);
    return data?.cookieSettings?.analytic?.accepted === true;
  } catch {
    return false;
  }
};

export const AppShell: FC<AppShellProps> = ({ children, navigationData }) => {
  const t = useTranslations();
  const pathname = usePathname() ?? "";
  const [openSideBar, setOpenSideBar] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [env, setEnv] = useState<EnvSettings | null>(null);
  const [matomoActivated, setMatomoActivated] = useState(true);
  const [heroData, setHero] = useState<HeroData | null>(null);
  const [breadcrumbState, setBreadcrumb] = useState<BreadcrumbProps>({
    name: "",
    crumbs: [],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSandbox = window.location.host.includes("sandbox");
      if (isSandbox) {
        setEnv(new Settings_Sandbox());
        setMatomoActivated(false);
      } else {
        setEnv(SettingsUtil.create());
      }
    }
  }, []);

  const mainMenu = navigationData?.mainMenu ?? [];
  const serviceMenu = navigationData?.serviceMenu ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sidebarMenu = (navigationData?.sidebarMenu ?? []) as any;
  const footerData = (navigationData?.footerMenu ?? []) as SubLinkFooter[];

  return (
    <ApolloProvider>
      <SettingsProvider
        value={{
          ...defaultSettings,
          ...(env ? { env } : {}),
          setBreadcrumb,
          setHero,
          matomoSiteId: reactenv("MATOMO_SITE_ID") || "-1",
        }}
      >
        <LocalStoreProvider>
          <TrackingProvider
            initalActivation={getCookiesAccepted() && matomoActivated}
          >
            <div id="scriptsPlaceholder" />
            <CookieBanner
              settingsOpen={settingsOpen}
              setSettingsOpen={setSettingsOpen}
            />

            <div
              id="top"
              className={`relative h-[100dvh] md:h-full ${
                openSideBar ? "overflow-y-hidden md:overflow-y-visible" : ""
              }`}
            >
              <SkipToContent text={t("common.skiptocontent")} />
              <Header
                mainMenu={mainMenu}
                serviceMenu={serviceMenu}
                setOpenSideBar={setOpenSideBar}
                openSideBar={openSideBar}
              />
              <Sidebar
                sidebarMenu={sidebarMenu}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
              />

              <noscript>
                <div className="bg-yellow-100 p-md text-center">
                  {t("common.no-js-text")}
                </div>
              </noscript>

              <div
                id="siteWrapper"
                className={`transition-all duration-300 ease-in-out ${
                  openSideBar ? "xl:w-[calc(100vw-18.75rem)]" : "w-full"
                }`}
              >
                {heroData?.image && (
                  <Hero
                    heading={heroData.heading}
                    preamble={heroData.preamble}
                    image={heroData.image}
                    search={heroData.search}
                  />
                )}
                {breadcrumbState.crumbs.length > 0 && pathname !== "/" && (
                  <Breadcrumbs {...breadcrumbState} />
                )}
                <main
                  id="main"
                  className="mt-lg min-h-[calc(100vh-46.5rem)] pb-lg md:mt-xl md:pb-xl lg:min-h-[calc(100vh-38.25rem)]"
                >
                  {children}
                </main>
              </div>

              <Footer
                footerData={footerData}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
                setSettingsOpen={setSettingsOpen}
              />
            </div>
          </TrackingProvider>
        </LocalStoreProvider>
      </SettingsProvider>
    </ApolloProvider>
  );
};
