import { getPublicationsList, populateSeo } from "@/utilities";
import { ListPage } from "@/components/content/ListPage";

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList(
    ["oppen-kallkod"],
    ["Goda exempel"],
    locale || "sv",
    {
      seo: {
        ...populateSeo,
        title: "Öppen källkod - Inspiration",
        description: "Inspirerande exempel relaterat till öppen källkod",
      },
      basePath: `/oppen-kallkod/inspiration`,
      heading: "Inspiration",
    },
  );
}

export default ListPage;
