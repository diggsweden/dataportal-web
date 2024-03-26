import React from "react";
import { EnvSettings, SettingsUtil } from "@/env";
import { BreadcrumbProps } from "@/components/navigation/BreadCrumb";

interface SettingsContext extends DataportalSettings {
  env: EnvSettings;
  setBreadcrumb?: React.Dispatch<React.SetStateAction<BreadcrumbProps>>;
}
export const extractSettings = (diggSettings: {
  items: { key: string; value: string }[];
}): DataportalSettings => {
  return {
    siteName:
      diggSettings?.items?.find((s) => s?.key === "sitename")?.value ||
      defaultSettings.siteName,
    pageNotFoundHeading:
      diggSettings?.items?.find((s) => s?.key === "pageNotFoundHeading")
        ?.value || "",
    pageNotFoundText:
      diggSettings?.items?.find((s) => s?.key === "pageNotFoundText")?.value ||
      "",
    noScriptContent:
      diggSettings?.items?.find((s) => s?.key === "noScriptContent")?.value ||
      "",
    matomoSiteId:
      diggSettings?.items?.find((s) => s?.key === "matomoSiteId")?.value || "",
  };
};

export const defaultSettings: SettingsContext = {
  env: SettingsUtil.getDefault(),
  siteName: "Sveriges Dataportal",
  pageNotFoundHeading: "",
  pageNotFoundText: "",
  noScriptContent: "",
  matomoSiteId: "-1",
};

export const SettingsContext =
  React.createContext<SettingsContext>(defaultSettings);

export const SettingsProvider: React.FunctionComponent<{
  value: SettingsContext;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
