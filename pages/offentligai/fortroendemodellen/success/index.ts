import { FortroendeEndPage } from "../../../../components/Form/FortroendeModellen/FortroendeEndPage";
import { getModule } from "../../../../utilities";

export async function getStaticProps({ locale }: any) {
  return await getModule("fortroende-end-text", locale);
}

export default FortroendeEndPage;
