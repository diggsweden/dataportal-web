import { Form } from "../../../../components";
import { getForm } from "../../../../utilities";

export async function getStaticProps({ locale }: any) {
  return await getForm('fortroendemodellen', locale);
}

export default Form;
