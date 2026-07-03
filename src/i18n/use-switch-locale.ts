"use client";

import { useRouter } from "./navigation";
import type { AppLocale } from "./routing";

/** Switch locale and go to the start page (not all content exists in both languages). */
export function useSwitchLocale() {
  const router = useRouter();

  return (locale: AppLocale) => {
    router.replace("/", { locale });
  };
}
