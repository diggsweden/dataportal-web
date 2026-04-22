import { Entry } from "@entryscape/entrystore-js";
import { getTranslations } from "next-intl/server";

import { SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { RedirectConfig } from "@/types/global";

import { EntrystoreService } from "./entrystore.service";
import { includeLangInPath } from "../check-lang";

interface RouterLike {
  replace: (url: string) => void;
}

export async function handleEntryStoreRedirect(
  config: RedirectConfig,
  router: RouterLike,
  locale: string = "sv",
  isSandbox: boolean = false,
  resourceUri?: string,
) {
  const env = isSandbox ? new Settings_Sandbox() : SettingsUtil.create();
  const baseUrl = isSandbox ? env.SANDBOX_BASE_URL : env.PRODUCTION_BASE_URL;

  const t = await getTranslations({ locale, namespace: "pages" });
  const entrystoreService = EntrystoreService.getInstance({
    baseUrl:
      `https://${env[config.entrystorePathKey]}/store` ||
      "https://admin.dataportal.se/store",
    lang: locale || "sv",
    t: t as any,
  });

  // Handle catch-all routes ([...param])
  const param = config.param || null;
  if (Array.isArray(param)) {
    const scheme = param[0];
    if (scheme !== "http" && scheme !== "https") {
      return { notFound: true };
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

      const entry = await entrystoreService.getEntry(cid, eid);
      const resourceUri = entry.getResourceURI();

      if (resourceUri.startsWith(baseUrl)) {
        router.replace(
          `${includeLangInPath(locale)}${
            config.redirectPath
          }${resourceUri.replace(`${baseUrl}${config.pathPrefix}`, "")}`,
        );
        return;
      } else {
        return { props: {} };
      }
    } else {
      // Construct resourceUri based on number of parameters
      const pathSuffix = config.secondParam
        ? `${param}/${config.secondParam}` // Two params
        : param; // Single param

      resourceUri = `${baseUrl}${config.pathPrefix}/${pathSuffix}`;
      return {
        resourceUri,
      };
    }
  }

  try {
    const entry: Entry = await entrystoreService.getEntryByResourceURI(
      resourceUri || "",
    );

    if (entry) {
      router.replace(
        `${includeLangInPath(locale)}${config.redirectPath}/${entry
          .getContext()
          .getId()}_${entry.getId()}`,
      );
      return;
    }
  } catch (error) {
    console.error("Error fetching entry:", error);
  }

  return { notFound: true };
}
