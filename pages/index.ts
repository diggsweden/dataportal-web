import { getStartPage } from "@/utilities";
import { StartPage } from "@/components/content/StartPage";

export async function getStaticProps({ locale }: any) {
  return await getStartPage(locale);
}

export default StartPage;
