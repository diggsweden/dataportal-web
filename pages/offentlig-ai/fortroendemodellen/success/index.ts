import { FortroendeEndPage } from "@/components/content/Fortroendemodellen/FortroendeEndPage";
import { getModule } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  return await getModule("fortroende-end-text", locale);
}

export default FortroendeEndPage;
