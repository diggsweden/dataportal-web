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
import start from "@/public/images/startPageHero.png";
import ai from "@/public/images/aiHero.png";
import data from "@/public/images/dataHero.png";
import kallkod from "@/public/images/kallkodHero.png";

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
  parentHeading?: string | null;
  preamble?: string | null;
  heroImage?: PublicationDataFragment["image"] | ImageFragment | null;
  seo?: SeoDataFragment | null;
};

const fallback = (domain: DiggDomain | "/", t: any): ResolvedPage => {
  switch (domain) {
    case "offentligai":
      return {
        heading: t("pages|ai$heading"),
        preamble: t("pages|ai$preamble"),
        heroImage: renderImage(ai),
      };
    case "data":
      return {
        heading: t("pages|data$heading"),
        preamble: t("pages|data$preamble"),
        heroImage: renderImage(data),
      };
    case "oppen-kallkod":
      return {
        heading: t("pages|os$heading"),
        preamble: t("pages|os$preamble"),
        heroImage: renderImage(kallkod),
      };
    case "/":
      return {
        heading: t("pages|startpage$heading"),
        preamble: t("pages|startpage$preamble"),
        heroImage: renderImage(start),
      };
    default:
      return {};
  }
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
  pathname: string,
): ResolvedPage => {
  // @ts-ignore
  if (!props.id && lang === "en") {
    // @ts-ignore
    return fallback(props.domain ? props.domain : pathname, t);
  }

  switch (props.type) {
    case "RootAggregate":
      return {
        seo: props.seo,
        heroImage: props.image,
        heading: props.heading,
        preamble: props.preamble,
      };
    case "DomainAggregate":
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
