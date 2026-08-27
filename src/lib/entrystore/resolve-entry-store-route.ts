import type { Entry } from "@entryscape/entrystore-js";

import { SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { getResourceLabel } from "@/i18n/get-resource-label";
import { getTranslations } from "@/i18n/get-translations";
import { isAppLocale, routing } from "@/i18n/routing";
import type { RedirectConfig } from "@/types/global";
import { includeLangInPath } from "@/utilities/check-lang";
import { EntrystoreService } from "./entrystore.service";

export type ResolveResult =
  | { type: "redirect"; url: string }
  | { type: "resourceUri"; resourceUri: string }
  | { type: "entry"; cid: string; eid: string }
  | { type: "notFound" };

/**
 * Resolves an EntryStore route to a discriminated union describing what the
 * caller should do. Use with `redirect()` / `notFound()` from
 * `next/navigation` in RSC pages.
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
    env,
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
    // `cid_eid`, e.g. `182_147` or `sniDemo_22`. Context ids are not always
    // numeric, so key off the entry id (always numeric) rather than the first
    // character of the whole segment.
    const separator = param.lastIndexOf("_");
    const eid = separator > 0 ? param.slice(separator + 1) : "";
    if (/^\d+$/.test(eid)) {
      const cid = param.slice(0, separator);

      try {
        const entry = await entrystoreService.getEntry(cid, eid);
        const entryResourceUri = entry.getResourceURI();

        // Only redirect in-store URIs; external-URI pages render directly.
        if (config.redirectPath && entryResourceUri.startsWith(baseUrl)) {
          return {
            type: "redirect",
            url: `${includeLangInPath(locale)}${config.redirectPath}${entryResourceUri.replace(`${baseUrl}${config.pathPrefix ?? ""}`, "")}`,
          };
        }
        return { type: "entry", cid, eid };
      } catch {
        return { type: "notFound" };
      }
    }

    // A resourceUri can only be built when the page declares a pathPrefix.
    if (!config.pathPrefix) return { type: "notFound" };

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

    if (entry && config.redirectPath) {
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
