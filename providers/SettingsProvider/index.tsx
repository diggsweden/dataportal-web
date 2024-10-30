import React, { useEffect, useState } from "react";
import { EnvSettings, SettingsUtil } from "@/env";
import { BreadcrumbProps } from "@/components/navigation/BreadCrumb";

interface SettingsContext extends DataportalSettings {
  env: EnvSettings;
  setBreadcrumb?: React.Dispatch<React.SetStateAction<BreadcrumbProps>>;
  iconSize: number;
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
  iconSize: 16,
};

export const SettingsContext =
  React.createContext<SettingsContext>(defaultSettings);

export const SettingsProvider: React.FunctionComponent<{
  value: SettingsContext;
  children: React.ReactNode;
}> = ({ value, children }) => {
  const [iconSize, setIconSize] = useState(16);

  useEffect(() => {
    const calculateRemSize = () => {
      const remInPixels = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      setIconSize(remInPixels);
    };
    calculateRemSize();

    window.addEventListener("resize", calculateRemSize);
    return () => window.removeEventListener("resize", calculateRemSize);
  }, []);

  const contextValue = {
    ...value,
    iconSize,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};
