import { getDomainAggregate } from "@/utilities";
import { DomainPage } from "@/components/content/DomainPage";

export async function getStaticProps({ locale }: any) {
  return await getDomainAggregate("datasamverkan", locale);
}

export default DomainPage;
