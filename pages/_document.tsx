import Document, {
  type DocumentContext,
  type DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

import { LocalStoreProvider } from "@/providers/local-store-provider";
import {
  defaultSettings,
  SettingsProvider,
} from "@/providers/settings-provider";

import { SettingsUtil } from "../env";

interface MyDocumentInitialProps extends DocumentInitialProps {
  /**
   * Per-request CSP nonce, sourced from the `x-nonce` header set by
   * `proxy.ts`. Stamped onto `<Head>`, `<NextScript>`, and our `/__ENV.js`
   * `<script>` so every Pages Router script matches the `'nonce-…'` in the
   * CSP response header. Falling back to the Settings-generated value
   * keeps test runs (which skip middleware) functional.
   */
  nonce: string;
}

class MyDocument extends Document<MyDocumentInitialProps> {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<MyDocumentInitialProps> {
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

    // `x-nonce` is stamped by `proxy.ts` on the incoming request. We prefer
    // that value over `env.nonce` (a random key minted at `Settings_*`
    // construction time) so Pages Router scripts carry the SAME nonce as
    // the CSP response header the middleware emits. Without this
    // alignment, the intersection of the response-header policy and any
    // legacy `<meta http-equiv>` policy would reject every stamped script.
    const nonce =
      (typeof ctx.req?.headers["x-nonce"] === "string"
        ? ctx.req.headers["x-nonce"]
        : undefined) ?? env.nonce;

    return {
      ...initialProps,
      nonce,
    };
  }

  render() {
    const { nonce } = this.props;

    return (
      <Html data-scroll-behavior="smooth">
        <Head nonce={nonce}>
          <script nonce={nonce} type="text/javascript" src="/__ENV.js" />

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
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
