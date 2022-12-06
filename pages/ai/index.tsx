import { getDomainAggregate } from '../../utilities';
import DomainPage from '../oppen-kallkod';

export async function getStaticProps({ locale }: any) {
  return await getDomainAggregate('ai', locale);
}

export default DomainPage;
