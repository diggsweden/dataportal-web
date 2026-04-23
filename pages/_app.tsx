import reactenv from "@beam-australia/react-env";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import { usePathname } from "next/navigation";
import type { Locale } from "next-intl";
import { NextIntlClientProvider, useLocale, useTranslations } from "next-intl";
import { type FC, useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { MetaData } from "@/components/meta-data";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
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
import {
  type LocaleMessages,
  loadLocaleMessages,
  loadResourceLabels,
  type ResourceMap,
} from "@/i18n/load-messages";
import { ResourcesProvider } from "@/i18n/resources-provider";
import { isAppLocale, routing } from "@/i18n/routing";
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
  resolvePage,
} from "@/utilities";
import { includeLangInPath } from "@/utilities/check-lang";
import { initBreadcrumb } from "@/utilities/layout-breadcrumb";
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
  /** Locale resolved for the current request (Swedish by default). */
  locale: Locale;
  /** Messages tree handed to `NextIntlClientProvider`. */
  messages: LocaleMessages;
  /** URI → label map handed to `ResourcesProvider`. */
  resources: ResourceMap;
}

/** Re-exported for backwards compatibility with `pages/404.tsx` etc. */
export { initBreadcrumb };

/** Focuses on element with id provided from path. */
const onHash = (pathWithHash: string) => {
  const hashIndex = pathWithHash.indexOf("#");
  const hash = pathWithHash.substring(hashIndex + 1);
  skipToElement(hash);
};

/**
 * Inner shell — runs inside `LayoutStateProvider` so it can read shared
 * layout chrome state via the new hook. All page-level state that used to
 * live as `useState` calls in this file now lives in the provider.
 */
const DataportalChrome: FC<DataportalenProps> = ({
  Component,
  pageProps,
  router,
  navigationData: initialNavigationData,
}) => {
  const pathname = usePathname();
  const t = useTranslations();
  const lang = useLocale();
  const [env, setEnv] = useState<EnvSettings | null>(null);
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

  const { seo, heading, heroImage, preamble } = resolvePage(
    pageProps as DataportalPageProps,
    lang,
    t,
  );

  const navigationData = useMemo(() => {
    if (!initialNavigationData?.items?.length) return null;
    return initialNavigationData?.items.find(
      (nav: NavigationDataFragment) => nav.locale === lang,
    );
  }, [lang]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSandbox = window.location.host.includes("sandbox");
      // Sandbox hosts load the sandbox environment and disable Matomo.
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

  if (pathname === "/" || pathname === `/${t("routes.search-api.path")}`) {
    searchProps = {
      destination: `${includeLangInPath(lang)}/datasets`,
      placeholder: t("pages.startpage.search_placeholder"),
    };
  }

  const conditionalPreamble =
    pathname === `/${t("routes.search-api.path")}` ? null : preamble;

  useEffect(() => {
    // `router.asPath` keeps fragment + query so we can detect `#hash`
    // navigation. We avoid `useRouter()` from `next/router` at module top
    // level to ease the eventual App Router move; `props.router` is the
    // identical instance for any Pages Router page.
    if (router?.asPath.includes("#")) {
      onHash(router.asPath);
    }
    setImageHero(heroImage);
  }, [pathname]);

  if (!env) return null;

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
};

function Dataportal(props: DataportalenProps) {
  return (
    <NextIntlClientProvider
      locale={props.locale}
      messages={props.messages}
      timeZone="Europe/Stockholm"
    >
      <ResourcesProvider resources={props.resources}>
        <LayoutStateProvider initialBreadcrumb={initBreadcrumb}>
          <DataportalChrome {...props} />
        </LayoutStateProvider>
      </ResourcesProvider>
    </NextIntlClientProvider>
  );
}

Dataportal.getInitialProps = async (appContext: AppContext) => {
  const navigationData = await getNavigationData("all");

  // Calls the page's `getInitialProps` and fills `appProps.pageProps`.
  const appProps = await App.getInitialProps(appContext);

  // Resolve locale + messages up-front so every Pages Router page renders
  // inside `NextIntlClientProvider`. With the native `i18n` block removed from
  // `next.config.mjs` (Option B of the migration plan), `appContext.router.locale`
  // is always `undefined` in Pages Router, so we fall back to the default. `/en`
  // gets re-enabled per-route as each tree moves under `app/[locale]/`.
  const rawLocale = appContext.router.locale ?? routing.defaultLocale;
  const locale = isAppLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const [messages, resources] = await Promise.all([
    loadLocaleMessages(locale),
    loadResourceLabels(locale),
  ]);

  return {
    ...appProps,
    navigationData: navigationData.props,
    locale,
    messages,
    resources,
  };
};

export default Dataportal;
