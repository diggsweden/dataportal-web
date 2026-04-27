"use client";

import { usePathname } from "next/navigation";

import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { useLayoutState } from "@/providers/layout-state-provider";

export const ChromeBreadcrumbs = () => {
  const pathname = usePathname();
  const { breadcrumbState } = useLayoutState();

  if (breadcrumbState.crumbs.length === 0 || pathname === "/") return null;

  return <Breadcrumbs {...breadcrumbState} />;
};
