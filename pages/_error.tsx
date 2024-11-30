import { NextPage } from "next";
import NextErrorComponent, { ErrorProps } from "next/error";

import serverLogger from "../utilities/logger";

interface AppErrorProps extends ErrorProps {
  err?: Error;
  hasGetInitialPropsRun?: boolean;
}

/**
 * Server application error page, uses logger instance on server rendering code
 */
const AppError: NextPage<AppErrorProps> = ({
  hasGetInitialPropsRun,
  err,
  statusCode,
}) => {
  if (!hasGetInitialPropsRun && err) {
    let logger = serverLogger.getInstance();
    logger.error([err.message, err.stack]);
  }

  return <NextErrorComponent statusCode={statusCode} />;
};

AppError.getInitialProps = async (ctx) => {
  const errorInitialProps: AppErrorProps =
    await NextErrorComponent.getInitialProps(ctx);
  errorInitialProps.hasGetInitialPropsRun = true;
  if (ctx.err) {
    let logger = serverLogger.getInstance();
    logger.error([ctx.err.message, ctx.err.stack]);

    return errorInitialProps;
  }

  let logger = serverLogger.getInstance();
  logger.error(
    `_error.tsx getInitialProps missing data at path: ${ctx.asPath}`,
  );

  return errorInitialProps;
};

export default AppError;
