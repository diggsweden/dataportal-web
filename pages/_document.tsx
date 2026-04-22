import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

import { LocalStoreProvider } from "@/providers/local-store-provider";
import {
  SettingsProvider,
  defaultSettings,
} from "@/providers/settings-provider";

import { SettingsUtil } from "../env";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    const env = SettingsUtil.create();
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) =>
          function callback(props) {
            return (
              <SettingsProvider value={{ ...defaultSettings, env }}>
                <LocalStoreProvider>
                  <App {...props} />
                </LocalStoreProvider>
              </SettingsProvider>
            );
          },
        enhanceComponent: (Component) => Component,
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
    };
  }

  render() {
    return (
      <Html data-scroll-behavior="smooth">
        <Head nonce={SettingsUtil.getCurrent().nonce}>
          <script
            nonce={SettingsUtil.getCurrent().nonce}
            type="text/javascript"
            src="/__ENV.js"
          />

          <link
            type="text/css"
            rel="stylesheet"
            href="https://cdn.screen9.com/players/amber-player.css"
          ></link>

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
          <meta name="theme-color" content="#FBF2F0" />
        </Head>
        <body className="font-ubuntu text-md text-textPrimary">
          <Main />
          <NextScript nonce={SettingsUtil.getCurrent().nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
