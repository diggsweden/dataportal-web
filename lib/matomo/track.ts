import type { MatomoCommand } from "./types";

function push(command: MatomoCommand) {
  if (typeof window === "undefined") return;
  window._paq = window._paq ?? [];
  window._paq.push(command);
}

export function trackPageView(url?: string) {
  if (url) push(["setCustomUrl", url]);
  push(["trackPageView"]);
}

export function trackEvent(
  category: string,
  action: string,
  name?: string,
  value?: number,
) {
  push(["trackEvent", category, action, name, value]);
}

export { push as pushMatomoCommand };
