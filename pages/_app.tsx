import '../styles/general/variables.scss';
import '../styles/general/typography.scss';
import '../styles/general/general.scss';
import '../styles/general/utils.scss';
import '../styles/header/header.scss';
import '../styles/footer/footer.scss';
import '../styles/breadcrumb/breadcrumb.scss';
import '../styles/search/search_bar.scss';
import '../styles/search/search_filter.scss';
import '../styles/search/search_result.scss';
import '../styles/search/search_head.scss';
import '../styles/blocks/blocks.scss';
import '../styles/startpage/devportal_block.scss';
import '../styles/startpage/startpage_categories.scss';
import '../styles/startpage/startpage_search.scss';
import '../styles/news/news.scss';
import '../styles/swagger/swagger.scss';
import '../styles/content/content.scss';
import '../styles/content/contentgrid.scss';
import '../styles/content/anchorLinkMenu.scss';
import '../styles/blockspage/blockspage.scss';
import '../styles/highlight/highlight.scss';
import '../styles/statistic/statistic.scss';
import '../styles/notfoundpage/notfoundpage.scss';
import '../node_modules/react-vis/dist/style.css';

//Only for importing fonts
import '../styles/global.css';

import { useEffect, useState } from 'react';
import type { AppContext, AppProps } from 'next/app';
import {
  colorPalette,
  fontSize,
  theme,
  ThemeProvider,
  ErrorBoundary,
  SkipToContent,
  skipToElement,
  skipToContent,
} from '@digg/design-system';
import { ApolloProvider } from '@apollo/client';
import {
  TrackingProvider,
  LocalStoreProvider,
  SettingsProvider,
  Header,
  Footer,
  CookieBanner,
  Breadcrumb,
  BreadcrumbProps,
  extractSettings,
  LocalStore,
  HeroBlock,
} from '../components';
import { defaultSettings } from '../components/SettingsProvider/SettingsProvider';
import { click, keyUp, onNextFrame, usePrevious } from '../utilities';
import { EnvSettings, SettingsUtil } from '../env';
import Head from 'next/head';
import { client, browserclient, getSharedProps } from '../graphql';
import App from 'next/app';
import generateCSP from '../utilities/generateCsp';
import { Footer_dataportal_Digg_Footer } from '../graphql/__generated__/Footer';
import { MainMenu_dataportal_Digg_Menu } from '../graphql/__generated__/MainMenu';
import { Settings_dataportal_Digg_Settings } from '../graphql/__generated__/Settings';
import { SeoData } from '../graphql/__generated__/SeoData';
import { useRouter } from 'next/router';
import reactenv from '@beam-australia/react-env';
import absoluteUrl from 'next-absolute-url';
import { Settings_Sandbox } from '../env/Settings.Sandbox';
import useTranslation from 'next-translate/useTranslation';
import { css } from '@emotion/react';

const GetCookiesAccepted = () => {
  try {
    const store: LocalStore = JSON.parse(localStorage.getItem('digg-store')!);
    return store ? store.cookieSettings?.analytic.accepted == true : false;
  } catch {
    return false;
  }
};

interface DataportalenProps extends AppProps {
  menu: MainMenu_dataportal_Digg_Menu;
  footer: Footer_dataportal_Digg_Footer;
  settings: Settings_dataportal_Digg_Settings;
  host: string;
  nonce: string;
}

export const initBreadcrumb = {
  name: '',
  crumbs: [],
};
const defaultDescrtiption =
  'Sveriges nationella dataportal för att hitta, utforska och använda data från offentlig och privat sektor'; // Todo - translate

/**
 * focuses on element with id provided from path
 * @param pathWithHash url path along with hash
 */
const onHash = (pathWithHash: string) => {
  const hashIndex = pathWithHash.indexOf('#');
  const hash = pathWithHash.substring(hashIndex);
  onNextFrame(() => skipToElement(hash));
};

