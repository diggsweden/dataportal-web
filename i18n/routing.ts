import { defineRouting } from "next-intl/routing";

/**
 * Shared `next-intl` routing config.
 *
 * `localePrefix: "as-needed"` mirrors the legacy `proxy.ts` behaviour:
 * Swedish URLs stay unprefixed (`/datasets`), English under `/en/...`.
 *
 * `localeDetection: false` matches the legacy `i18n.js`; we never redirect
 * based on the `Accept-Language` header.
 *
 * Localized **pathnames** (e.g. `/data-apier` ↔ `/en/data-apis`) are deferred
 * to the second Phase 3 PR — adding them before any `app/[locale]/...` page
 * exists would rewrite URLs to internal paths with no `page.tsx` to render.
 */
export const routing = defineRouting({
  locales: ["sv", "en"],
  defaultLocale: "sv",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});

export type AppLocale = (typeof routing.locales)[number];

export function isAppLocale(value: string | undefined): value is AppLocale {
  return (
    typeof value === "string" &&
    (routing.locales as readonly string[]).includes(value)
  );
}
