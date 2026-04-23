import type { NextPage } from "next";
import NextErrorComponent, { type ErrorProps } from "next/error";

interface AppErrorProps extends ErrorProps {
  err?: Error;
  hasGetInitialPropsRun?: boolean;
}

/**
 * Server application error page.
 *
 * The Winston-based logger lives in `utilities/logger.ts` and pulls in
 * Node-only deps (`net`, `tls`, `fs`). Importing it at module scope used
 * to crash the browser bundle under Next 16 / Turbopack (no implicit
 * `resolve.fallback: false`). Logger calls are now `await import(...)`-ed
 * lazily inside `getInitialProps`, which only ever runs on the server.
 */
const AppError: NextPage<AppErrorProps> = ({ statusCode }) => {
  return <NextErrorComponent statusCode={statusCode} />;
};

AppError.getInitialProps = async (ctx) => {
  const errorInitialProps: AppErrorProps =
    await NextErrorComponent.getInitialProps(ctx);
  errorInitialProps.hasGetInitialPropsRun = true;

  // `getInitialProps` runs on both server and client; only load the
  // Winston logger on the server. The `webpackIgnore` / `turbopackIgnore`
  // hints stop the bundler from following this import into the client
  // bundle (Winston pulls in `net`/`tls`/`fs`).
  if (typeof window === "undefined") {
    const { default: ServerLogger } = await import(
      /* webpackIgnore: true */
      /* turbopackIgnore: true */
      "../utilities/logger"
    );
    const logger = ServerLogger.getInstance();

    if (ctx.err) {
      logger.error([ctx.err.message, ctx.err.stack]);
    } else {
      logger.error(
        `_error.tsx getInitialProps missing data at path: ${ctx.asPath}`,
      );
    }
  }

  return errorInitialProps;
};

export default AppError;
