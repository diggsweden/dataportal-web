import { defineRouting } from "next-intl/routing";

/**
 * Shared routing config for `next-intl` middleware and (later) `createNavigation`.
 *
 * `localePrefix: "as-needed"` keeps Swedish URLs unprefixed (`/datasets`) and
 * English under `/en/...`, matching the legacy `proxy.ts` behaviour.
 *
 * Localized **pathnames** (e.g. `/data-apier` ↔ `/en/data-apis`) are deferred
 * until App Router pages live under `app/[locale]/...`; adding `pathnames`
 * before that would rewrite URLs to internal paths that have no `page.tsx`
 * yet.
 */
export const routing = defineRouting({
  locales: ["sv", "en"],
  defaultLocale: "sv",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});
