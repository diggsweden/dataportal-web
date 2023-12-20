import { getPublicationsList, populateSeo } from "@/utilities";
import { PublicationList } from "@/components/content/PublicationList";
export async function getStaticProps({ locale }: any) {
  return await getPublicationsList(["data"], ["Nyhet"], locale || "sv", {
    seo: {
      ...populateSeo,
      title: "Data & API:er - Nyheter",
      description: "Nyheter relaterat till Data & API:er ",
    },
    basePath: `/data/nyheter`,
    heading: "Nyheter",
  });
}

export default PublicationList;
