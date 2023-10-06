import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { GlobalStyles } from "../styles/GlobalStyles";
import { ApolloProvider } from "@apollo/client";
import {
  LocalStoreProvider,
  SettingsProvider,
  TrackingProvider,
} from "../components";
import { defaultSettings } from "../components/SettingsProvider/SettingsProvider";
import { client } from "../graphql/client";
import {
  CacheProvider,
  createCache,
  createEmotionServer,
  ThemeProvider,
} from "@digg/design-system";
import { SettingsUtil } from "../env";
import { renderToString } from "react-dom/server";
import { dataportalTheme } from "../utilities";

// @ts-ignore
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    const key = "css";
    const cache = createCache({
      key: key,
      nonce: SettingsUtil.getCurrent().nonce,
    });
    const { extractCritical } = createEmotionServer(cache);

    let styles = "";
    let emotionIds: string[] = [];
    const env = SettingsUtil.create();
    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: (App) =>
          function callback(props) {
            const frontend = (
              <ApolloProvider client={client}>
                <SettingsProvider value={{ ...defaultSettings, env }}>
                  <ThemeProvider theme={dataportalTheme}>
                    <LocalStoreProvider>
                      <TrackingProvider initalActivation={false}>
                        <CacheProvider value={cache}>
                          <GlobalStyles theme={dataportalTheme} />
                          <App {...props} />
                        </CacheProvider>
                      </TrackingProvider>
                    </LocalStoreProvider>
                  </ThemeProvider>
                </SettingsProvider>
              </ApolloProvider>
            );
            let { css, ids } = extractCritical(renderToString(frontend));
            styles = css;
            emotionIds = ids;
            return frontend;
          },
        // Useful for wrapping in a per-page basis
        enhanceComponent: (Component) => Component,
      });

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            nonce={SettingsUtil.getCurrent().nonce}
            data-emotion={`${key} ${emotionIds.join(" ")}`}
            dangerouslySetInnerHTML={{ __html: styles }}
          ></style>
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head nonce={SettingsUtil.getCurrent().nonce}>
          <script
            nonce={SettingsUtil.getCurrent().nonce}
            type="text/javascript"
            src="/__ENV.js"
          />
          <link
            href="https://cdn.screen9.com/players/amber-player.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            rel="preload"
            href="/fonts/Ubuntu/Ubuntu-Regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Ubuntu/Ubuntu-Regular.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Ubuntu/Ubuntu-Bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Ubuntu/Ubuntu-Bold.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://editera.dataportal.se"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://admin.dataportal.se"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript nonce={SettingsUtil.getCurrent().nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
