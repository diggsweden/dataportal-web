import { getRequestConfig } from "next-intl/server";

import { loadLocaleMessages } from "./load-messages";
import { type AppLocale, isAppLocale, routing } from "./routing";

/**
 * App Router entry point for `next-intl`. Delegates to the shared
 * `loadLocaleMessages` loader.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const resolved = await requestLocale;
  const locale: AppLocale = isAppLocale(resolved)
    ? resolved
    : (routing.defaultLocale as AppLocale);

  return {
    locale,
    messages: await loadLocaleMessages(locale),
    // Global default for all date/time formatters. Dataportal.se is a
    // Swedish public-sector site, so Stockholm time is the right default.
    // Without this, `use-intl` throws `ENVIRONMENT_FALLBACK` from server
    // renders of any component that calls `useTranslations`.
    timeZone: "Europe/Stockholm",
  };
});
