/**
 * Type-safe `t()` keys for `next-intl`.
 *
 * Augments the `AppConfig` interface so every `useTranslations()` / `getTranslations()`
 * call site is autocompleted and typo-checked against the Swedish reference files.
 *
 * Four of the five namespaces participate:
 *
 *   - `common`, `pages`, `filters`: real translation copy.
 *   - `routes`: routing config, still reached via `t("routes.xxx.path")` today
 *     for localized URL slugs. It'll move to a dedicated `pathnames` module in
 *     Phase 4; at that point drop it here and the remaining callers will
 *     surface as type errors to guide the migration.
 *   - `resources`: URI-keyed, bypasses the dot-path resolver entirely through
 *     `useResourceLabel` / `getResourceLabel`. Intentionally omitted.
 *
 * The default locale (Swedish) is the source of truth for key shape; English is
 * validated against it at runtime by `next-intl`'s fallback machinery and at
 * review-time by diffing the two files.
 */

import type common from "../locales/sv/common.json";
import type filters from "../locales/sv/filters.json";
import type pages from "../locales/sv/pages.json";
import type routes from "../locales/sv/routes.json";

import type { routing } from "./routing";

declare module "use-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: {
      common: typeof common;
      pages: typeof pages;
      filters: typeof filters;
      routes: typeof routes;
    };
  }
}
