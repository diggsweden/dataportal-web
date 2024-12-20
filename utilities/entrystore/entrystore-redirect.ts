import { GetServerSidePropsContext } from "next";
import getT from "next-translate/getT";

import { SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";

import { EntrystoreService } from "./entrystore.service";

type RedirectConfig = {
  pathPrefix: string;
  redirectPath: "/concepts" | "/specifications" | "/terminology";
  entrystorePathKey: "ENTRYSCAPE_TERMS_PATH" | "ENTRYSCAPE_SPECS_PATH";
  paramName?: string;
  secondParamName?: string;
};

export async function handleEntryStoreRedirect(
  context: GetServerSidePropsContext,
  config: RedirectConfig,
  resourceUri?: string,
) {
  const { locale, params, req } = context;
  const isSandbox = req?.headers.host?.includes("sandbox");
  const env = isSandbox ? new Settings_Sandbox() : SettingsUtil.create();
  const t = await getT(locale || "sv", "pages");
  const entrystoreService = EntrystoreService.getInstance({
    baseUrl:
      `https://${env[config.entrystorePathKey]}/store` ||
      "https://admin.dataportal.se/store",
    lang: locale || "sv",
    t,
  });

  const baseUrl = env[config.entrystorePathKey].includes("sandbox")
    ? "https://www-sandbox.dataportal.se"
    : "https://dataportal.se";

  // Handle catch-all routes ([...param])
  const param = params?.[config.paramName || ""];
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
    if (!param.includes("_") && !/^\d/.test(param)) {
      // Construct resourceUri based on number of parameters
      const pathSuffix =
        config.secondParamName && params?.[config.secondParamName]
          ? `${param}/${params[config.secondParamName]}` // Two params
          : param; // Single param

      resourceUri = `${baseUrl}${config.pathPrefix}/${pathSuffix}`;
      return {
        props: {
          resourceUri,
        },
      };
    } else if (param.includes("_") && /^\d/.test(param)) {
      const ids = param.split("_");
      const eid = ids.pop() || "";
      const cid = ids.join("_");

      const entry = await entrystoreService.getEntry(cid, eid);
      const resourceUri = entry.getResourceURI();

      if (resourceUri.startsWith(baseUrl)) {
        return {
          redirect: {
            destination: `/${locale}${config.redirectPath}${resourceUri.replace(
              `${baseUrl}${config.pathPrefix}`,
              "",
            )}`,
            permanent: true,
          },
        };
      } else {
        return { props: {} };
      }
    }
  }

  try {
    const entry = await entrystoreService.getEntryByResourceURI(
      resourceUri || "",
    );

    if (entry) {
      return {
        redirect: {
          destination: `/${locale}${config.redirectPath}/${entry
            .getContext()
            .getId()}_${entry.getId()}`,
          permanent: true,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching entry:", error);
  }

  return { notFound: true };
}
