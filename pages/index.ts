import { getRootAggregate } from "@/utilities";
import { LandingPage } from "@/features/pages/landing-page";

export async function getStaticProps({ locale }: any) {
  return await getRootAggregate(locale);
}

export default LandingPage;
