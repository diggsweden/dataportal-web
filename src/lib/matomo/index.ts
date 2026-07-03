export {
  type MatomoContextValue,
  MatomoProvider,
  type MatomoProviderProps,
  useMatomo,
} from "./matomo-provider";
export { pushMatomoCommand, trackEvent, trackPageView } from "./track";
export type { MatomoCommand } from "./types";
