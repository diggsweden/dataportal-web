import { FortroendeModulePage } from "@/components/content/Fortroendemodellen/FortroendeModulePage";
import { getModule } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  return await getModule("fortroende-infor-utveckling", locale);
}

export default FortroendeModulePage;
