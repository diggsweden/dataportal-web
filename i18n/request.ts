import { getRequestConfig } from "next-intl/server";

import { type AppLocale, isAppLocale, routing } from "./routing";

/**
 * Loads the same five locale namespaces (`common`, `pages`, `resources`,
 * `routes`, `filters`) we use under `next-translate`. Messages keep their
 * legacy `|`/`$` separator keys for now — the second Phase 3 PR will flatten
 * the JSON and codemod every `t()` call site. Until then, App Router code
 * that needs translations should reach into the namespace as a flat map.
 */
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
  const locale: AppLocale = isAppLocale(resolved)
    ? resolved
    : (routing.defaultLocale as AppLocale);

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
