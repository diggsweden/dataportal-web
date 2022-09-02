import { ArticlePage } from '../../../components/pages/Articles';
import { client } from '../../../graphql';
import { NEWS_QUERY } from '../../../graphql/newsQuery';
import { News, NewsVariables } from '../../../graphql/__generated__/News';

export async function getStaticProps({ params, locale }: any) {
  // Get external data from the file system, API, DB, etc.
  const { nid } = params;
  const result = await client.query<News, NewsVariables>({
    query: NEWS_QUERY,
    variables: {
      filter: { locale, limit: 1, id: parseInt((nid as string) || '-1') },
    },
    fetchPolicy: 'no-cache',
  });

  const news = result && result.data ? result.data.dataportal_Digg_News[0] : {};
  const revalidate = parseInt(process.env.REVALIDATE_INTERVAL || '60');

  if (result && result.error) {
    console.error(result.error);
  }

  if (!news) {
    console.warn(`No news found with id: ${nid}`);
    return {
      notFound: true,
      revalidate,
    };
  }

  // The value of the `props` key will be
  //  passed to the `Page` component
  return {
    props: { ...news },
    revalidate,
  };
}

export async function getStaticPaths({ locales }: { locales: string[] }) {
  const paths: any[] = [];
  // await Promise.all(
  //   // create static paths for all locales
  //   locales.map(async (locale) => {
  //     // Get external data from the file system, API, DB, etc.
  //     const result = await client.query<News, NewsVariables>({
  //       query: NEWS_QUERY,
  //       variables: { filter: { locale } },
  //     });

  //     const containers = result?.data?.dataportal_Digg_News;

  //     if (result?.error) {
  //       console.error(result?.error);
  //     }

  //     containers &&
  //       containers.map((c) => {
  //         paths.push({ params: { nid: c?.id, name: c?.slug.replace('/', '') }, locale });
  //       });
  //   })
  // );

  return {
    paths,
    fallback: 'blocking',
  };
}

export default ArticlePage;
