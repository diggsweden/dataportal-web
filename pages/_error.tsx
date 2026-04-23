import type { NextPage } from "next";
import NextErrorComponent, { type ErrorProps } from "next/error";

interface AppErrorProps extends ErrorProps {
  err?: Error;
  hasGetInitialPropsRun?: boolean;
}

/**
 * Global error page. Must not import `utilities/logger` (Winston / Node-only)
 * at module scope — Turbopack would pull it into the client bundle and fail on
 * `fs` / `dgram` / etc.
 */
const AppError: NextPage<AppErrorProps> = ({
  hasGetInitialPropsRun,
  err,
  statusCode,
}) => {
  if (!hasGetInitialPropsRun && err) {
    console.error(err.message, err.stack);
  }

  return <NextErrorComponent statusCode={statusCode} />;
};

AppError.getInitialProps = async (ctx) => {
  const errorInitialProps: AppErrorProps =
    await NextErrorComponent.getInitialProps(ctx);
  errorInitialProps.hasGetInitialPropsRun = true;
  if (ctx.err) {
    console.error(ctx.err.message, ctx.err.stack);

    return errorInitialProps;
  }

  console.error(
    `_error.tsx getInitialProps missing data at path: ${ctx.asPath}`,
  );

  return errorInitialProps;
};

export default AppError;
