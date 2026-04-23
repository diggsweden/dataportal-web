import type { Dataportal_LinkType } from "@/graphql/__generated__/types";
import type { Breadcrumb, DiggLink } from "@/types/global";

/**
 * Make @param str URL-friendly
 * @param str eg "detta är en rubrik - 1"
 */
export const slugify = (str: string) => {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  if (!str) return "";

  return str
    .toString()
    .toLowerCase()
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\s]+/g, "") // Remove all non-word characters (but preserve spaces)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

// Used to satisfy typescript condition for DiggLink
export const linkBase: DiggLink = {
  __typename: "dataportal_Digg_Link",
  linktype: "INTERNAL" as Dataportal_LinkType,
  link: "",
  title: "",
  description: "",
};

/**
 * Takes the url path and parses it to breadcrumbs
 *
 * @param {string} path url path to the current resource
 * @param {string} inactiveCrumbName the title of the current resource ex the h1
 * @returns {BreadcrumbProps} BreadcrumbProps to use for settings breadcrumb
 */
export const makeBreadcrumbsFromPath = (path: string) => {
  const paths = path.split("/");
  paths.shift();
  const crumbs: Breadcrumb[] = [
    { name: "start", link: { ...linkBase, link: "/" } },
  ];

  const basePath: string[] = [];

  paths.map((path, index) => {
    if (index !== paths.length - 1) {
      crumbs.push({
        name: path.replaceAll("-", " "),
        link: {
          ...linkBase,
          link: `${index === 0 ? "/" : `${basePath.join("")}/`}${path}`,
        },
      });
      basePath.push(`/${path}`);
    }
  });

  return crumbs;
};
