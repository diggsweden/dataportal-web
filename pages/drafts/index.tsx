import { ParsedUrlQuery } from "querystring";

import React from "react";

import { ContainerPage } from "@/features/pages/container-page";
import { ListPage } from "@/features/pages/list-page";
import { PublicationFull } from "@/features/publication/publication-full";
import { Dataportal_ContainerState } from "@/graphql/__generated__/types";
import {
  DataportalPageProps,
  getGoodExample,
  getMultiContainer,
  getNewsItem,
  getRootAggregate,
} from "@/utilities";

import { Page } from "../[...containerSlug]";

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
      revalidate: false,
    });
  }

  if (type === "good-example") {
    return await getGoodExample(slug, locale, {
      state: Dataportal_ContainerState.Preview,
      secret,
      revalidate: false,
    });
  }

  switch (slug) {
    case "/":
      return await getRootAggregate(locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
        revalidate: false,
      });
    default:
      return await getMultiContainer([slug.substring(1)], locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
        revalidate: false,
      });
  }
};

const render = (props: DataportalPageProps) => {
  switch (props.type) {
    case "RootAggregate":
      return <ContainerPage {...props} />;
    case "MultiContainer":
      return <Page {...props} />;
    case "Publication":
      return <PublicationFull {...props} />;
    case "PublicationList":
      return <ListPage {...props} />;
    default:
      return null;
  }
};

const Draft: React.FC<DataportalPageProps> = (props) => render(props);

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
  // Get external data from the file system, API, DB, etc.
  return await getQuery(slug, locale || "sv", secret, type);
};

export default Draft;
