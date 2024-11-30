import { LandingPage } from "@/features/pages/landing-page";
import { getRootAggregate } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  return await getRootAggregate(locale);
}

export default LandingPage;
