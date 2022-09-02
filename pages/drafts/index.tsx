import { GetServerSideProps } from 'next';
import React from 'react';
import { client, CONTAINER_QUERY } from '../../graphql';
import { NEWS_QUERY } from '../../graphql/newsQuery';
import {
  Containers,
  ContainersVariables,
  Containers_dataportal_Digg_Containers,
} from '../../graphql/__generated__/Containers';
import { dataportal_ContainerState } from '../../graphql/__generated__/globalTypes';
import { News, NewsVariables, News_dataportal_Digg_News } from '../../graphql/__generated__/News';
import ArticlePage from '../news/[nid]';
import { Page } from '../[...containerSlug]';

const isContainer = (
  unknown: News_dataportal_Digg_News | Containers_dataportal_Digg_Containers
): unknown is Containers_dataportal_Digg_Containers => {
  return unknown.__typename === 'dataportal_Digg_Container';
};

const Draft: React.FC<News_dataportal_Digg_News | Containers_dataportal_Digg_Containers> = (page) =>
  isContainer(page) ? <Page {...page} /> : <ArticlePage {...page} />;

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const slug = (query?.slug as string) || '';
  const secret = (query?.secret as string) || '';
  const isNews = (query?.type as string) === 'news';
  // Get external data from the file system, API, DB, etc.
  const result = await client.query<Containers | News, ContainersVariables | NewsVariables>({
    query: isNews ? NEWS_QUERY : CONTAINER_QUERY,
    variables: {
      filter: {
        slug,
        limit: 1,
        locale,
        previewSecret: secret,
        state: dataportal_ContainerState.preview,
      },
    },
    fetchPolicy: 'no-cache',
  });

  const getPage = (data: Containers | News) =>
    isNews
      ? (data as News).dataportal_Digg_News[0]
      : (data as Containers).dataportal_Digg_Containers[0];

  const page = result && result.data ? getPage(result.data) : undefined;

  if (result && result.error) {
    console.error(result.error);
  }

  if (!page) {
    console.warn(`No page found with slug: ${slug}`);
    return {
      notFound: true,
    };
  }

  // The value of the `props` key will be
  //  passed to the `Page` component
  return {
    props: { ...page },
  };
};

export default Draft;
