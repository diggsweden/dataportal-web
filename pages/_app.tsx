import { ApolloProvider } from "@apollo/client";
import reactenv from "@beam-australia/react-env";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import { usePathname } from "next/navigation";
import router, { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { MetaData } from "@/components/meta-data";
import {
  Breadcrumbs,
  BreadcrumbProps,
} from "@/components/navigation/breadcrumbs";
import { Sidebar } from "@/components/navigation/sidebar";
import {
  SkipToContent,
  skipToElement,
} from "@/components/navigation/skip-to-content";
import { EnvSettings, SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { CookieBanner } from "@/features/cookie-banner";
import { client } from "@/graphql";
import {
  MenuLinkIconFragment,
  NavigationDataFragment,
} from "@/graphql/__generated__/operations";
import {
  LocalStore,
  LocalStoreProvider,
} from "@/providers/local-store-provider";
import {
  defaultSettings,
  SettingsProvider,
} from "@/providers/settings-provider";
import { TrackingProvider } from "@/providers/tracking-provider";
import { SubLink } from "@/types/global";
import {
  DataportalPageProps,
  getNavigationData,
  linkBase,
  resolvePage,
} from "@/utilities";
import "@/styles/main.css";

const getCookiesAccepted = () => {
  try {
    const store: LocalStore = JSON.parse(localStorage.getItem("digg-store")!);
    return store ? store.cookieSettings?.analytic.accepted == true : false;
  } catch {
    return false;
  }
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _paq: any[];
  }
}

interface DataportalenProps extends AppProps {
  navigationData: {
    type: "Navigation";
    items: NavigationDataFragment[];
  };
  nonce: string;
}

export const initBreadcrumb = {
  name: "",
  crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
};

/**
 * focuses on element with id provided from path
 * @param pathWithHash url path along with hash
 */
const onHash = (pathWithHash: string) => {
  const hashIndex = pathWithHash.indexOf("#");
  const hash = pathWithHash.substring(hashIndex + 1);
  skipToElement(hash);
};

function Dataportal({
  Component,
  pageProps,
  navigationData: initialNavigationData,
}: DataportalenProps) {
  const pathname = usePathname();
  const { asPath } = useRouter();
  const { t, lang } = useTranslation();
  // Put shared props into state to persist between pages that doesn't use getStaticProps
  const [env, setEnv] = useState<EnvSettings | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [matomoActivated, setMatomoActivated] = useState<boolean>(true);
  const [openSideBar, setOpenSideBar] = useState(false);
  const { seo, heading, heroImage, preamble } = resolvePage(
    pageProps as DataportalPageProps,
    lang,
    t,
  );

  const [imageHero, setImageHero] = useState(heroImage);
  const [breadcrumbState, setBreadcrumb] = useState<BreadcrumbProps>({
    name: heading || "",
    crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
  });

  const navigationData = useMemo(
    () =>
      initialNavigationData.items.find((nav) => nav.locale === lang) ||
      initialNavigationData.items[0],
    [initialNavigationData.items, lang],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSandbox = window.location.host.includes("sandbox");
      //if host is run from sandbox, load that environment and disable matomo
      if (isSandbox) {
        setEnv(new Settings_Sandbox());
        setMatomoActivated(false);
      } else {
        setEnv(SettingsUtil.create());
      }
    }
  }, []);

  // Matomo tracking page view
  useEffect(() => {
    if (!matomoActivated) return;

    const matomoInstance = window._paq || [];

    // Track initial page view
    if (matomoInstance) {
      matomoInstance.push(["setCustomUrl", window.location.pathname]);
      matomoInstance.push(["trackPageView"]);
    }

    router.events.on("routeChangeComplete", () => {
      if (matomoInstance) {
        matomoInstance.push(["setCustomUrl", window.location.pathname]);
        matomoInstance.push(["trackPageView"]);
      }
    });
  }, [router.events]);

  let searchProps = null;

  if (pathname === "/" || pathname === `/${t("routes|search-api$path")}`) {
    searchProps = {
      destination: `/${lang}/datasets`,
      placeholder: t("pages|startpage$search_placeholder"),
    };
  }

  const conditionalPreamble =
    pathname === `/${t("routes|search-api$path")}` ? null : preamble;

  useEffect(() => {
    if (asPath.includes("#")) {
      onHash(asPath);
    }
    setImageHero(heroImage);
  }, [pathname]);

  if (!env) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <SettingsProvider
        value={{
          ...defaultSettings,
          env,
          setBreadcrumb,
          matomoSiteId: reactenv("MATOMO_SITE_ID"),
        }}
      >
        <LocalStoreProvider>
          <TrackingProvider
            initalActivation={getCookiesAccepted() && matomoActivated}
          >
            <MetaData seo={seo} />
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
              <SkipToContent text={t("common|skiptocontent")} />
              <Header
                mainMenu={navigationData.mainMenu || []}
                serviceMenu={navigationData.serviceMenu || []}
                setOpenSideBar={setOpenSideBar}
                openSideBar={openSideBar}
              />
              <Sidebar
                sidebarMenu={
                  navigationData.sidebarMenu as
                    | MenuLinkIconFragment[]
                    | SubLink[]
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
                {imageHero && (
                  <Hero
                    heading={heading}
                    preamble={conditionalPreamble}
                    image={imageHero}
                    search={searchProps}
                  />
                )}

                {breadcrumbState.crumbs.length > 0 && pathname !== "/" && (
                  <Breadcrumbs {...breadcrumbState} />
                )}

                <main
                  id="main"
                  className={`mt-lg min-h-[calc(100vh-46.5rem)] pb-lg md:mt-xl md:pb-xl lg:min-h-[calc(100vh-38.25rem)]`}
                >
                  <Component {...pageProps} />
                </main>
              </div>
              <Footer
                footerData={navigationData.footerMenu || []}
                setSettingsOpen={setSettingsOpen}
                setOpenSideBar={setOpenSideBar}
                openSideBar={openSideBar}
              />
            </div>
          </TrackingProvider>
        </LocalStoreProvider>
      </SettingsProvider>
    </ApolloProvider>
  );
}

Dataportal.getInitialProps = async (appContext: AppContext) => {
  const navigationData = await getNavigationData(
    appContext.router.locale || "sv",
  );

  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, navigationData: navigationData.props };
};

export default Dataportal;
