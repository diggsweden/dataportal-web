import { getDomainAggregate } from "@/utilities";
import { DomainPage } from "@/components/pages/DomainPage";

export async function getStaticProps({ locale }: any) {
  return await getDomainAggregate("data", locale);
}

export default DomainPage;
