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
    heroImage: {
      __typename: "dataportal_Digg_Image",
      width: 1920,
      height: 400,
      url: "/images/goodExamplesHero.png",
      alt: "Goda exempel",
      name: "goodExamplesHero.png",
      description: null,
      mime: "image/png",
      ext: null,
      screen9: null,
    },
  });
}

export default ListPage;
