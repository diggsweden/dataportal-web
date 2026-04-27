"use client";

import type { FC } from "react";

import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { useLayoutState } from "@/providers/layout-state-provider";

/**
 * Reads breadcrumb state from `LayoutStateProvider` and renders `<Breadcrumbs>`.
 * Used by hero pages to place breadcrumbs AFTER the hero image instead of
 * above it. The chrome's own breadcrumbs are hidden via CSS
 * `#siteWrapper:has(#Hero) #chrome-breadcrumbs { display: none }` so there
 * is never a double render.
 */
export const LayoutBreadcrumbs: FC = () => {
  const { breadcrumbState } = useLayoutState();

  if (breadcrumbState.crumbs.length === 0) return null;

  return <Breadcrumbs {...breadcrumbState} />;
};
