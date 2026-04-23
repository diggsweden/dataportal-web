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
import type {
  GoodExampleDataFragment,
  ImageFragment,
  NewsItemDataFragment,
} from "@/graphql/__generated__/operations";
import { initBreadcrumb } from "@/utilities/layout-breadcrumb";

/**
 * Hero image shape — superset of all `pageProps.heroImage` variants returned
 * from `resolvePage(...)` (`utilities/app.ts`). Kept loose so the provider
 * doesn't pin itself to a single fragment.
 */
export type HeroImage =
  | ImageFragment
  | NewsItemDataFragment["image"]
  | GoodExampleDataFragment["image"]
  | null
  | undefined;

export interface LayoutState {
  settingsOpen: boolean;
  setSettingsOpen: Dispatch<SetStateAction<boolean>>;
  openSideBar: boolean;
  setOpenSideBar: Dispatch<SetStateAction<boolean>>;
  imageHero: HeroImage;
  setImageHero: Dispatch<SetStateAction<HeroImage>>;
  breadcrumbState: BreadcrumbProps;
  setBreadcrumb: Dispatch<SetStateAction<BreadcrumbProps>>;
}

const LayoutStateContext = createContext<LayoutState | null>(null);

/**
 * Holds shared layout chrome state: cookie-settings dialog open/closed,
 * sidebar open/closed, hero image, and breadcrumbs. Lives in a single
 * provider so it survives both the legacy `pages/_app.tsx` and the App
 * Router `app/[locale]/layout.tsx` boundary.
 */
export const LayoutStateProvider: FC<{
  children: ReactNode;
  initialBreadcrumb?: BreadcrumbProps;
  initialImageHero?: HeroImage;
}> = ({ children, initialBreadcrumb, initialImageHero }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [imageHero, setImageHero] = useState<HeroImage>(
    initialImageHero ?? null,
  );
  const [breadcrumbState, setBreadcrumb] = useState<BreadcrumbProps>(
    initialBreadcrumb ?? initBreadcrumb,
  );

  const value = useMemo<LayoutState>(
    () => ({
      settingsOpen,
      setSettingsOpen,
      openSideBar,
      setOpenSideBar,
      imageHero,
      setImageHero,
      breadcrumbState,
      setBreadcrumb,
    }),
    [settingsOpen, openSideBar, imageHero, breadcrumbState],
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
