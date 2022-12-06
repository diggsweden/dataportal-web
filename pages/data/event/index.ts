import { getPublicationsList, populateSeo } from '../../../utilities';
import ArticleListPage from '../../aktuellt';

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList(['data'], ['Event'], locale || 'sv', {
    seo: {
      ...populateSeo,
      title: 'Data & API:er - Evenemang',
      description: 'Evenemang relaterat till Data & API:er',
    },
    basePath: `/data/event`,
    heading: 'Evenemang',
  });
}

export default ArticleListPage;
