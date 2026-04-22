import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "sv" | "en")) {
    locale = routing.defaultLocale;
  }

  const common = (await import(`@/locales/${locale}/common.json`)).default;
  const pages = (await import(`@/locales/${locale}/pages.json`)).default;
  const routes = (await import(`@/locales/${locale}/routes.json`)).default;
  const filters = (await import(`@/locales/${locale}/filters.json`)).default;

  return {
    locale,
    messages: {
      common,
      pages,
      routes,
      filters,
    },
  };
});
