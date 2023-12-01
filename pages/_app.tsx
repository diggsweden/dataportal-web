import "../styles/articles/articles.scss";
import "../styles/general/variables.scss";
import "../styles/general/typography.scss";
import "../styles/general/general.scss";
import "../styles/general/prism.scss";
import "../styles/general/utils.scss";
import "../styles/header/header.scss";
import "../styles/footer/footer.scss";
import "../styles/breadcrumb/breadcrumb.scss";
import "../styles/search/search_bar.scss";
import "../styles/search/search_filter.scss";
import "../styles/search/search_result.scss";
import "../styles/search/search_head.scss";
import "../styles/blocks/blocks.scss";
import "../styles/startpage/domainpage.scss";
import "../styles/startpage/devportal_block.scss";
import "../styles/startpage/startpage_categories.scss";
import "../styles/startpage/startpage_search.scss";
import "../styles/swagger/swagger.scss";
import "../styles/content/content.scss";
import "../styles/content/contentgrid.scss";
import "../styles/content/anchorLinkMenu.scss";
import "../styles/blockspage/blockspage.scss";
import "../styles/highlight/highlight.scss";
import "../styles/statistic/statistic.scss";
import "../styles/form/form_pages.scss";
import "../styles/notfoundpage/notfoundpage.scss";
import "../styles/general/image.scss";
import "../styles/sidebar/sidebar.scss";
import "../node_modules/react-vis/dist/style.css";
import "../components/Form/ProgressComponent/FormProgress.scss";

//Only for importing fonts
import "../styles/global.css";

import { useEffect, useState } from "react";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import {
  colorPalette,
  ErrorBoundary,
  fontSize,
  SkipToContent,
  skipToContent,
  skipToElement,
  theme,
  ThemeProvider,
} from "@digg/design-system";
import { ApolloProvider } from "@apollo/client";
import {
  Breadcrumb,
  BreadcrumbProps,
  CookieBanner,
  CustomImage,
  Footer,
  Header,
  LocalStore,
  LocalStoreProvider,
  SettingsProvider,
  TrackingProvider,
} from "../components";
import { defaultSettings } from "../components/SettingsProvider/SettingsProvider";
import {
  click,
  DataportalPageProps,
  dataportalTheme,
  generateRandomKey,
  keyUp,
  onNextFrame,
  resolvePage,
  usePrevious,
} from "../utilities";
import { EnvSettings, SettingsUtil } from "../env";
import Head from "next/head";
import { client } from "../graphql/client";
import generateCSP from "../utilities/generateCsp";
import { SeoDataFragment } from "../graphql/__generated__/operations";
import { useRouter } from "next/router";
import reactenv from "@beam-australia/react-env";
import { Settings_Sandbox } from "../env/Settings.Sandbox";
import useTranslation from "next-translate/useTranslation";
import { css } from "@emotion/react";
import SideBar from "../components/Navigation/sideBar/sideBar";

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
const onHash = (pathWithHash: string) => {
  const hashIndex = pathWithHash.indexOf("#");
  const hash = pathWithHash.substring(hashIndex);
  onNextFrame(() => skipToElement(hash));
};

