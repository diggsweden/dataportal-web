import React from "react";
import { Dataportal_ContainerState } from "@/graphql/__generated__/types";
import {
  DataportalPageProps,
  getDomainAggregate,
  getMultiContainer,
  getPublication,
  getRootAggregate,
} from "@/utilities";
import { DomainPage } from "@/components/content/DomainPage";
import Page from "../[...containerSlug]";
import { ListPage } from "@/components/content/ListPage";
import { PublicationFull } from "@/components/content/Publication/PublicationFull";
import { ContainerPage } from "@/components/content/ContainerPage";

const getQuery = async (
  slug: string,
  locale: string,
  secret: string,
  isPublication: boolean,
) => {
  if (isPublication)
    return getPublication(slug, locale, {
      state: Dataportal_ContainerState.Preview,
      secret,
      revalidate: false,
    });
  switch (slug) {
    case "/":
      return await getRootAggregate(locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
        revalidate: false,
      });
    case "/offentligai":
      return await getDomainAggregate("offentligai", locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
        revalidate: false,
      });
    case "/data":
      return await getDomainAggregate("data", locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
        revalidate: false,
      });
    case "/oppen-kallkod":
      return await getDomainAggregate("oppen-kallkod", locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
        revalidate: false,
      });
    case "/datasamverkan":
      return await getDomainAggregate("datasamverkan", locale, {
        state: Dataportal_ContainerState.Preview,
        secret,
        revalidate: false,
      });
    default:
      return await getMultiContainer([slug.substring(1)], locale, undefined, {
        state: Dataportal_ContainerState.Preview,
        secret,
        revalidate: false,
      });
  }
};

const render = (props: DataportalPageProps) => {
  switch (props.type) {
    case "DomainAggregate":
      return <DomainPage {...props} />;
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

export const getServerSideProps = async ({ query, locale }: any) => {
  const slug = (query?.slug as string) || "";
  const secret = (query?.secret as string) || "";
  const isPublication = (query?.type as string) === "publication";
  // Get external data from the file system, API, DB, etc.
  return await getQuery(slug, locale || "sv", secret, isPublication);
};

export default Draft;
