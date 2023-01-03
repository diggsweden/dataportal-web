import { Form } from "../../../../components";
import { getForm, getModule } from "../../../../utilities";

export async function getStaticProps({ locale }: any) {
  const p1 = await getForm('fortroendemodellen', locale);
  const p2 = await getModule('fortroende-generate-text', locale);
  const [form, module] = await Promise.all([p1, p2]);
  return {
    props: {
      elements: form.props.elements,
      module: module?.props?.blocks || null,
    },
  };

  //return await getForm('fortroendemodellen', locale);
}

export default Form;
