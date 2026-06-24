import type { ParsedUrlQuery } from "node:querystring";

import type { FC } from "react";

import { ContainerPage } from "@/features/pages/container-page";
import { LandingPage } from "@/features/pages/landing-page";
import { PublicationFull } from "@/features/publication/publication-full";
import { Dataportal_ContainerState } from "@/graphql/__generated__/types";
import {
  type DataportalPageProps,
  getGoodExample,
  getMultiContainer,
  getNewsItem,
  getRootAggregate,
  type MultiContainerResponse,
} from "@/utilities";

const getQuery = async (
  slug: string,
  locale: string,
  secret: string,
  type: string,
) => {
  if (type === "news-item") {
    return await getNewsItem(slug, locale, {
      state: Dataportal_ContainerState.Preview,
      secret,
    });
  }

  if (type === "good-example") {
    return await getGoodExample(slug, locale, {
      state: Dataportal_ContainerState.Preview,
      secret,
    });
  }

  switch (slug) {
    case "/":
      return await getRootAggregate(locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
      });
    default:
      return await getMultiContainer([slug.substring(1)], locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
      });
  }
};

const render = (props: DataportalPageProps) => {
  switch (props.type) {
    case "RootAggregate":
      return <ContainerPage {...props} />;
    case "MultiContainer": {
      const { container, related } = props as MultiContainerResponse;
      if (!container) return null;
      return container.landingPage ? (
        <LandingPage {...container} />
      ) : (
        <ContainerPage {...container} related={related} />
      );
    }
    case "Publication":
      return <PublicationFull {...props} />;
    // We don't have a preview for list pages
    // case "PublicationList":
    //   return <ListPage {...props} />;
    default:
      return null;
  }
};

const Draft: FC<DataportalPageProps> = (props) => render(props);

export const getServerSideProps = async ({
  query,
  locale,
}: {
  query: ParsedUrlQuery;
  locale: string;
}) => {
  const slug = (query?.slug as string) || "";
  const secret = (query?.secret as string) || "";
  const type = query?.type as string;
  const result = await getQuery(slug, locale || "sv", secret, type);
  if (!result) return { notFound: true as const };
  return { props: result as DataportalPageProps };
};

export default Draft;
