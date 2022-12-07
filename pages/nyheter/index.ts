import { ArticleListPage } from '../../components/pages/Articles';
import { client } from '../../graphql';
import { NEWS_QUERY } from '../../graphql/newsQuery';
import { News, NewsVariables } from '../../graphql/__generated__/News';

export async function getStaticProps({ params, locale }: any) {
  // Get external data from the file system, API, DB, etc.
  const result = await client.query<News, NewsVariables>({
    query: NEWS_QUERY,
    variables: {
      filter: { locale, limit: 9999 },
    },
    fetchPolicy: 'no-cache',
  });

  const newsList = result && result.data ? result.data.dataportal_v1_Digg_News : [];

  if (result && result.error) {
    console.error(result.error);
  }

  // The value of the `props` key will be
  //  passed to the `Page` component
  return {
    props: { newsList },
    revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60'),
  };
}
export default ArticleListPage;
