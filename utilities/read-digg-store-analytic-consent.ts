import type { LocalStore } from "@/providers/local-store-provider";

/** Reads persisted cookie consent for Matomo from `localStorage` (`digg-store`). */
export function readDiggStoreAnalyticConsentAccepted(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const store: LocalStore = JSON.parse(
      localStorage.getItem("digg-store") ?? "{}",
    );
    return store ? store.cookieSettings?.analytic.accepted === true : false;
  } catch {
    return false;
  }
}
