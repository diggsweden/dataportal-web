import { getPublicationsList, populateSeo } from '../../../utilities';
import ArticleListPage from '../../aktuellt';

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList(['ai'], ['Nyhet'], locale || 'sv', {
    seo: {
      ...populateSeo,
      title: 'AI - Nyheter',
      description: 'Nyheter relaterat till offentlig AI ',
    },
    basePath: `/ai/nyheter`,
    heading: 'Nyheter',
  });
}

export default ArticleListPage;
