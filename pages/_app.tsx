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
  keyUp,
  linkBase,
  resolvePage,
} from "@/utilities";
import { EnvSettings, SettingsUtil } from "@/env";
import { client } from "@/graphql";
import reactenv from "@beam-australia/react-env";
import { Settings_Sandbox } from "@/env/Settings.Sandbox";
import { SideBar } from "@/components/navigation/SideBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/global/CookieBanner";
import "@/styles/main.css";
import {
  Breadcrumb,
  BreadcrumbProps,
} from "@/components/navigation/BreadCrumb";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { Hero } from "@/components/layout/Hero";
import { MetaData } from "@/components/global/MetaData";
import {
  SkipToContent,
  skipToElement,
} from "@/components/navigation/SkipToContent";
import { useRouter } from "next/router";

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

function Dataportal({ Component, pageProps }: DataportalenProps) {
  const pathname = usePathname();
  const { asPath } = useRouter();
  const { t, lang } = useTranslation();
  // Put shared props into state to persist between pages that doesn't use getStaticProps
  const [env, setEnv] = useState<EnvSettings>(SettingsUtil.create());
  const [matomoActivated, setMatomoActivated] = useState<boolean>(true);
  const [openSideBar, setOpenSideBar] = useState(false);
  const { seo, heading, heroImage, preamble } = resolvePage(
    pageProps as DataportalPageProps,
    lang,
    t,
  );

  const [breadcrumbState, setBreadcrumb] = useState<BreadcrumbProps>({
    name: heading || "",
    crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
  });

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

  let searchProps = null;

  if (pathname === "/" || pathname === `/${t("routes|search-api$path")}`) {
    searchProps = {
      destination: `/${lang}/datasets`,
      placeholder: t("pages|startpage$search_placeholder"),
    };
  }

  let conditionalPreamble =
    pathname === `/${t("routes|search-api$path")}` ? null : preamble;

  useEffect(() => {
    asPath.includes("#") && onHash(asPath);
  }, [pathname]);

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
            initalActivation={GetCookiesAccepted() && matomoActivated}
          >
            <MetaData seo={seo} />
            <div id="scriptsPlaceholder" />
            <CookieBanner />
            <div
              id="top"
              className={`relative h-screen min-h-screen md:h-auto`}
            >
              <SkipToContent text={t("common|skiptocontent")} />
              <Header
                setOpenSideBar={setOpenSideBar}
                openSideBar={openSideBar}
              />
              <SideBar
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
                  openSideBar ? "2xl:w-[calc(100vw-300px)]" : "w-full"
                }`}
              >
                {heroImage && (
                  <Hero
                    heading={heading}
                    preamble={conditionalPreamble}
                    image={heroImage}
                    search={searchProps}
                  />
                )}

                {breadcrumbState.crumbs.length > 0 && pathname !== "/" && (
                  <Breadcrumb {...breadcrumbState} />
                )}

                <main
                  id="main"
                  className={`mt-lg min-h-[calc(100vh-744px)] pb-lg md:mt-xl md:pb-xl lg:min-h-[calc(100vh-612px)]`}
                >
                  {/*{(pageProps as DataportalPageProps).type === "MultiContainer" ||*/}
                  {/*  ((pageProps as DataportalPageProps).type ===*/}
                  {/*    "Publication" && <div />)}*/}
                  <Component {...pageProps} />
                </main>
              </div>
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
