/// <reference types="@digg/design-system/lib/emotion-extention" />

import { ComponentType } from "react";

import { Dataportal_LinkType } from "@/graphql/__generated__/types";

export type FlexDirection = "column" | "row";

type AddIcon = ComponentType<{
  className?: string;
  width?: number;
  height?: number;
  viewBox?: string;
}>;

type MenuItem = {
  link: string;
  name: string;
  order: number;
  pageId: number;
  children: MenuItem[];
};

export type DiggStrapiTheme =
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

export type DiggLink = {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: Dataportal_LinkType;
  description: string | null;
};

export type Breadcrumb = {
  link: DiggLink;
  name: string;
};

export type Anchorlink = {
  id: string;
  text: string;
};

export interface DataportalSettings {
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

export type CSPDirective =
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
