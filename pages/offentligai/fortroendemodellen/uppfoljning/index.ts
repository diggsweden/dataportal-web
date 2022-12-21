import { getForm } from "../../../../utilities";
import Form from "../fortroende";

export async function getStaticProps({ locale }: any) {
  return await getForm('uppfoljning', locale);
}

export default Form;
