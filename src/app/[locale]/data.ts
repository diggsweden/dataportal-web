import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import { graphql } from "@/graphql/gql";
import type {
  NavigationDataFragment,
  StartPageDataFragment,
} from "@/graphql/gql/graphql";

const NavigationDocument = graphql(`
  query Navigation($filter: dataportal_QueryLocaleArgs) {
    dataportal_Digg_Navigation(filter: $filter) {
      ...NavigationData
    }
  }
`);

const StartPageDocument = graphql(`
  query StartPage($filter: dataportal_QueryLocaleArgs) {
    dataportal_Digg_Start_Page(filter: $filter) {
      ...StartPageData
    }
  }
`);

export interface NavigationResponse {
  type: "Navigation";
  items: NavigationDataFragment[];
}

export const getNavigationData = async (
  locale: string,
): Promise<NavigationResponse> => {
  try {
    const data = await gqlFetch(
      NavigationDocument,
      locale === "all" ? {} : { filter: { locale } },
      { revalidate: 120 },
    );

    const navigationData = data.dataportal_Digg_Navigation;

    return {
      type: "Navigation",
      items: navigationData,
    } as NavigationResponse;
  } catch (error) {
    logGqlError(error);
    return { type: "Navigation", items: [] } as NavigationResponse;
  }
};

export interface StartPageResponse extends StartPageDataFragment {
  type: "StartPage";
}

export const getStartPage = async (
  locale: string,
): Promise<StartPageResponse> => {
  try {
    const data = await gqlFetch(
      StartPageDocument,
      { filter: { locale } },
      { revalidate: 120 },
    );

    const startPage = data.dataportal_Digg_Start_Page;

    return {
      ...startPage,
      type: "StartPage",
    } as StartPageResponse;
  } catch (error) {
    logGqlError(error);
    return {
      type: "StartPage",
    } as StartPageResponse;
  }
};
