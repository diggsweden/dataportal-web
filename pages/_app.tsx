import { useEffect, useState } from "react";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import { ApolloProvider } from "@apollo/client";
import { LocalStore, LocalStoreProvider } from "@/providers/LocalStoreProvider";

import { TrackingProvider } from "@/providers/TrackingProvider";
import {
  defaultSettings,
  SettingsProvider,
} from "@/providers/SettingsProvider";
import {
  click,
  DataportalPageProps,
  generateRandomKey,
  keyUp,
  makeBreadcrumbsFromPath,
  resolvePage,
} from "@/utilities";
import { EnvSettings, SettingsUtil } from "@/env";
import Head from "next/head";
import { client } from "@/graphql";
import generateCSP from "../utilities/generateCsp";
import { SeoDataFragment } from "@/graphql/__generated__/operations";
import { useRouter } from "next/router";
import reactenv from "@beam-australia/react-env";
import { Settings_Sandbox } from "@/env/Settings.Sandbox";
import { SideBar } from "@/components/navigation/SideBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/global/CookieBanner";
import "@/styles/base.css";
import {
  Breadcrumb,
  BreadcrumbProps,
} from "@/components/navigation/BreadCrumb";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { Hero } from "@/components/layout/Hero";

const GetCookiesAccepted = () => {
  try {
    const store: LocalStore = JSON.parse(localStorage.getItem("digg-store")!);
    return store ? store.cookieSettings?.analytic.accepted == true : false;
  } catch {
    return false;
  }
};

interface DataportalenProps extends AppProps {
  nonce: string;
}

export const initBreadcrumb = {
  name: "",
  crumbs: [],
};
const defaultDescrtiption =
  "Sveriges nationella dataportal för att hitta, utforska och använda data från offentlig och privat sektor"; // Todo - translate

/**
 * focuses on element with id provided from path
 * @param pathWithHash url path along with hash
 */
// const onHash = (pathWithHash: string) => {
//   const hashIndex = pathWithHash.indexOf("#");
//   const hash = pathWithHash.substring(hashIndex);
//   onNextFrame(() => skipToElement(hash));
// };

