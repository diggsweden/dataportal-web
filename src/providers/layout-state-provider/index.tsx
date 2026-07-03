"use client";

import {
  createContext,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

import type { BreadcrumbProps } from "@/components/navigation/breadcrumbs";
import { initBreadcrumb } from "@/utilities/layout-breadcrumb";

export interface LayoutState {
  settingsOpen: boolean;
  setSettingsOpen: Dispatch<SetStateAction<boolean>>;
  openSideBar: boolean;
  setOpenSideBar: Dispatch<SetStateAction<boolean>>;
  breadcrumbState: BreadcrumbProps;
  setBreadcrumb: Dispatch<SetStateAction<BreadcrumbProps>>;
}

const LayoutStateContext = createContext<LayoutState | null>(null);

/**
 * Holds shared layout chrome state: cookie-settings dialog open/closed,
 * sidebar open/closed, and breadcrumbs. Lives in a single provider mounted
 * at the `app/[locale]/layout.tsx` boundary.
 */
export const LayoutStateProvider: FC<{
  children: ReactNode;
  initialBreadcrumb?: BreadcrumbProps;
}> = ({ children, initialBreadcrumb }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [breadcrumbState, setBreadcrumb] = useState<BreadcrumbProps>(
    initialBreadcrumb ?? initBreadcrumb,
  );

  const value = useMemo<LayoutState>(
    () => ({
      settingsOpen,
      setSettingsOpen,
      openSideBar,
      setOpenSideBar,
      breadcrumbState,
      setBreadcrumb,
    }),
    [settingsOpen, openSideBar, breadcrumbState],
  );

  return (
    <LayoutStateContext.Provider value={value}>
      {children}
    </LayoutStateContext.Provider>
  );
};

export function useLayoutState(): LayoutState {
  const ctx = useContext(LayoutStateContext);
  if (!ctx) {
    throw new Error("useLayoutState must be used within <LayoutStateProvider>");
  }
  return ctx;
}
