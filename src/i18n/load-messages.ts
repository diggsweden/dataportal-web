/**
 * Shared loaders for the locale JSON files.
 *
 * Two shapes are exposed because the data splits along a boundary that
 * `next-intl` cares about:
 *
 *   - `loadLocaleMessages` returns the four "message tree" namespaces
 *     (`common`, `pages`, `routes`, `filters`). These are handed to
 *     `NextIntlClientProvider` / `createTranslator` and therefore must not
 *     contain keys with reserved characters (`.`, `:`, `/`, etc.) — any
 *     such key triggers `INVALID_KEY` at load time.
 *
 *   - `loadResourceLabels` returns the flat URI → label map from
 *     `resources.json`. Those keys are URIs (`http://…`) and would blow
 *     up `next-intl`'s validator, so the map is delivered through its own
 *     React context (`ResourcesProvider`) and consumed via
 *     `useResourceLabel` / `getResourceLabel` instead of `t()`.
 *
 * Consumers:
 *   - `i18n/request.ts` (App Router `next-intl` plugin)
 *   - `i18n/get-translations.ts` + `i18n/get-resource-label.ts`
 *     (server-side helpers for non-component contexts)
 */

export type LocaleMessages = {
  common: Record<string, unknown>;
  pages: Record<string, unknown>;
  routes: Record<string, unknown>;
  filters: Record<string, unknown>;
};

export type ResourceMap = Record<string, string>;

export async function loadLocaleMessages(
  locale: string,
): Promise<LocaleMessages> {
  const [common, pages, routes, filters] = await Promise.all([
    import(`../locales/${locale}/common.json`),
    import(`../locales/${locale}/pages.json`),
    import(`../locales/${locale}/routes.json`),
    import(`../locales/${locale}/filters.json`),
  ]);

  return {
    common: common.default,
    pages: pages.default,
    routes: routes.default,
    filters: filters.default,
  };
}

export async function loadResourceLabels(locale: string): Promise<ResourceMap> {
  const mod = await import(`../locales/${locale}/resources.json`);
  return mod.default as ResourceMap;
}
