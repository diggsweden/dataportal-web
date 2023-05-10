import { useMatomo } from '@datapunt/matomo-tracker-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import {
  ArticleBlock,
  CategoriesNav,
  DevportalBlock,
  Highlight,
  SearchBlock,
  SettingsContext,
} from '../components';
import { client } from '../graphql';
import { NEWS_QUERY } from '../graphql/newsQuery';
import { News, NewsVariables, News_dataportal_v1_Digg_News } from '../graphql/__generated__/News';
import { initBreadcrumb } from './_app';
import dynamic from 'next/dynamic';
import { linkBase } from '../utilities';
import { Container, Heading } from '@digg/design-system';
import { MainContainerStyle } from '../styles/general/emotion';

// * Dynamic imports
const StatisticNumbers = dynamic(() => import('../components/Statistic/StatisticNumbers'));
const StatisticGraph = dynamic(() => import('../components/Statistic/StatisticGraph'));
const Statistic = dynamic(() => import('../components/Statistic/Statistic'));

interface HomeProps {
  articles: News_dataportal_v1_Digg_News[];
}

const Home: React.FC<HomeProps> = ({ articles }) => {
  const { t, lang } = useTranslation('');
  const { setBreadcrumb } = useContext(SettingsContext);
  const { pathname } = useRouter() || {};
  const { trackPageView } = useMatomo();
  useEffect(() => {
    setBreadcrumb && setBreadcrumb(initBreadcrumb);
  }, []);

  useEffect(() => {
    trackPageView({ documentTitle: 'Start' });
  }, [pathname]);

  const newsLink = {
    ...linkBase,
    link: `${lang}/${t('routes|news$path')}`,
    title: t('pages|articles$view-all'),
  };
  const articlesHeading = t('pages|articles$articles');

  return (
    <>
      <SearchBlock />
      <Highlight />
      {lang === 'sv' && (
        <Container cssProp={MainContainerStyle}>
          <ArticleBlock
            articles={articles}
            heading={articlesHeading}
            showMoreLink={newsLink}
            theme="lightOrangeTheme"
          />
        </Container>
      )}
      <DevportalBlock />
      <CategoriesNav />

      <div className="statistic">
        <div className="statistic-header">
          <Heading
            level={2}
            size="xl"
          >
            {' '}
            {t('pages|statistic$statistic-numbers')}
          </Heading>
        </div>

        <div className="statistic-wrapper">
          <StatisticGraph />
          <StatisticNumbers />
        </div>
        <Statistic />
      </div>
    </>
  );
};

export async function getStaticProps({ params, locale }: any) {
  // Get external data from the file system, API, DB, etc.
  const result = await client.query<News, NewsVariables>({
    query: NEWS_QUERY,
    variables: {
      filter: { locale, limit: 3 },
    },
    fetchPolicy: 'no-cache',
  });

  const articles = result && result.data ? result.data.dataportal_v1_Digg_News : [];

  if (result && result.error) {
    console.error(result.error);
  }

  // The value of the `props` key will be
  // passed to the `Home` component
  return {
    props: { articles },
    revalidate: 60,
  };
}

export default Home;
