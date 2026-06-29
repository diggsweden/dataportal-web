"use client";

import { type FC, useEffect } from "react";

import type { BreadcrumbProps } from "@/components/navigation/breadcrumbs";
import { useLayoutState } from "@/providers/layout-state-provider";

export const BreadcrumbSetter: FC<BreadcrumbProps> = ({ name, crumbs }) => {
  const { setBreadcrumb } = useLayoutState();

  useEffect(() => {
    setBreadcrumb({ name, crumbs });
  }, [name, crumbs]);

  return null;
};
