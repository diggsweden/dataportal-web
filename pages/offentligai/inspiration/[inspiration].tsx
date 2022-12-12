import { GetStaticPaths } from 'next/types';
import { Publication } from '../../../components/pages/Articles';
import { getPublication } from '../../../utilities';

export const getStaticProps = async ({ params, locale }: any) => {
  const slug = ('/' + params?.inspiration) as string;
  return await getPublication(slug, locale || 'sv', { domain: 'offentligai', revalidate: true });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  return {
    paths,
    fallback: 'blocking',
  };
};

export default Publication;