function Dataportal({ Component, pageProps }: DataportalenProps) {
  //let env = SettingsUtil.create();
  const { locale } = useRouter() || {};
  const pathname = usePathname();
  //*Put shared props into state to persist between pages that doesn't use getStaticProps
  const [env, setEnv] = useState<EnvSettings>(SettingsUtil.create());
  const [matomoActivated, setMatomoActivated] = useState<boolean>(true);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [breadcrumbState, setBreadcrumb] =
    useState<BreadcrumbProps>(initBreadcrumb);
  const { seo, heroImage } =
    resolvePage(pageProps as DataportalPageProps) || {};
  const { title, description, image, robotsFollow, robotsIndex } =
    (seo as SeoDataFragment) || {};
  const strapiImageUrl = image?.url;
  const imageUrl = strapiImageUrl
    ? `${reactenv("MEDIA_BASE_URL") || ""}${strapiImageUrl}`
    : "/images/svdp-favicon-150.png";
  const isDraft = pathname?.substring(0, 7) === "/drafts";
  const allowSEO = env.envName == "prod" && !isDraft ? true : false;
  const appRenderKey = generateRandomKey(16);
  const { t, lang } = useTranslation("pages");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let clienthost = window?.location?.host || "";

      //if host is run from sandbox, load that environment and disable matomo
      if (clienthost?.includes("sandbox")) {
        setEnv(new Settings_Sandbox());
        //disable matomo
        setMatomoActivated(false);
      }
    }
    document.documentElement.classList.add("no-focus-outline");
    document.body.addEventListener("keyup", keyUp);
    document.body.addEventListener("mousedown", click);

    return () => {
      document.body.removeEventListener("keyup", keyUp);
      document.body.removeEventListener("mousedown", click);
    };
  }, []);

  console.log("pageProps", pageProps);
  useEffect(() => {
    const heading = pageProps.heading;
    const containerHeading = pageProps.container?.name;
    if (containerHeading) {
      const crumbs = makeBreadcrumbsFromPath(pathname, heading);
      setBreadcrumb({
        crumbs: crumbs.crumbs,
        name: containerHeading ? containerHeading : "",
      });
    }
    if (heading) {
      const crumbs = makeBreadcrumbsFromPath(pathname, containerHeading);
      setBreadcrumb({
        crumbs: crumbs.crumbs,
        name: heading ? heading : "",
      });
    }
  }, [pathname]);

  let searchProps = null;

  if (pathname === "/" || pageProps.domain === "data") {
    searchProps = {
      destination: `/${lang}/datasets`,
      placeholder: t("startpage$search_placeholder"),
    };
  }

  let conditionalPreamble =
    pageProps.domain === "data" ? null : pageProps.preamble;

  // useEffect(() => {
  //   if (previousPath) {
  //     pathname.includes("#")
  //       ? onHash(pathname)
  //       : skipToContent(undefined, { showFocus: false, includeHeading: true });
  //   } else {
  //     pathname.includes("#") && onHash(pathname);
  //   }
  // }, [pathname]);

  return (
    <ApolloProvider client={client}>
      <SettingsProvider
        value={{
          ...defaultSettings,
          env,
          setBreadcrumb,
          appRenderKey,
          matomoSiteId: reactenv("MATOMO_SITE_ID"),
        }}
      >
        <LocalStoreProvider>
          <TrackingProvider
            initalActivation={GetCookiesAccepted() && matomoActivated}
          >
            <Head>
              <meta name="referrer" content="no-referrer" />
              <meta
                httpEquiv="Content-Security-Policy"
                content={generateCSP({ nonce: env.nonce })}
              />
              {/* SEO */}
              <title>
                {title
                  ? `${title} - Sveriges Dataportal`
                  : "Sveriges Dataportal"}
              </title>
              <meta
                property="og:title"
                content={
                  title
                    ? `${title} - Sveriges Dataportal`
                    : "Sveriges Dataportal"
                }
              />
              <meta
                name="twitter:title"
                content={
                  title
                    ? `${title} - Sveriges Dataportal`
                    : "Sveriges Dataportal"
                }
              />
              <meta
                name="description"
                content={description || defaultDescrtiption}
              />
              <meta
                name="og:description"
                content={description || defaultDescrtiption}
              />
              <meta
                name="twitter:description"
                content={description || defaultDescrtiption}
              />
              <meta property="og:image" content={imageUrl} />
              <meta name="twitter:image" content={imageUrl} />
              <link
                rel="canonical"
                href={`${env.CANONICAL_URL}${pathname || ""}`}
              />
              <meta
                property="og:url"
                content={`${env.CANONICAL_URL}${pathname || ""}`}
              />
              <meta
                name="twitter:url"
                content={`${env.CANONICAL_URL}${pathname || ""}`}
              />
              <meta
                name="robots"
                content={`${
                  robotsFollow && allowSEO ? "follow" : "nofollow"
                }, ${robotsIndex && allowSEO ? "index" : "noindex"}`}
              />
              <meta name="og:site_name" content={defaultSettings.siteName} />
              <meta name="language" content={locale} />
              <meta name="og:type" content="website" />
              {/* PWA settings */}
              <link rel="icon" href="/favicon.ico" />
              <link rel="manifest" href="/manifest.json" />
              <meta name="theme-color" content={"#171A21"} />
              <link
                rel="apple-touch-icon"
                href="/images/apple-touch-icon.png"
              />
              <meta name="apple-mobile-web-app-status-bar" />
              <link
                rel="icon"
                type="image/png"
                href="/images/svdp-favicon-16.png"
                sizes="16x16"
              />
              <link
                rel="icon"
                type="image/png"
                href="/images/svdp-favicon-32.png"
                sizes="32x32"
              />
              <link
                rel="icon"
                type="image/png"
                href="/images/svdp-favicon-64.png"
                sizes="64x64"
              />
              <link
                rel="apple-touch-icon"
                href="/images/svdp-favicon-150.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/images/svdp-favicon.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="152x152"
                href="/images/svdp-favicon.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="167x167"
                href="/images/svdp-favicon.png"
              />
              <link
                rel="mask-icon"
                href="/images/safari-pinned-tab.svg"
                color="black"
              />
            </Head>
            <div id="scriptsPlaceholder" />
            <CookieBanner />
            <div id="top" className="relative min-h-screen overflow-hidden">
              {/*@todo fix this -> <SkipToContent text={t("skiptocontent")} />*/}
              <Header
                setOpenSideBar={setOpenSideBar}
                openSideBar={openSideBar}
              />
              <SideBar openSideBar={openSideBar} />
              <noscript>
                <div>
                  <span>{defaultSettings.noScriptContent}</span>
                </div>
              </noscript>

              {heroImage && (
                <Hero
                  heading={pageProps.heading}
                  preamble={conditionalPreamble}
                  image={heroImage}
                  search={searchProps}
                />
              )}

              {breadcrumbState.crumbs.length > 0 && pathname !== "/" && (
                <Breadcrumb {...breadcrumbState} />
              )}

              <main
                className={`mt-xl min-h-[calc(100vh-656px)] pb-xl transition-all duration-300 ease-in-out lg:min-h-[calc(100vh-524px)] ${
                  openSideBar ? "xl:w-[calc(100vw-300px)]" : "w-full"
                }`}
              >
                {/*{(pageProps as DataportalPageProps).type === "MultiContainer" ||*/}
                {/*  ((pageProps as DataportalPageProps).type ===*/}
                {/*    "Publication" && <div />)}*/}
                <Component {...pageProps} />
              </main>
              <Footer
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
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default Dataportal;
