import { getPublicationsList, populateSeo } from '../../../utilities';
import ArticleListPage from '../../aktuellt';

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList(['oppen-kallkod'], ['Nyhet'], locale || 'sv', {
    seo: {
      ...populateSeo,
      title: 'Öppen källkod - Nyheter',
      description: 'Nyheter relaterat till öppen källkod',
    },
    basePath: `/oppen-kallkod/nyheter`,
    heading: 'Nyheter',
  });
}

export default ArticleListPage;
