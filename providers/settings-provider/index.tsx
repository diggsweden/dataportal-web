import {
  useEffect,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  FC,
  ReactNode,
} from "react";

import { BreadcrumbProps } from "@/components/navigation/breadcrumbs";
import { EnvSettings, SettingsUtil } from "@/env";
import { DataportalSettings } from "@/types/global";

interface SettingsContextProps extends DataportalSettings {
  noScriptContent: string;
  env: EnvSettings;
  setBreadcrumb?: Dispatch<SetStateAction<BreadcrumbProps>>;
  iconSize: number;
  siteName: string;
  pageNotFoundHeading: string;
  pageNotFoundText: string;
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

export const defaultSettings: SettingsContextProps = {
  env: SettingsUtil.getDefault(),
  siteName: "Sveriges Dataportal",
  pageNotFoundHeading: "",
  pageNotFoundText: "",
  noScriptContent: "",
  matomoSiteId: "-1",
  iconSize: 16,
};

export const SettingsContext =
  createContext<SettingsContextProps>(defaultSettings);

export const SettingsProvider: FC<{
  value: SettingsContextProps;
  children: ReactNode;
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
