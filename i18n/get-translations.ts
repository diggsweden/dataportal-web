import { createTranslator, type Locale } from "next-intl";

import { loadLocaleMessages } from "./load-messages";
import type { Translate } from "./types";

/**
 * Server-side translator for Pages Router data-loading functions
 * (`getServerSideProps`, `getInitialProps`, route handlers) where React
 * hooks — and therefore `next-intl`'s `useTranslations` — aren't available.
 *
 * Delegates to `next-intl`'s `createTranslator` so the returned function is
 * structurally identical to `useTranslations()` (supports `.rich`, `.raw`,
 * `.has`, ICU interpolation and fallback behaviour).
 *
 * For the `resources` namespace (URI-keyed, dots inside segments) use
 * `getResourceLabel` instead.
 */
export async function getTranslations(locale: Locale): Promise<Translate> {
  const messages = await loadLocaleMessages(locale);
  return createTranslator({ locale, messages });
}
