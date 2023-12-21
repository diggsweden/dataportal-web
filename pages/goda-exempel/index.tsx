import { getPublicationsList, populateSeo } from "@/utilities";
import { ListPage } from "@/components/content/ListPage";

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList([], ["Goda exempel"], locale || "sv", {
    seo: {
      ...populateSeo,
      title: "Goda exempel - Sveriges Dataportal",
      description: "Inspirerande exempel relaterat till Data & API:er.",
    },
    basePath: `/goda-exempel`,
    heading: "Goda exempel",
  });
}

export default ListPage;
