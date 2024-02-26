import { getDomainAggregate } from "@/utilities";
import { LandingPage } from "@/components/content/LandingPage";

export async function getStaticProps({ locale }: any) {
  return await getDomainAggregate("datasamverkan", locale);
}

export default LandingPage;
