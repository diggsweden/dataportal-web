"use client";

import { type FC, useEffect } from "react";

import type { BreadcrumbProps } from "@/components/navigation/breadcrumbs";
import { useLayoutState } from "@/providers/layout-state-provider";

export const BreadcrumbSetter: FC<BreadcrumbProps> = ({ name, crumbs }) => {
  const { setBreadcrumb } = useLayoutState();

  // `crumbs` is rebuilt on every render (e.g. via `buildBreadcrumb`), so keying
  // the effect on a stable content signature avoids an update loop when the
  // setter re-renders client consumers of the layout-state context.
  const signature = JSON.stringify({ name, crumbs });

  useEffect(() => {
    setBreadcrumb({ name, crumbs });
  }, [signature]);

  return null;
};
