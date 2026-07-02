import type { BreadcrumbProps } from "@/components/navigation/breadcrumbs";
import type { Breadcrumb } from "@/types/global";
import { linkBase } from "@/utilities/route-helpers";

export function buildBreadcrumb(
  name: string,
  parentCrumbs: { name: string; link: string }[],
): BreadcrumbProps {
  const crumbs: Breadcrumb[] = [
    { name: "start", link: { ...linkBase, link: "/" } },
    ...parentCrumbs.map((c) => ({
      name: c.name,
      link: { ...linkBase, link: c.link },
    })),
  ];
  return { name, crumbs };
}
