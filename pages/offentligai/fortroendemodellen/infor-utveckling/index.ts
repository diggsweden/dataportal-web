import { getForm, getModule } from "../../../../utilities";
import Form from "../fortroende";

export async function getStaticProps({ locale }: any) {
  const p1 = getForm('infor-utveckling', locale);
  const p2 = getModule('fortroende-generate-text', locale);
  const [form, module] = await Promise.all([p1, p2]);

  return {
    props: {
      elements: form.props.elements || null,
      module: module?.props?.blocks || null,
    },
    revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60')
  };
  
  //return await getForm('infor-utveckling', locale);
}

export default Form;
