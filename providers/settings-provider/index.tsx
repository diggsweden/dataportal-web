"use client";

import {
  createContext,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { BreadcrumbProps } from "@/components/navigation/breadcrumbs";
import { type EnvSettings, SettingsUtil } from "@/env";
import type { DataportalSettings } from "@/types/global";

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
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
