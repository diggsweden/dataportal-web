import { defineRouting } from "next-intl/routing";

/**
 * Shared `next-intl` routing config.
 *
 * `localePrefix: "as-needed"`: Swedish URLs stay unprefixed (`/datasets`),
 * English under `/en/...`.
 *
 * Navigation: use `Link` / `getPathname` from `@/i18n/navigation` (or
 * `AppLink` from `@/components/link`) so locale prefixes are applied
 * automatically — don't hand-roll `includeLangInPath` on `<Link href>`.
 *
 * `localeDetection: false`: we never redirect based on the `Accept-Language`
 * header.
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
