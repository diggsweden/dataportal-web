/// <reference types="@digg/design-system/lib/emotion-extention" />
type FlexDirection = "column" | "row";

type MenuItem = {
  link: string;
  name: string;
  order: number;
  pageId: number;
  children: MenuItem[];
};

type DiggStrapiTheme =
  | "brownTheme"
  | "lightBrownTheme"
  | "darkTheme"
  | "grayTheme"
  | "greenTheme"
  | "lightGreenTheme"
  | "orangeTheme"
  | "lightOrangeTheme"
  | "pinkTheme"
  | "lightPinkTheme";

type DiggLink = {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
};

type Breadcrumb = {
  link: DiggLink;
  name: string;
};

type Anchorlink = {
  id: string;
  text: string;
};
interface DataportalSettings {
  siteName: string;
  pageNotFoundHeading: string;
  pageNotFoundText: string;
  noScriptContent: string;
  matomoSiteId: string;
}

declare module "remark-gfm" {
  const content: any;
  export default content;
}

declare module "react-truncate" {
  const content: any;
  export default content;
}

declare module "react-show-more-text";

declare module "fetch-enhanced";

type CSPDirective =
  | "child-src"
  | "connect-src"
  | "default-src"
  | "font-src"
  | "frame-src"
  | "img-src"
  | "manifest-src"
  | "media-src"
  | "object-src"
  | "script-src"
  | "script-src-elem"
  | "script-src-attr"
  | "style-src"
  | "style-src-elem"
  | "style-src-attr"
  | "worker-src"
  | "base-uri"
  | "plugin-types"
  | "sandbox"
  | "form-action"
  | "frame-ancestors"
  | "navigate-to"
  | "report-uri"
  | "report-to"
  | "block-all-mixed-content"
  | "referrer"
  | "require-sri-for"
  | "require-trusted-types-for"
  | "trusted-types"
  | "upgrade-insecure-requests";

type DiggDomain =
  | "offentligai"
  | "data"
  | "oppen-kallkod"
  | "open-source"
  | "datasamverkan";
