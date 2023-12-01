import { FortroendeModulePage } from "../../../../components/Form/FortroendeModellen/FortroendeModulePage";
import { getModule } from "../../../../utilities";

export async function getStaticProps({ locale }: any) {
  return await getModule("fortroende-infor-utveckling", locale);
}

export default FortroendeModulePage;
