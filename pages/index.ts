import { getRootAggregate } from "../utilities";
import DomainPage from "./oppen-kallkod";

export async function getStaticProps({ locale }: any) {
  return await getRootAggregate(locale);
}

export default DomainPage;
