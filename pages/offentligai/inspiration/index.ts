import { getPublicationsList, populateSeo } from "@/utilities";
import { ListPage } from "@/components/content/ListPage";

export async function getStaticProps({ locale }: any) {
  return await getPublicationsList(
    ["offentligai"],
    ["Goda exempel"],
    locale || "sv",
    {
      seo: {
        ...populateSeo,
        title: "AI - Inspiration",
        description: "Inspirerande exempel relaterat till offentlig AI ",
      },
      basePath: `/offentligai/inspiration`,
      heading: "Inspiration",
    },
  );
}

export default ListPage;
