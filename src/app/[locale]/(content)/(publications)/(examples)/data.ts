import type {
  PublicationListOptions,
  PublicationQueryOptions,
} from "@/app/[locale]/(content)/(publications)/types";
import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import { GoodExampleDataFragment as GoodExampleDataDoc } from "@/graphql/fragments";
import { getFragmentData, graphql } from "@/graphql/gql";
import {
  Dataportal_ContainerState,
  type GoodExampleBlockItemFragment,
  type GoodExampleDataFragment,
  type ImageFragment,
  type SeoDataFragment,
} from "@/graphql/gql/graphql";

export const GoodExampleDocument = graphql(`
  query GoodExample($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_Good_Examples(filter: $filter) {
      ...GoodExampleData
    }
  }
`);

export interface GoodExampleResponse extends GoodExampleDataFragment {
  type: "Publication";
  related?: GoodExampleBlockItemFragment[];
  reuse: boolean;
}

export interface GoodExampleListResponse {
  type: "PublicationList";
  heading: string;
  breadcrumb?: string;
  listItems: GoodExampleDataFragment[];
  seo?: SeoDataFragment;
  basePath?: string;
  preamble?: string;
  heroImage?: ImageFragment | null;
}

export const getGoodExamplesList = async (
  locale: string,
  opts?: PublicationListOptions,
): Promise<GoodExampleListResponse> => {
  const { seo, basePath, heading, preamble, heroImage, reuse, breadcrumb } =
    opts || {};
  try {
    const data = await gqlFetch(GoodExampleDocument, {
      filter: {
        locale,
        state: Dataportal_ContainerState.Live,
        limit: 1000,
      },
    });

    const publications = data?.dataportal_Digg_Good_Examples
      ?.map((publication) => getFragmentData(GoodExampleDataDoc, publication))
      .filter((publication) => publication && publication.reuse === reuse);

    if (!publications) {
      console.warn(`No good examples found`);
    }

    return {
      type: "PublicationList",
      listItems: publications || [],
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || "",
      preamble: preamble || null,
      heroImage: heroImage || null,
      breadcrumb: breadcrumb || null,
    } as GoodExampleListResponse;
  } catch (error) {
    logGqlError(error);
    return {
      type: "PublicationList",
      listItems: [],
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || "",
      heroImage: heroImage || null,
      breadcrumb: breadcrumb || null,
    } as GoodExampleListResponse;
  }
};

export const getGoodExample = async (
  slug: string,
  locale: string,
  opts: PublicationQueryOptions = {},
  reuse: boolean = false,
): Promise<GoodExampleResponse | null> => {
  const { state, secret } = opts;
  try {
    const mainPublicationResult = await gqlFetch(GoodExampleDocument, {
      filter: {
        slug,
        limit: 1,
        locale,
        ...(secret ? { previewSecret: secret } : {}),
        ...(state ? { state } : {}),
      },
    });

    const publication = getFragmentData(
      GoodExampleDataDoc,
      mainPublicationResult.dataportal_Digg_Good_Examples[0],
    );

    if (!publication) {
      console.warn(`No good example found with slug: '${slug}'`);
      return null;
    }

    if (
      state !== Dataportal_ContainerState.Preview &&
      publication.reuse !== reuse
    ) {
      console.warn(
        `Access denied: Good example with slug '${slug}' has reuse=${
          publication.reuse
        } but accessed from ${reuse ? "private" : "public"} route`,
      );
      return null;
    }

    const relatedPublicationResult = await gqlFetch(GoodExampleDocument, {
      filter: { limit: 4, locale },
    });

    const relatedPreviews: GoodExampleBlockItemFragment[] =
      relatedPublicationResult.dataportal_Digg_Good_Examples
        ?.map((pub) => getFragmentData(GoodExampleDataDoc, pub))
        .filter(
          (pub): pub is GoodExampleDataFragment =>
            pub !== null && pub.id !== publication.id && pub.reuse === reuse,
        )
        .slice(0, 3)
        .map(toGoodExamplePreview) || [];

    return {
      type: "Publication",
      ...publication,
      related: relatedPreviews,
    } as GoodExampleResponse;
  } catch (error) {
    logGqlError(error);
    return null;
  }
};

export const toGoodExamplePreview = (
  pub: GoodExampleDataFragment,
): GoodExampleBlockItemFragment => {
  if (!pub.heading || !pub.slug || !pub.publishedAt) {
    throw new Error(`Invalid publication data for preview: ${pub.id}`);
  }

  return {
    __typename: "dataportal_Digg_GoodExample_Preview",
    heading: pub.heading,
    slug: pub.slug,
    publishedAt: pub.publishedAt,
    image:
      pub.image?.__typename === "dataportal_Digg_Image"
        ? (pub.image as GoodExampleBlockItemFragment["image"])
        : null,
    keywords: pub.keywords,
    reuse: pub.reuse,
  };
};
