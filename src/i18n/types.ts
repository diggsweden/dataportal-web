import type { useTranslations } from "next-intl";

/**
 * Translation function passed into helpers and class components that can't
 * call hooks themselves. Tracks the exact return type of `useTranslations()`
 * with the default (top-level) namespace, so callers get full autocomplete
 * and typo-checking against the augmented `Messages` shape in
 * `i18n/messages.d.ts`. The explicit `<never>` generic is required — without
 * it TypeScript defers resolution and widens the key type to `string`.
 */
export type Translate = ReturnType<typeof useTranslations<never>>;

/**
 * Flat URI → label lookup function returned by `useResourceLabel` and
 * `getResourceLabel`. Extracted as a named type so helper signatures stay
 * readable without importing the hook itself.
 */
export type ResourceLabel = (uri: string) => string;
