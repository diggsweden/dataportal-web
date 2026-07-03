import type {
  PublicationListOptions,
  PublicationQueryOptions,
} from "@/app/[locale]/(content)/(publications)/types";
import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import { NewsItemDataFragment as NewsItemDataDoc } from "@/graphql/fragments";
import { getFragmentData, graphql } from "@/graphql/gql";
import {
  Dataportal_ContainerState,
  type GoodExampleDataFragment,
  type ImageFragment,
  type NewsBlockItemFragment,
  type NewsItemDataFragment,
  type SeoDataFragment,
} from "@/graphql/gql/graphql";

export const NewsItemDocument = graphql(`
  query NewsItem($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_News_Items(filter: $filter) {
      ...NewsItemData
    }
  }
`);

export interface NewsItemResponse extends NewsItemDataFragment {
  type: "Publication";
  related?: NewsBlockItemFragment[];
}

export interface NewsItemListResponse {
  type: "PublicationList";
  heading: string;
  listItems: NewsItemDataFragment[] | GoodExampleDataFragment[];
  seo?: SeoDataFragment;
  basePath?: string;
  preamble?: string;
  heroImage?: ImageFragment | null;
}

export const getNewsList = async (
  locale: string,
  opts?: PublicationListOptions,
): Promise<NewsItemListResponse> => {
  const { seo, basePath, heading, preamble, heroImage } = opts || {};

  try {
    const data = await gqlFetch(NewsItemDocument, {
      filter: {
        locale,
        state: Dataportal_ContainerState.Live,
        limit: 1000,
      },
    });

    const publications = data?.dataportal_Digg_News_Items;

    if (!publications) {
      console.warn(`No news found`);
    }

    return {
      type: "PublicationList",
      listItems: publications || [],
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || "",
      preamble: preamble || null,
      heroImage: heroImage || null,
    } as NewsItemListResponse;
  } catch (error) {
    logGqlError(error);
    return {
      type: "PublicationList",
      listItems: [],
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || "",
      heroImage: heroImage || null,
    } as NewsItemListResponse;
  }
};

export const getNewsItem = async (
  slug: string,
  locale: string,
  opts: PublicationQueryOptions = {},
): Promise<NewsItemResponse | null> => {
  const { state, secret } = opts;

  try {
    const mainPublicationResult = await gqlFetch(NewsItemDocument, {
      filter: {
        slug,
        limit: 1,
        locale,
        ...(secret ? { previewSecret: secret } : {}),
        ...(state ? { state } : {}),
      },
    });

    const publication = getFragmentData(
      NewsItemDataDoc,
      mainPublicationResult.dataportal_Digg_News_Items[0],
    );

    if (!publication) {
      console.warn(`No news found with slug: '${slug}'`);
      return null;
    }

    const relatedPublicationResult = await gqlFetch(NewsItemDocument, {
      filter: { limit: 4, locale },
    });

    const relatedPreviews: NewsBlockItemFragment[] =
      relatedPublicationResult.dataportal_Digg_News_Items
        ?.map((pub) => getFragmentData(NewsItemDataDoc, pub))
        .filter(
          (pub): pub is NewsItemDataFragment =>
            pub !== null && pub.id !== publication.id,
        )
        .slice(0, 3)
        .map(toNewsPreview) || [];

    return {
      type: "Publication",
      ...publication,
      related: relatedPreviews,
    } as NewsItemResponse;
  } catch (error) {
    logGqlError(error);
    return null;
  }
};

export const toNewsPreview = (
  pub: NewsItemDataFragment,
): NewsBlockItemFragment => {
  if (!pub.heading || !pub.slug || !pub.publishedAt) {
    throw new Error(`Invalid publication data for preview: ${pub.id}`);
  }

  return {
    __typename: "dataportal_Digg_NewsItem_Preview",
    heading: pub.heading,
    slug: pub.slug,
    publishedAt: pub.publishedAt,
    image:
      pub.image?.__typename === "dataportal_Digg_Image"
        ? (pub.image as NewsBlockItemFragment["image"])
        : null,
    keywords: pub.keywords,
  };
};