function Dataportal({ Component, pageProps }: DataportalenProps) {
  //let env = SettingsUtil.create();
  const { locale, asPath } = useRouter() || {};

  //*Put shared props into state to persist between pages that doesn't use getStaticProps
  const [env, setEnv] = useState<EnvSettings>(SettingsUtil.create());
  const [matomoActivated, setMatomoActivated] = useState<boolean>(true);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [breadcrumbState, setBreadcrumb] =
    useState<BreadcrumbProps>(initBreadcrumb);
  const previousPath = usePrevious(asPath);
  const { t } = useTranslation("common");
  const { seo, heroImage } =
    resolvePage(pageProps as DataportalPageProps) || {};
  const { title, description, image, robotsFollow, robotsIndex } =
    (seo as SeoDataFragment) || {};
  const strapiImageUrl = image?.url;
  const imageUrl = strapiImageUrl
    ? `${reactenv("MEDIA_BASE_URL") || ""}${strapiImageUrl}`
    : "/images/svdp-favicon-150.png";
  const isDraft = asPath?.substring(0, 7) === "/drafts";
  const allowSEO = env.envName == "prod" && !isDraft ? true : false;
  const appRenderKey = generateRandomKey(16);
  //eslint-disable-next-line
  // console.log({ seo, blocks });

  useEffect(() => {
    if (typeof window !== "undefined") {
      let clienthost = window?.location?.host || "";

      //if host is run from sandbox, load that environment and disable matomo
      if (clienthost?.includes("sandbox")) {
        setEnv(new Settings_Sandbox());
        //disable matomo
        setMatomoActivated(false);
      }

      window.addEventListener("resize", function () {
        setOpenSideBar(false);
      });
    }
    document.documentElement.classList.add("no-focus-outline");
    document.body.addEventListener("keyup", keyUp);
    document.body.addEventListener("mousedown", click);

    return () => {
      document.body.removeEventListener("keyup", keyUp);
      document.body.removeEventListener("mousedown", click);
    };
  }, []);

  useEffect(() => {
    if (previousPath) {
      asPath.includes("#")
        ? onHash(asPath)
        : skipToContent(undefined, { showFocus: false, includeHeading: true });
    } else {
      asPath.includes("#") && onHash(asPath);
    }
  }, [asPath]);

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
        <ThemeProvider theme={dataportalTheme}>
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
                  href={`${env.CANONICAL_URL}${asPath || ""}`}
                />
                <meta
                  property="og:url"
                  content={`${env.CANONICAL_URL}${asPath || ""}`}
                />
                <meta
                  name="twitter:url"
                  content={`${env.CANONICAL_URL}${asPath || ""}`}
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
                <meta name="theme-color" content={theme.primary || "#171A21"} />
                <link
                  rel="apple-touch-icon"
                  href="/images/apple-touch-icon.png"
                />
                <meta
                  name="apple-mobile-web-app-status-bar"
                  content={theme.primary}
                />
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
              <div
                id="top"
                css={css`
                  display: flex;
                  flex-direction: column;
                  min-height: 100vh;
                  background-color: ${colorPalette.gray900};
                  contain: paint;
                `}
              >
                <SkipToContent text={t("skiptocontent")} />
                <Header
                  menu={undefined}
                  env={env}
                  setOpenSidebar={setOpenSideBar}
                  openSideBar={openSideBar}
                />
                <noscript>
                  <div
                    css={css`
                      position: fixed;
                      bottom: 0;
                      left: 0;
                      width: 100%;
                      background-color: ${colorPalette.brown300};
                      padding: 24px;
                      z-index: 100;
                    `}
                  >
                    <span
                      css={css`
                        ${fontSize("md")};
                        text-align: center;
                      `}
                    >
                      {defaultSettings.noScriptContent}
                    </span>
                  </div>
                </noscript>
                <ErrorBoundary>
                  {breadcrumbState.crumbs.length > 0 && (
                    <Breadcrumb {...breadcrumbState} />
                  )}
                  <main>
                    {heroImage?.url ? (
                      <div className="hero">
                        <CustomImage image={heroImage} />
                      </div>
                    ) : (
                      (pageProps as DataportalPageProps).type ===
                        "MultiContainer" ||
                      ((pageProps as DataportalPageProps).type ===
                        "Publication" && (
                        <div
                          css={css`
                            margin-top: 2rem; //Add margin to compensate for lack of hero image
                          `}
                        />
                      ))
                    )}
                    <Component {...pageProps} />
                  </main>
                </ErrorBoundary>
                <Footer />
                <SideBar openSideBar={openSideBar} />
              </div>
            </TrackingProvider>
          </LocalStoreProvider>
        </ThemeProvider>
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