function Dataportal({
  Component,
  pageProps,
  menu,
  footer,
  settings: diggSettings,
  host,
}: DataportalenProps) {
  //let env = SettingsUtil.create();
  const { locale, asPath } = useRouter() || {};

  //*Put shared props into state to persist between pages that doesn't use getStaticProps
  const [env, setEnv] = useState<EnvSettings>(SettingsUtil.create());
  const [matomoActivated, setMatomoActivated] = useState<boolean>(true);
  const [breadcrumbState, setBreadcrumb] = useState<BreadcrumbProps>(initBreadcrumb);
  const [menuState, setMenu] = useState(menu);
  const [footerState, setFooter] = useState(footer);
  const [settingsState, setSettings] = useState(diggSettings);
  const previousPath = usePrevious(asPath);
  const { lang, t } = useTranslation('common');
  const { breadcrumb, heading, seo, blocks, name } = pageProps;
  const { title, description, image, robotsFollow, robotsIndex } = (seo as SeoData) || {};
  const strapiImageUrl = image?.url;
  const imageUrl = strapiImageUrl
    ? `${reactenv('MEDIA_BASE_URL') || ''}${strapiImageUrl}`
    : '/images/svdp-favicon-150.png';
  const dataportalSettings = extractSettings(settingsState);
  const heroBlock =
    blocks && blocks.find((block: any) => block.__typename === 'dataportal_Digg_HeroBlock');
  const isDraft = asPath?.substring(0, 7) === '/drafts';
  const allowSEO = env.envName == 'prod' && !isDraft ? true : false;
  //eslint-disable-next-line
  // console.log({ menu, footer, diggSettings, breadcrumbState, heading, heroBlock });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let clienthost = window?.location?.host || '';

      //if host is run from sandbox, load that environment and disable matomo
      if (clienthost?.includes('sandbox')) {
        setEnv(new Settings_Sandbox());
        //disable matomo
        setMatomoActivated(false);
      }
    }

    document.body.addEventListener('keyup', keyUp);
    document.body.addEventListener('click', click);

    return () => {
      document.body.removeEventListener('keyup', keyUp);
      document.body.removeEventListener('click', click);
    };
  }, []);

  useEffect(() => {
    if (breadcrumb && breadcrumb.length > 0) {
      setBreadcrumb({
        name: heading || name.replace(/{en:|}/g, ''),
        crumbs: breadcrumb,
      });
    }
  }, [breadcrumb, heading]);

  useEffect(() => {
    if (previousPath) {
      asPath.includes('#')
        ? onHash(asPath)
        : skipToContent(undefined, { showFocus: false, includeHeading: true });
    } else {
      asPath.includes('#') && onHash(asPath);
    }
  }, [asPath]);

  useEffect(() => {
    menu && setMenu(menu);
    footer && setFooter(footer);
    diggSettings && setSettings(diggSettings);
  }, [menu, footer, diggSettings]);

  // ? Fetch sharedProps when there is no serverside cache
  useEffect(() => {
    // Define async function
    const fetchSharedProps = async () => {
      const {
        menu: clientFetchedMenu,
        footer: clientFetchedFooter,
        settings: clientFetchedSettings,
      } = await getSharedProps(browserclient, lang);
      clientFetchedMenu && setMenu(clientFetchedMenu);
      clientFetchedFooter && setFooter(clientFetchedFooter);
      clientFetchedSettings && setSettings(clientFetchedSettings);
    };

    // * Only fetch if we have a configured browser apollo client and something is missing
    if (reactenv('APOLLO_URL') && (!menu || !footer || !diggSettings)) {
      fetchSharedProps();
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <SettingsProvider value={{ ...dataportalSettings, env, setBreadcrumb }}>
        <ThemeProvider theme={theme}>
          <LocalStoreProvider>
            <TrackingProvider initalActivation={GetCookiesAccepted() && matomoActivated}>
              <Head>
                <meta
                  name="referrer"
                  content="no-referrer"
                />
                <meta
                  httpEquiv="Content-Security-Policy"
                  content={generateCSP({ nonce: env.nonce })}
                />
                {/* SEO */}
                <title>{title ? `${title} - Sveriges Dataportal` : 'Sveriges dataportal'}</title>
                <meta
                  property="og:title"
                  content={title ? `${title} - Sveriges Dataportal` : 'Sveriges dataportal'}
                />
                <meta
                  name="twitter:title"
                  content={title ? `${title} - Sveriges Dataportal` : 'Sveriges dataportal'}
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
                <meta
                  property="og:image"
                  content={imageUrl}
                />
                <meta
                  name="twitter:image"
                  content={imageUrl}
                />
                <link
                  rel="canonical"
                  href={`${env.CANONICAL_URL}${asPath || ''}`}
                />
                <meta
                  property="og:url"
                  content={`${env.CANONICAL_URL}${asPath || ''}`}
                />
                <meta
                  name="twitter:url"
                  content={`${env.CANONICAL_URL}${asPath || ''}`}
                />
                <meta
                  name="robots"
                  content={`${robotsFollow && allowSEO ? 'follow' : 'nofollow'}, ${
                    robotsIndex && allowSEO ? 'index' : 'noindex'
                  }`}
                />
                <meta
                  name="og:site_name"
                  content={dataportalSettings.siteName || defaultSettings.siteName}
                />
                <meta
                  name="language"
                  content={locale}
                />
                <meta
                  name="og:type"
                  content="website"
                />
                {/* PWA settings */}
                <link
                  rel="icon"
                  href="/favicon.ico"
                />
                <link
                  rel="manifest"
                  href="/manifest.json"
                />
                <meta
                  name="theme-color"
                  content={theme.primary}
                />
                <link
                  rel="apple-touch-icon"
                  href="/images/apple-touch-icon.png"
                />
                <meta
                  name="apple-mobile-web-app-status-bar"
                  content={theme.primary}
                />
                <meta
                  name="theme-color"
                  content="#171A21"
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
              <div
                id="top"
                css={css`
                  display: flex;
                  flex-direction: column;
                  min-height: 100vh;
                  background-color: white;
                `}
              >
                <CookieBanner />
                <SkipToContent text={t('skiptocontent')} />
                <Header
                  menu={menuState}
                  env={env}
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
                        ${fontSize('md')};
                        text-align: center;
                      `}
                    >
                      {dataportalSettings.noScriptContent}
                    </span>
                  </div>
                </noscript>
                <ErrorBoundary>
                  {breadcrumbState.crumbs.length > 0 && <Breadcrumb {...breadcrumbState} />}
                  <main
                    css={css`
                      flex: 1 1 auto;
                    `}
                    className="main"
                  >
                    {heroBlock && <HeroBlock {...heroBlock} />}
                    <Component {...pageProps} />
                  </main>
                </ErrorBoundary>
                <Footer columns={footerState?.columns || []} />
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
  const { menu, footer, settings } = await getSharedProps(client, appContext.router.locale || 'sv');

  const host = absoluteUrl(appContext.ctx.req)?.host;

  return { ...appProps, menu, footer, settings, host };
};

export default Dataportal;
