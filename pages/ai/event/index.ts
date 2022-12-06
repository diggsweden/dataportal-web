import { getPublicationsList, populateSeo } from '../../../utilities';
import ArticleListPage from '../../aktuellt';

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList(['ai'], ['Event'], locale || 'sv', {
    seo: {
      ...populateSeo,
      title: 'AI - Evenemang',
      description: 'Evenemang relaterat till offentlig AI ',
    },
    basePath: `/ai/event`,
    heading: 'Evenemang',
  });
}

export default ArticleListPage;
