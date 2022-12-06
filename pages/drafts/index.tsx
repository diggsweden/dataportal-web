import React from 'react';
import { dataportal_ContainerState } from '../../graphql/__generated__/globalTypes';
import {
  DataportalPageProps,
  getDomainAggregate,
  getMultiContainer,
  getPublication,
  getRootAggregate,
} from '../../utilities';
import DomainPage from '../oppen-kallkod';
import { ArticleListPage, Publication as PublicationPage } from '../../components/pages/Articles';
import Page from '../[...containerSlug]';

const getQuery = async (slug: string, locale: string, secret: string, isPublication: boolean) => {
  if (isPublication)
    return getPublication(slug, locale, {
      state: dataportal_ContainerState.preview,
      secret,
      revalidate: false,
    });
  switch (slug) {
    case '/':
      return await getRootAggregate(locale, {
        state: dataportal_ContainerState.preview,
        secret,
        revalidate: false,
      });
    case '/ai':
      return await getDomainAggregate('ai', locale, {
        state: dataportal_ContainerState.preview,
        secret,
        revalidate: false,
      });
    case '/data':
      return await getDomainAggregate('data', locale, {
        state: dataportal_ContainerState.preview,
        secret,
        revalidate: false,
      });
    case '/oppen-kallkod':
      return await getDomainAggregate('oppen-kallkod', locale, {
        state: dataportal_ContainerState.preview,
        secret,
        revalidate: false,
      });
    default:
      return await getMultiContainer([slug.substring(1)], locale, undefined, {
        state: dataportal_ContainerState.preview,
        secret,
        revalidate: false,
      });
  }
};

const render = (props: DataportalPageProps) => {
  switch (props.type) {
    case 'DomainAggregate':
      return <DomainPage {...props} />;
    case 'RootAggregate':
      return <DomainPage {...props} />;
    case 'MultiContainer':
      return <Page {...props} />;
    case 'Publication':
      return <PublicationPage {...props} />;
    case 'PublicationList':
      return <ArticleListPage {...props} />;
    default:
      return null;
  }
};

const Draft: React.FC<DataportalPageProps> = (props) => render(props);

export const getServerSideProps = async ({ query, locale }: any) => {
  const slug = (query?.slug as string) || '';
  const secret = (query?.secret as string) || '';
  const isPublication = (query?.type as string) === 'publication';
  // Get external data from the file system, API, DB, etc.
  return await getQuery(slug, locale || 'sv', secret, isPublication);
};

export default Draft;
