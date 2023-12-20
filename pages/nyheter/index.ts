import { PublicationList } from "@/components/publications/PublicationList";
import { getPublicationsList, populateSeo } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList([], ["Nyhet"], locale || "sv", {
    seo: {
      ...populateSeo,
      title: "Nyheter",
    },
    basePath: `/nyheter`,
    heading: "Nyheter",
  });
}

export default PublicationList;
