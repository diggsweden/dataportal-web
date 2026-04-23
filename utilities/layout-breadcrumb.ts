import { linkBase } from "./route-helpers";

export const initBreadcrumb = {
  name: "",
  crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
};
