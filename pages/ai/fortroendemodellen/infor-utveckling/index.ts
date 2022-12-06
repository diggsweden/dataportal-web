import { getForm } from "../../../../utilities";
import Form from "../fortroende";

export async function getStaticProps({ locale }: any) {
  return await getForm('infor-utveckling', locale);
}

export default Form;
