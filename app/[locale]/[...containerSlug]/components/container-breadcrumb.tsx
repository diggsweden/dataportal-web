"use client";

import { usePathname } from "next/navigation";
import { type FC, useContext, useEffect } from "react";

import type { ContainerDataFragment } from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

type ContainerBreadcrumbProps = Pick<
  ContainerDataFragment,
  "heading" | "parent"
>;

/**
 * Client island that syncs a container/landing page breadcrumb into
 * `SettingsContext` (start crumb + an optional parent crumb). Split out so
 * the pages themselves can stay server components.
 */
export const ContainerBreadcrumb: FC<ContainerBreadcrumbProps> = ({
  heading,
  parent,
}) => {
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();

  useEffect(() => {
    const crumbs = [{ name: "start", link: { ...linkBase, link: "/" } }];
    if (parent?.heading && parent.slug) {
      crumbs.push({
        name: parent.heading,
        link: { ...linkBase, link: parent.slug },
      });
    }

    setBreadcrumb?.({
      name: heading,
      crumbs: crumbs,
    });
  }, [pathname]);

  return null;
};
