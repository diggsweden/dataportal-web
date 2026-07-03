import type { QueryOptions } from "@/app/[locale]/(content)/[...containerSlug]/data";
import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import { graphql } from "@/graphql/gql";
import {
  type ContainerDataFragment,
  Dataportal_ContainerState,
  type GoodExampleDataFragment,
  type NewsItemDataFragment,
} from "@/graphql/gql/graphql";

const RootAggregateDocument = graphql(`
  query RootAggregate($locale: String!, $state: dataportal_ContainerState!) {
    container: dataportal_Digg_Containers(
      filter: { limit: 1, slug: "/", locale: $locale, state: $state }
    ) {
      ...ContainerData
    }
    news: dataportal_Digg_News_Items(
      filter: { limit: 3, locale: $locale, state: $state }
    ) {
      ...NewsItemData
    }
    examples: dataportal_Digg_Good_Examples(
      filter: { limit: 3, locale: $locale, state: $state }
    ) {
      ...GoodExampleData
    }
  }
`);

export interface RootAggregateResponse extends ContainerDataFragment {
  type: "RootAggregate";
  news?: NewsItemDataFragment;
  examples?: GoodExampleDataFragment;
}

export const getRootAggregate = async (
  locale: string,
  opts: QueryOptions = {},
): Promise<RootAggregateResponse> => {
  const { state, secret } = opts;

  try {
    const data = await gqlFetch(RootAggregateDocument, {
      locale,
      state: state || Dataportal_ContainerState.Live,
      ...(secret ? { previewSecret: secret } : {}),
    });

    const container = data ? data.container[0] : undefined;

    if (!container) {
      console.warn(`No container found with slug: '/'`);
    }

    const news = data.news?.[0] ?? undefined;
    const examples = data.examples?.[0] ?? undefined;

    return {
      ...container,
      type: "RootAggregate",
      news,
      examples,
    } as RootAggregateResponse;
  } catch (error) {
    logGqlError(error);
    return {
      type: "RootAggregate",
    } as RootAggregateResponse;
  }
};
