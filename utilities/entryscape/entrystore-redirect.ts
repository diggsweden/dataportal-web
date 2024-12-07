import { EntryStore, EntryStoreUtil } from "@entryscape/entrystore-js";
import { GetServerSidePropsContext } from "next";

import { SettingsUtil } from "@/env";

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
  const { locale, params } = context;
  const env = SettingsUtil.create();

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
    if (/\d/.test(param) && param.includes("_")) {
      return { props: {} };
    }

    // Construct resourceUri based on number of parameters
    const baseUrl = env[config.entrystorePathKey].includes("sandbox")
      ? "https://www-sandbox.dataportal.se"
      : "https://dataportal.se";

    const pathSuffix =
      config.secondParamName && params?.[config.secondParamName]
        ? `${param}/${params[config.secondParamName]}` // Two params
        : param; // Single param

    resourceUri = `${baseUrl}${config.pathPrefix}/${pathSuffix}`;
  }

  try {
    const es = new EntryStore(
      `https://${env[config.entrystorePathKey]}/store` ||
        "https://admin.dataportal.se/store",
    );
    const esu = new EntryStoreUtil(es);

    const entry = await esu.getEntryByResourceURI(resourceUri || "");

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
