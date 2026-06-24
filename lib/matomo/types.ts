/**
 * A single command pushed onto the Matomo `_paq` queue, e.g.
 *   ["trackPageView"]
 *   ["trackEvent", category, action, name?, value?]
 *   ["setCustomUrl", url]
 *
 * We keep this loose (variadic) because Matomo's API surface is large and the
 * cost of exhaustively typing it outweighs the benefit. Use the helpers in
 * `./track.ts` for the common cases where tighter types are useful.
 */
export type MatomoCommand = [string, ...unknown[]];

/**
 * Matomo Tag Manager dataLayer. Pushed by the MTM container's own bootstrap;
 * consumers generally shouldn't touch it.
 */
export type MatomoTagManagerEvent = Record<string, unknown>;

declare global {
  interface Window {
    _paq?: MatomoCommand[];
    _mtm?: MatomoTagManagerEvent[];
  }
}
