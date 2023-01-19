import { getModule } from "../../../../utilities";
import FortroendeModulePage from "../infor-utveckling";

export async function getStaticProps({ locale }: any) {
  return await getModule('fortroende-uppfoljning', locale);
}

export default FortroendeModulePage;
