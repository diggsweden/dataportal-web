import { getRootAggregate } from '../utilities';
import DomainPage from './oppen-kallkod';

export async function getStaticProps({ params, locale }: any) {
  return await getRootAggregate(locale);
}

export default DomainPage;
