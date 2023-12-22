import { getRootAggregate } from "../utilities";
import { DomainPage } from "@/components/content/DomainPage";

export async function getStaticProps({ locale }: any) {
  return await getRootAggregate(locale);
}

export default DomainPage;
