import { FormPage } from "@/components/content/FormPage";
import { getForm, getModule, populateSeo } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  const p1 = await getForm("fortroendemodellen", locale);
  const p2 = await getModule("fortroende-generate-text", locale, {
    seo: {
      ...populateSeo,
      title: "Förtroendemodellen utveckling",
      description:
        "Vid genomförande av delen “Utveckling” kan en märkning fås, som kan användas utåt för att visa att förtroendemodellen använts.",
    },
    heading: "Förtroendemodellen utveckling",
  });
  const [form, module] = await Promise.all([p1, p2]);

  return {
    props: {
      elements: form.props.elements || null,
      module: module?.props?.blocks || null,
      heading: module?.props?.heading || null,
    },
    revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60"),
  };

  //return await getForm('fortroendemodellen', locale);
}

export default FormPage;
