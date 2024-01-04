import { PublicationList } from "@/components/content/Publication/PublicationList";
import { getPublicationsList } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList([], [], locale || "sv");
}

export default PublicationList;
