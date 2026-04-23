import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

type AppLocale = (typeof routing.locales)[number];

function isAppLocale(value: string | undefined): value is AppLocale {
  return (
    typeof value === "string" &&
    (routing.locales as readonly string[]).includes(value)
  );
}

async function loadMessages(locale: AppLocale) {
  const [common, pages, resources, routes, filters] = await Promise.all([
    import(`../locales/${locale}/common.json`),
    import(`../locales/${locale}/pages.json`),
    import(`../locales/${locale}/resources.json`),
    import(`../locales/${locale}/routes.json`),
    import(`../locales/${locale}/filters.json`),
  ]);

  return {
    common: common.default,
    pages: pages.default,
    resources: resources.default,
    routes: routes.default,
    filters: filters.default,
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  const resolved = await requestLocale;
  const locale = isAppLocale(resolved)
    ? resolved
    : (routing.defaultLocale as AppLocale);

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
