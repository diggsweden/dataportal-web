"use client";

import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";

import { SettingsContext } from "@/providers/settings-provider";
import type { Breadcrumb } from "@/types/global";
import { linkBase } from "@/utilities";

interface BreadcrumbSetterProps {
  name: string;
  crumbs?: Breadcrumb[];
}

const defaultCrumbs: Breadcrumb[] = [
  { name: "start", link: { ...linkBase, link: "/" } },
];

export function BreadcrumbSetter({ name, crumbs }: BreadcrumbSetterProps) {
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();

  useEffect(() => {
    setBreadcrumb?.({
      name,
      crumbs: crumbs ?? defaultCrumbs,
    });
  }, [pathname]);

  return null;
}
