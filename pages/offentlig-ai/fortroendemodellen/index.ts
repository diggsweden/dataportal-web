import { FortroendeIntroPage } from "@/components/content/Fortroendemodellen/FortroendeIntroPage";
import { getModule } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  return await getModule("fortroendemodellen", locale);
}

export default FortroendeIntroPage;
