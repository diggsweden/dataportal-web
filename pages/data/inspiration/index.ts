import { getPublicationsList, populateSeo } from "@/utilities";
import { PublicationList } from "@/components/content/PublicationList";

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList(["data"], ["Goda exempel"], locale || "sv", {
    seo: {
      ...populateSeo,
      title: "Data & API:er - Inspiration",
      description: "Inspirerande exempel relaterat till Data & API:er ",
    },
    basePath: `/data/inspiration`,
    heading: "Inspiration",
  });
}

export default PublicationList;
