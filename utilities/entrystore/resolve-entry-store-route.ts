import type { Entry } from "@entryscape/entrystore-js";

import { SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { getResourceLabel } from "@/i18n/get-resource-label";
import { getTranslations } from "@/i18n/get-translations";
import { isAppLocale, routing } from "@/i18n/routing";
import type { RedirectConfig } from "@/types/global";
import { includeLangInPath } from "../check-lang";
import { EntrystoreService } from "./entrystore.service";

export type ResolveResult =
  | { type: "redirect"; url: string }
  | { type: "resourceUri"; resourceUri: string }
  | { type: "entry"; cid: string; eid: string }
  | { type: "notFound" };

/**
 * Server-side equivalent of `handleEntryStoreRedirect`.
 * Returns a discriminated union instead of calling `router.replace()`.
 * Use with `redirect()` / `notFound()` from `next/navigation` in RSC pages.
 */
export async function resolveEntryStoreRoute(
  config: RedirectConfig,
  locale: string = "sv",
  isSandbox: boolean = false,
  resourceUri?: string,
): Promise<ResolveResult> {
  const env = isSandbox ? new Settings_Sandbox() : SettingsUtil.create();
  const baseUrl = isSandbox ? env.SANDBOX_BASE_URL : env.PRODUCTION_BASE_URL;

  const lang = isAppLocale(locale) ? locale : routing.defaultLocale;
  const [t, resourceLabel] = await Promise.all([
    getTranslations(lang),
    getResourceLabel(lang),
  ]);
  const entrystoreService = EntrystoreService.getInstance({
    baseUrl:
      `https://${env[config.entrystorePathKey]}/store` ||
      "https://admin.dataportal.se/store",
    lang,
    t,
    resourceLabel,
  });

  const param = config.param || null;

  // Handle catch-all routes ([...param])
  if (Array.isArray(param)) {
    const scheme = param[0];
    if (scheme !== "http" && scheme !== "https") {
      return { type: "notFound" };
    }
    const curi = param.slice(1).join("/");
    resourceUri = `${scheme}://${curi}`;
  }
  // Handle regular routes
  else if (param) {
    if (param.includes("_") && /^\d/.test(param)) {
      const ids = param.split("_");
      const eid = ids.pop() || "";
      const cid = ids.join("_");

      try {
        const entry = await entrystoreService.getEntry(cid, eid);
        const entryResourceUri = entry.getResourceURI();

        if (entryResourceUri.startsWith(baseUrl)) {
          return {
            type: "redirect",
            url: `${includeLangInPath(locale)}${config.redirectPath}${entryResourceUri.replace(`${baseUrl}${config.pathPrefix}`, "")}`,
          };
        }
        return { type: "entry", cid, eid };
      } catch {
        return { type: "notFound" };
      }
    }

    // Construct resourceUri from param(s)
    const pathSuffix = config.secondParam
      ? `${param}/${config.secondParam}`
      : param;

    return {
      type: "resourceUri",
      resourceUri: `${baseUrl}${config.pathPrefix}/${pathSuffix}`,
    };
  }

  // Resolve resourceUri to cid_eid redirect
  try {
    const entry: Entry = await entrystoreService.getEntryByResourceURI(
      resourceUri || "",
    );

    if (entry) {
      return {
        type: "redirect",
        url: `${includeLangInPath(locale)}${config.redirectPath}/${entry.getContext().getId()}_${entry.getId()}`,
      };
    }
  } catch (error) {
    console.error("Error fetching entry:", error);
  }

  return { type: "notFound" };
}
