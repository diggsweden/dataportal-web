"use client";

import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";

import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

/**
 * Sets the breadcrumb state for the locale-scoped 404. Split out as a
 * client island so `app/[locale]/not-found.tsx` can stay a pure RSC (it
 * calls `getTranslations` + `getLocale` from `next-intl/server`).
 */
export function NotFoundBreadcrumb({ name }: { name: string }) {
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();

  useEffect(() => {
    setBreadcrumb?.({
      name,
      crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
    });
  }, [pathname, setBreadcrumb, name]);

  return null;
}
