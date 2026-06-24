import type { BreadcrumbProps } from "@/components/navigation/breadcrumbs";

import { linkBase } from "./route-helpers";

/**
 * Default breadcrumb state used by both `pages/_app.tsx` (legacy) and the
 * App Router `LayoutStateProvider`. Extracted to a single file so both
 * routers stay in sync as the `app/` migration progresses.
 */
export const initBreadcrumb: BreadcrumbProps = {
  name: "",
  crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
};
