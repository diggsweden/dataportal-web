import { getRootAggregate } from "@/utilities";
import { LandingPage } from "@/components/content/LandingPage";

export async function getStaticProps({ locale }: any) {
  return await getRootAggregate(locale);
}

export default LandingPage;
