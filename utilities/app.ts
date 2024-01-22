import {
  ImageFragment,
  PublicationDataFragment,
} from "@/graphql/__generated__/operations";
import { SeoDataFragment } from "@/graphql/__generated__/operations";
import {
  DomainAggregateResponse,
  FormResponse,
  ModuleResponse,
  MultiContainerResponse,
  PublicationListResponse,
  PublicationResponse,
  RootAggregateResponse,
} from "@/utilities/queryHelpers";
import { StaticImageData } from "next/image";

export type DataportalPageProps =
  | MultiContainerResponse
  | PublicationListResponse
  | PublicationResponse
  | DomainAggregateResponse
  | RootAggregateResponse
  | FormResponse
  | ModuleResponse;

type ResolvedPage = {
  heading?: string | null;
  preamble?: string | null;
  heroImage?: PublicationDataFragment["image"] | ImageFragment | null;
  seo?: SeoDataFragment | null;
};

/**
 * Resolves different types of api responses into the same format
 *
 * @param {DataportalPageProps} props
 * @returns {ResolvedPage}
 */
export const resolvePage = (props: DataportalPageProps): ResolvedPage => {
  switch (props.type) {
    case "RootAggregate":
      return { seo: props.seo, heroImage: props.image, heading: props.heading };
    case "DomainAggregate":
      return { seo: props.seo, heroImage: props.image, heading: props.heading };
    case "MultiContainer":
      return {
        seo: props.container?.seo,
        heroImage: props.container?.image,
        heading: props.container?.heading,
      };
    case "Publication":
      return {
        seo: props.seo,
        heading: props.heading,
        preamble: props.preamble,
        heroImage: props.image,
      };
    case "PublicationList":
      return {
        seo: props.seo,
        heading: props.heading,
        heroImage: props.heroImage,
      };
    case "Form":
      return {};
    case "Module":
      return { seo: props.seo, heading: props.heading };
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

export const renderImage = (img: StaticImageData): ImageFragment => ({
  __typename: "dataportal_Digg_Image",
  url: img as any,
  name: null,
  alt: null,
  description: null,
  mime: "image/png",
  ext: ".png",
  width: img.width,
  height: img.height,
  screen9: { id: "" }, // just add dummy data to make ts happy
});
