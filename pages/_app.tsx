import reactenv from "@beam-australia/react-env";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { MetaData } from "@/components/meta-data";
import {
  type BreadcrumbProps,
  Breadcrumbs,
} from "@/components/navigation/breadcrumbs";
import { Sidebar } from "@/components/navigation/sidebar";
import {
  SkipToContent,
  skipToElement,
} from "@/components/navigation/skip-to-content";
import { type EnvSettings, SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { CookieBanner } from "@/features/cookie-banner";
import type {
  MenuLinkFragment,
  MenuLinkIconFragment,
  NavigationDataFragment,
} from "@/graphql/__generated__/operations";
import { MatomoProvider } from "@/lib/matomo";
import {
  LayoutStateProvider,
  useLayoutState,
} from "@/providers/layout-state-provider";
import {
  type LocalStore,
  LocalStoreProvider,
} from "@/providers/local-store-provider";
import {
  defaultSettings,
  SettingsProvider,
} from "@/providers/settings-provider";
import type { SubLink, SubLinkFooter } from "@/types/global";
import {
  type DataportalPageProps,
  getNavigationData,
  linkBase,
  resolvePage,
} from "@/utilities";
import "@/styles/main.css";

const getCookiesAccepted = () => {
  try {
    const store: LocalStore = JSON.parse(
      localStorage.getItem("digg-store") ?? "{}",
    );
    return store ? store.cookieSettings?.analytic.accepted === true : false;
  } catch {
    return false;
  }
};

interface DataportalenProps extends AppProps {
  navigationData: {
    type: "Navigation";
    items: NavigationDataFragment[];
  };
  nonce: string;
}

/**
 * focuses on element with id provided from path
 * @param pathWithHash url path along with hash
 */
const onHash = (pathWithHash: string) => {
  const hashIndex = pathWithHash.indexOf("#");
  const hash = pathWithHash.substring(hashIndex + 1);
  skipToElement(hash);
};

function DataportalChrome({
  Component,
  pageProps,
  router,
  navigationData: initialNavigationData,
}: DataportalenProps) {
  const pathname = usePathname();
  const { t, lang } = useTranslation();
  const {
    settingsOpen,
    setSettingsOpen,
    openSideBar,
    setOpenSideBar,
    imageHero,
    setImageHero,
    breadcrumbState,
    setBreadcrumb,
  } = useLayoutState();

  const [env, setEnv] = useState<EnvSettings | null>(null);
  const { seo, heading, heroImage, preamble } = resolvePage(
    pageProps as DataportalPageProps,
    lang,
    t,
  );

  const navigationData = useMemo(() => {
    if (!initialNavigationData?.items?.length) {
      return null;
    }

    return initialNavigationData?.items.find(
      (nav: NavigationDataFragment) => nav.locale === lang,
    );
  }, [lang, initialNavigationData?.items]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSandbox = window.location.host.includes("sandbox");
      if (isSandbox) {
        setEnv(new Settings_Sandbox());
      } else {
        setEnv(SettingsUtil.create());
      }
    }
  }, []);

  const matomoDisabled =
    process.env.NEXT_PUBLIC_DISABLE_MATOMO === "1" ||
    env instanceof Settings_Sandbox;

  let searchProps = null;

  if (pathname === "/" || pathname === `/${t("routes|search-api$path")}`) {
    searchProps = {
      destination: `/${lang}/datasets`,
      placeholder: t("pages|startpage$search_placeholder"),
    };
  }

  const conditionalPreamble =
    pathname === `/${t("routes|search-api$path")}` ? null : preamble;

  const { asPath } = router;

  useEffect(() => {
    if (asPath.includes("#")) {
      onHash(asPath);
    }
    setImageHero(heroImage ?? null);
  }, [pathname, asPath, heroImage, setImageHero]);

  if (!env) {
    return null;
  }

  return (
    <SettingsProvider
      value={{
        ...defaultSettings,
        env,
        setBreadcrumb,
        matomoSiteId: reactenv("MATOMO_SITE_ID"),
      }}
    >
      <LocalStoreProvider>
        <MatomoProvider
          disabled={matomoDisabled}
          initialConsent={getCookiesAccepted() ?? false}
          nonce={env.nonce}
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
              footerData={(navigationData?.footerMenu as SubLinkFooter[]) || []}
              setSettingsOpen={setSettingsOpen}
              setOpenSideBar={setOpenSideBar}
              openSideBar={openSideBar}
            />
          </div>
        </MatomoProvider>
      </LocalStoreProvider>
    </SettingsProvider>
  );
}

function Dataportal(props: DataportalenProps) {
  const { t, lang } = useTranslation();
  const { heading, heroImage } = resolvePage(
    props.pageProps as DataportalPageProps,
    lang,
    t,
  );

  const initialBreadcrumb: BreadcrumbProps = {
    name: heading || "",
    crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
  };

  return (
    <LayoutStateProvider
      key={props.router.asPath}
      initialBreadcrumb={initialBreadcrumb}
      initialImageHero={heroImage ?? null}
    >
      <DataportalChrome {...props} />
    </LayoutStateProvider>
  );
}

Dataportal.getInitialProps = async (appContext: AppContext) => {
  const navigationData = await getNavigationData("all");

  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, navigationData: navigationData.props };
};

export default Dataportal;
