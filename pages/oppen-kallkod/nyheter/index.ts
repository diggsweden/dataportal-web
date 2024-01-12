import { getPublicationsList, populateSeo } from "@/utilities";
import { ListPage } from "@/components/content/ListPage";

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList(
    ["oppen-kallkod"],
    ["Nyhet"],
    locale || "sv",
    {
      seo: {
        ...populateSeo,
        title: "Öppen källkod - Nyheter",
        description: "Nyheter relaterat till öppen källkod",
      },
      basePath: `/oppen-kallkod/nyheter`,
      heading: "Nyheter",
    },
  );
}

export default ListPage;
