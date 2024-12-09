import { StartPage } from "@/features/pages/start-page";
import { getStartPage } from "@/utilities";

export async function getStaticProps({ locale }: { locale: string }) {
  return await getStartPage(locale);
}

export default StartPage;
