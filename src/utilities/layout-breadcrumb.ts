import type { BreadcrumbProps } from "@/components/navigation/breadcrumbs";

import { linkBase } from "./route-helpers";

/** Default breadcrumb state used by `LayoutStateProvider`. */
export const initBreadcrumb: BreadcrumbProps = {
  name: "",
  crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
};
