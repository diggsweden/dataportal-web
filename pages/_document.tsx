import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { ApolloProvider } from "@apollo/client";
import { client } from "../graphql/client";
import { SettingsUtil } from "../env";
import {
  SettingsProvider,
  defaultSettings,
} from "@/providers/SettingsProvider";
import { LocalStoreProvider } from "@/providers/LocalStoreProvider";
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    const env = SettingsUtil.create();
    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: (App) =>
          function callback(props) {
            return (
              <ApolloProvider client={client}>
                <SettingsProvider value={{ ...defaultSettings, env }}>
                  <LocalStoreProvider>
                    <App {...props} />
                  </LocalStoreProvider>
                </SettingsProvider>
              </ApolloProvider>
            );
          },
        // Useful for wrapping in a per-page basis
        enhanceComponent: (Component) => Component,
      });

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
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
