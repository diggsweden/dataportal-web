import { getForm, getModule } from "../../../../utilities";
import Form from "../fortroende";

export async function getStaticProps({ locale }: any) {
  const p1 = await getForm('uppfoljning', locale);
  const p2 = await getModule('fortroende-generate-text', locale);
  const [form, module] = await Promise.all([p1, p2]);
  return {
    props: {
      elements: form.props.elements || null,
      module: module?.props?.blocks || null,
    },
  };

  //return await getForm('uppfoljning', locale);
}

export default Form;
