import { Form } from "../../../../components";
import { getForm, getModule } from "../../../../utilities";

export async function getStaticProps({ locale }: any) {
  const p1 = await getForm("fortroendemodellen", locale);
  const p2 = await getModule("fortroende-generate-text", locale);
  const [form, module] = await Promise.all([p1, p2]);

  return {
    props: {
      elements: form.props.elements || null,
      module: module?.props?.blocks || null,
    },
    revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60"),
  };

  //return await getForm('fortroendemodellen', locale);
}

export default Form;
