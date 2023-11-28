import { PublicationDataFragment } from "../graphql/__generated__/operations";
import { SeoDataFragment } from "../graphql/__generated__/operations";
import {
  DomainAggregateResponse,
  FormResponse,
  ModuleResponse,
  MultiContainerResponse,
  PublicationListResponse,
  PublicationResponse,
  RootAggregateResponse,
} from "./queryHelpers";

export type DataportalPageProps =
  | MultiContainerResponse
  | PublicationListResponse
  | PublicationResponse
  | DomainAggregateResponse
  | RootAggregateResponse
  | FormResponse
  | ModuleResponse;

type ResolvedPage = {
  heroImage?: PublicationDataFragment["image"] | null;
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
      return { seo: props.seo };
    case "DomainAggregate":
      return { seo: props.seo };
    case "MultiContainer":
      return { seo: props.container?.seo, heroImage: props.container?.image };
    case "Publication":
      return { seo: props.seo, heroImage: props.image };
    case "PublicationList":
      return {};
    case "Form":
      return {};
    case "Module":
      return {};
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
