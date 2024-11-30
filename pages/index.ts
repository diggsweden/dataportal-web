import { LandingPage } from "@/features/pages/landing-page";
import { getRootAggregate } from "@/utilities";

export async function getStaticProps({ locale }: { locale: string }) {
  return await getRootAggregate(locale);
}

export default LandingPage;
