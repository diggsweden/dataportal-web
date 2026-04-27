"use client";

import { usePathname } from "next/navigation";
import type { FC } from "react";

import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { useLayoutState } from "@/providers/layout-state-provider";

/**
 * Reads breadcrumb state from LayoutState and renders `<Breadcrumbs>`.
 *
 * Each App Router page places this component after `<Hero>` (or at the top
 * when there is no hero) so the visual order matches the Pages Router:
 *   Hero → Breadcrumbs → page content.
 */
export const PageBreadcrumbs: FC = () => {
  const pathname = usePathname();
  const { breadcrumbState } = useLayoutState();

  if (breadcrumbState.crumbs.length === 0 || pathname === "/") return null;

  return <Breadcrumbs {...breadcrumbState} />;
};
