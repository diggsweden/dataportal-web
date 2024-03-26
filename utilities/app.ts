import {
  GoodExampleDataFragment,
  ImageFragment,
  NewsItemDataFragment,
} from "@/graphql/__generated__/operations";
import { SeoDataFragment } from "@/graphql/__generated__/operations";
import {
  FormResponse,
  GoodExampleListResponse,
  GoodExampleResponse,
  ModuleResponse,
  MultiContainerResponse,
  NewsItemListResponse,
  NewsItemResponse,
  RootAggregateResponse,
  ToolListResponse,
} from "@/utilities/queryHelpers";

export type DataportalPageProps =
  | MultiContainerResponse
  | NewsItemListResponse
  | NewsItemResponse
  | GoodExampleListResponse
  | GoodExampleResponse
  | RootAggregateResponse
  | FormResponse
  | ModuleResponse
  | ToolListResponse;

type ResolvedPage = {
  heading?: string | null;
  preamble?: string | null;
  heroImage?:
    | GoodExampleDataFragment["image"]
    | NewsItemDataFragment["image"]
    | ImageFragment
    | null;
  seo?: SeoDataFragment | null;
};

/**
 * Resolves different types of api responses into the same format
 *
 * @param {DataportalPageProps} props
 * @returns {ResolvedPage}
 */
export const resolvePage = (
  props: DataportalPageProps,
  lang: string,
  t: any,
): ResolvedPage => {
  if (props.type === "RootAggregate" && lang === "en") {
    return {
      heading: t("pages|startpage$heading"),
      preamble: t("pages|startpage$preamble"),
      heroImage: {
        __typename: "dataportal_Digg_Image",
        url: "/images/startPageHero.png",
        name: null,
        alt: null,
        description: null,
        mime: "image/png",
        ext: ".png",
        width: 1200,
        height: 300,
        screen9: { id: "" },
      },
    };
  }

  switch (props.type) {
    case "RootAggregate":
      return {
        seo: props.seo,
        heroImage: props.image,
        heading: props.heading,
        preamble: props.preamble,
      };
    case "MultiContainer":
      return {
        seo: props.container?.seo,
        heroImage: props.container?.image,
        heading: props.container?.heading,
        preamble: props.container?.preamble,
      };
    case "Publication":
      return {
        seo: props.seo,
        heading: props.heading,
        preamble: props.preamble,
        heroImage: props.image,
      };
    case "ToolList":
      return {
        seo: props.seo,
        heading: props.heading,
        preamble: props.preamble,
        heroImage: props.heroImage,
      };
    case "PublicationList":
      return {
        seo: props.seo,
        heading: props.heading,
        heroImage: props.heroImage,
        preamble: props.preamble,
      };
    case "Form":
      return {};
    case "Module":
      return {
        seo: props.seo,
        heading: props.heading,
      };
    default:
      return {};
  }
};

export const populateSeo: SeoDataFragment = {
  __typename: "dataportal_Digg_SEO",
  lang: "sv",
  title: "",
  description: "",
  image: null,
  robotsFollow: true,
  robotsIndex: true,
};
